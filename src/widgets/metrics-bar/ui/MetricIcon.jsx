import docText from '../../../../public/icons/doc-text.svg?raw'
import docCheck from '../../../../public/icons/doc-check.svg?raw'
import docDownload from '../../../../public/icons/doc-download.svg?raw'
import docSearch from '../../../../public/icons/doc-search.svg?raw'
import docEdit from '../../../../public/icons/doc-edit.svg?raw'

const ICONS = {
  all: docText,
  active: docCheck,
  archived: docDownload,
  review: docSearch,
  updated30: docEdit,
}

function markup(svg) {
  return svg.replace(/\sstyle="[^"]*"/, '').replace('<svg ', '<svg aria-hidden="true" ')
}

export function MetricIcon({ id }) {
  return <span dangerouslySetInnerHTML={{ __html: markup(ICONS[id] || docText) }} />
}
