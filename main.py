import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from cerebras.cloud.sdk import Cerebras

# ============================================================
# 1. Environment setup
# ============================================================
load_dotenv()
API_KEY = os.getenv("CEREBRAS_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing CEREBRAS_API_KEY in environment or .env file")

# ============================================================
# 2. Initialize Cerebras client
# ============================================================
client = Cerebras(api_key=API_KEY)

# ============================================================
# 3. FastAPI app configuration
# ============================================================
app = FastAPI(title="AI Essay Assistant Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 4. Request models
# ============================================================
class SuggestReq(BaseModel):
    text: str
    instruction: str | None = None

class ReviewReq(BaseModel):
    text: str

class ChatReq(BaseModel):
    text: str
    document: str
    memory: list | None = None  # <--- NEW FIELD for chat memory

# ============================================================
# 5. Cerebras text generation helper
# ============================================================
async def generate(messages: list, max_tokens: int = 800) -> str:
    """
    Generate a response using Cerebras chat model.
    Accepts full conversation (messages list) instead of single prompt.
    """
    try:
        stream = client.chat.completions.create(
            model="qwen-3-235b-a22b-instruct-2507",
            messages=messages,
            stream=True,
            max_completion_tokens=max_tokens,
            temperature=0.7,
            top_p=0.8,
        )
        output = ""
        for chunk in stream:
            delta = chunk.choices[0].delta
            if delta and delta.content:
                output += delta.content
        return output.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# 6. Routes
# ============================================================
@app.get("/")
def home():
    return {"status": "ok"}

@app.post("/suggest")
async def suggest(r: SuggestReq):
    prompt = (
        f"You are an academic writing assistant.\n"
        f"Rewrite the following text to improve clarity, coherence, and academic tone.\n\n"
        f"Text:\n{r.text}\n\nInstruction: {r.instruction or 'None'}"
    )
    messages = [{"role": "system", "content": prompt}]
    suggestion = await generate(messages)
    return {"suggestion": suggestion}

@app.post("/review")
async def review(r: ReviewReq):
    prompt = f"""
You are an academic reviewer.
Return a JSON review in this exact format:
{{
  "comments": [{{"line": 8, "type": "grammar", "text": "..."}}],
  "score": 8.5
}}

Text to review:
{r.text}
"""
    messages = [{"role": "system", "content": prompt}]
    res = await generate(messages, max_tokens=1200)
    m = re.search(r"\{.*\}", res, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(0))
        except Exception:
            pass
    return {"comments": [{"line": 1, "type": "clarity", "text": "Parsing failed"}]}

@app.post("/chat")
async def chat(r: ChatReq):
    """
    Chat endpoint with memory context.
    Memory example:
    [
        {"role": "user", "content": "Hi"},
        {"role": "assistant", "content": "Hello there!"}
    ]
    """
    system_msg = {
        "role": "system",
        "content": "You are a helpful academic assistant."
    }

    document_msg = {
        "role": "system",
        "content": f"Essay:\n{r.document}"
    }

    # Combine context + memory + current message
    memory_msgs = r.memory or []
    user_msg = {"role": "user", "content": r.text}
    all_messages = [system_msg, document_msg] + memory_msgs + [user_msg]

    response = await generate(all_messages, max_tokens=1000)
    return {"response": response}
