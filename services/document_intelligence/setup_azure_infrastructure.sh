#!/bin/bash

# Azure Infrastructure Setup for Document Intelligence Service
# This script creates the most secure configuration for Azure Blob Storage and Translator

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required environment variables are set
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install it first."
        exit 1
    fi

    # Check if logged in to Azure
    if ! az account show &> /dev/null; then
        print_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi

    print_success "Prerequisites check passed"
}

# Set default values if environment variables are not set
set_defaults() {
    export RESOURCE_GROUP_NAME=${RESOURCE_GROUP_NAME:-"rg-document-intelligence"}
    export LOCATION=${LOCATION:-"eastus"}
    export STORAGE_ACCOUNT_NAME=${STORAGE_ACCOUNT_NAME:-"sa$(openssl rand -hex 4)docintel"}
    export TRANSLATOR_NAME=${TRANSLATOR_NAME:-"translator-docintel-$(openssl rand -hex 4)"}
    export VNET_NAME=${VNET_NAME:-"vnet-document-intelligence"}
    export SUBNET_NAME=${SUBNET_NAME:-"subnet-private-endpoints"}
    export SOURCE_CONTAINER=${SOURCE_CONTAINER:-"document-source"}
    export TARGET_CONTAINER=${TARGET_CONTAINER:-"document-target"}

    print_status "Using configuration:"
    echo "  Resource Group: $RESOURCE_GROUP_NAME"
    echo "  Location: $LOCATION"
    echo "  Storage Account: $STORAGE_ACCOUNT_NAME"
    echo "  Translator Service: $TRANSLATOR_NAME"
    echo "  VNet: $VNET_NAME"
    echo "  Subnet: $SUBNET_NAME"
}

# Create resource group
create_resource_group() {
    print_status "Creating resource group..."

    az group create \
        --name "$RESOURCE_GROUP_NAME" \
        --location "$LOCATION" \
        --output table

    print_success "Resource group created: $RESOURCE_GROUP_NAME"
}

# Create Virtual Network for private endpoints
create_vnet() {
    print_status "Creating Virtual Network..."

    # Create VNet
    az network vnet create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$VNET_NAME" \
        --address-prefix 10.0.0.0/16 \
        --subnet-name "$SUBNET_NAME" \
        --subnet-prefix 10.0.1.0/24 \
        --output table

    # Disable private endpoint network policies
    az network vnet subnet update \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --vnet-name "$VNET_NAME" \
        --name "$SUBNET_NAME" \
        --disable-private-endpoint-network-policies true \
        --output table

    print_success "Virtual Network created: $VNET_NAME"
}

# Create secure storage account with private endpoints
create_storage_account() {
    print_status "Creating secure storage account..."

    # Create storage account with highest security settings
    az storage account create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$STORAGE_ACCOUNT_NAME" \
        --location "$LOCATION" \
        --sku Standard_LRS \
        --kind StorageV2 \
        --access-tier Hot \
        --https-only true \
        --min-tls-version TLS1_2 \
        --allow-blob-public-access false \
        --default-action Deny \
        --bypass None \
        --output table

    print_success "Storage account created: $STORAGE_ACCOUNT_NAME"

    # Enable system-assigned managed identity
    print_status "Enabling system-assigned managed identity on storage account..."
    az storage account update \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$STORAGE_ACCOUNT_NAME" \
        --assign-identity \
        --output table
}

