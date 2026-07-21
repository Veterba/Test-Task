import { describe, expect, it } from 'vitest'
import {
  AI_QUIZ_ID,
  buildAiQuiz,
  buildQuizzes,
  computeStats,
  decodeHtml,
  normalizeQuestion,
  pickRandomQuiz,
  shuffle,
} from './quiz'

/** Deterministic RNG so shuffles are predictable in tests. */
const seq = (values) => {
  let i = 0
  return () => values[i++ % values.length]
}

/** Build `n` fake raw API questions. */
const makeRaw = (n) =>
  Array.from({ length: n }, (_, i) => ({
    type: 'multiple',
    difficulty: 'easy',
    category: `Cat ${i}`,
    question: `Q${i}`,
    correct_answer: `A${i}`,
    incorrect_answers: [`B${i}`, `C${i}`, `D${i}`],
  }))

describe('decodeHtml', () => {
  it('decodes HTML entities', () => {
    expect(decodeHtml('Louis-Eug&egrave;ne')).toBe('Louis-Eugène')
    expect(decodeHtml('Tom &amp; Jerry &quot;x&quot;')).toBe('Tom & Jerry "x"')
  })

  it('handles null/undefined', () => {
    expect(decodeHtml(null)).toBe('')
    expect(decodeHtml(undefined)).toBe('')
  })
})

describe('shuffle', () => {
  it('keeps the same elements without mutating the input', () => {
    const input = [1, 2, 3, 4]
    const out = shuffle(input, seq([0, 0, 0, 0]))
    expect(out).not.toBe(input)
    expect(input).toEqual([1, 2, 3, 4])
    expect([...out].sort()).toEqual([1, 2, 3, 4])
  })
})

describe('normalizeQuestion', () => {
  it('combines correct + incorrect answers into one list', () => {
    const q = normalizeQuestion(makeRaw(1)[0], () => 0)
    expect(q.answers).toHaveLength(4)
    expect(q.answers).toContain(q.correctAnswer)
    expect(q.correctAnswer).toBe('A0')
  })
})

describe('buildQuizzes', () => {
  it('splits 50 questions into 10 quizzes of 5', () => {
    const quizzes = buildQuizzes(makeRaw(50), { rng: () => 0 })
    expect(quizzes).toHaveLength(10)
    quizzes.forEach((quiz) => expect(quiz.questions).toHaveLength(5))
  })

  it('assigns unique ids and every source question is used once', () => {
    const quizzes = buildQuizzes(makeRaw(50), { rng: () => 0 })
    const ids = quizzes.map((q) => q.id)
    expect(new Set(ids).size).toBe(10)

    const allQuestions = quizzes.flatMap((q) => q.questions.map((x) => x.question))
    expect(new Set(allQuestions).size).toBe(50)
  })

  it('drops an incomplete trailing quiz', () => {
    const quizzes = buildQuizzes(makeRaw(48), { rng: () => 0 })
    expect(quizzes).toHaveLength(9)
  })
})

describe('buildAiQuiz', () => {
  const raw = Array.from({ length: 5 }, (_, i) => ({
    question: `Q${i}`,
    correct_answer: `A${i}`,
    incorrect_answers: [`B${i}`, `C${i}`, `D${i}`],
    difficulty: 'medium',
  }))

  it('builds a 5-question quiz tagged with the topic', () => {
    const quiz = buildAiQuiz('Space', raw, () => 0)
    expect(quiz.id).toBe(AI_QUIZ_ID)
    expect(quiz.name).toContain('Space')
    expect(quiz.questions).toHaveLength(5)
    quiz.questions.forEach((q) => {
      expect(q.answers).toHaveLength(4)
      expect(q.answers).toContain(q.correctAnswer)
      expect(q.category).toBe('Space')
    })
  })
})

describe('pickRandomQuiz', () => {
  it('returns null for an empty list', () => {
    expect(pickRandomQuiz([])).toBeNull()
  })

  it('picks an item from the list', () => {
    const quizzes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    expect(pickRandomQuiz(quizzes, () => 0.99)).toBe(quizzes[2])
    expect(pickRandomQuiz(quizzes, () => 0)).toBe(quizzes[0])
  })
})

describe('computeStats', () => {
  const quiz = {
    questions: [
      { correctAnswer: 'a', difficulty: 'easy' },
      { correctAnswer: 'b', difficulty: 'medium' },
      { correctAnswer: 'c', difficulty: 'hard' },
      { correctAnswer: 'd', difficulty: 'easy' },
    ],
  }

  it('scores correct answers with difficulty weighting', () => {
    const stats = computeStats(quiz, ['a', 'b', 'x', 'd'], 20000)
    expect(stats.correct).toBe(3)
    expect(stats.total).toBe(4)
    expect(stats.score).toBe(10 + 20 + 10) // easy + medium + easy
    expect(stats.accuracy).toBe(75)
    expect(stats.seconds).toBe(20)
    expect(stats.avgPerQuestion).toBe(5)
  })

  it('tracks the best streak of consecutive correct answers', () => {
    const stats = computeStats(quiz, ['a', 'b', 'c', 'x'], 1000)
    expect(stats.bestStreak).toBe(3)
    const broken = computeStats(quiz, ['a', 'x', 'c', 'd'], 1000)
    expect(broken.bestStreak).toBe(2)
  })

  it('handles a fully wrong run', () => {
    const stats = computeStats(quiz, ['x', 'x', 'x', 'x'], 5000)
    expect(stats.correct).toBe(0)
    expect(stats.score).toBe(0)
    expect(stats.accuracy).toBe(0)
    expect(stats.bestStreak).toBe(0)
  })
})
