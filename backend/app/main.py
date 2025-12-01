from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    BudgetRequest,
    BudgetResponse,
    CategoryResponse,
    FinancialRequest,
    FinancialReport,
    ExpenseReport,
)
from typing import List
from fastapi import Body

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


def compute_gross_monthly(req: FinancialRequest) -> float:
    # prefer explicit monthly salary
    if req.salary_monthly and req.salary_monthly > 0:
        gross = float(req.salary_monthly)
    elif req.hourly_rate and req.hourly_rate > 0:
        # If hours_per_week not provided (or zero), assume standard 40 hours/week.
        hours = req.hours_per_week if (req.hours_per_week and req.hours_per_week > 0) else 40.0
        # convert weekly hours to monthly (approx): hours_per_week * 52 / 12
        gross = float(req.hourly_rate) * float(hours) * 52.0 / 12.0
    else:
        gross = 0.0

    gross += float(req.other_income_monthly or 0.0)
    return round(gross, 2)


def calculate_financial_report(req: FinancialRequest) -> FinancialReport:
    gross = compute_gross_monthly(req)
    total_expenses = sum(e.amount for e in req.expenses)
    net = gross - total_expenses
    savings_rate = (net / gross * 100.0) if gross and gross > 0 else 0.0

    expenses_report: List[ExpenseReport] = [
        ExpenseReport(name=e.name, amount=round(float(e.amount), 2)) for e in req.expenses
    ]

    return FinancialReport(
        gross_monthly=round(float(gross), 2),
        total_expenses=round(float(total_expenses), 2),
        net_monthly=round(float(net), 2),
        savings_rate_pct=round(float(savings_rate), 2),
        expenses=expenses_report,
    )


@app.post('/financial-report', response_model=FinancialReport)
async def financial_report_endpoint(body: FinancialRequest = Body(...)):
    try:
        # Accept either a monthly salary or an hourly_rate. If hours_per_week is omitted,
        # we'll assume a standard 40 hours/week when computing gross monthly income.
        if not ((body.salary_monthly and body.salary_monthly > 0) or (body.hourly_rate and body.hourly_rate > 0)):
            raise HTTPException(status_code=400, detail='Provide salary_monthly or hourly_rate')

        report = calculate_financial_report(body)
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
