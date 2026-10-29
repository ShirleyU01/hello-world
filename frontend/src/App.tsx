import { useRef, useState } from 'react'

type HelloResponse = {
  message: string
  service: string
  runtime: string
  time: string
  name: string | null
}

type Phase =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'live'; data: HelloResponse; elapsedMs: number }
  | { status: 'down'; detail: string }

function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date)
}

export default function App() {
  const [name, setName] = useState('')
  const [phase, setPhase] = useState<Phase>({ status: 'idle' })
  const requestId = useRef(0)

  async function ask(target: 'hello' | 'missing') {
    const id = ++requestId.current
    const started = performance.now()
    const params = new URLSearchParams()
    const trimmed = name.trim()
    if (trimmed && target === 'hello') params.set('name', trimmed)
    const path = target === 'hello' ? '/api/hello' : '/api/missing'
    const url = params.size > 0 ? `${path}?${params}` : path

    setPhase({ status: 'loading' })

    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (id !== requestId.current) return
      if (!response.ok) {
        setPhase({
          status: 'down',
          detail:
            target === 'missing'
              ? 'Preview only. /api/missing is not a real route, so this is the failure state. Ask the backend again to recover.'
              : `The backend replied with HTTP ${response.status}.`,
        })
        return
      }

      const data = (await response.json()) as Partial<HelloResponse>
      if (id !== requestId.current) return
      if (!data.message || !data.time || !data.runtime) {
        setPhase({
          status: 'down',
          detail: 'The backend replied, but not with a hello payload.',
        })
        return
      }

      setPhase({
        status: 'live',
        data: data as HelloResponse,
        elapsedMs: Math.max(1, Math.round(performance.now() - started)),
      })
    } catch {
      if (id !== requestId.current) return
      setPhase({
        status: 'down',
        detail:
          'The request never reached the backend. Start the API on port 8000, then try again.',
      })
    }
  }

  const backendStatus =
    phase.status === 'live'
      ? 'Live'
      : phase.status === 'down'
        ? 'No reply'
        : phase.status === 'loading'
          ? 'Asking'
          : 'Waiting'

  return (
    <main>
      <p className="eyebrow">Frontend and backend · local</p>
      <h1>Hello.</h1>
      <p className="lede">
        This page is the React frontend. Ask the backend, and the page calls{' '}
        <code>GET /api/hello</code> on the FastAPI server, then prints the reply.
      </p>

      <div className="grid">
        <section className="card live">
          <header>
            <span>Frontend</span>
            <strong>Rendering</strong>
          </header>
          <p className="message">Hello from the frontend.</p>
          <p className="meta">React · painted in the browser</p>
        </section>

        <section className={`card ${phase.status === 'live' ? 'live' : phase.status === 'down' ? 'down' : ''}`}>
          <header>
            <span>Backend</span>
            <strong>{backendStatus}</strong>
          </header>
          <div aria-live="polite">
            {phase.status === 'idle' ? (
              <>
                <p className="message">Waiting for a request.</p>
                <p className="detail">
                  The reply comes from FastAPI at <code>http://127.0.0.1:8000</code>.
                </p>
              </>
            ) : null}
            {phase.status === 'loading' ? <p className="message">Asking the backend…</p> : null}
            {phase.status === 'live' ? (
              <>
                <p className="message">{phase.data.message}</p>
                <ul className="facts">
                  <li>
                    <span>Runtime</span> {phase.data.runtime}
                  </li>
                  <li>
                    <span>Round trip</span> {phase.elapsedMs} ms
                  </li>
                  <li>
                    <span>Replied</span> {formatWhen(phase.data.time)}
                  </li>
                </ul>
              </>
            ) : null}
            {phase.status === 'down' ? (
              <>
                <p className="message">The frontend is up.</p>
                <p className="detail">{phase.detail}</p>
              </>
            ) : null}
          </div>
        </section>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void ask('hello')
        }}
      >
        <label htmlFor="name">Name to send</label>
        <div className="row">
          <input
            id="name"
            name="name"
            value={name}
            maxLength={40}
            autoComplete="name"
            placeholder="Optional"
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit" disabled={phase.status === 'loading'}>
            {phase.status === 'loading'
              ? 'Asking…'
              : phase.status === 'down'
                ? 'Try the backend again'
                : phase.status === 'live'
                  ? 'Ask the backend again'
                  : 'Ask the backend'}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={phase.status === 'loading'}
            onClick={() => void ask('missing')}
          >
            Show the error state
          </button>
        </div>
      </form>
    </main>
  )
}
