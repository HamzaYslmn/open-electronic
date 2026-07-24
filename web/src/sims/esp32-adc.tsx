import { useMemo, useState } from 'react'
import { ADC_BITS } from '../engine/constants'
import { ADC_MAX_SOURCE_Z, ATTENUATION_OPTIONS, analyseAdc } from '../engine/sensing'
import type { Attenuation } from '../engine/sensing'
import { formatSI } from '../engine/units'
import { T } from '../i18n'
import { Group, Param, ReadoutGrid, Select, SimPage, Theory, Warning } from '../ui'

export default function Esp32Adc() {
  const [atten, setAtten] = useState<Attenuation>('11')
  const [r1, setR1] = useState(100_000)
  const [r2, setR2] = useState(100_000)
  const [vBatMax, setVBatMax] = useState(4.2)
  const [vBatMin, setVBatMin] = useState(3.0)

  const r = useMemo(
    () => analyseAdc(atten, r1, r2, vBatMax, vBatMin),
    [atten, r1, r2, vBatMax, vBatMin],
  )

  return (
    <SimPage
      id="esp32-adc"
      lede="esp32-adc.lede"
      controls={
        <>
          <Group label="esp32-adc.converter">
            <Select label="esp32-adc.attenuation" value={atten} onChange={setAtten} options={ATTENUATION_OPTIONS} />
          </Group>
          <Group label="common.divider">
            <Param label="common.r1Top" unit="Ω" value={r1} onChange={setR1} min={0} max={10e6} log={false} step={1000} />
            <Param label="common.r2Bottom" unit="Ω" value={r2} onChange={setR2} min={1000} max={10e6} />
          </Group>
          <Group label="common.battery">
            <Param label="esp32-adc.fullVoltage" unit="V" value={vBatMax} onChange={setVBatMax} min={1} max={30} log={false} step={0.1} />
            <Param label="esp32-adc.emptyVoltage" unit="V" value={vBatMin} onChange={setVBatMin} min={0.5} max={30} log={false} step={0.1} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'esp32-adc.fullScale', value: formatSI(r.spec.fullScale, 'V'), note: <T k="esp32-adc.usableToV" vars={{ usableLow: r.spec.usableLow, usableHigh: r.spec.usableHigh }} /> },
          { label: 'esp32-adc.voltsPerLsb', value: formatSI(r.lsbVolts, 'V'), note: <T k="esp32-adc.bits" vars={{ ADC_BITS }} /> },
          { label: 'esp32-adc.adcAtFullBattery', value: formatSI(r.vAdcMax, 'V'), warn: r.overRange },
          { label: 'esp32-adc.adcAtEmptyBattery', value: formatSI(r.vAdcMin, 'V'), warn: r.underRange },
          { label: 'esp32-adc.countAtFull', value: `${r.count} / 4095` },
          { label: 'esp32-adc.resolutionAtBattery', value: formatSI(r.batteryResolution, 'V'), note: 'esp32-adc.perCount' },
          { label: 'esp32-adc.dividerDrain', value: formatSI(r.drain, 'A'), note: 'common.continuous' },
          { label: 'esp32-adc.drainPerDay', value: `${((r.dailyDrain / 3.6) | 0)} mAh` },
          { label: 'esp32-adc.sourceImpedance', value: formatSI(r.sourceImpedance, 'Ω'), warn: r.tooStiff },
        ]}
      />

      <Warning when={r.overRange}
        text="esp32-adc.warn1"
        vars={{ vAdcMax: formatSI(r.vAdcMax, 'V'), usableHigh: r.spec.usableHigh }}
      />
      <Warning when={r.underRange}
        text="esp32-adc.warn2"
        vars={{ vAdcMin: formatSI(r.vAdcMin, 'V'), usableLow: r.spec.usableLow }}
      />
      <Warning when={r.tooStiff}
        text="esp32-adc.warn3"
        vars={{
          sourceImpedance: formatSI(r.sourceImpedance, 'Ω'),
          ADC_MAX_SOURCE_Z: formatSI(ADC_MAX_SOURCE_Z, 'Ω'),
        }}
      />

      <Theory
        text={[
          'esp32-adc.theory1',
          'esp32-adc.aBatteryAboveThe',
          'esp32-adc.theTensionIsDrain',
          'esp32-adc.evenDoneCorrectlyThis',
        ]}
      />
    </SimPage>
  )
}
