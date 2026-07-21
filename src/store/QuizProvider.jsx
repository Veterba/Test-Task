import { useCallback, useEffect, useReducer, useState } from 'react'
import { fetchQuestions } from '../api/opentdb'
import { buildQuizzes } from '../lib/quiz'
import { initialSession, sessionReducer } from '../lib/session'
import { QuizContext } from './context'

export function QuizProvider({ children }) {
  const [catalog, setCatalog] = useState({
    status: 'loading',
    quizzes: [],
    error: null,
  })
  const [aiQuiz, setAiQuiz] = useState(null)
  const [session, dispatch] = useReducer(sessionReducer, initialSession)

  const reload = useCallback(async () => {
    setCatalog({ status: 'loading', quizzes: [], error: null })
    try {
      const results = await fetchQuestions(50)
      setCatalog({ status: 'ready', quizzes: buildQuizzes(results), error: null })
    } catch (err) {
      setCatalog({ status: 'error', quizzes: [], error: err.message })
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const getQuiz = useCallback(
    (id) => {
      if (aiQuiz && aiQuiz.id === id) return aiQuiz
      return catalog.quizzes.find((q) => q.id === id) ?? null
    },
    [catalog.quizzes, aiQuiz],
  )

  const value = {
    ...catalog,
    reload,
    getQuiz,
    aiQuiz,
    setAiQuiz,
    session,
    startQuiz: (quizId) => dispatch({ type: 'start', quizId, now: Date.now() }),
    answerQuestion: (answer) => dispatch({ type: 'answer', answer }),
    nextQuestion: () => dispatch({ type: 'next' }),
    finishQuiz: () => dispatch({ type: 'finish', now: Date.now() }),
    resetSession: () => dispatch({ type: 'reset' }),
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
