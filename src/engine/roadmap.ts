import type { Profile, Program, RoadmapStep } from '../types'

export function buildRoadmap(profile: Profile, topPrograms: Program[]): RoadmapStep[] {
  const steps: RoadmapStep[] = []
  const primary = topPrograms[0]

  steps.push({
    id: 'exam-ent',
    category: 'Экзамены',
    title: 'Зарегистрироваться и сдать ЕНТ (или профильный экзамен вуза)',
    detail: 'Проверьте пороговые баллы у выбранных программ и запишитесь на ближайшую дату экзамена.',
    period: 'Ближайшие 1–2 месяца',
  })

  const needsIELTS = topPrograms.some((p) => p.minIELTS)
  if (needsIELTS && profile.englishLevel !== 'C1+') {
    steps.push({
      id: 'exam-ielts',
      category: 'Экзамены',
      title: 'Подготовиться и сдать IELTS/TOEFL',
      detail: `У части программ в вашем списке порог от ${Math.min(
        ...topPrograms.filter((p) => p.minIELTS).map((p) => p.minIELTS as number)
      )} баллов IELTS. Запланируйте курсы подготовки.`,
      period: 'Ближайшие 2–3 месяца',
    })
  }

  steps.push({
    id: 'docs-collect',
    category: 'Документы',
    title: 'Собрать пакет документов',
    detail: 'Аттестат, результаты экзаменов, мотивационное письмо, рекомендации — начните готовить заранее.',
    period: 'Ближайший месяц',
  })

  if (primary) {
    steps.push({
      id: `deadline-${primary.id}`,
      category: 'Дедлайны',
      title: `Подать заявку в ${primary.university}`,
      detail: `Ориентировочное окно приёма заявок: ${primary.deadlineWindow}. Уточните точную дату на официальном сайте.`,
      period: primary.deadlineWindow,
      programId: primary.id,
    })
  }

  if (profile.scholarshipNeeded) {
    steps.push({
      id: 'scholarship-apply',
      category: 'Дедлайны',
      title: 'Подать заявку на стипендию/грант',
      detail: 'Для программ со стипендией — отдельная заявка часто открывается раньше основного набора.',
      period: 'Проверить индивидуально по вузу',
    })
  }

  steps.push({
    id: 'academic-strengthen',
    category: 'Академические шаги',
    title: 'Подтянуть профильные предметы',
    detail: `Сфокусируйтесь на предметах, связанных с направлением «${profile.interests[0] ?? 'вашим интересом'}» — они чаще всего входят в профильные экзамены.`,
    period: 'Постоянно до поступления',
  })

  steps.push({
    id: 'activity-portfolio',
    category: 'Активности',
    title: 'Усилить портфолио активностей',
    detail: 'Олимпиады, проекты, волонтёрство или стажировки по вашему направлению повышают шанс на стипендию.',
    period: 'Постоянно до поступления',
  })

  if (primary && primary.fields.includes('Дизайн и искусство')) {
    steps.push({
      id: 'portfolio-design',
      category: 'Активности',
      title: 'Собрать творческое портфолио',
      detail: 'Для творческих направлений почти всегда требуется портфолио работ — начните собирать заранее.',
      period: 'Ближайшие 2 месяца',
    })
  }

  return steps
}
