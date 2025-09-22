#!/usr/bin/env python3
"""
Production startup script for Azure AI Services
"""
import os
import sys
import logging
from config import get_config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import openai
        import requests
        logger.info("✅ All required dependencies are installed")
        return True
    except ImportError as e:
        logger.error(f"❌ Missing dependency: {e}")
        logger.error("Please run: pip install -r requirements.txt")
        return False

def check_configuration():
    """Check service configurations"""
    config = get_config()
    status = config.get_service_status()
    missing_vars = config.get_missing_env_vars()
    
    logger.info("🔧 Service Configuration Status:")
    for service, is_configured in status.items():
        status_icon = "✅" if is_configured else "❌"
        logger.info(f"   {status_icon} {service.upper()}: {'Configured' if is_configured else 'Not Configured'}")
        
        if not is_configured and service in missing_vars:
            logger.warning(f"      Missing variables: {', '.join(missing_vars[service])}")
    
    configured_count = sum(status.values())
    total_count = len(status)
    
    logger.info(f"📊 {configured_count}/{total_count} services configured")
    
    if configured_count == 0:
        logger.error("❌ No services are configured! Please check your .env file")
        return False
    
    return True

def main():
    """Main startup function"""
    logger.info("🚀 Starting Azure AI Services Application")
    logger.info("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check configuration
    if not check_configuration():
        logger.warning("⚠️  Some services are not configured, but starting anyway...")
    
    # Import and start the app
    try:
        import uvicorn
        from app import app

        config = get_config()
        port = config.server.port
        debug = config.server.environment == "development"

        # SSL configuration
        ssl_config = {}
        if config.server.ssl_enabled:
            ssl_config = {
                "ssl_keyfile": config.server.ssl_key_path,
                "ssl_certfile": config.server.ssl_cert_path
            }
            protocol = "https"
        else:
            protocol = "http"

        logger.info(f"🌐 Starting server on {protocol}://localhost:{port}")
        logger.info(f"🔧 Environment: {config.server.environment}")
        logger.info(f"🔒 SSL Enabled: {config.server.ssl_enabled}")
        if config.server.ssl_enabled:
            logger.info(f"📜 SSL Certificate: {config.server.ssl_cert_path}")
            logger.info(f"🔑 SSL Key: {config.server.ssl_key_path}")
        logger.info("=" * 50)

        uvicorn.run(
            "app:app",
            host="0.0.0.0",
            port=port,
            reload=debug,
            log_level="info" if not debug else "debug",
            **ssl_config
        )
    except KeyboardInterrupt:
        logger.info("\n👋 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()