# Backend

FastAPI REST API server. Handles interview session management, question delivery, and publishes evaluation jobs to SQS. Deployed to AWS ECS Fargate.

## Stack

| | |
|---|---|
| Framework | FastAPI |
| Language | Python 3.11 |
| Validation | Pydantic v2 |
| Database | PostgreSQL + pgvector (via RDS) |
| Storage | AWS S3 |
| Queue | AWS SQS (producer) |
| Deployment | AWS ECS Fargate |

## Local Development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env        # fill in credentials
uvicorn app.main:app --reload --port 8000
```

API is available at `http://localhost:8000`.

## Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `POSTGRES_HOST` | Database host |
| `POSTGRES_PORT` | Database port (default: `5432`) |
| `POSTGRES_DB` | Database name (default: `zzuck`) |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `AWS_REGION` | AWS region (default: `us-east-1`) |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `S3_BUCKET_NAME` | S3 bucket for resume/JD storage |
| `SQS_QUEUE_URL` | SQS queue URL for job publishing |
| `BACKEND_SECRET_KEY` | Secret key for signing tokens |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins (default: `http://localhost:3000`) |

See [.env.example](./.env.example).

## Running Tests

```bash
pytest
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |

More endpoints will be added as features are implemented.
