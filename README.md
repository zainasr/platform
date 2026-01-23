# Platform Services - Application Repository

[![CI Status](https://img.shields.io/badge/CI-GitHub%20Actions-blue)](https://github.com/features/actions)
[![Container Registry](https://img.shields.io/badge/Registry-GHCR-purple)](https://ghcr.io)
[![GitOps](https://img.shields.io/badge/GitOps-ArgoCD-orange)](https://argo-cd.readthedocs.io/)

> **Production-grade microservices platform implementing cloud-native best practices with GitOps-driven deployments**

This repository contains the **application source code** and **container build pipelines** for a distributed microservices platform designed for Kubernetes. It follows the GitOps paradigm by separating application code (this repo) from infrastructure configuration ([`platform-ops`](https://github.com/zainasr/platform-ops)).

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Microservices](#-microservices)
- [Container Security](#-container-security)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Local Development](#-local-development)
- [Best Practices](#-best-practices)
- [Deployment Flow](#-deployment-flow)

---

## 🏗️ Architecture Overview

This platform implements a **polyglot microservices architecture** with the following characteristics:

- **Multi-language services**: Go, Node.js, and Python
- **Cloud-native design**: 12-factor app principles
- **GitOps-driven deployments**: Declarative infrastructure with Argo CD
- **Immutable infrastructure**: Container images tagged with Git SHA
- **Observability-first**: Prometheus metrics and Grafana dashboards
- **Security hardened**: Non-root containers, read-only filesystems, minimal attack surface

### Service Communication

```
┌─────────────┐
│   Ingress   │
└──────┬──────┘
       │
   ┌───▼────┐
   │api-node│ (Node.js - API Gateway)
   └───┬────┘
       │
   ┌───▼────┐
   │core-go │ (Go - Core Business Logic)
   └────────┘
       
┌──────────────┐
│worker-python │ (Python - Background Jobs)
└──────────────┘
```

---

## 🧱 Microservices

### 1. **api-node** - API Gateway & Orchestration Layer

**Language**: Node.js (Express.js)  
**Port**: `3000`  
**Responsibility**: 
- REST API gateway
- Request routing and orchestration
- Authentication/Authorization middleware
- Rate limiting and request validation

**Health Endpoints**:
- `GET /health` - Liveness probe
- `GET /ready` - Readiness probe
- `GET /metrics` - Prometheus metrics

**Technology Stack**:
- Express.js
- Prometheus client
- Winston logger

---

### 2. **core-go** - Core Backend Service

**Language**: Go  
**Port**: `8080`  
**Responsibility**:
- Core business logic
- Data processing and validation
- Domain service layer
- Database operations

**Health Endpoints**:
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics (promhttp)

**Technology Stack**:
- Go 1.21+
- Gorilla Mux / Chi router
- Prometheus Go client
- GORM (if using database)

---

### 3. **worker-python** - Background Worker

**Language**: Python  
**Port**: `8000`  
**Responsibility**:
- Scheduled background jobs (cron-like)
- Asynchronous task processing
- Data aggregation and reporting
- Batch operations

**Health Endpoints**:
- `GET /health` - Worker health status
- `GET /metrics` - Prometheus metrics

**Technology Stack**:
- Python 3.11+
- FastAPI / Flask
- APScheduler or Celery
- Prometheus Python client

---

## 🔒 Container Security

All services implement **defense-in-depth security** with the following best practices:

### Multi-Stage Docker Builds

Each `Dockerfile` uses multi-stage builds to:
- Separate build dependencies from runtime
- Minimize final image size
- Reduce attack surface

### Security Hardening

```yaml
Security Controls:
  ✓ Non-root user (UID: 65532)
  ✓ Read-only root filesystem
  ✓ No shell in production images
  ✓ Distroless/minimal base images
  ✓ Capability dropping
  ✓ securityContext enforcement
```

### Base Images

| Service | Base Image | Final Size |
|---------|------------|------------|
| api-node | `node:21-alpine` | ~150MB |
| core-go | `gcr.io/distroless/static` | ~15MB |
| worker-python | `python:3.11-slim` | ~120MB |

### Vulnerability Scanning

- **Trivy**: Integrated in CI pipeline
- **Snyk**: Optional third-party scanning
- **GHCR**: Native vulnerability scanning

---

## 🔄 CI/CD Pipeline

### CI Responsibilities (This Repository)

This repository implements **Continuous Integration** using **GitHub Actions**:

#### Build Pipeline (`.github/workflows/build.yml`)

```yaml
Triggers:
  - Push to main branch
  - Pull request to main
  - Manual workflow dispatch

Steps:
  1. Checkout code
  2. Run tests and linters
  3. Build Docker images (multi-arch)
  4. Tag with Git SHA
  5. Push to GHCR
  6. Update image tag in platform-ops
  7. Create Git commit
  8. Push to platform-ops repository
```

#### Image Tagging Strategy

```bash
# Format: service-name:git-sha
ghcr.io/<org>/api-node:a1b2c3d
ghcr.io/<org>/core-go:a1b2c3d
ghcr.io/<org>/worker-python:a1b2c3d

# Additional tags
ghcr.io/<org>/api-node:latest
ghcr.io/<org>/api-node:v1.2.3  # Semantic versioning
```

### CD Responsibilities (platform-ops Repository)

**Continuous Deployment** is handled by **Argo CD** in the [`platform-ops`](https://github.com/zainasr/platform-ops) repository.

⚠️ **Important**: This repository **does not deploy** to Kubernetes. All deployments are GitOps-driven.

---

## 🚀 Deployment Flow

### GitOps Workflow

```
┌──────────────┐
│  Developer   │
│ commits code │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  GitHub Actions  │
│  (CI Pipeline)   │
└──────┬───────────┘
       │
       ├─► Build Docker images
       ├─► Tag with Git SHA
       ├─► Push to GHCR
       │
       ▼
┌──────────────────┐
│  Update Tag in   │
│  platform-ops    │
│  values.yaml     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│    Argo CD       │
│  Auto-Sync       │
└──────┬───────────┘
       │
       ├─► Render Helm charts
       ├─► Apply manifests
       ├─► Deploy to K8s
       │
       ▼
┌──────────────────┐
│  Kubernetes      │
│  Cluster         │
└──────────────────┘
```

### Rollback Strategy

```bash
# Rollback is just a Git revert
cd platform-ops
git revert HEAD
git push origin main

# Argo CD automatically deploys previous version
```

---

## 💻 Local Development

### Prerequisites

- **Docker** (v24+)
- **Docker Compose** (v2+)
- **Go** (v1.21+)
- **Node.js** (v20+)
- **Python** (v3.11+)

### Running Services Locally

#### Using Docker Compose

```bash
# Start all services
docker-compose up --build

# Start specific service
docker-compose up api-node

# View logs
docker-compose logs -f core-go

# Stop all services
docker-compose down
```

#### Native Development

```bash
# API Node
cd api-node
npm install
npm run dev

# Core Go
cd core-go
go mod download
go run main.go

# Worker Python
cd worker-python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Running Tests

```bash
# API Node
cd api-node
npm test
npm run test:coverage

# Core Go
cd core-go
go test ./... -v
go test -cover ./...

# Worker Python
cd worker-python
pytest
pytest --cov
```

---

## ✅ Best Practices

### Code Quality

- **Linting**: ESLint (Node.js), golangci-lint (Go), Ruff (Python)
- **Formatting**: Prettier, gofmt, Black
- **Testing**: Jest, Go testing, pytest
- **Coverage**: Minimum 80% code coverage

### Container Best Practices

1. **Use specific base image tags** (not `latest`)
2. **Implement health checks** in all services
3. **Use multi-stage builds** to minimize image size
4. **Run as non-root user** (security)
5. **Set resource limits** in Kubernetes
6. **Implement graceful shutdown** for SIGTERM
7. **Use .dockerignore** to exclude unnecessary files

### Kubernetes Best Practices

1. **Resource requests and limits**
2. **Liveness and readiness probes**
3. **Pod disruption budgets**
4. **Horizontal Pod Autoscaling (HPA)**
5. **Network policies**
6. **Service mesh** (optional: Istio/Linkerd)

### Monitoring & Observability

- **Metrics**: Prometheus format (`/metrics` endpoint)
- **Logging**: Structured JSON logs
- **Tracing**: OpenTelemetry (optional)
- **Dashboards**: Grafana

---

## 🔗 Related Resources

- **GitOps Repository**: [`platform-ops`](https://github.com/zainasr/platform-ops)
- **CI/CD Documentation**: [GitHub Actions Workflows](.github/workflows/)
- **Container Registry**: [GHCR Packages](https://ghcr.io)

---

## 📚 Additional Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [API Documentation](docs/api.md)
- [Development Setup](docs/development.md)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

**Built with ❤️ using cloud-native best practices**

