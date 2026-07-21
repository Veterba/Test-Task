import { createContext, useContext } from 'react'

export const QuizContext = createContext(null)

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within a QuizProvider')
  return ctx
}
