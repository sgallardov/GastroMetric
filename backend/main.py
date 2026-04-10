import time
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from database import engine, Base, get_db, SessionLocal 
import models, seed 

# --- LÓGICA DE CONEXIÓN ROBUSTA ---
def init_db():
    retries = 5
    while retries > 0:
        try:
            print(f"🔄 Intentando conectar a la DB... (Intentos restantes: {retries})")
            # 1. Crea las tablas
            models.Base.metadata.create_all(bind=engine)
            
            # 2. Ejecuta el sembrado
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

# Llamamos a la función de inicialización
init_db()

app = FastAPI(title="GastroMetric API")

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "proyecto": "GastroMetric POS",
        "db_status": "Conectada y Poblada"
    }

@app.get("/check-db")
def check_db(db: Session = Depends(get_db)):
    try:
        roles = db.query(models.Rol).all()
        return {
            "status": "OK",
            "roles_encontrados": [r.desc_rol for r in roles]
        }
    except Exception as e:
        return {"status": "Error", "detalle": str(e)}