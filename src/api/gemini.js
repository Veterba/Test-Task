const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      question: { type: 'string' },
      correct_answer: { type: 'string' },
      incorrect_answers: { type: 'array', items: { type: 'string' } },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
    },
    required: ['question', 'correct_answer', 'incorrect_answers', 'difficulty'],
  },
}

export async function generateQuestions(topic) {
  if (!API_KEY) throw new Error('Missing VITE_GEMINI_API_KEY.')

  const prompt =
    `Create 5 multiple-choice trivia questions about "${topic}". ` +
    'Each question has exactly one correct answer and three plausible but wrong answers.'

  const res = await fetch(`${URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: schema },
    }),
  })

  if (!res.ok) {
    throw new Error(`Gemini request failed (HTTP ${res.status}).`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  const questions = text ? JSON.parse(text) : []
  if (!questions.length) throw new Error('The model returned no questions.')
  return questions
}
