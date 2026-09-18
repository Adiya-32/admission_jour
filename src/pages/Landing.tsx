import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { useApp } from '../state/AppContext'

export function Landing() {
  const navigate = useNavigate()
  const { profileCompleted } = useApp()

  return (
    <div className="grid gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
      <div>
        <span className="mb-4 inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-dark">
          Персональный маршрут поступления
        </span>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Не список вузов, а понятный путь к поступлению
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Компас за 5 минут анкеты соберёт ваш профиль, объяснит, какие программы подходят именно вам и почему, и
          построит пошаговый план — что делать сегодня, а что через месяц.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate('/profile')}>{profileCompleted ? 'Обновить анкету' : 'Начать за 5 минут'}</Button>
          {profileCompleted && (
            <Button variant="secondary" onClick={() => navigate('/recommendations')}>
              К моим рекомендациям
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {[
          { n: '1', t: 'Анкета', d: 'Класс, интересы, оценки, языки, бюджет и сроки' },
          { n: '2', t: 'Диагностика', d: 'Понятное резюме сильных сторон и ограничений' },
          { n: '3', t: 'Рекомендации', d: 'Минимум 3 программы с объяснением «почему подходит»' },
          { n: '4', t: 'Маршрут', d: 'Экзамены, документы, дедлайны и следующий шаг' },
        ].map((item) => (
          <div key={item.n} className="card flex items-start gap-4 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-semibold text-primary-dark">
              {item.n}
            </span>
            <div>
              <p className="font-semibold text-ink">{item.t}</p>
              <p className="text-sm text-ink-soft">{item.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
