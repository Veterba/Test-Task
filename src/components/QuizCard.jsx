import { Link } from 'react-router-dom'

export default function QuizCard({ quiz }) {
  const count = quiz.questions.length
  return (
    <article className="flex flex-col justify-between gap-5 rounded-3xl bg-white p-5 text-slate-800 shadow-lg shadow-black/10">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{quiz.name}</h2>
        <p className="mt-1 text-sm text-slate-500">{count} questions</p>
      </div>
      <Link
        to={`/play/${quiz.id}`}
        className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-500/30 transition hover:bg-accent-600"
      >
        Play
      </Link>
    </article>
  )
}
