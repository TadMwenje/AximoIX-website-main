from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Contact Models
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    service_interest: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=1000)
    status: str = Field(default="new")  # "new", "in-progress", "resolved"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    service_interest: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=1000)

class ContactSubmissionUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|in-progress|resolved)$")

# Service Models
class ServiceDetail(BaseModel):
    overview: str
    benefits: List[str]
    technologies: List[str]
    case_studies: Optional[List[str]] = []

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str
    features: List[str]
    detailed_info: ServiceDetail
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ServiceCreate(BaseModel):
    title: str
    description: str
    icon: str
    features: List[str]
    detailed_info: ServiceDetail

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    features: Optional[List[str]] = None
    detailed_info: Optional[ServiceDetail] = None
    is_active: Optional[bool] = None

# Company Models
class CompanyAbout(BaseModel):
    goal: str
    vision: str
    mission: str

class CompanyContact(BaseModel):
    email: str
    phone: str
    address: str
    social_media: Dict[str, str]

class CompanyInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    motto: str
    tagline: str
    description: str
    about: CompanyAbout
    contact: CompanyContact
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CompanyInfoUpdate(BaseModel):
    name: Optional[str] = None
    motto: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    about: Optional[CompanyAbout] = None
    contact: Optional[CompanyContact] = None