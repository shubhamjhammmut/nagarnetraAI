import json
import re
from PIL import Image
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def extract_json(text):
    """Extract clean JSON from Gemini response"""
    try:
        return json.loads(text)
    except:
        # remove markdown ```json ```
        text = re.sub(r"```json|```", "", text).strip()

        # extract JSON block
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                pass

    return None


def analyze_image(image_path):
    try:
        image = Image.open(image_path).convert("RGB")

        prompt = """
        Analyze this image and return ONLY valid JSON.

        {
          "issue": "pothole | garbage | waterlogging | traffic | broken road | no issue",
          "severity": "low | medium | high",
          "confidence": 0.0 to 1.0,
          "description": "clear short sentence"
          "why_it_matters": "1-2 lines explaining impact on public"

        }

        IMPORTANT:
        - Return ONLY JSON
        - No markdown
        - No explanation
        """

        response = client.models.generate_content(
            model="models/gemini-3-flash-preview",
            contents=[prompt, image]
        )

        raw_text = response.text

        parsed = extract_json(raw_text)

        if parsed:
            return parsed

        # fallback if parsing fails
        return {
            "issue": "unknown",
            "severity": "low",
            "confidence": 0.5,
            "description": raw_text[:200]
        }

    except Exception as e:
        return {
            "issue": "unknown",
            "severity": "low",
            "confidence": 0.0,
            "description": str(e)
        }
