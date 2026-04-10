from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, CHAR, SMALLINT, ForeignKeyConstraint
from sqlalchemy.sql import func
from database import Base

# --- TABLAS DE CONFIGURACIÓN ---
class Rol(Base):
    __tablename__ = "rol"
    id_rol = Column(Integer, primary_key=True)
    desc_rol = Column(String(25), nullable=False)

class AccionAuditoria(Base):
    __tablename__ = "accion_auditoria"
    id_tipacc = Column(SMALLINT, primary_key=True)
    desc_tipacc = Column(String(20), nullable=False)

class EstadoCocina(Base):
    __tablename__ = "estado_cocina"
    id_estcoc = Column(SMALLINT, primary_key=True)
    desc_estcoc = Column(String(20), nullable=False)

class EstadoMesa(Base):
    __tablename__ = "estado_mesa"
    id_estmes = Column(SMALLINT, primary_key=True)
    desc_estmes = Column(String(15), nullable=False)

class EstadoPago(Base):
    __tablename__ = "estado_pago"
    id_estpag = Column(Integer, primary_key=True)
    desc_estpag = Column(String(15), nullable=False)

class MetodoPago(Base):
    __tablename__ = "metodo_pago"
    id_metpag = Column(SMALLINT, primary_key=True)
    desc_metpag = Column(String(15))

class Categoria(Base):
    __tablename__ = "categoria"
    id_categoria = Column(Integer, primary_key=True)
    desc_categoria = Column(String(20), nullable=False)

# --- TABLAS CON LLAVES COMPUESTAS ---
class Usuario(Base):
    __tablename__ = "usuario"
    id_usuario = Column(Integer, primary_key=True)
    nombre_usuario = Column(String(20), nullable=False)
    contrasena_usuario = Column(String(20), nullable=False)
    activo_usuario = Column(CHAR(1), nullable=False)
    rol_id_rol = Column(Integer, ForeignKey("rol.id_rol"), primary_key=True)

class Producto(Base):
    __tablename__ = "producto"
    id_producto = Column(Integer, primary_key=True)
    nombre_producto = Column(String(30), nullable=False)
    precio_producto = Column(Integer, nullable=False)
    stock_producto = Column(Integer, nullable=False)
    ultimamod_producto = Column(DateTime, server_default=func.now())
    categoria_id_categoria = Column(Integer, ForeignKey("categoria.id_categoria"), primary_key=True)

class Mesa(Base):
    __tablename__ = "mesa"
    id_mesa = Column(Integer, primary_key=True)
    numero_mesa = Column(Integer, nullable=False)
    estado_mesa_id_estmes = Column(SMALLINT, ForeignKey("estado_mesa.id_estmes"), primary_key=True)

class Pedido(Base):
    __tablename__ = "pedido"
    id_pedido = Column(Integer, primary_key=True)
    hora_apertura = Column(DateTime, server_default=func.now())
    mesa_id_mesa = Column(Integer, nullable=False)
    estado_pago_id_estpag = Column(Integer, ForeignKey("estado_pago.id_estpag"), nullable=False)
    mesa_est_mesa_id_estmes = Column(SMALLINT, nullable=False)
    __table_args__ = (ForeignKeyConstraint(['mesa_id_mesa', 'mesa_est_mesa_id_estmes'], ['mesa.id_mesa', 'mesa.estado_mesa_id_estmes']),)

class DetallePedido(Base):
    __tablename__ = "detalle_pedido"
    id_detped = Column(Integer, primary_key=True)
    cantidad_detped = Column(SMALLINT, nullable=False)
    precio_detped = Column(Integer, nullable=False)
    pedido_id_pedido = Column(Integer, ForeignKey("pedido.id_pedido"), nullable=False)
    producto_id_producto = Column(Integer, nullable=False)
    estado_cocina_id_estcoc = Column(SMALLINT, ForeignKey("estado_cocina.id_estcoc"), nullable=False)
    prod_cat_id_cat = Column(Integer, nullable=False)
    __table_args__ = (ForeignKeyConstraint(['producto_id_producto', 'prod_cat_id_cat'], ['producto.id_producto', 'producto.categoria_id_categoria']),)