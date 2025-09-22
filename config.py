"""
Central Configuration Management
Handles all environment variables and service configuration
"""
import os
from typing import Dict, Any, Optional
from dataclasses import dataclass
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class AzureOpenAIConfig:
    """Azure OpenAI Configuration"""
    endpoint: str
    api_key: str
    deployment_name: str
    api_version: str
    
    @classmethod
    def from_env(cls) -> Optional['AzureOpenAIConfig']:
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
        api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-05-01-preview")
        
        if not endpoint or not api_key:
            return None
            
        return cls(
            endpoint=endpoint,
            api_key=api_key,
            deployment_name=deployment_name,
            api_version=api_version
        )

@dataclass
class AzureVisionConfig:
    """Azure Computer Vision Configuration"""
    endpoint: str
    api_key: str
    
    @classmethod
    def from_env(cls) -> Optional['AzureVisionConfig']:
        endpoint = os.getenv("AZURE_VISION_ENDPOINT")
        api_key = os.getenv("AZURE_VISION_API_KEY")
        
        if not endpoint or not api_key:
            return None
            
        return cls(endpoint=endpoint, api_key=api_key)

@dataclass
class AzureSpeechConfig:
    """Azure Speech Services Configuration"""
    endpoint: str
    api_key: str
    region: str
    
    @classmethod
    def from_env(cls) -> Optional['AzureSpeechConfig']:
        endpoint = os.getenv("AZURE_SPEECH_ENDPOINT")
        api_key = os.getenv("AZURE_SPEECH_API_KEY")
        region = os.getenv("AZURE_SPEECH_REGION")
        
        if not endpoint or not api_key or not region:
            return None
            
        return cls(endpoint=endpoint, api_key=api_key, region=region)

@dataclass
class AzureLanguageConfig:
    """Azure Language Services Configuration"""
    endpoint: str
    api_key: str
    
    @classmethod
    def from_env(cls) -> Optional['AzureLanguageConfig']:
        endpoint = os.getenv("AZURE_LANGUAGE_ENDPOINT")
        api_key = os.getenv("AZURE_LANGUAGE_API_KEY")
        
        if not endpoint or not api_key:
            return None
            
        return cls(endpoint=endpoint, api_key=api_key)

@dataclass
class AzureTranslatorConfig:
    """Azure Translator Configuration"""
    endpoint: str
    api_key: str
    region: str
    
    @classmethod
    def from_env(cls) -> Optional['AzureTranslatorConfig']:
        endpoint = os.getenv("AZURE_TRANSLATOR_ENDPOINT")
        api_key = os.getenv("AZURE_TRANSLATOR_API_KEY")
        region = os.getenv("AZURE_TRANSLATOR_REGION")
        
        if not endpoint or not api_key or not region:
            return None
            
        return cls(endpoint=endpoint, api_key=api_key, region=region)

@dataclass
class AzureContentSafetyConfig:
    """Azure Content Safety Configuration"""
    endpoint: str
    api_key: str
    
    @classmethod
    def from_env(cls) -> Optional['AzureContentSafetyConfig']:
        endpoint = os.getenv("AZURE_CONTENT_SAFETY_ENDPOINT")
        api_key = os.getenv("AZURE_CONTENT_SAFETY_API_KEY")
        
        if not endpoint or not api_key:
            return None
            
        return cls(endpoint=endpoint, api_key=api_key)

@dataclass
class ServerConfig:
    """Server Configuration"""
    port: int
    environment: str
    cors_origin: str
    api_rate_limit_max: int
    api_rate_limit_window_ms: int
    ssl_enabled: bool
    ssl_cert_path: str
    ssl_key_path: str

    @classmethod
    def from_env(cls) -> 'ServerConfig':
        ssl_enabled = os.getenv("SSL_ENABLED", "true").lower() == "true"
        protocol = "https" if ssl_enabled else "http"
        default_port = 8443 if ssl_enabled else 8000

        return cls(
            port=int(os.getenv("PORT", default_port)),
            environment=os.getenv("NODE_ENV", "development"),
            cors_origin=os.getenv("CORS_ORIGIN", f"{protocol}://localhost:{int(os.getenv('PORT', default_port))}"),
            api_rate_limit_max=int(os.getenv("API_RATE_LIMIT_MAX", 100)),
            api_rate_limit_window_ms=int(os.getenv("API_RATE_LIMIT_WINDOW_MS", 900000)),
            ssl_enabled=ssl_enabled,
            ssl_cert_path=os.getenv("SSL_CERT_PATH", "ssl/cert.pem"),
            ssl_key_path=os.getenv("SSL_KEY_PATH", "ssl/key.pem")
        )

