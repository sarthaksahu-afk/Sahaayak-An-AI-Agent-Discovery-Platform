from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
import shutil
from dotenv import load_dotenv

# --- NEW GEMINI IMPORTS ---
from google import genai
from google.genai import types

from openai import OpenAI
from sqlalchemy.orm import Session

import models
from database import engine, get_db

# --- SETUP & CONFIG ---
load_dotenv()

# --- NEW CLIENT INITIALIZATIONS ---
# This replaces the old genai.configure() line
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) # For Whisper

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sahaayak API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PYDANTIC SCHEMAS ---
# Schema for frontend GET request
class AgentResponse(BaseModel):
    id: str

    # English (Base)
    company_name: str  # ✅ FIXED: Added this back so the frontend can display it!
    ai_name: str
    category: str
    description: str

    # Hindi
    company_name_hi: Optional[str] = None
    ai_name_hi: Optional[str] = None
    category_hi: Optional[str] = None
    description_hi: Optional[str] = None

    # Tamil
    company_name_ta: Optional[str] = None
    ai_name_ta: Optional[str] = None
    category_ta: Optional[str] = None
    description_ta: Optional[str] = None

    # Telugu
    company_name_te: Optional[str] = None
    ai_name_te: Optional[str] = None
    category_te: Optional[str] = None
    description_te: Optional[str] = None

    # Kannada
    company_name_kn: Optional[str] = None
    ai_name_kn: Optional[str] = None
    category_kn: Optional[str] = None
    description_kn: Optional[str] = None

    # Malayalam
    company_name_ml: Optional[str] = None
    ai_name_ml: Optional[str] = None
    category_ml: Optional[str] = None
    description_ml: Optional[str] = None

    # Meta Fields
    rating: float
    users: str
    link: str
    status: str
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True

class AgentCreate(BaseModel):
    company_name: str
    ai_name: str
    category: str
    description: str
    link: str
    simulator_prompt: str
    owner_id: int # Assuming frontend sends this now

# Schema for company requesting deletion
class AgentDeleteRequest(BaseModel):
    owner_id: int

class ChatRequest(BaseModel):
    tool_id: str
    user_message: str

import json

def generate_translations(agent: AgentCreate):
    """Uses Gemini to auto-translate submission fields into 5 Indian languages."""
    prompt = f"""
    Translate the following English values into Hindi (_hi), Tamil (_ta), Telugu (_te), Kannada (_kn), and Malayalam (_ml).
    Return ONLY a valid JSON object with the exact keys below containing the translated strings. Do not include markdown formatting.
    
    Keys required:
    company_name_hi, company_name_ta, company_name_te, company_name_kn, company_name_ml,
    ai_name_hi, ai_name_ta, ai_name_te, ai_name_kn, ai_name_ml,
    description_hi, description_ta, description_te, description_kn, description_ml,
    category_hi, category_ta, category_te, category_kn, category_ml
    
    Original English values:
    Company Name: {agent.company_name}
    AI Name: {agent.ai_name}
    Description: {agent.description}
    Category: {agent.category}
    """

    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Translation failed: {e}")
        return {} # Returns empty dict if it fails, fallback handles it

