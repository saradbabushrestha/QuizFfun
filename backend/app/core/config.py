from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "QuizForge API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "quizforge"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "quizforge_db"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        case_sensitive = True

settings = Settings()
