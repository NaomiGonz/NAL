# Backend: RareDisease Adaptive Quiz

This folder contains a FastAPI backend that loads data from HPO and related files to provide an adaptive question/answer quiz for differential diagnosis.

## Prerequisite

- Python 3.x
- pip


## Setup

1. **Navigate to the backend folder:**
```bash
   cd backend
```
2. **Install dependencies**:
```bash
    pip install -r requirements.txt
```
3. **Ensure data files are in the `backend/data/` folder**:
* `phenotype.hpoa`
* `phenotype_to_genes.txt`
* `genes_to_disease.txt`
* `hp.json`
4. **Run the backend server**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API be avaliable at `http://localhost:8000`

## Endpoints
* `POST /start_quiz` – Start a new quiz session.
* `POST /answer_question` – Submit an answer.
* `GET /results` – Retrieve quiz results.

CORS is configured to allow requests from http://localhost:5173