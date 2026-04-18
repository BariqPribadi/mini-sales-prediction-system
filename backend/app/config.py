from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DUMMY_USERNAME: str
    DUMMY_PASSWORD: str

    class Config:
        env_file = ".env"

settings = Settings()