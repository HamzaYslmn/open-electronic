/**
 * One import for the whole UI kit. A simulator pulls everything it needs from
 * `'../ui'` instead of repeating seven module paths, so the top of every sim is
 * a single line and adding a primitive means editing one barrel, not 51 files.
 */
export { default as SimPage } from './SimPage'
export { default as Param } from './Param'
export type { ParamProps } from './Param'
export { Group, Segmented, Select, Toggle } from './Controls'
export { ReadoutGrid, Warning, Theory } from './Readout'
export type { ReadoutItem, WarnMsg } from './Readout'
export { default as Oscilloscope, TRACE_COLORS } from './Oscilloscope'
export type { Trace } from './Oscilloscope'
export { default as SourceControls, useSource, ESP32_SOURCE } from './SourceControls'
export type { SourceState } from './SourceControls'
export { Schematic, Dot } from './Schematic'
export { bandLabel } from './bands'
