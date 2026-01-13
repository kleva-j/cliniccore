# ClinicCore Docker Setup

This document explains how to run the ClinicCore application using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available RAM
- Ports 3000, 3306, 6379, and 80 available (or configure different ports in .env)

## Quick Start

### Development Environment

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Start development environment:**
   ```bash
   docker-compose --profile dev up -d
   ```

3. **Run database migrations:**
   ```bash
   docker-compose exec app-dev pnpm db:push
   ```

4. **Access the application:**
   - Application: http://localhost:3000
   - Database: localhost:3306

### Production Environment

1. **Copy and configure environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Start production environment:**
   ```bash
   docker-compose --profile prod up -d
   ```

3. **Run database migrations:**
   ```bash
   docker-compose exec app-prod pnpm db:push
   ```

4. **Access the application:**
   - Application: http://localhost (via Nginx)
   - Direct app access: http://localhost:3000

## Services

### Core Services

- **database**: MySQL 8.0 database
- **app-dev**: Development application server (profile: dev)
- **app-prod**: Production application server (profile: prod)

### Production Services

- **redis**: Redis cache and session store
- **nginx**: Reverse proxy with rate limiting and security headers

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Database
DATABASE_URL=mysql://cliniccore_user:cliniccore_pass@database:3306/cliniccore
DB_PASSWORD=your-secure-password

# Application
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
APP_PORT=3000

# OAuth (if using)
OAUTH_CLIENT_ID=your-oauth-client-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret
```

## Common Commands

### Development

```bash
# Start development environment
docker-compose --profile dev up -d

# View logs
docker-compose logs -f app-dev

# Execute commands in container
docker-compose exec app-dev pnpm test
docker-compose exec app-dev pnpm db:push

# Stop development environment
docker-compose --profile dev down
```

### Production

```bash
# Start production environment
docker-compose --profile prod up -d

# View logs
docker-compose logs -f app-prod nginx

# Execute commands in container
docker-compose exec app-prod pnpm db:push

# Stop production environment
docker-compose --profile prod down
```

### Database Management

```bash
# Access MySQL shell
docker-compose exec database mysql -u cliniccore_user -p cliniccore

# Backup database
docker-compose exec database mysqldump -u cliniccore_user -p cliniccore > backup.sql

# Restore database
docker-compose exec -T database mysql -u cliniccore_user -p cliniccore < backup.sql
```

## Data Persistence

Data is persisted in Docker volumes:

- `mysql_data`: Database files
- `redis_data`: Redis data (production only)

To backup volumes:
```bash
docker run --rm -v cliniccore-main_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .
```

## Security Considerations

### Development
- Uses default passwords (change in production)
- No SSL/TLS encryption
- Debug logging enabled

### Production
- **Change all default passwords**
- Configure SSL certificates in nginx.conf
- Set strong JWT_SECRET
- Configure OAuth credentials
- Enable HTTPS redirect in nginx.conf
- Review and adjust rate limiting rules

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   # Change ports in .env file
   ```

2. **Database connection issues:**
   ```bash
   # Check database health
   docker-compose exec database mysqladmin ping -h localhost -u root -p
   ```

3. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

4. **Out of disk space:**
   ```bash
   # Clean up Docker
   docker system prune -a
   docker volume prune
   ```

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app-dev
docker-compose logs database

# Follow logs in real-time
docker-compose logs -f
```

## Performance Tuning

### Database
- Adjust MySQL configuration in docker-compose.yml
- Monitor slow queries
- Consider read replicas for high load

### Application
- Adjust Node.js memory limits
- Configure Redis for session storage
- Use nginx for static file serving

### Nginx
- Adjust worker processes and connections
- Configure caching for static assets
- Fine-tune rate limiting rules

## Monitoring

Consider adding monitoring services:

```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    # ... configuration

  grafana:
    image: grafana/grafana
    # ... configuration
```

## Scaling

For horizontal scaling:

1. Use external database (AWS RDS, etc.)
2. Use external Redis (AWS ElastiCache, etc.)
3. Deploy multiple app instances behind load balancer
4. Use container orchestration (Kubernetes, Docker Swarm)