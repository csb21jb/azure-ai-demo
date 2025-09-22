#!/usr/bin/env python3
"""
HTTPS startup script for Azure AI Services
This script ensures SSL is enabled and starts the server with HTTPS
"""
import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def check_ssl_certificates():
    """Check if SSL certificates exist"""
    cert_path = Path("ssl/cert.pem")
    key_path = Path("ssl/key.pem")
    
    if not cert_path.exists() or not key_path.exists():
        logger.error("❌ SSL certificates not found!")
        logger.info("🔧 Generating SSL certificates...")
        
        # Create ssl directory if it doesn't exist
        Path("ssl").mkdir(exist_ok=True)
        
        # Generate self-signed certificate
        import subprocess
        try:
            subprocess.run([
                "openssl", "req", "-x509", "-newkey", "rsa:4096",
                "-keyout", "ssl/key.pem", "-out", "ssl/cert.pem",
                "-days", "365", "-nodes",
                "-subj", "/C=US/ST=Development/L=Local/O=AI Services/OU=Development/CN=localhost"
            ], check=True, capture_output=True)
            logger.info("✅ SSL certificates generated successfully")
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Failed to generate SSL certificates: {e}")
            logger.error("Please install OpenSSL or generate certificates manually")
            return False
        except FileNotFoundError:
            logger.error("❌ OpenSSL not found. Please install OpenSSL first.")
            logger.error("On Ubuntu/Debian: sudo apt-get install openssl")
            logger.error("On macOS: brew install openssl")
            return False
    
    logger.info("✅ SSL certificates found")
    return True

def setup_https_environment():
    """Set up environment variables for HTTPS"""
    os.environ["SSL_ENABLED"] = "true"
    os.environ["PORT"] = os.environ.get("PORT", "8443")
    os.environ["CORS_ORIGIN"] = f"https://localhost:{os.environ['PORT']}"
    
    logger.info(f"🔒 HTTPS mode enabled on port {os.environ['PORT']}")

def main():
    """Main function to start HTTPS server"""
    logger.info("🚀 Starting Azure AI Services with HTTPS")
    logger.info("=" * 50)
    
    # Check SSL certificates
    if not check_ssl_certificates():
        sys.exit(1)
    
    # Set up HTTPS environment
    setup_https_environment()
    
    # Import and start the regular startup script
    try:
        from start import main as start_main
        start_main()
    except KeyboardInterrupt:
        logger.info("\n👋 HTTPS server stopped by user")
    except Exception as e:
        logger.error(f"❌ Failed to start HTTPS server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
