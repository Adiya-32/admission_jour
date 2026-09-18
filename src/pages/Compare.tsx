import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { PROGRAMS } from '../data/programs'
import { Button, SectionTitle } from '../components/ui'

const ROWS: { label: string; render: (p: (typeof PROGRAMS)[number]) => string }[] = [
  { label: 'Страна и город', render: (p) => `${p.country}, ${p.city}` },
  { label: 'Направления', render: (p) => p.fields.join(', ') },
  { label: 'Стоимость в год', render: (p) => (p.tuitionUSD === 0 ? 'Бесплатно / грант' : `$${p.tuitionUSD.toLocaleString('ru-RU')}`) },
  { label: 'Язык обучения', render: (p) => p.languageOfInstruction.join(', ') },
  { label: 'Мин. IELTS', render: (p) => (p.minIELTS ? String(p.minIELTS) : '—') },
  { label: 'Мин. средний балл', render: (p) => (p.minGPA ? `${p.minGPA} / 5` : '—') },
  { label: 'Требуемые экзамены', render: (p) => p.examsRequired.join('; ') },
  { label: 'Окно дедлайнов', render: (p) => p.deadlineWindow },
  { label: 'Стипендии', render: (p) => (p.scholarshipAvailable ? 'Доступны' : 'Обычно нет') },
  { label: 'Общежитие', render: (p) => (p.dormitory ? 'Есть' : 'Нет') },
  { label: 'Селективность', render: (p) => `${p.selectivityLevel} (${p.selectivityNote})` },
  { label: 'Репутация', render: (p) => p.reputation },
  { label: 'Сильная сторона', render: (p) => p.whyChosen[0] },
  { label: 'На что обратить внимание', render: (p) => p.weaknesses[0] },
  { label: 'Кампус', render: (p) => p.vibe },
]

export function Compare() {
  const { comparedIds } = useApp()
  const navigate = useNavigate()
  const programs = PROGRAMS.filter((p) => comparedIds.includes(p.id))

  if (programs.length < 2) {
    return (
      <div>
        <SectionTitle eyebrow="Шаг 5 из 6" title="Сравнение" description="Выберите минимум два варианта на странице рекомендаций." />
        <Button onClick={() => navigate('/recommendations')}>← К рекомендациям</Button>
      </div>
    )
  }

  return (
    <div>
      <SectionTitle eyebrow="Шаг 5 из 6" title="Сравнение вариантов" description="Сопоставьте ключевые параметры перед тем, как выбрать программу для маршрута." />

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-primary-soft/50">
              <th className="sticky left-0 bg-primary-soft/50 px-4 py-3 text-left font-semibold text-ink-soft">Параметр</th>
              {programs.map((p) => (
                <th key={p.id} className="px-4 py-3 text-left font-display font-semibold text-ink">
                  {p.university}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-bg/60'}>
                <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-ink-soft">{row.label}</td>
                {programs.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-ink">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate('/recommendations')}>
          ← К рекомендациям
        </Button>
        <Button onClick={() => navigate('/roadmap')}>Построить маршрут →</Button>
      </div>
    </div>
  )
}
