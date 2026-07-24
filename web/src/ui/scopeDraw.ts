/**
 * Canvas drawing for the oscilloscope, kept separate from the React component so
 * the scaling maths can be unit tested and the component stays about wiring.
 */
import { formatSI } from '../engine/units'
import { peakToPeak, rms } from '../engine/signal'

export type Trace = {
  label: string
  color: string
  samples: ArrayLike<number>
  /** Hide the Vpp/RMS readout for traces where it is meaningless. */
  quiet?: boolean
}

/** Visible window as a fraction of the buffer. */
export type View = { start: number; span: number }

export const DIV_X = 10
export const DIV_Y = 8
export const PAD = { top: 26, right: 12, bottom: 24, left: 12 }

const COLOR = {
  bg: '#191919',
  grid: 'rgba(168, 130, 255, 0.12)',
  axis: 'rgba(168, 130, 255, 0.30)',
  frame: '#363636',
  text: '#888888',
}

/**
 * Trace palette. Kept in step with the hue variables in index.css so scope
 * colours match the rest of the theme. Simulators index into this rather than
 * hardcoding hex.
 */
export const TRACE_COLORS = [
  '#56b6f7', // sky, conventionally the input
  '#c084fc', // violet, conventionally the output
  '#4ade80', // green
  '#fbbf24', // amber
  '#fb7185', // rose
] as const

/** Snap to the 1-2-5 sequence a real scope's knob clicks through. */
export function niceStep(raw: number): number {
  if (!(raw > 0) || !Number.isFinite(raw)) return 1
  const exp = Math.floor(Math.log10(raw))
  const base = Math.pow(10, exp)
  const m = raw / base
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * base
}

