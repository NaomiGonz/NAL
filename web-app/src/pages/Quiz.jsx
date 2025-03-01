import React, { useState } from 'react'
import Button from '../components/Button'

const Quiz = () => {
  // Form state
  const [sex, setSex] = useState('')
  const [age, setAge] = useState('')
  const [symptoms, setSymptoms] = useState('') // comma separated
  const [hasStarted, setHasStarted] = useState(false)

  // Quiz state
  const [sessionId, setSessionId] = useState(null)
  const [questionId, setQuestionId] = useState(null)
  const [questionText, setQuestionText] = useState('')
  const [done, setDone] = useState(false)
  const [topDiseases, setTopDiseases] = useState([])

  // Start the quiz by sending the initial data to the backend.
  const handleStartQuiz = async () => {
    const initial_symptoms = symptoms.split(',')
      .map(s => s.trim())
      .filter(s => s)
    const payload = { sex, age: parseInt(age, 10), initial_symptoms }

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
        setQuestionId(data.next_question_id)
        setQuestionText(data.next_question_text)
      }
    } catch (err) {
      console.error(err)
      alert('Error submitting answer.')
    }
  }

  if (!hasStarted && !done) {
    return (
      <div className="py-20">
        <h2>Start the Rare Disease Quiz</h2>
        <div style={{ marginTop: '20px' }}>
          <label>Sex assigned at birth:</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="">Select Sex</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="intersex">Intersex</option>
          </select>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label>Age:</label>
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Select Age</option>
            {Array.from({ length: 121 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label>Symptoms (comma separated):</label>
          <input 
            type="text" 
            value={symptoms} 
            onChange={(e) => setSymptoms(e.target.value)} 
            placeholder="e.g., seizures, abnormal heart morphology"
          />
        </div>
        <div style={{ marginTop: '20px' }}>
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

  if (done) {
    return (
      <div className="py-20">
        <h2>Quiz Finished</h2>
        <p>Top probable diseases:</p>
        <ul>
          {topDiseases.map((d, idx) => (
            <li key={idx}>{d}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="py-20">
      <h2>Adaptive Quiz</h2>
      <p style={{ marginTop: '20px' }}>{questionText}</p>
      <div>
        <button onClick={() => submitAnswer('yes')}>Yes</button>
        <button onClick={() => submitAnswer('no')}>No</button>
        <button onClick={() => submitAnswer('unknown')}>Unknown</button>
      </div>
    </div>
  )
}

export default Quiz

