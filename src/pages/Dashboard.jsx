import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReview, getApiErrorMessage, TOKEN_KEY } from '../api.js'

function PinIcon({ className = 'h-5 w-5' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
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

function StarIcon({ filled }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-6 w-6 ${filled ? 'fill-orange-300 text-orange-300' : 'fill-transparent text-stone-600'}`}
      viewBox="0 0 24 24"
    >
      <path
        d="m12 3 2.7 5.48 6.05.88-4.38 4.27 1.03 6.02L12 16.8l-5.4 2.85 1.03-6.02-4.38-4.27 6.05-.88L12 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function Dashboard() {
  const [destination, setDestination] = useState('')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    navigate('/', { replace: true })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const savedReview = await createReview({
        destination: destination.trim(),
        rating,
        content: content.trim(),
      })

      setReviews((currentReviews) => [savedReview, ...currentReviews])
      setDestination('')
      setRating(5)
      setContent('')
      setSuccess('Your travel note has been added to the log.')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Your review could not be saved. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#171815] text-stone-100">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[245px] shrink-0 flex-col border-r border-white/[0.07] px-6 py-7 lg:flex">
          <a aria-label="TripLog home" className="flex items-center gap-2.5" href="/dashboard">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-400 text-[#171713]">
              <PinIcon className="h-6 w-6" />
            </span>
            <span className="text-xl font-semibold tracking-tight">triplog</span>
          </a>
          <div className="mt-14">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600">Your space</p>
            <a className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3 py-3 text-sm font-medium text-stone-100" href="/dashboard">
              <span aria-hidden="true" className="text-orange-300">▤</span>
              Travel log
            </a>
          </div>
          <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-stone-200">Every trip has a story.</p>
            <p className="mt-2 text-xs leading-5 text-stone-500">Save the details you don’t want to forget.</p>
            <span aria-hidden="true" className="mt-4 block text-2xl text-orange-300">✳</span>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8 lg:px-10">
            <a aria-label="TripLog home" className="flex items-center gap-2 lg:hidden" href="/dashboard">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-400 text-[#171713]">
                <PinIcon className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold">triplog</span>
            </a>
            <p className="hidden text-sm text-stone-500 lg:block">Your personal travel log</p>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-stone-200">Your account</p>
                <p className="text-xs text-stone-500">TripLog member</p>
              </div>
              <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#394138] text-xs font-semibold text-[#d3e2cf]">TL</span>
              <button
                className="rounded-lg px-3 py-2 text-sm text-stone-400 transition hover:bg-white/[0.06] hover:text-white"
                onClick={handleLogout}
                type="button"
              >
                Sign out
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12">
            <section className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-sm font-medium text-orange-300">Your story, one stop at a time</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">The travel log</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-stone-400 sm:text-base">
                  Keep the places, flavors, and little moments you want to carry home.
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-stone-500">Saved notes</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{reviews.length}</p>
              </div>
            </section>

            <section className="grid items-start gap-6 xl:grid-cols-[1.18fr_0.82fr]">
              <div className="rounded-[1.75rem] border border-white/[0.08] bg-[#20211e] p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-orange-400/10 text-orange-300">
                      <PinIcon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">Add a travel note</h2>
                    <p className="mt-1.5 text-sm text-stone-500">Where did the journey take you?</p>
                  </div>
                  <span className="hidden rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-stone-500 sm:block">New entry</span>
                </div>

                {error && (
                  <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200" role="alert">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-200" role="status">
                    {success}
                  </p>
                )}

                <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-300">Destination</span>
                    <span className="relative block">
                      <PinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-500" />
                      <input
                        className="form-input pl-11"
                        onChange={(event) => setDestination(event.target.value)}
                        placeholder="City, country, or that little place you found"
                        required
                        value={destination}
                      />
                    </span>
                  </label>

                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium text-stone-300">Your rating</legend>
                    <div aria-label={`Rating: ${rating} out of 5`} className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                          aria-pressed={rating === value}
                          className="rounded-md p-1 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
                          onClick={() => setRating(value)}
                          type="button"
                        >
                          <StarIcon filled={value <= rating} />
                        </button>
                      ))}
                      <span className="ml-2 text-xs text-stone-500">{rating} out of 5</span>
                    </div>
                  </fieldset>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-300">Your note</span>
                    <textarea
                      className="form-input min-h-32 resize-y leading-6"
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="What made this place worth remembering?"
                      required
                      rows={4}
                      value={content}
                    />
                  </label>

                  <button
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-5 py-3.5 text-sm font-semibold text-[#201b14] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 'Saving your note...' : 'Save to my log'}
                    {!isSubmitting && <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>}
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-white/[0.08] bg-[#20211e] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">Recent memories</h2>
                      <p className="mt-1 text-xs text-stone-500">The latest from your log</p>
                    </div>
                    <span aria-hidden="true" className="text-xl text-orange-300">✳</span>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-white/[0.1] px-5 py-8 text-center">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.04] text-stone-500">
                        <PinIcon className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-stone-300">A blank page, for now.</p>
                      <p className="mx-auto mt-1.5 max-w-[230px] text-xs leading-5 text-stone-500">
                        Your first saved review will find its way here.
                      </p>
                    </div>
                  ) : (
                    <ul className="mt-5 space-y-3">
                      {reviews.map((review, index) => (
                        <li className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4" key={review.id ?? `${review.destination}-${index}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-stone-100">{review.destination}</p>
                              <p className="mt-1 text-xs tracking-[0.12em] text-orange-300">
                                {'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                                <span className="text-stone-700">{'★'.repeat(5 - Math.max(0, Math.min(5, Number(review.rating) || 0)))}</span>
                              </p>
                            </div>
                            <span className="text-[10px] text-stone-600">JUST ADDED</span>
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-400">{review.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {reviews.length > 0 && (
                    <p className="mt-4 text-[11px] leading-5 text-stone-600">
                      Recent notes are shown for this session. Connect a review-list endpoint to load your log after signing in again.
                    </p>
                  )}
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#252720] p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300/80">A note to self</p>
                  <p className="mt-3 font-serif text-2xl leading-snug text-stone-200">
                    “You don’t remember days, you remember moments.”
                  </p>
                  <p className="mt-3 text-xs text-stone-500">Make room for the details.</p>
                  <div aria-hidden="true" className="mt-5 flex items-center gap-2">
                    <span className="h-px w-9 bg-orange-300/50" />
                    <span className="h-1 w-1 rounded-full bg-orange-300/70" />
                    <span className="h-px w-4 bg-orange-300/30" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