/** Next (dir=1, coarser) or previous (dir=-1, finer) value in the 1-2-5 sequence. */
export function stepScale(value: number, dir: 1 | -1): number {
  const seq = [1, 2, 5]
  const exp = Math.floor(Math.log10(value))
  const base = Math.pow(10, exp)
  const m = value / base
  const i = seq.findIndex((s) => Math.abs(s - m) < 0.15)
  const next = (i === -1 ? 0 : i) + dir
  if (next < 0) return seq[seq.length - 1] * base * 0.1
  if (next >= seq.length) return seq[0] * base * 10
  return seq[next] * base
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Clamp a view so it always covers a sane window inside the buffer. */
export function clampView(v: View): View {
  const span = Math.min(1, Math.max(1e-5, v.span))
  return { span, start: Math.min(Math.max(0, v.start), 1 - span) }
}

/** Zoom by `factor` keeping the point at `anchor` (0..1 across the plot) fixed. */
export function zoomView(v: View, factor: number, anchor: number): View {
  const span = Math.min(1, Math.max(1e-5, v.span * factor))
  return clampView({ start: v.start + (v.span - span) * clamp01(anchor), span })
}

export type DrawOptions = {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  traces: Trace[]
  dt: number
  unit: string
  view: View
  thickness: number
  /** null means auto-range from the visible window. */
  voltsPerDiv: number | null
}

/**
 * Paint one frame. Returns the volts/div actually used, so the component can
 * seed the manual knob from whatever auto-range last chose.
 *
 * Cost is bounded by pixel width, not buffer length: when the visible window
 * holds more samples than pixel columns, each column collapses to a min/max
 * pair. Zooming in narrows the window, so cost falls rather than rises.
 */
export function drawScope(o: DrawOptions): number {
  const { ctx, width: w, height: h, traces, dt, unit, view, thickness } = o

  const plotX = PAD.left
  const plotY = PAD.top
  const plotW = w - PAD.left - PAD.right
  const plotH = h - PAD.top - PAD.bottom
  const midY = plotY + plotH / 2

  ctx.fillStyle = COLOR.bg
  ctx.fillRect(0, 0, w, h)

  const n = traces[0]?.samples.length ?? 0
  const i0 = Math.max(0, Math.floor(view.start * n))
  const i1 = Math.min(n, Math.max(i0 + 2, Math.ceil((view.start + view.span) * n)))
  const visible = i1 - i0

  // ---- vertical scale from the visible window only, like a real autoset ----
  let min = Infinity
  let max = -Infinity
  for (const t of traces) {
    for (let i = i0; i < i1 && i < t.samples.length; i++) {
      const v = t.samples[i]
      if (!Number.isFinite(v)) continue
      if (v < min) min = v
      if (v > max) max = v
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = -1
    max = 1
  }
  const spanV = max - min || Math.max(Math.abs(max), 1) * 2
  const autoVpd = niceStep(spanV / 6)
  const vpd = o.voltsPerDiv ?? autoVpd
  // Snapping the centre to a whole division keeps gridlines on round values.
  // Worst case shift is half a division, so a 6-division signal still fits in 8.
  const center = Math.round((min + max) / 2 / vpd) * vpd
  const toY = (v: number) => midY - ((v - center) / vpd) * (plotH / DIV_Y)

  // ---- grid ----
  ctx.lineWidth = 1
  ctx.strokeStyle = COLOR.grid
  ctx.beginPath()
  for (let i = 1; i < DIV_X; i++) {
    const x = Math.round(plotX + (plotW * i) / DIV_X) + 0.5
    ctx.moveTo(x, plotY)
    ctx.lineTo(x, plotY + plotH)
  }
  for (let i = 1; i < DIV_Y; i++) {
    const y = Math.round(plotY + (plotH * i) / DIV_Y) + 0.5
    ctx.moveTo(plotX, y)
    ctx.lineTo(plotX + plotW, y)
  }
  ctx.stroke()

  ctx.strokeStyle = COLOR.axis
  ctx.beginPath()
  const cy = Math.round(midY) + 0.5
  ctx.moveTo(plotX, cy)
  ctx.lineTo(plotX + plotW, cy)
  const cx = Math.round(plotX + plotW / 2) + 0.5
  ctx.moveTo(cx, plotY)
  ctx.lineTo(cx, plotY + plotH)
  ctx.stroke()

  const zeroY = toY(0)
  if (center !== 0 && zeroY > plotY && zeroY < plotY + plotH) {
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = COLOR.axis
    ctx.beginPath()
    ctx.moveTo(plotX, Math.round(zeroY) + 0.5)
    ctx.lineTo(plotX + plotW, Math.round(zeroY) + 0.5)
    ctx.stroke()
    ctx.restore()
  }

  ctx.strokeStyle = COLOR.frame
  ctx.strokeRect(plotX + 0.5, plotY + 0.5, plotW - 1, plotH - 1)

  // ---- traces ----
  ctx.save()
  ctx.beginPath()
  ctx.rect(plotX, plotY, plotW, plotH)
  ctx.clip()
  ctx.lineWidth = thickness
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  for (const trace of traces) {
    if (trace.samples.length === 0) continue
    ctx.strokeStyle = trace.color
    ctx.beginPath()

    if (visible > plotW * 2) {
      // The path stays open across columns so the trace is continuous; a
      // separate subpath per column leaves gaps that read as a dashed line.
      const cols = Math.floor(plotW)
      for (let c = 0; c < cols; c++) {
        const s = i0 + Math.floor((c * visible) / cols)
        const e = Math.max(s + 1, i0 + Math.floor(((c + 1) * visible) / cols))
        let lo = Infinity
        let hi = -Infinity
        for (let i = s; i < e; i++) {
          const v = trace.samples[i]
          if (v < lo) lo = v
          if (v > hi) hi = v
        }
        // Enter the column from the end nearest the previous one, so a rising
        // edge is not drawn as a downward zigzag.
        const rising = trace.samples[s] <= trace.samples[e - 1]
        const x = plotX + c + 0.5
        if (c === 0) ctx.moveTo(x, toY(rising ? lo : hi))
        else ctx.lineTo(x, toY(rising ? lo : hi))
        ctx.lineTo(x, toY(rising ? hi : lo))
      }
    } else {
      for (let i = i0; i < i1; i++) {
        const x = plotX + ((i - i0) / (visible - 1 || 1)) * plotW
        const y = toY(trace.samples[i])
        if (i === i0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
  }
  ctx.restore()

  // ---- readouts ----
  ctx.font =
    '11px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'

  // Measure first and drop columns, rather than running off the edge on a phone.
  const windows = traces.map((t) => {
    if (t.quiet) return null
    const len = Math.max(0, Math.min(i1, t.samples.length) - i0)
    const out = new Float64Array(len)
    for (let i = 0; i < len; i++) out[i] = t.samples[i0 + i]
    return out
  })
  const build = (detail: 0 | 1 | 2) =>
    traces.map((t, k) => {
      const s = windows[k]
      if (!s || detail === 0) return t.label
      const vpp = formatSI(peakToPeak(s), unit + 'pp', 3)
      return detail === 1
        ? `${t.label} ${vpp}`
        : `${t.label} ${vpp} rms ${formatSI(rms(s), unit, 3)}`
    })
  const measure = (ls: string[]) =>
    ls.reduce((sum, l) => sum + 12 + ctx.measureText(l).width + 16, 0)
  let labels = build(2)
  if (measure(labels) > plotW) labels = build(1)
  if (measure(labels) > plotW) labels = build(0)

  let lx = plotX + 2
  traces.forEach((trace, k) => {
    ctx.fillStyle = trace.color
    ctx.fillRect(lx, PAD.top / 2 - 4, 8, 8)
    lx += 12
    ctx.fillText(labels[k], lx, PAD.top / 2)
    lx += ctx.measureText(labels[k]).width + 16
  })

  ctx.fillStyle = COLOR.text
  ctx.fillText(`${formatSI(vpd, unit, 3)}/div`, plotX + 2, h - PAD.bottom / 2)
  ctx.textAlign = 'right'
  ctx.fillText(
    `${formatSI((visible * dt) / DIV_X, 's', 3)}/div`,
    plotX + plotW - 2,
    h - PAD.bottom / 2,
  )
  ctx.textAlign = 'center'
  const mid: string[] = []
  if (center !== 0) mid.push(`offset ${formatSI(center, unit, 3)}`)
  if (view.span < 0.999) mid.push(`zoom ${(1 / view.span).toFixed(1)}x`)
  if (mid.length) ctx.fillText(mid.join('   '), plotX + plotW / 2, h - PAD.bottom / 2)
  ctx.textAlign = 'left'

  return autoVpd
}
