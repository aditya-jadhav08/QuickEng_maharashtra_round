from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diagnose import diagnose
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "message": "Welcome to the Re:Learn Tutor API!",
        "endpoints": ["POST /diagnose", "POST /resolve"]
    }

@app.get("/health")
def health():
    return {"status": "ok"}

class DiagnoseRequest(BaseModel):
    task: str
    code: str

from resolve import resolve_code

@app.post("/diagnose")
def diagnose_endpoint(req: DiagnoseRequest):
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty.")
    if len(req.code) > 3000:
        raise HTTPException(status_code=400, detail="Code is too long (max 3000 chars).")
    
    result = diagnose(req.task, req.code)
    return result

@app.post("/resolve")
def resolve_endpoint(req: DiagnoseRequest):
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty.")
    
    result = resolve_code(req.task, req.code)
    return result