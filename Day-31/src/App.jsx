import React, { useState, useEffect, useRef } from "react";

/**
 * QUIZ APP: Basic Full Stack Development Edition
 * Theme: Midnight Blue Glassmorphism
 */
const QuizApp = () => {
  // --- STATE ---
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  // --- CURATED BASIC FSD QUESTIONS ---
  useEffect(() => {
    // Manually defined to ensure they are "Basic" and "FSD" specific
    const basicFSDQuestions = [
      {
        question: "What does HTML stand for?",
        correct: "HyperText Markup Language",
        options: [
          "HyperText Markup Language",
          "HighText Machine Language",
          "Hyperlink and Text Markup Language",
          "Home Tool Markup Language",
        ],
      },
      {
        question: "Which language is primarily used for styling web pages?",
        correct: "CSS",
        options: ["HTML", "Python", "CSS", "SQL"],
      },
      {
        question: "In the MERN stack, what does the 'R' stand for?",
        correct: "React",
        options: ["Ruby", "React", "Redis", "REST"],
      },
      {
        question:
          "Which HTTP method is typically used to update existing data?",
        correct: "PUT",
        options: ["GET", "POST", "DELETE", "PUT"],
      },
      {
        question: "What is the purpose of a 'JOIN' clause in SQL?",
        correct: "To combine rows from two or more tables",
        options: [
          "To delete a table",
          "To combine rows from two or more tables",
          "To create a new database",
          "To sort data",
        ],
      },
    ];

    // Simulate API loading for smooth transition
    setTimeout(() => {
      setQuestions(basicFSDQuestions.sort(() => Math.random() - 0.5));
      setLoading(false);
    }, 800);
  }, []);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!loading && !isFinished && !selectedAnswer) {
      setTimeLeft(15);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer("TIMEOUT");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, loading, isFinished, selectedAnswer]);

  const handleAnswer = (answer) => {
    clearInterval(timerRef.current);
    setSelectedAnswer(answer);

    setUserHistory([
      ...userHistory,
      {
        question: questions[currentIndex].question,
        userChoice: answer,
        correctAnswer: questions[currentIndex].correct,
      },
    ]);

    if (answer === questions[currentIndex].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (loading)
    return <div style={styles.loader}>Initializing FSD Environment...</div>;

  if (isFinished) {
    return (
      <div style={styles.container}>
        <div style={styles.glassCard}>
          <h2 style={{ color: "#fff" }}>Final Report</h2>
          <div style={styles.scoreCircle}>
            {score} / {questions.length}
          </div>
          <div style={styles.reviewSection}>
            <h3 style={{ color: "#94a3b8" }}>Review Answers</h3>
            {userHistory.map((item, index) => (
              <div key={index} style={styles.reviewItem}>
                <p>
                  <strong>Q{index + 1}:</strong> {item.question}
                </p>
                <p
                  style={{
                    color:
                      item.userChoice === item.correctAnswer
                        ? "#4ade80"
                        : "#fb7185",
                  }}
                >
                  Your Answer:{" "}
                  {item.userChoice === "TIMEOUT" ? "Time Out" : item.userChoice}
                </p>
                {item.userChoice !== item.correctAnswer && (
                  <p style={{ color: "#4ade80" }}>
                    Correct: {item.correctAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={styles.nextBtn}
          >
            Restart Assessment
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={styles.mainTitle}>Quiz on Full Stack Development</h1>
        <div style={styles.headerRow}>
          <span style={styles.badge}>
            Progress: {currentIndex + 1}/{questions.length}
          </span>
          <span
            style={{
              ...styles.timer,
              color: timeLeft < 5 ? "#fb7185" : "#60a5fa",
            }}
          >
            ⏱ {timeLeft}s
          </span>
        </div>

        <h3 style={styles.questionText}>{currentQ.question}</h3>

        <div style={styles.optionsGrid}>
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              disabled={!!selectedAnswer}
              onClick={() => handleAnswer(opt)}
              style={{
                ...styles.optionBtn,
                background: !selectedAnswer
                  ? "rgba(255, 255, 255, 0.05)"
                  : opt === currentQ.correct
                    ? "rgba(74, 222, 128, 0.2)"
                    : opt === selectedAnswer
                      ? "rgba(251, 113, 133, 0.2)"
                      : "rgba(255, 255, 255, 0.05)",
                borderColor: !selectedAnswer
                  ? "rgba(255,255,255,0.1)"
                  : opt === currentQ.correct
                    ? "#4ade80"
                    : "transparent",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {selectedAnswer && (
          <button onClick={handleNext} style={styles.nextBtn}>
            {currentIndex + 1 === questions.length
              ? "Finish Assessment"
              : "Next Module"}
          </button>
        )}
      </div>
    </div>
  );
};

// --- STYLES: PROFESSIONAL MIDNIGHT BLUE GLASSMORPHISM ---
const styles = {
  container: {
    backgroundColor: "#020617",
    backgroundImage: `radial-gradient(circle at top right, #1e293b, #020617)`,
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    color: "#f8fafc",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "50px",
    width: "100%",
    maxWidth: "800px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  mainTitle: {
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "3px",
    color: "#64748b",
    marginBottom: "40px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  badge: {
    background: "rgba(59, 130, 246, 0.15)",
    color: "#60a5fa",
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "0.8rem",
  },
  timer: { fontSize: "1.1rem", fontWeight: "bold" },
  questionText: { fontSize: "1.8rem", marginBottom: "40px", fontWeight: "500" },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  optionBtn: {
    padding: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#e2e8f0",
    transition: "0.3s ease",
    textAlign: "left",
  },
  nextBtn: {
    marginTop: "30px",
    width: "100%",
    padding: "15px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  scoreCircle: {
    fontSize: "4rem",
    fontWeight: "bold",
    color: "#3b82f6",
    margin: "20px 0",
  },
  reviewSection: {
    textAlign: "left",
    marginTop: "30px",
    maxHeight: "300px",
    overflowY: "auto",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "20px",
  },
  reviewItem: {
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  loader: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
    color: "#3b82f6",
    fontSize: "1.5rem",
  },
};

export default QuizApp;
