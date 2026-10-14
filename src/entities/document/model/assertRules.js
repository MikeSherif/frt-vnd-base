import { todayIso } from '../../../shared/lib/dates.js'
import { EMPTY_FILTERS, filterDocuments } from './filters.js'
import { computeMetrics, isActing, isUpdatedWithin30, needsReview } from './metrics.js'
import { hasPeriodOverlap, resolveRevision } from './revisions.js'
import { buildSeed } from './seed.js'
import { validatePublication } from './validate.js'

export function assertRules(now = new Date()) {
  const today = todayIso(now)
  const documents = buildSeed(now)
  const problems = []
  const check = (condition, message) => {
    if (!condition) problems.push(message)
  }
  const byId = (id) => documents.find((document) => document.id === id)

  check(isActing(byId('vnd-001'), today), 'ВНД-001 должен действовать')
  check(isUpdatedWithin30(byId('vnd-001'), today), 'ВНД-001 должен попасть в обновления за 30 дней')
  check(!needsReview(byId('vnd-001'), today), 'ВНД-001 не должен требовать проверки')
  check(needsReview(byId('vnd-004'), today), 'Непроверенный действующий ВНД должен требовать проверки')
  check(needsReview(byId('vnd-013'), today), 'Наступивший срок проверки должен требовать проверки')
  check(isActing(byId('vnd-010'), today) && !isUpdatedWithin30(byId('vnd-010'), today), 'Замена файла не считается обновлением содержания')
  check(!isActing(byId('vnd-006'), today), 'Будущий документ не действует сегодня')
  check(!isActing(byId('vnd-007'), today), 'Документ без периода не действует')
  check(!isActing(byId('vnd-008'), today), 'Документ без владельца не входит в «Действуют»')
  check(byId('vnd-005').status === 'archived', 'ВНД-005 архивный')
  check(!isActing(byId('vnd-009'), today) && byId('vnd-009').status !== 'archived', 'Закончившийся период без архива не суммируется в две группы')

  const metrics = computeMetrics(documents, now)
  check(metrics.active + metrics.archived < metrics.total, 'Сумма действующих и архивных меньше общего числа')

  const presetKey = { all: 'total', active: 'active', archived: 'archived', review: 'review', updated30: 'updated' }
  Object.entries(presetKey).forEach(([preset, key]) => {
    const found = filterDocuments(documents, { ...EMPTY_FILTERS, preset }, today).length
    check(found === metrics[key], `Выборка «${preset}» (${found}) не равна показателю (${metrics[key]})`)
  })

  const narrowed = filterDocuments(documents, { ...EMPTY_FILTERS, kind: ['order'], owner: ['sva'] }, today)
  check(narrowed.length > 0 && narrowed.every((document) => document.kind === 'order' && document.ownerDeptId === 'sva'), 'Разные фильтры применяются вместе')
  const widened = filterDocuments(documents, { ...EMPTY_FILTERS, kind: ['order', 'method'] }, today)
  check(widened.every((document) => document.kind === 'order' || document.kind === 'method'), 'Несколько значений одного фильтра расширяют выборку')

  const gap = resolveRevision(byId('vnd-012').revisions, '2023-05-01')
  check(!gap.revision && Boolean(gap.reason), 'На дату разрыва нельзя показывать соседнюю редакцию')
  check(resolveRevision(byId('vnd-012').revisions, '2022-12-31').revision?.number === 1, 'Окончание периода включается')
  check(resolveRevision(byId('vnd-012').revisions, today).revision?.number === 2, 'Будущая на момент публикации редакция стала текущей')

  check(
    hasPeriodOverlap([
      { effectiveFrom: '2020-01-01', effectiveTo: '2021-01-01' },
      { effectiveFrom: '2021-01-01', effectiveTo: null },
    ]),
    'Совпадающий день периодов — пересечение',
  )
  check(
    !hasPeriodOverlap([
      { effectiveFrom: '2020-01-01', effectiveTo: '2020-12-31' },
      { effectiveFrom: '2021-01-01', effectiveTo: null },
    ]),
    'Периоды встык без общего дня допустимы',
  )

  const valid = {
    fullTitle: 'Тестовый порядок',
    kind: 'order',
    adoptedAt: '2024-01-01',
    publishedAt: '2024-01-02',
    ownerDeptId: 'sva',
    responsible: 'Иванов И.И.',
    overlapConfirmed: false,
    published: true,
    revisions: [
      {
        number: 1,
        effectiveFrom: '2024-01-10',
        effectiveTo: null,
        confirmedStart: true,
        incomplete: false,
        file: { id: 'a', name: 'a.pdf', size: 10, hash: 'h1' },
        basisFile: { id: 'b', name: 'b.pdf', size: 10, hash: 'h2' },
      },
    ],
  }
  check(validatePublication(valid).length === 0, `Полная карточка не должна блокироваться: ${validatePublication(valid).join('; ')}`)
  check(validatePublication({}).length >= 5, 'Пустая карточка блокируется')

  const overlap = {
    ...valid,
    revisions: [
      valid.revisions[0],
      {
        ...valid.revisions[0],
        number: 2,
        file: { id: 'c', name: 'c.pdf', size: 10, hash: 'h3' },
        basisFile: { id: 'd', name: 'd.pdf', size: 10, hash: 'h4' },
      },
    ],
  }
  check(validatePublication(overlap).some((error) => error.includes('пересека')), 'Неподтверждённое пересечение блокирует публикацию')
  check(
    validatePublication({ ...overlap, overlapConfirmed: true }).every((error) => !error.includes('пересека')),
    'Подтверждённое пересечение снимает блокировку по периодам',
  )

  const changedDate = { ...valid, adoptedAt: '2024-02-01' }
  check(
    validatePublication(changedDate, { previous: valid }).some((error) => error.includes('подтвердить')),
    'Исправление опубликованной даты требует подтверждения',
  )
  check(
    validatePublication(changedDate, { previous: valid, dateChangeConfirmed: true }).every((error) => !error.includes('подтвердить')),
    'Подтверждённая правка даты проходит',
  )

  if (problems.length) {
    throw new Error(`Правила ВНД не сходятся:\n${problems.join('\n')}`)
  }
}
