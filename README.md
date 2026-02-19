# CodeForger – Collaborative MERN Development Platform (Dockerized)

CodeForger is a full-stack collaborative development platform built using the MERN stack, Docker, Redis, MongoDB, and Google Gemini AI. It allows users to register, create projects, collaborate with other users, and generate code using AI. The entire system runs inside Docker containers for consistency, portability, and easy deployment.

---

# Architecture Overview

The application consists of four main services running in Docker containers:

* Frontend (React + Vite) – User interface
* Backend (Node.js + Express) – API, authentication, business logic
* MongoDB – Primary database
* Redis – Real-time messaging and caching

External integrations:

* Google Gemini AI – AI code generation
* WebContainer API – In-browser code execution environment

---

# Docker Architecture

```
Browser
   │
   ▼
Frontend Container (React, Vite) :5173
   │
   ▼
Backend Container (Node.js, Express) :3000
   │
   ├── MongoDB Container :27017
   └── Redis Container   :6379
```

Docker provides:

* Isolated environments
* Automatic networking between services
* Consistent runtime across systems
* Easy deployment

---

# Prerequisites

Install the following before running the project:

* Docker Desktop
  https://www.docker.com/products/docker-desktop

* Node.js (optional for local development)
  https://nodejs.org

* Google Gemini API Key
  https://aistudio.google.com/app/apikey

---

# Environment Variables Setup

Create a `.env` file in the root directory:

```
soen-main/.env
```

Add:

```
JWT_SECRET=your_jwt_secret_key
GOOGLE_AI_KEY=your_google_gemini_api_key
```

Create another `.env` file inside frontend:

```
frontend/.env
```

Add:

```
VITE_API_URL=http://localhost:3000
```

---

# Starting the Project Using Docker

Step 1: Open terminal and navigate to project root

```
cd soen-main
```

Step 2: Build and start containers

```
docker compose up -d --build
```

This will:

* Build frontend image
* Build backend image
* Pull MongoDB image
* Pull Redis image
* Start all containers

Step 3: Verify containers

```
docker ps
```

You should see:

* frontend
* backend
* mongodb
* redis

---

# Access the Application

Frontend:

```
http://localhost:5173
```

Backend API:

```
http://localhost:3000
```

MongoDB:

```
mongodb://localhost:27017
```

Redis:

```
localhost:6379
```

---

# Stopping the Project

To stop all containers:

```
docker compose down
```

---

# Restarting the Project

After system restart:

```
docker compose up -d
```

---

# Rebuilding Containers After Code Changes

```
docker compose up -d --build
```

---

# Project Features

User Features:

* User registration and login
* JWT authentication
* Secure authorization
* Create new projects
* Add collaborators
* Real-time project collaboration

AI Features:

* Generate code using Google Gemini AI
* Structured JSON-based code generation
* AI assisted development workflow

Real-Time Features:

* Socket.IO integration
* Redis-powered messaging
* Live updates between collaborators

Execution Environment:

* WebContainer integration
* Run Node.js projects inside browser
* Install dependencies dynamically

---

# Backend Responsibilities

The backend handles:

* Authentication and JWT validation
* User management
* Project management
* AI request handling
* Socket.IO communication
* Redis integration
* MongoDB data storage

---

# Frontend Responsibilities

The frontend handles:

* User interface rendering
* Authentication flow
* Project creation and management
* AI interaction
* Real-time updates
* WebContainer integration

---

# Database Structure

MongoDB stores:

* Users
* Projects
* Collaborators
* Project metadata

Redis stores:

* Real-time communication data
* Session caching

---

# Docker Containers Description

Frontend Container

* Runs React + Vite
* Serves UI
* Communicates with backend

Backend Container

* Runs Node.js server
* Handles API requests
* Connects to MongoDB and Redis

MongoDB Container

* Stores application data
* Persistent storage

Redis Container

* Real-time messaging
* Cache layer

---

# Useful Docker Commands

Start containers:

```
docker compose up -d
```

Stop containers:

```
docker compose down
```

Rebuild containers:

```
docker compose up -d --build
```

View running containers:

```
docker ps
```

View logs:

```
docker logs backend
docker logs frontend
```

Access container terminal:

```
docker exec -it backend bash
```

Remove unused images:

```
docker system prune -a
```

---

# How Authentication Works

1. User logs in
2. Backend generates JWT token
3. Token stored in browser localStorage
4. Token sent with every API request
5. Backend validates token
6. Access granted or denied

---

# How AI Integration Works

1. User sends prompt
2. Backend sends request to Gemini AI
3. Gemini generates structured response
4. Backend returns response to frontend
5. Frontend renders generated code

---

# How Real-Time Collaboration Works

1. Frontend connects to Socket.IO server
2. Redis manages messaging
3. Backend broadcasts updates
4. All connected clients receive updates instantly

---

# Technologies Used

Frontend:

* React
* Vite
* Tailwind CSS
* Socket.IO Client

Backend:

* Node.js
* Express.js
* MongoDB
* Redis
* Socket.IO
* JWT Authentication

AI:

* Google Gemini AI

Infrastructure:

* Docker
* Docker Compose

---

# Troubleshooting

If containers are not running:

```
docker compose up -d --build
```

If port is already in use:

```
docker compose down
```

If environment variables not working:

```
docker compose down
docker compose up -d --build
```

---

# Production Deployment Ready

This project is fully containerized and can be deployed to:

* AWS
* Azure
* Google Cloud
* DigitalOcean
* Any Docker-supported environment
