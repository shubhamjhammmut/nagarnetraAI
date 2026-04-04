
# Nagarnetra Gemini Backend

## Setup

1. Install dependencies:
   pip install -r requirements.txt

2. Add your Gemini API key:
   cp .env.example .env

3. Run server:
   uvicorn main:app --reload

## API
POST /detect
Upload an image to detect civic issues.
