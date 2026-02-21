# CodeForger – Collaborative AI-Powered MERN Development Platform (Dockerized)

CodeForger is a full-stack collaborative development platform that allows multiple users to build software projects together with the help of AI. It combines real-time collaboration, AI-driven code generation, and containerized execution to provide a complete development environment inside the browser.

Users can create projects, invite collaborators, interact with AI to generate project files, and instantly run the generated applications inside isolated Docker containers.

---

## 🚀 Features

### 🔐 Authentication System
- Secure user registration and login
- Persistent authentication using tokens/sessions
- User-specific project access and management

### 📁 Collaborative Project Management
- Create and manage multiple development projects
- Invite and add collaborators to projects
- View collaborator avatars and project team members
- Shared access to the same project workspace

### 🤖 AI-Powered Code Generation
- Integrated AI assistant (Google Gemini AI)
- Users can prompt AI to generate complete project structures
- AI generates files such as:
  - App.jsx
  - Navbar.jsx
  - Layout.jsx
  - and other components based on prompts
- Multiple collaborators can interact with AI in the same project
- AI understands context and updates project files accordingly

### 💬 Real-Time Collaborative AI Interaction
- All collaborators share a unified AI chat interface
- Collaborators can instruct AI to modify or create files
- AI responds with generated code instantly
- Enables team-based AI-driven development

### 🐳 Containerized Code Execution
- Each project runs inside an isolated Docker container
- Generated code can be executed safely
- Ensures environment consistency across all users
- Eliminates "works on my machine" issues

### 👥 Collaborator Management
- Add collaborators to projects via modal interface
- Select users and grant them access instantly
- Collaborators can view, edit, and generate code using AI
- Shared development environment

### 📦 Generated Files Explorer
- View AI-generated project files
- Navigate between files easily
- Real-time file updates

### 🎨 Modern UI
- Dark gradient modern interface
- Responsive design
- Clean dashboard and project view
- Professional developer experience

---

## 📸 Screenshots

### 🔐 Authentication
<img width="894" height="907" alt="image" src="https://github.com/user-attachments/assets/232e1337-0ae1-4d15-b9b1-e6bcd27c1672" />

Shows secure login and account creation.

---

### 📊 Project Dashboard
<img width="1600" height="897" alt="image" src="https://github.com/user-attachments/assets/4a368887-52a4-4c17-bb31-f16390f25435" />

Displays user projects and allows creating new collaborative projects.

---

### ➕ Create Project
<img width="1760" height="985" alt="image" src="https://github.com/user-attachments/assets/3eeef7c2-ff19-430f-a0ae-ad14dee44891" />

Users can create new projects and initialize collaboration.

---

### 👥 Add Collaborators
<img width="1592" height="1007" alt="image" src="https://github.com/user-attachments/assets/536840cc-3b78-44dc-85dc-342fd20a90c8" />

Users can invite collaborators to work together.

---

### 🤖 AI Code Generation
<img width="1600" height="797" alt="image" src="https://github.com/user-attachments/assets/e283acb7-3acf-41ea-93ca-851e7a369504" />

Collaborators interact with AI to generate project files.

---

### 💻 Collaborative Workspace
<img width="1600" height="899" alt="image" src="https://github.com/user-attachments/assets/2944eed3-5f91-4e6d-8a47-9338dd9fa8c9" />

Full development environment with AI chat, file explorer, and live preview.

---

## 🏗️ Architecture Overview

```
CodeForger
│
├── Frontend (React + Tailwind)
│ ├── Authentication UI
│ ├── Project Dashboard
│ ├── AI Chat Interface
│ ├── File Explorer
│ └── Collaboration UI
│
├── Backend (Node.js + Express)
│ ├── Authentication APIs
│ ├── Project APIs
│ ├── Collaboration APIs
│ ├── AI Integration APIs
│ └── Container Management APIs
│
├── Database (MongoDB)
│ ├── Users
│ ├── Projects
│ ├── Collaborators
│ └── Files Metadata
│
├── Cache & Queue (Redis)
│ └── Fast AI response handling
│
├── AI Integration
│ └── Google Gemini AI for code generation
│
└── Container System (Docker)
└── Isolated environment for running generated code
```

---

## ⚙️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Context API / State Management

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Infrastructure
- Docker
- Redis
- Containerized execution

### AI Integration
- Google Gemini AI API

---

## 📸 Application Flow

1. User registers or logs in
2. User creates a new project
3. User invites collaborators
4. All collaborators join the same workspace
5. Users interact with AI via prompt
6. AI generates project files
7. Files appear in the file explorer
8. Docker container runs the generated project
9. Collaborators continue improving the project with AI

---

## 📂 Project Structure

```
CodeForger/
│
├── client/ # React frontend
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── services/
│
├── server/ # Node.js backend
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── services/
│ └── middleware/
│
├── docker/ # Container configs
│
├── redis/ # Redis configs
│
├── docker-compose.yml
│
└── README.md
```

---

## 🐳 Docker Support

CodeForger uses Docker to:

- Run generated applications
- Provide isolated execution environments
- Ensure consistent runtime
- Enable safe execution of AI-generated code

---

## 🔄 Collaboration Workflow

```
User creates project
↓
User invites collaborators
↓
Collaborators join project
↓
Users prompt AI
↓
AI generates files
↓
Files saved to project
↓
Docker container runs project
↓
Team continues collaboration
```

---

## 🔑 Core Capabilities

- Multi-user collaborative development
- AI-driven full project generation
- Real-time AI-assisted coding
- Containerized execution
- Modern full-stack architecture

---

## 🎯 Use Cases

- Team-based AI-assisted development
- Rapid prototyping
- Learning full-stack development
- Collaborative hackathons
- AI-powered coding environments

---

## 🚀 Future Improvements

- Real-time cursor collaboration
- Live code editing
- Terminal access inside container
- GitHub integration
- Version control
- Deployment support

---

## 🧠 Inspiration

CodeForger is inspired by modern AI-powered development environments and collaborative tools like:

- GitHub Codespaces
- Replit
- Cursor AI
- VS Code Live Share

---

## 👨‍💻 Author

Utkarsh Mhatre

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Summary

CodeForger is a collaborative AI-powered development platform where users and their team can interact with AI to generate full applications, manage projects together, and run them inside isolated Docker containers — all from a single modern web interface.
