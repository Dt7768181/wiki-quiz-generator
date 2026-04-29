from sqlalchemy import Column, Integer, String, JSON
from database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True)
    url = Column(String)
    title = Column(String)
    quiz = Column(JSON)