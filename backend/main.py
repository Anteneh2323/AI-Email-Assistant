from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from utils import process_email

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    content: str
    tone: Optional[str] = "professional"
    length: Optional[str] = "medium"

@app.get("/")
async def root():
    return {"message": "AI Email Assistant API"}

@app.post("/api/process-email")
async def process_email_endpoint(request: EmailRequest):
    try:
        response = process_email(
            content=request.content,
            tone=request.tone,
            length=request.length
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 