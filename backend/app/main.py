import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/api/health")
def health():
  return {"status": "ok"}
    
if __name__ == "__main__":
  uvicorn.run("app.main:app", host="0.0.0.0", port=4321, reload=True)