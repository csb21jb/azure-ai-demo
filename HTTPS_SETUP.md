# HTTPS Setup for Azure AI Services

This document explains how to run the Azure AI Services application with HTTPS support, which is required for certain browser features like microphone access.

## Why HTTPS is Required

Modern browsers require HTTPS for accessing sensitive features like:
- Microphone access (Web Audio API)
- Camera access
- Geolocation
- Service Workers
- Clipboard API

## Quick Start

### Option 1: Start with HTTPS (Recommended)
```bash
python3 start_https.py
```

### Option 2: Start with HTTP (for basic testing)
```bash
python3 start_http.py
```

### Option 3: Use the original start script (uses .env settings)
```bash
python3 start.py
```

## Configuration

The HTTPS setup is controlled by environment variables in your `.env` file:

```env
# SSL Configuration
SSL_ENABLED=true
SSL_CERT_PATH=ssl/cert.pem
SSL_KEY_PATH=ssl/key.pem
PORT=8443
CORS_ORIGIN=https://localhost:8443
```

## SSL Certificates

### Automatic Generation
The `start_https.py` script will automatically generate self-signed SSL certificates if they don't exist.

### Manual Generation
If you need to generate certificates manually:

```bash
# Create ssl directory
mkdir -p ssl

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 \
    -keyout ssl/key.pem -out ssl/cert.pem \
    -days 365 -nodes \
    -subj "/C=US/ST=Development/L=Local/O=AI Services/OU=Development/CN=localhost"
```

### Using Custom Certificates
If you have your own SSL certificates, place them in the `ssl/` directory:
- `ssl/cert.pem` - SSL certificate
- `ssl/key.pem` - Private key

Or update the paths in your `.env` file:
```env
SSL_CERT_PATH=path/to/your/cert.pem
SSL_KEY_PATH=path/to/your/key.pem
```

## Browser Security Warning

When using self-signed certificates, your browser will show a security warning. This is normal for development.

### Chrome/Edge
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

### Firefox
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

### Safari
1. Click "Show Details"
2. Click "visit this website"
3. Click "Visit Website"

## Testing HTTPS

Once the server is running, test the endpoints:

```bash
# Health check
curl -k https://localhost:8443/api/health

# Configuration status
curl -k https://localhost:8443/api/config/status
```

## Microphone Access

With HTTPS enabled, your web application can now access the microphone:

```javascript
// This will now work with HTTPS
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        console.log('Microphone access granted');
        // Use the audio stream
    })
    .catch(err => {
        console.error('Microphone access denied:', err);
    });
```

## Troubleshooting

### Port Already in Use
If port 8443 is already in use, change the port in your `.env` file:
```env
PORT=9443
```

### SSL Certificate Errors
If you get SSL certificate errors:
1. Regenerate certificates: `rm -rf ssl/ && python3 start_https.py`
2. Check file permissions: `ls -la ssl/`
3. Ensure OpenSSL is installed: `openssl version`

### CORS Issues
If you get CORS errors, update the CORS_ORIGIN in your `.env` file to match your frontend URL.

## Production Deployment

For production, use proper SSL certificates from a Certificate Authority (CA):
1. Obtain certificates from Let's Encrypt, Cloudflare, or your hosting provider
2. Update the certificate paths in your `.env` file
3. Set `NODE_ENV=production`

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `SSL_ENABLED` | `true` | Enable/disable SSL |
| `SSL_CERT_PATH` | `ssl/cert.pem` | Path to SSL certificate |
| `SSL_KEY_PATH` | `ssl/key.pem` | Path to SSL private key |
| `PORT` | `8443` (HTTPS) / `8000` (HTTP) | Server port |
| `CORS_ORIGIN` | Auto-generated | CORS origin URL |

## Files Created

The HTTPS setup creates these files:
- `ssl/cert.pem` - SSL certificate
- `ssl/key.pem` - SSL private key (keep secure!)
- `start_https.py` - HTTPS startup script
- `start_http.py` - HTTP startup script
- `HTTPS_SETUP.md` - This documentation

## Security Notes

⚠️ **Important**: The generated certificates are self-signed and only suitable for development. Never use self-signed certificates in production.

🔒 **Private Key Security**: The `ssl/key.pem` file contains your private key. Keep it secure and never commit it to version control.
