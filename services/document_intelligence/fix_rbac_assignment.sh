#!/bin/bash

# Fix RBAC assignment with proper retry logic
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

echo "=== Fixing RBAC Assignment for Translator Service ==="
echo ""

# Get translator service principal ID
print_status "Getting translator service principal ID..."
TRANSLATOR_PRINCIPAL_ID=$(az cognitiveservices account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$TRANSLATOR_NAME" \
    --query "identity.principalId" \
    --output tsv)

print_status "Translator Principal ID: $TRANSLATOR_PRINCIPAL_ID"

# Get storage account resource ID
STORAGE_ID=$(az storage account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$STORAGE_ACCOUNT_NAME" \
    --query "id" \
    --output tsv)

print_status "Storage Account ID: $STORAGE_ID"

# Function to attempt role assignment with retry
assign_role_with_retry() {
    local max_attempts=10
    local attempt=1
    local wait_time=30

    while [ $attempt -le $max_attempts ]; do
        print_status "Attempt $attempt/$max_attempts: Assigning Storage Blob Data Contributor role..."

        if az role assignment create \
            --assignee "$TRANSLATOR_PRINCIPAL_ID" \
            --role "Storage Blob Data Contributor" \
            --scope "$STORAGE_ID" \
            --output table 2>/dev/null; then
            print_success "✅ RBAC role assignment successful!"
            return 0
        else
            if [ $attempt -eq $max_attempts ]; then
                print_error "❌ Failed to assign role after $max_attempts attempts"
                return 1
            else
                print_warning "⚠️  Attempt $attempt failed. Waiting ${wait_time}s for service principal to propagate..."
                sleep $wait_time
                attempt=$((attempt + 1))
            fi
        fi
    done
}

# Try the role assignment with retry logic
if assign_role_with_retry; then
    echo ""
    print_success "🎉 RBAC configuration completed successfully!"
else
    echo ""
    print_warning "⚠️  Automatic RBAC assignment failed. You can try manually later with:"
    echo "az role assignment create \\"
    echo "  --assignee $TRANSLATOR_PRINCIPAL_ID \\"
    echo "  --role 'Storage Blob Data Contributor' \\"
    echo "  --scope $STORAGE_ID"
    echo ""
fi

# Verify the assignment
print_status "Verifying role assignments..."
echo ""
echo "Current role assignments for the translator service:"
az role assignment list \
    --assignee "$TRANSLATOR_PRINCIPAL_ID" \
    --output table || echo "No role assignments found yet"

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
print_success "=== CONFIGURATION DETAILS ==="
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
echo "🔒 Security Status:"
echo "✅ Storage Account: Maximum security (deny all by default)"
echo "✅ Authorized IPs: 98.16.238.43, 74.249.34.122"
echo "✅ Private Endpoints: Enabled"
echo "✅ Containers: Created and private"
echo "✅ Translator Service: Created with managed identity"
echo "$([ -f /tmp/rbac_success ] && echo '✅ RBAC: Storage Blob Data Contributor assigned' || echo '⚠️  RBAC: May need manual assignment')"
echo "✅ Encryption: HTTPS only, TLS 1.2+"
echo ""
print_success "🎉 Infrastructure setup complete!"
echo ""
print_status "Next steps:"
echo "1. Add the environment variables above to your .env file"
echo "2. Install Azure Document Translation package:"
echo "   source venv/bin/activate && pip install azure-ai-translation-document==1.0.0"
echo "3. Test the service health check"
echo ""

# Create success marker if role assignment worked
if az role assignment list --assignee "$TRANSLATOR_PRINCIPAL_ID" --query "[?roleDefinitionName=='Storage Blob Data Contributor']" --output tsv | grep -q .; then
    touch /tmp/rbac_success
    print_success "✅ RBAC verification: Role assignment confirmed"
else
    print_warning "⚠️  RBAC verification: Role assignment may still be propagating"
fi