# Create private endpoint for blob storage
create_private_endpoint() {
    print_status "Creating private endpoint for blob storage..."

    # Get storage account resource ID
    STORAGE_ID=$(az storage account show \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$STORAGE_ACCOUNT_NAME" \
        --query "id" \
        --output tsv)

    # Create private endpoint
    az network private-endpoint create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "pe-${STORAGE_ACCOUNT_NAME}-blob" \
        --vnet-name "$VNET_NAME" \
        --subnet "$SUBNET_NAME" \
        --private-connection-resource-id "$STORAGE_ID" \
        --group-id blob \
        --connection-name "blob-connection" \
        --output table

    print_success "Private endpoint created for blob storage"
}

# Create private DNS zone
create_private_dns() {
    print_status "Creating private DNS zone..."

    # Create private DNS zone
    az network private-dns zone create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "privatelink.blob.core.windows.net" \
        --output table

    # Link DNS zone to VNet
    az network private-dns link vnet create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --zone-name "privatelink.blob.core.windows.net" \
        --name "${VNET_NAME}-link" \
        --virtual-network "$VNET_NAME" \
        --registration-enabled false \
        --output table

    # Create DNS record for private endpoint
    PRIVATE_IP=$(az network private-endpoint show \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "pe-${STORAGE_ACCOUNT_NAME}-blob" \
        --query "customDnsConfigs[0].ipAddresses[0]" \
        --output tsv)

    az network private-dns record-set a create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --zone-name "privatelink.blob.core.windows.net" \
        --name "$STORAGE_ACCOUNT_NAME" \
        --output table

    az network private-dns record-set a add-record \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --zone-name "privatelink.blob.core.windows.net" \
        --record-set-name "$STORAGE_ACCOUNT_NAME" \
        --ipv4-address "$PRIVATE_IP" \
        --output table

    print_success "Private DNS zone configured"
}

# Create storage containers
create_containers() {
    print_status "Creating storage containers..."

    # Get storage account key (needed for container creation)
    STORAGE_KEY=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --account-name "$STORAGE_ACCOUNT_NAME" \
        --query "[0].value" \
        --output tsv)

    # Create source container
    az storage container create \
        --name "$SOURCE_CONTAINER" \
        --account-name "$STORAGE_ACCOUNT_NAME" \
        --account-key "$STORAGE_KEY" \
        --public-access off \
        --output table

    # Create target container
    az storage container create \
        --name "$TARGET_CONTAINER" \
        --account-name "$STORAGE_ACCOUNT_NAME" \
        --account-key "$STORAGE_KEY" \
        --public-access off \
        --output table

    print_success "Storage containers created: $SOURCE_CONTAINER, $TARGET_CONTAINER"
}

# Create Azure Translator service
create_translator_service() {
    print_status "Creating Azure Translator service..."

    az cognitiveservices account create \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$TRANSLATOR_NAME" \
        --location "$LOCATION" \
        --kind TextTranslation \
        --sku S1 \
        --custom-domain "$TRANSLATOR_NAME" \
        --output table

    # Enable system-assigned managed identity
    az cognitiveservices account identity assign \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$TRANSLATOR_NAME" \
        --output table

    print_success "Translator service created: $TRANSLATOR_NAME"
}

# Configure RBAC permissions
configure_rbac() {
    print_status "Configuring RBAC permissions..."

    # Get translator service principal ID
    TRANSLATOR_PRINCIPAL_ID=$(az cognitiveservices account show \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$TRANSLATOR_NAME" \
        --query "identity.principalId" \
        --output tsv)

    # Get storage account resource ID
    STORAGE_ID=$(az storage account show \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$STORAGE_ACCOUNT_NAME" \
        --query "id" \
        --output tsv)

    # Assign Storage Blob Data Contributor role to translator service
    az role assignment create \
        --assignee "$TRANSLATOR_PRINCIPAL_ID" \
        --role "Storage Blob Data Contributor" \
        --scope "$STORAGE_ID" \
        --output table

    print_success "RBAC permissions configured"
}

# Output configuration information
output_configuration() {
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

    # Get storage account details
    STORAGE_ENDPOINT=$(az storage account show \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$STORAGE_ACCOUNT_NAME" \
        --query "primaryEndpoints.blob" \
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
    echo "Storage Endpoint: $STORAGE_ENDPOINT"
    echo "Private Endpoint: Enabled"
    echo "Public Access: Disabled"
    echo "Managed Identity: Enabled"
    echo ""
}

# Main execution
main() {
    echo "=== Azure Document Intelligence Infrastructure Setup ==="
    echo ""

    check_prerequisites
    set_defaults

    echo ""
    read -p "Do you want to proceed with the infrastructure setup? (y/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelled by user"
        exit 0
    fi

    echo ""
    print_status "Starting infrastructure deployment..."

    create_resource_group
    create_vnet
    create_storage_account
    create_private_endpoint
    create_private_dns
    create_containers
    create_translator_service
    configure_rbac

    echo ""
    output_configuration

    echo ""
    print_success "Infrastructure setup completed successfully!"
    print_status "You can now use the Document Intelligence service with maximum security."
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT

# Run main function
main "$@"