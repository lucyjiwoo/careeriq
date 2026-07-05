import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  submitAnswer,
  completeInterview,
  getSession,
  type Question,
  type AnswerResponse,
  type SessionResponse,
} from '../api/interview'

interface AnsweredQuestion {
  question: Question
  answerText: string
  feedback: string
  score: number
}

export default function InterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const sessionIdNum = Number(sessionId)

  const routerSession = (location.state as { session?: SessionResponse } | null)?.session ?? null

  const [questions, setQuestions] = useState<Question[]>(routerSession?.questions ?? [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([])

  const [answerText, setAnswerText] = useState('')
  const [lastResult, setLastResult] = useState<AnswerResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!routerSession)

  // Fetch session only when not passed via router state
  useEffect(() => {
    if (routerSession) return
    getSession(sessionIdNum)
      .then((s) => setQuestions(s.questions))
      .catch(() => setError('Failed to load session.'))
      .finally(() => setLoading(false))
  }, [sessionIdNum])

  const currentQuestion = questions[currentIndex] ?? null
  const isLastAnswered = answered.length > 0 && currentIndex >= questions.length

  async function handleSubmit() {
    if (!currentQuestion || !answerText.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await submitAnswer(sessionIdNum, {
        question_id: currentQuestion.id,
        answer: answerText.trim(),
      })
      setLastResult(result)
      setAnswered((prev) => [
        ...prev,
        { question: currentQuestion, answerText: answerText.trim(), feedback: result.feedback, score: result.score },
      ])
      // Append follow-up question if returned
      if (result.next_question) {
        setQuestions((prev) => [...prev, result.next_question!])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleNext() {
    setLastResult(null)
    setAnswerText('')
    setCurrentIndex((i) => i + 1)
  }

  async function handleComplete() {
    setCompleting(true)
    setError(null)
    try {
      await completeInterview(sessionIdNum)
      navigate(`/interview/${sessionId}/result`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to complete session.')
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading session…</p>
      </div>
    )
  }

  const totalAnswered = answered.length
  const totalQuestions = questions.length
  const scoreColor = (score: number) =>
    score >= 0.8 ? 'text-emerald-600' : score >= 0.5 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Nav */}
      <nav className="px-12 py-5 flex items-center justify-between border-b border-slate-200 bg-white">
        <span className="text-xl font-semibold tracking-tight text-slate-900">Career IQ</span>
        <span className="text-sm text-slate-400">
          {totalAnswered} / {totalQuestions} answered
        </span>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl flex flex-col gap-8">

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: totalQuestions ? `${(totalAnswered / totalQuestions) * 100}%` : '0%' }}
            />
          </div>

          {/* Already-answered questions (collapsed) */}
          {answered.map((a, i) => (
            <div key={a.question.id} className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-sm font-medium text-slate-500">
                  Q{i + 1} {a.question.type === 'follow_up' && <span className="ml-1 text-xs text-violet-500">Follow-up</span>}
                </p>
                <span className={`text-sm font-semibold ${scoreColor(a.score)}`}>
                  {Math.round(a.score * 100)}
                </span>
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed">{a.question.question_text}</p>
              <p className="text-xs text-slate-400 italic leading-relaxed">{a.feedback}</p>
            </div>
          ))}

          {/* Current question */}
          {currentQuestion && !isLastAnswered && (
            <div className="bg-white rounded-2xl border border-violet-200 shadow-sm px-6 py-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
                  Q{totalAnswered + 1}
                </span>
                {currentQuestion.type === 'follow_up' && (
                  <span className="text-xs text-slate-400">Follow-up</span>
                )}
              </div>

              <p className="text-base font-medium text-slate-900 leading-relaxed mb-6">
                {currentQuestion.question_text}
              </p>

              {/* Feedback after submit */}
              {lastResult && (
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Feedback</span>
                    <span className={`text-sm font-bold ${scoreColor(lastResult.score)}`}>
                      {Math.round(lastResult.score * 100)} / 100
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{lastResult.feedback}</p>
                </div>
              )}

              {/* Answer input — hidden after submit */}
              {!lastResult && (
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your answer here…"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none transition mb-4"
                />
              )}

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Actions */}
              {!lastResult ? (
                <button
                  onClick={handleSubmit}
                  disabled={!answerText.trim() || submitting}
                  className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {submitting ? 'Evaluating…' : 'Submit Answer'}
                </button>
              ) : (
                <div className="flex gap-3">
                  {lastResult.next_question ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleNext}
                        className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        Continue
                      </button>
                      <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        {completing ? 'Finishing…' : 'Finish Interview'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* All answered — prompt to finish */}
          {isLastAnswered && (
            <div className="bg-white rounded-2xl border border-slate-200 px-6 py-8 text-center">
              <p className="text-lg font-semibold text-slate-900 mb-2">All questions answered</p>
              <p className="text-sm text-slate-500 mb-6">Ready to see your results?</p>
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}
              <button
                onClick={handleComplete}
                disabled={completing}
                className="px-10 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {completing ? 'Finishing…' : 'View Results →'}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
