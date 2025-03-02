import React, { useState } from 'react'
import Button from '../components/Button'

const Quiz = () => {
  // Form state
  const [sex, setSex] = useState('')
  const [age, setAge] = useState('')
  const [symptoms, setSymptoms] = useState('') // comma separated
  const [hasPrevDiagnosis, setHasPrevDiagnosis] = useState('no') // "yes" or "no"
  const [prevDiagnosis, setPrevDiagnosis] = useState('')
  const [hasStarted, setHasStarted] = useState(false)

  // Quiz state
  const [sessionId, setSessionId] = useState(null)
  const [questionId, setQuestionId] = useState(null)
  const [questionText, setQuestionText] = useState('')
  const [definitionText, setDefinitionText] = useState('') // <-- new field to store definition
  const [done, setDone] = useState(false)
  const [topDiseases, setTopDiseases] = useState([])

  // Start the quiz by sending the initial data to the backend.
  const handleStartQuiz = async () => {
    const initial_symptoms = symptoms
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
    // If the user selected "yes" for previous diagnosis, include it; else send empty string.
    const previous_diagnosis = hasPrevDiagnosis === "yes" ? prevDiagnosis.trim() : ""
    const payload = { 
      sex, 
      age: parseInt(age, 10), 
      initial_symptoms,
      previous_diagnosis
    }

    try {
      const resp = await fetch('http://localhost:8000/start_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await resp.json()
      setSessionId(data.session_id)
      setQuestionId(data.question_id)
      setQuestionText(data.question_text)
      // If the backend includes "definition_text", store it; else store empty.
      setDefinitionText(data.definition_text || '')
      setHasStarted(true)
    } catch (err) {
      console.error(err)
      alert('Error starting quiz.')
    }
  }

  // Submit an answer and update the quiz state.
  const submitAnswer = async (answer) => {
    if (!sessionId || !questionId) return

    const payload = { session_id: sessionId, question_id: questionId, answer }
    try {
      const resp = await fetch('http://localhost:8000/answer_question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await resp.json()
      if (data.done) {
        setDone(true)
        if (data.top_diseases) {
          setTopDiseases(data.top_diseases)
        }
      } else {
        // set next question
        setQuestionId(data.next_question_id)
        setQuestionText(data.next_question_text)
        // set definition if provided
        setDefinitionText(data.definition_text || '')
      }
    } catch (err) {
      console.error(err)
      alert('Error submitting answer.')
    }
  }

  // Render initial form if quiz hasn't started and isn't done
  if (!hasStarted && !done) {
    return (
      <div className="py-20 bg-ivory">
        <h2 className="text-4xl font-semibold mb-4 mt-10 text-center text-mediumblue">Patient Background Information</h2>
        
        {/* Sex Selection */}
        <div className="mt-4">
          <label className="block mb-1 text-center mt-10 text-2xl font-light text-mediumblue">Sex assigned at birth:</label>
          <select 
            value={sex} 
            onChange={(e) => setSex(e.target.value)}
            className="border border-green rounded p-2 w-97 font-light text-mediumblue bg-ivory appearance-none absolute left-1/2 transform -translate-x-1/2"
          >
            <option value="">Select Sex</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="intersex">Intersex</option>
          </select>
        </div>

        {/* Age Dropdown */}
        <div className="mt-4">
          <label className="block mb-1 text-center mt-20 text-2xl font-light text-mediumblue">What is your age?:</label>
          <select 
            value={age} 
            onChange={(e) => setAge(e.target.value)}
            className="border border-green rounded p-2 w-97 font-light text-mediumblue bg-ivory appearance-none absolute left-1/2 transform -translate-x-1/2"
          >
            <option value="">Select Age</option>
            {Array.from({ length: 121 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Symptoms Input */}
        <div className="mt-4">
          <label className="block mb-1 text-center mt-20 text-2xl font-light text-mediumblue">What are your symptoms? (comma separated):</label>
          <input 
            type="text" 
            value={symptoms} 
            onChange={(e) => setSymptoms(e.target.value)} 
            placeholder="e.g., seizures, abnormal heart morphology"
            className="border border-green rounded p-2 w-97 font-light text-mediumblue bg-ivory appearance-none absolute left-1/2 transform -translate-x-1/2"
          />
        </div>

        {/* Previous Diagnosis Selection */}
        <div className="mt-4">
          <label className="block mb-1 text-center mt-20 text-2xl font-light text-mediumblue">Have you received a previous diagnosis?</label>
          <select 
            value={hasPrevDiagnosis} 
            onChange={(e) => setHasPrevDiagnosis(e.target.value)}
            className="border border-green rounded p-2 w-97 font-light text-mediumblue bg-ivory appearance-none absolute left-1/2 transform -translate-x-1/2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* Previous Diagnosis Input (conditionally rendered) */}
        {hasPrevDiagnosis === "yes" && (
          <div className="mt-4">
            <label className="block mb-1 text-center mt-20 text-2xl font-light text-mediumblue">What was your previous diagnosis?:</label>
            <input 
              type="text" 
              value={prevDiagnosis} 
              onChange={(e) => setPrevDiagnosis(e.target.value)}
              placeholder="e.g., Developmental and epileptic encephalopathy 96"
              className="border border-green rounded p-2 w-97 font-light text-mediumblue bg-ivory appearance-none absolute left-1/2 transform -translate-x-1/2"
            />
          </div>
        )}

        <div className="mt-6">
          <Button
            text="Start Quiz"
            color="black"
            onClick={handleStartQuiz}
            transparent={false}
            className="text-black"
          />
        </div>
      </div>
    )
  }

  // If quiz is done, show top diseases
  if (done) {
    return (
      <div className="py-20 bg-ivory">
        <h2 className="text-2xl text-mediumblue text-center font-semibold mb-4">Quiz Finished</h2>
        <p className="mb-4 text-darkblue font-italicize text-center"> Important Note: The results provided by PhenoQ are based on the symptoms and information you've entered. </p>
        <p className = "mb-4 text-darkblue font-semibold text-center"> These are suggestions and not a substitute for professional medical advice, diagnosis, or treatment. </p>
        <div>
        <p className="mb-4 text-green font-semibold text-center">Top probable diseases:</p>
        <ul className="list-disc list-inside w-fit mx-auto text-left">
          {topDiseases.map((d, idx) => (
            <li key={idx}>{d}</li>
          ))}
        </ul>
        </div>
      </div>
          
    )
  }

  // Otherwise, we're in the middle of the quiz
  return (
    <div className="py-20 bg-blue">
      <h2 className="text-2xl text-mediumblue text-center font-semibold mb-4">{questionText}</h2>
      {/* Conditionally display definition if present */}
      {definitionText && (
        <p className="mb-4 italic text-darkblue text-center text-gray-700">
          Definition: {definitionText}
        </p>
      )}
      
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => submitAnswer('yes')}
          className="px-6 py-2 border-2 border-green text-mediumblue rounded-full hover:bg-blue-500 hover:text-lightblue transition-colors duration-300"
        >
          Yes
        </button>
        <button 
          onClick={() => submitAnswer('no')}
          className="px-6 py-2 border-2 border-green text-mediumblue rounded-full hover:bg-blue-500 hover:text-lightblue transition-colors duration-300"
        >
          No
        </button>
        <button 
          onClick={() => submitAnswer('unknown')}
          className="px-6 py-2 border-2 border-green text-mediumblue rounded-full hover:bg-blue-500 hover:text-lightblue transition-colors duration-300"
        >
          Unknown
        </button>
      </div>
    </div>
  );
};

export default Quiz

