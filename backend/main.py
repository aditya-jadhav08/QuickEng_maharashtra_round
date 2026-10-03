from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
import os
import json
import sqlite3
from dotenv import load_dotenv

# Load API key
load_dotenv()

app = FastAPI()

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# SQLite Database Setup
DB_FILE = "hackathon.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_code TEXT NOT NULL,
            identified_misconception TEXT,
            intervention_hint TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Run DB setup on startup
init_db()

class CodeRequest(BaseModel):
    studentCode: str

@app.post("/api/analyze")
def analyze_code(request: CodeRequest):
    if not request.studentCode.strip():
        raise HTTPException(status_code=400, detail="No code provided.")
        
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=f"Analyze the following student code for misconceptions:\\n\\n{request.studentCode}",
            config=types.GenerateContentConfig(
                system_instruction="Analyze the code and classify the underlying misconception. CRITICAL RULES: 1) Address the user naturally in a conversational way. Keep a neutral, professional, and encouraging tone focusing on the code's behavior. Do NOT over-use 'you' and 'your', and NEVER refer to them in the third person as 'the student'. 2) Explain it in extremely simple, everyday English. 3) NEVER use technical jargon like 'concatenation', 'implicit', 'type coercion', or 'operand'. 4) The 'identified_misconception' must be 3 sentences or less.",
                temperature=0.0,
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "identified_misconception": {"type": "STRING"},
                        "intervention_hint": {"type": "STRING"}
                    },
                    "required": ["identified_misconception", "intervention_hint"]
                }
            )
        )
        
        result = json.loads(response.text)
        
        # Save to SQLite Database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO analyses (student_code, identified_misconception, intervention_hint) VALUES (?, ?, ?)",
            (request.studentCode, result['identified_misconception'], result['intervention_hint'])
        )
        conn.commit()
        conn.close()

        return result
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))