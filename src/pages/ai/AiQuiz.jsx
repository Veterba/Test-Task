import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../../store/context'
import { generateQuestions } from '../../api/gemini'
import { AI_QUIZ_ID, buildAiQuiz } from '../../lib/quiz'
import { SparkleIcon } from '../../components/icons'
import Spinner from '../../components/Spinner'

const EXAMPLES = ['Space exploration', 'The 90s', 'World cuisine', 'JavaScript']

export default function AiQuiz() {
  const { setAiQuiz, resetSession } = useQuiz()
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const generate = async (value) => {
    const trimmed = value.trim()
    if (!trimmed || status === 'loading') return
    setStatus('loading')
    setError(null)
    try {
      const raw = await generateQuestions(trimmed)
      resetSession()
      setAiQuiz(buildAiQuiz(trimmed, raw))
      navigate(`/play/${AI_QUIZ_ID}`)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return <Spinner label={`Generating a quiz about “${topic.trim()}”…`} />
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-16">
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-accent-400 ring-1 ring-white/20">
          <SparkleIcon className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-3xl font-bold">AI Quiz Generator</h1>
        <p className="mt-2 text-white/70">
          Enter any topic and Gemini builds a 5-question quiz for you.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          generate(topic)
        }}
        className="mt-8"
      >
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Ancient Rome"
          className="w-full rounded-2xl bg-white px-4 py-3.5 text-slate-800 placeholder-slate-400 shadow-lg shadow-black/10 outline-none ring-2 ring-transparent focus:ring-accent-400"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setTopic(ex)}
              className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80 ring-1 ring-white/20 transition hover:bg-white/20"
            >
              {ex}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-200">{error}</p>}

        <button
          type="submit"
          disabled={!topic.trim()}
          className="mt-6 w-full rounded-2xl bg-accent-500 py-4 text-base font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate quiz
        </button>
      </form>
    </div>
  )
}
