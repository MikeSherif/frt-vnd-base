import styles from './OptionGroup.module.css'
import { toggleOption } from '../model/toggleOption.js'

export function OptionGroup({ label, options, value, onChange }) {
  return (
    <fieldset className={styles.group}>
      <legend>{label}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.id}>
            <input
              type="checkbox"
              checked={value.includes(option.id)}
              onChange={() => onChange(toggleOption(value, option.id))}
            />
            {option.label ?? option.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
