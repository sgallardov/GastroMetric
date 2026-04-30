# main.py
import time
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from database import engine, Base, get_db, SessionLocal 
from typing import List
import models, seed, schemas

# ==========================================
# 1. LÓGICA DE INICIALIZACIÓN (Resiliencia)
# ==========================================

def init_db():
    """
    Intenta conectar con PostgreSQL. Si la DB está arrancando (en Docker),
    reintenta 5 veces antes de fallar. Luego crea tablas y corre el seed.
    """
    retries = 5
    while retries > 0:
        try:
            print(f"🔄 Intentando conectar a la DB... (Intentos restantes: {retries})")
            # Crea las tablas físicas en Postgres basándose en models.py
            models.Base.metadata.create_all(bind=engine)
            
            # Ejecuta el sembrado de datos iniciales (Roles, Categorías, etc.)
            db = SessionLocal()
            try:
                seed.seed_data(db)
            finally:
                db.close()
            
            print("✅ Conexión exitosa y base de datos preparada.")
            break
        except OperationalError:
            retries -= 1
            print("⏳ La base de datos aún no está lista. Esperando 3 segundos...")
            time.sleep(3)
    if retries == 0:
        print("❌ No se pudo conectar a la base de datos después de varios intentos.")

# Arrancamos la DB al cargar el script
init_db()

app = FastAPI(
    title="GastroMetric API",
    description="Backend para el sistema de gestión de restaurantes",
    version="1.0.0"
)

# ==========================================
# Configuración de CORS (Cross-Origin Resource Sharing)
# ==========================================
# Esto permite que tu frontend y los de tu grupo puedan hacer peticiones a esta API
# sin ser bloqueados por el navegador por políticas de seguridad.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes de cualquier origen (URL). En producción, aquí se ponen los dominios permitidos.
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos los headers en las peticiones
)

# ==========================================
# 2. ENDPOINTS DE SALUD (Health Checks)
# ==========================================

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "proyecto": "GastroMetric POS",
        "db_status": "Conectada y Poblada"
    }

@app.get("/check-db")
def check_db(db: Session = Depends(get_db)):
    """Verifica si los roles básicos existen en la DB."""
    try:
        roles = db.query(models.Rol).all()
        return {
            "status": "OK",
            "roles_encontrados": [r.desc_rol for r in roles]
        }
    except Exception as e:
        return {"status": "Error", "detalle": str(e)}

# ==========================================
# 3. MÓDULO DE PRODUCTOS Y CATEGORÍAS
# ==========================================

@app.get("/categorias/", response_model=List[schemas.CategoriaResponse])
def listar_categorias(db: Session = Depends(get_db)):
    """Retorna las categorías para organizar el menú en el frontend."""
    return db.query(models.Categoria).all()

