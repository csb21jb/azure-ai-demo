"""Azure Content Safety Service Module"""
import os
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ContentSafetyRequest(BaseModel):
    text: str
    categories: Optional[list] = ['Hate', 'Violence', 'Sexual', 'SelfHarm']

@router.post("/analyze")
async def analyze_content(request: Request, safety_request: ContentSafetyRequest):
    """Analyze content for safety issues"""
    try:
        endpoint = os.getenv("AZURE_CONTENT_SAFETY_ENDPOINT")
        api_key = os.getenv("AZURE_CONTENT_SAFETY_API_KEY")
        
        if not endpoint or not api_key:
            raise HTTPException(status_code=500, detail="Content Safety service not configured")
        
        url = f"{endpoint}/contentsafety/text:analyze?api-version=2023-10-01"
        headers = {
            'Ocp-Apim-Subscription-Key': api_key,
            'Content-Type': 'application/json'
        }
        data = {
            'text': safety_request.text,
            'categories': safety_request.categories
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        return {
            "success": True,
            "data": response.json()
        }
    except Exception as e:
        logger.error(f"Content Safety error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    """Check if Content Safety service is configured"""
    configured = bool(
        os.getenv("AZURE_CONTENT_SAFETY_API_KEY") and 
        os.getenv("AZURE_CONTENT_SAFETY_ENDPOINT")
    )
    return {
        "service": "Azure Content Safety",
        "configured": configured
    }