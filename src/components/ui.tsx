import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export function Button({
  children,
  variant = 'primary',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; children: ReactNode }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-dark',
        variant === 'secondary' && 'border border-border bg-white text-ink hover:border-primary',
        variant === 'ghost' && 'text-ink-soft hover:text-ink',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={clsx('chip', active ? 'chip-active' : 'chip-inactive')}>
      {children}
    </button>
  )
}

export function Badge({ tone = 'primary', children }: { tone?: 'primary' | 'success' | 'warning' | 'accent' | 'danger'; children: ReactNode }) {
  const toneClasses: Record<string, string> = {
    primary: 'bg-primary-soft text-primary-dark',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    accent: 'bg-accent-soft text-accent',
    danger: 'bg-danger-soft text-danger',
  }
  return <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', toneClasses[tone])}>{children}</span>
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-ink-soft">{description}</p>}
    </div>
  )
}
