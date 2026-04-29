from groq import Groq
import os
from dotenv import load_dotenv
import json
import re

# ✅ load env FIRST
load_dotenv()

# ✅ define client BEFORE using it
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def clean_json(text):
    text = re.sub(r"```json|```", "", text)
    return text.strip()


def generate_quiz(content):
    content = content[:1500]  # optional safety

    prompt = f"""
    Generate 5 quiz questions from the text below.

    STRICT RULES:
    - Return ONLY valid JSON
    - No explanation
    - No markdown

    Format:
    {{
      "quiz": [
        {{
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "answer": "...",
          "difficulty": "easy/medium/hard",
          "explanation": "..."
        }}
      ]
    }}

    Text:
    {content}
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.choices[0].message.content

    try:
        cleaned = clean_json(raw)
        return json.loads(cleaned)
    except Exception:
        return {
            "error": "Invalid JSON from LLM",
            "raw_output": raw
        }