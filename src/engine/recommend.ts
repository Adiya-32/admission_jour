import { PROGRAMS } from '../data/programs'
import type { Profile, Program, Recommendation, RecommendationReason } from '../types'

const ENGLISH_RANK: Record<string, number> = { 'A1-A2': 1, B1: 2, B2: 3, 'C1+': 4 }

function englishMeetsIELTS(level: string, minIELTS?: number): boolean {
  if (!minIELTS) return true
  const rank = ENGLISH_RANK[level] ?? 1
  if (minIELTS <= 5.0) return rank >= 1
  if (minIELTS <= 6.0) return rank >= 2
  if (minIELTS <= 6.5) return rank >= 3
  return rank >= 4
}

function scoreProgram(profile: Profile, program: Program): { score: number; reasons: RecommendationReason[] } {
  const reasons: RecommendationReason[] = []
  let score = 0

  // Field match — 20, + бонус за совпадение уточняющей специализации — 10
  const matchedFields = program.fields.filter((f) => profile.interests.includes(f))
  if (matchedFields.length > 0) {
    const points = Math.min(20, matchedFields.length * 12)
    score += points
    reasons.push({ type: 'match', text: `Совпадает с вашим интересом: ${matchedFields.join(', ')}` })
  } else if (profile.interests.length > 0) {
    reasons.push({ type: 'caution', text: 'Направление не входит в список ваших интересов' })
  }

  const matchedSpecializations = (program.specializations ?? []).filter((s) => profile.specializations.includes(s))
  if (matchedSpecializations.length > 0) {
    score += Math.min(10, matchedSpecializations.length * 6)
    reasons.push({ type: 'match', text: `Совпадает с уточнённым фокусом: ${matchedSpecializations.join(', ')}` })
  } else if (profile.specializations.length > 0 && matchedFields.length > 0) {
    reasons.push({ type: 'caution', text: 'Не совпадает с уточнённой специализацией, которую вы выбрали' })
  }

  // Budget — 18
  if (program.tuitionUSD <= profile.budgetUSD) {
    score += 18
    if (program.tuitionUSD === 0) {
      reasons.push({ type: 'match', text: 'Обучение бесплатное или полностью покрывается грантом' })
    } else {
      reasons.push({
        type: 'match',
        text: `Укладывается в бюджет: $${program.tuitionUSD.toLocaleString('ru-RU')}/год при лимите $${profile.budgetUSD.toLocaleString('ru-RU')}`,
      })
    }
  } else if (program.scholarshipAvailable) {
    score += 7
    reasons.push({
      type: 'caution',
      text: `Стоимость выше бюджета ($${program.tuitionUSD.toLocaleString('ru-RU')}/год), но доступны стипендии — стоит подать заявку на них`,
    })
  } else {
    reasons.push({
      type: 'caution',
      text: `Стоимость превышает ваш бюджет ($${program.tuitionUSD.toLocaleString('ru-RU')}/год)`,
    })
  }

  // Country — 27 (сильный вес: если страны явно выбраны, несовпадение ощутимо понижает рейтинг)
  if (profile.countries.length === 0) {
    score += 13
  } else if (profile.countries.includes(program.country)) {
    score += 27
    reasons.push({ type: 'match', text: `Страна в вашем списке предпочтений: ${program.country}` })
  } else {
    score -= 8
    reasons.push({ type: 'caution', text: `${program.country} не входит в выбранные вами страны` })
  }

  // Readiness: English/GPA/ENT — 17
  let readiness = 0
  const readinessMax = 17
  const parts: string[] = []
  const cautionParts: string[] = []

  if (englishMeetsIELTS(profile.englishLevel, program.minIELTS)) {
    readiness += 7
    if (program.minIELTS) parts.push(`уровень английского достаточен для требования IELTS ${program.minIELTS}`)
  } else if (program.minIELTS) {
    cautionParts.push(`нужен более высокий английский (обычно IELTS от ${program.minIELTS})`)
  }

  if (program.minGPA === undefined || profile.gpa >= program.minGPA) {
    readiness += 6
    if (program.minGPA) parts.push(`средний балл ${profile.gpa} соответствует порогу ${program.minGPA}`)
  } else {
    cautionParts.push(`средний балл ниже желаемого порога (${program.minGPA})`)
  }

  if (profile.exams.ent === undefined || program.minENT === undefined || profile.exams.ent >= program.minENT) {
    readiness += 4
  } else {
    cautionParts.push(`результат ЕНТ ниже ориентировочного порога (${program.minENT})`)
  }

  score += readiness
  if (parts.length > 0) reasons.push({ type: 'match', text: `Готовность подтверждена: ${parts.join('; ')}` })
  if (cautionParts.length > 0) reasons.push({ type: 'caution', text: `Стоит подтянуть: ${cautionParts.join('; ')}` })
  if (readiness === readinessMax) {
    // already covered above
  }

  // Timeline / deadlines — 10
  if (profile.timeline === 'в этом году') {
    score += 10
    reasons.push({ type: 'match', text: `Дедлайны (${program.deadlineWindow}) актуальны для поступления в этом году` })
  } else {
    score += 6
  }

  // Dorm / scholarship soft preferences
  if (profile.dormNeeded && program.dormitory) {
    reasons.push({ type: 'match', text: 'Есть общежитие — важный для вас критерий' })
  } else if (profile.dormNeeded && !program.dormitory) {
    reasons.push({ type: 'caution', text: 'Общежития нет, нужно искать съёмное жильё' })
  }
  if (profile.scholarshipNeeded && program.scholarshipAvailable) {
    reasons.push({ type: 'match', text: 'Доступны стипендии — вы отметили, что это важно' })
  } else if (profile.scholarshipNeeded && !program.scholarshipAvailable) {
    reasons.push({ type: 'caution', text: 'Стипендии для иностранцев обычно не предоставляются' })
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), reasons }
}

export function getRecommendations(profile: Profile, previousTopIds: string[] = []): Recommendation[] {
  const scored = PROGRAMS.map((program) => {
    const { score, reasons } = scoreProgram(profile, program)
    return { program, score, reasons }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.map((item, index) => ({
    ...item,
    isNew: index < 8 && !previousTopIds.includes(item.program.id),
  }))
}
