import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getFeedback, type FeedbackResponse, type WeaknessItem } from '../api/interview'

const severityOrder = { high: 0, medium: 1, low: 2 }
const severityColor: Record<string, string> = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-slate-500 bg-slate-100 border-slate-200',
}

function scoreColor(score: number) {
  if (score >= 0.8) return 'text-emerald-600'
  if (score >= 0.5) return 'text-amber-500'
  return 'text-red-500'
}

function scoreLabel(score: number) {
  if (score >= 0.8) return 'Strong'
  if (score >= 0.6) return 'Good'
  if (score >= 0.4) return 'Needs Work'
  return 'Weak'
}

function groupByCategory(weaknesses: WeaknessItem[]) {
  return weaknesses.reduce<Record<string, WeaknessItem[]>>((acc, w) => {
    const key = w.category || 'General'
    if (!acc[key]) acc[key] = []
    acc[key].push(w)
    return acc
  }, {})
}

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const [data, setData] = useState<FeedbackResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getFeedback(Number(sessionId))
      .then(setData)
      .catch(() => setError('Failed to load results.'))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading results…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500 text-sm">{error ?? 'No data found.'}</p>
      </div>
    )
  }

  const scores = data.feedbacks.map((f) => f.score)
  const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  const avgDisplay = Math.round(avgScore * 100)

  const sortedWeaknesses = [...data.weaknesses].sort(
    (a, b) => (severityOrder[a.severity as keyof typeof severityOrder] ?? 99) -
               (severityOrder[b.severity as keyof typeof severityOrder] ?? 99)
  )
  const grouped = groupByCategory(sortedWeaknesses)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Nav */}
      <nav className="px-12 py-5 flex items-center justify-between border-b border-slate-200 bg-white">
        <button
          onClick={() => navigate('/')}
          className="text-xl font-semibold tracking-tight text-slate-900 hover:text-violet-600 transition-colors cursor-pointer"
        >
          Career IQ
        </button>
        <button
          onClick={() => navigate('/interview/new')}
          className="px-5 py-2 text-sm font-semibold text-violet-600 border border-violet-200 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer"
        >
          New Interview
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl flex flex-col gap-8">

          {/* Overall score */}
          <div className="animate-fade-up bg-white rounded-2xl border border-slate-200 px-8 py-8 flex items-center gap-8">
            <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-slate-100 shrink-0">
              <span className={`text-3xl font-bold ${scoreColor(avgScore)}`}>{avgDisplay}</span>
              <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Overall Score</p>
              <p className={`text-2xl font-bold mb-1 ${scoreColor(avgScore)}`}>{scoreLabel(avgScore)}</p>
              <p className="text-sm text-slate-500">
                {scores.length} question{scores.length !== 1 ? 's' : ''} evaluated
              </p>
            </div>
          </div>

          {/* Per-question feedback */}
          <div className="animate-fade-up delay-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Question Feedback</h2>
            <div className="flex flex-col gap-3">
              {data.feedbacks.map((f, i) => (
                <div key={f.answer_id} className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">Q{i + 1}</span>
                    <span className={`text-sm font-bold ${scoreColor(f.score)}`}>
                      {Math.round(f.score * 100)} / 100
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{f.feedback_text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weakness summary */}
          {sortedWeaknesses.length > 0 && (
            <div className="animate-fade-up delay-200">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Areas to Improve</h2>
              <div className="flex flex-col gap-3">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{category}</p>
                    <div className="flex flex-col gap-2">
                      {items.map((w, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className={`mt-0.5 shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${severityColor[w.severity] ?? severityColor.low}`}>
                            {w.severity}
                          </span>
                          <p className="text-sm text-slate-700 leading-relaxed">{w.weakness_text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="animate-fade-up delay-300 flex gap-3 pt-2">
            <button
              onClick={() => navigate('/interview/new')}
              className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Practice Again →
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
