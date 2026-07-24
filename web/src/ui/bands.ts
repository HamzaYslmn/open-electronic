import type { Key } from '../i18n'

/**
 * Plain-English reading of where a first-order filter is being driven, shared
 * by the RC and RL pages so the same wording is not written twice. Returns a
 * dictionary key, not text, so it stays translatable.
 */
export function bandLabel(isStep: boolean, ratio: number, pass: boolean): Key {
  if (isStep) return 'common.stepResponse'
  if (ratio < 0.1 || ratio > 10) return pass ? 'common.deepPassband' : 'common.deepStopband'
  return 'common.nearCorner'
}
