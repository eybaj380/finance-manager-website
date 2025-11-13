from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import BudgetRequest, BudgetResponse, CategoryResponse
from typing import List

app = FastAPI(title="Budget Calculator API", version="0.1.0")

# Allow CORS for local development; change origins in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def calculate_budget(payload: BudgetRequest) -> BudgetResponse:
    total_planned = sum(c.planned for c in payload.categories)
    total_spent = sum(c.spent for c in payload.categories)
    remaining = payload.income - total_spent

    categories_resp: List[CategoryResponse] = []
    for c in payload.categories:
        remaining_c = c.planned - c.spent
        pct_spent = (c.spent / c.planned * 100.0) if c.planned and c.planned > 0 else 0.0
        categories_resp.append(
            CategoryResponse(
                name=c.name,
                planned=round(float(c.planned), 2),
                spent=round(float(c.spent), 2),
                remaining=round(float(remaining_c), 2),
                pct_spent=round(float(pct_spent), 2),
            )
        )

    return BudgetResponse(
        income=round(float(payload.income), 2),
        total_planned=round(float(total_planned), 2),
        total_spent=round(float(total_spent), 2),
        remaining=round(float(remaining), 2),
        categories=categories_resp,
    )


@app.post('/calculate', response_model=BudgetResponse)
async def calculate_endpoint(body: BudgetRequest):
    try:
        result = calculate_budget(body)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/')
async def root():
    return {"message": "Budget Calculator API - POST /calculate"}
