from fastapi import FastAPI
from .config import settings


app = FastAPI()


@app.get('/')
def home():
    return {'message': 'Привет мир!'}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
