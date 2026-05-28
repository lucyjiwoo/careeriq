# zzuck — AI-Powered SWE Mock Interview Platform

An AI-powered software engineering mock interview platform with adaptive question generation, answer evaluation, and personalized feedback.

## Architecture

| Layer | Stack |
|---|---|
| Frontend | React, TypeScript, Vite → Vercel |
| Backend | FastAPI, Python → AWS ECS Fargate |
| Worker | Python SQS consumer → AWS ECS Fargate |
| Database | PostgreSQL + pgvector (AWS RDS) |
| Storage | AWS S3 |
| Queue | AWS SQS |
| Infrastructure | AWS CDK (Python) |
| CI/CD | GitHub Actions |

## Repository Structure

```
zzuck/
├── frontend/        # React + TypeScript app
├── backend/         # FastAPI REST API
├── worker/          # Async SQS worker
├── infra/           # AWS CDK infrastructure
└── .github/
    └── workflows/   # CI pipelines
```

## Services

- **[frontend](./frontend/README.md)** — User-facing React app deployed to Vercel
- **[backend](./backend/README.md)** — REST API serving the frontend and publishing jobs to SQS
- **[worker](./worker/README.md)** — Background processor consuming SQS jobs (AI evaluation, question generation)
- **[infra](./infra/README.md)** — AWS CDK stack defining all cloud resources

## CI

| Workflow | Trigger | Jobs |
|---|---|---|
| `frontend-ci` | `frontend/**` | lint, build |
| `backend-ci` | `backend/**`, `worker/**` | pytest (backend + worker) |
| `infra-ci` | `infra/**` | cdk synth |

## Getting Started

Each service has its own setup guide. Start here:

1. Clone the repo
2. Copy `.env.example` → `.env` in each service directory and fill in credentials
3. See the README in each subdirectory for local dev instructions
