import React from 'react'

const About = () => {
  return (
    <div className="py-20 min-h-screen w-full bg-cover bg-no-repeat bg-center flex flex-col justify-center px-4">
      <div className="max-w-4xl mx-auto text-left">
        <h1 className="text-6xl font-bold text-mediumblue text-slate-800 mb-4">About</h1>
        <h2 className="text-3xl text-slate-600 mb-8">
        </h2>
        <p className="text-slate-600 font-light text-darkblue text-lg leading-relaxed mb-8">
        Millions of people struggle to find accurate diagnoses—often navigating multiple 
        specialists and tests before uncovering the right answers. Our mission is to shorten
        that journey by using a simple, quiz-based approach. With every question, we aim 
        to give patients and caregivers a more informed starting point for discussions with 
        healthcare professionals—empowering them to seek targeted tests and referrals 
        sooner. We believe this cutting-edge, adaptive quiz approach can help reduce 
        delays, minimize misdiagnoses, and improve the overall diagnostic experience.
        </p>
      </div>
    </div>
  );
};

export default About;
