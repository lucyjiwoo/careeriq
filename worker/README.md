# Worker

Async Python worker that consumes jobs from AWS SQS. Handles AI-heavy background tasks such as answer evaluation, question generation, and embedding storage. Deployed as a separate ECS Fargate service alongside the backend.

## Stack

| | |
|---|---|
| Language | Python 3.11 |
| Config | pydantic-settings |
| Queue | AWS SQS (consumer) |
| AI | OpenAI GPT & Embedding models |
| Database | PostgreSQL + pgvector (via RDS) |
| Storage | AWS S3 |
| Deployment | AWS ECS Fargate |

## How It Works

1. `poll()` fetches messages from SQS
2. Each message is dispatched to `handle_message()` by type
3. On failure, the message is retried up to 3 times then sent to the dead-letter queue
4. Graceful shutdown on `SIGTERM` / `SIGINT` (required for ECS draining)

## Local Development

```bash
cd worker
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env        # fill in credentials
python -m app.main
```

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
| `S3_BUCKET_NAME` | S3 bucket name |
| `SQS_QUEUE_URL` | SQS queue URL to consume from |
| `POLL_INTERVAL_SECONDS` | Polling interval in seconds (default: `5`) |

See [.env.example](./.env.example).

## Running Tests

```bash
pytest
```

## Adding a New Job Type

1. Add a new handler function in `app/handlers/`
2. Register the message type in `handle_message()` in `app/handlers/handler_log.py`
