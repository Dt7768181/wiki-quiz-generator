import { useState } from "react";
import "./App.css";

function App() {
  const [tab, setTab] = useState("generate");

  return (
    <div className="container">
      <div className="header">
        <h1>Wiki Quiz Generator</h1>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${tab === "generate" ? "active" : ""}`}
          onClick={() => setTab("generate")}
        >
          Generate
        </button>

        <button
          className={`tab-btn ${tab === "history" ? "active" : ""}`}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>

      {tab === "generate" ? <GenerateQuiz /> : <History />}
    </div>
  );
}

function GenerateQuiz() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    if (!url) return alert("Enter URL");

    setLoading(true);

    const res = await fetch(`http://127.0.0.1:8000/quiz?url=${url}`);
    const result = await res.json();

    setData(result);
    setAnswers({});
    setSubmitted(false);
    setLoading(false);
  };

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const calculateScore = () => {
    let score = 0;
    data.quiz.forEach((q, index) => {
      if (answers[index] === q.answer) score++;
    });
    return score;
  };

  return (
    <div>
      <div className="input-group">
        <input
          placeholder="Enter Wikipedia URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="primary-btn" onClick={generateQuiz}>
          Generate
        </button>
      </div>

      {loading && <p>Generating quiz...</p>}

      {data && (
        <div>
          <h2>{data.title}</h2>

          {data.quiz.map((q, index) => (
            <div key={index} className="card">
              <p><b>{q.question}</b></p>

              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className="option"
                  style={{
                    backgroundColor: submitted
                      ? opt === q.answer
                        ? "#bbf7d0"
                        : answers[index] === opt
                        ? "#fecaca"
                        : ""
                      : "",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    onChange={() => handleSelect(index, opt)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}

              {submitted && <p><b>Answer:</b> {q.answer}</p>}
              <p><b>Difficulty:</b> {q.difficulty}</p>
              {submitted && <p>{q.explanation}</p>}
            </div>
          ))}

          <button className="primary-btn" onClick={() => setSubmitted(true)}>
            Submit Quiz
          </button>

          {submitted && (
            <h3>
              Score: {calculateScore()} / {data.quiz.length}
            </h3>
          )}
        </div>
      )}
    </div>
  );
}

function History() {
  const [data, setData] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchHistory = async () => {
    const res = await fetch("http://127.0.0.1:8000/history");
    const result = await res.json();
    setData(result);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(`http://127.0.0.1:8000/delete/${id}`, {
      method: "DELETE",
    });

    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div>
      <button className="primary-btn" onClick={fetchHistory}>
        Load History
      </button>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.url}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedQuiz(item)}
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuiz && (
        <div className="modal">
          <h2>{selectedQuiz.title}</h2>

          {selectedQuiz.quiz.quiz.map((q, index) => (
            <div key={index}>
              <p><b>{q.question}</b></p>
              {q.options.map((opt, i) => (
                <p key={i}>{opt}</p>
              ))}
              <p><b>Answer:</b> {q.answer}</p>
            </div>
          ))}

          <button onClick={() => setSelectedQuiz(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;