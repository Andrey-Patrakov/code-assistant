from pydantic import BaseModel, Field


class AssistantComplete(BaseModel):
    text: str = Field(..., description='Код файла', max_length=5000)
    position: int = Field(..., description='Позиция курсора')
    api_key: str = Field(..., description='Апи ключ')
