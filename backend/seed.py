from sqlalchemy.orm import Session
import models

def seed_data(db: Session):
    # 1. ROLES (Definen quién puede hacer qué)
    if db.query(models.Rol).count() == 0:
        db.add_all([
            models.Rol(id_rol=1, desc_rol="Administrador"),
            models.Rol(id_rol=2, desc_rol="Garzón"),
            models.Rol(id_rol=3, desc_rol="Cocinero")
        ])
        print("✅ Roles configurados")

    # 2. ESTADOS DE MESA (Reglas para el mapa de mesas)
    if db.query(models.EstadoMesa).count() == 0:
        db.add_all([
            models.EstadoMesa(id_estmes=1, desc_estmes="Disponible"),
            models.EstadoMesa(id_estmes=2, desc_estmes="Ocupada"),
            models.EstadoMesa(id_estmes=3, desc_estmes="Sucia")
        ])
        print("✅ Estados de mesa configurados")

    # 3. MÉTODOS DE PAGO (Opciones para la caja)
    if db.query(models.MetodoPago).count() == 0:
        db.add_all([
            models.MetodoPago(id_metpag=1, desc_metpag="Efectivo"),
            models.MetodoPago(id_metpag=2, desc_metpag="Débito/Crédito"),
            models.MetodoPago(id_metpag=3, desc_metpag="Transferencia")
        ])
        print("✅ Métodos de pago configurados")

    # 4. CATEGORÍAS (Para organizar la carta/menú)
    if db.query(models.Categoria).count() == 0:
        db.add_all([
            models.Categoria(id_categoria=1, desc_categoria="Bebidas"),
            models.Categoria(id_categoria=2, desc_categoria="Comida"),
            models.Categoria(id_categoria=3, desc_categoria="Otros")
        ])
        print("✅ Categorías configuradas")

    # 5. USUARIO GENÉRICO DE TRABAJO
    if db.query(models.Usuario).count() == 0:
        admin_user = models.Usuario(
            id_usuario=1,
            nombre_usuario="admin",
            contrasena_usuario="admin123", # Clave genérica para el equipo
            activo_usuario="S",
            rol_id_rol=1
        )
        db.add(admin_user)
        print("✅ Usuario 'admin' creado para el equipo")

    db.commit()