export function vndCrumbs(current = false) {
  return [
    { label: 'Главная страница', to: '/' },
    { label: 'База знаний', to: '/' },
    { label: 'Внутренний нормативный документ', to: current ? undefined : '/vnd' },
  ]
}
