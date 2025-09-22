"""Azure Speech Services Module"""
import os
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/token")
async def get_speech_token(request: Request):
    """Get a speech token for client-side operations"""
    try:
        endpoint = os.getenv("AZURE_SPEECH_ENDPOINT")
        api_key = os.getenv("AZURE_SPEECH_API_KEY")
        region = os.getenv("AZURE_SPEECH_REGION")
        
        if not endpoint or not api_key:
            raise HTTPException(status_code=500, detail="Speech service not configured")
        
        url = f"{endpoint}/sts/v1.0/issueToken"
        headers = {
            'Ocp-Apim-Subscription-Key': api_key,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        
        return {
            "success": True,
            "token": response.text,
            "region": region
        }
    except Exception as e:
        logger.error(f"Speech token error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    """Check if Speech service is configured"""
    configured = bool(
        os.getenv("AZURE_SPEECH_API_KEY") and 
        os.getenv("AZURE_SPEECH_ENDPOINT")
    )
    return {
        "service": "Azure Speech Services",
        "configured": configured,
        "region": os.getenv("AZURE_SPEECH_REGION", "Not configured")
    }