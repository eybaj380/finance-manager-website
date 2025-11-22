from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)


def test_calculate_basic():
    payload = {
        "income": 3000.0,
        "categories": [
            {"name": "Groceries", "planned": 400.0, "spent": 120.0},
            {"name": "Rent", "planned": 1200.0, "spent": 1200.0},
        ],
    }

    r = client.post('/calculate', json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data['income'] == 3000.0
    assert data['total_planned'] == 1600.0
    assert data['total_spent'] == 1320.0
    assert any(c['name'] == 'Groceries' for c in data['categories'])
