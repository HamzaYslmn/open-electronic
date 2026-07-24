import { createContext, useContext } from 'react'

/**
 * Deliberately minimal i18n.
 *
 * English source strings are themselves the lookup keys, so there is no en.ts to
 * maintain and any string without a Turkish entry falls back to English on its
 * own. Adding a language means adding one map below.
 */

export type Lang = 'en' | 'tr'

export const LANGS: ReadonlyArray<{ value: Lang; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'tr', label: 'TR' },
]

const tr: Record<string, string> = {
  // ---- shell ----
  'Simulators and calculators for electronics engineers':
    'Elektronik mühendisleri için simülatörler ve hesaplayıcılar',
  Catalogue: 'Katalog',
  'Filter simulators': 'Simülatörleri filtrele',
  'All simulators': 'Tüm simülatörler',
  'Toggle simulator list': 'Simülatör listesini aç/kapat',
  'No match.': 'Eşleşme yok.',
  'Loading simulator...': 'Simülatör yükleniyor...',
  'Not built yet.': 'Henüz hazır değil.',
  'Back to the catalogue': 'Katalog sayfasına dön',
  planned: 'planlandı',

  // ---- categories ----
  'Filters & Signals': 'Filtreler ve Sinyaller',
  Fundamentals: 'Temeller',
  Semiconductors: 'Yarı İletkenler',
  'Power Conversion': 'Güç Dönüşümü',
  'Energy & Thermal': 'Enerji ve Isı',
  'AC & Power Quality': 'AC ve Güç Kalitesi',
  'Embedded / ESP32': 'Gömülü / ESP32',
  'Sensors & Measurement': 'Sensörler ve Ölçüm',
  'PCB & Wiring': 'PCB ve Kablolama',

  // ---- page furniture ----
  'Where is it used?': 'Nerede kullanılır?',
  'The maths behind this page': 'Bu sayfanın arkasındaki matematik',
  'Scroll or pinch to zoom the time base, drag to pan, double click to reset.':
    'Zaman tabanını yakınlaştırmak için kaydırın veya sıkıştırın, kaydırmak için sürükleyin, sıfırlamak için çift tıklayın.',
  Timebase: 'Zaman tabanı',
  'Volts / div': 'Volt / bölme',
  Channels: 'Kanallar',
  Trace: 'İz',
  RESET: 'SIFIRLA',
  AUTO: 'OTO',
  'Zoom in': 'Yakınlaştır',
  'Zoom out': 'Uzaklaştır',
  Coarser: 'Daha kaba',
  Finer: 'Daha hassas',
  'Trace thickness': 'İz kalınlığı',

  // ---- common control labels ----
  Components: 'Bileşenler',
  Source: 'Kaynak',
  Waveform: 'Dalga şekli',
  Frequency: 'Frekans',
  'Amplitude (peak)': 'Genlik (tepe)',
  'DC offset': 'DC ofset',
  Duty: 'Görev oranı',
  'Cycles shown': 'Gösterilen çevrim',
  'Step height': 'Basamak yüksekliği',
  'Signal swing': 'Sinyal salınımı',
  Bipolar: 'Çift kutuplu',
  Resistor: 'Direnç',
  Capacitor: 'Kondansatör',
  Inductance: 'Endüktans',
  Supply: 'Besleme',
  Load: 'Yük',
  Current: 'Akım',
  Battery: 'Batarya',
  Sine: 'Sinüs',
  Square: 'Kare',
  Triangle: 'Üçgen',
  Sawtooth: 'Testere',
  'DC step': 'DC basamak',
  'Low pass': 'Alçak geçiren',
  'High pass': 'Yüksek geçiren',
  Series: 'Seri',
  Parallel: 'Paralel',
  External: 'Dış katman',
  Internal: 'İç katman',
}

const DICTS: Record<Lang, Record<string, string>> = { en: {}, tr }

/** Translate, falling back to the English key itself when no entry exists. */
export function translate(lang: Lang, key: string): string {
  return DICTS[lang][key] ?? key
}

export const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: 'en', setLang: () => {} })

/** `const t = useT()` then `t('Catalogue')`. */
export function useT(): (key: string) => string {
  const { lang } = useContext(LangContext)
  return (key: string) => translate(lang, key)
}

export function useLang() {
  return useContext(LangContext)
}

export const STORAGE_KEY = 'open-electronic-lang'
