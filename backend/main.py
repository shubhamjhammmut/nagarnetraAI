
from fastapi import FastAPI, UploadFile, File
import shutil
import os
from gemini_detector import analyze_image

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Nagarnetra Gemini Backend Running"}

@app.post("/detect")
async def detect_issue(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_image(file_path)

    os.remove(file_path)

    return {
        "status": "success",
        "data": result
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
