import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { buildDiagnosis } from '../engine/diagnosis'
import { Button, SectionTitle } from '../components/ui'

export function Diagnosis() {
  const { profile } = useApp()
  const navigate = useNavigate()
  const diagnosis = buildDiagnosis(profile)

  return (
    <div>
      <SectionTitle eyebrow="Шаг 3 из 6" title="Ваша диагностика" description={diagnosis.summary} />

      <div className="card mb-6 border-primary/20 bg-primary-soft/40 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">Образовательная цель</p>
        <p className="mt-1.5 text-ink">{diagnosis.goal}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h2 className="mb-3 font-display text-lg font-semibold text-success">Сильные стороны</h2>
          {diagnosis.strengths.length === 0 ? (
            <p className="text-sm text-ink-soft">Пока не выявлено — заполните профиль подробнее.</p>
          ) : (
            <ul className="space-y-2.5">
              {diagnosis.strengths.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink">
                  <span className="mt-0.5 text-success">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="mb-3 font-display text-lg font-semibold text-warning">Ограничения и зоны роста</h2>
          {diagnosis.constraints.length === 0 ? (
            <p className="text-sm text-ink-soft">Существенных ограничений не выявлено.</p>
          ) : (
            <ul className="space-y-2.5">
              {diagnosis.constraints.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink">
                  <span className="mt-0.5 text-warning">!</span>
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate('/profile')}>
          ← Изменить анкету
        </Button>
        <Button onClick={() => navigate('/recommendations')}>Показать рекомендации →</Button>
      </div>
    </div>
  )
}
