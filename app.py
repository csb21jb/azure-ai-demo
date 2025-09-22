"""
FastAPI Backend Server for Azure AI Services
Author: Chris Brown
"""
import os
import time
import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
# Rate limiting temporarily disabled for simplicity
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Visitor tracking file
VISITOR_STATS_FILE = Path("visitor-stats.json")

# Initialize visitor stats if file doesn't exist
if not VISITOR_STATS_FILE.exists():
    VISITOR_STATS_FILE.write_text(json.dumps({
        "totalVisitors": 0,
        "dailyVisitors": {},
        "lastReset": time.strftime("%Y-%m-%dT%H:%M:%S")
    }, indent=2))

# Track unique visitors in memory
visited_sessions = set()

def read_visitor_stats():
    """Read visitor stats from file"""
    try:
        return json.loads(VISITOR_STATS_FILE.read_text())
    except Exception:
        return {
            "totalVisitors": 0,
            "dailyVisitors": {},
            "lastReset": time.strftime("%Y-%m-%dT%H:%M:%S")
        }

def write_visitor_stats(stats):
    """Write visitor stats to file"""
    try:
        VISITOR_STATS_FILE.write_text(json.dumps(stats, indent=2))
    except Exception as e:
        logger.error(f"Error writing visitor stats: {e}")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Azure AI Services API",
    description="Production-ready API for Azure AI Services integration",
    version="2.0.0"
)

# Rate limiting temporarily disabled
# limiter = Limiter(key_func=get_remote_address)
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
from config import get_config
config = get_config()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        config.server.cors_origin,
        "https://localhost:8443",
        "http://localhost:8000",
        "https://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import service modules
from services.azure_openai import router as openai_router
from services.computer_vision import router as vision_router
from services.speech import router as speech_router
from services.language import router as language_router
from services.translator import router as translator_router
from services.content_safety import router as safety_router
from services.image_generation import router as image_router
from services.document_intelligence import router as document_intelligence_router

# Include routers
app.include_router(openai_router, prefix="/api/openai", tags=["OpenAI"])
app.include_router(vision_router, prefix="/api/vision", tags=["Computer Vision"])
app.include_router(speech_router, prefix="/api/speech", tags=["Speech"])
app.include_router(language_router, prefix="/api/language", tags=["Language"])
app.include_router(translator_router, prefix="/api/translator", tags=["Translator"])
app.include_router(safety_router, prefix="/api/content-safety", tags=["Content Safety"])
app.include_router(image_router, prefix="/api/image-generation", tags=["Image Generation"])
app.include_router(document_intelligence_router, prefix="/api/document-intelligence", tags=["Document Intelligence"])

# Visitor tracking middleware
@app.middleware("http")
async def track_visitors(request: Request, call_next):
    """Track unique visitors for main page requests"""
    # Only track HTML page requests, not API or asset requests
    if request.url.path in ["/", "/index.html"]:
        # Create a session identifier
        client_host = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        session_id = f"{client_host}:{user_agent}"

        # Only count if this session hasn't been counted yet
        if session_id not in visited_sessions:
            visited_sessions.add(session_id)

            stats = read_visitor_stats()
            stats["totalVisitors"] = stats.get("totalVisitors", 0) + 1

            # Track daily visitors
            today = time.strftime("%Y-%m-%d")
            if "dailyVisitors" not in stats:
                stats["dailyVisitors"] = {}
            stats["dailyVisitors"][today] = stats["dailyVisitors"].get(today, 0) + 1

            write_visitor_stats(stats)

    response = await call_next(request)
    return response

# Visitor stats endpoint
@app.get("/api/visitor-stats")
async def get_visitor_stats():
    """Get visitor statistics"""
    try:
        stats = read_visitor_stats()
        return {
            "success": True,
            "totalVisitors": stats.get("totalVisitors", 0)
        }
    except Exception as e:
        logger.error(f"Error reading visitor stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve visitor stats")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "environment": os.getenv("NODE_ENV", "development")
    }

# Configuration status endpoint
@app.get("/api/config/status")
async def config_status():
    """Check which services are configured"""
    return {
        "configured": {
            "openai": bool(os.getenv("AZURE_OPENAI_API_KEY") and os.getenv("AZURE_OPENAI_ENDPOINT")),
            "vision": bool(os.getenv("AZURE_VISION_API_KEY") and os.getenv("AZURE_VISION_ENDPOINT")),
            "speech": bool(os.getenv("AZURE_SPEECH_API_KEY") and os.getenv("AZURE_SPEECH_ENDPOINT")),
            "language": bool(os.getenv("AZURE_LANGUAGE_API_KEY") and os.getenv("AZURE_LANGUAGE_ENDPOINT")),
            "translator": bool(os.getenv("AZURE_TRANSLATOR_API_KEY") and os.getenv("AZURE_TRANSLATOR_ENDPOINT")),
            "contentSafety": bool(os.getenv("AZURE_CONTENT_SAFETY_API_KEY") and os.getenv("AZURE_CONTENT_SAFETY_ENDPOINT")),
            "documentIntelligence": bool(os.getenv("AZURE_TRANSLATOR_API_KEY") and os.getenv("AZURE_STORAGE_ACCOUNT_NAME"))
        }
    }

# Mount static files
app.mount("/styles", StaticFiles(directory="styles"), name="styles")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/services", StaticFiles(directory="services"), name="services")

# Serve index.html for all other routes (SPA support)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Serve the SPA for all routes"""
    return FileResponse("index.html")

# Run the application
if __name__ == "__main__":
    import uvicorn
    from config import get_config

    config = get_config()
    port = config.server.port

    # SSL configuration
    ssl_config = {}
    if config.server.ssl_enabled:
        ssl_config = {
            "ssl_keyfile": config.server.ssl_key_path,
            "ssl_certfile": config.server.ssl_cert_path
        }

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=config.server.environment == "development",
        log_level="info",
        **ssl_config
    )