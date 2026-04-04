from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from gemini_detector import analyze_image

app = FastAPI()

# ✅ CORS (keep as is)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root endpoint
@app.get("/")
def root():
    return {"message": "Nagarnetra Gemini Backend Running"}

# ✅ FIXED DETECT ENDPOINT (NO FILE SAVE)
@app.post("/detect")
async def detect_issue(file: UploadFile = File(...)):
    try:
        # 🔥 READ IMAGE IN MEMORY (IMPORTANT FIX)
        image_bytes = await file.read()

        print("Received file:", file.filename)
        print("Content type:", file.content_type)
        print("Size:", len(image_bytes))

        # 🔥 SEND BYTES TO GEMINI
        result = analyze_image(image_bytes)

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        print("ERROR:", e)
        return {
            "status": "error",
            "data": str(e)
        }
