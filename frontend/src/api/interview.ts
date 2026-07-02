const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type InterviewType = 'coding' | 'technical' | 'behavioral'

export interface StartInterviewPayload {
  interview_type: InterviewType
  resume: string
  job_description: string
}

export interface SubmitAnswerPayload {
  question_id: number
  answer: string
}

export interface Question {
  id: number
  question_text: string
  question_type: 'main' | 'follow_up'
  order_index: number
}

export interface SessionResponse {
  session_id: number
  status: string
  interview_type: string
  questions: Question[]
}

export interface AnswerResponse {
  feedback: string
  score: number
  follow_up_question: string | null
  follow_up_question_id: number | null
}

export interface FeedbackItem {
  question_text: string
  answer_text: string
  feedback: string
  score: number
}

export interface FeedbackResponse {
  session_id: number
  overall_score: number
  feedbacks: FeedbackItem[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${text}`)
  }
  return res.json()
}

export const startInterview = (payload: StartInterviewPayload) =>
  request<SessionResponse>('/interviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const submitAnswer = (sessionId: number, payload: SubmitAnswerPayload) =>
  request<AnswerResponse>(`/interviews/${sessionId}/answers`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const completeInterview = (sessionId: number) =>
  request<{ message: string }>(`/interviews/${sessionId}/complete`, { method: 'POST' })

export const getSession = (sessionId: number) =>
  request<SessionResponse>(`/interviews/${sessionId}`)

export const getFeedback = (sessionId: number) =>
  request<FeedbackResponse>(`/interviews/${sessionId}/feedback`)
