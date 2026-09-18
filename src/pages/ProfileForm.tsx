import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import type { Profile } from '../types'
import { COUNTRIES, ENGLISH_LEVELS, INTERESTS, LANGUAGES, SPECIALIZATIONS } from '../data/constants'
import { Button, Chip, SectionTitle } from '../components/ui'
import { getRecommendations } from '../engine/recommend'

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export function ProfileForm() {
  const { profile, submitProfile } = useApp()
  const [draft, setDraft] = useState<Profile>(profile)
  const navigate = useNavigate()

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function handleSubmit() {
    const prevTop = getRecommendations(profile)
      .slice(0, 8)
      .map((r) => r.program.id)
    submitProfile(draft, prevTop)
    navigate('/diagnosis')
  }

  const canSubmit = draft.interests.length > 0 && draft.name.trim().length > 0

  return (
    <div>
      <SectionTitle
        eyebrow="Шаг 2 из 6"
        title="Расскажите о себе"
        description="Эти ответы формируют вашу диагностику и рекомендации. Их можно изменить в любой момент."
      />

      <div className="space-y-10">
        {/* Basics */}
        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Основное</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Имя</span>
              <input
                value={draft.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Как к вам обращаться"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Класс</span>
              <select
                value={draft.grade}
                onChange={(e) => update('grade', e.target.value as Profile['grade'])}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              >
                {['9', '10', '11', 'выпускник'].map((g) => (
                  <option key={g} value={g}>
                    {g === 'выпускник' ? 'Выпускник школы' : `${g} класс`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Когда планируете поступать?</span>
            <div className="flex flex-wrap gap-2">
              {(['в этом году', 'через год', 'через 2+ года'] as const).map((t) => (
                <Chip key={t} active={draft.timeline === t} onClick={() => update('timeline', t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </label>
        </section>

        {/* Interests */}
        <section className="card p-5 sm:p-6">
          <h2 className="mb-1 font-display text-lg font-semibold">Интересы</h2>
          <p className="mb-4 text-sm text-ink-soft">Выберите одно или несколько направлений</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <Chip key={interest} active={draft.interests.includes(interest)} onClick={() => update('interests', toggleInArray(draft.interests, interest))}>
                {interest}
              </Chip>
            ))}
          </div>

          {draft.interests.some((i) => SPECIALIZATIONS[i]) && (
            <div className="mt-5 space-y-4 border-t border-border pt-4">
              <p className="text-sm text-ink-soft">
                Уточните фокус внутри интересов — так рекомендации будут точнее, а не просто «по широкому направлению»
              </p>
              {draft.interests
                .filter((i) => SPECIALIZATIONS[i])
                .map((interest) => (
                  <div key={interest}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">{interest}</p>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALIZATIONS[interest].map((spec) => (
                        <Chip
                          key={spec}
                          active={draft.specializations.includes(spec)}
                          onClick={() => update('specializations', toggleInArray(draft.specializations, spec))}
                        >
                          {spec}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Academics */}
        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Успеваемость и языки</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex justify-between text-sm font-medium text-ink-soft">
                <span>Средний балл</span>
                <span className="text-ink">{draft.gpa.toFixed(1)} / 5.0</span>
              </span>
              <input
                type="range"
                min={2.5}
                max={5}
                step={0.1}
                value={draft.gpa}
                onChange={(e) => update('gpa', Number(e.target.value))}
                className="w-full accent-[#4F3FF0]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Уровень английского</span>
              <select
                value={draft.englishLevel}
                onChange={(e) => update('englishLevel', e.target.value as Profile['englishLevel'])}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              >
                {ENGLISH_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Языки</span>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <Chip key={lang} active={draft.languages.includes(lang)} onClick={() => update('languages', toggleInArray(draft.languages, lang))}>
                  {lang}
                </Chip>
              ))}
            </div>
          </label>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Результат ЕНТ (если сдавали, из 140)</span>
              <input
                type="number"
                min={0}
                max={140}
                value={draft.exams.ent ?? ''}
                onChange={(e) => update('exams', { ...draft.exams, ent: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Например, 95"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Результат IELTS (если сдавали)</span>
              <input
                type="number"
                min={0}
                max={9}
                step={0.5}
                value={draft.exams.ielts ?? ''}
                onChange={(e) => update('exams', { ...draft.exams, ielts: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Например, 6.0"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
        </section>

        {/* Countries & budget */}
        <section className="card p-5 sm:p-6">
          <h2 className="mb-1 font-display text-lg font-semibold">Страны и бюджет</h2>
          <p className="mb-4 text-sm text-ink-soft">Не выбирайте страну — если готовы рассматривать любую</p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((country) => (
              <Chip key={country} active={draft.countries.includes(country)} onClick={() => update('countries', toggleInArray(draft.countries, country))}>
                {country}
              </Chip>
            ))}
          </div>
          <label className="mt-5 block">
            <span className="mb-1.5 flex justify-between text-sm font-medium text-ink-soft">
              <span>Бюджет на обучение</span>
              <span className="text-ink">до ${draft.budgetUSD.toLocaleString('ru-RU')}/год</span>
            </span>
            <input
              type="range"
              min={0}
              max={18000}
              step={500}
              value={draft.budgetUSD}
              onChange={(e) => update('budgetUSD', Number(e.target.value))}
              className="w-full accent-[#4F3FF0]"
            />
          </label>
          <div className="mt-5 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <input type="checkbox" checked={draft.scholarshipNeeded} onChange={(e) => update('scholarshipNeeded', e.target.checked)} className="h-4 w-4 accent-[#4F3FF0]" />
              Важна стипендия/грант
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <input type="checkbox" checked={draft.dormNeeded} onChange={(e) => update('dormNeeded', e.target.checked)} className="h-4 w-4 accent-[#4F3FF0]" />
              Нужно общежитие
            </label>
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          Получить диагностику →
        </Button>
      </div>
      {!canSubmit && <p className="mt-2 text-right text-xs text-ink-soft">Заполните имя и хотя бы один интерес</p>}
    </div>
  )
}
