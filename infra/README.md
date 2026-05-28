# Infra

AWS CDK (Python) stack that defines all cloud infrastructure for zzuck.

## Stack

| | |
|---|---|
| IaC Tool | AWS CDK v2 |
| Language | Python 3.11 |
| Deployment | `cdk deploy` via GitHub Actions |

## Resources Provisioned

| Resource | Details |
|---|---|
| **VPC** | 2 AZs, 1 NAT gateway |
| **ECR** | `zzuck-backend`, `zzuck-worker` repositories |
| **ECS Cluster** | Fargate cluster (`zzuck`) |
| **ECS Task Defs** | Backend (port 8000) + Worker (no port) |
| **RDS** | PostgreSQL 16, private subnet, auto-rotated secret |
| **SQS** | `zzuck-jobs` queue + DLQ (3 retries, 14-day retention) |
| **S3** | `zzuck-assets-{account}`, private, S3-managed encryption |

## Local Setup

```bash
cd infra
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
npm install -g aws-cdk

cp .env.example .env        # fill in AWS credentials
```

## Environment Variables

| Variable | Description |
|---|---|
| `AWS_REGION` | Target AWS region (default: `us-east-1`) |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |

See [.env.example](./.env.example).

## Common Commands

| Command | Description |
|---|---|
| `cdk synth` | Synthesize CloudFormation template |
| `cdk diff` | Show changes vs deployed stack |
| `cdk deploy` | Deploy stack to AWS |
| `cdk destroy` | Tear down all resources |

## Stack Outputs

After deploy, CDK outputs:

| Output | Description |
|---|---|
| `BackendRepoUri` | ECR URI for backend image |
| `WorkerRepoUri` | ECR URI for worker image |
| `JobQueueUrl` | SQS queue URL (used by backend + worker) |
| `AssetsBucketName` | S3 bucket name |
| `DatabaseEndpoint` | RDS endpoint hostname |
