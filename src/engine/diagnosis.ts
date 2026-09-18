import type { Profile } from '../types'

export interface DiagnosisResult {
  summary: string
  strengths: string[]
  constraints: string[]
  goal: string
}

export function buildDiagnosis(profile: Profile): DiagnosisResult {
  const strengths: string[] = []
  const constraints: string[] = []

  if (profile.gpa >= 4.5) strengths.push(`Высокий средний балл (${profile.gpa}/5) — открывает доступ к сильным грантам`)
  else if (profile.gpa < 3.5) constraints.push(`Средний балл (${profile.gpa}/5) может ограничить конкурс на бюджет — стоит подтянуть оценки`)

  if (profile.englishLevel === 'C1+' || profile.englishLevel === 'B2') {
    strengths.push(`Уровень английского (${profile.englishLevel}) достаточен для большинства англоязычных программ`)
  } else {
    constraints.push(`Уровень английского (${profile.englishLevel}) стоит повысить для программ с высоким порогом IELTS`)
  }

  if (profile.budgetUSD >= 5000) strengths.push('Бюджет позволяет рассматривать платные программы без стипендии')
  else constraints.push('Ограниченный бюджет — в приоритете гранты, бесплатные программы и стипендии')

  if (profile.interests.length === 0) constraints.push('Не выбрано ни одного направления интересов — рекомендации будут менее точными')
  else strengths.push(`Есть чёткий интерес: ${profile.interests.join(', ')}`)

  if (profile.timeline !== 'в этом году') constraints.push('Времени до поступления больше года — есть возможность усилить профиль')

  const countryText = profile.countries.length > 0 ? profile.countries.join(', ') : 'страна пока не выбрана'
  const goal = `Поступить на программу по направлению «${profile.interests[0] ?? 'не выбрано'}» ${
    profile.timeline === 'в этом году' ? 'в этом году' : profile.timeline
  }, рассматривая: ${countryText}, бюджет до $${profile.budgetUSD.toLocaleString('ru-RU')}/год.`

  const summary = `${profile.name || 'Абитуриент'}, ${profile.grade === 'выпускник' ? 'выпускник школы' : `${profile.grade} класс`}. Средний балл ${profile.gpa}/5, английский — ${profile.englishLevel}. Планирует поступление ${profile.timeline}.`

  return { summary, strengths, constraints, goal }
}
