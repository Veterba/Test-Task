import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuiz } from '../../store/context'
import { computeStats } from '../../lib/quiz'

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center text-slate-800 shadow-lg shadow-black/10">
      <p className="text-3xl font-bold text-brand-600">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export default function Finish() {
  const { quizId } = useParams()
  const { getQuiz, session, resetSession } = useQuiz()
  const navigate = useNavigate()
  const quiz = getQuiz(quizId)

  if (!quiz || session.quizId !== quizId || !session.finishedAt) {
    return <Navigate to="/" replace />
  }

  const stats = computeStats(
    quiz,
    session.answers,
    session.finishedAt - session.startedAt,
  )

  const playAgain = () => {
    resetSession()
    navigate(`/play/${quizId}`)
  }

  const goHome = () => {
    resetSession()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-12">
      <div className="text-center">
        <p className="text-sm font-semibold text-accent-400">{quiz.name}</p>
        <h1 className="mt-1 text-3xl font-bold">Quiz complete! 🎉</h1>
        <p className="mt-2 text-white/70">
          You got {stats.correct} of {stats.total} right.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Score" value={stats.score} hint="weighted" />
        <Stat label="Correct" value={`${stats.correct}/${stats.total}`} />
        <Stat label="Time" value={`${stats.seconds}s`} />
        <Stat label="Accuracy" value={`${stats.accuracy}%`} />
        <Stat label="Avg / question" value={`${stats.avgPerQuestion}s`} />
        <Stat label="Best streak" value={stats.bestStreak} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={playAgain}
          className="w-full rounded-2xl bg-accent-500 py-3.5 text-base font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={goHome}
          className="w-full rounded-2xl bg-white/15 py-3.5 text-base font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/25"
        >
          Back to home
        </button>
      </div>
    </div>
  )
}
