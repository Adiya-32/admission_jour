import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useApp } from '../state/AppContext'

const STEPS = [
  { path: '/', label: 'Вход' },
  { path: '/profile', label: 'Профиль' },
  { path: '/diagnosis', label: 'Диагностика' },
  { path: '/recommendations', label: 'Рекомендации' },
  { path: '/compare', label: 'Сравнение' },
  { path: '/roadmap', label: 'Маршрут' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.4" opacity="0.6" />
          <path d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5Z" fill="white" />
        </svg>
      </span>
      Компас
    </Link>
  )
}

export function Stepper() {
  const location = useLocation()
  const { profileCompleted } = useApp()
  const currentIndex = STEPS.findIndex((s) => s.path === location.pathname)

  return (
    <nav aria-label="Этапы маршрута" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {STEPS.map((step, i) => {
        const reachable = i <= 1 || profileCompleted
        const isCurrent = i === currentIndex
        const isDone = i < currentIndex
        const content = (
          <span
            className={clsx(
              'flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isCurrent && 'bg-primary text-white',
              !isCurrent && isDone && 'bg-primary-soft text-primary-dark',
              !isCurrent && !isDone && reachable && 'text-ink-soft hover:bg-primary-soft',
              !reachable && 'text-ink-soft/40'
            )}
          >
            <span
              className={clsx(
                'flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold',
                isCurrent && 'bg-white/25 text-white',
                !isCurrent && isDone && 'bg-primary text-white',
                !isCurrent && !isDone && 'bg-border text-ink-soft'
              )}
            >
              {i + 1}
            </span>
            {step.label}
          </span>
        )
        return reachable ? (
          <Link key={step.path} to={step.path}>
            {content}
          </Link>
        ) : (
          <span key={step.path} aria-disabled className="cursor-not-allowed">
            {content}
          </span>
        )
      })}
    </nav>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Logo />
            <a
              href="https://aistartify.com"
              target="_blank"
              rel="noreferrer"
              className="hidden text-xs font-medium text-ink-soft sm:block"
            >
              LOCUS Hackathon 2026 · Кейс 02
            </a>
          </div>
          {location.pathname !== '/' && <Stepper />}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-xs text-ink-soft sm:px-6">
        Компас — учебный демо-проект. Данные о вузах приблизительные, уточняйте на официальных сайтах.
      </footer>
    </div>
  )
}
