from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Docker usará esta variable para conectarse a PostgreSQL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://santiago:docker_password@db:5432/gastrometric_db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Para obtener la conexión en cada ruta de la API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()