export type Grade = '9' | '10' | '11' | 'выпускник'

export type EnglishLevel = 'A1-A2' | 'B1' | 'B2' | 'C1+'

export interface ExamScores {
  ent?: number // ЕНТ, из 140
  ielts?: number // 0-9
  toefl?: number // 0-120
  sat?: number // 400-1600
}

export interface Profile {
  name: string
  grade: Grade
  interests: string[]
  gpa: number // из 5.0
  englishLevel: EnglishLevel
  languages: string[]
  exams: ExamScores
  countries: string[]
  budgetUSD: number // в год
  timeline: 'в этом году' | 'через год' | 'через 2+ года'
  scholarshipNeeded: boolean
  dormNeeded: boolean
}

export const emptyProfile: Profile = {
  name: '',
  grade: '11',
  interests: [],
  gpa: 4.0,
  englishLevel: 'B1',
  languages: ['Русский'],
  exams: {},
  countries: [],
  budgetUSD: 5000,
  timeline: 'в этом году',
  scholarshipNeeded: false,
  dormNeeded: false,
}

export interface Program {
  id: string
  university: string
  program: string
  country: string
  city: string
  fields: string[]
  tuitionUSD: number // 0 = полностью бесплатно/грант
  minIELTS?: number
  minGPA?: number
  minENT?: number
  examsRequired: string[]
  deadlineWindow: string
  scholarshipAvailable: boolean
  dormitory: boolean
  languageOfInstruction: string[]
  description: string
  strengths: string[]
  website: string
  dataNote: string
}

export interface RecommendationReason {
  type: 'match' | 'caution'
  text: string
}

export interface Recommendation {
  program: Program
  score: number
  reasons: RecommendationReason[]
  isNew?: boolean
}

export type RoadmapCategory = 'Экзамены' | 'Документы' | 'Дедлайны' | 'Академические шаги' | 'Активности'

export interface RoadmapStep {
  id: string
  category: RoadmapCategory
  title: string
  detail: string
  period: string
  programId?: string
}
