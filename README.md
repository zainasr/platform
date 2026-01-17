# Platform Services (Application Repository)

This repository contains the **application code** and **container build logic**
for a production-style microservices platform.

It is designed to be used together with the
[`platform-ops`](https://github.com/zainasr/platform-ops) repository,
which handles Kubernetes, Helm, and GitOps deployments.

---

## 🧱 Services

| Service | Language | Responsibility |
|------|--------|---------------|
| core-go | Go | Core backend service |
| api-node | Node.js | API gateway / orchestration layer |
| worker-python | Python | Background worker (cron-like) |

Each service:
- is containerized
- runs as non-root
- exposes health and/or metrics endpoints
- is designed for Kubernetes

---

## 🐳 Containerization

- Docker multi-stage builds
- Distroless / minimal runtime images
- Non-root execution (UID 65532)
- Secure-by-default configuration

Images are built and pushed to **GitHub Container Registry (GHCR)**.

---

## 🔁 CI Responsibilities (GitHub Actions)

This repository owns **CI only**:

- Build Docker images
- Tag images with Git commit SHA
- Push images to GHCR
- Promote image tags to `platform-ops` (GitOps repo)

⚠️ CI **does not deploy to Kubernetes**.

---

## 🚀 Deployment Model (GitOps)

Deployments are handled by **Argo CD** using Helm charts stored in
the `platform-ops` repository.

Flow:

