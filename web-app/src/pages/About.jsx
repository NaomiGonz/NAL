import React from 'react'
import teamPhoto from '/teamphoto.jpg'

const About = () => {
  return (
    <div className="py-20 min-h-screen w-full bg-cover bg-no-repeat bg-center flex flex-col justify-center px-4">
      <div className="max-w-4xl mx-auto text-left">
        <h1 className="text-6xl font-bold text-mediumblue text-center text-slate-800 mb-4">About</h1>
        <h2 className="text-3xl text-slate-600 mb-8"></h2>
          <div className="rounded-lg border border-red-500 p-6 bg-blue-50">
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
     <div className="flex items-center p-8 mt-8">
          <p className="text-2xl text-green-800 font-semibold transform -rotate-90 mr-6">
            Our Team
          </p>
          <div className="w-48 h-48 rounded-full overflow-hidden mr-6">
            <img
              src={teamPhoto}
              alt="Our Team"
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-slate-600 font-light text-blue-900 text-lg leading-relaxed">
            Naomi Gonzalez, Boston University CE 2025
            <br />
            Anvitha Nekkanti, Boston University BME 2025
            <br />
            Lakshmi Rajesh, Boston University BME 2025
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;
