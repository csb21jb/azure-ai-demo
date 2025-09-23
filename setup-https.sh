#!/bin/bash

# HTTPS Setup Script for Azure AI Services
# This script automatically installs dependencies and sets up SSL certificates

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

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            echo "debian"
        elif [ -f /etc/redhat-release ]; then
            echo "redhat"
        elif [ -f /etc/alpine-release ]; then
            echo "alpine"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install OpenSSL based on OS
install_openssl() {
    local os=$(detect_os)

    print_status "Installing OpenSSL..."

    case $os in
        "debian")
            if command_exists apt-get; then
                sudo apt-get update
                sudo apt-get install -y openssl
            else
                print_error "apt-get not found. Please install OpenSSL manually."
                exit 1
            fi
            ;;
        "redhat")
            if command_exists yum; then
                sudo yum install -y openssl
            elif command_exists dnf; then
                sudo dnf install -y openssl
            else
                print_error "yum/dnf not found. Please install OpenSSL manually."
                exit 1
            fi
            ;;
        "alpine")
            if command_exists apk; then
                sudo apk add --no-cache openssl
            else
                print_error "apk not found. Please install OpenSSL manually."
                exit 1
            fi
            ;;
        "macos")
            if command_exists brew; then
                brew install openssl
            else
                print_warning "Homebrew not found. Installing Homebrew first..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                brew install openssl
            fi
            ;;
        *)
            print_error "Unsupported operating system. Please install OpenSSL manually."
            print_status "Common commands:"
            print_status "  Ubuntu/Debian: sudo apt-get install openssl"
            print_status "  CentOS/RHEL:   sudo yum install openssl"
            print_status "  Alpine:        sudo apk add openssl"
            print_status "  macOS:         brew install openssl"
            exit 1
            ;;
    esac
}

# Function to install Python dependencies
install_python_deps() {
    print_status "Installing Python dependencies..."

    if [ -f "requirements.txt" ]; then
        if command_exists pip3; then
            pip3 install -r requirements.txt
        elif command_exists pip; then
            pip install -r requirements.txt
        else
            print_error "pip not found. Please install Python pip first."
            exit 1
        fi
        print_success "Python dependencies installed"
    else
        print_warning "requirements.txt not found, skipping Python dependencies"
    fi
}

# Function to create SSL directory
create_ssl_directory() {
    print_status "Creating SSL directory..."

    if [ ! -d "ssl" ]; then
        mkdir -p ssl
        print_success "SSL directory created"
    else
        print_status "SSL directory already exists"
    fi
}

# Function to generate SSL certificates
generate_certificates() {
    print_status "Generating SSL certificates..."

    # Check if certificates already exist
    if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
        print_warning "SSL certificates already exist"
        read -p "Do you want to regenerate them? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Keeping existing certificates"
            return 0
        fi
    fi

    # Generate new certificates
    openssl req -x509 -newkey rsa:4096 \
        -keyout ssl/key.pem -out ssl/cert.pem \
        -days 365 -nodes \
        -subj "/C=US/ST=Development/L=Local/O=AI Services/OU=Development/CN=localhost" \
        2>/dev/null

    if [ $? -eq 0 ]; then
        print_success "SSL certificates generated successfully"
    else
        print_error "Failed to generate SSL certificates"
        exit 1
    fi
}

# Function to set proper file permissions
set_permissions() {
    print_status "Setting file permissions..."

    if [ -f "ssl/key.pem" ]; then
        chmod 600 ssl/key.pem
        print_success "Private key permissions set (600)"
    fi

    if [ -f "ssl/cert.pem" ]; then
        chmod 644 ssl/cert.pem
        print_success "Certificate permissions set (644)"
    fi
}

# Function to verify setup
verify_setup() {
    print_status "Verifying setup..."

    local errors=0

    # Check OpenSSL
    if command_exists openssl; then
        print_success "OpenSSL is installed: $(openssl version)"
    else
        print_error "OpenSSL is not installed"
        errors=$((errors + 1))
    fi

    # Check certificates
    if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
        print_success "SSL certificates exist"

        # Verify certificate validity
        if openssl x509 -in ssl/cert.pem -text -noout >/dev/null 2>&1; then
            print_success "SSL certificate is valid"
        else
            print_error "SSL certificate is invalid"
            errors=$((errors + 1))
        fi
    else
        print_error "SSL certificates are missing"
        errors=$((errors + 1))
    fi

    # Check Python
    if command_exists python3; then
        print_success "Python 3 is available: $(python3 --version)"
    elif command_exists python; then
        print_success "Python is available: $(python --version)"
    else
        print_warning "Python not found - you may need to install it manually"
    fi

    return $errors
}

# Function to show next steps
show_next_steps() {
    echo
    print_success "🎉 HTTPS setup completed successfully!"
    echo
    print_status "Next steps:"
    echo "  1. Start the HTTPS server:"
    echo "     ${GREEN}python3 start.py${NC}"
    echo
    echo "  2. Open your browser and go to:"
    echo "     ${GREEN}https://localhost:8443${NC}"
    echo
    echo "  3. Accept the security warning (normal for self-signed certificates)"
    echo
    print_status "Note: Your browser will show a security warning because we're using"
    print_status "self-signed certificates. This is normal for development."
    echo
}

# Main function
main() {
    echo "=================================================="
    echo "🔒 Azure AI Services - HTTPS Setup Script"
    echo "=================================================="
    echo

    # Check if we're in the right directory
    if [ ! -f "index.html" ] || [ ! -f "start.py" ]; then
        print_error "This script must be run from the Azure AI Services project directory"
        print_status "Please navigate to the directory containing index.html and start.py and try again"
        exit 1
    fi

    print_status "Detected OS: $(detect_os)"
    echo

    # Check and install OpenSSL
    if command_exists openssl; then
        print_success "OpenSSL is already installed: $(openssl version)"
    else
        install_openssl
    fi

    # Install Python dependencies
    install_python_deps

    # Create SSL directory
    create_ssl_directory

    # Generate certificates
    generate_certificates

    # Set proper permissions
    set_permissions

    # Verify everything is working
    if verify_setup; then
        show_next_steps
    else
        echo
        print_error "Setup completed with errors. Please check the output above."
        exit 1
    fi
}

# Run main function
main "$@"%   
