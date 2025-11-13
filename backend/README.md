# Budget Calculator Backend (FastAPI)

This folder contains a minimal FastAPI backend that accepts a budget payload and returns calculated totals and per-category breakdowns.

Quick start (local):

1. Create a virtual environment and install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Run the server:

```powershell
uvicorn app.main:app --reload --port 8000
```

3. Open http://localhost:8000/docs for the interactive API docs.

API endpoints:
- GET / - simple greeting
- POST /calculate - accepts JSON payload { income, categories } and returns calculated totals

Example request:

```json
{
  "income": 3000.0,
  "categories": [
    { "name": "Groceries", "planned": 400.0, "spent": 120.0 },
    { "name": "Rent", "planned": 1200.0, "spent": 1200.0 }
  ]
}
```

Example response is shown in the docs after running the server.
