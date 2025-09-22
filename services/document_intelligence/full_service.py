"""Full Document Intelligence service implementation"""
import os
import uuid
import asyncio
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form, BackgroundTasks
from azure.ai.translation.document import DocumentTranslationClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import AzureError
import requests

from .config import get_config, validate_file_format, validate_file_size
from .models import (
    DocumentTranslationRequest, DocumentUploadResponse, TranslationJobResponse,
    TranslationJobRequest, DownloadResponse, JobStatusResponse,
    SupportedLanguagesResponse, HealthCheckResponse, FileValidationResponse,
    ErrorResponse, TranslationStatus
)
from .security import security_manager
from .blob_storage import blob_storage

logger = logging.getLogger(__name__)

# In-memory job storage (in production, use Redis or database)
translation_jobs: Dict[str, Dict[str, Any]] = {}

def register_routes(router: APIRouter):
    """Register all the full service routes"""

    @router.post("/upload", response_model=DocumentUploadResponse)
    async def upload_document(
        background_tasks: BackgroundTasks,
        file: UploadFile = File(...),
        container: Optional[str] = Form(None)
    ):
        """Upload a document for translation"""
        try:
            # Ensure containers exist
            background_tasks.add_task(blob_storage.ensure_containers_exist)

            # Upload document
            response = await blob_storage.upload_document(file, container)

            logger.info(f"Document uploaded: {response.blob_name}")
            return response

        except ValueError as e:
            logger.warning(f"Upload validation error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Upload error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    @router.post("/translate", response_model=TranslationJobResponse)
    async def start_translation(
        request: Request,
        translation_request: TranslationJobRequest,
        background_tasks: BackgroundTasks
    ):
        """Start document translation job"""
        try:
            config = get_config()

            # Generate job ID
            job_id = str(uuid.uuid4())

            # Verify source blob exists
            try:
                source_blobs = await blob_storage.list_blobs(
                    config.source_container_name,
                    translation_request.source_blob_name
                )
                if not source_blobs:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Source document '{translation_request.source_blob_name}' not found"
                    )
            except Exception as e:
                logger.error(f"Failed to verify source blob: {str(e)}")
                raise HTTPException(status_code=500, detail="Failed to verify source document")

            # Create job record
            job_record = {
                "job_id": job_id,
                "status": TranslationStatus.PENDING,
                "source_container": config.source_container_name,
                "target_container": config.target_container_name,
                "source_blob": translation_request.source_blob_name,
                "target_blob": None,
                "source_language": translation_request.translation_config.source_language,
                "target_language": translation_request.translation_config.target_language,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "documents_total": 1,
                "documents_completed": 0,
                "documents_failed": 0,
                "error_message": None,
                "azure_operation_id": None
            }

            translation_jobs[job_id] = job_record

            # Start translation in background
            background_tasks.add_task(
                _process_translation_job,
                job_id,
                translation_request
            )

            # Security audit
            security_manager.audit_log("translation_job_started", {
                "job_id": job_id,
                "source_blob": translation_request.source_blob_name,
                "target_language": translation_request.translation_config.target_language
            })

            return TranslationJobResponse(**job_record)

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Translation job creation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to start translation: {str(e)}")

    @router.get("/job/{job_id}", response_model=JobStatusResponse)
    async def get_job_status(job_id: str):
        """Get translation job status"""
        try:
            if job_id not in translation_jobs:
                raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

            job = translation_jobs[job_id]

            # Calculate progress
            total = job["documents_total"]
            completed = job["documents_completed"]
            failed = job["documents_failed"]

            progress_percentage = (completed / total * 100) if total > 0 else 0

            return JobStatusResponse(
                job_id=job_id,
                status=job["status"],
                progress_percentage=progress_percentage,
                documents_total=total,
                documents_completed=completed,
                documents_failed=failed,
                created_at=job["created_at"],
                updated_at=job["updated_at"],
                estimated_completion=None,  # Could implement estimation logic
                error_details=[job["error_message"]] if job["error_message"] else None
            )

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to get job status: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to retrieve job status: {str(e)}")

    @router.get("/download/{blob_name}", response_model=DownloadResponse)
    async def download_document(
        blob_name: str,
        container: Optional[str] = None
    ):
        """Get secure download URL for a document"""
        try:
            response = await blob_storage.get_download_url(blob_name, container)

            # Security audit
            security_manager.audit_log("document_download_requested", {
                "blob_name": blob_name,
                "container": container or "target"
            })

            return response

        except ValueError as e:
            logger.warning(f"Download request error: {str(e)}")
            raise HTTPException(status_code=404, detail=str(e))
        except Exception as e:
            logger.error(f"Download URL generation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate download URL: {str(e)}")

    @router.get("/languages", response_model=SupportedLanguagesResponse)
    async def get_supported_languages():
        """Get supported languages for translation"""
        try:
            config = get_config()

            # Call Azure Translator Text API languages endpoint (not the batch endpoint)
            url = f"{config.translator_text_endpoint}/languages?api-version=3.0"
            response = requests.get(url, timeout=30)
            response.raise_for_status()

            languages_data = response.json()

            return SupportedLanguagesResponse(
                translation=languages_data.get("translation", {}),
                transliteration=languages_data.get("transliteration"),
                dictionary=languages_data.get("dictionary")
            )

        except requests.RequestException as e:
            logger.error(f"Failed to fetch supported languages: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to retrieve supported languages")
        except Exception as e:
            logger.error(f"Unexpected error getting languages: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    @router.post("/validate", response_model=FileValidationResponse)
    async def validate_file(file: UploadFile = File(...)):
        """Validate file for translation"""
        try:
            # Read file content to check size
            content = await file.read()
            await file.seek(0)  # Reset file pointer

            # Validate format
            format_supported = validate_file_format(file.filename)

            # Validate size
            size_within_limits = validate_file_size(len(content))

            # Collect validation errors
            validation_errors = []
            if not format_supported:
                validation_errors.append(f"Unsupported file format: {file.filename}")
            if not size_within_limits:
                config = get_config()
                validation_errors.append(f"File too large. Maximum size: {config.max_file_size_mb}MB")

            return FileValidationResponse(
                valid=format_supported and size_within_limits,
                filename=file.filename,
                file_size=len(content),
                content_type=file.content_type or "application/octet-stream",
                format_supported=format_supported,
                size_within_limits=size_within_limits,
                validation_errors=validation_errors
            )

        except Exception as e:
            logger.error(f"File validation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

    @router.get("/jobs", response_model=List[JobStatusResponse])
    async def list_jobs(limit: int = 50):
        """List translation jobs"""
        try:
            jobs = []
            for job_id, job_data in list(translation_jobs.items())[-limit:]:
                total = job_data["documents_total"]
                completed = job_data["documents_completed"]
                progress = (completed / total * 100) if total > 0 else 0

                jobs.append(JobStatusResponse(
                    job_id=job_id,
                    status=job_data["status"],
                    progress_percentage=progress,
                    documents_total=total,
                    documents_completed=completed,
                    documents_failed=job_data["documents_failed"],
                    created_at=job_data["created_at"],
                    updated_at=job_data["updated_at"],
                    error_details=[job_data["error_message"]] if job_data["error_message"] else None
                ))

            return jobs

        except Exception as e:
            logger.error(f"Failed to list jobs: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to list jobs: {str(e)}")

    @router.delete("/job/{job_id}")
    async def cancel_job(job_id: str):
        """Cancel a translation job"""
        try:
            if job_id not in translation_jobs:
                raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

            job = translation_jobs[job_id]

            if job["status"] in [TranslationStatus.COMPLETED, TranslationStatus.FAILED, TranslationStatus.CANCELLED]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Cannot cancel job in '{job['status']}' status"
                )

            # Update job status
            job["status"] = TranslationStatus.CANCELLED
            job["updated_at"] = datetime.now(timezone.utc)

            # Security audit
            security_manager.audit_log("translation_job_cancelled", {
                "job_id": job_id
            })

            return {"success": True, "message": f"Job '{job_id}' cancelled"}

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to cancel job: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to cancel job: {str(e)}")

    # Override the basic health check with full functionality version
    @router.get("/health", response_model=HealthCheckResponse)
    async def health_check_full():
        """Comprehensive health check endpoint"""
        try:
            config = get_config()

            # Check if translator is configured
            translator_configured = bool(
                config.translator_api_key and
                config.translator_endpoint
            )

            # Check if storage is accessible
            storage_accessible = False
            try:
                await blob_storage.ensure_containers_exist()
                storage_accessible = True
            except Exception as e:
                logger.warning(f"Storage health check failed: {str(e)}")

            # Determine overall status
            if translator_configured and storage_accessible:
                status = "healthy"
            elif translator_configured or storage_accessible:
                status = "degraded"
            else:
                status = "unhealthy"

            return HealthCheckResponse(
                status=status,
                configured=translator_configured,
                storage_accessible=storage_accessible,
                translator_accessible=translator_configured,
                managed_identity_enabled=config.use_managed_identity,
                supported_formats=list(config.supported_formats),
                max_file_size_mb=config.max_file_size_mb
            )

        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return HealthCheckResponse(
                status="unhealthy",
                configured=False,
                storage_accessible=False,
                translator_accessible=False,
                managed_identity_enabled=False,
                supported_formats=[],
                max_file_size_mb=0
            )

async def _process_translation_job(job_id: str, translation_request: TranslationJobRequest):
    """Background task to process translation job"""
    try:
        config = get_config()
        job = translation_jobs[job_id]

        # Update job status
        job["status"] = TranslationStatus.RUNNING
        job["updated_at"] = datetime.now(timezone.utc)

        # Get container SAS URLs
        source_url, target_url = await blob_storage.get_container_sas_urls()

        # Initialize Azure Document Translation client
        credential = AzureKeyCredential(config.translator_api_key)
        client = DocumentTranslationClient(
            endpoint=config.translator_endpoint,
            credential=credential
        )

        # Generate URLs for the specific blob
        source_blob_url = security_manager.get_download_sas_url(
            config.source_container_name,
            translation_request.source_blob_name
        )

        # Generate target blob name
        target_blob_name = f"translated_{translation_request.source_blob_name}"
        target_blob_url = security_manager.get_upload_sas_url(
            config.target_container_name,
            target_blob_name
        )

        # Start translation using single document format
        kwargs = {
            "source_url": source_blob_url,
            "target_url": target_blob_url,
            "target_language": translation_request.translation_config.target_language
        }

        # Add optional source language
        if translation_request.translation_config.source_language:
            kwargs["source_language"] = translation_request.translation_config.source_language

        operation = await asyncio.to_thread(
            client.begin_translation,
            **kwargs
        )

        # Store operation details
        job["azure_operation_id"] = operation.id if hasattr(operation, 'id') else None

        # Wait for completion
        result = await asyncio.to_thread(operation.result)

        # Update job with results
        if result:
            job["status"] = TranslationStatus.COMPLETED
            job["documents_completed"] = 1
            job["target_blob"] = f"translated_{translation_request.source_blob_name}"
        else:
            job["status"] = TranslationStatus.FAILED
            job["documents_failed"] = 1
            job["error_message"] = "Translation completed but no result returned"

        job["updated_at"] = datetime.now(timezone.utc)

        logger.info(f"Translation job {job_id} completed with status: {job['status']}")

    except Exception as e:
        # Update job with error
        job = translation_jobs.get(job_id, {})
        job["status"] = TranslationStatus.FAILED
        job["documents_failed"] = 1
        job["error_message"] = str(e)
        job["updated_at"] = datetime.now(timezone.utc)

        logger.error(f"Translation job {job_id} failed: {str(e)}")

        # Security audit
        security_manager.audit_log("translation_job_failed", {
            "job_id": job_id,
            "error": str(e)
        })