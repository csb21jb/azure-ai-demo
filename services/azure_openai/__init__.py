"""
Azure OpenAI Service Module
Vertical slice architecture for Azure OpenAI integration
"""
import os
import time
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from openai import AzureOpenAI
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Initialize Azure OpenAI client
def get_openai_client():
    """Initialize and return Azure OpenAI client"""
    return AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-05-01-preview")
    )

# Pydantic models for request/response
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    temperature: Optional[float] = 1.0
    max_tokens: Optional[int] = 1000
    top_p: Optional[float] = 1.0

class AssistantRequest(BaseModel):
    instructions: Optional[str] = ""
    tools: Optional[List[Dict]] = []
    tool_resources: Optional[Dict] = {}
    temperature: Optional[float] = 1.0
    top_p: Optional[float] = 1.0

class ThreadMessageRequest(BaseModel):
    thread_id: str
    content: str

class RunRequest(BaseModel):
    thread_id: str
    assistant_id: str

class RealtimeRequest(BaseModel):
    message: str
    outputModalities: Optional[List[str]] = ["text", "audio"]
    voiceType: Optional[str] = "azure"  # "browser" or "azure"
    voiceName: Optional[str] = "en-US-AriaNeural"  # Azure voice name

# API Endpoints
@router.post("/chat")
async def chat_completion(request: Request, chat_request: ChatRequest):
    """
    Create a chat completion using Azure OpenAI
    """
    try:
        client = get_openai_client()
        
        completion = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o"),
            messages=chat_request.messages,
            temperature=chat_request.temperature,
            max_tokens=chat_request.max_tokens,
            top_p=chat_request.top_p
        )
        
        return {
            "success": True,
            "data": {
                "content": completion.choices[0].message.content,
                "role": completion.choices[0].message.role,
                "finish_reason": completion.choices[0].finish_reason
            }
        }
    except Exception as e:
        logger.error(f"OpenAI chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assistant/create")
async def create_assistant(request: Request, assistant_request: AssistantRequest):
    """
    Create an Azure OpenAI Assistant
    """
    try:
        client = get_openai_client()
        
        # Create assistant with only supported parameters
        create_params = {
            "model": os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o"),
            "instructions": assistant_request.instructions,
        }
        
        # Add optional parameters if provided
        if assistant_request.tools:
            create_params["tools"] = assistant_request.tools
            
        assistant = client.beta.assistants.create(**create_params)
        
        return {
            "success": True,
            "data": {
                "assistant_id": assistant.id,
                "created_at": assistant.created_at,
                "model": assistant.model,
                "instructions": assistant.instructions
            }
        }
    except Exception as e:
        logger.error(f"Assistant creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assistant/thread")
async def create_thread(request: Request):
    """
    Create a new conversation thread
    """
    try:
        client = get_openai_client()
        thread = client.beta.threads.create()
        
        return {
            "success": True,
            "data": {
                "thread_id": thread.id,
                "created_at": thread.created_at
            }
        }
    except Exception as e:
        logger.error(f"Thread creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assistant/message")
async def add_message(request: Request, message_request: ThreadMessageRequest):
    """
    Add a message to a thread
    """
    try:
        client = get_openai_client()
        
        message = client.beta.threads.messages.create(
            thread_id=message_request.thread_id,
            role="user",
            content=message_request.content
        )
        
        return {
            "success": True,
            "data": {
                "message_id": message.id,
                "created_at": message.created_at,
                "content": message.content[0].text.value if message.content else ""
            }
        }
    except Exception as e:
        logger.error(f"Message creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assistant/run")
async def run_assistant(request: Request, run_request: RunRequest):
    """
    Run an assistant on a thread
    """
    try:
        client = get_openai_client()
        
        # Create the run
        run = client.beta.threads.runs.create(
            thread_id=run_request.thread_id,
            assistant_id=run_request.assistant_id
        )
        
        # Poll for completion
        while run.status in ['queued', 'in_progress', 'cancelling']:
            time.sleep(1)
            run = client.beta.threads.runs.retrieve(
                thread_id=run_request.thread_id,
                run_id=run.id
            )
        
        if run.status == 'completed':
            messages = client.beta.threads.messages.list(
                thread_id=run_request.thread_id
            )
            
            # Get the latest assistant message
            assistant_messages = [
                msg for msg in messages.data 
                if msg.role == "assistant"
            ]
            
            latest_response = ""
            if assistant_messages:
                latest_response = assistant_messages[0].content[0].text.value
            
            return {
                "success": True,
                "data": {
                    "run_id": run.id,
                    "status": run.status,
                    "response": latest_response,
                    "messages": [
                        {
                            "role": msg.role,
                            "content": msg.content[0].text.value if msg.content else ""
                        }
                        for msg in messages.data[:5]  # Return last 5 messages
                    ]
                }
            }
        else:
            return {
                "success": False,
                "error": f"Run failed with status: {run.status}",
                "data": {
                    "run_id": run.id,
                    "status": run.status
                }
            }
    except Exception as e:
        logger.error(f"Run execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/realtime")
