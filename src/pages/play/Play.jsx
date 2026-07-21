import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuiz } from '../../store/context'
import { useElapsed, formatTime } from '../../hooks/useElapsed'
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  CrossIcon,
} from '../../components/icons'
import Spinner from '../../components/Spinner'

export default function Play() {
  const { quizId } = useParams()
  const {
    status,
    getQuiz,
    session,
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    resetSession,
  } = useQuiz()
  const navigate = useNavigate()
  const quiz = getQuiz(quizId)

  const started = session.quizId === quizId

  useEffect(() => {
    if (quiz && !started) startQuiz(quizId)
  }, [quiz, started, quizId, startQuiz])

  const elapsed = useElapsed(started ? session.startedAt : null)

  if (status === 'loading') return <Spinner label="Loading quiz…" />

  if (!quiz) {
    return (
      <div className="mx-auto max-w-md px-4 pt-24 text-center">
        <p className="text-lg text-white/90">This quiz could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 rounded-2xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to home
        </button>
      </div>
    )
  }

  if (!started) return <Spinner label="Loading quiz…" />

  const total = quiz.questions.length
  const question = quiz.questions[session.index]
  const selected = session.answers[session.index] ?? null
  const locked = selected != null
  const isLast = session.index === total - 1
  const progress = ((session.index + 1) / total) * 100

  const cancel = () => {
    resetSession()
    navigate('/')
  }

  const goNext = () => {
    if (!locked) return
    if (isLast) {
      finishQuiz()
      navigate(`/finish/${quizId}`)
    } else {
      nextQuestion()
    }
  }

  const answerClass = (answer) => {
    if (!locked) {
      return 'border-slate-200 bg-white text-slate-800 hover:border-accent-400 hover:bg-accent-400/10'
    }
    if (answer === question.correctAnswer) {
      return 'border-accent-500 bg-accent-500/15 text-slate-900'
    }
    if (answer === selected) {
      return 'border-red-400 bg-red-100 text-slate-900'
    }
    return 'border-slate-200 bg-white text-slate-400'
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={cancel}
          aria-label="Cancel quiz"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 transition hover:bg-white/25"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <p className="text-lg font-semibold tabular-nums">
          {String(session.index + 1).padStart(2, '0')} of{' '}
          {String(total).padStart(2, '0')}
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold tabular-nums ring-1 ring-white/20">
          <ClockIcon className="h-4 w-4 text-accent-400" />
          {formatTime(elapsed)}
        </span>
      </div>

      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-accent-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 text-slate-800 shadow-xl shadow-black/10">
        <p className="text-sm font-medium text-slate-400">{question.category}</p>
        <h1 className="mt-2 text-xl font-bold leading-snug text-slate-900">
          {question.question}
        </h1>

        <ul className="mt-6 space-y-3">
          {question.answers.map((answer) => {
            const showCheck = locked && answer === question.correctAnswer
            const showCross = locked && answer === selected && !showCheck
            return (
              <li key={answer}>
                <button
                  type="button"
                  onClick={() => answerQuestion(answer)}
                  disabled={locked}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition ${answerClass(answer)}`}
                >
                  <span>{answer}</span>
                  {showCheck && <CheckIcon className="h-6 w-6 shrink-0 text-accent-600" />}
                  {showCross && <CrossIcon className="h-6 w-6 shrink-0 text-red-500" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={!locked}
        className="mt-8 w-full rounded-2xl bg-accent-500 py-4 text-base font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLast ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}
