#!/usr/bin/env python3
"""
HTTP startup script for Azure AI Services
This script disables SSL and starts the server with HTTP
"""
import os
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def setup_http_environment():
    """Set up environment variables for HTTP"""
    os.environ["SSL_ENABLED"] = "false"
    os.environ["PORT"] = os.environ.get("PORT", "8000")
    os.environ["CORS_ORIGIN"] = f"http://localhost:{os.environ['PORT']}"
    
    logger.info(f"🌐 HTTP mode enabled on port {os.environ['PORT']}")

def main():
    """Main function to start HTTP server"""
    logger.info("🚀 Starting Azure AI Services with HTTP")
    logger.info("=" * 50)
    
    # Set up HTTP environment
    setup_http_environment()
    
    # Import and start the regular startup script
    try:
        from start import main as start_main
        start_main()
    except KeyboardInterrupt:
        logger.info("\n👋 HTTP server stopped by user")
    except Exception as e:
        logger.error(f"❌ Failed to start HTTP server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
