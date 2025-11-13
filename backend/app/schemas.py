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
