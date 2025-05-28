from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class TemplateCategory(Base):
    __tablename__ = "template_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    description = Column(String(200))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    templates = relationship("EmailTemplate", back_populates="category")

class EmailTemplate(Base):
    __tablename__ = "email_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    subject = Column(String(200))
    content = Column(Text)
    category_id = Column(Integer, ForeignKey("template_categories.id"))
    tags = Column(String(200))  # Comma-separated tags
    is_public = Column(Integer, default=0)  # 0 for private, 1 for public
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    category = relationship("TemplateCategory", back_populates="templates") 