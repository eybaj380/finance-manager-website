from fastapi.testclient import TestClient
from backend.app.main import app


client = TestClient(app)


def test_financial_report_salary():
    payload = {
        "salary_monthly": 3000.0,
        "expenses": [{"name": "Rent", "amount": 1000.0}, {"name": "Food", "amount": 300.0}],
    }
    resp = client.post('/financial-report', json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data['gross_monthly'] == 3000.0
    assert data['total_expenses'] == 1300.0
    assert data['net_monthly'] == 1700.0


def test_financial_report_hourly():
    payload = {
        "hourly_rate": 20.0,
        "hours_per_week": 40.0,
        "expenses": [{"name": "Bill", "amount": 200.0}],
    }
    resp = client.post('/financial-report', json=payload)
    assert resp.status_code == 200
    data = resp.json()
    # gross = 20 * 40 * 52 / 12 = 3466.666... -> rounded to 3466.67
    assert abs(data['gross_monthly'] - 3466.67) < 0.01
    assert data['total_expenses'] == 200.0
