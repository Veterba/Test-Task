export const POINTS = { easy: 10, medium: 20, hard: 30 }

export const QUIZ_NAMES = [
  'Warm-up Round',
  'Brain Teasers',
  'Trivia Sprint',
  'Mixed Bag',
  'Curious Minds',
  'Quick Fire',
  'Knowledge Rush',
  'Puzzle Pack',
  'Final Countdown',
  'Grand Challenge',
]

export function decodeHtml(html) {
  if (html == null) return ''
  if (typeof document !== 'undefined') {
    const el = document.createElement('textarea')
    el.innerHTML = html
    return el.value
  }
  return String(html)
}

export function shuffle(array, rng = Math.random) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function normalizeQuestion(raw, rng = Math.random) {
  const correctAnswer = decodeHtml(raw.correct_answer)
  const incorrect = (raw.incorrect_answers || []).map(decodeHtml)
  return {
    question: decodeHtml(raw.question),
    category: decodeHtml(raw.category),
    difficulty: raw.difficulty,
    type: raw.type,
    correctAnswer,
    answers: shuffle([correctAnswer, ...incorrect], rng),
  }
}

export function buildQuizzes(
  results,
  { count = 10, perQuiz = 5, rng = Math.random } = {},
) {
  const questions = shuffle(results, rng).map((q) => normalizeQuestion(q, rng))
  const quizzes = []
  for (let i = 0; i < count; i++) {
    const slice = questions.slice(i * perQuiz, (i + 1) * perQuiz)
    if (slice.length < perQuiz) break
    quizzes.push({
      id: `quiz-${i + 1}`,
      name: QUIZ_NAMES[i % QUIZ_NAMES.length],
      questions: slice,
    })
  }
  return quizzes
}

export function pickRandomQuiz(quizzes, rng = Math.random) {
  if (!quizzes.length) return null
  return quizzes[Math.floor(rng() * quizzes.length)]
}

export function computeStats(quiz, answers, elapsedMs) {
  const total = quiz.questions.length
  let correct = 0
  let score = 0
  let streak = 0
  let bestStreak = 0

  quiz.questions.forEach((q, i) => {
    if (answers[i] != null && answers[i] === q.correctAnswer) {
      correct++
      score += POINTS[q.difficulty] ?? 10
      streak++
      bestStreak = Math.max(bestStreak, streak)
    } else {
      streak = 0
    }
  })

  const seconds = Math.max(0, Math.round(elapsedMs / 1000))
  const accuracy = total ? Math.round((correct / total) * 100) : 0
  const avgPerQuestion = total ? Math.round(elapsedMs / total / 100) / 10 : 0

  return { correct, total, score, accuracy, seconds, avgPerQuestion, bestStreak }
}
