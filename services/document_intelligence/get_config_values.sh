#!/bin/bash

# Get the correct configuration values for .env file
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Configuration
RESOURCE_GROUP_NAME="rg-document-intelligence"
STORAGE_ACCOUNT_NAME="sae05e3c56docintel"
TRANSLATOR_NAME="translator-docintel-1160e86b"
LOCATION="eastus"

echo "=== Current Azure Configuration Values ==="
echo ""

# Get translator endpoint and key
print_status "Getting Translator service configuration..."
TRANSLATOR_ENDPOINT=$(az cognitiveservices account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --query "properties.endpoint" \
    --output tsv 2>/dev/null || echo "not-found")

TRANSLATOR_KEY=$(az cognitiveservices account keys list \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --query "key1" \
    --output tsv 2>/dev/null || echo "not-found")

echo ""
print_success "=== ENVIRONMENT VARIABLES FOR .env FILE ==="
echo ""
echo "# Replace these values in your .env file:"
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
echo "=== COPY AND PASTE THE ABOVE VALUES INTO YOUR .env FILE ==="
echo ""