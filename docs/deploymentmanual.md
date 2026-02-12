# Frontend Deployment and CI/CD Foundation

# Slooze Frontend Deployment & CI/CD Foundation

## End-to-End DevOps Project Documentation

---

## 1. Project Overview

This document outlines the complete process of deploying a **Vite + React frontend application** to **AWS EC2** using **Docker**, starting from a local development environment and progressing to a production-ready container running on EC2.

The project follows established DevOps best practices:

- Validate the application locally before cloud deployment
- Use immutable Docker images
- Separate build and runtime concerns
- Establish a foundation for CI/CD automation (Jenkins-ready architecture)

This initiative is designed as a structured **DevOps learning project**, emphasizing practical implementation and production-oriented thinking.

---

## 2. Initial Assets and Constraints

### 2.1 Available Resources

- **Windows 10 system** with PuTTY
  > OR
- **WSL (Ubuntu)** for local development (running on the same Windows machine) — _Optional_
- Git repository containing the frontend source code
- AWS Free Tier account
- EC2 Ubuntu instance (`t2.micro`)

### 2.2 Constraints

- AWS Free Tier only (limited memory resources)
- Must follow best-practice approaches
- Step-by-step execution without unnecessary tool overload

---

## 3. Application Details

- **Framework:** React + Vite
- **Language:** TypeScript
- **Package Manager:** npm
- **Build Output Directory:** `dist/`
- **Production Web Server:** Nginx

---

# Phase 1: Prerequisites Check (START HERE)

> Note: This setup uses **Ubuntu on Windows 10 via WSL (Windows Subsystem for Linux)**.  
> WSL is optional but recommended for a Linux-consistent development environment.

---

## 1.1 Local Environment Verification (WSL)

### Operating System Verification

```bash
lsb_release -a
```

Expected Output:

> Ubuntu 20.04 or 22.04

Purpose: - Confirm a stable Linux environment suitable for Docker and Node tooling

### Git Verification

```
git --version
```

Expected Output:

```
git version 2.x.x
```

Purpose: - Ensure source control operations are available

### Node.js and npm Verification (Initial State)

```
node -v
npm -v
```

Expected Output:

- Node.js ≥ 18
- npm ≥ 9

Observation:

- Existing Node version may be outdated for modern Vite and React projects

## 1.2 Node Version Management Using NVM

### Install NVM

