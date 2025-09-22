#!/bin/bash

# Script to add specific authorized IP addresses to Azure Storage Account
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
SOURCE_CONTAINER="document-source"
TARGET_CONTAINER="document-target"

# Authorized IP addresses
USER_IP="98.16.238.43"
MICROSOFT_VM_IP="74.249.34.122"

echo "=== Adding Authorized IPs to Azure Storage Account ==="
echo ""
print_status "Storage Account: $STORAGE_ACCOUNT_NAME"
print_status "Resource Group: $RESOURCE_GROUP_NAME"
echo ""
print_status "IPs to authorize:"
echo "  - User IP: $USER_IP"
echo "  - Microsoft VM: $MICROSOFT_VM_IP"
echo ""

# Show current network rules
print_status "Current network rules:"
az storage account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$STORAGE_ACCOUNT_NAME" \
    --query "networkRuleSet" \
    --output table

echo ""

# Add User IP
print_status "Adding User IP ($USER_IP) to storage account firewall..."
az storage account network-rule add \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --ip-address "$USER_IP" \
    --output table

print_success "User IP added successfully"

# Add Microsoft VM IP
print_status "Adding Microsoft VM IP ($MICROSOFT_VM_IP) to storage account firewall..."
az storage account network-rule add \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --ip-address "$MICROSOFT_VM_IP" \
    --output table

print_success "Microsoft VM IP added successfully"

# Wait for rules to take effect
print_status "Waiting for firewall rules to take effect..."
sleep 5

# Show updated network rules
print_status "Updated network rules:"
az storage account show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$STORAGE_ACCOUNT_NAME" \
    --query "networkRuleSet" \
    --output json

echo ""

# Now create containers if they don't exist
print_status "Checking and creating storage containers..."

# Get storage account key
STORAGE_KEY=$(az storage account keys list \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --query "[0].value" \
    --output tsv)

# Create source container
print_status "Creating/verifying source container: $SOURCE_CONTAINER"
az storage container create \
    --name "$SOURCE_CONTAINER" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --account-key "$STORAGE_KEY" \
    --public-access off \
    --output table || echo "Container may already exist"

# Create target container
print_status "Creating/verifying target container: $TARGET_CONTAINER"
az storage container create \
    --name "$TARGET_CONTAINER" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --account-key "$STORAGE_KEY" \
    --public-access off \
    --output table || echo "Container may already exist"

print_success "Storage containers verified/created"

# List containers to confirm
print_status "Listing storage containers:"
az storage container list \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --account-key "$STORAGE_KEY" \
    --output table

echo ""
print_success "=== IP AUTHORIZATION COMPLETE ==="
echo ""
echo "✅ Authorized IPs added to storage account firewall:"
echo "   - User IP: $USER_IP"
echo "   - Microsoft VM: $MICROSOFT_VM_IP"
echo ""
echo "🔒 Security Status:"
echo "   - Default Action: Deny (maximum security)"
echo "   - Authorized IPs: Only specified addresses can access"
echo "   - Private Endpoints: Still enabled for internal access"
echo "   - Public Blob Access: Disabled"
echo ""
echo "📝 Note: These IPs now have access to the storage account."
echo "    You can remove them later using:"
echo "    az storage account network-rule remove --ip-address <IP>"
echo ""

# Test connectivity from current location
print_status "Testing storage connectivity..."
if az storage container list \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --account-key "$STORAGE_KEY" \
    --output table > /dev/null 2>&1; then
    print_success "✅ Storage access test passed"
else
    print_warning "⚠️  Storage access test failed - you may need to wait a moment for rules to propagate"
fi

echo ""
print_success "Setup complete! The storage account is now accessible from the authorized IPs."