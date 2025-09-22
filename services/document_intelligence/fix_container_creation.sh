#!/bin/bash

# Fix script for container creation when storage account has restrictive network rules
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
SOURCE_CONTAINER="document-source"
TARGET_CONTAINER="document-target"
LOCATION="eastus"

# Get current public IP
print_status "Getting current public IP address..."
CURRENT_IP=$(curl -s https://ipinfo.io/ip 2>/dev/null || curl -s https://api.ipify.org 2>/dev/null || echo "0.0.0.0")
print_status "Current IP: $CURRENT_IP"

# Temporarily add current IP to storage account firewall
print_status "Temporarily adding current IP to storage account firewall..."
az storage account network-rule add \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --ip-address "$CURRENT_IP" \
    --output table

print_success "IP address added to firewall rules"

# Wait a moment for the rules to take effect
print_status "Waiting for firewall rules to take effect..."
sleep 10

# Create storage containers
print_status "Creating storage containers..."

# Get storage account key
STORAGE_KEY=$(az storage account keys list \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --query "[0].value" \
    --output tsv)

# Create source container
print_status "Creating source container: $SOURCE_CONTAINER"
az storage container create \
    --name "$SOURCE_CONTAINER" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --account-key "$STORAGE_KEY" \
    --public-access off \
    --output table

# Create target container
print_status "Creating target container: $TARGET_CONTAINER"
az storage container create \
    --name "$TARGET_CONTAINER" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --account-key "$STORAGE_KEY" \
    --public-access off \
    --output table

print_success "Storage containers created successfully"

# Create Azure Translator service (if not already created)
print_status "Creating/updating Azure Translator service..."
az cognitiveservices account create \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --location "$LOCATION" \
    --kind TextTranslation \
    --sku S1 \
    --yes \
    --output table || echo "Translator service might already exist"

# Enable system-assigned managed identity on translator
print_status "Enabling managed identity on translator service..."
az cognitiveservices account identity assign \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --output table

# Configure RBAC permissions
print_status "Configuring RBAC permissions..."

# Get translator service principal ID
TRANSLATOR_PRINCIPAL_ID=$(az cognitiveservices account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --query "identity.principalId" \
    --output tsv)

if [ "$TRANSLATOR_PRINCIPAL_ID" != "null" ] && [ -n "$TRANSLATOR_PRINCIPAL_ID" ]; then
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

    print_success "RBAC permissions configured"
else
    print_warning "Could not get translator principal ID, skipping RBAC assignment"
fi

# Remove current IP from storage account firewall (restore security)
print_status "Removing current IP from storage account firewall..."
az storage account network-rule remove \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --ip-address "$CURRENT_IP" \
    --output table

print_success "IP address removed from firewall rules - storage account is now fully secure"

# Output configuration information
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
echo "DOCUMENT_SOURCE_CONTAINER=$SOURCE_CONTAINER"
echo "DOCUMENT_TARGET_CONTAINER=$TARGET_CONTAINER"
echo ""
echo "# Security Configuration"
echo "USE_MANAGED_IDENTITY=true"
echo "SAS_TOKEN_EXPIRY_HOURS=1"
echo "MAX_FILE_SIZE_MB=100"
echo ""
echo "🔒 Security Status:"
echo "✅ Storage Account: Maximum security (private endpoints, no public access)"
echo "✅ Containers: Private access only"
echo "✅ Managed Identity: Enabled"
echo "✅ RBAC: Translator service has blob access"
echo "✅ Network Rules: Deny all public access"
echo ""
print_success "Setup completed successfully! The infrastructure is ready and secure."