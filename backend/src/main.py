import torch
from fastapi import FastAPI, HTTPException, status
from .config import settings
from .schemas import AssistantComplete
from .assistant import Assistant


app = FastAPI()
assistant = Assistant()
assistant.load('./src/model.pkl')


@app.get('/')
def home() -> dict:
    return {
        'message': 'Привет мир!',
        'torch version': torch.__version__,
        'cuda status': torch.cuda.is_available()}


@app.post('/complete/')
def complete(form: AssistantComplete) -> str:
    if form.api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='api_key is wrong')

    return assistant.complete_code(
        text=form.text, cursor_position=form.position)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
