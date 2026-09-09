# 🔎 DSA Search

A Scalable **DSA problem search engine** that helps users search and explore competitive programming problems from multiple platforms.

## ✨ Features

- 🔍 Fast DSA problem search
- 🏷️ Problem details, platforms, difficulty & tags
- 👤 User registration and authentication
- 🔐 JWT access & refresh token authentication
- 📧 Email OTP verification & password reset
- ✅ Mark problems as solved
- 📊 Track solved-problem statistics
- 🏆 Contest information
- 🛡️ API rate limiting and CORS protection

## 🏗️ Architecture

```text
Next.js Client
      │
      ▼
 API Gateway
   │       │
   ▼       ▼
 Auth    Search
Service  Service
```

The frontend communicates only with the **API Gateway**, while backend services remain independently deployable.

## 🛠️ Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Query

**Backend**
- Node.js
- Express.js
- TypeScript
- Prisma
- JWT
- Redis
- Nodemailer
- Natural

**DevOps / Cloud**
- Docker
- Docker Compose
- Google Cloud Run
- Google Artifact Registry
- GitHub Actions
- Workload Identity Federation

## 📁 Project Structure

```text
search-engine/
├── client/
├── api-gateway/
├── auth-service/
├── search-service/
├── data/
├── .github/
│   └── workflows/
│       ├── client.yml
│       ├── gateway.yml
│       ├── auth.yml
│       └── search.yml
├── docker-compose.yml
└── README.md
```

## 🚀 Run Locally

### Prerequisites

- Node.js 20+
- Docker
- Docker Compose

### Environment Variables

Create the required `.env` files for:

```text
api-gateway/.env
auth-service/.env
search-service/.env
```

For the client:

```env
NEXT_PUBLIC_API_GATEWAY=http://localhost:5000
```

### Start the Application

From the project root:

```bash
docker compose up -d --build
```

The services run on:

```text
Client         → http://localhost:3000
API Gateway    → http://localhost:5000
Auth Service   → http://localhost:6001
Search Service → http://localhost:4000
```

## ☁️ Deployment

The application is deployed as independent services on **Google Cloud Run**.

Docker images are stored in **Google Artifact Registry**.

Deployment is automated using **GitHub Actions**:

```text
git push
   ↓
GitHub Actions
   ↓
Docker Build
   ↓
Artifact Registry
   ↓
Cloud Run
```

Each service has its own CI/CD workflow and is deployed only when relevant files change.

GitHub authenticates with Google Cloud using **Workload Identity Federation**, avoiding long-lived service-account keys.

## 🔐 Security

- HTTP-only cookies for JWT tokens
- Secure cookies in production
- Short-lived access tokens
- Refresh-token mechanism
- CORS protection
- API rate limiting
- Environment-based secrets
- Workload Identity Federation for CI/CD

## 🔮 Future Improvements

- Advanced search filters
- Better search ranking
- More competitive programming platforms
- Personalized recommendations
- Search history and bookmarks
- Automated integration testing
- Monitoring and centralized logging

## 👨‍💻 Author

**Soumalya Karak**

⭐ If you find this project useful, consider starring the repository!