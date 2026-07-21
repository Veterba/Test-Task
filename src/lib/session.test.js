import { describe, expect, it } from 'vitest'
import { initialSession, sessionReducer } from './session'

describe('sessionReducer', () => {
  it('starts a fresh session', () => {
    const s = sessionReducer(initialSession, {
      type: 'start',
      quizId: 'quiz-2',
      now: 1000,
    })
    expect(s).toEqual({
      quizId: 'quiz-2',
      answers: [],
      index: 0,
      startedAt: 1000,
      finishedAt: null,
    })
  })

  it('records an answer at the current index', () => {
    const started = { ...initialSession, quizId: 'q', index: 1 }
    const s = sessionReducer(started, { type: 'answer', answer: 'A' })
    expect(s.answers[1]).toBe('A')
  })

  it('locks an answer once given', () => {
    const answered = { ...initialSession, index: 0, answers: ['A'] }
    const s = sessionReducer(answered, { type: 'answer', answer: 'B' })
    expect(s).toBe(answered)
    expect(s.answers[0]).toBe('A')
  })

  it('advances to the next question', () => {
    const s = sessionReducer({ ...initialSession, index: 2 }, { type: 'next' })
    expect(s.index).toBe(3)
  })

  it('finishes and resets', () => {
    const finished = sessionReducer(initialSession, { type: 'finish', now: 42 })
    expect(finished.finishedAt).toBe(42)
    expect(sessionReducer(finished, { type: 'reset' })).toEqual(initialSession)
  })
})
