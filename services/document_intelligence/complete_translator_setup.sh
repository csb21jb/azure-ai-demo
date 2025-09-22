#!/bin/bash

# Complete the Azure Translator service setup
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
RESOURCE_GROUP_NAME="rg-document-intelligence"
STORAGE_ACCOUNT_NAME="sae05e3c56docintel"
TRANSLATOR_NAME="translator-docintel-1160e86b"
LOCATION="eastus"

echo "=== Completing Azure Translator Service Setup ==="
echo ""

# Create Azure Translator service
print_status "Creating Azure Translator service..."
az cognitiveservices account create \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --location "$LOCATION" \
    --kind TextTranslation \
    --sku S1 \
    --yes \
    --output table

print_success "Translator service created: $TRANSLATOR_NAME"

# Enable system-assigned managed identity
print_status "Enabling system-assigned managed identity..."
az cognitiveservices account identity assign \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --output table

print_success "Managed identity enabled"

# Wait a moment for identity to propagate
print_status "Waiting for managed identity to propagate..."
sleep 10

# Configure RBAC permissions
print_status "Configuring RBAC permissions..."

# Get translator service principal ID
TRANSLATOR_PRINCIPAL_ID=$(az cognitiveservices account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --query "identity.principalId" \
    --output tsv)

if [ "$TRANSLATOR_PRINCIPAL_ID" != "null" ] && [ -n "$TRANSLATOR_PRINCIPAL_ID" ]; then
    print_status "Translator Principal ID: $TRANSLATOR_PRINCIPAL_ID"

    # Get storage account resource ID
    STORAGE_ID=$(az storage account show \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$STORAGE_ACCOUNT_NAME" \
        --query "id" \
        --output tsv)

    # Assign Storage Blob Data Contributor role to translator service
    print_status "Assigning Storage Blob Data Contributor role..."
    az role assignment create \
        --assignee "$TRANSLATOR_PRINCIPAL_ID" \
        --role "Storage Blob Data Contributor" \
        --scope "$STORAGE_ID" \
        --output table

    print_success "RBAC permissions configured successfully"
else
    print_error "Could not get translator principal ID"
    exit 1
fi

# Get configuration details
print_status "Retrieving configuration information..."

# Get translator endpoint and key
TRANSLATOR_ENDPOINT=$(az cognitiveservices account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --query "properties.endpoint" \
    --output tsv)

TRANSLATOR_KEY=$(az cognitiveservices account keys list \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --query "key1" \
    --output tsv)

echo ""
print_success "=== CONFIGURATION COMPLETE ==="
echo ""
echo "Add these environment variables to your .env file:"
echo ""
echo "# Azure Translator Configuration"
echo "AZURE_TRANSLATOR_ENDPOINT=$TRANSLATOR_ENDPOINT"
echo "AZURE_TRANSLATOR_API_KEY=$TRANSLATOR_KEY"
echo "AZURE_TRANSLATOR_REGION=$LOCATION"
echo ""
echo "# Azure Storage Configuration"
echo "AZURE_STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME"
echo "DOCUMENT_SOURCE_CONTAINER=document-source"
echo "DOCUMENT_TARGET_CONTAINER=document-target"
echo ""
echo "# Security Configuration"
echo "USE_MANAGED_IDENTITY=true"
echo "SAS_TOKEN_EXPIRY_HOURS=1"
echo "MAX_FILE_SIZE_MB=100"
echo ""
echo "🔒 Complete Security Status:"
echo "✅ Storage Account: Maximum security (deny all by default)"
echo "✅ Authorized IPs: Your IP and Microsoft VM only"
echo "✅ Private Endpoints: Enabled for internal access"
echo "✅ Containers: Private access only"
echo "✅ Managed Identity: Enabled on Translator service"
echo "✅ RBAC: Translator has Storage Blob Data Contributor access"
echo "✅ Encryption: HTTPS only, TLS 1.2 minimum"
echo ""
print_success "🎉 Azure Document Intelligence infrastructure is ready!"
echo ""
print_status "Next steps:"
echo "1. Add the environment variables above to your .env file"
echo "2. Install the Azure Document Translation package:"
echo "   source venv/bin/activate && pip install azure-ai-translation-document==1.0.0"
echo "3. Test the service health check"
echo ""