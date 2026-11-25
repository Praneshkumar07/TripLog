import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage, loginUser, registerUser, TOKEN_KEY } from '../api.js'

function PinMark({ className = 'h-5 w-5' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M19 10.1c0 5.2-7 11.4-7 11.4S5 15.3 5 10.1a7 7 0 1 1 14 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const isRegistering = mode === 'register'

  function changeMode(nextMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      if (isRegistering) {
        await registerUser({ username: username.trim(), email: email.trim(), password })
        setMode('login')
        setPassword('')
        setMessage('Your account is ready. Sign in to start your logbook.')
        return
      }

      const result = await loginUser({ email: email.trim(), password })
      const token =
        typeof result === 'string'
          ? result.trim().replace(/^["']|["']$/g, '')
          : result?.token

      if (typeof token !== 'string' || !token) {
        throw new Error('The server did not return a valid sign-in token.')
      }

      localStorage.setItem(TOKEN_KEY, token)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          isRegistering ? 'We could not create your account.' : 'We could not sign you in.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell min-h-screen overflow-hidden px-5 py-5 text-white sm:px-8 lg:px-12">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <a aria-label="TripLog home" className="flex items-center gap-2.5" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-400 text-[#171713]">
            <PinMark className="h-6 w-6" />
          </span>
          <span className="text-xl font-semibold tracking-tight">triplog</span>
        </a>
        <span className="hidden text-sm text-stone-400 sm:block">
          Your travels, beautifully remembered.
        </span>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl items-center gap-12 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <section className="relative mx-auto w-full max-w-2xl lg:py-10">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-400/10 blur-[100px]" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-stone-300">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              A little more than a travel diary
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-stone-50 sm:text-6xl lg:text-7xl">
              Keep the places
              <br />
              that <span className="font-serif font-normal italic text-orange-300">stay</span>
              <br />
              with you.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-stone-400 sm:text-lg">
              Log the places you loved, the meals you still think about, and the
              moments that made the whole trip.
            </p>

            <div className="travel-card relative mt-12 min-h-[250px] max-w-xl overflow-hidden rounded-[2rem] border border-white/10 p-6 sm:min-h-[290px] sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d79161]/50 via-[#6b6552]/20 to-[#252823]/80" />
              <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/20" />
              <div className="absolute -right-1 top-2 h-48 w-48 rounded-full border border-white/15" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#171815] via-[#171815]/30 to-transparent" />
              <div className="relative flex h-full min-h-[198px] flex-col justify-between sm:min-h-[226px]">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-white/25 bg-black/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
                    Field notes · 01
                  </span>
                  <span className="text-sm tracking-[0.2em] text-orange-100">★★★★★</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Somewhere in Italy</p>
                  <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">A slower kind of Sunday.</h2>
                  <div className="mt-4 flex items-center gap-2 text-sm text-white/75">
                    <PinMark className="h-4 w-4" />
                    <span>Florence, Tuscany</span>
                    <span className="text-white/40">·</span>
                    <span>Saved for later</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-stone-400">
              <span className="flex -space-x-2">
                {['#d98c64', '#789081', '#c4a471'].map((color, index) => (
                  <span
                    key={color}
                    aria-hidden="true"
                    className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#171815] text-[10px] font-semibold text-[#171815]"
                    style={{ backgroundColor: color, zIndex: 3 - index }}
                  >
                    {['M', 'A', 'J'][index]}
                  </span>
                ))}
              </span>
              <span>Made for people who collect moments.</span>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-white/[0.09] bg-[#20211e]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-9">
            <div className="mb-8">
              <p className="text-sm font-medium text-orange-300">
                {isRegistering ? 'Start your story' : 'Welcome back'}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                {isRegistering ? 'Create your account' : 'Sign in to TripLog'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                {isRegistering
                  ? 'Your next favorite memory starts here.'
                  : 'Pick up right where your last adventure left off.'}
              </p>
            </div>

            <div aria-label="Choose an account action" className="mb-6 grid grid-cols-2 rounded-xl bg-[#171815] p-1" role="tablist">
              <button
                aria-selected={!isRegistering}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${!isRegistering ? 'bg-[#33342f] text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
                onClick={() => changeMode('login')}
                role="tab"
                type="button"
              >
                Sign in
              </button>
              <button
                aria-selected={isRegistering}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${isRegistering ? 'bg-[#33342f] text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
                onClick={() => changeMode('register')}
                role="tab"
                type="button"
              >
                Create account
              </button>
            </div>

            {message && (
              <p className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-200" role="status">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200" role="alert">
                {error}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegistering && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-300">Username</span>
                  <input
                    autoComplete="username"
                    className="form-input"
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="How should we call you?"
                    required
                    value={username}
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-300">Email address</span>
                <input
                  autoComplete="email"
                  className="form-input"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-300">Password</span>
                <input
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  className="form-input"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={password}
                />
              </label>
              <button
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-5 py-3.5 text-sm font-semibold text-[#201b14] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting
                  ? 'One moment...'
                  : isRegistering
                    ? 'Create my account'
                    : 'Sign in'}
                {!isSubmitting && <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-stone-500">
              Your logbook is yours. Sign in to keep your travel notes together.
            </p>
          </div>
          <p className="mt-5 text-center text-xs text-stone-600">
            By continuing, you agree to travel with curiosity.
          </p>
        </section>
      </div>
    </main>
  )
}
