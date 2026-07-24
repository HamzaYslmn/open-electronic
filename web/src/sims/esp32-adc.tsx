import { useMemo, useState } from 'react'
import { ADC_BITS } from '../engine/constants'
import { ADC_MAX_SOURCE_Z, ATTENUATION_OPTIONS, analyseAdc } from '../engine/sensing'
import type { Attenuation } from '../engine/sensing'
import { formatSI } from '../engine/units'
import { Group, Select } from '../ui/Controls'
import Param from '../ui/Param'
import { ReadoutGrid, Theory, Warning } from '../ui/Readout'
import SimPage from '../ui/SimPage'

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
      lede="Design a battery sense divider that fits the ADC's usable window without draining the pack. The ESP32 ADC is only linear over part of its nominal range, and its input needs a reasonably stiff source."
      controls={
        <>
          <Group label="Converter">
            <Select label="Attenuation" value={atten} onChange={setAtten} options={ATTENUATION_OPTIONS} />
          </Group>
          <Group label="Divider">
            <Param label="R1 (top)" unit="Ω" value={r1} onChange={setR1} min={0} max={10e6} log={false} step={1000} />
            <Param label="R2 (bottom)" unit="Ω" value={r2} onChange={setR2} min={1000} max={10e6} />
          </Group>
          <Group label="Battery">
            <Param label="Full voltage" unit="V" value={vBatMax} onChange={setVBatMax} min={1} max={30} log={false} step={0.1} />
            <Param label="Empty voltage" unit="V" value={vBatMin} onChange={setVBatMin} min={0.5} max={30} log={false} step={0.1} />
          </Group>
        </>
      }
    >
      <ReadoutGrid
        items={[
          { label: 'Full scale', value: formatSI(r.spec.fullScale, 'V'), note: `usable ${r.spec.usableLow} to ${r.spec.usableHigh} V` },
          { label: 'Volts per LSB', value: formatSI(r.lsbVolts, 'V'), note: `${ADC_BITS} bits` },
          { label: 'ADC at full battery', value: formatSI(r.vAdcMax, 'V'), warn: r.overRange },
          { label: 'ADC at empty battery', value: formatSI(r.vAdcMin, 'V'), warn: r.underRange },
          { label: 'Count at full', value: `${r.count} / 4095` },
          { label: 'Resolution at battery', value: formatSI(r.batteryResolution, 'V'), note: 'per count' },
          { label: 'Divider drain', value: formatSI(r.drain, 'A'), note: 'continuous' },
          { label: 'Drain per day', value: `${((r.dailyDrain / 3.6) | 0)} mAh` },
          { label: 'Source impedance', value: formatSI(r.sourceImpedance, 'Ω'), warn: r.tooStiff },
        ]}
      />

      {r.overRange && (
        <Warning>
          {formatSI(r.vAdcMax, 'V')} is above the {r.spec.usableHigh} V where this attenuation
          stays linear. Readings will compress and then clip near full charge, which is exactly
          where you most want accuracy. Increase R1 or pick a higher attenuation.
        </Warning>
      )}
      {r.underRange && (
        <Warning>
          {formatSI(r.vAdcMin, 'V')} is below the {r.spec.usableLow} V floor. The ESP32 ADC is
          badly non-linear near zero and will read a dead-flat value there.
        </Warning>
      )}
      {r.tooStiff && (
        <Warning>
          Source impedance of {formatSI(r.sourceImpedance, 'Ω')} is above the recommended{' '}
          {formatSI(ADC_MAX_SOURCE_Z, 'Ω')}. The sample-and-hold capacitor cannot charge in
          time, so readings come out low and depend on the sampling rate. Either lower the
          divider resistances or put a 100 nF capacitor across R2 to act as a charge reservoir.
        </Warning>
      )}

      <Theory>
        <p>
          The ESP32 ADC is 12 bits, so full scale divides into 4096 counts. The attenuator in
          front of it sets what full scale means: 0 dB gives about 1.1 V, 11 dB about 3.9 V.
          Only part of each range is linear, which is why the usable window is narrower than
          the nominal figure.
        </p>
        <p>
          A battery above the usable top needs a divider, <code>Vadc = Vbat·R2/(R1+R2)</code>.
          Dividing by two costs you half the resolution referred to the battery: each count is
          then worth <code>2·Vlsb</code>. That is usually fine, since a LiPo's whole useful
          range is 1.2 V and even halved that is over 600 counts.
        </p>
        <p>
          The tension is drain against impedance. A divider is connected permanently, so 100 kΩ
          plus 100 kΩ across 4.2 V wastes 21 µA continuously, which is more than an ESP32 in
          deep sleep. Going to megohms fixes that but breaks the ADC, whose input needs to
          charge a sampling capacitor. The usual answers are a MOSFET to switch the divider on
          only while measuring, or a capacitor across the bottom leg.
        </p>
        <p>
          Even done correctly this ADC is not precise. It has significant offset and gain
          error, varies part to part, and drifts with temperature. Use the factory calibration
          via esp_adc_cal, average many samples, and do not expect better than about 1%.
        </p>
      </Theory>
    </SimPage>
  )
}
