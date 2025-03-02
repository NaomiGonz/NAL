import React from "react";
import backgroundPNG from "/Background.png"; // Ensure this path is correct or in /public

const Welcome = () => {
  return (
    <div
      className="py-20 min-h-screen w-full bg-cover bg-no-repeat bg-center flex flex-col justify-center px-4"
      style={{ backgroundImage: `url(${backgroundPNG})` }}
    >
      <div className="max-w-4xl mx-auto text-left">
        <h1 className="text-6xl font-bold text-slate-800 mb-4">PhenoQ</h1>
        <h2 className="text-3xl text-slate-600 mb-8">
          Your Journey to Diagnosis Starts Here.
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          PhenoQ is a cutting-edge diagnostic tool designed to simplify and
          accelerate the process of identifying rare and complex diseases. By
          leveraging the Human Phenotype Ontology (HPO) and adaptive
          questioning, PhenoQ guides users through a series of targeted
          questions about a patient’s symptoms and features.
        </p>
        <button className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-700">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Welcome;



