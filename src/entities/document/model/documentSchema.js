import { z } from 'zod'

const text = z.union([z.string(), z.null()])
const fileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
}).passthrough().nullable()

const revisionSchema = z.object({
  id: z.string(),
  number: z.number(),
  effectiveFrom: text,
  effectiveTo: text,
  confirmedStart: z.boolean(),
  isSubstantive: z.boolean(),
  publishedAt: text.optional(),
  incomplete: z.boolean(),
  incompleteReason: z.string(),
  file: fileSchema,
  basisFile: fileSchema,
  attachments: z.array(z.object({ id: z.string(), name: z.string(), size: z.number() }).passthrough()),
  basisDetails: z.string(),
  locked: z.boolean(),
}).passthrough()

const eventSchema = z.object({
  id: z.string(),
  date: text,
  type: z.string(),
  completed: z.boolean(),
  checker: z.string().optional(),
  comment: z.string().optional(),
  locked: z.boolean().optional(),
}).passthrough()

const functionLinkSchema = z.object({
  functionId: z.string(),
  role: z.string(),
  locked: z.boolean().optional(),
}).passthrough()

const documentLinkSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  targetRevision: z.number(),
  role: z.string(),
  locked: z.boolean().optional(),
}).passthrough()

export const documentFormSchema = z.object({
  id: z.string(),
  number: z.string(),
  shortTitle: z.string(),
  fullTitle: z.string(),
  kind: z.string(),
  status: z.string(),
  relevance: z.string(),
  ownerDeptId: z.string(),
  processOwnerDeptId: z.string(),
  responsible: z.string(),
  adoptedAt: z.string(),
  publishedAt: z.string(),
  governingBody: z.string(),
  adoptionDocKind: z.string(),
  adoptionDocDetails: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()),
  published: z.boolean(),
  version: z.number(),
  nextCheckAt: z.string(),
  overlapConfirmed: z.boolean(),
  revisions: z.array(revisionSchema),
  functionLinks: z.array(functionLinkSchema),
  documentLinks: z.array(documentLinkSchema),
  relevanceEvents: z.array(eventSchema),
  changelog: z.array(z.object({ id: z.string() }).passthrough()),
}).passthrough()
