# code-assistant README

## start server

create venv:
1. `python -m venv venv`
2. `venv\Scripts\activate.bat`

install requirements:
1. `python -m pip install --upgrade pip`
2. `python -m pip install -r requirements.txt`

run server
1. `uvicorn src.main:app --reload --host localhost --port 3000`