"""Azure Computer Vision Service Module"""
import os
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ImageAnalysisRequest(BaseModel):
    image_url: str
    features: Optional[list] = ['Description', 'Tags', 'Objects']

@router.post("/analyze")
async def analyze_image(request: Request, analysis_request: ImageAnalysisRequest):
    """Analyze an image using Azure Computer Vision"""
    try:
        endpoint = os.getenv("AZURE_VISION_ENDPOINT")
        api_key = os.getenv("AZURE_VISION_API_KEY")
        
        if not endpoint or not api_key:
            raise HTTPException(status_code=500, detail="Vision service not configured")
        
        url = f"{endpoint}/vision/v3.2/analyze"
        headers = {
            'Ocp-Apim-Subscription-Key': api_key,
            'Content-Type': 'application/json'
        }
        params = {
            'visualFeatures': ','.join(analysis_request.features)
        }
        data = {'url': analysis_request.image_url}
        
        response = requests.post(url, headers=headers, params=params, json=data)
        response.raise_for_status()
        
        return {
            "success": True,
            "data": response.json()
        }
    except Exception as e:
        logger.error(f"Vision API error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    """Check if Computer Vision service is configured"""
    configured = bool(
        os.getenv("AZURE_VISION_API_KEY") and 
        os.getenv("AZURE_VISION_ENDPOINT")
    )
    return {
        "service": "Azure Computer Vision",
        "configured": configured
    }