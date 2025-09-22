"""
Azure OpenAI Image Generation Service Module
Vertical slice architecture for DALL-E 3 integration
"""
import os
import json
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from openai import AzureOpenAI
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Initialize Azure OpenAI client for image generation
def get_image_client():
    """Initialize and return Azure OpenAI client for image generation"""
    return AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_IMAGE_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_IMAGE_API_VERSION", "2024-04-01-preview")
    )

# Pydantic models for request/response
class ImageGenerationRequest(BaseModel):
    prompt: str
    size: Optional[str] = "1024x1024"
    quality: Optional[str] = "standard"
    style: Optional[str] = "vivid"
    n: Optional[int] = 1

# API Endpoints
@router.post("/generate")
async def generate_image(request: Request, image_request: ImageGenerationRequest):
    """
    Generate an image using Azure OpenAI DALL-E 3
    """
    try:
        client = get_image_client()
        
        # Validate prompt length
        if len(image_request.prompt.strip()) < 5:
            raise HTTPException(status_code=400, detail="Prompt must be at least 5 characters long")
        
        # Get deployment name from environment
        deployment = os.getenv("AZURE_OPENAI_IMAGE_DEPLOYMENT_NAME", "dall-e-3")
        
        # Generate image using DALL-E 3
        result = client.images.generate(
            model=deployment,
            prompt=image_request.prompt,
            size=image_request.size,
            quality=image_request.quality,
            style=image_request.style,
            n=image_request.n
        )
        
        # Extract image URL from response
        image_data = json.loads(result.model_dump_json())
        image_url = image_data['data'][0]['url']
        
        return {
            "success": True,
            "data": {
                "image_url": image_url,
                "prompt": image_request.prompt,
                "size": image_request.size,
                "quality": image_request.quality,
                "style": image_request.style,
                "model": deployment
            }
        }
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Image generation error: {error_message}")
        
        # Provide user-friendly error messages
        if "content_policy_violation" in error_message.lower():
            error_message = "The image prompt was rejected due to content policy. Please try a different description."
        elif "insufficient_quota" in error_message.lower():
            error_message = "Insufficient quota to generate image. Please try again later."
        elif "rate_limit" in error_message.lower():
            error_message = "Rate limit exceeded. Please wait a moment before generating another image."
        
        raise HTTPException(status_code=500, detail=error_message)

@router.get("/samples")
async def get_sample_prompts():
    """
    Get sample image generation prompts
    """
    samples = [
        {
            "title": "Artistic Landscape",
            "prompt": "A serene mountain landscape at sunset with vibrant orange and purple skies, painted in watercolor style",
            "category": "Art"
        },
        {
            "title": "Futuristic City",
            "prompt": "A futuristic cityscape with flying cars and neon lights, cyberpunk style, highly detailed",
            "category": "Sci-Fi"
        },
        {
            "title": "Abstract Art",
            "prompt": "An abstract composition with flowing geometric shapes in blue and gold, modern minimalist style",
            "category": "Abstract"
        },
        {
            "title": "Fantasy Character",
            "prompt": "A magical wizard casting spells in an enchanted forest, fantasy art style with glowing effects",
            "category": "Fantasy"
        },
        {
            "title": "Photorealistic Portrait",
            "prompt": "A professional headshot of a confident business person in modern office setting, photorealistic",
            "category": "Portrait"
        },
        {
            "title": "Nature Scene",
            "prompt": "A peaceful zen garden with cherry blossoms, stone pathway, and koi pond, Japanese style",
            "category": "Nature"
        }
    ]
    
    return {
        "success": True,
        "data": {
            "samples": samples
        }
    }

# Health check for this service
@router.get("/health")
async def health():
    """Check if Azure OpenAI Image Generation service is configured"""
    configured = bool(
        os.getenv("AZURE_OPENAI_IMAGE_API_KEY") and 
        os.getenv("AZURE_OPENAI_ENDPOINT")
    )
    return {
        "service": "Azure OpenAI Image Generation",
        "configured": configured,
        "deployment": os.getenv("AZURE_OPENAI_IMAGE_DEPLOYMENT_NAME", "Not configured"),
        "api_version": os.getenv("AZURE_OPENAI_IMAGE_API_VERSION", "Not configured")
    }