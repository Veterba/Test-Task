import { Link, useLocation } from 'react-router-dom'
import { FlagIcon, HomeIcon, PlayIcon, SparkleIcon } from './icons'

const TABS = [
  { key: 'home', label: 'Home', to: '/', match: (p) => p === '/', Icon: HomeIcon },
  { key: 'ai', label: 'AI quiz', to: '/ai', match: (p) => p === '/ai', Icon: SparkleIcon },
  { key: 'play', label: 'Play', match: (p) => p.startsWith('/play'), Icon: PlayIcon },
  { key: 'finish', label: 'Finish', match: (p) => p.startsWith('/finish'), Icon: FlagIcon },
]

const SLOT = 56

export default function BottomNav() {
  const { pathname } = useLocation()
  const active = Math.max(0, TABS.findIndex((t) => t.match(pathname)))

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center">
      <div className="pointer-events-auto relative flex rounded-full bg-slate-900/95 p-2 shadow-xl shadow-black/30">
        <span
          className="absolute top-2 flex h-14 w-14 items-center justify-center transition-transform duration-300 ease-out"
          style={{ left: 8, transform: `translateX(${active * SLOT}px)` }}
          aria-hidden
        >
          <span className="h-11 w-11 rounded-full bg-accent-500 shadow-lg shadow-accent-500/40" />
        </span>

        {TABS.map((tab, i) => {
          const isActive = i === active
          const cls = `relative z-10 flex h-14 w-14 items-center justify-center transition-colors ${
            isActive ? 'text-slate-900' : 'text-slate-400'
          }`
          const icon = <tab.Icon className="h-6 w-6" />
          return tab.to ? (
            <Link key={tab.key} to={tab.to} aria-label={tab.label} className={cls}>
              {icon}
            </Link>
          ) : (
            <span
              key={tab.key}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={cls}
            >
              {icon}
            </span>
          )
        })}
      </div>
    </nav>
  )
}
