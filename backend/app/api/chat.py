from fastapi import APIRouter
from openai import OpenAI

router = APIRouter()

@router.get("/openai")
def ask_openai(question: str):
    client = OpenAI()

    response = client.responses.create(
        model="gpt-4.1-nano",
        input=question
    )

    return {"message": response.output_text}