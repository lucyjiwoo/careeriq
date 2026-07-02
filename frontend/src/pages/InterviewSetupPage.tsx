import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startInterview, type InterviewType } from '../api/interview'

const INTERVIEW_TYPES: { value: InterviewType; label: string; description: string }[] = [
  { value: 'behavioral', label: 'Behavioral', description: 'Leadership, teamwork, conflict, and situational questions' },
  { value: 'technical', label: 'Technical', description: 'System design, architecture, and domain knowledge' },
  { value: 'coding', label: 'Coding', description: 'Algorithms, data structures, and problem solving' },
]

export default function InterviewSetupPage() {
  const navigate = useNavigate()
  const [interviewType, setInterviewType] = useState<InterviewType>('behavioral')
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = resume.trim().length > 0 && jobDescription.trim().length > 0 && !loading

  async function handleStart() {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      const session = await startInterview({
        interview_type: interviewType,
        resume: resume.trim(),
        job_description: jobDescription.trim(),
      })
      navigate(`/interview/${session.session_id}`, { state: { session } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Nav */}
      <nav className="px-12 py-6 flex items-center border-b border-slate-200 bg-white">
        <button
          onClick={() => navigate('/')}
          className="text-xl font-semibold tracking-tight text-slate-900 hover:text-violet-600 transition-colors cursor-pointer"
        >
          Career IQ
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="w-full max-w-2xl">

          <div className="animate-fade-up mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Set up your interview</h1>
            <p className="text-slate-500">Paste your resume and the job description, then choose an interview type.</p>
          </div>

          {/* Interview Type */}
          <div className="animate-fade-up delay-100 mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Interview Type</label>
            <div className="grid grid-cols-3 gap-3">
              {INTERVIEW_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setInterviewType(t.value)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    interviewType === t.value
                      ? 'border-violet-500 bg-violet-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${interviewType === t.value ? 'text-violet-700' : 'text-slate-800'}`}>
                    {t.label}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div className="animate-fade-up delay-200 mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Resume <span className="text-slate-400 font-normal">(paste as plain text)</span>
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none transition"
            />
          </div>

          {/* Job Description */}
          <div className="animate-fade-up delay-300 mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Job Description <span className="text-slate-400 font-normal">(paste the full JD)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="animate-fade-up delay-400">
            <button
              onClick={handleStart}
              disabled={!canSubmit}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-base font-semibold rounded-xl shadow-sm transition-colors duration-150 cursor-pointer"
            >
              {loading ? 'Generating questions…' : 'Start Interview →'}
            </button>
            {!resume.trim() || !jobDescription.trim() ? (
              <p className="text-center text-xs text-slate-400 mt-3">Fill in both fields to continue</p>
            ) : null}
          </div>

        </div>
      </main>
    </div>
  )
}
