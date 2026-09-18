import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { getRecommendations } from '../engine/recommend'
import { buildRoadmap } from '../engine/roadmap'
import { PROGRAMS } from '../data/programs'
import { Badge, Button, SectionTitle } from '../components/ui'
import type { RoadmapCategory } from '../types'

const CATEGORIES: RoadmapCategory[] = ['Экзамены', 'Документы', 'Дедлайны', 'Академические шаги', 'Активности']

export function Roadmap() {
  const { profile, comparedIds, completedSteps, toggleStepCompleted } = useApp()
  const navigate = useNavigate()

  const topPrograms = useMemo(() => {
    if (comparedIds.length > 0) return PROGRAMS.filter((p) => comparedIds.includes(p.id))
    return getRecommendations(profile)
      .slice(0, 2)
      .map((r) => r.program)
  }, [profile, comparedIds])

  const steps = useMemo(() => buildRoadmap(profile, topPrograms), [profile, topPrograms])
  const nextStep = steps.find((s) => !completedSteps.includes(s.id))
  const progress = steps.length === 0 ? 0 : Math.round((completedSteps.filter((id) => steps.some((s) => s.id === id)).length / steps.length) * 100)

  return (
    <div>
      <SectionTitle
        eyebrow="Шаг 6 из 6"
        title="Ваш маршрут поступления"
        description={`Построен на основе профиля и ${topPrograms.length > 1 ? 'выбранных программ' : `программы ${topPrograms[0]?.university ?? ''}`}.`}
      />

      <div className="card mb-6 flex flex-col gap-4 border-accent/30 bg-accent-soft/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Следующий шаг</p>
          {nextStep ? (
            <>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{nextStep.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{nextStep.detail}</p>
            </>
          ) : (
            <p className="mt-1 font-display text-lg font-semibold text-ink">Все шаги выполнены — отличная работа!</p>
          )}
        </div>
        {nextStep && (
          <Button onClick={() => toggleStepCompleted(nextStep.id)} className="shrink-0">
            Отметить выполненным
          </Button>
        )}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="shrink-0 text-sm font-medium text-ink-soft">{progress}% пройдено</span>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const categorySteps = steps.filter((s) => s.category === category)
          if (categorySteps.length === 0) return null
          return (
            <div key={category} className="card p-5 sm:p-6">
              <h2 className="mb-3 font-display text-lg font-semibold">{category}</h2>
              <ul className="space-y-3">
                {categorySteps.map((step) => {
                  const done = completedSteps.includes(step.id)
                  return (
                    <li key={step.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleStepCompleted(step.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#4F3FF0]"
                      />
                      <div className={done ? 'opacity-50' : ''}>
                        <p className={`font-medium text-ink ${done ? 'line-through' : ''}`}>{step.title}</p>
                        <p className="text-sm text-ink-soft">{step.detail}</p>
                        <Badge tone="primary">{step.period}</Badge>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate('/recommendations')}>
          ← К рекомендациям
        </Button>
        <Button variant="secondary" onClick={() => navigate('/profile')}>
          Изменить анкету и обновить маршрут
        </Button>
      </div>
    </div>
  )
}
