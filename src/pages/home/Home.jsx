import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../../store/context'
import { pickRandomQuiz } from '../../lib/quiz'
import QuizCard from '../../components/QuizCard'
import Spinner from '../../components/Spinner'

export default function Home() {
  const { status, quizzes, error, reload } = useQuiz()
  const navigate = useNavigate()

  const playLucky = () => {
    const quiz = pickRandomQuiz(quizzes)
    if (quiz) navigate(`/play/${quiz.id}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-10">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Quiz Arcade</h1>
          <p className="mt-1 text-white/70">Pick a quiz and test your knowledge.</p>
        </div>
        <button
          type="button"
          onClick={playLucky}
          disabled={status !== 'ready'}
          className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🍀 I&apos;m lucky
        </button>
      </header>

      {status === 'loading' && <Spinner label="Building quizzes…" />}

      {status === 'error' && (
        <div className="rounded-3xl bg-white/10 p-6 text-center ring-1 ring-white/20">
          <p className="text-white/90">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-4 rounded-2xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <QuizCard quiz={quiz} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
