import docText from '../../../../public/icons/doc-text.svg?raw'
import docCopy from '../../../../public/icons/doc-copy.svg?raw'
import docZip from '../../../../public/icons/doc-zip.svg?raw'
import docLock from '../../../../public/icons/doc-lock.svg?raw'
import docStack from '../../../../public/icons/doc-stack.svg?raw'

const ICONS = {
  doc: docText,
  sheet: docCopy,
  zip: docZip,
  lock: docLock,
  stack: docStack,
}

function markup(svg) {
  return svg.replace(/\sstyle="[^"]*"/, '').replace('<svg ', '<svg aria-hidden="true" ')
}

export function SectionIcon({ name }) {
  return <span dangerouslySetInnerHTML={{ __html: markup(ICONS[name] || docText) }} />
}
