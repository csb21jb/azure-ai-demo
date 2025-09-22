"""Security utilities for Document Intelligence service"""
import os
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions, generate_container_sas, ContainerSasPermissions
from azure.identity import DefaultAzureCredential, ManagedIdentityCredential
from azure.core.exceptions import AzureError
from .config import get_config

logger = logging.getLogger(__name__)

class SecurityManager:
    """Manages security operations for Document Intelligence"""

    def __init__(self):
        self.config = get_config()
        self._blob_service_client: Optional[BlobServiceClient] = None

    def get_blob_service_client(self) -> BlobServiceClient:
        """Get blob service client with appropriate authentication"""
        if self._blob_service_client is None:
            try:
                if self.config.use_managed_identity:
                    # Use managed identity for authentication
                    credential = DefaultAzureCredential()
                    account_url = f"https://{self.config.storage_account_name}.blob.core.windows.net"
                    self._blob_service_client = BlobServiceClient(
                        account_url=account_url,
                        credential=credential
                    )
                    logger.info("Using managed identity for blob storage authentication")
                else:
                    # Use account key for authentication
                    if not self.config.storage_account_key:
                        raise ValueError("Storage account key required when managed identity is disabled")

                    account_url = f"https://{self.config.storage_account_name}.blob.core.windows.net"
                    self._blob_service_client = BlobServiceClient(
                        account_url=account_url,
                        credential=self.config.storage_account_key
                    )
                    logger.info("Using account key for blob storage authentication")

            except Exception as e:
                logger.error(f"Failed to create blob service client: {str(e)}")
                raise

        return self._blob_service_client

    def generate_user_delegation_sas(
        self,
        container_name: str,
        blob_name: Optional[str] = None,
        permissions: str = "r"
    ) -> str:
        """Generate user delegation SAS token (most secure)"""
        try:
            if not self.config.use_managed_identity:
                raise ValueError("User delegation SAS requires managed identity authentication")

            blob_service_client = self.get_blob_service_client()

            # Get user delegation key
            key_start_time = datetime.now(timezone.utc)
            key_expiry_time = key_start_time + timedelta(hours=self.config.sas_token_expiry_hours)

            user_delegation_key = blob_service_client.get_user_delegation_key(
                key_start_time=key_start_time,
                key_expiry_time=key_expiry_time
            )

            # Generate SAS token
            if blob_name:
                # Blob-level SAS
                sas_token = generate_blob_sas(
                    account_name=self.config.storage_account_name,
                    container_name=container_name,
                    blob_name=blob_name,
                    user_delegation_key=user_delegation_key,
                    permission=BlobSasPermissions.from_string(permissions),
                    expiry=key_expiry_time,
                    start=key_start_time
                )
            else:
                # Container-level SAS
                sas_token = generate_container_sas(
                    account_name=self.config.storage_account_name,
                    container_name=container_name,
                    user_delegation_key=user_delegation_key,
                    permission=ContainerSasPermissions.from_string(permissions),
                    expiry=key_expiry_time,
                    start=key_start_time
                )

            logger.info(f"Generated user delegation SAS for container: {container_name}")
            return sas_token

        except Exception as e:
            logger.error(f"Failed to generate user delegation SAS: {str(e)}")
            raise

    def generate_account_sas(
        self,
        container_name: str,
        blob_name: Optional[str] = None,
        permissions: str = "r"
    ) -> str:
        """Generate account key SAS token (fallback option)"""
        try:
            if not self.config.storage_account_key:
                raise ValueError("Storage account key required for account SAS")

            expiry_time = datetime.now(timezone.utc) + timedelta(hours=self.config.sas_token_expiry_hours)
            start_time = datetime.now(timezone.utc)

            if blob_name:
                # Blob-level SAS
                sas_token = generate_blob_sas(
                    account_name=self.config.storage_account_name,
                    account_key=self.config.storage_account_key,
                    container_name=container_name,
                    blob_name=blob_name,
                    permission=BlobSasPermissions.from_string(permissions),
                    expiry=expiry_time,
                    start=start_time
                )
            else:
                # Container-level SAS
                sas_token = generate_container_sas(
                    account_name=self.config.storage_account_name,
                    account_key=self.config.storage_account_key,
                    container_name=container_name,
                    permission=ContainerSasPermissions.from_string(permissions),
                    expiry=expiry_time,
                    start=start_time
                )

            logger.warning(f"Using account key SAS for container: {container_name}")
            return sas_token

        except Exception as e:
            logger.error(f"Failed to generate account SAS: {str(e)}")
            raise

    def get_secure_sas_token(
        self,
        container_name: str,
        blob_name: Optional[str] = None,
        permissions: str = "r"
    ) -> str:
        """Get the most secure SAS token available"""
        try:
            if self.config.use_managed_identity:
                return self.generate_user_delegation_sas(container_name, blob_name, permissions)
            else:
                return self.generate_account_sas(container_name, blob_name, permissions)
        except Exception as e:
            logger.error(f"Failed to generate secure SAS token: {str(e)}")
            raise

    def get_upload_sas_url(self, container_name: str, blob_name: str) -> str:
        """Generate secure SAS URL for file upload"""
        sas_token = self.get_secure_sas_token(container_name, blob_name, "rcw")  # read, create, write
        return f"https://{self.config.storage_account_name}.blob.core.windows.net/{container_name}/{blob_name}?{sas_token}"

    def get_download_sas_url(self, container_name: str, blob_name: str) -> str:
        """Generate secure SAS URL for file download"""
        sas_token = self.get_secure_sas_token(container_name, blob_name, "r")  # read only
        return f"https://{self.config.storage_account_name}.blob.core.windows.net/{container_name}/{blob_name}?{sas_token}"

    def get_container_sas_url(self, container_name: str, permissions: str = "rl") -> str:
        """Generate secure container SAS URL"""
        sas_token = self.get_secure_sas_token(container_name, None, permissions)
        return f"https://{self.config.storage_account_name}.blob.core.windows.net/{container_name}?{sas_token}"

    def validate_sas_token(self, sas_url: str) -> bool:
        """Validate if SAS token is still valid"""
        try:
            # This is a basic validation - in production, you might want more sophisticated checks
            blob_service_client = BlobServiceClient(account_url=sas_url)
            # Try to list containers to test the token
            containers = blob_service_client.list_containers(max_results=1)
            next(containers, None)  # Try to get the first container
            return True
        except AzureError:
            return False
        except Exception:
            return False

    def get_translator_headers(self) -> Dict[str, str]:
        """Get headers for Azure Translator API"""
        headers = {
            'Ocp-Apim-Subscription-Key': self.config.translator_api_key,
            'Content-Type': 'application/json',
            'X-ClientTraceId': str(datetime.now().timestamp())  # For tracking requests
        }

        if self.config.translator_region:
            headers['Ocp-Apim-Subscription-Region'] = self.config.translator_region

        return headers

    def sanitize_blob_name(self, filename: str) -> str:
        """Sanitize filename to be safe for blob storage"""
        import re
        import uuid

        # Remove or replace unsafe characters
        safe_name = re.sub(r'[<>:"/\\|?*]', '_', filename)

        # Add timestamp and UUID to prevent conflicts
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]

        name_parts = safe_name.rsplit('.', 1)
        if len(name_parts) == 2:
            base_name, extension = name_parts
            return f"{timestamp}_{unique_id}_{base_name}.{extension}"
        else:
            return f"{timestamp}_{unique_id}_{safe_name}"

    def audit_log(self, action: str, details: Dict[str, Any]) -> None:
        """Log security-related actions for audit purposes"""
        audit_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": action,
            "details": details,
            "service": "document_intelligence"
        }

        # In production, you might want to send this to Azure Monitor or a SIEM
        logger.info(f"AUDIT: {audit_entry}")

# Global security manager instance
security_manager = SecurityManager()