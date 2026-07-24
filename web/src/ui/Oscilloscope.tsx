import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { formatSI } from '../engine/units'
import { useT } from '../i18n'
import { PAD, clampView, drawScope, stepScale, zoomView } from './scopeDraw'
import type { Trace, View } from './scopeDraw'

export type { Trace } from './scopeDraw'
export { TRACE_COLORS } from './scopeDraw'

export type OscilloscopeProps = {
  traces: Trace[]
  /** Seconds per sample. Sets the horizontal time base. */
  dt: number
  /** Vertical unit for readouts, e.g. 'V' or 'A'. */
  unit?: string
  height?: number
}

/**
 * Shared scope used by every simulator.
 *
 * Pan and zoom live in a ref and repaint through one requestAnimationFrame, so
 * dragging costs a single canvas paint per frame and zero React re-renders.
 * Prop changes repaint directly on commit, which is what keeps the trace live
 * while a slider is moving.
 */
export default function Oscilloscope({
  traces,
  dt,
  unit = 'V',
  height = 340,
}: OscilloscopeProps) {
  const t = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const [thickness, setThickness] = useState(2.4)
  const [voltsPerDiv, setVoltsPerDiv] = useState<number | null>(null) // null = auto
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const [zoom, setZoom] = useState(1)

  const view = useRef<View>({ start: 0, span: 1 })
  const frame = useRef(0)
  const autoVpd = useRef(1)

  // Latest render inputs, refreshed on every commit by the effect below. Kept in
  // a ref so the rAF callback can read them without being re-created.
  const latest = useRef({ traces, dt, unit, height, thickness, voltsPerDiv, hidden })

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const l = latest.current
    autoVpd.current = drawScope({
      ctx,
      width: canvas.width / (window.devicePixelRatio || 1),
      height: l.height,
      traces: l.traces.filter((t) => !l.hidden[t.label]),
      dt: l.dt,
      unit: l.unit,
      view: view.current,
      thickness: l.thickness,
      voltsPerDiv: l.voltsPerDiv,
    })
  }, [])

  const schedule = useCallback(() => {
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      paint()
    })
  }, [paint])

  // Every commit refreshes the snapshot and repaints. No dependency array on
  // purpose: any prop or panel change must reach the canvas.
  useEffect(() => {
    latest.current = { traces, dt, unit, height, thickness, voltsPerDiv, hidden }
    paint()
  })

  /** Size the backing store in device pixels, then repaint. */
  const resize = useCallback(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const w = Math.max(240, Math.round(wrap.clientWidth || wrap.getBoundingClientRect().width))
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(latest.current.height * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${latest.current.height}px`
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
    paint()
  }, [paint])

  // Size once on mount, then again whenever the container changes. Relying on
  // the observer alone leaves the canvas at its default 300x150 if the initial
  // callback never arrives, e.g. while the tab is not compositing.
  useLayoutEffect(() => {
    resize()
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [resize])

  // Resetting the id matters: cancelling without clearing it would make
  // schedule() short-circuit forever and freeze every later repaint.
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current)
      frame.current = 0
    },
    [],
  )

  const setView = useCallback(
    (next: View) => {
      view.current = clampView(next)
      setZoom(1 / view.current.span)
      schedule()
    },
    [schedule],
  )

  const zoomBy = useCallback(
    (factor: number, anchor: number) => setView(zoomView(view.current, factor, anchor)),
    [setView],
  )

  // Wheel must be a non-passive native listener to call preventDefault.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const plotW = rect.width - PAD.left - PAD.right
      zoomBy(Math.exp(e.deltaY * 0.0015), (e.clientX - rect.left - PAD.left) / plotW)
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [zoomBy])

  // Drag to pan, two-finger pinch to zoom, both off React state.
  const pointers = useRef(new Map<number, number>())
  const gesture = useRef({ start: 0, span: 1, x: 0, dist: 0 })

  const beginGesture = (clientX: number) => {
    const xs = [...pointers.current.values()]
    gesture.current = {
      ...view.current,
      x: xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : clientX,
      dist: xs.length > 1 ? Math.abs(xs[0] - xs[1]) : 0,
    }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, e.clientX)
    beginGesture(e.clientX)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, e.clientX)
    const rect = e.currentTarget.getBoundingClientRect()
    const plotW = rect.width - PAD.left - PAD.right
    const xs = [...pointers.current.values()]
    const mid = xs.reduce((a, b) => a + b, 0) / xs.length
    const g = gesture.current

    if (xs.length > 1 && g.dist > 0) {
      const dist = Math.abs(xs[0] - xs[1]) || 1
      const span = g.span * (g.dist / dist)
      setView(
        zoomView({ start: g.start, span: g.span }, span / g.span, (mid - rect.left - PAD.left) / plotW),
      )
    } else {
      setView({ start: g.start - ((mid - g.x) / plotW) * g.span, span: g.span })
    }
  }

  const endPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId)
    beginGesture(e.clientX)
  }

  const reset = () => {
    setView({ start: 0, span: 1 })
    setVoltsPerDiv(null)
  }

  const nudgeVpd = (dir: 1 | -1) =>
    setVoltsPerDiv((v) => stepScale(v ?? autoVpd.current, dir))

  return (
    <div className="scope-unit">
      <div ref={wrapRef} className="scope-screen">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onDoubleClick={reset}
        />
      </div>

      <div className="scope-panel">
        <Knob label="Timebase">
          <button onClick={() => zoomBy(2, 0.5)} title={t('Zoom out')}>
            &minus;
          </button>
          <span className="knob-value">{zoom > 1.001 ? `${zoom.toFixed(1)}x` : '1x'}</span>
          <button onClick={() => zoomBy(0.5, 0.5)} title={t('Zoom in')}>
            +
          </button>
        </Knob>

        <Knob label="Volts / div">
          <button onClick={() => nudgeVpd(1)} title={t('Coarser')}>
            &minus;
          </button>
          <button
            className={voltsPerDiv === null ? 'on' : ''}
            onClick={() => setVoltsPerDiv((v) => (v === null ? autoVpd.current : null))}
          >
            {voltsPerDiv === null ? 'AUTO' : formatSI(voltsPerDiv, unit, 2)}
          </button>
          <button onClick={() => nudgeVpd(-1)} title={t('Finer')}>
            +
          </button>
        </Knob>

        <div className="knob wide">
          <span className="knob-label">{t('Trace {px} px', { px: thickness.toFixed(1) })}</span>
          <input
            type="range"
            min={1}
            max={6}
            step={0.2}
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))}
            aria-label={t('Trace thickness')}
          />
        </div>

        <Knob label="Channels">
          {traces.map((trace) => (
            <button
              key={trace.label}
              className={hidden[trace.label] ? 'chan off' : 'chan'}
              style={{ '--chan': trace.color } as React.CSSProperties}
              onClick={() => setHidden((h) => ({ ...h, [trace.label]: !h[trace.label] }))}
            >
              {trace.label}
            </button>
          ))}
        </Knob>

        <Knob>
          <button onClick={reset}>RESET</button>
        </Knob>
      </div>

      <p className="scope-hint">
        {t('Scroll or pinch to zoom the time base, drag to pan, double click to reset.')}
      </p>
    </div>
  )
}

function Knob({ label, children }: { label?: string; children: React.ReactNode }) {
  const t = useT()
  return (
    <div className="knob">
      {/* non-breaking space keeps unlabelled knobs aligned with labelled ones */}
      <span className="knob-label">{label ? t(label) : ' '}</span>
      <div className="knob-row">{children}</div>
    </div>
  )
}
