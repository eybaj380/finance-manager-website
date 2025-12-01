from typing import List
from pydantic import BaseModel, Field


class Category(BaseModel):
    name: str = Field(..., example="Groceries")
    planned: float = Field(0.0, ge=0.0, example=400.0)
    spent: float = Field(0.0, ge=0.0, example=120.0)


class BudgetRequest(BaseModel):
    income: float = Field(0.0, ge=0.0, example=3000.0)
    categories: List[Category] = Field(default_factory=list)


class CategoryResponse(BaseModel):
    name: str
    planned: float
    spent: float
    remaining: float
    pct_spent: float


class BudgetResponse(BaseModel):
    income: float
    total_planned: float
    total_spent: float
    remaining: float
    categories: List[CategoryResponse]


# Financial report models
class Expense(BaseModel):
    name: str = Field(..., example="Rent")
    amount: float = Field(..., ge=0.0, example=1200.0)


class FinancialRequest(BaseModel):
    # monthly salary (preferred). If not provided, hourly_rate and hours_per_week will be used.
    salary_monthly: float = Field(0.0, ge=0.0, example=3000.0)
    hourly_rate: float = Field(0.0, ge=0.0, example=25.0)
    hours_per_week: float = Field(0.0, ge=0.0, example=40.0)
    other_income_monthly: float = Field(0.0, ge=0.0, example=100.0)
    expenses: List[Expense] = Field(default_factory=list)


class ExpenseReport(BaseModel):
    name: str
    amount: float


class FinancialReport(BaseModel):
    gross_monthly: float
    total_expenses: float
    net_monthly: float
    savings_rate_pct: float
    expenses: List[ExpenseReport]
