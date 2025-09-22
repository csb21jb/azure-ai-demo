"""Azure Document Intelligence Service Module"""
import os
import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# Check for dependencies
DEPENDENCIES_AVAILABLE = True
missing_deps = []

try:
    from azure.ai.translation.document import DocumentTranslationClient
    from azure.core.credentials import AzureKeyCredential
    from azure.core.exceptions import AzureError
except ImportError as e:
    DEPENDENCIES_AVAILABLE = False
    missing_deps.append("azure-ai-translation-document")

try:
    from azure.storage.blob import BlobServiceClient
    from azure.identity import DefaultAzureCredential
except ImportError as e:
    DEPENDENCIES_AVAILABLE = False
    missing_deps.append("azure-storage-blob, azure-identity")

# Basic health check endpoint (always available)
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    if DEPENDENCIES_AVAILABLE:
        try:
            # Try to check actual configuration
            translator_configured = bool(
                os.getenv("AZURE_TRANSLATOR_API_KEY") and
                os.getenv("AZURE_TRANSLATOR_ENDPOINT")
            )
            storage_configured = bool(os.getenv("AZURE_STORAGE_ACCOUNT_NAME"))

            return {
                "service": "Document Intelligence",
                "status": "healthy" if translator_configured and storage_configured else "configuration_incomplete",
                "dependencies_available": True,
                "translator_configured": translator_configured,
                "storage_configured": storage_configured,
                "message": "Service ready for document translation" if translator_configured and storage_configured else "Check environment configuration"
            }
        except Exception as e:
            return {
                "service": "Document Intelligence",
                "status": "error",
                "dependencies_available": True,
                "error": str(e),
                "message": "Service available but configuration check failed"
            }
    else:
        return {
            "service": "Document Intelligence",
            "status": "dependencies_missing",
            "dependencies_available": False,
            "missing_dependencies": missing_deps,
            "message": f"Install missing packages: {', '.join(missing_deps)}"
        }

# Stub endpoints when dependencies are missing
if not DEPENDENCIES_AVAILABLE:
    logger.warning(f"Document Intelligence running in limited mode - missing dependencies: {', '.join(missing_deps)}")

    @router.post("/upload")
    async def upload_stub():
        return {"error": "Service not available", "missing_dependencies": missing_deps}

    @router.post("/translate")
    async def translate_stub():
        return {"error": "Service not available", "missing_dependencies": missing_deps}

    @router.get("/job/{job_id}")
    async def job_status_stub(job_id: str):
        return {"error": "Service not available", "missing_dependencies": missing_deps}

    @router.get("/download/{blob_name}")
    async def download_stub(blob_name: str):
        return {"error": "Service not available", "missing_dependencies": missing_deps}

else:
    # Import full functionality when dependencies are available
    logger.info("Document Intelligence service: All dependencies available - Full service enabled")

    try:
        # Import the full service implementation
        from .full_service import register_routes
        register_routes(router)
        logger.info("Document Intelligence service: Full functionality enabled")
    except ImportError as e:
        logger.error(f"Failed to load full Document Intelligence service: {e}")

        @router.post("/upload")
        async def upload_error():
            return {"error": "Service configuration error", "details": str(e)}

        @router.post("/translate")
        async def translate_error():
            return {"error": "Service configuration error", "details": str(e)}