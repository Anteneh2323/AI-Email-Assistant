from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import httpx
import json

import models
import database

# Load environment variables
load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class EmailRequest(BaseModel):
    content: str

class EmailResponse(BaseModel):
    improved_content: str
    suggestions: List[str]
    corrections: List[str]

class TemplateCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class TemplateCategoryCreate(TemplateCategoryBase):
    pass

class TemplateCategory(TemplateCategoryBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True

class TemplateBase(BaseModel):
    name: str
    subject: str
    content: str
    category_id: Optional[int] = None
    tags: Optional[str] = None
    is_public: Optional[int] = 0

class TemplateCreate(TemplateBase):
    pass

class Template(TemplateBase):
    id: int
    created_at: str
    updated_at: str
    category: Optional[TemplateCategory] = None

    class Config:
        orm_mode = True

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/process-email", response_model=EmailResponse)
async def process_email(request: EmailRequest):
    try:
        api_key = os.getenv('OPENROUTER_API_KEY')
        print(f"API Key found: {'Yes' if api_key else 'No'}")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenRouter API key not found in environment variables")
            
        async with httpx.AsyncClient() as client:
            headers = {
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "AI Email Assistant",
                "Authorization": f"Bearer {api_key.strip()}",
                "Content-Type": "application/json",
            }
            print(f"Request headers: {headers}")
            
            payload = {
                "model": "anthropic/claude-3-opus:beta",
                "route": "fallback",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an AI email assistant that helps improve emails. Analyze the email and provide: 1) An improved version, 2) A list of suggestions for improvement, and 3) A list of specific corrections made. Format your response as a JSON object with keys: improved_content, suggestions, and corrections."
                    },
                    {
                        "role": "user",
                        "content": request.content
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 400
            }
            print(f"Request payload: {payload}")
            
            try:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                
                print(f"Response status: {response.status_code}")
                print(f"Response body: {response.text}")
                
                if response.status_code == 401:
                    raise HTTPException(
                        status_code=500,
                        detail="Invalid API key. Please check your OpenRouter API key in the .env file."
                    )
                elif response.status_code == 402:
                    raise HTTPException(
                        status_code=500,
                        detail="Insufficient credits. Please upgrade your OpenRouter account or reduce max_tokens."
                    )
                elif response.status_code != 200:
                    error_detail = f"OpenRouter API error: {response.status_code} - {response.text}"
                    print(f"API Error: {error_detail}")
                    raise HTTPException(status_code=500, detail=error_detail)
                
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                try:
                    # Try to parse the response as JSON
                    parsed_content = json.loads(content)
                    return EmailResponse(
                        improved_content=parsed_content['improved_content'],
                        suggestions=parsed_content['suggestions'],
                        corrections=parsed_content['corrections']
                    )
                except json.JSONDecodeError as e:
                    print(f"JSON Parse Error: {str(e)}")
                    # If not JSON, return the content as is
                    return EmailResponse(
                        improved_content=content,
                        suggestions=[],
                        corrections=[]
                    )
            except httpx.TimeoutException:
                raise HTTPException(status_code=500, detail="Request to OpenRouter API timed out")
            except httpx.RequestError as e:
                raise HTTPException(status_code=500, detail=f"Error connecting to OpenRouter API: {str(e)}")
                
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Template Category endpoints
@app.post("/api/categories", response_model=TemplateCategory)
def create_category(category: TemplateCategoryCreate, db: Session = Depends(get_db)):
    db_category = models.TemplateCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/api/categories", response_model=List[TemplateCategory])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = db.query(models.TemplateCategory).offset(skip).limit(limit).all()
    return categories

@app.get("/api/categories/{category_id}", response_model=TemplateCategory)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.TemplateCategory).filter(models.TemplateCategory.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@app.put("/api/categories/{category_id}", response_model=TemplateCategory)
def update_category(category_id: int, category: TemplateCategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.TemplateCategory).filter(models.TemplateCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.TemplateCategory).filter(models.TemplateCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

# Template endpoints
@app.post("/api/templates", response_model=Template)
def create_template(template: TemplateCreate, db: Session = Depends(get_db)):
    db_template = models.EmailTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@app.get("/api/templates", response_model=List[Template])
def get_templates(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    tag: Optional[str] = None,
    is_public: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.EmailTemplate)
    
    if category_id is not None:
        query = query.filter(models.EmailTemplate.category_id == category_id)
    if tag is not None:
        query = query.filter(models.EmailTemplate.tags.contains(tag))
    if is_public is not None:
        query = query.filter(models.EmailTemplate.is_public == is_public)
    
    templates = query.offset(skip).limit(limit).all()
    return templates

@app.get("/api/templates/{template_id}", response_model=Template)
def get_template(template_id: int, db: Session = Depends(get_db)):
    template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@app.put("/api/templates/{template_id}", response_model=Template)
def update_template(template_id: int, template: TemplateCreate, db: Session = Depends(get_db)):
    db_template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    
    for key, value in template.dict().items():
        setattr(db_template, key, value)
    
    db.commit()
    db.refresh(db_template)
    return db_template

@app.delete("/api/templates/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    db_template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    
    db.delete(db_template)
    db.commit()
    return {"message": "Template deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 