class ConfigManager:
    """Central configuration manager for all Azure services"""
    
    def __init__(self):
        self.openai = AzureOpenAIConfig.from_env()
        self.vision = AzureVisionConfig.from_env()
        self.speech = AzureSpeechConfig.from_env()
        self.language = AzureLanguageConfig.from_env()
        self.translator = AzureTranslatorConfig.from_env()
        self.content_safety = AzureContentSafetyConfig.from_env()
        self.server = ServerConfig.from_env()
    
    def get_service_status(self) -> Dict[str, bool]:
        """Get configuration status for all services"""
        return {
            "openai": self.openai is not None,
            "vision": self.vision is not None,
            "speech": self.speech is not None,
            "language": self.language is not None,
            "translator": self.translator is not None,
            "content_safety": self.content_safety is not None
        }
    
    def get_configured_services(self) -> Dict[str, Any]:
        """Get details of configured services (without sensitive data)"""
        result = {}
        
        if self.openai:
            result["openai"] = {
                "deployment": self.openai.deployment_name,
                "api_version": self.openai.api_version
            }
        
        if self.speech:
            result["speech"] = {
                "region": self.speech.region
            }
        
        if self.translator:
            result["translator"] = {
                "region": self.translator.region
            }
        
        # Add other services as needed
        return result
    
    def validate_required_services(self, services: list) -> Dict[str, str]:
        """Validate that required services are configured"""
        errors = {}
        
        for service in services:
            if service == "openai" and not self.openai:
                errors["openai"] = "Azure OpenAI is not configured"
            elif service == "vision" and not self.vision:
                errors["vision"] = "Azure Computer Vision is not configured"
            elif service == "speech" and not self.speech:
                errors["speech"] = "Azure Speech Services is not configured"
            elif service == "language" and not self.language:
                errors["language"] = "Azure Language Services is not configured"
            elif service == "translator" and not self.translator:
                errors["translator"] = "Azure Translator is not configured"
            elif service == "content_safety" and not self.content_safety:
                errors["content_safety"] = "Azure Content Safety is not configured"
        
        return errors
    
    def get_missing_env_vars(self) -> Dict[str, list]:
        """Get missing environment variables for each service"""
        missing = {}
        
        if not self.openai:
            missing["openai"] = ["AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_API_KEY"]
        
        if not self.vision:
            missing["vision"] = ["AZURE_VISION_ENDPOINT", "AZURE_VISION_API_KEY"]
        
        if not self.speech:
            missing["speech"] = ["AZURE_SPEECH_ENDPOINT", "AZURE_SPEECH_API_KEY", "AZURE_SPEECH_REGION"]
        
        if not self.language:
            missing["language"] = ["AZURE_LANGUAGE_ENDPOINT", "AZURE_LANGUAGE_API_KEY"]
        
        if not self.translator:
            missing["translator"] = ["AZURE_TRANSLATOR_ENDPOINT", "AZURE_TRANSLATOR_API_KEY", "AZURE_TRANSLATOR_REGION"]
        
        if not self.content_safety:
            missing["content_safety"] = ["AZURE_CONTENT_SAFETY_ENDPOINT", "AZURE_CONTENT_SAFETY_API_KEY"]
        
        return missing

# Global configuration instance
config = ConfigManager()

# Export commonly used configurations
def get_config() -> ConfigManager:
    """Get the global configuration manager"""
    return config

def validate_service_config(service_name: str) -> bool:
    """Validate if a specific service is configured"""
    status = config.get_service_status()
    return status.get(service_name, False)

def get_service_config(service_name: str) -> Optional[Any]:
    """Get configuration for a specific service"""
    service_map = {
        "openai": config.openai,
        "vision": config.vision,
        "speech": config.speech,
        "language": config.language,
        "translator": config.translator,
        "content_safety": config.content_safety
    }
    return service_map.get(service_name)