async def realtime_api(request: Request, realtime_request: RealtimeRequest):
    """
    Handle text input and provide both text and audio output using Azure OpenAI
    Note: Full WebSocket-based Realtime API implementation would require additional setup
    """
    try:
        client = get_openai_client()
        
        # Get text response from chat API
        completion = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o"),
            messages=[{"role": "user", "content": realtime_request.message}],
            temperature=0.7,
            max_tokens=500
        )
        
        text_response = completion.choices[0].message.content
        
        # Generate audio using Azure Speech Services (direct TTS, not avatar)
        audio_data = None
        video_url = None
        if "audio" in realtime_request.outputModalities and realtime_request.voiceType == "azure":
            try:
                import requests
                import base64
                
                # Get credentials from environment variables
                speech_endpoint = os.getenv("AZURE_SPEECH_ENDPOINT")
                logger.info(f"ENV VAR AZURE_SPEECH_ENDPOINT: {os.getenv('AZURE_SPEECH_ENDPOINT')}")
                if not speech_endpoint:
                    speech_endpoint = "https://eastus2.api.cognitive.microsoft.com"
                # Clean up endpoint URL (remove trailing slash if present)
                speech_endpoint = speech_endpoint.rstrip('/')
                speech_key = os.getenv("AZURE_SPEECH_API_KEY")
                
                if speech_key and speech_endpoint:
                    logger.info(f"Using Azure Speech Services TTS with endpoint: {speech_endpoint}, voice: {realtime_request.voiceName}")
                    
                    # Use direct TTS API for faster audio generation (not avatar)
                    api_version = "2024-08-01"
                    
                    # Use Speech Services Text-to-Speech REST API
                    # For eastus2 region, the correct TTS endpoint format
                    region = os.getenv("AZURE_SPEECH_REGION", "eastus2")
                    tts_url = f'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1'
                    
                    # Headers for TTS request
                    headers = {
                        'Ocp-Apim-Subscription-Key': speech_key,
                        'Content-Type': 'application/ssml+xml',
                        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
                        'User-Agent': 'Azure-AI-Services'
                    }
                    
                    # Create SSML for speech synthesis
                    voice_name = realtime_request.voiceName or 'en-US-AriaNeural'
                    ssml = f'''<speak version='1.0' xml:lang='en-US'>
                        <voice xml:lang='en-US' name='{voice_name}'>
                            {text_response}
                        </voice>
                    </speak>'''
                    
                    # Make TTS request
                    logger.info(f"Making TTS request to: {tts_url}")
                    response = requests.post(tts_url, headers=headers, data=ssml)
                    
                    if response.status_code == 200:
                        # Direct TTS returns audio immediately
                        audio_data = base64.b64encode(response.content).decode('utf-8')
                        logger.info(f"Successfully generated audio using Azure Speech Services TTS: {voice_name}")
                    else:
                        logger.error(f'Failed to generate TTS audio: [{response.status_code}], {response.text}')
                        logger.error(f'TTS URL was: {tts_url}')
                        # Note: Will fall back to browser TTS in frontend
                else:
                    logger.warning("Azure Speech Services credentials not configured")
                        
            except ImportError as e:
                logger.warning(f"Required library not available for avatar synthesis: {e}")
            except Exception as e:
                logger.error(f"Avatar synthesis error: {str(e)}")
        
        return {
            "success": True,
            "data": {
                "text": text_response,
                "audioData": audio_data,
                "videoUrl": video_url,
                "isVideo": bool(video_url and audio_data),
                "message": f"{'Avatar video' if video_url else 'Audio'} generated using {'Azure Speech Services (' + (realtime_request.voiceName or 'en-US-AvaMultilingualNeural') + ')' if audio_data else 'Browser Text-to-Speech'}" if "audio" in realtime_request.outputModalities else None
            }
        }
    except Exception as e:
        logger.error(f"Realtime API error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check for this service
@router.get("/health")
async def health():
    """Check if Azure OpenAI service is configured"""
    configured = bool(
        os.getenv("AZURE_OPENAI_API_KEY") and 
        os.getenv("AZURE_OPENAI_ENDPOINT")
    )
    return {
        "service": "Azure OpenAI",
        "configured": configured,
        "deployment": os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "Not configured")
    }