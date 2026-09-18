import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { getRecommendations } from '../engine/recommend'
import { Badge, Button, SectionTitle } from '../components/ui'

export function Recommendations() {
  const { profile, previousTopIds, comparedIds, toggleCompared } = useApp()
  const navigate = useNavigate()

  const recommendations = useMemo(() => getRecommendations(profile, previousTopIds).slice(0, 6), [profile, previousTopIds])

  return (
    <div>
      <SectionTitle
        eyebrow="Шаг 4 из 6"
        title="Рекомендованные программы"
        description="Ранжировано по совпадению с вашим профилем. Отметьте 2–3 варианта, чтобы сравнить их подробнее."
      />

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isCompared = comparedIds.includes(rec.program.id)
          return (
            <div key={rec.program.id} className="card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink">{rec.program.university}</h3>
                    {rec.isNew && <Badge tone="accent">Новое совпадение</Badge>}
                    <Badge tone="primary">{rec.score}% совпадение</Badge>
                  </div>
                  <p className="text-sm text-ink-soft">
                    {rec.program.program} · {rec.program.city}, {rec.program.country}
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">{rec.program.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-ink-soft">Стоимость в год</p>
                  <p className="font-display text-xl font-semibold text-ink">
                    {rec.program.tuitionUSD === 0 ? 'Бесплатно' : `$${rec.program.tuitionUSD.toLocaleString('ru-RU')}`}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary" style={{ width: `${rec.score}%` }} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ul className="space-y-1.5">
                  {rec.reasons
                    .filter((r) => r.type === 'match')
                    .map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm text-ink">
                        <span className="mt-0.5 shrink-0 text-success">✓</span>
                        {r.text}
                      </li>
                    ))}
                </ul>
                <ul className="space-y-1.5">
                  {rec.reasons
                    .filter((r) => r.type === 'caution')
                    .map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm text-ink-soft">
                        <span className="mt-0.5 shrink-0 text-warning">!</span>
                        {r.text}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <a href={rec.program.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
                  Официальный сайт вуза ↗
                </a>
                <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <input
                    type="checkbox"
                    checked={isCompared}
                    onChange={() => toggleCompared(rec.program.id)}
                    disabled={!isCompared && comparedIds.length >= 3}
                    className="h-4 w-4 accent-[#4F3FF0]"
                  />
                  Добавить к сравнению
                </label>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate('/diagnosis')}>
          ← К диагностике
        </Button>
        <Button onClick={() => navigate('/compare')} disabled={comparedIds.length < 2}>
          Сравнить выбранные ({comparedIds.length}) →
        </Button>
      </div>
    </div>
  )
}
