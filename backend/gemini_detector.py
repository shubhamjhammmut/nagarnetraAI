import json
import re
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def extract_json(text):
    try:
        return json.loads(text)
    except:
        text = re.sub(r"```json|```", "", text).strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                pass
    return None


def analyze_image(image_bytes):
    try:
        prompt = """
        Analyze this image and return ONLY valid JSON.

        {
          "issue": "pothole | garbage | waterlogging | traffic | broken road | no issue",
          "severity": "low | medium | high",
          "confidence": 0.0 to 1.0,
          "description": "clear short sentence",
          "why_it_matters": "1-2 lines explaining impact on public"
        }
        """

        response = client.models.generate_content(
            model="models/gemini-3-flash-preview",
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": image_bytes
                            }
                        }
                    ]
                }
            ]
        )

        raw_text = response.text
        parsed = extract_json(raw_text)

        return parsed if parsed else {
            "issue": "unknown",
            "severity": "low",
            "confidence": 0.5,
            "description": raw_text[:200],
            "why_it_matters": ""
        }

    except Exception as e:
        return {
            "issue": "unknown",
            "severity": "low",
            "confidence": 0.0,
            "description": str(e),
            "why_it_matters": ""
        }
