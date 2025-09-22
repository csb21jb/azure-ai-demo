# Azure Document Intelligence Service

A secure, production-ready implementation of Azure Document Translation with maximum security blob storage configuration.

## Security Features

### 🔒 Maximum Security Architecture
- **Managed Identity Authentication**: No API keys stored in code
- **Private Endpoints**: Storage account isolated from public internet
- **Network Isolation**: VNet with private DNS resolution
- **Short-lived SAS Tokens**: 1-hour maximum expiry time
- **User Delegation SAS**: Most secure token type available
- **Zero Public Access**: All containers private by default
- **RBAC Permissions**: Principle of least privilege

### 🛡️ Security Best Practices Implemented
- Private blob storage with no public access
- System-assigned managed identities
- Firewall rules blocking all public traffic
- User delegation SAS tokens (most secure)
- Audit logging for all operations
- File validation and size limits
- Secure file name sanitization

## Quick Start

### 1. Infrastructure Setup

Run the automated setup script to create secure Azure infrastructure:

```bash
# Make sure you're logged into Azure CLI
az login

# Run the setup script
./services/document_intelligence/setup_azure_infrastructure.sh
```

This script creates:
- Resource group with all components
- Storage account with private endpoints
- Virtual network for isolation
- Private DNS zone
- Azure Translator service
- RBAC permissions
- Secure storage containers

### 2. Environment Configuration

Add the generated environment variables to your `.env` file:

```bash
# Azure Translator Configuration
AZURE_TRANSLATOR_ENDPOINT=https://your-translator.cognitiveservices.azure.com/
AZURE_TRANSLATOR_API_KEY=your-api-key
AZURE_TRANSLATOR_REGION=eastus

# Azure Storage Configuration
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account
DOCUMENT_SOURCE_CONTAINER=document-source
DOCUMENT_TARGET_CONTAINER=document-target

# Security Configuration
USE_MANAGED_IDENTITY=true
SAS_TOKEN_EXPIRY_HOURS=1
MAX_FILE_SIZE_MB=100
```

### 3. Install Dependencies

```bash
pip install azure-ai-translation-document azure-storage-blob azure-identity
```

## API Endpoints

### Document Upload
```http
POST /document-intelligence/upload
Content-Type: multipart/form-data

file: <document-file>
container: <optional-container-name>
```

### Start Translation
```http
POST /document-intelligence/translate
Content-Type: application/json

{
  "source_blob_name": "document.pdf",
  "translation_config": {
    "target_language": "es",
    "source_language": "en",
    "glossary_url": "https://...",
    "category": "legal"
  }
}
```

### Check Job Status
```http
GET /document-intelligence/job/{job_id}
```

### Download Translated Document
```http
GET /document-intelligence/download/{blob_name}?container=document-target
```

### Health Check
```http
GET /document-intelligence/health
```

### Other Endpoints
- `GET /document-intelligence/languages` - Supported languages
- `POST /document-intelligence/validate` - Validate file
- `GET /document-intelligence/jobs` - List jobs
- `DELETE /document-intelligence/job/{job_id}` - Cancel job

## Supported File Formats

- PDF (`.pdf`)
- Microsoft Word (`.docx`)
- Microsoft PowerPoint (`.pptx`)
- Microsoft Excel (`.xlsx`)
- HTML (`.html`)
- Plain Text (`.txt`)
- Rich Text Format (`.rtf`)
- OpenDocument Text (`.odt`)

## Configuration Options

### Security Settings
- `USE_MANAGED_IDENTITY`: Enable managed identity authentication (recommended: `true`)
- `SAS_TOKEN_EXPIRY_HOURS`: SAS token expiry time in hours (recommended: `1`)
- `MAX_FILE_SIZE_MB`: Maximum file size in MB (default: `100`)

### Container Names
- `DOCUMENT_SOURCE_CONTAINER`: Source documents container (default: `document-source`)
- `DOCUMENT_TARGET_CONTAINER`: Translated documents container (default: `document-target`)

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   FastAPI App   │────│ Document Intel   │────│ Azure Translator│
│                 │    │    Service       │    │    Service      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Blob Storage     │
                       │ (Private Access) │
                       │                  │
                       │ ┌──────────────┐ │
                       │ │Source        │ │
                       │ │Container     │ │
                       │ └──────────────┘ │
                       │                  │
                       │ ┌──────────────┐ │
                       │ │Target        │ │
                       │ │Container     │ │
                       │ └──────────────┘ │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Private Endpoint │
                       │ + Private DNS    │
                       └──────────────────┘
```

## Security Considerations

1. **Never commit credentials**: All authentication uses managed identities
2. **Short token expiry**: SAS tokens expire in 1 hour maximum
3. **Network isolation**: Storage accessible only through private endpoints
4. **Audit logging**: All operations logged for security monitoring
5. **File validation**: Size and format validation before processing
6. **Secure naming**: File names sanitized to prevent path traversal

## Troubleshooting

### Common Issues

1. **"Storage account not accessible"**
   - Ensure managed identity is enabled
   - Check RBAC permissions
   - Verify private endpoint configuration

2. **"Translation job failed"**
   - Check translator service quotas
   - Verify source document exists
   - Check target language support

3. **"SAS token expired"**
   - Tokens expire in 1 hour by design
   - Generate new download URL

### Monitoring

Check service health:
```bash
curl -X GET http://localhost:8000/document-intelligence/health
```

View audit logs:
```bash
# Check application logs for AUDIT entries
tail -f logs/application.log | grep AUDIT
```

## Production Deployment

For production deployment:

1. Use Azure Key Vault for additional secret management
2. Enable Azure Monitor for comprehensive logging
3. Configure alerts for failed translations
4. Implement backup strategies for critical documents
5. Consider geo-replication for high availability
6. Use Azure Application Gateway for load balancing
7. Enable Azure Security Center recommendations

## Cost Optimization

- Use appropriate storage tiers (Hot/Cool/Archive)
- Implement blob lifecycle policies
- Monitor translation usage and quotas
- Clean up old files regularly using the cleanup endpoint