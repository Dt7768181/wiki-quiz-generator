from fastapi.middleware.cors import CORSMiddleware


from fastapi import FastAPI
from scraper import scrape_wikipedia
from llm import generate_quiz
from database import engine, Base
from database import SessionLocal
from models import Quiz
from fastapi import Query
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
def save_to_db(url, title, quiz_data):
    db = SessionLocal()

    new_quiz = Quiz(
        url=url,
        title=title,
        quiz=quiz_data
    )

    db.add(new_quiz)
    db.commit()
    db.close()

@app.get("/test")
def test():
    url = "https://en.wikipedia.org/wiki/Alan_Turing"
    return scrape_wikipedia(url)

@app.get("/quiz")
def quiz(url: str = Query(...)):
    data = scrape_wikipedia(url)

    if "error" in data:
        return data

    quiz_data = generate_quiz(data["content"])

    save_to_db(url, data["title"], quiz_data)

    return {
        "url": url,
        "title": data["title"],
        "quiz": quiz_data.get("quiz", [])
    }
@app.get("/history")
def history():
    db = SessionLocal()

    quizzes = db.query(Quiz).all()

    result = []
    for q in quizzes:
        result.append({
            "id": q.id,
            "url": q.url,
            "title": q.title,
            "quiz": q.quiz
        })

    db.close()
    return result

@app.delete("/delete/{quiz_id}")
def delete_quiz(quiz_id: int):
    db = SessionLocal()

    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        db.close()
        return {"error": "Quiz not found"}

    db.delete(quiz)
    db.commit()
    db.close()

    return {"message": "Deleted successfully"}