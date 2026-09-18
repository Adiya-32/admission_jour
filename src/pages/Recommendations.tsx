import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { getRecommendations } from '../engine/recommend'
import { Badge, Button, SectionTitle } from '../components/ui'
import type { Recommendation } from '../types'

function RecommendationCard({ rec, isCompared, onToggleCompare, compareDisabled }: {
  rec: Recommendation
  isCompared: boolean
  onToggleCompare: () => void
  compareDisabled: boolean
}) {
  return (
    <div className="card p-5 sm:p-6">
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
            onChange={onToggleCompare}
            disabled={compareDisabled}
            className="h-4 w-4 accent-[#4F3FF0]"
          />
          Добавить к сравнению
        </label>
      </div>
    </div>
  )
}

export function Recommendations() {
  const { profile, previousTopIds, comparedIds, toggleCompared } = useApp()
  const navigate = useNavigate()

  const { inCountry, outCountry } = useMemo(() => {
    const all = getRecommendations(profile, previousTopIds)
    if (profile.countries.length === 0) {
      return { inCountry: all.slice(0, 6), outCountry: [] as Recommendation[] }
    }
    const matched = all.filter((r) => profile.countries.includes(r.program.country))
    const rest = all.filter((r) => !profile.countries.includes(r.program.country))
    const inCountry = matched.slice(0, 6)
    const remainingSlots = Math.max(0, Math.max(3, inCountry.length) - inCountry.length)
    const outCountry = inCountry.length === 0 ? rest.slice(0, 6) : rest.slice(0, remainingSlots)
    return { inCountry, outCountry }
  }, [profile, previousTopIds])

  const showGrouping = profile.countries.length > 0 && inCountry.length > 0 && outCountry.length > 0

  return (
    <div>
      <SectionTitle
        eyebrow="Шаг 4 из 6"
        title="Рекомендованные программы"
        description="Ранжировано по совпадению с вашим профилем. Отметьте 2–3 варианта, чтобы сравнить их подробнее."
      />

      {showGrouping && (
        <p className="mb-3 text-sm font-semibold text-ink-soft">В выбранных странах ({profile.countries.join(', ')})</p>
      )}
      <div className="space-y-4">
        {inCountry.map((rec) => (
          <RecommendationCard
            key={rec.program.id}
            rec={rec}
            isCompared={comparedIds.includes(rec.program.id)}
            onToggleCompare={() => toggleCompared(rec.program.id)}
            compareDisabled={!comparedIds.includes(rec.program.id) && comparedIds.length >= 3}
          />
        ))}
      </div>

      {outCountry.length > 0 && (
        <>
          <p className="mb-3 mt-8 text-sm font-semibold text-ink-soft">
            {inCountry.length === 0
              ? 'В выбранных странах подходящих программ не нашлось — вот лучшие варианты в других странах'
              : 'Другие сильные варианты вне выбранных стран'}
          </p>
          <div className="space-y-4">
            {outCountry.map((rec) => (
              <RecommendationCard
                key={rec.program.id}
                rec={rec}
                isCompared={comparedIds.includes(rec.program.id)}
                onToggleCompare={() => toggleCompared(rec.program.id)}
                compareDisabled={!comparedIds.includes(rec.program.id) && comparedIds.length >= 3}
              />
            ))}
          </div>
        </>
      )}

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
