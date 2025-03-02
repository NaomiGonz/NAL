import React from "react";
import { useNavigate } from "react-router-dom";

const QuizStart = () => {
  const navigate = useNavigate();

  const handleQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="py-20">
      Quiz Into Page
      <button
        onClick={handleQuiz}
        className="text-ivory font-light bg-mediumblue px-6 py-2 border-2 border-medium transition-colors duration-300 rounded-full hover:bg-green"
      >Start</button>
    </div>
  );
};

export default QuizStart;


