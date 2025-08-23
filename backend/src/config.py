from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env')

    HOST: str
    PORT: str
    API_KEY: str


settings = Settings()
