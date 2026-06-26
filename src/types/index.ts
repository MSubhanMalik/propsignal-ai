import { z } from 'zod'

export const SignalTypeSchema = z.enum([
  'legal_issue',
  'fraud_allegation',
  'delivery_delay',
  'positive_review',
  'regulatory_approval',
  'news_mention',
  'social_complaint',
  'court_record',
  'award_recognition',
  'government_notice',
])
export type SignalType = z.infer<typeof SignalTypeSchema>

export const SentimentSchema = z.enum(['positive', 'negative', 'neutral'])
export type Sentiment = z.infer<typeof SentimentSchema>

export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'unknown'])
export type RiskLevel = z.infer<typeof RiskLevelSchema>

export const ReportStatusSchema = z.enum(['running', 'done', 'error'])
export type ReportStatus = z.infer<typeof ReportStatusSchema>

export const AgentStepSchema = z.enum(['resolving', 'searching', 'extracting', 'saving'])
export type AgentStep = z.infer<typeof AgentStepSchema>

export const SignalSchema = z.object({
  type: SignalTypeSchema,
  title: z.string().max(100),
  detail: z.string(),
  sentiment: SentimentSchema,
  weight: z.number().int().min(1).max(5),
  source_url: z.string().url(),
  source_title: z.string(),
})
export type Signal = z.infer<typeof SignalSchema>

export const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string(),
  snippet: z.string(),
})
export type SearchResult = z.infer<typeof SearchResultSchema>

export const SourceSchema = z.object({
  title: z.string(),
  url: z.string(),
})
export type Source = z.infer<typeof SourceSchema>

export interface Report {
  id: string
  project_input: string
  status: ReportStatus
  current_step: AgentStep
  resolved_name: string | null
  credibility_score: number | null
  risk_level: RiskLevel | null
  summary: string | null
  sources: Source[]
  error: string | null
  created_at: string
  signals?: Signal[]
}

export interface AgentState {
  reportId: string
  projectInput: string
  resolvedName: string
  searchQueries: string[]
  searchResults: SearchResult[]
  signals: Signal[]
  credibilityScore: number
  riskLevel: RiskLevel
  summary: string
  sources: Source[]
  error?: string
}

export const ResolveOutputSchema = z.object({
  resolvedName: z.string(),
  searchQueries: z.array(z.string()).min(1).max(3),
})

export const ExtractOutputSchema = z.object({
  signals: z.array(SignalSchema),
  credibilityScore: z.number().int().min(0).max(100),
  riskLevel: RiskLevelSchema,
  summary: z.string(),
})

export interface StartResearchPayload {
  projectInput: string
}

export interface StartResearchResponse {
  reportId: string
}
