import { buttonClass } from '../model/buttonClass.js'

export function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return <button type={type} className={[buttonClass(variant), className].filter(Boolean).join(' ')} {...props} />
}
