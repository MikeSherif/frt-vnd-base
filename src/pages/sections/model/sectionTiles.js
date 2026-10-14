export function sectionTiles(vndCount) {
  return [
    { id: 'vnd', title: 'Внутренний нормативный документ', count: vndCount, to: '/vnd', icon: 'doc' },
    { id: 'ssp', title: 'Положение о ССП', count: 201, icon: 'sheet' },
    { id: 'npa', title: 'Блок-схемы по НПА', count: 24, icon: 'zip' },
    {
      id: 'orders',
      title: 'Приказы и распоряжения генерального директора и руководителей первой линейки',
      count: 456,
      icon: 'lock',
    },
    { id: 'tzf', title: 'ТЗФ. Внутренний нормативный документ', count: 43, icon: 'stack' },
  ]
}
