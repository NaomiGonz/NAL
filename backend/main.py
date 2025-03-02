from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid

from model.adaptive_model import AdaptiveQuestioningModel

app = FastAPI(title="RareDisease Adaptive Quiz API")

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSIONS: Dict[str, Any] = {}

adaptive_model = AdaptiveQuestioningModel()

# --------------------------------------------
# Pydantic Schemas
# --------------------------------------------
class StartQuizRequest(BaseModel):
    sex: str
    age: int
    initial_symptoms: List[str]
    previous_diagnosis: Optional[str] = ""

# We add definition_text as an optional field
class StartQuizResponse(BaseModel):
    session_id: str
    question_id: str
    question_text: str
    definition_text: Optional[str] = None

class AnswerQuestionRequest(BaseModel):
    session_id: str
    question_id: str
    answer: str  # "yes", "no", or "unknown"

# Also add definition_text here
class AnswerQuestionResponse(BaseModel):
    next_question_id: Optional[str] = None
    next_question_text: Optional[str] = None
    definition_text: Optional[str] = None
    done: bool = False
    top_diseases: Optional[List[str]] = None

# --------------------------------------------
# Endpoints
# --------------------------------------------
@app.post("/start_quiz", response_model=StartQuizResponse)
def start_quiz(payload: StartQuizRequest):
    session_id = str(uuid.uuid4())
    user_state = adaptive_model.initialize_state(
        sex=payload.sex,
        age=payload.age,
        initial_symptoms=payload.initial_symptoms,
        previous_diagnosis=payload.previous_diagnosis
    )
    SESSIONS[session_id] = user_state

    question_id, question_text, definition_text = adaptive_model.get_next_question(user_state)
    if question_id is None:
        raise HTTPException(status_code=500, detail="No question available.")

    return StartQuizResponse(
        session_id=session_id,
        question_id=question_id,
        question_text=question_text,
        definition_text=definition_text
    )

@app.post("/answer_question", response_model=AnswerQuestionResponse)
def answer_question(payload: AnswerQuestionRequest):
    user_state = SESSIONS.get(payload.session_id)
    if not user_state:
        raise HTTPException(status_code=404, detail="Invalid session ID.")

    done, top_diseases = adaptive_model.process_answer(user_state, payload.question_id, payload.answer)

    if done:
        return AnswerQuestionResponse(
            done=True,
            top_diseases=top_diseases
        )
    else:
        next_q_id, next_q_text, definition_text = adaptive_model.get_next_question(user_state)
        if next_q_id is None:
            return AnswerQuestionResponse(
                done=True,
                top_diseases=adaptive_model.get_current_top_diseases(user_state)
            )
        return AnswerQuestionResponse(
            next_question_id=next_q_id,
            next_question_text=next_q_text,
            definition_text=definition_text,
            done=False
        )

@app.get("/results")
def get_results(session_id: str):
    user_state = SESSIONS.get(session_id)
    if not user_state:
        raise HTTPException(status_code=404, detail="Session not found.")
    results = adaptive_model.get_current_top_diseases(user_state)
    return {"session_id": session_id, "top_diseases": results}
