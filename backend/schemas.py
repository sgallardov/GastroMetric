# backend/schemas.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

# ==========================================
# 0. CONFIGURACIÓN BASE
# ==========================================
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# ==========================================
# 1. ESQUEMAS DE CONFIGURACIÓN (Catálogos)
# ==========================================

class RolResponse(BaseSchema):
    id_rol: int
    desc_rol: str

# --- CAMBIO AQUÍ: Estructura de Categoría ---
class CategoriaBase(BaseModel):
    desc_categoria: str

class CategoriaCreate(CategoriaBase):
    """Esquema para recibir los datos al crear una categoría"""
    pass

class CategoriaResponse(CategoriaBase, BaseSchema):
    """Esquema para devolver la categoría con su ID"""
    id_categoria: int

class EstadoMesaResponse(BaseSchema):
    id_estmes: int
    desc_estmes: str

class EstadoCocinaResponse(BaseSchema):
    id_estcoc: int
    desc_estcoc: str

class MetodoPagoResponse(BaseSchema):
    id_metpag: int
    desc_metpag: str

# ==========================================
# 2. ESQUEMAS DE USUARIO (Seguridad)
# ==========================================

class UsuarioBase(BaseModel):
    nombre_usuario: str
    activo_usuario: str = "S"
    rol_id_rol: int

class UsuarioCreate(UsuarioBase):
    contrasena_usuario: str 

class UsuarioResponse(UsuarioBase, BaseSchema):
    id_usuario: int

# ==========================================
# 3. ESQUEMAS DE INVENTARIO (Productos)
# ==========================================

class ProductoBase(BaseModel):
    nombre_producto: str
    precio_producto: int
    stock_producto: int
    categoria_id_categoria: int

class ProductoCreate(ProductoBase):
    pass 

class ProductoResponse(ProductoBase, BaseSchema):
    id_producto: int
    ultimamod_producto: Optional[datetime] = None

# ==========================================
# 4. ESQUEMAS DE OPERACIONES (Mesas)
# ==========================================

class MesaBase(BaseModel):
    numero_mesa: int
    estado_mesa_id_estmes: int

class MesaCreate(MesaBase):
    pass

class MesaResponse(MesaBase, BaseSchema):
    id_mesa: int

# ==========================================
# 5. ESQUEMAS TRANSACCIONALES (Pedidos y Detalles)
# ==========================================

class DetallePedidoBase(BaseModel):
    cantidad_detped: int
    producto_id_producto: int
    estado_cocina_id_estcoc: int = 1 

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedidoResponse(DetallePedidoBase, BaseSchema):
    id_detped: int
    pedido_id_pedido: int
    precio_detped: int 


class PedidoBase(BaseModel):
    mesa_id_mesa: int
    # ELIMINADO: estado_pago_id_estpag ya no está en la base para que no lo pida Swagger

class PedidoResponse(PedidoBase, BaseSchema):
    id_pedido: int
    estado_pago_id_estpag: int # SÍ lo devolvemos para que el frontend sepa que quedó Pendiente
    hora_apertura: datetime
    detalles: List[DetallePedidoResponse] = []

class CheckoutResponse(BaseModel):
    pedido_id: int
    mesa_id: int
    subtotal: int
    iva: float
    propina_sugerida: float
    total: float

# ==========================================
# 6. ESQUEMAS DE AUDITORÍA Y CANCELACIÓN
# ==========================================

class CancelacionDetalleRequest(BaseModel):
    usuario_id: int
    justificacion: str

class RegistroAuditoriaResponse(BaseSchema):
    id_auditoria: int
    fecha_auditoria: datetime
    justificacion: str
    usuario_id_usuario: int
    accion_id_tipacc: int
    pedido_id_pedido: Optional[int] = None
    producto_id_producto: Optional[int] = None