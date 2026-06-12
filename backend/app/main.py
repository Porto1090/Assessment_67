# Main application file for the Auth App
#
# Using FastAPI to create a simple authentication API with MongoDB as the database

from fastapi import FastAPI
from app.routers import users, compiler, history
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title = "Assesment67 App")

# CORS for connection with Frontend React App
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  # allow_origins=["http://localhost:5173"], # Puerto default de Vite+React
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(history.router)
app.include_router(compiler.router)

@app.get("/")
async def root():
    return {"message": "API funcionando"}

@app.get("/api/health")
def health():
    return {"status": "ok"}

# Para usar Certificados SSL para https con OpenSSL
# if __name__ == "__main__":
#     uvicorn.run(
#         "main:app",
#         host = "0.0.0.0",
#         port = 8000,
#         reload = True,
#         ssl_keyfile = "certs/key.pem",
#         ssl_certfile = "certs/cert.pem"
#     )
