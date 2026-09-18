import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { useApp } from '../state/AppContext'

export function Landing() {
  const navigate = useNavigate()
  const { profileCompleted } = useApp()

  return (
    <div className="grid gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
      <div>
        <span className="mb-4 inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-dark">
          Персональный маршрут поступления
        </span>
        <h1 className="font-display text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl">
          Хватит листать
          <br />
          <span className="text-primary">списки вузов.</span>
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Компас превращает вашу анкету в конкретный ответ: какие программы вам подходят, почему именно они и что
          сделать сегодня, чтобы туда попасть.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate('/profile')}>{profileCompleted ? 'Обновить анкету' : 'Начать за 5 минут'}</Button>
          {profileCompleted && (
            <Button variant="secondary" onClick={() => navigate('/recommendations')}>
              К моим рекомендациям
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="rounded-2xl bg-ink p-6 text-white shadow-[0_20px_50px_rgba(28,27,41,0.25)] sm:p-7">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Пример подбора</p>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80">высокое совпадение</span>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-5xl font-semibold text-accent">92%</span>
            <span className="mb-1.5 text-sm text-white/60">совпадение с профилем</span>
          </div>
          <p className="mt-1 text-sm font-medium text-white/80">KAIST · Computer Science · Южная Корея</p>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[92%] rounded-full bg-accent" />
          </div>

          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
            <p className="flex gap-2 text-white/80">
              <span className="text-success">✓</span> Совпадает с интересом: Data Science и AI
            </p>
            <p className="flex gap-2 text-white/80">
              <span className="text-success">✓</span> Обучение бесплатное при стипендии
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-white/5 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Следующий шаг</p>
            <p className="mt-1 text-sm text-white">Подготовиться и сдать IELTS — ближайшие 2–3 месяца</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { n: '37', t: 'программ в базе' },
            { n: '23', t: 'страны' },
            { n: '6', t: 'шагов до плана' },
          ].map((stat) => (
            <div key={stat.t} className="card p-3">
              <p className="font-display text-xl font-semibold text-ink">{stat.n}</p>
              <p className="text-xs text-ink-soft">{stat.t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
