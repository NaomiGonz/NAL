import React from "react";
import { useNavigate } from "react-router-dom";

const QuizStart = () => {
  const navigate = useNavigate();

  const handleQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="py-20 min-h-screen w-full bg-cover bg-no-repeat bg-center flex flex-col justify-center px-4">
      <div className="max-w-4xl mx-auto text-left">
      <h1 className="text-6xl font-bold text-center text-mediumblue mb-4">Take Our Quiz</h1>
      <h1 className="text-2xl text-center text-mediumblue mb-4">Answer Questions About your Symptoms</h1>
      <button
        onClick={handleQuiz}
        className="block mx-auto text-ivory font-light bg-mediumblue px-6 py-2 border-2 border-medium transition-colors duration-300 rounded-full hover:bg-green"
      >Start</button>
      </div>
    </div>
  );
};

export default QuizStart;


