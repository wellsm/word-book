# Deployment Guide

This guide explains how to deploy the Word Book application using Docker.

## 🐳 Docker Deployment

The application has been migrated from nixpacks to Docker for better control and flexibility.

### Architecture

- **Multi-stage build**: Optimized for production with separate build and runtime stages
- **Caddy web server**: Serves the built React application with automatic HTTPS support  
- **Alpine Linux**: Lightweight base image for production runtime
- **Security**: Non-root user execution with proper permissions

### Files

- `Dockerfile` - Multi-stage Docker build configuration
- `Caddyfile` - Caddy web server configuration
- `docker-compose.yml` - Local development and testing
- `.dockerignore` - Optimizes build context by excluding unnecessary files
- `scripts/docker-test.sh` - Local testing script

## 🚀 Local Development

### Quick Start

```bash
# Using Docker Compose (recommended)
docker-compose up --build

# Or manual Docker build
docker build -t word-book .
docker run -p 8080:8080 -e PORT=8080 word-book
```

### Testing

```bash
# Run the test script
./scripts/docker-test.sh

# Manual testing
curl http://localhost:8080/health  # Health check
curl http://localhost:8080/        # Main application
```

## 🌐 Production Deployment

### Platform Support

The Docker setup works with any platform that supports Docker containers:

- **Railway** ✅ (Auto-deploy from Dockerfile)
- **Render** ✅ (Auto-deploy from Dockerfile) 
- **Fly.io** ✅ (fly.toml configuration)
- **Google Cloud Run** ✅
- **AWS ECS/Fargate** ✅
- **Azure Container Instances** ✅
- **Heroku** ✅ (Using container registry)

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Port the application listens on | `8080` | No (auto-set by most platforms) |

### Health Checks

- **Endpoint**: `/health`
- **Response**: `200 OK`
- **Used for**: Platform health monitoring and load balancer checks

## 🔧 Configuration

### Caddy Configuration

The `Caddyfile` is configured for production deployment with:

- **Automatic HTTPS**: Disabled (handled by platform/proxy)
- **Security Headers**: XSS protection, content type sniffing prevention
- **HTTP/3 Support**: Modern protocol support
- **Asset Caching**: Long-term caching for static assets
- **Gzip Compression**: Optimized asset delivery
- **SPA Routing**: Proper handling of client-side routes

### Docker Optimizations

- **Multi-stage build**: Reduces final image size
- **Layer caching**: Optimized for CI/CD build times  
- **Security**: Non-root user execution
- **Health checks**: Built-in container health monitoring
- **Alpine Linux**: Minimal attack surface

## 📊 Monitoring

### Logs

```bash
# View container logs
docker logs <container-name>

# Follow logs in real-time
docker logs -f <container-name>
```

### Health Monitoring

The application exposes health information:

- `/health` - Basic health check (returns 200)
- Container health check runs every 30s
- Caddy version check for service validation

## 🚀 CI/CD

### GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`):

- **Build**: Creates and tests Docker image
- **Test**: Validates health endpoints and basic functionality
- **Deploy**: Notifies deployment systems (configurable webhook)

### Webhook Integration

Configure `WEBHOOK_URL` in GitHub repository variables to receive deployment notifications.

## 🔐 Security Features

### Application Security

- **Security Headers**: XSS, clickjacking, and content-type protection
- **Non-root Execution**: Container runs as dedicated `caddy` user
- **Minimal Dependencies**: Alpine Linux base reduces attack surface
- **Static Assets**: Pre-built React application with no server-side execution

### Network Security

- **HTTPS Ready**: Caddy supports automatic HTTPS (disabled for platform deployment)
- **HTTP/3 Support**: Modern, secure protocol support
- **Proxy Trust**: Configured to work with platform proxies

## 🛠️ Troubleshooting

### Common Issues

**Container won't start:**
```bash
docker logs <container-name>
```

**Port already in use:**
```bash
# Use different port
docker run -p 3000:8080 -e PORT=8080 word-book
```

**Build failures:**
- Check Node.js version (requires 18+)
- Verify all dependencies are included in package.json
- Check .dockerignore isn't excluding necessary files

### Debug Mode

```bash
# Run with shell access
docker run -it --entrypoint /bin/sh word-book

# Check Caddy configuration
docker exec -it <container> caddy validate --config /etc/caddy/Caddyfile
```

## 📈 Performance

### Build Optimization

- Multi-stage build reduces final image size (~45MB runtime)
- Build caching optimizes CI/CD pipeline performance
- Production dependencies only in final image

### Runtime Performance

- Caddy is highly performant for static asset serving
- Gzip compression reduces bandwidth usage
- Long-term caching for static assets improves load times
- HTTP/3 support for modern clients

## 🔄 Migration from Nixpacks

### What Changed

- **Removed**: `nixpacks.toml` configuration file
- **Added**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- **Updated**: `Caddyfile` paths for Docker directory structure
- **Enhanced**: CI/CD with Docker build testing

### Benefits

- **Better Control**: Full control over build and runtime environment
- **Platform Agnostic**: Works on any Docker-supporting platform
- **Debugging**: Easier to debug and test locally
- **Caching**: Better build caching for faster deployments
- **Security**: More granular security controls

---

**Need Help?** Check the application logs and health endpoints first. Most deployment issues are related to environment variables or port configuration. 