# --- TASK 1: THE DATABASE ENDPOINT ---
@app.get("/api/agents", response_model=List[AgentResponse])
def get_agents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Frontend endpoint: Returns Active agents with pagination."""
    # Uses 'Active' exactly as frontend expects, with offset (skip) and limit
    return db.query(models.AgentDB).filter(
        models.AgentDB.status == 'Active'
    ).offset(skip).limit(limit).all()

# --- TASK 2: VOICE TO TEXT ENDPOINT ---
@app.post("/api/voice-to-text")
async def voice_to_text(audio: UploadFile = File(...)):
    """Receives audio blob, sends to Whisper API, returns transcribed text."""
    temp_file_path = f"temp_{audio.filename}"

    # Save the uploaded file temporarily
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        # Send to OpenAI Whisper API
        with open(temp_file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        return {"text": transcription.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

# --- ADD & DELETE WORKFLOWS ---
@app.post("/api/tools/submit")
def submit_tool(agent: AgentCreate, db: Session = Depends(get_db)):

    translations = generate_translations(agent)

    new_agent = models.AgentDB(
        id=str(uuid.uuid4()),

        # English
        company_name=agent.company_name,
        ai_name=agent.ai_name,
        description=agent.description,
        category=agent.category,

        # Hindi
        company_name_hi=translations.get("company_name_hi", ""),
        ai_name_hi=translations.get("ai_name_hi", ""),
        description_hi=translations.get("description_hi", ""),
        category_hi=translations.get("category_hi", ""),

        # Tamil
        company_name_ta=translations.get("company_name_ta", ""),
        ai_name_ta=translations.get("ai_name_ta", ""),
        description_ta=translations.get("description_ta", ""),
        category_ta=translations.get("category_ta", ""),

        # Telugu
        company_name_te=translations.get("company_name_te", ""),
        ai_name_te=translations.get("ai_name_te", ""),
        description_te=translations.get("description_te", ""),
        category_te=translations.get("category_te", ""),

        # Kannada
        company_name_kn=translations.get("company_name_kn", ""),
        ai_name_kn=translations.get("ai_name_kn", ""),
        description_kn=translations.get("description_kn", ""),
        category_kn=translations.get("category_kn", ""),

        # Malayalam
        company_name_ml=translations.get("company_name_ml", ""),
        ai_name_ml=translations.get("ai_name_ml", ""),
        description_ml=translations.get("description_ml", ""),
        category_ml=translations.get("category_ml", ""),

        # Meta
        link=agent.link,
        simulator_prompt=agent.simulator_prompt,
        owner_id=agent.owner_id,
        status="Pending Approval"
    )
    db.add(new_agent)
    db.commit()
    return {"message": "Submission received, translated into 6 languages, and pending developer review"}

@app.patch("/api/admin/tools/{tool_id}/approve")
def approve_ai_tool(tool_id: str, db: Session = Depends(get_db)):
    tool = db.query(models.AgentDB).filter(models.AgentDB.id == tool_id).first()
    if not tool: raise HTTPException(status_code=404, detail="Tool not found")

    tool.status = "Active" # ✅ FIXED: Exact string frontend expects
    db.commit()
    return {"message": f"{tool.ai_name} approved!"} # ✅ FIXED: tool.name -> tool.ai_name

@app.post("/api/tools/{tool_id}/request-delete") # ✅ FIXED: Added {tool_id} to URL
def request_deletion(tool_id: str, req: AgentDeleteRequest, db: Session = Depends(get_db)):
    """Company requests deletion by matching tool_id and owner_id."""
    tool = db.query(models.AgentDB).filter(
        models.AgentDB.id == tool_id,
        models.AgentDB.owner_id == req.owner_id # ✅ FIXED: Validating via owner_id
    ).first()

    if not tool:
        raise HTTPException(status_code=404, detail="AI Tool not found or unauthorized.")

    tool.status = "Deletion Requested" # ✅ FIXED: Exact string frontend expects
    db.commit()
    return {"message": "Deletion requested."}

@app.delete("/api/admin/tools/{tool_id}/approve-delete")
def approve_deletion(tool_id: str, db: Session = Depends(get_db)):
    """Developer permanently deletes the tool from the database."""
    tool = db.query(models.AgentDB).filter(models.AgentDB.id == tool_id).first()
    if not tool: raise HTTPException(status_code=404, detail="Tool not found")

    db.delete(tool)
    db.commit()
    return {"message": f"{tool.ai_name} has been permanently deleted."} # ✅ FIXED: tool.name -> tool.ai_name


# --- SANDBOX SIMULATOR ---
@app.post("/api/sandbox/chat")
async def sandbox_chat(request: ChatRequest, db: Session = Depends(get_db)):
    tool = db.query(models.AgentDB).filter(models.AgentDB.id == request.tool_id).first()
    if not tool: raise HTTPException(status_code=404, detail="Tool not found")

    try:
        # The new google-genai syntax uses a config object for system instructions
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.user_message,
            config=types.GenerateContentConfig(
                system_instruction=tool.simulator_prompt
            )
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
