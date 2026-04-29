# Wiki Quiz Generator
## Overview

The **Wiki Quiz Generator** is a full-stack web application that generates multiple-choice quizzes from Wikipedia articles using an AI model.

Users can:

* Enter a Wikipedia URL
* Generate quiz questions automatically
* Attempt the quiz interactively
* View past quizzes
* Delete saved quizzes

---

## Tech Stack

### Frontend

* React (JavaScript)
* CSS (custom styling)

### Backend

* FastAPI (Python)

### Database

* PostgreSQL

### AI / LLM

* Groq API (LLaMA-based model)

---

## Features

### Quiz Generation

* Enter any Wikipedia URL
* Automatically generates 5 MCQs
* Includes:

  * Question
  * Options
  * Correct answer
  * Difficulty
  * Explanation

---

### Take Quiz Mode

* Select answers
* Submit quiz
* Get score instantly
* Highlights:

  * Correct answers (green)
  * Wrong answers (red)

---

### History

* Stores previously generated quizzes
* View quiz details in modal
* Delete quiz entries

---

## Project Structure

```
wiki-quiz/
│
├── backend/
│   ├── main.py
│   ├── scraper.py
│   ├── llm.py
│   ├── models.py
│   └── database.py
│
├── wiki-quiz-frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│
├── sample_data/
│
└── README.md
```

---

## Setup Instructions

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 🔹 Frontend

```bash
cd wiki-quiz-frontend
npm install
npm start
```

---

## 🔗 API Endpoints

| Endpoint       | Method | Description                  |
| -------------- | ------ | ---------------------------- |
| `/quiz?url=`   | GET    | Generate quiz from Wikipedia |
| `/history`     | GET    | Fetch saved quizzes          |
| `/delete/{id}` | DELETE | Delete a quiz                |

---

## Screenshots

Add screenshots here:

* Generate Quiz Page
* History Page
* Quiz Modal

---

## Sample Data

Located in `sample_data/`:

* Example Wikipedia URLs
* Generated quiz outputs

---

## Prompt Used

```
Generate 5 quiz questions from the text below.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown

Format:
{
  "quiz": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "...",
      "difficulty": "...",
      "explanation": "..."
    }
  ]
}
```

---

## Future Improvements

* Search/filter in history
* User authentication
* Better UI animations
* Deployment (Render / Vercel)

---

## Author

Dheeraj Thummalapenta

---

## Notes

This project was developed as part of an assignment and demonstrates:

* Full-stack development
* API integration
* Database operations
* AI-based content generation
