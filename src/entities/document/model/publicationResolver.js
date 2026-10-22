import { zodResolver } from '@hookform/resolvers/zod'
import { documentFormSchema } from './documentSchema.js'
import { publicationIssues } from './validate.js'

function issuesToErrors(issues) {
  const errors = {}
  issues.forEach((issue) => {
    const parts = issue.path.split('.')
    let node = errors
    for (let index = 0; index < parts.length - 1; index += 1) {
      const key = parts[index]
      const next = parts[index + 1]
      if (node[key] == null) node[key] = /^\d+$/.test(next) ? [] : {}
      node = node[key]
    }
    const leaf = parts[parts.length - 1]
    const previous = node[leaf]?.message
    node[leaf] = {
      type: 'publication',
      message: previous ? `${previous} ${issue.message}` : issue.message,
    }
  })
  return errors
}

export function createPublicationResolver(refs) {
  const shape = zodResolver(documentFormSchema)
  return async (values, context, options) => {
    const parsed = await shape(values, context, options)
    if (Object.keys(parsed.errors).length) return parsed
    if (refs.intent.current !== 'publish') return { values: parsed.values, errors: {} }
    const issues = publicationIssues(parsed.values, refs.getPublicationContext())
    if (!issues.length) return { values: parsed.values, errors: {} }
    return { values: parsed.values, errors: issuesToErrors(issues) }
  }
}
