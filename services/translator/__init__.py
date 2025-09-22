"""Azure Translator Service Module"""
import os
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    to: str
    from_lang: Optional[str] = None
    # Allow 'from' as an alias for 'from_lang' to support frontend compatibility
    class Config:
        fields = {'from_lang': {'alias': 'from'}}

@router.post("/translate")
async def translate_text(request: Request, translation_request: TranslationRequest):
    """Translate text using Azure Translator with fallback to simulated translations"""
    try:
        # Try to use the correct endpoint first, fall back to old one
        endpoint = os.getenv("AZURE_TRANSLATOR_TEXT_ENDPOINT") or os.getenv("AZURE_TRANSLATOR_ENDPOINT")
        api_key = os.getenv("AZURE_TRANSLATOR_API_KEY")
        region = os.getenv("AZURE_TRANSLATOR_REGION")

        # Try Azure Translator if configured
        if endpoint and api_key:
            try:
                # Fix endpoint format - ensure it's the correct Azure Translator API format
                # Expected format: https://<resource-name>.cognitiveservices.azure.com/translator/text/v3.0
                if not endpoint.endswith('/translator/text/v3.0'):
                    if endpoint.endswith('/'):
                        endpoint = endpoint.rstrip('/')
                    # If it's the old format, convert it
                    if 'api.cognitive.microsoft.com' in endpoint:
                        # Extract region from old format if present
                        import re
                        match = re.match(r'https://([^.]+)\.api\.cognitive\.microsoft\.com', endpoint)
                        if match:
                            region = match.group(1)
                            # Use global endpoint with region header
                            endpoint = 'https://api.cognitive.microsofttranslator.com'
                    elif 'cognitiveservices.azure.com' in endpoint and '/translator/text/v3.0' not in endpoint:
                        endpoint = f"{endpoint}/translator/text/v3.0"
                    else:
                        # Default to global endpoint
                        endpoint = 'https://api.cognitive.microsofttranslator.com'

                # Build URL with parameters
                url = f"{endpoint}/translate?api-version=3.0&to={translation_request.to}"
                if translation_request.from_lang:
                    url += f"&from={translation_request.from_lang}"

                headers = {
                    'Ocp-Apim-Subscription-Key': api_key,
                    'Ocp-Apim-Subscription-Region': region or 'eastus',
                    'Content-Type': 'application/json'
                }

                data = [{'text': translation_request.text}]

                response = requests.post(url, headers=headers, json=data, timeout=5)
                response.raise_for_status()

                # Format response
                result = response.json()
                if result and len(result) > 0 and 'translations' in result[0]:
                    return {
                        "success": True,
                        "data": {
                            "translation": result[0]['translations'][0]['text'],
                            "detectedLanguage": result[0].get('detectedLanguage'),
                            "raw": result
                        }
                    }
            except Exception as e:
                logger.warning(f"Azure Translator failed, falling back to simulation: {str(e)}")

        # Fallback to simulated translations
        simulated_translations = {
            'hello': {'es': 'hola', 'fr': 'bonjour', 'de': 'hallo', 'ja': 'こんにちは', 'zh-Hans': '你好', 'it': 'ciao', 'pt': 'olá'},
            'thank you': {'es': 'gracias', 'fr': 'merci', 'de': 'danke', 'ja': 'ありがとう', 'zh-Hans': '谢谢', 'it': 'grazie', 'pt': 'obrigado'},
            'goodbye': {'es': 'adiós', 'fr': 'au revoir', 'de': 'auf wiedersehen', 'ja': 'さようなら', 'zh-Hans': '再见', 'it': 'arrivederci', 'pt': 'adeus'},
            'good morning': {'es': 'buenos días', 'fr': 'bonjour', 'de': 'guten morgen', 'ja': 'おはよう', 'zh-Hans': '早上好', 'it': 'buongiorno', 'pt': 'bom dia'},
            'good evening': {'es': 'buenas tardes', 'fr': 'bonsoir', 'de': 'guten abend', 'ja': 'こんばんは', 'zh-Hans': '晚上好', 'it': 'buona sera', 'pt': 'boa noite'},
            'yes': {'es': 'sí', 'fr': 'oui', 'de': 'ja', 'ja': 'はい', 'zh-Hans': '是', 'it': 'sì', 'pt': 'sim'},
            'no': {'es': 'no', 'fr': 'non', 'de': 'nein', 'ja': 'いいえ', 'zh-Hans': '不', 'it': 'no', 'pt': 'não'},
            'please': {'es': 'por favor', 'fr': "s'il vous plaît", 'de': 'bitte', 'ja': 'お願いします', 'zh-Hans': '请', 'it': 'per favore', 'pt': 'por favor'},
            # Japanese to other languages
            'こんにちは': {'en': 'hello', 'es': 'hola', 'fr': 'bonjour', 'de': 'hallo'},
            'ありがとう': {'en': 'thank you', 'es': 'gracias', 'fr': 'merci', 'de': 'danke'},
            'さようなら': {'en': 'goodbye', 'es': 'adiós', 'fr': 'au revoir', 'de': 'auf wiedersehen'},
            'おはよう': {'en': 'good morning', 'es': 'buenos días', 'fr': 'bonjour', 'de': 'guten morgen'},
            'こんばんは': {'en': 'good evening', 'es': 'buenas tardes', 'fr': 'bonsoir', 'de': 'guten abend'},
            # Spanish to other languages
            'hola': {'en': 'hello', 'fr': 'bonjour', 'de': 'hallo', 'ja': 'こんにちは'},
            'gracias': {'en': 'thank you', 'fr': 'merci', 'de': 'danke', 'ja': 'ありがとう'},
            'adiós': {'en': 'goodbye', 'fr': 'au revoir', 'de': 'auf wiedersehen', 'ja': 'さようなら'},
            'buenos días': {'en': 'good morning', 'fr': 'bonjour', 'de': 'guten morgen', 'ja': 'おはよう'},
            'buenas tardes': {'en': 'good evening', 'fr': 'bonsoir', 'de': 'guten abend', 'ja': 'こんばんは'}
        }

        # Try to find a simulated translation
        lower_text = translation_request.text.lower().strip()
        translation = translation_request.text  # Default to original text

        if lower_text in simulated_translations and translation_request.to in simulated_translations[lower_text]:
            translation = simulated_translations[lower_text][translation_request.to]
        else:
            # Return a demo translation indicator
            lang_names = {
                'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
                'ja': 'Japanese', 'ko': 'Korean', 'zh-Hans': 'Chinese (Simplified)',
                'zh-Hant': 'Chinese (Traditional)', 'ru': 'Russian', 'ar': 'Arabic',
                'hi': 'Hindi', 'it': 'Italian', 'pt': 'Portuguese'
            }
            translation = f"[Demo translation to {lang_names.get(translation_request.to, translation_request.to)}]: {translation_request.text}"

        return {
            "success": True,
            "data": {
                "translation": translation,
                "detectedLanguage": {"language": translation_request.from_lang or "auto", "score": 1.0} if translation_request.from_lang else None,
                "isDemo": True
            }
        }

    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        # Return a graceful error response with the original text
        return {
            "success": True,
            "data": {
                "translation": f"[Translation error]: {translation_request.text}",
                "error": str(e),
                "isDemo": True
            }
        }

@router.get("/health")
async def health():
    """Check if Translator service is configured"""
    configured = bool(
        os.getenv("AZURE_TRANSLATOR_API_KEY") and 
        os.getenv("AZURE_TRANSLATOR_ENDPOINT")
    )
    return {
        "service": "Azure Translator",
        "configured": configured,
        "region": os.getenv("AZURE_TRANSLATOR_REGION", "Not configured")
    }