"""Secure blob storage operations for Document Intelligence"""
import os
import logging
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime, timezone, timedelta
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.core.exceptions import AzureError, ResourceNotFoundError, ResourceExistsError
from fastapi import UploadFile
import asyncio
from .config import get_config, validate_file_format, validate_file_size
from .security import security_manager
from .models import DocumentUploadResponse, DownloadResponse, ErrorResponse

logger = logging.getLogger(__name__)

class BlobStorageManager:
    """Manages secure blob storage operations"""

    def __init__(self):
        self.config = get_config()
        self.security = security_manager

    async def ensure_containers_exist(self) -> bool:
        """Ensure source and target containers exist with proper security settings"""
        try:
            blob_service_client = self.security.get_blob_service_client()

            # Create source container
            await self._create_secure_container(
                blob_service_client,
                self.config.source_container_name,
                "Source container for documents to be translated"
            )

            # Create target container
            await self._create_secure_container(
                blob_service_client,
                self.config.target_container_name,
                "Target container for translated documents"
            )

            logger.info("Storage containers verified/created successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to ensure containers exist: {str(e)}")
            return False

    async def _create_secure_container(
        self,
        blob_service_client: BlobServiceClient,
        container_name: str,
        description: str
    ) -> None:
        """Create a secure container with private access"""
        try:
            container_client = blob_service_client.get_container_client(container_name)

            # Check if container exists
            try:
                await asyncio.to_thread(container_client.get_container_properties)
                logger.info(f"Container '{container_name}' already exists")
                return
            except ResourceNotFoundError:
                pass

            # Create container with private access (no public access)
            metadata = {
                "description": description,
                "created_by": "document_intelligence_service",
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            await asyncio.to_thread(
                container_client.create_container,
                metadata=metadata,
                public_access=None  # Private container
            )

            logger.info(f"Created secure container: {container_name}")

            # Audit log the container creation
            self.security.audit_log("container_created", {
                "container_name": container_name,
                "description": description,
                "access_level": "private"
            })

        except ResourceExistsError:
            logger.info(f"Container '{container_name}' already exists")
        except Exception as e:
            logger.error(f"Failed to create container '{container_name}': {str(e)}")
            raise

    async def upload_document(
        self,
        file: UploadFile,
        container_name: Optional[str] = None
    ) -> DocumentUploadResponse:
        """Upload document to secure blob storage"""
        try:
            # Use source container by default
            container_name = container_name or self.config.source_container_name

            # Validate file
            file_content = await file.read()
            await file.seek(0)  # Reset file pointer

            if not validate_file_format(file.filename):
                raise ValueError(f"Unsupported file format: {file.filename}")

            if not validate_file_size(len(file_content)):
                raise ValueError(f"File too large. Maximum size: {self.config.max_file_size_mb}MB")

            # Generate secure blob name
            blob_name = self.security.sanitize_blob_name(file.filename)

            # Get blob client
            blob_service_client = self.security.get_blob_service_client()
            blob_client = blob_service_client.get_blob_client(
                container=container_name,
                blob=blob_name
            )

            # Upload with metadata
            metadata = {
                "original_filename": file.filename,
                "content_type": file.content_type,
                "upload_timestamp": datetime.now(timezone.utc).isoformat(),
                "file_size": str(len(file_content)),
                "uploaded_by": "document_intelligence_service"
            }

            await asyncio.to_thread(
                blob_client.upload_blob,
                file_content,
                metadata=metadata,
                content_type=file.content_type,
                overwrite=True
            )

            # Generate secure upload URL for confirmation
            upload_url = self.security.get_download_sas_url(container_name, blob_name)

            # Audit log the upload
            self.security.audit_log("document_uploaded", {
                "blob_name": blob_name,
                "original_filename": file.filename,
                "container": container_name,
                "file_size": len(file_content)
            })

            logger.info(f"Document uploaded successfully: {blob_name}")

            return DocumentUploadResponse(
                success=True,
                blob_name=blob_name,
                upload_url=upload_url,
                container_name=container_name,
                file_size=len(file_content),
                content_type=file.content_type or "application/octet-stream",
                message=f"Document '{file.filename}' uploaded successfully as '{blob_name}'"
            )

        except Exception as e:
            logger.error(f"Document upload failed: {str(e)}")
            raise

    async def get_download_url(
        self,
        blob_name: str,
        container_name: Optional[str] = None
    ) -> DownloadResponse:
        """Get secure download URL for a blob"""
        try:
            container_name = container_name or self.config.target_container_name

            # Verify blob exists
            blob_service_client = self.security.get_blob_service_client()
            blob_client = blob_service_client.get_blob_client(
                container=container_name,
                blob=blob_name
            )

            # Get blob properties
            properties = await asyncio.to_thread(blob_client.get_blob_properties)

            # Generate secure download URL
            download_url = self.security.get_download_sas_url(container_name, blob_name)

            # Calculate expiry time
            expires_at = datetime.now(timezone.utc) + \
                        timedelta(hours=self.config.sas_token_expiry_hours)

            # Audit log the download request
            self.security.audit_log("download_url_generated", {
                "blob_name": blob_name,
                "container": container_name,
                "expires_at": expires_at.isoformat()
            })

            return DownloadResponse(
                success=True,
                download_url=download_url,
                blob_name=blob_name,
                expires_at=expires_at,
                file_size=properties.size,
                content_type=properties.content_settings.content_type or "application/octet-stream"
            )

        except ResourceNotFoundError:
            logger.warning(f"Blob not found: {blob_name} in container {container_name}")
            raise ValueError(f"Document '{blob_name}' not found")
        except Exception as e:
            logger.error(f"Failed to generate download URL: {str(e)}")
            raise

    async def list_blobs(
        self,
        container_name: Optional[str] = None,
        prefix: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """List blobs in a container"""
        try:
            container_name = container_name or self.config.source_container_name

            blob_service_client = self.security.get_blob_service_client()
            container_client = blob_service_client.get_container_client(container_name)

            blobs = []
            # Use sync iteration in a thread
            blob_list = await asyncio.to_thread(
                lambda: list(container_client.list_blobs(name_starts_with=prefix))
            )

            for blob in blob_list:
                blob_info = {
                    "name": blob.name,
                    "size": blob.size,
                    "last_modified": blob.last_modified.isoformat() if blob.last_modified else None,
                    "content_type": blob.content_settings.content_type if blob.content_settings else None,
                    "metadata": blob.metadata or {}
                }
                blobs.append(blob_info)

            return blobs

        except Exception as e:
            logger.error(f"Failed to list blobs: {str(e)}")
            raise

    async def delete_blob(
        self,
        blob_name: str,
        container_name: Optional[str] = None
    ) -> bool:
        """Delete a blob from storage"""
        try:
            container_name = container_name or self.config.source_container_name

            blob_service_client = self.security.get_blob_service_client()
            blob_client = blob_service_client.get_blob_client(
                container=container_name,
                blob=blob_name
            )

            await asyncio.to_thread(blob_client.delete_blob)

            # Audit log the deletion
            self.security.audit_log("blob_deleted", {
                "blob_name": blob_name,
                "container": container_name
            })

            logger.info(f"Blob deleted successfully: {blob_name}")
            return True

        except ResourceNotFoundError:
            logger.warning(f"Blob not found for deletion: {blob_name}")
            return False
        except Exception as e:
            logger.error(f"Failed to delete blob: {str(e)}")
            raise

    async def copy_blob(
        self,
        source_blob_name: str,
        target_blob_name: str,
        source_container: Optional[str] = None,
        target_container: Optional[str] = None
    ) -> bool:
        """Copy blob between containers"""
        try:
            source_container = source_container or self.config.source_container_name
            target_container = target_container or self.config.target_container_name

            blob_service_client = self.security.get_blob_service_client()

            # Source blob URL
            source_blob_url = f"https://{self.config.storage_account_name}.blob.core.windows.net/{source_container}/{source_blob_name}"

            # Target blob client
            target_blob_client = blob_service_client.get_blob_client(
                container=target_container,
                blob=target_blob_name
            )

            # Start copy operation
            copy_props = await asyncio.to_thread(
                target_blob_client.start_copy_from_url,
                source_blob_url
            )

            # Wait for copy to complete (for small files this should be immediate)
            # For large files, you might want to implement polling
            await asyncio.sleep(1)

            # Check copy status
            props = await asyncio.to_thread(target_blob_client.get_blob_properties)

            if props.copy.status == "success":
                logger.info(f"Blob copied successfully: {source_blob_name} -> {target_blob_name}")
                return True
            else:
                logger.error(f"Blob copy failed with status: {props.copy.status}")
                return False

        except Exception as e:
            logger.error(f"Failed to copy blob: {str(e)}")
            raise

    async def get_container_sas_urls(self) -> Tuple[str, str]:
        """Get SAS URLs for source and target containers"""
        try:
            source_url = self.security.get_container_sas_url(
                self.config.source_container_name,
                "rl"  # read, list
            )

            target_url = self.security.get_container_sas_url(
                self.config.target_container_name,
                "racwl"  # read, add, create, write, list
            )

            return source_url, target_url

        except Exception as e:
            logger.error(f"Failed to generate container SAS URLs: {str(e)}")
            raise

    async def cleanup_old_blobs(self, days_old: int = 7) -> int:
        """Clean up blobs older than specified days"""
        try:
            cleanup_count = 0
            cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_old)

            for container_name in [self.config.source_container_name, self.config.target_container_name]:
                blob_service_client = self.security.get_blob_service_client()
                container_client = blob_service_client.get_container_client(container_name)

                # Use sync iteration in a thread
                blob_list = await asyncio.to_thread(
                    lambda: list(container_client.list_blobs())
                )

                for blob in blob_list:
                    if blob.last_modified and blob.last_modified < cutoff_date:
                        try:
                            await self.delete_blob(blob.name, container_name)
                            cleanup_count += 1
                        except Exception as e:
                            logger.warning(f"Failed to delete old blob {blob.name}: {str(e)}")

            logger.info(f"Cleaned up {cleanup_count} old blobs")
            return cleanup_count

        except Exception as e:
            logger.error(f"Failed to cleanup old blobs: {str(e)}")
            return 0

# Global blob storage manager instance
blob_storage = BlobStorageManager()