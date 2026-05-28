# zzuck — AI-Powered SWE Mock Interview Platform

An AI-powered software engineering mock interview platform that provides adaptive question generation, answer evaluation, and personalized feedback.

## Architecture Overview

| Layer | Stack |
|---|---|
| Frontend | React, TypeScript, Vercel |
| Backend | FastAPI, Python, Docker |
| AI | OpenAI GPT & Embedding models |
| Database | PostgreSQL + pgvector |
| Storage | AWS S3 |
| Async Processing | AWS SQS + Python Workers |
| Infrastructure | AWS ECS Fargate, AWS CDK |
| CI/CD | GitHub Actions |

## Repository Structure

```
zzuck/
├── frontend/        # React + TypeScript app (deployed to Vercel)
├── backend/         # FastAPI server (deployed to AWS ECS Fargate)
├── worker/          # Async Python workers (SQS consumers)
├── infra/           # AWS CDK infrastructure definitions
└── .github/
    └── workflows/   # GitHub Actions CI/CD pipelines
```

## Features

- AI-driven interview question generation
- Adaptive follow-up questions based on answer quality
- Answer evaluation and feedback via GPT models
- Weakness memory system using pgvector semantic search
- Resume and job description ingestion via S3
- Session history and performance dashboards

## Getting Started

1. Copy `.env.example` to `.env` and fill in your credentials
2. See each subdirectory for service-specific setup instructions

## Deployment

- **Frontend**: Auto-deployed to Vercel on push to `main`
- **Backend**: Containerized and deployed to AWS ECS Fargate via GitHub Actions
- **Worker**: Deployed alongside backend as a separate ECS service
- **Infra**: Managed via AWS CDK (`infra/`)
