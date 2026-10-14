export const DOCUMENT_KINDS = [
  { id: 'order', label: 'Порядок' },
  { id: 'regulation', label: 'Положение' },
  { id: 'reglament', label: 'Регламент' },
  { id: 'method', label: 'Методика' },
  { id: 'instruction', label: 'Инструкция' },
  { id: 'guidelines', label: 'Методические указания' },
  { id: 'recommendations', label: 'Методические рекомендации' },
  { id: 'other', label: 'Иное' },
]

export const STATUSES = [
  { id: 'active', label: 'Действует' },
  { id: 'archived', label: 'Утратил силу' },
]

export const RELEVANCE = [
  { id: 'unchecked', label: 'Не проверено' },
  { id: 'checked', label: 'Проверено' },
  { id: 'needs_review', label: 'Требуется проверка' },
  { id: 'needs_change', label: 'Требуется изменение' },
]

export const VND_LINK_ROLES = [
  { id: 'sets_order', label: 'Устанавливает порядок' },
  { id: 'applied_together', label: 'Применяется совместно' },
  { id: 'changes', label: 'Изменяет' },
  { id: 'replaces', label: 'Заменяет' },
  { id: 'references', label: 'Ссылается' },
]

export const FUNCTION_ROLES = [
  { id: 'controls', label: 'Контролирует' },
  { id: 'executes', label: 'Выполняет' },
]

export const RELEVANCE_EVENT_TYPES = [
  { id: 'new_revision', label: 'Размещена новая редакция' },
  { id: 'confirmed', label: 'Актуальность подтверждена' },
  { id: 'planned_check', label: 'Плановая проверка' },
]

export const PRESETS = [
  { id: 'all', label: 'Всего ВНД', hint: 'Опубликованные карточки' },
  { id: 'active', label: 'Действуют', hint: 'Есть редакция на сегодня' },
  { id: 'archived', label: 'Утратили силу', hint: 'Действие всего документа прекращено' },
  { id: 'review', label: 'Требуют проверки', hint: 'Без проверки, срок наступил или нужно изменение' },
  { id: 'updated30', label: 'Обновлены за 30 дней', hint: 'Новая содержательная редакция' },
]

export const PAGE_SIZES = [20, 50, 100]
export const FILE_LIMIT_BYTES = 50 * 1024 * 1024
export const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'xls', 'png', 'jpg', 'jpeg', 'webp']

export const DEPARTMENTS = [
  { id: 'sva', name: 'Служба внутреннего аудита' },
  { id: 'dbu', name: 'Департамент бухгалтерского учёта' },
  { id: 'dup', name: 'Департамент управления персоналом' },
  { id: 'law', name: 'Юридический департамент' },
  { id: 'dit', name: 'Департамент информационных технологий' },
  { id: 'staff', name: 'Аппарат Фонда' },
]

export const FUNCTIONS = [
  { id: 'risk', name: 'Управление рисками', level: 1 },
  { id: 'risk-id', name: 'Идентификация рисков', level: 2, parentId: 'risk' },
  { id: 'account', name: 'Бухгалтерский учёт', level: 1 },
  { id: 'account-fa', name: 'Учёт основных средств', level: 2, parentId: 'account' },
  { id: 'hr', name: 'Кадровое администрирование', level: 1 },
  { id: 'hr-hire', name: 'Приём работников', level: 2, parentId: 'hr' },
  { id: 'procurement', name: 'Закупки', level: 1 },
]

export function labelOf(list, id) {
  if (!id) return '—'
  return list.find((item) => item.id === id)?.label ?? '—'
}

export function departmentName(id) {
  if (!id) return 'не назначен'
  return DEPARTMENTS.find((item) => item.id === id)?.name ?? 'не назначен'
}

export function functionById(id) {
  return FUNCTIONS.find((item) => item.id === id) ?? null
}

export function functionName(id) {
  return functionById(id)?.name ?? 'Функция недоступна'
}
