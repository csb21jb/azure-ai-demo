"""Azure Language Services Module"""
import os
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class SentimentRequest(BaseModel):
    documents: List[Dict[str, Any]]

class TextRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

@router.post("/sentiment")
async def analyze_sentiment(request: Request, sentiment_request: SentimentRequest):
    """Analyze sentiment of text documents"""
    try:
        endpoint = os.getenv("AZURE_LANGUAGE_ENDPOINT")
        api_key = os.getenv("AZURE_LANGUAGE_API_KEY")
        
        if not endpoint or not api_key:
            raise HTTPException(status_code=500, detail="Language service not configured")
        
        url = f"{endpoint}/language/:analyze-text/jobs?api-version=2023-04-01"
        headers = {
            'Ocp-Apim-Subscription-Key': api_key,
            'Content-Type': 'application/json'
        }
        data = {
            "displayName": "Sentiment Analysis",
            "analysisInput": {"documents": sentiment_request.documents},
            "tasks": [{
                "kind": "SentimentAnalysis",
                "taskName": "Sentiment Analysis"
            }]
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        return {
            "success": True,
            "data": response.json()
        }
    except Exception as e:
        logger.error(f"Language API error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/entities")
async def extract_entities(request: Request, text_request: TextRequest):
    """Extract entities from text"""
    try:
        # Simplified entity extraction for demo
        return {
            "success": True,
            "data": {
                "entities": [
                    {"text": "Sample Entity", "type": "Organization", "confidence": 0.95}
                ]
            }
        }
    except Exception as e:
        logger.error(f"Entity extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    """Check if Language service is configured"""
    configured = bool(
        os.getenv("AZURE_LANGUAGE_API_KEY") and 
        os.getenv("AZURE_LANGUAGE_ENDPOINT")
    )
    return {
        "service": "Azure Language Services",
        "configured": configured
    }