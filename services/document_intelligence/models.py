"""Pydantic models for Document Intelligence service"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator
from enum import Enum

class TranslationStatus(str, Enum):
    """Translation job status enumeration"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class DocumentTranslationRequest(BaseModel):
    """Request model for document translation"""
    target_language: str = Field(..., description="Target language code (e.g., 'es', 'fr', 'de')")
    source_language: Optional[str] = Field(None, description="Source language code (auto-detect if not provided)")
    glossary_url: Optional[str] = Field(None, description="URL to custom glossary file")
    category: Optional[str] = Field(None, description="Category ID for custom models")

    @validator('target_language')
    def validate_target_language(cls, v):
        """Validate target language format"""
        if not v or len(v) < 2:
            raise ValueError("Target language must be at least 2 characters")
        return v.lower()

    @validator('source_language')
    def validate_source_language(cls, v):
        """Validate source language format"""
        if v and len(v) < 2:
            raise ValueError("Source language must be at least 2 characters")
        return v.lower() if v else v

class DocumentUploadResponse(BaseModel):
    """Response model for document upload"""
    success: bool
    blob_name: str
    upload_url: str
    container_name: str
    file_size: int
    content_type: str
    message: str

class TranslationJobResponse(BaseModel):
    """Response model for translation job"""
    job_id: str
    status: TranslationStatus
    source_container: str
    target_container: str
    source_blob: str
    target_blob: Optional[str] = None
    source_language: Optional[str] = None
    target_language: str
    created_at: datetime
    updated_at: datetime
    documents_total: int = 0
    documents_completed: int = 0
    documents_failed: int = 0
    error_message: Optional[str] = None

class TranslationJobRequest(BaseModel):
    """Request model for starting translation job"""
    source_blob_name: str = Field(..., description="Name of the source document blob")
    translation_config: DocumentTranslationRequest = Field(..., description="Translation configuration")

class DownloadResponse(BaseModel):
    """Response model for document download"""
    success: bool
    download_url: str
    blob_name: str
    expires_at: datetime
    file_size: int
    content_type: str

class JobStatusResponse(BaseModel):
    """Response model for job status check"""
    job_id: str
    status: TranslationStatus
    progress_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    documents_total: int
    documents_completed: int
    documents_failed: int
    created_at: datetime
    updated_at: datetime
    estimated_completion: Optional[datetime] = None
    error_details: Optional[List[str]] = None

class SupportedLanguagesResponse(BaseModel):
    """Response model for supported languages"""
    translation: Dict[str, Dict[str, Any]]
    transliteration: Optional[Dict[str, Dict[str, Any]]] = None
    dictionary: Optional[Dict[str, Dict[str, Any]]] = None

class ErrorResponse(BaseModel):
    """Standard error response model"""
    success: bool = False
    error_code: str
    error_message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HealthCheckResponse(BaseModel):
    """Health check response model"""
    service: str = "Document Intelligence"
    status: str
    configured: bool
    storage_accessible: bool
    translator_accessible: bool
    managed_identity_enabled: bool
    supported_formats: List[str]
    max_file_size_mb: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class FileValidationResponse(BaseModel):
    """File validation response model"""
    valid: bool
    filename: str
    file_size: int
    content_type: str
    format_supported: bool
    size_within_limits: bool
    validation_errors: List[str] = Field(default_factory=list)