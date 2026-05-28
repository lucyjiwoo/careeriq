from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str = ""

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "zzuck"
    postgres_user: str = ""
    postgres_password: str = ""

    aws_region: str = "us-east-1"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""

    s3_bucket_name: str = ""
    sqs_queue_url: str = ""

    poll_interval_seconds: int = 5


settings = Settings()