@app.post("/categorias/", response_model=schemas.CategoriaResponse)
def crear_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva categoría para organizar el menú (Ej: 'Vinos', 'Postres').
    """
    nueva_categoria = models.Categoria(**categoria.model_dump())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

@app.get("/productos/", response_model=List[schemas.ProductoResponse])
def listar_productos(db: Session = Depends(get_db)):
    """Devuelve la lista completa de productos para mostrar en el inventario."""
    return db.query(models.Producto).all()

@app.post("/productos/", response_model=schemas.ProductoResponse)
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    """Crea un producto verificando que su categoría exista."""
    categoria = db.query(models.Categoria).filter(models.Categoria.id_categoria == producto.categoria_id_categoria).first()
    if not categoria:
        raise HTTPException(status_code=400, detail="Categoría no encontrada")

    nuevo_producto = models.Producto(**producto.model_dump())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

# ==========================================
# 4. MÓDULO DE USUARIOS Y ROLES
# ==========================================

@app.get("/usuarios/", response_model=List[schemas.UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    """Trae la lista de todos los empleados registrados."""
    return db.query(models.Usuario).all()

@app.post("/usuarios/", response_model=schemas.UsuarioResponse)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    """Crea un empleado (Garzón, Cocinero o Admin)."""
    # Verificamos si el nombre de usuario ya existe
    existe = db.query(models.Usuario).filter(models.Usuario.nombre_usuario == usuario.nombre_usuario).first()
    if existe:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso.")
    
    nuevo_usuario = models.Usuario(**usuario.model_dump())
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

# ==========================================
# 5. MÓDULO DE MESAS Y OPERACIÓN
# ==========================================

@app.get("/mesas/", response_model=List[schemas.MesaResponse])
def listar_mesas(db: Session = Depends(get_db)):
    """Vital para pintar el mapa de mesas (Verde/Rojo)."""
    return db.query(models.Mesa).all()

@app.post("/mesas/", response_model=schemas.MesaResponse)
def crear_mesa(mesa: schemas.MesaCreate, db: Session = Depends(get_db)):
    """Permite registrar una nueva mesa física en el local."""
    # Validar si el número de mesa ya existe
    existe = db.query(models.Mesa).filter(models.Mesa.numero_mesa == mesa.numero_mesa).first()
    if existe:
        raise HTTPException(status_code=400, detail="El número de mesa ya está registrado.")
        
    nueva_mesa = models.Mesa(**mesa.model_dump())
    db.add(nueva_mesa)
    db.commit()
    db.refresh(nueva_mesa)
    return nueva_mesa

@app.put("/mesas/{id_mesa}", response_model=schemas.MesaResponse)
def actualizar_estado_mesa(id_mesa: int, estado_id: int, db: Session = Depends(get_db)):
    """Cambia el estado de una mesa (Ej: Pasar de 'Ocupada' a 'Sucia')."""
    mesa = db.query(models.Mesa).filter(models.Mesa.id_mesa == id_mesa).first()
    if not mesa:
        raise HTTPException(status_code=404, detail="Mesa no encontrada")
    
    mesa.estado_mesa_id_estmes = estado_id
    db.commit()
    db.refresh(mesa)
    return mesa

# ==========================================
# 6. MÓDULO TRANSACCIONAL (Ventas)
# ==========================================

@app.post("/mesas/{mesa_id}/abrir", response_model=schemas.PedidoResponse)
def abrir_mesa(mesa_id: int, db: Session = Depends(get_db)):
    """
    Abre la cuenta de una mesa específica.
    Por regla de negocio, el backend asigna automáticamente el estado "Pendiente".
    """
    # 1. Verificamos que la mesa física exista en el restaurante
    mesa = db.query(models.Mesa).filter(models.Mesa.id_mesa == mesa_id).first()
    if not mesa:
        raise HTTPException(status_code=404, detail="La mesa no existe.")
        
    # Verificar si ya tiene un pedido pendiente
    pedido_activo = db.query(models.Pedido).filter(
        models.Pedido.mesa_id_mesa == mesa_id,
        models.Pedido.estado_pago_id_estpag == 2
    ).first()
    if pedido_activo:
        raise HTTPException(status_code=400, detail="La mesa ya está abierta.")
    
    # 2. Creamos el pedido forzando el estado Pendiente (2)
    nuevo_pedido = models.Pedido(
        mesa_id_mesa=mesa_id,
        estado_pago_id_estpag=2  # Controlado 100% por el backend
    )
    
    # 3. Regla automática: Si abro un pedido, la mesa pasa a "Ocupada" (ID 2)
    mesa.estado_mesa_id_estmes = 2
    
    # 4. Guardamos todo en la base de datos
    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)
    
    return nuevo_pedido

@app.get("/mesas/{mesa_id}/cuenta", response_model=schemas.PedidoResponse)
def obtener_resumen_cuenta(mesa_id: int, db: Session = Depends(get_db)):
    """
    Trae el resumen completo de una mesa: qué productos ha pedido, 
    las cantidades y el estado de pago gracias a las relaciones de SQLAlchemy.
    """
    pedido = db.query(models.Pedido).filter(
        models.Pedido.mesa_id_mesa == mesa_id,
        models.Pedido.estado_pago_id_estpag == 2
    ).first()
    
    if not pedido:
        raise HTTPException(status_code=404, detail="La mesa no tiene una cuenta abierta.")
        
    return pedido

@app.post("/mesas/{mesa_id}/productos", response_model=schemas.DetallePedidoResponse)
def agregar_item_a_mesa(mesa_id: int, item: schemas.DetallePedidoCreate, db: Session = Depends(get_db)):
    """
    Agrega un producto a la cuenta de la mesa, descuenta stock y congela el precio actual.
    """
    # 1. Buscar la cuenta abierta de la mesa
    pedido = db.query(models.Pedido).filter(
        models.Pedido.mesa_id_mesa == mesa_id,
        models.Pedido.estado_pago_id_estpag == 2
    ).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="La mesa no tiene una cuenta abierta.")

    # 2. Validar producto y stock
    producto = db.query(models.Producto).filter(models.Producto.id_producto == item.producto_id_producto).first()
    if not producto or producto.stock_producto < item.cantidad_detped:
        raise HTTPException(status_code=400, detail="Producto no encontrado o Stock insuficiente.")

    # 3. Transacción: Crear detalle congelando el precio actual
    nuevo_detalle = models.DetallePedido(
        pedido_id_pedido=pedido.id_pedido,
        producto_id_producto=item.producto_id_producto,
        cantidad_detped=item.cantidad_detped,
        precio_detped=producto.precio_producto, 
        estado_cocina_id_estcoc=1 # Pendiente por defecto
    )
    
    # 4. Bajar stock
    producto.stock_producto -= item.cantidad_detped
    
    try:
        db.add(nuevo_detalle)
        db.commit()
        db.refresh(nuevo_detalle)
        # CRÍTICO: Este return es el que soluciona el ResponseValidationError (input: None)
        return nuevo_detalle
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar el detalle: {str(e)}")

@app.get("/mesas/{mesa_id}/checkout", response_model=schemas.CheckoutResponse)
def calcular_checkout_mesa(mesa_id: int, db: Session = Depends(get_db)):
    """
    Calcula el subtotal, IVA (19%) y propina sugerida (10%) para una mesa abierta.
    """
    # 1. Buscar la mesa
    mesa = db.query(models.Mesa).filter(models.Mesa.id_mesa == mesa_id).first()
    if not mesa:
        raise HTTPException(status_code=404, detail="La mesa no existe.")
        
    # 2. Buscar el pedido activo de la mesa (estado de pago 2 = Pendiente)
    pedido = db.query(models.Pedido).filter(
        models.Pedido.mesa_id_mesa == mesa_id,
        models.Pedido.estado_pago_id_estpag == 2
    ).first()
    
    if not pedido:
        raise HTTPException(status_code=400, detail="La mesa no tiene pedidos pendientes.")
        
    # 3. Calcular el subtotal sumando (precio * cantidad) de cada detalle
    # IMPORTANTE: Se ignoran los ítems con estado de cocina 4 ("Cancelado")
    subtotal = 0
    for detalle in pedido.detalles:
        if detalle.estado_cocina_id_estcoc != 4:
            subtotal += (detalle.precio_detped * detalle.cantidad_detped)
        
    # 4. Calcular IVA (19%)
    iva = subtotal * 0.19
    
    # 5. Calcular propina sugerida (10%)
    propina_sugerida = subtotal * 0.10
    
    # 6. Calcular total final
    total = subtotal + iva + propina_sugerida
    
    return {
        "pedido_id": pedido.id_pedido,
        "mesa_id": mesa.id_mesa,
        "subtotal": subtotal,
        "iva": iva,
        "propina_sugerida": propina_sugerida,
        "total": total
    }

# ==========================================
# 7. MÓDULO DE AUDITORÍA Y CANCELACIONES
# ==========================================

@app.post("/mesas/{mesa_id}/productos/{detalle_id}/cancelar", response_model=schemas.DetallePedidoResponse)
def cancelar_item_mesa(
    mesa_id: int, 
    detalle_id: int, 
    cancelacion: schemas.CancelacionDetalleRequest, 
    db: Session = Depends(get_db)
):
    """
    Cancela un ítem de la mesa, devuelve el stock y guarda la justificación en auditoría.
    """
    # Buscar el pedido activo de la mesa
    pedido = db.query(models.Pedido).filter(
        models.Pedido.mesa_id_mesa == mesa_id,
        models.Pedido.estado_pago_id_estpag == 2
    ).first()
    
    if not pedido:
        raise HTTPException(status_code=404, detail="La mesa no tiene una cuenta abierta.")

    # 1. Buscar el detalle del pedido
    detalle = db.query(models.DetallePedido).filter(
        models.DetallePedido.id_detped == detalle_id,
        models.DetallePedido.pedido_id_pedido == pedido.id_pedido
    ).first()
    
    if not detalle:
        raise HTTPException(status_code=404, detail="El ítem del pedido no existe.")
        
    if detalle.estado_cocina_id_estcoc == 4:
        raise HTTPException(status_code=400, detail="Este ítem ya ha sido cancelado previamente.")

    # 2. Buscar el producto para devolverle el stock
    producto = db.query(models.Producto).filter(models.Producto.id_producto == detalle.producto_id_producto).first()
    if producto:
        producto.stock_producto += detalle.cantidad_detped

    # 3. Cambiar estado a "Cancelado" (ID 4) en vez de borrar el registro físico
    detalle.estado_cocina_id_estcoc = 4

    # 4. Registrar la acción en la Auditoría
    nuevo_registro = models.RegistroAuditoria(
        justificacion=cancelacion.justificacion,
        usuario_id_usuario=cancelacion.usuario_id,
        accion_id_tipacc=1, # 1 = Eliminar Producto
        pedido_id_pedido=pedido.id_pedido,
        producto_id_producto=detalle.producto_id_producto
    )
    db.add(nuevo_registro)
    
    # 5. Guardar todo
    db.commit()
    db.refresh(detalle)
    return detalle

@app.get("/auditoria/", response_model=List[schemas.RegistroAuditoriaResponse])
def listar_auditoria(db: Session = Depends(get_db)):
    """
    Lista el historial de cancelaciones y modificaciones para el control del administrador.
    """
    return db.query(models.RegistroAuditoria).all()