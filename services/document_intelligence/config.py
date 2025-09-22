"""Configuration for Azure Document Intelligence Service"""
import os
from typing import Optional
from dataclasses import dataclass

@dataclass
class DocumentIntelligenceConfig:
    """Configuration settings for Document Intelligence service"""

    # Azure Translator Service Configuration
    translator_endpoint: str  # Document Translation batch endpoint
    translator_text_endpoint: str  # Text Translation endpoint for languages
    translator_api_key: str
    translator_region: str

    # Azure Storage Configuration
    storage_account_name: str
    storage_account_key: Optional[str] = None

    # Container Configuration
    source_container_name: str = "document-source"
    target_container_name: str = "document-target"

    # Security Configuration
    use_managed_identity: bool = True
    sas_token_expiry_hours: int = 1
    max_file_size_mb: int = 100

    # Supported file formats
    supported_formats: tuple = (
        '.pdf', '.docx', '.pptx', '.xlsx',
        '.html', '.txt', '.rtf', '.odt'
    )

def get_config() -> DocumentIntelligenceConfig:
    """Get configuration from environment variables"""

    # Required environment variables
    translator_endpoint = os.getenv("AZURE_TRANSLATOR_ENDPOINT")
    translator_text_endpoint = os.getenv("AZURE_TRANSLATOR_TEXT_ENDPOINT", "https://api.cognitive.microsofttranslator.com")
    translator_api_key = os.getenv("AZURE_TRANSLATOR_API_KEY")
    translator_region = os.getenv("AZURE_TRANSLATOR_REGION")
    storage_account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")

    if not all([translator_endpoint, translator_api_key, translator_region, storage_account_name]):
        missing = []
        if not translator_endpoint:
            missing.append("AZURE_TRANSLATOR_ENDPOINT")
        if not translator_api_key:
            missing.append("AZURE_TRANSLATOR_API_KEY")
        if not translator_region:
            missing.append("AZURE_TRANSLATOR_REGION")
        if not storage_account_name:
            missing.append("AZURE_STORAGE_ACCOUNT_NAME")

        raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

    # Optional configurations
    storage_account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
    use_managed_identity = os.getenv("USE_MANAGED_IDENTITY", "true").lower() == "true"

    # Container names
    source_container = os.getenv("DOCUMENT_SOURCE_CONTAINER", "document-source")
    target_container = os.getenv("DOCUMENT_TARGET_CONTAINER", "document-target")

    # Security settings
    sas_expiry_hours = int(os.getenv("SAS_TOKEN_EXPIRY_HOURS", "1"))
    max_file_size = int(os.getenv("MAX_FILE_SIZE_MB", "100"))

    return DocumentIntelligenceConfig(
        translator_endpoint=translator_endpoint,
        translator_text_endpoint=translator_text_endpoint,
        translator_api_key=translator_api_key,
        translator_region=translator_region,
        storage_account_name=storage_account_name,
        storage_account_key=storage_account_key,
        source_container_name=source_container,
        target_container_name=target_container,
        use_managed_identity=use_managed_identity,
        sas_token_expiry_hours=sas_expiry_hours,
        max_file_size_mb=max_file_size
    )

def validate_file_format(filename: str) -> bool:
    """Validate if file format is supported"""
    config = get_config()
    return any(filename.lower().endswith(fmt) for fmt in config.supported_formats)

def validate_file_size(file_size_bytes: int) -> bool:
    """Validate if file size is within limits"""
    config = get_config()
    max_size_bytes = config.max_file_size_mb * 1024 * 1024
    return file_size_bytes <= max_size_bytes