```
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Reload the shell and verify installation:

```
source ~/.bashrc
nvm --version
```

### Install and Configure Node LTS (Node 20)

```
nvm install 20
nvm use 20
nvm alias default 20
```

Verify installation:

```
node -v
npm -v
```

Expected Output:

```
v20.x.x
npm 10.x.x
```

Purpose:

- Align with modern frontend tooling requirements
- Ensure consistency across local, CI, and production environments

  ## Phase 1: Prerequisites Check (ENDS HERE)

  ***

  ***

  # Phase 2: Dockerizing the Application (START HERE)

  ## 2.1 CI Dry-Run (Local Docker Validation)

  ### Clone Repository

  %%%bash
  cd ~
  git clone https://github.com/mr-porsche/slooze-frontend
  cd slooze-frontend
  %%%

  ***

  ### Install Dependencies and Verify Local Build

  %%%bash
  npm install
  %%%

  **Sample Output (Summary):**

  %%%
  added 289 packages, and audited 290 packages in 19s

  56 packages are looking for funding
  run `npm fund` for details

  2 vulnerabilities (1 moderate, 1 high)

  To address all issues, run:
  npm audit fix
  %%%

  **Notes:**
  - Vulnerabilities are not blocking the build
  - Can be resolved later via `npm audit fix`

  ***

### Build Application

%%%bash
npm run build
%%%

**Result:**

- `dist/` directory is generated
- Contains optimized static production assets

**Important Principle:**

In DevOps:

- Docker does not fix broken applications
- CI/CD does not fix broken applications
- Cloud does not fix broken applications

Always validate the application before containerization.

---

## 2.2 Production-Grade Docker Setup

### Goal

> **Build once, run anywhere**

Current State:

- TypeScript compiles successfully
- Vite build succeeds
- `dist/` exists

---

### Create `.dockerignore`

%%%bash
vi .dockerignore
%%%

Add:

%%%
node_modules
dist
.git
.gitignore
Dockerfile
README.md
npm-debug.log
%%%

**Purpose:**

- Faster builds
- Smaller image size
- Cleaner Docker layers

---

### Create `Dockerfile`

%%%bash
vi Dockerfile
%%%

Add:

%%%

# ---------- Build Stage ----------

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Production Stage ----------

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
%%%

**Explanation:**

- Stage 1: Builds assets using Node
- Stage 2: Serves static files using Nginx
- Node is not included in runtime
- Resulting image is small, secure, and production-ready

This Dockerfile is reusable:

- Locally
- On EC2
- In Jenkins CI

---

## 2.3 Install Docker (WSL)

%%%bash
sudo apt update
sudo apt install -y docker.io
%%%

Add current user to Docker group:

%%%bash
sudo usermod -aG docker $USER
newgrp docker
%%%

Verify installation:

%%%bash
docker --version
%%%

---

## 2.4 Build Docker Image

Ensure you are in the repository root directory.

%%%bash
docker build -t slooze-frontend:1.0 .
%%%

---

## 2.5 Run Container

%%%bash
docker run -d -p 8080:80 slooze-frontend:1.0
%%%

If port conflict occurs:

%%%
docker: Error response from daemon: failed to bind host port
address already in use
%%%

Check which process is using the port:

%%%bash
sudo lsof -i :8080
%%%

If needed, run on another port:

%%%bash
docker run -d -p 3000:80 slooze-frontend:1.0
%%%

Access in browser:

- http://localhost:3000

---

Verify running container:

%%%bash
docker ps
%%%

---

## 2.6 Achievements So Far

- Production-grade Docker image
- Multi-stage build implementation
- Node excluded from runtime
- Served via Nginx
- Environment parity: Local = EC2 = CI

---

# Phase 2: Dockerizing the Application (ENDS HERE)

---

# Phase 3: AWS EC2 Preparation and Deployment (Free Tier Safe)

## Phase Goal

> Prepare a clean Linux server capable of running Docker images predictably and safely within AWS Free Tier limits.

> Note: This phase introduced significant practical learning challenges during implementation.

---

## 3.1 EC2 Configuration Overview

### Instance Configuration

- **Operating System:** Ubuntu 22.04 LTS (Amazon Linux or others are acceptable)
- **Instance Type:** `t2.micro` (Free Tier eligible)
- **SSH Key Pair:** Required for secure access
- **Public IP Address:** Record for SSH and browser access

---

## Phase Coverage

1. Validate instance configuration
2. Harden EC2 basics
3. Deploy the same Docker image
4. Configure Security Group
5. Confirm browser accessibility

---

## 3.2 Connect to EC2 (From WSL)

%%%bash
cd ~
ssh -i path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
%%%

---

### Verify Operating System

%%%bash
lsb_release -a
%%%

**Expected Output:**

%%%
Ubuntu 22.04 LTS
%%%

---

## 3.3 System Update (Mandatory)

%%%bash
sudo apt update && sudo apt upgrade -y
%%%

**Purpose:**

- Apply security patches
- Stabilize package index
- Prevent Docker installation conflicts

---

### Install Docker

%%%bash
sudo apt install -y docker.io
%%%

Verify:

%%%bash
docker --version
%%%

Expected:

%%%
Docker version 28.x.x
%%%

---

## 3.4 Allow Docker Usage Without sudo

%%%bash
sudo usermod -aG docker ubuntu
newgrp docker
%%%

Verify group membership:

%%%bash
groups
%%%

Verify Docker:

%%%bash
docker ps
%%%

Expected Output:

%%%
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
%%%

---

### EC2 Status at This Point

- Ubuntu LTS installed
- System updated
- Docker installed
- Docker accessible without `sudo`
- Ready for container deployment

---

# 3.5 First Deployment on EC2 (START)

## Deployment Approaches

### ❌ Approach 1 — Copy From Local (Not Recommended)

%%%bash
scp -i path/to/your-key.pem -r ~/slooze-frontend ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/
%%%

Problems:

- Copies `node_modules`
- Slow transfer
- Non-portable
- Not aligned with DevOps best practices

---

### ✅ Approach 2 — Clone and Build on EC2 (Better Practice)

On EC2:

%%%bash
sudo apt install -y git # if not installed
git clone https://github.com/mr-porsche/slooze-frontend
cd slooze-frontend
docker build -t slooze-frontend:1.0 .
docker run -d -p 80:80 slooze-frontend:1.0
docker ps
%%%

This method is:

- Cleaner
- CI-aligned
- Source-driven
- Reproducible

---

## 3.6 Security Group Configuration (Critical Step)

Even if Docker exposes port 80, AWS Security Groups act as an external firewall.

If not configured, browser access to:

> http://<EC2_PUBLIC_IP>

will fail.

---

### Open Port 80 in Security Group

1. AWS Console → EC2 → Instances
2. Select instance → Security tab
3. Click Security Group link
4. Edit Inbound Rules
5. Add rule:

- **Type:** HTTP
- **Protocol:** TCP
- **Port:** 80
- **Source:** Anywhere-IPv4

Save changes.

---

## 3.7 Memory Limitation Issue (Free Tier Constraint)

While building on EC2:

%%%bash
docker build -t slooze-frontend:1.0 .
%%%

Build failed with:

%%%
npm error signal SIGKILL
%%%

Meaning:

- Linux kernel terminated process
- Cause: Out Of Memory (OOM)
- `t2.micro` (1 GB RAM) insufficient for frontend build

---

## 3.8 Architectural Correction

To ensure stability and reproducibility:

### Revised Strategy

- EC2 will NOT build frontend assets
- EC2 will ONLY run pre-built Docker images
- TypeScript and Vite builds will occur before deploy

---

---

# Phase 4: Revised Deployment Architecture (Production-Grade Approach)

## 4.1 Environment Clean-Up (Local + EC2)

Before applying the corrected architecture, remove all previously created containers and images.

---

### List Running Containers

%%%bash
docker ps
%%%

Example Output:

%%%
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
0f680114fda1 slooze-frontend:1.0 "/docker-entrypoint…" 59 minutes ago Up 59 minutes 0.0.0.0:80->80/tcp elegant_lehmann
%%%

---

### Stop and Remove Containers

%%%bash
docker stop <container_id>
docker rm <container_id>
%%%

Perform this on:

- Local machine (WSL)
- EC2 instance

---

### Remove Docker Image

%%%bash
docker rmi -f slooze-frontend:1.0
%%%

Example Output:

%%%
Untagged: slooze-frontend:1.0
Deleted: sha256:...
%%%

---

### Ensure No Residual Containers Exist

%%%bash
docker ps -a
%%%

Stop and remove any remaining containers to ensure a completely clean state.

---

# 4.2 Correct Production Architecture

## Architectural Principles

1. Build locally (WSL) where sufficient RAM is available
2. Docker image contains runtime only (Nginx + `dist/`)
3. EC2 serves static files only
4. EC2 never builds frontend code

This removes memory risk and aligns with production best practices.

---

## 4.3 Update Dockerfile (Local Machine)

Replace existing Dockerfile with:

%%%
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/\*

COPY dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
%%%

---

### This Dockerfile Ensures:

- Nginx-only runtime
- Assumes `dist/` is pre-built
- No Node.js in container
- No build stage
- No memory-intensive operations

---

## 4.4 Update `.dockerignore`

Remove `dist` from `.dockerignore`.

Commit and push updated:

- `Dockerfile`
- `.dockerignore`

---

## 4.5 Build Frontend Locally

%%%bash
npm run build
ls dist
%%%

Expected Output:

%%%
index.html
assets/
%%%

This confirms that production assets exist before Docker build.

---

## 4.6 Build Production Image (Local Only)

%%%bash
docker build -t slooze-frontend:prod .
%%%

If `dist/` was mistakenly excluded in `.dockerignore`, you will encounter:

%%%
COPY failed: file not found in build context or excluded by .dockerignore
%%%

Resolution:

- Ensure `dist/` is not excluded
- Rebuild image

---

## 4.7 Validate Container Locally

%%%bash
docker run -d -p 3000:80 slooze-frontend:prod
%%%

Access:

> http://localhost:3000

After verification:

%%%bash
docker stop <container_id>
%%%

---

# Phase Outcome

- Production-grade runtime-only Docker image
- Zero Node.js in container
- Zero build operations on EC2
- Memory-safe deployment model
- Clean separation between build and runtime

---

---

# Phase 5: Transfer Production Image to EC2 (Immutable Deployment)

## Objective

Move the pre-built, production-grade Docker image to EC2 without:

- Source code
- `node_modules`
- Build steps
- Node.js runtime

---

## 5.1 Production Image Characteristics

The new image:

- Contains only Nginx
- Contains static HTML/CSS/JS (`dist/`)
- Uses minimal RAM
- No CPU spikes
- No runtime build steps

This makes it ideal for AWS Free Tier (`t2.micro`).

---

# 5.2 Export Docker Image (Local Machine)

%%%bash
docker save slooze-frontend:prod -o slooze-frontend-prod.tar
%%%

Verify:

%%%bash
ls -lh slooze-frontend-prod.tar
%%%

Example Output:

%%%
-rw------- 1 user user 63M Feb 10 20:23 slooze-frontend-prod.tar
%%%

This creates a single portable Docker image archive.

---

# 5.3 Copy Image to EC2

%%%bash
scp -i path/to/your-key.pem slooze-frontend-prod.tar ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/
%%%

---

# 5.4 Load Image on EC2

Connect to EC2:

%%%bash
ssh -i path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
%%%

Load image:

%%%bash
docker load -i slooze-frontend-prod.tar
%%%

Expected Output:

%%%
Loaded image: slooze-frontend:prod
%%%

Verify:

%%%bash
docker images
%%%

You should see:

> slooze-frontend prod

---

## 5.5 Clean Up Dangling Images (Optional)

If you see `<none>` images consuming space:

%%%bash
docker image prune -f
%%%

---

# 5.6 Run Production Container on EC2

%%%bash
docker run -d --restart unless-stopped -p 80:80 slooze-frontend:prod
%%%

### This Configuration Ensures:

- Runs in detached mode
- Automatically restarts after EC2 reboot
- Minimal memory usage
- Serves traffic on port 80

---

### Verify Running Container

%%%bash
docker ps
%%%

Expected Output:

%%%
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
bfec244565ac slooze-frontend:prod "/docker-entrypoint…" 6 seconds ago Up 5 seconds 0.0.0.0:80->80/tcp heuristic_hellman
%%%

---

# Deployment Strategy Summary

- Build once (locally)
- Ship immutable image
- Run lightweight container on EC2

---

# Key Lessons Learned

- Validate containers locally before cloud deployment
- Avoid building on low-memory EC2 instances
- Use immutable Docker images
- Document processes before automation

---

# Next Steps

- Create deployment automation script
- Design Jenkins CI/CD pipeline
- Automate image build and deployment workflow

```

```

```

```
