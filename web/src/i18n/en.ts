/**
 * English source text, 1955 entries.
 *
 * Keys are short and stable, so rewording a sentence here does not break its
 * translation. Every key must exist in every other language file: tr.ts is
 * typed as Record<Key, string>, so a missing or misspelt key is a compile
 * error rather than a string that quietly renders in English.
 */
export const en = {
  'ac-impedance.3Db': '-3 dB',
  'ac-impedance.blurb': 'Series and parallel RLC impedance against frequency, magnitude and phase.',
  'ac-impedance.centreFrequency': 'Centre frequency',
  'ac-impedance.currentFrom1V': 'Current from 1 V',
  'ac-impedance.decadesShown': 'Decades shown',
  'ac-impedance.imaginaryPart': 'imaginary part',
  'ac-impedance.lede':
    'Impedance against frequency for an R, L and C together. The scope sweeps FREQUENCY logarithmically, not time: each horizontal division is a fixed fraction of a decade, centred on the frequency you set. Magnitude is in ohms, phase in degrees.',
  'ac-impedance.phase': 'phase',
  'ac-impedance.phase2': 'Phase',
  'ac-impedance.qMeasuresHowSharp':
    'Q measures how sharp that is: `Q = (1/R)·sqrt(L/C)` for series. Bandwidth follows as `f0/Q`. High Q means a narrow, selective peak and a large circulating current; low Q means a broad gentle one.',
  'ac-impedance.reactance': 'Reactance',
  'ac-impedance.reactanceIsFrequencyDependent':
    'Reactance is frequency dependent: `XL = 2·pi·f·L` rises with frequency and `XC = 1/(2·pi·f·C)` falls. Written as complex impedances they are `+jXL` and `-jXC`, so they subtract rather than add, and at one particular frequency they cancel entirely.',
  'ac-impedance.realPart': 'real part',
  'ac-impedance.thatIsResonanceF0':
    'That is resonance, `f0 = 1/(2·pi·sqrt(LC))`. In series the cancellation leaves only R, so impedance hits a minimum and current peaks. In parallel it is the admittances that cancel, so impedance hits a maximum and the network becomes a tank that draws almost nothing from the source while circulating a large current internally.',
  'ac-impedance.thePhaseTraceTells':
    'The phase trace tells you which element is winning. Below series resonance the capacitor dominates and current leads voltage, giving negative phase. Above it the inductor dominates and current lags. Exactly at f0 the network looks purely resistive, which is what makes it useful for matching and filtering.',
  'ac-impedance.title': 'AC Impedance',
  'ac-impedance.use':
    'Filter and matching network design, understanding why a decoupling capacitor stops working above its self-resonance, and why cable and load impedance matters at frequency. Any time a circuit behaves differently at 1 kHz and 1 MHz, this is why.',
  'ac-impedance.xc': 'XC',
  'ac-impedance.xl': 'XL',
  'ac-impedance.zAtFrequency': '|Z| at frequency',
  'antenna-length.58Wave': '5/8 wave',
  'antenna-length.at24Ghz':
    'At 2.4 GHz a quarter wave is about 31 mm, which is why chip and meander antennas are practical there and why an 868 MHz node needs a visibly long whip at about 86 mm. Getting the length wrong by 10% shifts resonance well outside a narrow band and can easily cost 10 dB, which is a factor of three in range.',
  'antenna-length.bandPreset': 'Band preset',
  'antenna-length.beforeShortening': 'before shortening',
  'antenna-length.blurb':
    'Quarter and half wave lengths for 433/868/915 MHz and 2.4 GHz, velocity factor included.',
  'antenna-length.conductor': 'Conductor',
  'antenna-length.dipoleEachLegIs': 'dipole, each leg is a quarter',
  'antenna-length.each4OrMore': 'each, 4 or more',
  'antenna-length.fullWave': 'Full wave',
  'antenna-length.groundRadial': 'Ground radial',
  'antenna-length.keepTheElementClear':
    'Keep the element clear of ground, metal and your hand. Detuning by proximity is the most common reason a bench-tested link fails once the board is in a case.',
  'antenna-length.lede':
    'Cut a wire whip to the right length. The physical element is always shorter than the free-space figure because the wave travels slower in and around the conductor.',
  'antenna-length.quarterWave': 'Quarter wave',
  'antenna-length.quarterWaveInFree': 'Quarter wave in free space',
  'antenna-length.slightlyMoreGain': 'slightly more gain',
  'antenna-length.theory1':
    'Wavelength is `lambda = c/f`. A quarter-wave element is resonant because the reflection from its open end arrives back at the feed in phase, presenting a real impedance of roughly 37 Ω over a perfect ground plane, which is a reasonable match to 50 Ω coax.',
  'antenna-length.thePhysicalLengthIs':
    'The physical length is always shorter than `lambda/4` in vacuum. The wave travels partly in the conductor and its surroundings, so the velocity factor applies: about 0.95 for a bare wire, 0.66 for typical coax dielectric, and nearer 0.55 for a microstrip trace where half the field sits in FR-4.',
  'antenna-length.theUsualWhip': 'the usual whip',
  'antenna-length.title': 'Antenna Length',
  'antenna-length.use':
    'Cutting a wire whip for a LoRa, WiFi or GPS module. It matters because a quarter wave is wavelength dependent and a 10% error can cost 10 dB, which is a factor of three in range. It also flags the ground plane requirement, which is why a bare whip on a small board performs so badly.',
  'antenna-length.velocityFactor': 'Velocity factor',
  'antenna-length.warn1':
    'A quarter-wave whip is only half an antenna. The other half is the ground plane, and without one the coax braid radiates instead, which detunes everything and makes performance depend on how you hold the board. Either give it radials, use a proper ground pour, or fit a half-wave dipole which needs no ground plane.',
  'antenna-length.wavelength': 'Wavelength',
  'battery.blurb': 'Discharge under load with internal resistance sag and Peukert derating.',
  'battery.cellCapacity': 'Cell capacity',
  'battery.cellsInParallel': 'Cells in parallel',
  'battery.chargeDelivered': 'Charge delivered',
  'battery.chemistry': 'Chemistry',
  'battery.cutoffVoltage': 'Cutoff voltage',
  'battery.energyDelivered': 'Energy delivered',
  'battery.lede':
    "Discharge a pack into a constant load and watch it sag. The scope plots terminal voltage against the open-circuit voltage over time: the gap between the two traces is the loss in the pack's own internal resistance.",
  'battery.lossInPack': 'Loss in pack',
  'battery.maxC': 'max {maxCRate} C',
  'battery.meanCurrent': 'Mean current',
  'battery.nominalVoltage': 'Nominal voltage',
  'battery.ocv': 'OCV',
  'battery.ofRatedAtThis': 'of rated at this rate',
  'battery.pack': 'Pack',
  'battery.packEfficiency': 'Pack efficiency',
  'battery.packResistance': 'Pack resistance',
  'battery.peukertSLawCaptures':
    "Peukert's law captures the fact that capacity is not a constant: `t = H·(C/(I·H))^k`. With k above 1, heavy discharge extracts less total charge. Lead acid is the worst offender at k around 1.2 to 1.3; lithium is close to 1.05, which is why a LiPo holds its rating far better under load.",
  'battery.peukertUsable': 'Peukert usable',
  'battery.power': 'Power',
  'battery.ratedCapacity': 'Rated capacity',
  'battery.resistiveAndConstantPower':
    'Resistive and constant-power loads behave differently as the pack drains. A resistor draws less current as voltage falls, so it tails off gently. A constant-power load draws *more* current as voltage falls, which accelerates the collapse at the end: this is exactly the behaviour of a switching regulator feeding an ESP32, and it is why the last few percent of a pack disappears so suddenly.',
  'battery.sP': '{series}S{parallel}P',
  'battery.startVoltage': 'Start voltage',
  'battery.theory1':
    'Terminal voltage is `V = OCV(depth) - I·Rint`. The open-circuit curve falls with depth of discharge, and the internal resistance subtracts a further drop proportional to current. That is the whole reason a battery reads 4.2 V at rest and 3.7 V the moment you load it.',
  'battery.title': 'Battery Simulator',
  'battery.use':
    'Predicting how long a device runs, and why the last stretch of a discharge collapses so quickly. The sag figure matters for anything with a burst load: an ESP32 transmitting pulls enough current that internal resistance drops the rail, which is a common cause of brownout resets on a tired cell.',
  'battery.vterm': 'Vterm',
  'battery.warn1':
    'The load asks for more power than this pack can ever deliver. Maximum power transfer caps it at `OCV² / (4·Rint)`, and past that no operating point exists at any voltage. Reduce the load or add cells in parallel to drop Rint.',
  'battery.warn2':
    'Drawing {cRate} C, past the {maxCRate} C continuous rating for {label}. Real cells overheat and age fast here, which this model does not simulate: it will happily show you a runtime you should not use.',
  'battery.warn3':
    'The pack is already below its cutoff at the first sample, so there is no usable runtime. The load is too heavy for this pack size.',
  'battery.worstSag': 'Worst sag',
  'bjt-switch.amplifier': 'Amplifier',
  'bjt-switch.baseCurrentIb': 'Base current IB',
  'bjt-switch.baseDrive': 'Base drive',
  'bjt-switch.baseResistorRb': 'Base resistor RB',
  'bjt-switch.bleed': '{dividerCurrent} bleed',
  'bjt-switch.blurb': 'Base drive for hard saturation, overdrive factor, plus common-emitter bias.',
  'bjt-switch.bypassReWithA': 'Bypass RE with a capacitor',
  'bjt-switch.collector': '{pCollector} collector',
  'bjt-switch.collectorCurrent': 'Collector current',
  'bjt-switch.collectorRc': 'Collector RC',
  'bjt-switch.commonEmitterAmplifier': 'common emitter amplifier',
  'bjt-switch.currentGainHfe': 'Current gain hFE',
  'bjt-switch.datasheetMinimumNotTypical':
    'Datasheet minimum, not typical. Saturation depends on the worst case.',
  'bjt-switch.dbInverting': '{avDb} dB, inverting',
  'bjt-switch.dividerStiffness': 'Divider stiffness',
  'bjt-switch.driveWaveform': 'Drive waveform',
  'bjt-switch.emitterRe': 'Emitter RE',
  'bjt-switch.emitterRe2': 'Emitter re',
  'bjt-switch.fromThereIcHfe':
    'From there `IC = hFE·IB`, `IE = (hFE+1)·IB` and `VCE = VCC - IC·RC - IE·RE`. Put VCE somewhere near the middle of the rail so the output can swing both ways.',
  'bjt-switch.ib': 'IB {ib}',
  'bjt-switch.inputSignal': 'Input signal',
  'bjt-switch.lede':
    'NPN low side switch driven from a 3V3 GPIO through RB. The scope shows the drive waveform and the collector voltage against time.',
  'bjt-switch.lede2':
    'Voltage divider biased common emitter on the 3V3 rail. The scope shows the base voltage and the inverted collector output against time.',
  'bjt-switch.loadPower': 'Load power',
  'bjt-switch.loadRail': 'Load rail',
  'bjt-switch.maxInputPeak': 'Max input (peak)',
  'bjt-switch.midbandGainIsAv':
    'Midband gain is `Av = -RC / (RE + re)` where `re = VT/IE` is the intrinsic emitter resistance, about 26 mV over the emitter current. With RE much larger than re this is the familiar `-RC/RE`, set by resistors and therefore stable. Bypassing RE shorts it at signal frequencies, leaving `-RC/re`: much more gain, but now it moves with bias current and temperature.',
  'bjt-switch.min': 'min {ibMin}',
  'bjt-switch.noGain': 'no gain',
  'bjt-switch.now': 'now {rb}',
  'bjt-switch.npnLowSideSwitch': 'NPN low side switch',
  'bjt-switch.operatingMode': 'Operating mode',
  'bjt-switch.outputSwingIsLimited':
    'Output swing is limited by whichever end runs out first, the rail at `IC·RC` above the Q point or saturation at `VCE - VCEsat` below it. The trace applies the midband gain sample by sample and clips there, so it shows the headroom honestly, though a real stage clips softly at cutoff and the coupling capacitor rolls off the low end.',
  'bjt-switch.overdriveFactor': 'Overdrive factor',
  'bjt-switch.quiescentIc': 'Quiescent IC',
  'bjt-switch.r1RailToBase': 'R1 (rail to base)',
  'bjt-switch.r2BaseToGnd': 'R2 (base to gnd)',
  'bjt-switch.rbDissipation': 'RB dissipation',
  'bjt-switch.rbForOdf': 'RB for ODF {ODF_TARGET}',
  'bjt-switch.rcRoIgnored': 'RC, ro ignored',
  'bjt-switch.saturatedDissipationIsP':
    'Saturated dissipation is `P = VCEsat·IC + VBE·IB`, a few milliwatts here. In the active region VCE is volts rather than 0.2 V and the same current turns into heat, which is how switching transistors die.',
  'bjt-switch.stage': 'Stage',
  'bjt-switch.supplyAndBias': 'Supply and bias',
  'bjt-switch.supplyVcc': 'Supply VCC',
  'bjt-switch.swing': 'swing {swing}',
  'bjt-switch.switch2': 'Switch',
  'bjt-switch.theBaseResistorSets':
    'The base resistor sets everything: `IB = (Vin - VBE) / RB` with VBE taken as 0.7 V. The transistor can then deliver `IC = hFE·IB`, but the load only asks for `IC(sat) = (Vload - VCEsat) / RL`. Whichever is smaller wins.',
  'bjt-switch.theDividerIsSolved':
    'The divider is solved as its Thevenin equivalent, `VTH = VCC·R2/(R1+R2)` and `RTH = R1||R2`, so the base loop gives `IB = (VTH - VBE) / (RTH + (hFE+1)·RE)`. That is the exact answer, not the "assume IB is negligible" shortcut, which is why a floppy divider shows up here as a shifted Q point instead of reading correct.',
  'bjt-switch.theOverdriveFactorIs':
    'The overdrive factor is the ratio, `ODF = IB·hFE / IC(load)`. Below 1 the transistor never saturates and sits in the active region dropping volts across itself. Design for ODF of about {ODF_TARGET} so worst case hFE, cold silicon and a heavier load still leave it hard on.',
  'bjt-switch.theTraceIsA':
    'The trace is a per-sample algebraic solve. There is no storage element in this model, so edges are instant: a real device adds a turn-off storage time of hundreds of nanoseconds, which is exactly what heavy overdrive makes worse.',
  'bjt-switch.title': 'BJT as Switch / Amplifier',
  'bjt-switch.transistorDissipation': 'Transistor dissipation',
  'bjt-switch.use':
    'Driving a relay, a buzzer, a motor or an LED string from a microcontroller pin that cannot supply the current. The overdrive factor is the point: a transistor that is not driven hard into saturation dissipates far more than expected and gets hot, which is the usual cause of a switching transistor failing in a hobby circuit.',
  'bjt-switch.vb': 'Vb',
  'bjt-switch.vbVeVc': 'VB / VE / VC',
  'bjt-switch.vce': 'Vce',
  'bjt-switch.vce2': 'VCE',
  'bjt-switch.vdrive': 'Vdrive',
  'bjt-switch.voltageGainAv': 'Voltage gain Av',
  'bjt-switch.vtIe': 'VT / IE',
  'bjt-switch.warn1':
    'Not saturated at {driveHigh} of drive: hFE·IB gives only {icAvailable} against the {icSat} the load wants, so the device sits in the active region at {vce} and burns {pCollector}. Drop RB to {rbForTarget} or below.',
  'bjt-switch.warn2':
    'Base current is {ib}, past the {GPIO_MAX_MA} mA an ESP32 pin will source. Raise RB or drive the base from a buffer.',
  'bjt-switch.warn3':
    'Biased into saturation: VCE is pinned at {vce} and there is no headroom left to swing. Lower RC or R2, or raise RE.',
  'bjt-switch.warn4':
    'Cut off: the divider only puts {vth} on the base, under the 0.7 V the junction needs. Raise R2 or lower R1.',
  'bjt-switch.warn5':
    'Divider is not stiff: it bleeds only {stiffness}x IB, so the bias point moves with hFE and temperature. Aim for 10x, i.e. lower R1 and R2 together.',
  'bjt-switch.warn6':
    'Input of {amplitude} peak exceeds the {maxInput} this Q point can amplify without clipping, which is the flat top on the trace.',
  'boost.atThisLoadWith': 'at this load, with {ron} in series',
  'boost.blurb': 'Step-up duty, switch stress and inductor sizing.',
  'boost.boostConverterPowerStage': 'Boost converter power stage',
  'boost.coutEsr': 'Cout ESR',
  'boost.datasheetSaturationCurrentNot': 'Datasheet saturation current, not the RMS rating.',
  'boost.dcmBelowOfLoad': 'DCM below {ioutBoundary} of load',
  'boost.diodeDropVd': 'Diode drop Vd',
  'boost.diodeReverseStress': 'Diode reverse stress',
  'boost.dutyD': 'Duty D',
  'boost.fromCFromEsr': '{vRippleCap} from C, {vRippleEsr} from ESR',
  'boost.highestVoutReachable': 'Highest Vout reachable',
  'boost.ideal1VinVout': 'ideal 1 - Vin/Vout = {dutyIdeal}',
  'boost.iDiode': 'I diode',
  'boost.inductorIsat': 'Inductor Isat',
  'boost.inductorL': 'Inductor L',
  'boost.inputCurrentIin': 'Input current Iin',
  'boost.iSwitch': 'I switch',
  'boost.lede':
    'Steady-state inductor current in a step-up converter. The horizontal axis is time, a few switching periods wide. Sky is the inductor, green is what the switch pulls to ground, amber is what the diode hands to the output cap: the gap between those two is why the input current runs higher than the output current.',
  'boost.lNeededForCcm': 'L needed for CCM',
  'boost.loadIout': 'Load Iout',
  'boost.noSteadyState': 'no steady state',
  'boost.off': 'off {toff}',
  'boost.ofIinAimFor': '{rippleRatio} of Iin, aim for {RIPPLE_TARGET}',
  'boost.onceTheValleyCurrent':
    'Once the valley current would go negative the diode has already turned off and the converter is in discontinuous conduction. The duty then follows from `Iout = Vin²·D²/(2·L·fsw·(Vout - Vin))`, i.e. `D = sqrt(2·L·fsw·Iout·(Vout - Vin))/Vin`. The boundary sits at `Iout = Vin·D(1-D)/(2·fsw·L)`.',
  'boost.outConductionLoss': '{pout} out, {ploss} conduction loss',
  'boost.outputCout': 'Output Cout',
  'boost.rateItFor': 'rate it for {vDiodeStress}',
  'boost.realParts': 'Real parts',
  'boost.rippleIsJustThe':
    'Ripple is just the ramp: with `Vin` across the inductor for `ton = D/fsw`, `dIL = Vin·D/(fsw·L)` peak to peak, sitting on top of `Iin`. What matters for the inductor is the peak, `Iin + dIL/2`, because that is what saturates the core. Output ripple is `Iout·D/(fsw·Cout)` from the charge the cap gives up while the diode is off, plus `Ipeak·ESR` from the current step, which in a real design is usually the bigger of the two.',
  'boost.schottky03To': 'Schottky 0.3 to 0.5 V, silicon 0.7 V, sync rectifier near 0.',
  'boost.scope': 'Scope',
  'boost.switchingFsw': 'Switching fsw',
  'boost.switchingPeriodsShown': 'Switching periods shown',
  'boost.switchRdsOn': 'Switch Rds(on)',
  'boost.switchRmsDiodeAvg': 'switch {iswRms} rms, diode {iout} avg',
  'boost.switchVoltageStress': 'Switch voltage stress',
  'boost.theDropsAreFolded':
    "The drops are folded in rather than bolted on. Volt-second balance with the diode drop Vd, the switch drop Iin·Rds(on) and the winding drop Iin·DCR, substituting Iin = Iout/(1-D), is a quadratic in `x = 1-D`: `x²(Vout+Vd) - x(Vin + Iout·Ron) + Iout(DCR+Ron) = 0`. The larger root is the real operating point. When the discriminant goes negative there is no solution at all: that is the ceiling `Vout_max = (Vin + Iout·Ron)²/(4·Iout·(DCR+Ron)) - Vd`, which with no switch drop is Erickson's `M_max = 0.5·sqrt(R/R_L)`. A boost cannot give infinite gain, and real parts stop it long before D reaches 1.",
  'boost.theLoadAvgInductor': '{iout} the load, avg inductor current',
  'boost.theory1':
    'In steady state the inductor has to reset every cycle, so the volt-seconds put in must come back out: `Vin·D·T = (Vout - Vin)·(1-D)·T`, which rearranges to `D = 1 - Vin/Vout`. The output cap has the matching constraint on charge: the diode only conducts for `(1-D)` of the period, so the average inductor current is `Iin = Iout/(1-D)`. Power in equals power out, so stepping the voltage up steps the input current up by the same ratio. That current runs through the inductor, the switch and the diode, which is why a boost stresses its parts far harder than its output rating suggests.',
  'boost.theTraceIsNot':
    'The trace is not integrated. Inside a switching period the inductor current is exactly two straight lines, so it is evaluated from the closed-form corner points at whatever sample spacing the scope needs. Dragging fsw or L across decades changes the detail on screen but nothing can accumulate or diverge.',
  'boost.title': 'Boost Converter',
  'boost.use':
    'Running something from a battery that is below the voltage it needs: 3.7 V lithium up to 5 V, or two AA cells up to 3.3 V. The catch this page makes visible is input current, which is always higher than output current, so a boost from a nearly flat cell draws far more than beginners expect.',
  'boost.valleyIsat': 'valley {ivalley}, Isat {isat}',
  'boost.voutVdSoRate': 'Vout + Vd, so rate it for {vSwitchStress}',
  'boost.warn1':
    'Vout of {vout} is not above the {vin} input, so there is nothing for a boost to do. With the switch off the inductor and diode are just a lossy wire and the output sits at Vin minus a diode drop. Use a buck stage below the input, or a buck-boost if the input crosses the output.',
  'boost.warn2':
    '{ron} of series resistance caps this stage at {voutMax} into a {iout} load, so {vout} is unreachable at any duty. Past the peak, more duty means less output: the inductor spends so long disconnected from the load that the extra I²R loss beats the extra energy stored. Lower the load, use a lower DCR inductor or a better switch.',
  'boost.warn3':
    'D = {duty} is past the {MAX_PRACTICAL_DUTY} where this model is worth trusting. The diode only conducts for {toff} per cycle, so the peak currents and the I²R losses climb fast, the right-half-plane zero drops to where the loop is hard to compensate, and most controllers clamp the duty here anyway. Raise Vin, or use a two-stage or transformer-coupled topology.',
  'boost.warn4':
    'Peak current {ipeak} is over the {isat} saturation rating. A saturated core loses inductance, so the current ramp goes near vertical and the switch sees a spike this linear model does not predict. Every number above is optimistic. Use a bigger inductor, raise fsw or pick a higher Isat part.',
  'boost.warn5':
    'The inductor empties every cycle, so this is discontinuous conduction and D = 1 - Vin/Vout no longer applies. The duty above is the DCM solution instead. Output ripple and the peak current are both worse than the CCM formulas suggest, and the loop gain changes shape. Above {ioutBoundary} of load, or above {lBoundary} of inductance, it goes back to CCM.',
  'boost.warn6':
    'Ripple is {rippleRatio} of the average input current. The usual target is 30 to 40%: past that the peak current, the core loss and the output ripple all grow for no benefit. Raise L or fsw.',
  'boost.youHave': 'you have {l}',
  'buck-boost.4Switch': '4-switch',
  'buck-boost.blurb': 'Inverting and four-switch topologies across the full input range.',
  'buck-boost.capEsr': 'cap {vRippleCap} + esr {vRippleEsr}',
  'buck-boost.cinRippleCurrent': 'Cin ripple current',
  'buck-boost.conversionRatio': 'Conversion ratio',
  'buck-boost.coutRippleCurrent': 'Cout ripple current',
  'buck-boost.currentHitsZero': 'current hits zero',
  'buck-boost.designTarget': 'design target',
  'buck-boost.forceBothLegs': 'Force both legs',
  'buck-boost.inductorAverage': 'Inductor average',
  'buck-boost.inductorPeak': 'Inductor peak',
  'buck-boost.irect': 'Irect',
  'buck-boost.isat': 'Isat {isat}',
  'buck-boost.isw': 'Isw',
  'buck-boost.lAtDcmBoundary': 'L at DCM boundary',
  'buck-boost.lede':
    'A converter that works whether the input is above or below the output, which is exactly the ESP32-on-a-LiPo problem: a cell runs 4.2 V down to 3.0 V while the rail must hold 3.3 V. The scope shows inductor, switch and rectifier current over a few switching periods.',
  'buck-boost.lFor40Ripple': 'L for 40% ripple',
  'buck-boost.loss': 'loss {total}',
  'buck-boost.ofAverage': '{rippleRatio}% of average',
  'buck-boost.outputRippleHasTwo':
    'Output ripple has two parts that do not peak together: the capacitor term `dIL/(8·fsw·C)` and the ESR term `dIL·ESR`. In most real designs with ceramic output caps the ESR term is small, but with electrolytics it dominates completely.',
  'buck-boost.rectifierStress': 'Rectifier stress',
  'buck-boost.rippleIsDilVl':
    'Ripple is `dIL = vL(on)·D/(fsw·L)`. Aim for 30 to 40% of the average current: less means a bulky inductor, more pushes the peak toward saturation and raises RMS heating. When ripple exceeds twice the average, current hits zero and the converter drops into discontinuous conduction.',
  'buck-boost.rms': 'RMS',
  'buck-boost.switchStress': 'Switch stress',
  'buck-boost.theFourSwitchStage':
    'The four-switch stage puts a buck leg and a boost leg around one inductor. It keeps the output positive and, crucially, runs as a plain buck when Vin is comfortably above Vout and a plain boost when it is below, only using both legs in the narrow band between. That is why it is far more efficient than the inverting stage: in either single-leg mode only one pair of switches is chopping.',
  'buck-boost.theory1':
    'The inverting buck-boost gives `Vout = -Vin·D/(1-D)`, so duty is `D = |Vout|/(|Vout| + Vin)`. It steps up or down freely, but the output is negative and both switch and rectifier stand off `Vin + |Vout|`.',
  'buck-boost.title': 'Buck-Boost Converter',
  'buck-boost.use':
    'The classic single-lithium-cell problem: a cell runs 4.2 V down to 3.0 V while the rail must hold 3.3 V, so the converter must step both down and up over the discharge. Also used in car electronics where 12 V sags on cranking and spikes on load dump.',
  'buck-boost.vout': '|Vout|',
  'buck-boost.warn1':
    'Losses put this output out of reach at this load: the duty needed exceeds what the stage can hold. Lower the load current, raise the input, or cut the resistive losses (lower DCR and Rds(on)).',
  'buck-boost.warn2':
    'Peak inductor current {ilPeak} is past the {isat} saturation rating. A saturated inductor loses inductance, so current runs away within a single switching cycle. Choose a larger core or raise L.',
  'buck-boost.warn3':
    'Duty is outside the range a real controller can hold. Near 0 or 1 the on-time approaches the minimum pulse width and the output collapses or pulse-skips.',
  'buck-boost.warn4':
    'Running in discontinuous conduction: inductor current reaches zero each cycle. The conversion ratio then depends on load, not just duty, so the output moves as the load changes and the control loop gets harder.',
  'buck.blurb': 'Duty, inductor ripple, output ripple and the CCM/DCM boundary.',
  'buck.boundaryAt': '(boundary at {boundary})',
  'buck.buckConverterWithA': 'buck converter with a {rectifier}',
  'buck.catchDiode': 'catch diode',
  'buck.copperResistanceOfThe': 'Copper resistance of the winding, from the inductor datasheet.',
  'buck.dutyCycleD': 'Duty cycle D',
  'buck.efficiencyIsAFirst':
    'Efficiency is a first-order budget, not a simulation: `Irms²·DCR` in the winding, `Irms²·Rds(on)` in each FET weighted by its conduction time or `Vf·Iout·(1-D)` for a catch diode, plus hard switching loss `0.5·Vin·I·(tr+tf)·fsw` and the controller quiescent draw. Gate charge, core loss, dead time and layout parasitics are not modelled, so expect the real board to land a couple of points lower.',
  'buck.icap': 'Icap',
  'buck.idealVoutVin': '(ideal Vout/Vin {dutyIdeal} %)',
  'buck.inductorRippleIl': 'Inductor ripple ΔIL',
  'buck.inOut': '({pin} in, {pout} out)',
  'buck.iout': 'Iout',
  'buck.keepIsatAboveThis': '(keep Isat above this)',
  'buck.lede':
    'Inductor current through one switching period. The horizontal axis is time inside the switching cycle, not the output waveform, so a full trace is a few microseconds wide.',
  'buck.lossCatchDiode': 'Loss: catch diode',
  'buck.lossHighSideFet': 'Loss: high side FET',
  'buck.lossInductorDcr': 'Loss: inductor DCR',
  'buck.lossLowSideFet': 'Loss: low side FET',
  'buck.lossSwitching': 'Loss: switching',
  'buck.lost': '({total} lost)',
  'buck.lowSideDevice': 'Low side device',
  'buck.ofLoad': '({rippleRatio}% of load)',
  'buck.ofVout': '({voutRatio}% of Vout)',
  'buck.outputRippleVout': 'Output ripple ΔVout',
  'buck.parasitics': 'Parasitics',
  'buck.period': '(period {fsw})',
  'buck.rippleSplitCEsr': 'Ripple split C / ESR',
  'buck.scalesWithFsw': '(scales with fsw)',
  'buck.schottky': 'Schottky',
  'buck.synchronous': 'Synchronous',
  'buck.synchronousFet': 'synchronous FET',
  'buck.theory1':
    'Volt-second balance says the inductor must gain as much current in the on time as it loses in the off time, so `Von·D = Voff·(1-D)` and `D = Voff / (Von + Voff)`. With no losses that is the familiar `D = Vout / Vin`. This page keeps the switch, diode and winding drops inside Von and Voff, which is why the reported duty sits slightly above the ideal ratio.',
  'buck.theRampGivesThe':
    'The ramp gives the ripple directly: `ΔIL = Voff·(1-D) / (fsw·L)`, i.e. `Vout·(1-D)/(fsw·L)` in the ideal case. The capacitor swallows the triangular part of that current, and integrating half a triangle of charge gives `ΔVout = ΔIL / (8·fsw·C)`. Real ESR adds `ΔIL·ESR` on top, which on an electrolytic is usually the larger of the two.',
  'buck.theTraceIsThe':
    'The trace is the closed-form piecewise-linear solution of `di/dt = v/L` evaluated per sample, so it stays exact and periodic at any switching frequency the sliders reach.',
  'buck.theValleyCurrentIs':
    'The valley current is `Iout - ΔIL/2`, so at `Iout = ΔIL/2` the current just touches zero. Below that boundary the converter is discontinuous and the duty collapses to `D = sqrt(2·L·fsw·Iout·Voff / (Von·(Von+Voff)))`.',
  'buck.title': 'Buck Converter',
  'buck.use':
    'Stepping a higher rail down efficiently: 12 V to 5 V, 5 V to 3.3 V, battery to logic. This is how nearly every ESP32 board makes its 3.3 V rail from USB. The inductor ripple and CCM/DCM boundary decide whether the converter is quiet and well behaved or noisy and load dependent.',
  'buck.valleyCurrent': 'Valley current',
  'buck.warn1':
    'Dropout: Vin is at or below Vout plus the switch and winding drops. The high side switch sits at 100% duty, there is no switching left to model, and the output just follows the input.',
  'buck.warn2':
    'Discontinuous conduction: the load is below {boundary}, so the inductor current hits zero every cycle. Duty no longer tracks Vout/Vin, the loop gain changes, and a diode version will ring on the switch node once the current stops. Raise L or fsw to push the boundary down.',
  'buck.warn3':
    'Ripple is {rippleRatio}% of the load current. The usual design target is 20 to 40%: more than that wastes inductor headroom and pushes the peak toward saturation.',
  'capacitor.1090Transition': '10-90% transition',
  'capacitor.2197Tau': '(2.197·tau)',
  'capacitor.at': 'at {supply}',
  'capacitor.atT0V': '(at t = 0, V/R)',
  'capacitor.bank': 'Bank',
  'capacitor.bankCapacitance': 'Bank capacitance',
  'capacitor.bankTopology': 'Bank topology',
  'capacitor.blurb': 'Series/parallel, stored energy, charge and discharge curves.',
  'capacitor.capacitorsIn': 'Capacitor bank schematic',
  'capacitor.charge': 'Charge',
  'capacitor.chargingACapacitorThrough':
    'Charging a capacitor through a resistor always dissipates `0.5·C·V²` in that resistor, exactly as much as ends up stored, no matter how large or small R is. That is why linear charging tops out at 50% efficient and why switchers exist.',
  'capacitor.chargingThroughRFollows':
    'Charging through R follows `v(t) = V·(1 - e^(-t/RC))` and discharging follows `v(t) = V0·e^(-t/RC)`. Inverting the first gives `t = -R·C·ln(1 - v/V)`, which is where the time-to-target figure comes from. One tau is 63.2%, two is 86.5%, five is 99.3%, and the rail itself is an asymptote the curve never actually touches.',
  'capacitor.curve': 'Curve',
  'capacitor.direction': 'Direction',
  'capacitor.discharge': 'Discharge',
  'capacitor.energyAtTarget': 'Energy at target',
  'capacitor.equalsTheStoredEnergy': '(equals the stored energy, whatever R is)',
  'capacitor.esp32InputHighThreshold': 'ESP32 input-high threshold is about 2.48 V on a 3V3 rail.',
  'capacitor.fullRailOnEvery': '(full rail on every member)',
  'capacitor.highestMemberVoltage': 'Highest member voltage',
  'capacitor.in': '({values} in {mode})',
  'capacitor.inASeriesString':
    'In a series string the voltage divides inversely with capacitance, `Vi = V·Ctotal/Ci`, so the smallest capacitor takes the most volts. That is the usual failure mode when caps are stacked for a higher working voltage.',
  'capacitor.lede':
    'Combine a bank, read its stored energy, and watch it charge or discharge through a resistor. The scope axis is time from the switch closing.',
  'capacitor.lossInRPer': 'Loss in R per charge',
  'capacitor.neverTargetIsPast': '(never, target is past the asymptote)',
  'capacitor.ofFull': '({e}% of full)',
  'capacitor.settled5Tau': 'Settled (5 tau)',
  'capacitor.startingVoltage': 'Starting voltage',
  'capacitor.storedCharge': 'Stored charge',
  'capacitor.storedEnergy': 'Stored energy',
  'capacitor.storedEnergyIsE':
    'Stored energy is `E = 0.5·C·V²` and stored charge is `Q = C·V`. Energy is quadratic in voltage, so half the rail holds a quarter of the energy.',
  'capacitor.targetVoltage': 'Target voltage',
  'capacitor.theory1':
    'Parallel capacitors add plate area, so `C = C1 + C2 + ...`. In series every capacitor carries the same charge and the voltages add, so `1/C = 1/C1 + 1/C2 + ...` and the total is smaller than the smallest member.',
  'capacitor.theScopeSamplesThose':
    'The scope samples those closed forms directly rather than integrating, so the trace is exact at any zoom and cannot go unstable when dt exceeds tau.',
  'capacitor.thirdCapacitor': 'Third capacitor',
  'capacitor.timeToFallTo': 'Time to fall to target',
  'capacitor.timeToReachTarget': 'Time to reach target',
  'capacitor.title': 'Capacitor Calculator',
  'capacitor.use':
    'Sizing decoupling and bulk capacitors, timing networks, energy storage for a burst load such as a radio transmission, and working out how long a supply rail holds up after power is removed. The energy figure is what tells you whether a capacitor can carry an ESP32 through a WiFi transmit spike.',
  'capacitor.vAcrossR': 'V across R',
  'capacitor.warn1':
    'Inrush is {peakCurrent}, over the {GPIO_MAX_MA} mA an ESP32 GPIO is rated for. An uncharged capacitor is a short circuit at t = 0, so drive it through a bigger resistor or a transistor.',
  'capacitor.warn2':
    'The target is above the supply, so the curve never reaches it. Nothing above the rail is reachable through a passive RC.',
  'capacitor.warn3':
    'The string is unbalanced. Series capacitors share charge, not voltage, so the smallest member sits at {maxMemberVoltage} of the applied {supply} instead of an even {values}. Check it against its voltage rating, or add balancing resistors across each cap.',
  'cat.acPowerQuality': 'AC & Power Quality',
  'cat.embeddedEsp32': 'Embedded / ESP32',
  'cat.energyThermal': 'Energy & Thermal',
  'cat.filtersSignals': 'Filters & Signals',
  'cat.fundamentals': 'Fundamentals',
  'cat.pcbWiring': 'PCB & Wiring',
  'cat.powerConversion': 'Power Conversion',
  'cat.semiconductors': 'Semiconductors',
  'cat.sensorsMeasurement': 'Sensors & Measurement',
  'coil.3v3ByDefaultMost': '3V3 by default. Most relay coils are 5 V or 12 V parts.',
  'coil.aFlybackDiodeAcross':
    'A flyback diode across the coil gives the current a loop to run in. The switch node is then held at `Vsupply + Vf`, i.e. under a volt above the rail. The current freewheels down against the diode drop, `i(t) = (I + Vf/R)·e^(-t·R/L) - Vf/R`, reaching zero at `t = (L/R)·ln(1 + I·R/Vf)`. That is the catch: the clamp is why a relay with a plain diode drops out slowly. A Schottky clamps lower, a zener or a resistor in series with the diode releases faster at the cost of a higher switch voltage.',
  'coil.at': 'at {frequency}',
  'coil.atTheDriveFrequency':
    'At the drive frequency the winding also presents `XL = 2·pi·f·L`, so the coil impedance is `|Z| = sqrt(R² + XL²)`. That is what limits current once you PWM the coil rather than switching it once.',
  'coil.blurb': 'Current ramp, stored energy and the kickback a coil produces when switched.',
  'coil.bothPhasesOfThe':
    'Both phases of the trace step with exact zero-order-hold discretisation, `i[n] = I∞ + (i[n-1] - I∞)·e^(-dt/tau)`, so the samples sit on the analytic curve at any step size instead of ringing or diverging the way forward Euler does when dt passes tau.',
  'coil.clampDissipation': 'Clamp dissipation',
  'coil.clampedTo': 'Clamped to',
  'coil.coil': 'Coil',
  'coil.coilImpedanceZ': 'Coil impedance |Z|',
  'coil.currentSwing': 'Current swing',
  'coil.fallsToZeroEach': '(falls to zero each cycle)',
  'coil.flybackClamp': 'Flyback clamp',
  'coil.freewheelToZero': 'freewheel to zero',
  'coil.howFastTheSwitch': 'How fast the switch opens. This alone sets di/dt.',
  'coil.iCoil': 'I coil',
  'coil.iNoDiode': 'I no diode',
  'coil.kickUnclamped': 'Kick, unclamped',
  'coil.lede':
    'A relay or solenoid coil switched by a low-side transistor. The scope plots coil current against time across the switching cycle. Watch the ramp fill the core, then watch what the coil does to the transistor when the switch opens.',
  'coil.lowSideSwitchedCoil': 'Low side switched coil',
  'coil.neverReachesZero': '(never reaches zero)',
  'coil.noFreewheelPath': 'no freewheel path',
  'coil.nothingFitted': 'nothing fitted',
  'coil.ofIsat': '{satPercent}% of Isat',
  'coil.pastTheRatingOf':
    ', past the {vBreakdown} rating of the switch. The transistor avalanches and takes the energy as heat, usually once.',
  'coil.peak': 'peak {iPeak}',
  'coil.releaseTime': 'Release time',
  'coil.saturationHeadroom': 'Saturation headroom',
  'coil.steadyCurrent': 'Steady current',
  'coil.storedEnergyAtPeak': 'Stored energy at peak',
  'coil.supplyVf': 'supply + Vf ({vf})',
  'coil.switchAndClamp': 'Switch and clamp',
  'coil.switchSees': 'switch sees {vSwitchOpen}',
  'coil.switchTurnOff': 'switch turn-off',
  'coil.switchVceoRating': 'Switch Vceo rating',
  'coil.thatCurrentIsEnergy':
    'That current is energy in the core, `E = 0.5·L·I²`. Open the switch and the energy has nowhere to go, so the coil produces whatever voltage keeps the current flowing: `Vkick = L·di/dt`. Turn off 44 mA through 100 mH in one microsecond and that is over 4 kV. The switch, not the coil, is what fails.',
  'coil.thatIsInsideThe': '. That is inside the rating here, but only because the coil is small.',
  'coil.theory1':
    'Closing the switch puts the supply across a series RL. Current cannot step, so it ramps: `i(t) = (V/R)·(1 - e^(-t·R/L))` with time constant `tau = L/R`. It is 63.2% of the way there after one tau and 99.3% after five, exactly like a capacitor charging, with current and voltage swapped.',
  'coil.timeConstantLR': 'Time constant L/R',
  'coil.title': 'Coil / Inductor Simulator',
  'coil.turnOffTime': 'Turn-off time',
  'coil.use':
    'Relays, solenoids, motors and switch-mode converters. The critical output is the kickback: interrupting current through an inductor produces a voltage spike that destroys the transistor doing the switching. This shows how big that spike is and what a flyback diode clamps it to, which is why that diode is not optional.',
  'coil.vVsatR': '(V - Vsat) / R',
  'coil.warn1':
    'No clamp fitted. Interrupting {iPeak} through {l} in {turnOff} drives the collector to {vSwitchOpen}{small} Real boards clamp it anyway: winding capacitance is the only thing holding this number finite.',
  'coil.warn2':
    'Even clamped, the switch sits at {vSwitchClamped}, above its {vBreakdown} rating. The diode is not the problem, the supply is.',
  'coil.warn3':
    'Peak current is {satPercent}% of the {iSat} saturation point. Past saturation the inductance collapses, the ramp goes near vertical and the real current overshoots everything shown here. This model assumes L is constant, so treat the trace as optimistic.',
  'coil.warn4':
    '{iPeak} is well past the {GPIO_MAX_MA} mA an ESP32 pin can sink. The transistor in the schematic is not optional, and the pin drives its base or gate only.',
  'coil.whereTheCoreGives': 'Where the core gives up and L collapses.',
  'coil.windingDcr': 'Winding DCR',
  'coil.windingDissipation': 'Winding dissipation',
  'common.33VIs': '3.3 V is the ESP32 rail.',
  'common.activeCurrent': 'Active current',
  'common.activeTime': 'Active time',
  'common.actualCurrent': 'Actual current',
  'common.ambient': 'Ambient',
  'common.averageCurrent': 'Average current',
  'common.bandwidth': 'Bandwidth',
  'common.battery': 'Battery',
  'common.bus': 'Bus',
  'common.capacitance': 'Capacitance',
  'common.capacitor': 'Capacitor',
  'common.capacity': 'Capacity',
  'common.capEsr': 'Cap ESR',
  'common.ccm': 'CCM',
  'common.cellsInSeries': 'Cells in series',
  'common.circuit': 'Circuit',
  'common.components': 'Components',
  'common.conduction': 'Conduction',
  'common.conductionMode': 'Conduction mode',
  'common.continuous': 'continuous',
  'common.cRate': 'C rate',
  'common.crossSection': 'Cross-section',
  'common.current': 'Current',
  'common.currentDensity': 'Current density',
  'common.cutoffFc': 'Cutoff fc',
  'common.cyclesShown': 'Cycles shown',
  'common.dcm': 'DCM',
  'common.dcOffset': 'DC offset',
  'common.diameter': 'Diameter',
  'common.diodeVf': 'Diode Vf',
  'common.dissipation': 'Dissipation',
  'common.divider': 'Divider',
  'common.dividerCurrent': 'Divider current',
  'common.dividerOutput': 'Divider output',
  'common.drive': 'Drive',
  'common.duty': 'Duty',
  'common.dutyCycle': 'Duty cycle',
  'common.dutyRegister': 'Duty register',
  'common.efficiency': 'Efficiency',
  'common.fetRdsOn': 'FET Rds(on)',
  'common.fFc': 'f / fc',
  'common.filter': 'Filter',
  'common.filterTopology': 'Filter topology',
  'common.frequency': 'Frequency',
  'common.gainAt': 'Gain at {frequency}',
  'common.gateDriveVgs': 'Gate drive VGS',
  'common.gauge': 'Gauge',
  'common.halfWave': 'Half wave',
  'common.highPass': 'High pass',
  'common.ideal': 'ideal {dutyIdeal}%',
  'common.il': 'IL',
  'common.inductance': 'Inductance',
  'common.inductor': 'Inductor',
  'common.inductorDcr': 'Inductor DCR',
  'common.inductorRipple': 'Inductor ripple',
  'common.inductorRms': 'Inductor RMS',
  'common.inputCurrent': 'Input current',
  'common.inputImpedance': 'Input impedance',
  'common.inputVin': 'Input Vin',
  'common.inverting': 'Inverting',
  'common.junctionTemp': 'Junction temp',
  'common.load': 'Load',
  'common.loadCurrent': 'Load current',
  'common.loadResistance': 'Load resistance',
  'common.loadType': 'Load type',
  'common.lowPass': 'Low pass',
  'common.mean': 'mean',
  'common.method': 'Method',
  'common.mode': 'Mode',
  'common.never': 'never',
  'common.none': 'none',
  'common.notBuiltYet': 'Not built yet.',
  'common.onTime': 'On time',
  'common.operatingPoint': 'Operating point',
  'common.output': 'Output',
  'common.outputCap': 'Output cap',
  'common.outputImpedance': 'Output impedance',
  'common.outputPower': 'Output power',
  'common.outputRipple': 'Output ripple',
  'common.outputSwing': 'Output swing',
  'common.outputVout': 'Output Vout',
  'common.packVoltage': 'Pack voltage',
  'common.parallel': 'Parallel',
  'common.peakCoilCurrent': 'Peak coil current',
  'common.peakCurrent': 'Peak current',
  'common.peakInductorCurrent': 'Peak inductor current',
  'common.perAdcCount': 'per ADC count',
  'common.period': 'Period',
  'common.periodsShown': 'Periods shown',
  'common.phaseShift': 'Phase shift',
  'common.powerStage': 'Power stage',
  'common.pullUp': 'Pull-up',
  'common.pulseWidth': 'Pulse width',
  'common.pwm2': 'PWM',
  'common.qFactor': 'Q factor',
  'common.r1Top': 'R1 (top)',
  'common.r2Bottom': 'R2 (bottom)',
  'common.rails': 'Rails',
  'common.reactanceXl': 'Reactance XL',
  'common.resistance': 'Resistance',
  'common.resistor': 'Resistor',
  'common.resolution': 'Resolution',
  'common.resonanceF0': 'Resonance f0',
  'common.ripple': 'Ripple',
  'common.riseTime': 'Rise time',
  'common.riseTime1090': 'Rise time (10-90%)',
  'common.runtime': 'Runtime',
  'common.saturationCurrent': 'Saturation current',
  'common.sensitivity': 'Sensitivity',
  'common.series': 'Series',
  'common.seriesResistor': 'Series resistor',
  'common.seriesRs': 'Series Rs',
  'common.settlingTo1': 'Settling to 1%',
  'common.sine': 'Sine',
  'common.sleepCurrent': 'Sleep current',
  'common.sleepTime': 'Sleep time',
  'common.source': 'Source',
  'common.sourceLoadZ': 'Source load |Z|',
  'common.square': 'Square',
  'common.supply': 'Supply',
  'common.supplyCurrent': 'Supply current',
  'common.sweep': 'Sweep',
  'common.switchingFreq': 'Switching freq',
  'common.switchingFrequency': 'Switching frequency',
  'common.target': 'Target',
  'common.thermal': 'Thermal',
  'common.thermalPath': 'Thermal path',
  'common.timeConstant': 'Time constant',
  'common.tjMax': 'Tj max',
  'common.topology': 'Topology',
  'common.totalLoss': 'Total loss',
  'common.triangle': 'Triangle',
  'common.usableResolution': 'Usable resolution',
  'common.useE24': 'Use {value} (E24)',
  'common.vc': 'Vc',
  'common.vih': 'VIH',
  'common.vin': 'Vin',
  'common.voltageDrop': 'Voltage drop',
  'common.vout': 'Vout',
  'common.white': 'White',
  'crystal-caps.absoluteError': 'Absolute error',
  'crystal-caps.blurb': 'Load cap pick from the crystal spec, plus the frequency pull it causes.',
  'crystal-caps.board': 'Board',
  'crystal-caps.c1C2Ideal': 'C1 = C2 ideal',
  'crystal-caps.clockDrift': 'Clock drift',
  'crystal-caps.crystal': 'Crystal',
  'crystal-caps.forA32768':
    'For a 32.768 kHz timekeeping crystal, 20 ppm is about 1.7 seconds a day, or ten minutes a year. If that matters, either trim the capacitors or use a temperature compensated module: temperature drift will typically dwarf the load error anyway, since a watch crystal has a parabolic tempco of about -0.035 ppm per °C squared.',
  'crystal-caps.frequencyError': 'Frequency error',
  'crystal-caps.lede':
    'A crystal is cut to hit its marked frequency only when it sees a specific capacitance. Get the load capacitors wrong and it still oscillates, just at the wrong frequency, which is why a clock that drifts is usually a capacitor problem rather than a crystal fault.',
  'crystal-caps.loadActuallySeen': 'Load actually seen',
  'crystal-caps.motionalCm': 'Motional Cm',
  'crystal-caps.nearestStandard': 'Nearest standard',
  'crystal-caps.sDay': '{secondsPerDay} s/day',
  'crystal-caps.shuntC0': 'Shunt C0',
  'crystal-caps.spec': 'spec {clSpec}',
  'crystal-caps.specifiedCl': 'Specified CL',
  'crystal-caps.strayCapacitanceIsNot':
    'Stray capacitance is not a rounding error here. Two or three picofarads per pin is typical for a small package with short tracks, and against a 12.5 pF specified load that is a quarter of the budget. Ignoring it is the single most common reason a design runs fast or slow by tens of ppm.',
  'crystal-caps.strayPerPin': 'Stray per pin',
  'crystal-caps.sYear': '{secondsPerDay} s/year',
  'crystal-caps.theory1':
    'The oscillator sees the two load capacitors in series, plus whatever the pins and tracks contribute: `CL = C1·C2/(C1+C2) + Cstray`. With C1 = C2 that simplifies to `C1/2 + Cstray`, so `C1 = C2 = 2·(CL - Cstray)`.',
  'crystal-caps.thePullFollowsFrom':
    "The pull follows from the crystal's motional capacitance: `df/f = Cm/2 · (1/(C0+CL_actual) - 1/(C0+CL_spec))`. Too much load pulls the frequency down, too little pulls it up. Cm is tiny, femtofarads, which is exactly why a crystal is stable at all: the load has only a weak grip on it.",
  'crystal-caps.title': 'Crystal Load Capacitors',
  'crystal-caps.use':
    'Real-time clocks, radio frequency references, and any microcontroller with an external crystal. If the load capacitors are wrong the crystal still oscillates, just at the wrong frequency, so this is usually the answer when a clock drifts by minutes a month or a radio link will not tune.',
  'crystal-caps.warn1':
    'Stray capacitance alone already exceeds the specified load, so no external capacitors can bring it down: the crystal will always run slow. Shorten the tracks, remove ground pour from under them, or choose a crystal specified for a higher CL.',
  'crystal-caps.warn2':
    '{errorPpm} ppm is a drift of {secondsPerDay} seconds a day. For a real-time clock that is far too much. Pick capacitors closer to the ideal value, or trim one of them.',
  'current-divider.025WAxial': '0.25 W axial, 0.125 W for 0805.',
  'current-divider.acrossRs': '({voltage} across Rs)',
  'current-divider.blurb': 'Branch currents through parallel paths.',
  'current-divider.branchCount': 'Branch count',
  'current-divider.branches': 'Branches',
  'current-divider.currentSource': 'Current source',
  'current-divider.dissipationIsPxIx':
    'Dissipation is `Px = Ix²·Rx`, and the branch powers sum to `V·Itotal`. In rail mode the source sees `Rs + Req`, so `Itotal = Vs / (Rs + Req)` and Rs takes the rest of the supply.',
  'current-divider.equivalentR': 'Equivalent R',
  'current-divider.lede':
    "Parallel branches share a node voltage, so the current splits by conductance, not by resistance. The bar shows each branch's share of the total.",
  'current-divider.nodeVoltage': 'Node voltage',
  'current-divider.overOneGpio': '(over one GPIO)',
  'current-divider.parallelBranchNetwork': 'Parallel branch network',
  'current-divider.railRs': 'Rail + Rs',
  'current-divider.rCurrent': 'R{i} current',
  'current-divider.resistorRating': 'Resistor rating',
  'current-divider.supplyVs': 'Supply Vs',
  'current-divider.theNodeSitsAt':
    'The node sits at `V = Itotal·Req`, so each branch carries `Ix = V/Rx = Itotal·Gx / sum(G)`. The low-resistance branch takes the most current, which is the opposite of the voltage divider intuition. For two branches this collapses to `I1 = Itotal·R2 / (R1 + R2)`, the other resistor on top.',
  'current-divider.theory1':
    'Parallel branches share one node pair, so they all see the same voltage. Conductance adds: `G = 1/R`, `Req = 1 / sum(G)`. Req is always smaller than the smallest branch, i.e. adding a path can only make the load heavier.',
  'current-divider.title': 'Current Divider',
  'current-divider.totalCurrent': 'Total current',
  'current-divider.totalPower': 'Total power',
  'current-divider.use':
    'Working out how current splits between parallel paths: paralleled resistors sharing power, LEDs unwisely paralleled on one resistor, and multiple return paths in a ground plane. It is also the model for why paralleling batteries or regulators without ballast leads to one of them doing all the work.',
  'current-divider.warn1':
    'Total draw is {total}, past the {GPIO_MAX_MA} mA an ESP32 pin may source or sink. Feed the bank from the rail through a MOSFET or a driver, not straight off a GPIO.',
  'current-divider.warn2':
    '{hot} over the {rating} rating. Pick a larger part or raise the branch resistance.',
  'current-divider.warn3':
    'An ideal current source holds {total} into any load, so the node sits at {voltage}. A real 3V3 supply cannot go there: switch to rail plus Rs to see what the circuit actually does.',
  'current-sense.acrossTheInternal0': 'across the internal 0.1 Ω',
  'current-sense.adcRangeUsed': 'ADC range used',
  'current-sense.amplifierGain': 'Amplifier gain',
  'current-sense.atThisShunt': 'at this shunt',
  'current-sense.blurb': 'Shunt sizing against burden voltage, plus ACS712 and INA219 resolution.',
  'current-sense.burden': 'burden',
  'current-sense.burden2': 'Burden',
  'current-sense.currentResolution': 'Current resolution',
  'current-sense.digitalI2c': 'digital, I2C',
  'current-sense.dissipationIsIR':
    'Dissipation is `I²·R` and it rises with the square of current, so a shunt sized for convenience at 1 A becomes a heater at 10 A. Worse, the heat changes the resistance, so the measurement drifts as the load increases: the reason precision shunts use low-tempco alloys and four-wire connections.',
  'current-sense.hallEffectPartsLike':
    'Hall-effect parts like the ACS712 avoid the burden entirely by measuring the magnetic field, giving full isolation. The price is offset drift, noise, and a zero point that sits at half the supply, so they are good for amps and poor for milliamps.',
  'current-sense.lede':
    'Measuring current means turning it into a voltage the ADC can read, without stealing too much of the supply doing it. The shunt is a compromise between burden voltage, dissipation and resolution.',
  'current-sense.ofTheSupply': 'of the supply',
  'current-sense.outputToAdc': 'Output to ADC',
  'current-sense.perLsbOnThe': 'per LSB on the shunt ADC',
  'current-sense.sensor': 'Sensor',
  'current-sense.sensorRange': 'Sensor range',
  'current-sense.shuntFrontEnd': 'Shunt front end',
  'current-sense.shuntPower': 'Shunt power',
  'current-sense.shuntResistance': 'Shunt resistance',
  'current-sense.shuntVoltage': 'Shunt voltage',
  'current-sense.supplyBeingMeasured': 'Supply being measured',
  'current-sense.theory1':
    "A shunt turns current into voltage by Ohm's law, `Vshunt = I·R`. That voltage is subtracted from the supply reaching the load, which is the burden. Keep it under a percent or two of the rail, so a 5 V supply wants a burden well under 50 mV.",
  'current-sense.theResolutionYouActually':
    'The resolution you actually get is one ADC step referred back to the input, `Vlsb / (R·gain)`. Gain is what rescues you from the burden-versus- resolution trap: a small shunt keeps the burden low, and the amplifier recovers the signal. That is exactly what a dedicated current-sense amplifier does, and it also handles the common-mode problem of high-side sensing, where the shunt sits at supply potential rather than near ground.',
  'current-sense.title': 'Current Sensing',
  'current-sense.use':
    'Battery monitoring, motor current limiting, power measurement, and overcurrent protection. The design is a three-way compromise between burden voltage, shunt dissipation and resolution, and this shows why a dedicated current-sense amplifier with a small shunt beats a large shunt read directly.',
  'current-sense.warn1':
    '{vOut} is past the {FULL_SCALE} ADC full scale, so the reading pins at maximum and you lose the top of the range entirely. Reduce the gain or the shunt.',
  'current-sense.warn2':
    "Only {rangeUsed}% of the ADC range is in use, so most of the converter's resolution is wasted. Raise the gain until full-scale current lands near the top of the range.",
  'current-sense.warn3':
    "{pShunt} in the shunt is significant heat, and the resistor's own temperature coefficient will then shift the reading. Use a lower value with more gain, or a proper 4-wire sense resistor.",
  'current-sense.warn4':
    'The ACS712 is a 5 V part with a mid-rail zero point, so its quiescent output is about 2.5 V, well above what an ESP32 pin tolerates. It needs a divider or a 3.3 V-friendly alternative. Its noise floor also makes it poor below a few hundred milliamps.',
  'current-sense.zeroCurrentOutput': 'Zero-current output',
  'debounce.blurb': 'RC and Schmitt trigger debounce sizing from measured bounce time.',
  'debounce.bounceDuration': 'Bounce duration',
  'debounce.bounceIs': 'bounce is {bounceMs}',
  'debounce.contactCurrent': 'Contact current',
  'debounce.fallToVil': 'Fall to VIL',
  'debounce.filtered': 'filtered',
  'debounce.glitchesRejectedUpTo': 'Glitches rejected up to',
  'debounce.lede':
    "A mechanical contact does not close once, it chatters for a few milliseconds. The scope shows the raw contact against the RC-filtered node and the input's logic-high threshold: the filter must ride over the whole burst without crossing back.",
  'debounce.logicSupply': 'Logic supply',
  'debounce.maximumPressRate': 'Maximum press rate',
  'debounce.noteTheAsymmetryOn':
    'Note the asymmetry on the trace: closing the switch shorts the capacitor straight to ground so the fall is almost instant, while opening it has to charge C through R. Only the rising edge is actually filtered, which is why a debounce that looks fine on press can still bounce on release.',
  'debounce.ofVcc': '{VIH_FRAC}% of Vcc',
  'debounce.ofVcc2': '{VIL_FRAC}% of Vcc',
  'debounce.pressesPerSecond': 'Presses per second',
  'debounce.raw': 'raw',
  'debounce.riseToVih': 'Rise to VIH',
  'debounce.switchAndInput': 'Switch and input',
  'debounce.theDesignHasTwo':
    'The design has two sides. Too fast and the chatter gets through. Too slow and you cannot press the button quickly, and the slow edge spends a long time in the forbidden zone between VIL and VIH, where an input without a Schmitt trigger can oscillate. This is exactly why you want a Schmitt input here, and the ESP32 GPIOs have one.',
  'debounce.theory1':
    'Contacts bounce because they are springs. The moving contact strikes the fixed one and rebounds, making and breaking several times over roughly 1 to 10 ms for a typical tactile switch, longer for larger levers and relays.',
  'debounce.theRcFilterTurns':
    'The RC filter turns each brief opening into a small exponential wobble instead of a full rail-to-rail transition. The node only registers as high once it crosses VIH, which for an ESP32 is about {VIH_FRAC}% of the supply, and that takes `t = -R·C·ln(1 - VIH/Vcc)`, i.e. 1.386 time constants.',
  'debounce.title': 'Switch Debounce RC',
  'debounce.use':
    'Any mechanical button, switch or relay contact read by a microcontroller. Contacts chatter for milliseconds on every press, so a naive read counts one press as several. This sizes the filter to ride over the bounce without becoming so slow it drops real presses.',
  'debounce.warn1':
    'The filter settles in {tRise}, faster than the {bounceMs} of bounce, so chatter still reaches the pin. Raise R or C until the rise time comfortably exceeds the bounce duration.',
  'debounce.warn2':
    'At {maxRate} the filter cannot follow {pressRate} presses per second. Real presses will be merged or missed entirely.',
  'debounce.warn3':
    'Only {contactCurrent} flows through the contact. Dry switching below about 100 µA lets oxide build up on the contact faces, which eventually stops the switch working at all. Lower R if the switch is a mechanical one.',
  'debounce.wetsTheContact': 'wets the contact',
  'debounce.youWantHz': 'you want {pressRate} Hz',
  'deep-sleep.asleep': 'Asleep',
  'deep-sleep.awake': 'Awake',
  'deep-sleep.blurb': 'Average current from a duty-cycled wake profile, and months of runtime.',
  'deep-sleep.chargePerWake': 'Charge per wake',
  'deep-sleep.consumption': 'Consumption',
  'deep-sleep.cyclePeriod': 'Cycle period',
  'deep-sleep.days': '{runtimeDays} days',
  'deep-sleep.energyPerWake': 'Energy per wake',
  'deep-sleep.lede':
    'A battery node lives or dies on its average current, not its peak. The scope shows the current profile over one wake/sleep cycle against the resulting average, on a linear time axis.',
  'deep-sleep.sleepShareOfBudget': 'Sleep share of budget',
  'deep-sleep.theConsequenceIsUnintuitive':
    'The consequence is unintuitive. An ESP32 drawing 80 mA for 3 seconds every hour averages about 77 µA, so a 2 Ah cell lasts over two years. The same chip left awake would flatten it in a day. Deep sleep is not an optimisation, it is the entire design.',
  'deep-sleep.theory1':
    'Average current is the time-weighted mean over one cycle, `Iavg = (Ion·ton + Isleep·tsleep) / (ton + tsleep)`. Runtime is then the usable capacity divided by that. Nothing else matters: the peak current only affects whether the supply can deliver it, not how long the pack lasts.',
  'deep-sleep.theUsableFractionIs':
    'The usable fraction is doing real work here. Nominal capacity assumes a slow discharge to a low cutoff at room temperature, none of which holds in the field. Planning on 80% is normal, and less in the cold.',
  'deep-sleep.title': 'Deep Sleep Battery Life',
  'deep-sleep.usableFraction': 'Usable fraction',
  'deep-sleep.use':
    'Any battery powered ESP32 node: sensors reporting to a server, trackers, remote monitors. Average current is the only figure that determines battery life, and this shows why the sleep current usually matters far more than the wake time. It is also how you discover that a permanently connected divider or a leaky regulator is what is really draining the pack.',
  'deep-sleep.wakeCycles': 'Wake cycles',
  'deep-sleep.warn1':
    "Sleep current is {sleepShare}% of the budget, so optimising the wake phase buys you almost nothing. Attack the standby draw instead: a linear regulator's quiescent current, a permanently connected divider, or a peripheral left powered are the usual culprits, and each can dwarf the ESP32's own 10 µA.",
  'deep-sleep.warn2':
    'Above about 150 mA you are almost certainly transmitting. WiFi association costs far more energy than the transmission itself, so batching several readings into one wake is usually a bigger win than making each wake shorter.',
  'deep-sleep.whDay': '{whPerDay} Wh/day',
  'deep-sleep.whichTermDominatesDecides':
    'Which term dominates decides where to spend effort. Once the sleep phase carries most of the average, shortening the wake is wasted work, and the target becomes standby leakage: regulator quiescent current, pull-up and divider networks, and sensors that stay powered.',
  'deep-sleep.years': '{runtimeDays} years',
  'e-series.101HalfStep': '(10^(1/{steps}), half step {halfStep})',
  'e-series.against': '{error} against {singleError}',
  'e-series.bestOfTheThree': 'Best of the three',
  'e-series.blurb': 'Nearest E12/E24/E96 value and two-resistor combinations for any target.',
  'e-series.e48AndE96Are':
    'E48 and E96 are exactly that rounding. E6, E12 and E24 are not: IEC 60063 keeps the historical 27, 33, 39, 47 and 82 where the arithmetic gives 26.1, 31.6, 38.3, 46.4 and 82.5. That is why E24 has a 13 to 15 gap worth 7.1% while its grade is only 5%.',
  'e-series.eSeries': 'E series',
  'e-series.lede':
    'Calculators hand you numbers like 26.36 kΩ. Stock does not. This picks the closest preferred value and the two-resistor pairs that get closer.',
  'e-series.mantissas': '{series} mantissas: `{mantissas}`',
  'e-series.nearestStandardValue': 'Nearest standard value',
  'e-series.neighbours': 'Neighbours',
  'e-series.noPairBeatsThe': 'no pair beats the single value',
  'e-series.pair': 'pair',
  'e-series.pairsAreSearchedOver':
    "Pairs are searched over the whole 1 Ω to 10 MΩ table. Both `a + b` and `a·b / (a + b)` rise monotonically with b, so for each a the best partner is the table entry nearest the exact one, which makes the search a binary search per candidate rather than every pair. Parts are kept within {maxRatio}x of each other: past that the smaller one trims the result by less than the larger one's own tolerance, so the pair is a fiction.",
  'e-series.preferredSeries': 'Preferred series',
  'e-series.singlePart': 'single part',
  'e-series.stepRatio': 'Step ratio',
  'e-series.targetCovered': '(target covered)',
  'e-series.targetOutside': '(target outside)',
  'e-series.theory1':
    'A preferred series splits each decade into N logarithmic steps, so `value = 10^(k/N)` for `k = 0..N-1`, rounded to two significant figures for E6, E12 and E24 and three for E48 and E96. Each step is a fixed ratio of `10^(1/N)`, which is why the same mantissas repeat from ohms to megohms. Error against a target is `(Rstd - Rtarget) / Rtarget`.',
  'e-series.theToleranceGradesExist':
    'The tolerance grades exist to close those gaps. The worst target sits at the midpoint of a gap `[a, b]`, an error of `(b - a) / (b + a)` away from either neighbour: exactly 20% for E6, so a 20% part always covers it. Every finer grade leaves a sliver open, E24 worst at 7.1% against a 5% part, so some targets sit between two parts whichever one you buy. That is what the tolerance band readout is checking.',
  'e-series.title': 'Standard Resistor Values',
  'e-series.toleranceBandAt': 'Tolerance band at {tolerance}',
  'e-series.twoInParallel': 'Two in parallel',
  'e-series.twoInSeries': 'Two in series',
  'e-series.typeTheRawNumber': 'Type the raw number your divider or current limit asked for.',
  'e-series.use':
    'You cannot buy the resistance your formula produced. This turns a calculated value into something purchasable, tells you the error you are accepting, and finds two-resistor combinations when a single standard value is not close enough, which matters for precision dividers and gain-setting networks.',
  'e-series.warn1':
    '{target} is outside the 1 Ω to 10 MΩ range searched here, so the answers above are clamped to the end of the table rather than extrapolated. Real stock does go further, but not in a form you would put in a divider.',
  'e-series.warn2':
    'No {series} part covers {target}: even at its {tolerance} grade, {single} only reaches {bandLow} to {bandHigh}. Use a pair, move to a finer series, or redesign around a value the series actually has.',
  'e-series.widestGapInsideThe': '(widest gap, inside the {tolerance} grade)',
  'e-series.widestGapPastThe': '(widest gap, past the {tolerance} grade)',
  'e-series.worstCaseFor': 'Worst case for {series}',
  'esp32-adc.aBatteryAboveThe':
    "A battery above the usable top needs a divider, `Vadc = Vbat·R2/(R1+R2)`. Dividing by two costs you half the resolution referred to the battery: each count is then worth `2·Vlsb`. That is usually fine, since a LiPo's whole useful range is 1.2 V and even halved that is over 600 counts.",
  'esp32-adc.adcAtEmptyBattery': 'ADC at empty battery',
  'esp32-adc.adcAtFullBattery': 'ADC at full battery',
  'esp32-adc.attenuation': 'Attenuation',
  'esp32-adc.bits': '{ADC_BITS} bits',
  'esp32-adc.blurb':
    'Attenuation ranges, divider design for battery sensing, effective resolution.',
  'esp32-adc.converter': 'Converter',
  'esp32-adc.countAtFull': 'Count at full',
  'esp32-adc.dividerDrain': 'Divider drain',
  'esp32-adc.drainPerDay': 'Drain per day',
  'esp32-adc.emptyVoltage': 'Empty voltage',
  'esp32-adc.evenDoneCorrectlyThis':
    'Even done correctly this ADC is not precise. It has significant offset and gain error, varies part to part, and drifts with temperature. Use the factory calibration via esp_adc_cal, average many samples, and do not expect better than about 1%.',
  'esp32-adc.fullScale': 'Full scale',
  'esp32-adc.fullVoltage': 'Full voltage',
  'esp32-adc.lede':
    "Design a battery sense divider that fits the ADC's usable window without draining the pack. The ESP32 ADC is only linear over part of its nominal range, and its input needs a reasonably stiff source.",
  'esp32-adc.perCount': 'per count',
  'esp32-adc.resolutionAtBattery': 'Resolution at battery',
  'esp32-adc.sourceImpedance': 'Source impedance',
  'esp32-adc.theory1':
    'The ESP32 ADC is 12 bits, so full scale divides into 4096 counts. The attenuator in front of it sets what full scale means: 0 dB gives about 1.1 V, 11 dB about 3.9 V. Only part of each range is linear, which is why the usable window is narrower than the nominal figure.',
  'esp32-adc.theTensionIsDrain':
    'The tension is drain against impedance. A divider is connected permanently, so 100 kΩ plus 100 kΩ across 4.2 V wastes 21 µA continuously, which is more than an ESP32 in deep sleep. Going to megohms fixes that but breaks the ADC, whose input needs to charge a sampling capacitor. The usual answers are a MOSFET to switch the divider on only while measuring, or a capacitor across the bottom leg.',
  'esp32-adc.title': 'ESP32 ADC / VBAT Sense',
  'esp32-adc.usableToV': 'usable {usableLow} to {usableHigh} V',
  'esp32-adc.use':
    'Reading a battery level, a potentiometer, or any analogue sensor on an ESP32. It matters because the ADC is only linear over part of its range, so a divider that lands outside the usable window reads compressed or flat exactly where you need accuracy, and because a high-impedance divider gives readings that quietly depend on the sampling rate.',
  'esp32-adc.voltsPerLsb': 'Volts per LSB',
  'esp32-adc.warn1':
    '{vAdcMax} is above the {usableHigh} V where this attenuation stays linear. Readings will compress and then clip near full charge, which is exactly where you most want accuracy. Increase R1 or pick a higher attenuation.',
  'esp32-adc.warn2':
    '{vAdcMin} is below the {usableLow} V floor. The ESP32 ADC is badly non-linear near zero and will read a dead-flat value there.',
  'esp32-adc.warn3':
    'Source impedance of {sourceImpedance} is above the recommended {ADC_MAX_SOURCE_Z}. The sample-and-hold capacitor cannot charge in time, so readings come out low and depend on the sampling rate. Either lower the divider resistances or put a 100 nF capacitor across R2 to act as a charge reservoir.',
  'harmonics.aboveTheSupplyRail': 'above the supply rail',
  'harmonics.activeTopIsH': '({active} active, top is H{top})',
  'harmonics.asAShareOf': '(as a share of total rms)',
  'harmonics.below0V': 'below 0 V',
  'harmonics.below0VAnd': 'below 0 V and above the supply rail',
  'harmonics.blurb':
    'Add harmonics to build square, triangle and distorted waveforms. THD readout.',
  'harmonics.byParsevalTheRms':
    'By Parseval the rms is `sqrt(sum Vn² / 2)` and depends only on the amplitudes, never on phase. The peak does depend on phase, so crest factor does too: flip the phase toggle on a sawtooth and the rms will not move.',
  'harmonics.crestFactor': 'Crest factor',
  'harmonics.dc': '(DC {dc})',
  'harmonics.distortionIsTheEnergy':
    'Distortion is the energy that is not the fundamental: `THD = sqrt(V2² + V3² + ... ) / V1`. An ideal square is 48.3%, a triangle 12.1%. Ten terms only get part of the way there. THD-R divides by the total rms instead, so it can never exceed 100%, which is what a meter reads.',
  'harmonics.forceEveryPhaseTo': 'Force every phase to 0',
  'harmonics.fourierSeriesPreset': 'Fourier series preset',
  'harmonics.frequencyF0': 'Frequency f0',
  'harmonics.fundamental': 'Fundamental',
  'harmonics.h1Fundamental': 'H1 fundamental',
  'harmonics.harmonicAmplitudes': 'Harmonic amplitudes',
  'harmonics.ideal': 'Ideal',
  'harmonics.lede':
    'Add up to ten sine waves, each an integer multiple of one fundamental, and watch the sum take shape. Horizontal axis is time.',
  'harmonics.noFundamentalToCompare': '(no fundamental to compare against)',
  'harmonics.occupiedBandwidth': 'Occupied bandwidth',
  'harmonics.ofHarmonics2To': '({distortion} of harmonics 2 to 10)',
  'harmonics.peak': '(peak {peakAc})',
  'harmonics.peakToPeak': 'Peak to peak',
  'harmonics.railHeadroom': '(rail headroom {headroom})',
  'harmonics.rmsAcOnly': 'RMS, AC only',
  'harmonics.rmsWithDc': 'RMS, with DC',
  'harmonics.saw': 'Saw',
  'harmonics.sine1414Triangle': '(sine 1.414, triangle 1.732)',
  'harmonics.sum': 'Sum',
  'harmonics.swing': 'Swing',
  'harmonics.thd': 'THD',
  'harmonics.thdR': 'THD-R',
  'harmonics.theory1':
    'Every periodic waveform is a sum of sines at integer multiples of one fundamental: `v(t) = Vdc + sum Vn·sin(2·pi·n·f0·t + phi_n)`. Each slider sets one Vn. The scope evaluates that sum directly, so there is no solver and no step-size limit.',
  'harmonics.thePresetsAreThe':
    'The presets are the classic series. Square is odd harmonics at `1/n` all in phase, sawtooth is every harmonic at `1/n` with alternating sign, triangle is odd harmonics at `1/n²` with alternating sign. Their ideal peaks are `V1·pi/4`, `V1·pi/2` and `V1·pi²/8`, which is the amber trace.',
  'harmonics.title': 'Harmonics Synthesiser',
  'harmonics.truncatingAtAStep':
    'Truncating at a step leaves ringing that never goes away. The overshoot converges to 8.95% of the jump, i.e. 1.179 times the flat top, which is why a square built from harmonics reads a crest factor near 1.18 instead of the ideal 1.0. Adding terms narrows the ripple, it does not shrink it.',
  'harmonics.undefined': 'undefined',
  'harmonics.use':
    'Understanding why a square wave upsets an audio chain, why non-sinusoidal load current on the mains causes trouble, and what THD actually measures. Directly relevant to PWM: the whole reason a PWM signal needs filtering is the harmonic content sitting above the fundamental.',
  'harmonics.warn1':
    'The sum swings {swing}. A single-supply DAC or a filtered PWM pin cannot produce that, the real output would flat-top and add distortion this model does not include. Trim the amplitudes or move the DC offset.',
  'heat-pump.aCopOf3':
    'A COP of 3 means a kWh of heat costs a third of the tariff, so the saving against a resistive heater is `1 - 1/COP`. That is the number that decides whether the machine pays back, and it collapses on the coldest days precisely when demand peaks, which is why the seasonal figure matters more than the headline one.',
  'heat-pump.blurb':
    'Carnot ceiling against real COP, and the cost compared with resistive heating.',
  'heat-pump.carnotCeiling': 'Carnot ceiling',
  'heat-pump.costPerKwhHeat': 'Cost per kWh heat',
  'heat-pump.designOutdoor': 'Design outdoor',
  'heat-pump.electricalInput': 'Electrical input',
  'heat-pump.flowHotSide': 'Flow (hot side)',
  'heat-pump.heatDelivered': 'Heat delivered',
  'heat-pump.lede':
    'A heat pump moves heat rather than making it, so it can deliver several kilowatts of heat per kilowatt of electricity. The ceiling is Carnot, set purely by the temperature lift.',
  'heat-pump.liftedFromOutside': 'Lifted from outside',
  'heat-pump.machine': 'Machine',
  'heat-pump.ofCarnot': '{eta}% of Carnot',
  'heat-pump.outdoorColdSide': 'Outdoor (cold side)',
  'heat-pump.realCop': 'Real COP',
  'heat-pump.realMachinesReachA':
    'Real machines reach a fraction of Carnot, here the second-law efficiency, typically 0.4 to 0.6 for domestic units. So `COP = eta · Th/(Th - Tc)` and the heat delivered is `Qh = COP · W`.',
  'heat-pump.resistiveEquivalent': 'Resistive equivalent',
  'heat-pump.resistiveSeason': 'Resistive season',
  'heat-pump.runningCost': 'Running cost',
  'heat-pump.runtimeToCoverSeason': 'Runtime to cover season',
  'heat-pump.savingAtThisPoint': 'Saving at this point',
  'heat-pump.seasonalCop': 'Seasonal COP',
  'heat-pump.seasonalCost': 'Seasonal cost',
  'heat-pump.seasonalElectricity': 'Seasonal electricity',
  'heat-pump.seasonalSaving': 'Seasonal saving',
  'heat-pump.seasonHeatDemand': 'Season heat demand',
  'heat-pump.secondLawEfficiency': 'Second-law efficiency',
  'heat-pump.tariffPerKwh': 'Tariff per kWh',
  'heat-pump.temperatureLift': 'Temperature lift',
  'heat-pump.temperatures': 'Temperatures',
  'heat-pump.theFreePart': 'the free part',
  'heat-pump.theory1':
    'The Carnot ceiling for heating is `COP = Th / (Th - Tc)`, with both temperatures in kelvin. Only the difference matters, which is why a heat pump feeding underfloor pipes at 35 °C thrashes one feeding radiators at 65 °C: the lift is smaller, so the ceiling is higher.',
  'heat-pump.theTariffItself': 'the tariff itself',
  'heat-pump.thThTc': 'Th/(Th-Tc)',
  'heat-pump.title': 'Heat Pump / COP',
  'heat-pump.use':
    'Deciding whether a heat pump is worth installing, and understanding why the answer depends on flow temperature. It explains why underfloor heating suits heat pumps and old high-temperature radiators do not, and why the seasonal figure rather than the headline COP determines the running cost.',
  'heat-pump.warn1':
    'The cold side is at or above the hot side, so there is no lift to perform and the COP is undefined. Raise the flow temperature or lower the outdoor temperature.',
  'heat-pump.warn2':
    'A lift over about 55 K is outside what most domestic refrigerants manage. Real machines cut out or fall back to a resistive heater here, so treat this COP as optimistic.',
  'i2c-pullup.blurb': 'Pull-up window from bus capacitance and speed, with the rise-time check.',
  'i2c-pullup.busCapacitance': 'Bus capacitance',
  'i2c-pullup.fromThe3Ma': 'from the 3 mA sink limit',
  'i2c-pullup.fromTheRiseTime': 'from the rise-time limit',
  'i2c-pullup.idealR': 'ideal R',
  'i2c-pullup.lede':
    'I2C is open drain: devices only pull down, so a resistor has to pull back up and the bus capacitance fights it. The scope shows the rising edge after a device releases the line, against the edge an ideally sized pull-up would give.',
  'i2c-pullup.limit': 'limit {maxRise}',
  'i2c-pullup.limit2': 'limit {maxCapacitance}',
  'i2c-pullup.maximumR': 'Maximum R',
  'i2c-pullup.minimumR': 'Minimum R',
  'i2c-pullup.powerPerLine': 'Power per line',
  'i2c-pullup.recommended': 'Recommended',
  'i2c-pullup.riseVsBitPeriod': 'Rise vs bit period',
  'i2c-pullup.sda': 'SDA',
  'i2c-pullup.sinkCurrent': 'Sink current',
  'i2c-pullup.speed': 'Speed',
  'i2c-pullup.staticWhenLow': 'static, when low',
  'i2c-pullup.theCeilingComesFrom':
    'The ceiling comes from the edge: `Rmax = tr / (0.8473·Cb)`. The 0.8473 is `ln(0.7/0.3)`, from the 30% to 70% points the specification measures between.',
  'i2c-pullup.theFloorComesFrom':
    'The floor comes from the low level: a device must sink enough current to hold the line under {I2C_VOL} V, and the specification only guarantees 3 mA. So `Rmin = (Vcc - 0.4) / 3mA`, about 970 Ω at 3.3 V.',
  'i2c-pullup.theory1':
    'Open drain means a device can only pull the line down. Releasing it leaves the bus capacitance to be charged through the pull-up, so the rising edge is an RC curve while the falling edge is nearly instant. Everything about pull-up sizing follows from that asymmetry.',
  'i2c-pullup.theWindowSpansDecades':
    'The window spans decades, so the sensible choice is the geometric mean rather than the arithmetic one. 4.7 kΩ is the traditional default and it is fine for a short 100 kHz bus, but at 400 kHz with any real cable length it is often too weak, which is the usual cause of an I2C bus that works on the bench and fails with a longer lead.',
  'i2c-pullup.title': 'I2C Pull-Up Resistor',
  'i2c-pullup.use':
    'Every I2C sensor, display and EEPROM on an ESP32 project. I2C is open drain, so the bus cannot rise without a pull-up, and the resistor value is a genuine constraint rather than a formality: too large and the edges are too slow for the clock, too small and devices cannot pull the line low. This is the usual reason an I2C bus works with a short jumper and fails with a metre of ribbon cable.',
  'i2c-pullup.warn1':
    'No resistance satisfies both limits here: the value needed to meet the rise time is already below the value a device can pull low. Shorten the bus, remove devices, or drop to a slower speed. This is the point where you need an active bus buffer.',
  'i2c-pullup.warn2':
    '{rPullup} is outside the {rMin} to {rMax} window. Too small and devices cannot hold a valid low, too large and the edge is too slow for the clock.',
  'i2c-pullup.warn3':
    'Bus capacitance is past the {maxCapacitance} the specification allows at this speed. Each device contributes roughly 10 pF and wiring adds about 1 pF per cm, so long ribbon runs add up fast.',
  'i2c-pullup.whileHeldLow': 'while held low',
  'led-resistor.14W1206': '1/4 W (1206, axial)',
  'led-resistor.absoluteMaxIf': 'Absolute max If',
  'led-resistor.blurb':
    'Resistor pick, dissipation, and a warning when a GPIO cannot source the current.',
  'led-resistor.currentShiftPerOf': 'Current shift per {spread} of Vf',
  'led-resistor.custom': 'Custom',
  'led-resistor.datasheetLimit20Ma': 'Datasheet limit, 20 mA for most 5 mm parts.',
  'led-resistor.dissipationSplitsBetweenThe':
    'Dissipation splits between the two parts: `P_R = I²R = (Vs - Vf)²/R` in the resistor and `P_LED = Vf·I` in the die. The fraction that reaches the LED is just `Vf / Vs`, which is why a 2 V red LED on a 12 V rail wastes five sixths of its power as heat in a resistor.',
  'led-resistor.drivenStraightFromA': 'Driven straight from a GPIO',
  'led-resistor.e24IsTheIec':
    'E24 is the IEC 60063 preferred series, 24 values per decade for 5% parts, nominally `10^(n/24)` rounded to two figures. The nearest value is picked on log distance rather than on ohms, because tolerance is a ratio: 62 Ω is as far from 65 Ω as 68 Ω is, in percent.',
  'led-resistor.exactE24Hit': 'exact E24 hit',
  'led-resistor.forwardVoltageVf': 'Forward voltage Vf',
  'led-resistor.headroomIsTheWhole':
    'Headroom is the whole design question. Differentiating the loop equation gives `dI/dVf = -1/R`, so a {spread} bin-to-bin Vf shift changes the current by `0.1 / R` amps, i.e. by `0.1 / (Vs - Vf)` as a fraction. With a 3.2 V white LED on 3.3 V that is 100% of the current, which is exactly why white and blue parts want a driver rather than a resistor from 3.3 V.',
  'led-resistor.idealResistor': 'Ideal resistor',
  'led-resistor.iRPart': 'I²R, {ratingLabel} part',
  'led-resistor.led': 'LED',
  'led-resistor.lede':
    'Pick the series resistor, then see what the nearest stock value actually does to the current, the dissipation and the GPIO driving it. No waveform here, the whole circuit is DC.',
  'led-resistor.ledPower': 'LED power',
  'led-resistor.ledWithSeriesResistor': 'LED with series resistor',
  'led-resistor.nearestE24': 'Nearest E24',
  'led-resistor.nextStepUp': 'next step up {rUp}',
  'led-resistor.noValueWorks': 'no value works',
  'led-resistor.ofItReachesThe': '{efficiency} of it reaches the die',
  'led-resistor.onTarget': '({currentError} on target)',
  'led-resistor.packageRating': 'Package rating',
  'led-resistor.railVs': 'Rail Vs',
  'led-resistor.resistorHeadroom': 'Resistor headroom',
  'led-resistor.resistorPower': 'Resistor power',
  'led-resistor.supplyDraw': 'Supply draw',
  'led-resistor.targetCurrentIf': 'Target current If',
  'led-resistor.theory1':
    "One loop, so Kirchhoff gives `Vs = Vf + I·R` and the resistor follows from Ohm's law: `R = (Vs - Vf) / If`. The LED is modelled as a fixed forward drop, the standard piecewise-linear diode approximation. Above the knee its I-V curve is steep enough that Vf barely moves, so the resistor, not the diode, sets the current.",
  'led-resistor.title': 'LED Series Resistor',
  'led-resistor.type': 'Type',
  'led-resistor.use':
    'The first circuit anyone builds, and still the one most often got wrong. Driving indicator LEDs from a GPIO, sizing current for a panel of them, and checking the pin can actually source what you are asking. Drive an LED straight from a 3.3 V pin with no resistor and you exceed the GPIO rating and cook either the LED or the pin.',
  'led-resistor.vfI': 'Vf · I',
  'led-resistor.vsVf': 'Vs - Vf',
  'led-resistor.vsVfIf': '(Vs - Vf) / If',
  'led-resistor.warn1':
    'Vf of {vf} is at or above the {supply} rail, so the LED never turns on and no resistor value helps. Use a lower Vf part, or boost the rail with a charge pump or a step-up converter.',
  'led-resistor.warn2':
    'Only {headroom} across the resistor. Normal part to part Vf spread of {spread} then moves the current by {current}, so the resistor is barely in control. Raise the rail or use a constant current driver.',
  'led-resistor.warn3':
    '{current} is past the {GPIO_MAX_MA} mA an ESP32 pin should source or sink. Drive the LED through a transistor, or raise the resistor. Real pin current also comes in lower than this, because the output stage drops its own voltage under load, which this ideal-source model does not include.',
  'led-resistor.warn4':
    '{current} is over the {maxCurrent} absolute maximum set for this LED. Continuous operation there shortens life or kills the die.',
  'led-resistor.warn5':
    '{rPower} in a {ratingLabel} resistor. Pick a bigger package, or split the drop across two resistors in series.',
  'ledc-pwm.actualDuty': 'Actual duty',
  'ledc-pwm.asked': 'asked {duty}%',
  'ledc-pwm.asRequested': 'as requested',
  'ledc-pwm.blurb': 'The frequency against resolution trade-off, and the real duty step size.',
  'ledc-pwm.clampedFrom': 'clamped from {requestedBits}',
  'ledc-pwm.dutySteps': 'Duty steps',
  'ledc-pwm.forLedsPickFrequency':
    'For LEDs pick frequency above about 200 Hz to avoid visible flicker, and well above that if the light will ever be filmed. For motors, above 20 kHz puts the switching whine out of hearing, but check the resolution you have left at that frequency.',
  'ledc-pwm.lede':
    'On the ESP32 the LEDC timer divides an 80 MHz clock into 2^bits steps per period, so frequency and duty resolution trade directly against each other. Push the frequency up and the resolution collapses. The scope shows the pin waveform and its average.',
  'ledc-pwm.maxFreqAtThis': 'Max freq at this res',
  'ledc-pwm.pin': 'pin',
  'ledc-pwm.quantisationError': 'Quantisation error',
  'ledc-pwm.requestedBits': 'Requested bits',
  'ledc-pwm.stepSize': 'Step size',
  'ledc-pwm.thatIsAHard':
    'That is a hard trade. 13 bits, the Arduino default, caps out at {maxFrequency}. Wanting 100 kHz for a buck converter leaves only 9 bits. Wanting 1 MHz leaves 6, which is 64 steps and useless for anything analogue.',
  'ledc-pwm.theDutyRegisterIs':
    'The duty register is an integer, so the achievable duty is quantised to `1/2^bits`. Filtered into an analogue voltage that step is `Vcc/2^bits`, which is the real resolution of a PWM DAC: at 3.3 V and 10 bits it is about 3.2 mV, and no amount of filtering recovers anything finer.',
  'ledc-pwm.theory1':
    'The LEDC timer counts to `2^bits` once per PWM period from an 80 MHz source, so the fastest it can run at a given resolution is `f_max = 80 MHz / 2^bits`. Rearranged, the best resolution at a given frequency is `floor(log2(80e6 / f))`.',
  'ledc-pwm.timer': 'Timer',
  'ledc-pwm.title': 'ESP32 LEDC PWM',
  'ledc-pwm.use':
    'Dimming LEDs, driving motors and servos, and generating an analogue voltage from an ESP32. The frequency against resolution trade is a hardware limit people meet without noticing: asking for a high frequency silently reduces your duty resolution, which shows up as visible banding when dimming an LED at low brightness.',
  'ledc-pwm.warn1':
    '{frequency} is not reachable at any resolution: even 1 bit needs the clock to be at least twice the output frequency, and the LEDC source is {APB_CLOCK}.',
  'ledc-pwm.warn2':
    '{requestedBits} bits is impossible at {frequency}. The timer silently uses {bits} bits, which is {stepCount} steps rather than the {requestedBits2} you asked for. Calling ledcSetup with an unsupported pair does not error, it just gives you less than you expect, which is a common source of banding on dimmed LEDs.',
  'ledc-pwm.warn3':
    'Under 8 bits the steps are visible on an LED. For smooth dimming keep the frequency low enough for 10 bits or more, and remember perceived brightness is roughly the square of duty, so the low end needs the finest steps.',
  'level-shifter.07XLow': '0.7 x low rail',
  'level-shifter.aResistorDividerIs':
    'A resistor divider is fine for one-way signals into a 3.3 V input, and nothing else. It is unidirectional, it loads the driver continuously, and its own RC is set by the parallel combination of the two resistors, so making it low-current makes it slow.',
  'level-shifter.bitRate': 'Bit rate',
  'level-shifter.blurb': 'BSS138 bidirectional shifter and divider shifting, with speed limits.',
  'level-shifter.bss138Fet': 'BSS138 FET',
  'level-shifter.edge': 'edge',
  'level-shifter.gateDriveMattersWith':
    'Gate drive matters. With a 1.3 V threshold, a 3.3 V low rail gives 2 V of overdrive and works well. A 1.8 V rail leaves only 0.5 V, which is marginal and drifts with temperature.',
  'level-shifter.highSide': 'High side',
  'level-shifter.lede':
    'Getting 3.3 V and 5 V parts to talk. The scope shows the rising edge at the low-side receiver against its logic-high threshold: if the curve does not clear the line quickly, the link is unreliable however correct the DC levels look.',
  'level-shifter.lowSide': 'Low side',
  'level-shifter.marginOverVth': 'Margin over Vth',
  'level-shifter.maxBitRate': 'Max bit rate',
  'level-shifter.needsAtLeast': 'Needs at least',
  'level-shifter.perLineWhenLow': 'per line, when low',
  'level-shifter.pullUpCurrent': 'Pull-up current',
  'level-shifter.pullUps': 'Pull-ups',
  'level-shifter.r1Series': 'R1 (series)',
  'level-shifter.r2ToGround': 'R2 (to ground)',
  'level-shifter.theConsequenceIsThat':
    'The consequence is that it is an open-drain circuit: it can only pull down, and both sides need pull-ups. Speed is therefore set entirely by the RC of the pull-up against bus capacitance, exactly as with I2C. These boards top out around a few hundred kHz with typical 10 kΩ pull-ups.',
  'level-shifter.theory1':
    "The BSS138 circuit is deceptively clever. The FET's gate sits at the low-side rail and its source faces the low side. Pull the low side down and VGS becomes the full low rail, turning the FET on and dragging the high side down with it. Drive the high side low and the body diode conducts first, pulling the source down, which then turns the FET on properly. That is what makes one FET bidirectional.",
  'level-shifter.title': 'Logic Level Shifter',
  'level-shifter.use':
    'Connecting a 3.3 V ESP32 to 5 V peripherals: older sensors, character LCDs, WS2812 strips, and most Arduino-era shields. It matters because feeding 5 V into a 3.3 V pin damages it over time, and because a 3.3 V output is often just below what a 5 V part reads as a valid high, giving intermittent faults rather than clean failures.',
  'level-shifter.vthV': 'Vth {BSS138_VGS_TH} V',
  'level-shifter.warn1':
    'Only {vgsMargin} of gate drive over the threshold. The FET turns on weakly and slowly, so edges degrade and the shifter becomes unreliable at temperature extremes where Vth shifts. Below about 1.8 V on the low side, use a dedicated shifter IC instead.',
  'level-shifter.warn2':
    'The edge takes {worstRise}, which caps the usable rate at about {maxBitRate}. At {bitRate} the signal never reaches a valid level before it is asked to change again. Use a stronger pull-up or reduce bus capacitance.',
  'level-shifter.warn3':
    'A divider only shifts high to low. It cannot drive the high side from the low side, so it is useless for anything bidirectional such as I2C, and it wastes current continuously whenever the line is high.',
  'link-budget.band': 'Band',
  'link-budget.blurb': 'Free-space path loss against receiver sensitivity, with the fade margin.',
  'link-budget.budget': 'Budget',
  'link-budget.cableAndMiscLoss': 'Cable and misc loss',
  'link-budget.distance': 'Distance',
  'link-budget.eirp': 'EIRP',
  'link-budget.freeSpacePathLoss': 'Free space path loss',
  'link-budget.freeSpacePathLoss2':
    'Free space path loss is `20·log10(d_km) + 20·log10(f_MHz) + 32.44`. Two consequences worth internalising: doubling the distance costs 6 dB, and so does doubling the frequency. That second one is why 868 MHz reaches so much further than 2.4 GHz at the same power, before you even consider that lower frequencies penetrate obstacles better.',
  'link-budget.lede':
    "Will the link close? The scope sweeps received power against DISTANCE, not time: the horizontal axis runs from zero out past the maximum range, and the flat line is the receiver's sensitivity floor. Where they cross, the link dies.",
  'link-budget.linkMargin': 'Link margin',
  'link-budget.neverDesignToZero':
    'Never design to zero margin. This model assumes clear line of sight with nothing in the first Fresnel zone, which almost never holds. Ten dB is a working minimum, and twenty is sensible for anything you cannot easily go and fix.',
  'link-budget.prx': 'Prx',
  'link-budget.radio': 'Radio',
  'link-budget.rangeAt0Db': 'Range at 0 dB margin',
  'link-budget.rangeAtDbMargin': 'Range at {MARGIN_MIN_DB} dB margin',
  'link-budget.receivedPower': 'Received power',
  'link-budget.rxAntennaGain': 'RX antenna gain',
  'link-budget.sensitivity': 'sensitivity',
  'link-budget.sensitivityIsWhereLora':
    'Sensitivity is where LoRa earns its keep. Spreading the signal over more time buys processing gain: SF7 gets to about -123 dBm, SF12 to about -137 dBm. That 14 dB is a factor of five in range, paid for in data rate and airtime.',
  'link-budget.theory1':
    "The whole budget is one line in dB: `Prx = Ptx + Gtx + Grx - FSPL - losses`, and the link closes when Prx sits above the receiver's sensitivity. Working in decibels turns every multiplication into an addition, which is the only reason this is tractable by hand.",
  'link-budget.title': 'RF Link Budget (LoRa / WiFi)',
  'link-budget.txAntennaGain': 'TX antenna gain',
  'link-budget.txPower': 'TX power',
  'link-budget.usableInPractice': 'usable in practice',
  'link-budget.use':
    'Deciding whether a LoRa or WiFi link will actually work at the range you need, before installing anything. It shows why lower frequencies reach further, why LoRa trades data rate for sensitivity, and why a link designed with no margin fails the first time it rains.',
  'link-budget.warn1':
    'The link does not close: received power is {marginDb} dB below the sensitivity floor. Halving the distance buys 6 dB, and so does doubling both antenna gains. A slower LoRa spreading factor buys far more.',
  'link-budget.warn2':
    'Only {marginDb} dB of margin. Free space loss is the best case: rain, foliage, a wall, a hand near the antenna or simple multipath fading each eat several dB. Aim for at least {MARGIN_MIN_DB} dB before calling a link dependable.',
  'lipo-charger.1200Rprog': '1200 / Rprog',
  'lipo-charger.becauseItIsA':
    'Because it is a linear charger, the input to cell voltage difference all becomes heat: `P = (Vin - Vcell)·I`. At 1 A from 5 V into a 3.0 V empty cell that is 2 W in a SOP-8, which is why these boards get hot and throttle. Feeding them from anything above 5 V makes it markedly worse.',
  'lipo-charger.blurb': 'Program resistor to charge current, CC/CV phases and charge time.',
  'lipo-charger.ccPhase': 'CC phase',
  'lipo-charger.cell': 'Cell',
  'lipo-charger.charger': 'Charger',
  'lipo-charger.chipDissipation': 'Chip dissipation',
  'lipo-charger.cvTail': 'CV tail',
  'lipo-charger.floatVoltage': 'Float voltage',
  'lipo-charger.inputVoltage': 'Input voltage',
  'lipo-charger.lede':
    'The TP4056 module everyone uses. The scope shows the classic CC/CV profile against time: constant current until the cell reaches 4.2 V, then constant voltage while the current tails away.',
  'lipo-charger.lithiumChargingIsConstant':
    'Lithium charging is constant current then constant voltage. During CC the current is fixed and the cell voltage climbs. Once it reaches 4.2 V the charger holds that voltage instead and the current decays as the cell fills. Charging stops when the current falls to about a tenth of the set value.',
  'lipo-charger.nearestResistor': 'Nearest resistor',
  'lipo-charger.rprog': 'Rprog',
  'lipo-charger.setCurrent': 'Set current',
  'lipo-charger.theCvTailIs':
    'The CV tail is slower than people expect. It carries only the last fifth or so of the capacity but takes a substantial part of the total time, because current is decaying exponentially the whole way. This is why charging to 90% is much faster per unit of energy than charging to 100%, and why stopping early is kind to the cell.',
  'lipo-charger.theory1':
    'Charge current is set by one resistor: `Ichg = 1200 / Rprog` amps with Rprog in ohms. The datasheet default of 1.2 kΩ gives 1 A, and 10 kΩ gives 120 mA, which is the right order for a small 200 mAh cell.',
  'lipo-charger.title': 'LiPo Charger (TP4056)',
  'lipo-charger.totalChargeTime': 'Total charge time',
  'lipo-charger.use':
    'The TP4056 module used in nearly every hobby lithium project. It matters because one resistor sets the charge current and getting it wrong either takes all day or charges the cell faster than it should be charged, and because the module is a linear charger that gets hot at high current.',
  'lipo-charger.vcell': 'Vcell',
  'lipo-charger.warn1':
    'Charging at {cRate} C. Most lithium cells want 0.5 C to 1 C, and going faster shortens life sharply and generates heat the little TP4056 board cannot shed. Raise Rprog: {capacityAh} gives exactly 1 C for this cell.',
  'lipo-charger.warn2':
    'The chip dissipates {dissipation} at the start of charging. It is a linear charger, so every volt between input and cell becomes heat in that small package. It will thermally throttle, stretching the charge time well past the estimate here. Keep the input close to 5 V.',
  'lipo-charger.warn3':
    'A bare TP4056 board has no protection. The version with the DW01 and dual MOSFET adds over-discharge, over-current and short-circuit protection, and lithium cells should not be used without it. Neither version does cell balancing, so neither is suitable for a multi-cell series pack.',
  'lm2596.actualVout': 'Actual Vout',
  'lm2596.blurb': 'The ubiquitous 150 kHz buck module: feedback divider, limits, efficiency.',
  'lm2596.diodeLoss': 'Diode loss',
  'lm2596.efficiencyIsDominatedBy':
    'Efficiency is dominated by two terms: the internal switch dropping about 1.16 V at 3 A, and the catch diode burning `Vf·Idiode` for the whole off-time. At low output voltages the diode conducts most of the period, which is why a 12 V to 3.3 V conversion is markedly less efficient than 12 V to 5 V.',
  'lm2596.esrCap': 'esr {vrippleEsr} + cap {vrippleCap}',
  'lm2596.feedbackDivider': 'Feedback divider',
  'lm2596.fixed': 'fixed',
  'lm2596.headroom': 'headroom {headroom}',
  'lm2596.lede':
    'The blue buck module from every parts kit. Pick the feedback divider for a target rail, then check it against the real limits: 3 A, 40 V, and a package that gets hot long before it hits either. The scope shows inductor current at the fixed 150 kHz.',
  'lm2596.lossInTheIc': 'Loss in the IC',
  'lm2596.maxC': 'max {TJ_MAX} °C',
  'lm2596.minimumVin': 'Minimum Vin',
  'lm2596.offTarget': '{voutError}% off target',
  'lm2596.r1FbToGnd': 'R1 (FB to gnd)',
  'lm2596.r2From': 'R2 from {series}',
  'lm2596.r2Ideal': 'R2 ideal',
  'lm2596.resistorSeries': 'Resistor series',
  'lm2596.setsItsTemperature': 'sets its temperature',
  'lm2596.theory1':
    "Output is set by the feedback divider: `Vout = Vref·(1 + R2/R1)` with `Vref = {VREF} V`. Keep R1 in the 1k to 5k range the datasheet suggests: too high and the FB pin's own bias current shifts the output, too low and the divider wastes current continuously.",
  'lm2596.theSwitchingFrequencyIs':
    "The switching frequency is fixed at 150 kHz internally, which is the module's main limitation. Low frequency means a physically large inductor and capacitor for a given ripple, since `dIL = Vout·(1-D)/(fsw·L)` and `dV = dIL/(8·fsw·C)` both scale inversely with fsw.",
  'lm2596.thetaJa': 'Theta JA',
  'lm2596.theThermalCheckIs':
    'The thermal check is usually the real limit, not the current rating. Only the loss inside the IC heats the junction, so `Tj = Tamb + Pic·ThetaJA`. On a bare module with no airflow ThetaJA is poor, and 1 to 2 W of internal loss is enough to reach thermal shutdown.',
  'lm2596.title': 'LM2596 Module',
  'lm2596.use':
    'The blue adjustable buck module in every parts kit, used to get 5 V or 3.3 V from a 12 V supply. This page exists because the modules are sold claiming 3 A while their thermal design gives out long before that, and because setting the feedback divider by trial and error is how people destroy what they are powering.',
  'lm2596.voutTarget': 'Vout target',
  'lm2596.warn1':
    'Input is below the {vinMinimum} needed to hold this output at this load. The regulator runs at maximum duty and the output simply follows the input down, minus the switch drop.',
  'lm2596.warn2':
    'Below the {VIN_MIN} V datasheet minimum. The internal reference is not guaranteed here.',
  'lm2596.warn3': 'Above the {VIN_MAX} V absolute maximum. This destroys the part.',
  'lm2596.warn4':
    'Past the {IOUT_MAX} A rating. These modules are commonly sold claiming 3 A but with a heatsink barely adequate above 1.5 A.',
  'lm2596.warn5':
    'Peak inductor current is above the guaranteed current limit, so the part will trip into cycle-by-cycle limiting before reaching this load. Use a larger inductor.',
  'lm2596.warn6':
    'Junction at {tj} °C, past the {TJ_MAX} °C limit. It will shut down thermally. Improve airflow, add a heatsink, or reduce the load.',
  'lm2596.warn7':
    'The target is below the {VREF} V feedback reference, which this topology cannot produce at all.',
  'lm317.240IsStandardKeeps': '240 Ω is standard: {V_REF} keeps the part in regulation unloaded.',
  'lm317.298KIs25': '298 K is 25 C. Still air inside a sealed box runs 10 to 20 K hotter.',
  'lm317.aDifferentTopology': 'a different topology',
  'lm317.adjustPinTerm': 'Adjust pin term',
  'lm317.againstTarget': '({targetErr}{targetErr2} against target)',
  'lm317.aHeatsinkIsMandatory': '(a heatsink is mandatory)',
  'lm317.aKWSink': 'a {rthSinkNeeded} K/W sink',
  'lm317.atAndAmbient': '(at {pd} and {ambientK} ambient)',
  'lm317.blurb': 'Set resistors, dissipation and whether it needs a heatsink.',
  'lm317.clipOnTo220': 'Clip-on TO-220 fin 20 to 30, 25 mm extrusion 10, 50 mm block 4.',
  'lm317.e24Gives': '(E24 {r2E24} gives {voutE24})',
  'lm317.everythingLeftOverIs':
    'Everything left over is heat. `Pd = (Vin - Vout)·I` with no switching and nowhere to hide, so efficiency is just Vout/Vin. The junction sits at `Tj = Ta + Pd·Rth` where Rth is the series path from junction to ambient: junction to case, case to heatsink through grease or a pad, then heatsink to air. Invert it to size the sink, `Rsa = (Tj_max - Ta)/Pd - Rjc - Rcs`. A negative answer means the package itself is the bottleneck and no heatsink will save it.',
  'lm317.freeAirIsEnough': '(free air is enough)',
  'lm317.greaseAlone05': 'Grease alone 0.5, silicone pad 2, mica plus grease 1.4.',
  'lm317.headroom': 'Headroom',
  'lm317.heatsinkFitted': 'Heatsink fitted',
  'lm317.heatsinkNeeded': 'Heatsink needed',
  'lm317.heatsinkRth': 'Heatsink Rth',
  'lm317.iadjIs50A':
    'Iadj is 50 µA typical. With R1 at 240 Ω the program current is 5.2 mA, a hundred times larger, so the Iadj term is a rounding error. Scale the divider into the tens of kilohms to save power and Iadj becomes a first-order term that also drifts with temperature: 10 k over 10 k reads 3.0 V, not the 2.5 V the ratio promises.',
  'lm317.inFreeAir': '({thermal} in free air)',
  'lm317.interfaceRth': 'Interface Rth',
  'lm317.kRiseLimit': '({riseK} K rise, limit {TJ_MAX_K})',
  'lm317.kWOrBetter': '{rthSinkNeeded} K/W or better',
  'lm317.lm317AdjustableRegulator': 'LM317 adjustable regulator',
  'lm317.loadCurrentCeiling': 'Load current ceiling',
  'lm317.loadTakesDeviceDraws': '(load takes {pLoad}, device draws {iDevice})',
  'lm317.minLoadSoR1': '(min load {I_LOAD_MIN}, so R1 ≤ {r1Max})',
  'lm317.needsSoVin': '(needs {DROPOUT_V}, so Vin ≥ {vinMin})',
  'lm317.noneIsEnough': 'none is enough',
  'lm317.ofVout': '({vout}% of Vout)',
  'lm317.package': 'Package',
  'lm317.pickR1AndR2':
    'Pick R1 and R2 for the rail you want, then check the part survives it. The scope is not a waveform: the horizontal axis is load current from 0 to {max} A, so read the per-division figure in milliamps, and the vertical axis is junction temperature in kelvin against the 398 K (125 C) limit.',
  'lm317.programCurrent': 'Program current',
  'lm317.r1HasAnUpper':
    'R1 has an upper bound the ratio does not show. The part needs {I_LOAD_MIN} of load to regulate, so the divider is normally sized to supply it on its own: `R1 ≤ Vref/Imin = {I_LOAD_MIN2}` . That is where the 240 Ω on every reference schematic comes from.',
  'lm317.r1OutToAdj': 'R1 (OUT to ADJ)',
  'lm317.r2AdjToGnd': 'R2 (ADJ to GND)',
  'lm317.r2ForTarget': 'R2 for target',
  'lm317.supplyAndLoad': 'Supply and load',
  'lm317.targetVout': 'Target Vout',
  'lm317.theory1':
    'The LM317 is a floating regulator: it does nothing but hold `Vref = {V_REF} V` between OUT and ADJ. R1 sits across that reference, so it carries a fixed `Iprog = Vref/R1` whatever the load does. That current plus the adjust pin current runs to ground through R2, so `Vout = Vref·(1 + R2/R1) + Iadj·R2`.',
  'lm317.thePartRatingThermals': '(the part rating, thermals have room)',
  'lm317.thermalBudget': '(thermal, {pdMax} budget)',
  'lm317.theTraceIsThat':
    'The trace is that equation swept over load current, not a time-domain simulation: Tj is linear in Iout at fixed headroom, offset at zero load by the divider current the regulator still has to pass. Where it crosses the flat 398 K line is the honest current limit of the design, which is usually well below the 1.5 A the datasheet front page advertises.',
  'lm317.title': 'Linear Regulator (LM317)',
  'lm317.tjFitted': 'Tj fitted',
  'lm317.tjFreeAir': 'Tj free air',
  'lm317.tjWithNoHeatsink': 'Tj with no heatsink',
  'lm317.unregulatedInputAtIts': 'Unregulated input, at its lowest. Include ripple troughs.',
  'lm317.use':
    'Simple adjustable supplies, current sources for LEDs and battery charging, and cases where switching noise is unacceptable. The critical output is dissipation: a linear regulator burns the voltage difference as heat, so 12 V to 3.3 V at 1 A means nearly 9 W and a heatsink, which is why a buck converter usually wins.',
  'lm317.voutVinALinear': '(Vout/Vin, a linear regulator burns the rest)',
  'lm317.voutWorstCase': 'Vout worst case',
  'lm317.vrefSpreadToV': '(Vref spread {V_REF_MIN} to {V_REF_MAX} V, resistors exact)',
  'lm317.warn1':
    'Below dropout: {headroom} of headroom where the LM317 needs {DROPOUT_V}. The pass element is saturated, so the output follows the input down and every figure above is meaningless. Raise Vin above {vinMin} or drop the target.',
  'lm317.warn2':
    'Input-to-output differential is {headroom}, past the {V_IO_MAX} absolute maximum. The part fails regardless of how cool you keep it.',
  'lm317.warn3':
    'Junction at {tjK}, past the internal thermal shutdown near 175 C. The regulator will fold the output back and oscillate in and out of shutdown rather than sit there. Shed {pdMax} or fit a better sink.',
  'lm317.warn4':
    'Junction at {tjK}, over the {TJ_MAX_K} limit. It may keep regulating but it is out of spec and its life is being spent fast. Needs {topology} , a lower Vin, or under {ioutCeiling} of load.',
  'lm317.warn5':
    'No heatsink is enough: {pd} through the {rthJC} K/W junction-to-case path alone already exceeds the budget at {ambientK} ambient. Drop Vin closer to Vout, or use a switching regulator and stop converting the difference into heat.',
  'lm317.warn6':
    '{iout} is past the {I_OUT_MAX} guaranteed output. The internal limiter takes over near 2.2 A typical, but that is a typical, not a promise.',
  'lm317.warn7':
    'R1 draws only {iProgram}, under the {I_LOAD_MIN} minimum load. With the real load disconnected the output drifts up. Use R1 no larger than {r1Max}, or fit a permanent bleeder.',
  'lm317.warn8':
    'The 50 µA adjust current adds {iadjTerm} through R2, which is {vout}% of the output and drifts with temperature. Scale both resistors down so the program current dominates.',
  'lm317.worstCaseNotAverage': 'Worst case, not average. An ESP32 peaks near 0.5 A on transmit.',
  'mosfet-switch.blurb': 'Gate drive margin, operating region, conduction and switching losses.',
  'mosfet-switch.burnedInRgAnd': '(burned in Rg and the pin, not the FET)',
  'mosfet-switch.channelDissipation': 'Channel dissipation',
  'mosfet-switch.conductionLoss': 'Conduction loss',
  'mosfet-switch.conductionSwitching': '(conduction + switching)',
  'mosfet-switch.datasheetAt': '(datasheet {rdsOnSpec} at {vgsSpec})',
  'mosfet-switch.dIdRdsAt': '(D·Id²·RDS at {duty}% duty)',
  'mosfet-switch.dieLimited': '(die limited)',
  'mosfet-switch.drainCurrent': 'Drain current',
  'mosfet-switch.driveLimitedNotDie': '(drive limited, not die limited)',
  'mosfet-switch.edges': '(edges {trEff} / {tfEff})',
  'mosfet-switch.esp32GpioIsV': 'ESP32 GPIO is {VCC} V',
  'mosfet-switch.fallTimeTf': 'Fall time tf',
  'mosfet-switch.gateChargeQg': 'Gate charge Qg',
  'mosfet-switch.gateChargeTime': 'Gate charge time',
  'mosfet-switch.gateDrive': 'Gate drive',
  'mosfet-switch.gateDrivePower': 'Gate drive power',
  'mosfet-switch.gateOverdrive': 'Gate overdrive',
  'mosfet-switch.gateResistorRg': 'Gate resistor Rg',
  'mosfet-switch.gpioLimitMa': '(GPIO limit {GPIO_MAX_MA} mA)',
  'mosfet-switch.idealSwitch': '(ideal switch {idIdeal})',
  'mosfet-switch.junctionTemperature': 'Junction temperature',
  'mosfet-switch.lede':
    'A logic level N-channel MOSFET switching a load from an ESP32 GPIO. The scope shows gate and drain voltage over one or more PWM cycles, horizontal axis is time. Readouts below are the operating point, the loss split and the junction temperature.',
  'mosfet-switch.lossesSplitThreeWays':
    'Losses split three ways. Conduction is `Pcond = D·Id²·RDS(on)`. Crossover is `Psw = 0.5·VDS·Id·(tr + tf)·fsw`, taking each edge as a current rise at full voltage followed by a voltage fall at full current, which is the conservative clamped inductive case. Gate charge costs `Pgate = Qg·VGS·fsw`, dissipated in the gate resistor and the driving pin rather than in the FET. Only the first two heat the die, so `Tj = Ta + (Pcond + Psw)·Rth(j-a)`.',
  'mosfet-switch.lowSideNChannel': 'Low side N-channel MOSFET switch',
  'mosfet-switch.millerPlateau': 'Miller plateau',
  'mosfet-switch.mosfet': 'MOSFET',
  'mosfet-switch.ofWhatTheSwitch': '({efficiency}% of what the switch passes)',
  'mosfet-switch.operatingRegion': 'Operating region',
  'mosfet-switch.part': 'Part',
  'mosfet-switch.peakGateCurrent': 'Peak gate current',
  'mosfet-switch.powerToLoad': 'Power to load',
  'mosfet-switch.quotedAtVgs': 'quoted at VGS',
  'mosfet-switch.rdsOnAtThis': 'RDS(on) at this VGS',
  'mosfet-switch.rdsOnIsNot':
    'RDS(on) is not a constant. Deep in triode the channel is `rds = 1 / (k·Vov)`, so a datasheet quote pins down k: `k = 1 / (RDS(on)spec · (VGSspec - Vth))`, and at any other gate voltage `RDS(on) = RDS(on)spec · (VGSspec - Vth) / (VGS - Vth)`. That is why a part advertised at 22 mΩ is nearer 51 mΩ on 3.3 V, and why a part quoted at 10 V is simply off.',
  'mosfet-switch.rdsOnQuoted': 'RDS(on) quoted',
  'mosfet-switch.riseKOverC': '(rise {ta} K over {ta2} °C)',
  'mosfet-switch.riseTimeTr': 'Rise time tr',
  'mosfet-switch.rthJunctionToAmbient': 'Rth junction to ambient',
  'mosfet-switch.supplyVs': 'Supply VS',
  'mosfet-switch.switching': 'Switching',
  'mosfet-switch.switchingLoss': 'Switching loss',
  'mosfet-switch.theChannelFollowsThe':
    'The channel follows the square law. Below threshold there is no channel at all. Above it, with `Vov = VGS - Vth`, the drain current is `Id = k·(Vov·VDS - VDS²/2)` in triode and saturates at `Id = 0.5·k·Vov²` once `VDS &gt; Vov`. The operating point is the intersection of that curve with the load line `VDS = VS - Id·Rload`, solved in closed form rather than iterated.',
  'mosfet-switch.theEdgeTimesUsed':
    'The edge times used are `max(tr, Qg·Rg/VGS)`. A gate cannot move faster than the drive can shift its charge, so a large gate resistor on a GPIO, not the die, usually sets the switching speed and therefore the switching loss.',
  'mosfet-switch.theScopeTraceIs':
    'The scope trace is built from that piecewise description evaluated directly at each sample time, so it is exact at any time base and integrating `VDS·Id` over it returns the same numbers as the closed forms above.',
  'mosfet-switch.thresholdVth': 'Threshold Vth',
  'mosfet-switch.title': 'MOSFET Circuit Simulator',
  'mosfet-switch.use':
    'The standard way to switch anything substantial from an ESP32: motors, heaters, LED strips, solenoids. The critical check is gate drive, since a 3.3 V pin cannot fully turn on a MOSFET specified at 10 V VGS. That is the single most common ESP32 hardware mistake, and it shows up as a FET that works on the bench and burns out under load.',
  'mosfet-switch.vds': 'Vds',
  'mosfet-switch.vdsOnState': 'VDS on state',
  'mosfet-switch.vgs': 'Vgs',
  'mosfet-switch.vgsVth': '(VGS {vgsDrive} - Vth {vth})',
  'mosfet-switch.warn1':
    'VGS of {vgsDrive} is at or below the {vth} threshold, so no channel forms and the load never sees current. This is the classic failure of hanging a standard MOSFET off a 3.3 V pin: pick a logic level part, or add a gate driver or a small BJT level shifter to swing the gate to 10 V.',
  'mosfet-switch.warn2':
    'The FET is sitting in saturation, i.e. behaving as a constant current source at {id} with {vds} across it. That is a linear regulator, not a switch, and it dissipates {pCond}. Raise VGS or raise the load resistance.',
  'mosfet-switch.warn3':
    'Peak gate current is {igPeak}, over the {GPIO_MAX_MA} mA an ESP32 GPIO is rated for. Raise Rg or use a gate driver.',
  'mosfet-switch.warn4':
    'The edges take {tfEff} out of a {fsw} period. The FET spends most of the cycle in transition, so the hard switching loss model no longer applies and the real device will be hotter than shown.',
  'mosfet-switch.warn5':
    'Junction is at {tj} °C, past the 150 °C rating. Add a heatsink (lower Rth), lower the current, or improve the gate drive.',
  'ntc-thermistor.adcCountsPerK': 'ADC counts per K',
  'ntc-thermistor.atC': 'at {tempC} °C',
  'ntc-thermistor.beta': 'Beta',
  'ntc-thermistor.blurb': 'Beta and Steinhart-Hart conversion, divider output curve, self-heating.',
  'ntc-thermistor.dissipationConstant': 'Dissipation constant',
  'ntc-thermistor.from': 'From',
  'ntc-thermistor.lede':
    'A thermistor is not linear, and that is the whole design problem. The scope sweeps divider output against TEMPERATURE, not time: the horizontal axis runs from the low to the high limit you set, in °C.',
  'ntc-thermistor.rAtReference': 'R at reference',
  'ntc-thermistor.referenceTemp': 'Reference temp',
  'ntc-thermistor.resistanceNow': 'Resistance now',
  'ntc-thermistor.selfHeating': 'Self heating',
  'ntc-thermistor.selfHeatingError': 'Self heating error',
  'ntc-thermistor.selfHeatingIsThe':
    'Self heating is the trap. Current through the bead makes heat, the dissipation constant (typically 1 to 5 mW/K in still air) converts that to a temperature error, and the sensor confidently reports it. Keep the current small, or power the divider only for the microseconds you are sampling.',
  'ntc-thermistor.steinhartHart1T':
    'Steinhart-Hart, `1/T = A + B·ln(R) + C·ln(R)³`, gets to a few millikelvin over a wide range but needs three calibration points. The Beta form is the special case with C = 0.',
  'ntc-thermistor.sweepRange': 'Sweep range',
  'ntc-thermistor.temperatureNow': 'Temperature now',
  'ntc-thermistor.theCurveOnScreen':
    "The curve on screen is the real design constraint. Sensitivity is highest where the thermistor's resistance matches the series resistor, and falls away at both ends: at high temperature the thermistor is a short next to the fixed resistor, and at low temperature it swamps it. So a 10k NTC with a 10k series resistor resolves beautifully near 25 °C and poorly at 120 °C.",
  'ntc-thermistor.theory1':
    'The Beta equation is `1/T = 1/T0 + ln(R/R0)/B`, rearranged to `R = R0·exp(B·(1/T - 1/T0))`. One parameter, one calibration point, good to about half a kelvin over a 50 K span. Datasheets quote different B values for different intervals, e.g. B25/85, precisely because it is only a local fit.',
  'ntc-thermistor.thermistor': 'Thermistor',
  'ntc-thermistor.title': 'NTC Thermistor',
  'ntc-thermistor.to': 'To',
  'ntc-thermistor.use':
    'Temperature sensing in 3D printer hot ends and beds, battery packs, and general monitoring, where a thermistor is far cheaper than a digital sensor. The non-linearity is the design problem, and this shows where the divider is sensitive and where it goes blind, plus the self-heating error that makes a sensor read its own current.',
  'ntc-thermistor.warn1':
    'The bead is dissipating {selfHeatW}, warming itself by {selfHeatK} K. It is measuring its own current, not the ambient. Raise the series resistor, or switch the divider on only while sampling.',
  'ntc-thermistor.warn2':
    "Sensitivity peaks when the series resistor equals the thermistor's resistance at the temperature you care most about. For best resolution around {t0C} °C, set the series resistor to {r0}.",
  'op-amp.0VForSingle': '0 V for single supply ESP32 work.',
  'op-amp.12PiRin': '(1 / 2·pi·Rin·Cf)',
  'op-amp.1RfRgSets': '(1 + Rf/Rg, sets the bandwidth)',
  'op-amp.2PerInputCycle': '(2 per input cycle when tripping)',
  'op-amp.aCompensatedOpAmp':
    'A compensated op-amp holds gain times bandwidth constant, so the closed-loop corner is `BW = GBW / noise gain`. Noise gain is `1 + Rf/Rg` for both topologies, which is why an inverting stage of -10 and a non-inverting stage of +11 have exactly the same bandwidth even though their signal gains differ.',
  'op-amp.amplifier': 'Op-amp schematic',
  'op-amp.bandwidthIsASmall':
    'Bandwidth is a small-signal figure. Large signals hit the slew rate instead: a sine of peak Vp needs `2·pi·f·Vp` volts per second, so the largest undistorted sine is the full power bandwidth `SR / (2·pi·Vp)`. Past it the output turns into a triangle no matter what the gain plot says.',
  'op-amp.belowThisItIs': '(below this it is just a {gain}x inverter)',
  'op-amp.blurb': 'Inverting, non-inverting, summing, difference, integrator and comparator modes.',
  'op-amp.classic': 'classic',
  'op-amp.classic2': 'Classic',
  'op-amp.closedLoopGain': 'Closed-loop gain',
  'op-amp.configuration': 'Configuration',
  'op-amp.db': '({gainDb} dB{inverted})',
  'op-amp.dcBleedCorner': 'DC bleed corner',
  'op-amp.edgesInWindow': 'Edges in window',
  'op-amp.everythingHereSwingsAbout':
    'Everything here swings about Vbias rather than about 0 V, because on a single 3.3 V supply there is no negative rail to swing into. That means the non-inverting pin of an inverting stage and the Rg leg of a non-inverting stage both return to mid rail, not to ground. Set Vbias to 0 and a split supply and the formulas collapse back to the textbook ones.',
  'op-amp.feedbackCf': 'Feedback Cf',
  'op-amp.feedbackR1': 'Feedback R1',
  'op-amp.feedbackRf': 'Feedback Rf',
  'op-amp.fullPowerBandwidth': 'Full power bandwidth',
  'op-amp.gainBandwidth': 'Gain bandwidth',
  'op-amp.gbw': '(GBW / {noiseGain})',
  'op-amp.groundLegRg': 'Ground leg Rg',
  'op-amp.hysteresisBand': 'Hysteresis band',
  'op-amp.inputBLevel': 'Input B level',
  'op-amp.inputBR2': 'Input B R2',
  'op-amp.inputRin': 'Input Rin',
  'op-amp.integratorUnityGain': 'Integrator unity gain',
  'op-amp.inverted': ', inverted',
  'op-amp.lede':
    'Ideal closed-loop gain with the three limits that actually bite: gain bandwidth product, slew rate and output swing. The scope shows Vin against Vout in real time.',
  'op-amp.lowerThreshold': 'Lower threshold',
  'op-amp.mcp6002Is1Mhz': 'MCP6002 is 1 MHz. OPA2340 is 5.5 MHz.',
  'op-amp.midRailOnA': 'Mid rail on a single supply, 0 V on a split supply.',
  'op-amp.negativeRail': 'Negative rail',
  'op-amp.network': 'Network',
  'op-amp.neverTrips': '(never trips)',
  'op-amp.noiseGain': 'Noise gain',
  'op-amp.ofTheDcGain': '({gainError}% of the DC gain)',
  'op-amp.outputStage': 'Output stage',
  'op-amp.partAndSupply': 'Part and supply',
  'op-amp.partDoesIE': '(part does {slewRate}, i.e. {e6} V/µs)',
  'op-amp.positiveRail': 'Positive rail',
  'op-amp.railsClipAt': '(rails clip at {lo} / {hi})',
  'op-amp.railToRail': 'Rail to rail',
  'op-amp.referenceR2': 'Reference R2',
  'op-amp.referenceVbias': 'Reference Vbias',
  'op-amp.referenceVref': 'Reference Vref',
  'op-amp.responseAt': 'Response at {frequency}',
  'op-amp.rinIntoAVirtual': '(Rin into a virtual earth)',
  'op-amp.rrl': 'rrl',
  'op-amp.slewDemanded': 'Slew demanded',
  'op-amp.slewRate': 'Slew rate',
  'op-amp.smallerR1MeansA': 'Smaller R1 means a wider hysteresis band.',
  'op-amp.sr2PiVpk': '(SR / 2·pi·Vpk)',
  'op-amp.straightOntoThePin': '(straight onto the pin)',
  'op-amp.subtractedLevel': 'Subtracted level',
  'op-amp.theComparatorIsThe':
    'The comparator is the same part with positive feedback instead of negative. The non-inverting node sits on a divider between Vref through R2 and the output through R1, so `Vth = (Vref·R2 + Vout·R1)/(R1 + R2)`. With R2 much larger than R1 that is the familiar `Vth = Vref ± Vout·R1/(R1+R2)`, and the band is exactly `(Vhigh - Vlow)·R1/(R1+R2)`. Anything smaller than that band cannot make the output chatter.',
  'op-amp.theory1':
    'With enough open-loop gain the inverting pin tracks the non-inverting pin, so the resistor network alone sets the gain: `Av = -Rf/Rin` inverting, `Av = 1 + Rf/Rg` non-inverting, `Av = 1` for a buffer. The summing amp is superposition on one virtual earth, `Vout = -Rf·(V1/R1 + V2/R2)`, and the difference amp is `Vout = Vref + (Rf/Rin)·(V+ - V-)` with matched ratios on both branches.',
  'op-amp.theScopeTraceIs':
    'The scope trace is a sample-by-sample simulation. Every pole uses exact zero-order-hold discretisation, `y[n] = target + (y[n-1] - target)·e^(-dt/tau)`, so it stays stable at any time base; slew limiting and rail clipping are then applied per sample, which is what puts the flat tops and straight edges on the trace. The integrator is modelled as the practical one, Rf across Cf, so it has a finite DC gain instead of drifting into a rail.',
  'op-amp.timeOnARail': 'Time on a rail',
  'op-amp.title': 'Operational Amplifier',
  'op-amp.to': '({vmin} to {vmax})',
  'op-amp.upperThreshold': 'Upper threshold',
  'op-amp.use':
    'Amplifying a sensor signal into an ADC range, buffering a high-impedance source, summing and differencing, integrating, and comparing with hysteresis. Also for finding out why a circuit that works at DC misbehaves at speed: the gain-bandwidth limit and slew rate are what turn a textbook design into a distorted one.',
  'op-amp.vth': 'Vth',
  'op-amp.warn1':
    'The output is on a rail for {clipped}% of the window. Beyond that point the gain formula no longer describes the circuit: reduce the gain, reduce the input, or widen the supply.',
  'op-amp.warn2':
    'Slew limited. The output needs {slewNeeded} but the part only does {slewRate}, so sine waves come out as triangles and the small-signal bandwidth figure no longer applies.',
  'op-amp.warn3':
    'The input pin leaves the supply range ({inMin} to {inMax} against rails of {vneg} to {vpos}). Real input stages stop working there and some parts phase invert, so this trace is fiction outside the rails.',
  'op-amp.warn4':
    'Vbias sits outside the usable output range, so the stage has nowhere to swing. On a single supply set it to half the positive rail, i.e. {vpos}.',
  'op-amp.warn5':
    "The integrator's unity gain frequency ({integratorUnity}) is within a decade of the op-amp's GBW ({gbw}). The op-amp runs out of open-loop gain before the capacitor takes over, so the integration stops being clean. Raise Rin or Cf, or pick a faster part.",
  'opt.0Db': '0 dB',
  'opt.11Db': '11 dB',
  'opt.1n40071ASilicon': '1N4007 1 A silicon',
  'opt.1n4148Signal': '1N4148 signal',
  'opt.1n54083ASilicon': '1N5408 3 A silicon',
  'opt.1n5819Schottky': '1N5819 Schottky',
  'opt.25Db': '2.5 dB',
  'opt.6Db': '6 dB',
  'opt.amberYellow': 'Amber / yellow',
  'opt.bareWire095': 'Bare wire, 0.95',
  'opt.black': 'black',
  'opt.ble1Mbps': 'BLE 1 Mbps',
  'opt.blue': 'Blue',
  'opt.blue2': 'blue',
  'opt.bridge': 'Bridge',
  'opt.brown': 'brown',
  'opt.bufferUnityGain': 'Buffer (unity gain)',
  'opt.centreTap': 'Centre tap',
  'opt.coax': 'coax',
  'opt.coaxDielectric066': 'Coax dielectric, 0.66',
  'opt.comparatorHysteresis': 'Comparator + hysteresis',
  'opt.copperForContrast': 'Copper (for contrast)',
  'opt.dcStep': 'DC step',
  'opt.difference': 'Difference',
  'opt.extended05To': 'Extended 0.5 to 2.5 ms',
  'opt.fast400Khz': 'Fast 400 kHz',
  'opt.fastPlus1Mhz': 'Fast plus 1 MHz',
  'opt.free': 'free',
  'opt.freeSpace100': 'Free space, 1.00',
  'opt.gpsL11575Mhz': 'GPS L1 1575 MHz',
  'opt.green': 'green',
  'opt.greenGapOlder': 'Green (GaP, older)',
  'opt.greenIngan': 'Green (InGaN)',
  'opt.grey': 'grey',
  'opt.ina219Digital': 'INA219 (digital)',
  'opt.infrared940Nm': 'Infrared 940 nm',
  'opt.integrator': 'Integrator',
  'opt.kanthalA1Fecral': 'Kanthal A1 (FeCrAl)',
  'opt.leadAcidSla': 'Lead acid (SLA)',
  'opt.lifepo4': 'LiFePO4',
  'opt.liIon18650': 'Li-ion 18650',
  'opt.lipoPouch': 'LiPo pouch',
  'opt.lora433Mhz': 'LoRa 433 MHz',
  'opt.lora868MhzEu': 'LoRa 868 MHz (EU)',
  'opt.lora915MhzUs': 'LoRa 915 MHz (US)',
  'opt.loraSf12125Khz': 'LoRa SF12 125 kHz',
  'opt.loraSf7125Khz': 'LoRa SF7 125 kHz',
  'opt.loraSf9125Khz': 'LoRa SF9 125 kHz',
  'opt.narrow10To': 'Narrow 1.0 to 2.0 ms, 90 deg',
  'opt.ne555Bipolar': 'NE555 bipolar',
  'opt.nichrome6016Nicr': 'Nichrome 60/16 (NiCr C)',
  'opt.nichrome8020Nicr': 'Nichrome 80/20 (NiCr A)',
  'opt.nimh': 'NiMH',
  'opt.none': 'None',
  'opt.nonInverting': 'Non-inverting',
  'opt.orange': 'orange',
  'opt.pcb': 'pcb',
  'opt.pcbMicrostrip055': 'PCB microstrip, 0.55',
  'opt.red': 'Red',
  'opt.red2': 'red',
  'opt.sawtooth': 'Sawtooth',
  'opt.shuntAmplifier': 'Shunt + amplifier',
  'opt.stainless304': 'Stainless 304',
  'opt.standard100Khz': 'Standard 100 kHz',
  'opt.standard10To': 'Standard 1.0 to 2.0 ms',
  'opt.summing': 'Summing',
  'opt.tlc555Cmos': 'TLC555 CMOS',
  'opt.to263D2pak': 'TO-263 (D2PAK)',
  'opt.uv395Nm': 'UV 395 nm',
  'opt.violet': 'violet',
  'opt.white': 'white',
  'opt.wifi5Ghz': 'WiFi 5 GHz',
  'opt.wifi80211b1': 'WiFi 802.11b 1 Mbps',
  'opt.wifi80211nMcs7': 'WiFi 802.11n MCS7',
  'opt.wifiBle24': 'WiFi/BLE 2.4 GHz',
  'opt.wire': 'wire',
  'opt.yellow': 'yellow',
  'photovoltaic.blurb':
    'Single-diode model: I-V and P-V curves, MPP against irradiance and temperature.',
  'photovoltaic.cellEdge': 'Cell edge',
  'photovoltaic.cellTemperature': 'Cell temperature',
  'photovoltaic.conditions': 'Conditions',
  'photovoltaic.fillFactor': 'Fill factor',
  'photovoltaic.fillFactorPmpVoc':
    'Fill factor `Pmp / (Voc·Isc)` measures how square the knee is. Series resistance flattens the top of the curve and shunt resistance tilts the flat current region, both dragging FF down from the 0.75 to 0.82 a healthy c-Si module shows.',
  'photovoltaic.healthy': '(healthy)',
  'photovoltaic.idealityN': 'Ideality n',
  'photovoltaic.imp': 'Imp',
  'photovoltaic.impRs': 'Imp²·Rs',
  'photovoltaic.irradiance': 'Irradiance',
  'photovoltaic.isc': 'Isc',
  'photovoltaic.leakedThroughRsh': 'leaked through Rsh',
  'photovoltaic.lede':
    'Single diode model of a silicon panel. The scope plots the I-V and P-V curves against PANEL VOLTAGE, not time: the horizontal axis runs 0 V to Voc. Power is scaled down by 10 so it shares the axis with current.',
  'photovoltaic.modelParameters': 'Model parameters',
  'photovoltaic.overM': 'over {area} m²',
  'photovoltaic.panelDatasheetAtStc': 'Panel (datasheet, at STC)',
  'photovoltaic.photocurrentScalesAlmostExactly':
    'Photocurrent scales almost exactly with irradiance, which is why Isc tracks sunlight linearly. Voc only moves with the logarithm of irradiance, so a panel in cloud keeps most of its voltage and loses current.',
  'photovoltaic.pmp': 'Pmp',
  'photovoltaic.pmpAtStc': 'Pmp at STC',
  'photovoltaic.pmpTempCoeff': 'Pmp temp coeff',
  'photovoltaic.poor': '(poor)',
  'photovoltaic.seriesLoss': 'Series loss',
  'photovoltaic.shuntLoss': 'Shunt loss',
  'photovoltaic.shuntRsh': 'Shunt Rsh',
  'photovoltaic.temperatureWorksTheOther':
    'Temperature works the other way. Isc creeps up a little, but I0 climbs steeply with T, so Voc falls about 0.3% per kelvin and takes Pmp with it. This is why a cold bright day outperforms a hot one, and why panel Vmp must be checked at the lowest expected temperature when sizing a string against an MPPT input.',
  'photovoltaic.theory1':
    'The single diode model is `I = Iph - I0·(e^((V + I·Rs)/a) - 1) - (V + I·Rs)/Rsh`, where `a = Ns·n·k·T/q` is the modified thermal voltage of the whole series string. It is implicit in I, so the solver iterates rather than evaluating a formula.',
  'photovoltaic.title': 'Photovoltaic Panel',
  'photovoltaic.use':
    'Sizing panels, understanding why an MPPT controller earns its cost, and why a panel rated 100 W rarely delivers it. The temperature coefficient is the practical takeaway: panels lose voltage as they heat, so a string sized on a datasheet at 25 °C can drop below the MPPT input window on a hot roof.',
  'photovoltaic.vmp': 'Vmp',
  'photovoltaic.voc': 'Voc',
  'photovoltaic.vocTempCoeff': 'Voc temp coeff',
  'photovoltaic.warn1':
    'Shunt resistance is too low to support the stated Voc, so the model collapses Voc toward Iph·Rsh. Raise Rsh or lower Voc: a real panel this shunted would be faulty.',
  'photovoltaic.warn2':
    'Below 100 W/m² the single diode model gets optimistic. Real panels lose fill factor faster than this in low light because the shunt path dominates.',
  'photovoltaic.warn3': 'Cell temperature is outside the range this model was fitted over.',
  'pwm-filter.12BitStep': '(12-bit step {ADC_LSB})',
  'pwm-filter.5Tau': '(5·tau = {settle5tau})',
  'pwm-filter.anRcLowPass':
    "An RC low pass has unity gain at DC and the rectangle's average is `D·Vs`, so the settled output is `Vout = D·Vs` no matter what R and C are. R and C only decide how much of the switching gets through.",
  'pwm-filter.attenuationAtFPwm': 'Attenuation at f_pwm',
  'pwm-filter.bitMaxAtThis': '({bits} bit, max {maxBits} at this f)',
  'pwm-filter.blurb': 'Turn PWM into an analogue voltage. Ripple against settling time.',
  'pwm-filter.dutyResolution': 'Duty resolution',
  'pwm-filter.dutyStep': 'Duty step',
  'pwm-filter.esp32GpioIntoAn': 'ESP32 GPIO into an RC low pass',
  'pwm-filter.fPwmFc': 'f_pwm / fc',
  'pwm-filter.lede':
    'An ESP32 GPIO toggling into an RC network, i.e. a one-bit DAC. Horizontal axis is time: the ripple view frames a few switching periods, the startup view frames the full 5 tau charging curve. Hide Vpwm on the scope to see the ripple at its own scale.',
  'pwm-filter.meanOutput': 'Mean output',
  'pwm-filter.ofVout': '({ripplePercent}% of Vout)',
  'pwm-filter.peakPinCurrent': 'Peak pin current',
  'pwm-filter.powerOnCapEmpty': '(power-on, cap empty)',
  'pwm-filter.rippleIsUsuallyQuoted':
    'Ripple is usually quoted as `Vpp ≈ Vs·D·(1-D) / (f·R·C)`, which is the small-ripple limit. This page solves it exactly: with `a = e^(-D·T/tau)` and `b = e^(-(1-D)·T/tau)`, matching charge against discharge over one period gives `Vpp = Vs·(1-a)(1-b) / (1-a·b)`. The two agree to a fraction of a percent once tau is more than about ten switching periods, and the approximation reads high below that. Worst-case ripple is always at 50% duty.',
  'pwm-filter.rippleLimited': '(ripple limited)',
  'pwm-filter.rippleOnTheAdc': 'Ripple on the ADC',
  'pwm-filter.rippleVpp': 'Ripple Vpp',
  'pwm-filter.scopeWindow': 'Scope window',
  'pwm-filter.startup': 'Startup',
  'pwm-filter.tau': '(tau = {tau})',
  'pwm-filter.theTraceIsThe':
    'The trace is the closed-form response, `y(t) = y_ss(t) + (y0 - y_ss(0))·e^(-t/tau)`, i.e. the periodic steady state plus one decaying exponential. That is exact for a linear time-invariant filter, so it cannot go unstable at any time base.',
  'pwm-filter.theTradeoffIsThe':
    'The tradeoff is the whole point: ripple falls as `1/(R·C)` and settling rises as `5·R·C`, so trading one for the other buys nothing. Raising f_pwm is the only free win, up to the point where the LEDC timer runs out of duty resolution, since `2^bits · f` must stay under the 80 MHz APB clock.',
  'pwm-filter.title': 'PWM Low-Pass Filter',
  'pwm-filter.use':
    'Making a cheap analogue output from a microcontroller that has no DAC, which covers most ESP32 use: setting a reference voltage, driving an analogue meter, generating a control voltage for a fan or a valve. The trade-off is always the same, less ripple means slower settling, and this page shows you exactly where the knee is.',
  'pwm-filter.vpwm': 'Vpwm',
  'pwm-filter.warn1':
    'fc sits only {ratio}x below f_pwm. Aim for {FC_RATIO_GOOD}x (40 dB on the switching fundamental); under {FC_RATIO_MIN}x the RC is not smoothing, it is just rounding the edges. Raise f_pwm or raise R·C.',
  'pwm-filter.warn2':
    'The LEDC timer cannot do {bits} bits at {f}. 2^bits · f must stay under the 80 MHz APB clock, so {maxBits} bits is the ceiling here. The driver will reject the config.',
  'pwm-filter.warn3':
    'Peak pin current is {gpioPeakA} at power-on, when the capacitor is still empty. That is past the 12 mA an ESP32 GPIO is rated for. Raise R.',
  'pwm-filter.warn4':
    'One PWM period is shorter than a scope sample at this time base, so the Vpwm trace is omitted rather than drawn aliased. Vout is a closed-form solution, so it stays exact.',
  'rc-filter.blurb': 'First-order RC response in time and frequency, with live scope traces.',
  'rc-filter.cutoffIsWhereThe':
    "Cutoff is where the capacitor's reactance equals the resistance, so `fc = 1 / (2·pi·R·C)` and the output is down 3 dB.",
  'rc-filter.lede':
    'A resistor and a capacitor: the most common filter in electronics. Adjust anything and the scope updates immediately.',
  'rc-filter.magnitudeIsH1':
    'Magnitude is `|H| = 1 / sqrt(1 + (f/fc)²)` for the low pass and `(f/fc) / sqrt(1 + (f/fc)²)` for the high pass. Phase is `-atan(f/fc)` and `90° - atan(f/fc)` respectively.',
  'rc-filter.rcNetwork': 'RC network schematic',
  'rc-filter.reactanceXc': 'Reactance Xc',
  'rc-filter.theScopeTraceIs':
    'The scope trace is not that formula. It is a sample-by-sample simulation using exact zero-order-hold discretisation, `y[n] = x[n] + (y[n-1] - x[n])·e^(-dt/tau)`, which stays stable at any step size and reproduces clipping, ringing and PWM edges that a frequency-domain answer cannot show.',
  'rc-filter.title': 'RC Filter (Low / High Pass)',
  'rc-filter.use':
    'The most common filter in electronics. Smoothing a PWM output into an analogue voltage, removing switching noise from a sensor line, anti-aliasing in front of an ADC, and setting the roll-off in audio tone controls. Get the cutoff wrong and you either pass the noise you meant to remove or slug the signal you meant to keep.',
  'reactive-power.afterCorrection': 'After correction',
  'reactive-power.apparentPowerS': 'Apparent power S',
  'reactive-power.bankReactance': 'Bank reactance',
  'reactive-power.bankVoltageRating': 'Bank voltage rating',
  'reactive-power.blurb':
    'Real, reactive and apparent power, with the capacitor needed to correct PF.',
  'reactive-power.cableLossAfter': 'Cable loss after',
  'reactive-power.cableLossBefore': 'Cable loss before',
  'reactive-power.cableResistance': 'Cable resistance',
  'reactive-power.capacitive': 'Capacitive',
  'reactive-power.correctionAddsAShunt':
    'Correction adds a shunt reactance that supplies Q locally instead of dragging it down the cable: `Qc = P·(tan(phi1) - tan(phi2))`, giving `C = Qc / (2·pi·f·V²)`. The load still draws the same Q, it just comes from a capacitor a metre away rather than a generator miles away.',
  'reactive-power.correctionNeeded': 'Correction needed',
  'reactive-power.currentAfter': 'Current after',
  'reactive-power.currentLags': 'current lags',
  'reactive-power.currentLeads': 'current leads',
  'reactive-power.handedBackEachCycle': 'handed back each cycle',
  'reactive-power.inductive': 'Inductive',
  'reactive-power.lede':
    'Watch current lag voltage and instantaneous power dip negative. That negative dip is energy the load borrows and hands straight back, which the cable has to carry both ways for nothing. Current and power traces are scaled onto the voltage axis; the readouts carry the true values.',
  'reactive-power.lineCurrent': 'Line current',
  'reactive-power.lineVoltage': 'Line voltage',
  'reactive-power.lower': '{currentReduction}% lower',
  'reactive-power.minimum': 'minimum',
  'reactive-power.peakPT': 'Peak p(t)',
  'reactive-power.phaseAngle': 'Phase angle',
  'reactive-power.presentPf': 'Present PF',
  'reactive-power.reactiveEnergyDay': 'Reactive energy / day',
  'reactive-power.reactivePowerQ': 'Reactive power Q',
  'reactive-power.realPower': 'Real power',
  'reactive-power.realPowerP': 'Real power P',
  'reactive-power.reverseFlowPeak': 'Reverse flow peak',
  'reactive-power.saves': 'saves {lossSaved}',
  'reactive-power.shuntCapacitor': 'Shunt capacitor',
  'reactive-power.shuntInductor': 'Shunt inductor',
  'reactive-power.targetPf': 'Target PF',
  'reactive-power.thatIsWhatThe':
    'That is what the negative dip in p(t) on the trace is. Instantaneous power is `P + S·cos(2wt - phi)`, so it swings `P ± S`. Once S exceeds P, which is exactly when the power factor drops below 1, the trough goes below zero and power flows backwards.',
  'reactive-power.theory1':
    "With a sinusoidal supply, `S = Vrms·Irms`, `P = S·cos(phi)` and `Q = S·sin(phi)`. Only P does work. Q is energy shuttled into the load's magnetic field and back out every half cycle, and the cable carries it both ways.",
  'reactive-power.thePayoffIsI':
    'The payoff is I²R. Cable loss falls with the square of current, so dragging power factor from 0.75 to 0.95 cuts current by about 21% and cable loss by about 38%. That is also why utilities bill industrial sites for reactive power: it occupies their conductors without registering on an energy meter.',
  'reactive-power.title': 'Reactive Energy / Power Factor',
  'reactive-power.use':
    'Industrial installations billed for reactive power, motor loads, and understanding why a 3 kW motor needs more than 3 kVA of supply. The cable loss comparison is the practical payoff, since correcting power factor reduces current and the loss falls with its square.',
  'reactive-power.warn1':
    'The target power factor is at or below the present one, so there is nothing to correct. Raise the target above {pf}.',
  'reactive-power.warn2':
    'This load already leads, so correcting it needs a shunt *inductor*, not a capacitor. Capacitive loads at scale are unusual: long lightly loaded cables and large filter banks are the usual causes.',
  'reactive-power.warn3':
    'These are mains potentials. A correction capacitor stays charged after disconnection and must carry bleed resistors, and it must be rated for at least {capVoltageRating} RMS.',
  'rectifier.1NfIsEffectively': '1 nF is effectively no smoothing',
  'rectifier.at': 'at {fRipple}',
  'rectifier.averagePerDiode': 'Average per diode',
  'rectifier.blurb': 'Half and full wave with a smoothing cap. Ripple, PIV and diode dissipation.',
  'rectifier.conduction': '{conductionAngle}° conduction',
  'rectifier.dcOutput': 'DC output',
  'rectifier.diode': 'Diode',
  'rectifier.diodeDissipation': 'Diode dissipation',
  'rectifier.eachDiodes': '{pDiodePer} each, {topology} diodes',
  'rectifier.everyCoulombDeliveredTo':
    'Every coulomb delivered to the load crosses `n` junctions, so conduction loss is `n·Vf·Idc` shared over the diodes in the circuit. The current is not shared evenly in time: the diodes only conduct near the peaks, so the peak current is many times `Idc`, which is why the conduction angle and crest factor are on the readout. Source resistance is what limits that spike, and a real transformer has some.',
  'rectifier.io': '{id} IO {io}',
  'rectifier.lede':
    'Half wave, full wave bridge or centre tapped, into a reservoir cap and a resistive load. The scope shows the secondary, the smoothed output and what the same rectifier gives with the cap removed.',
  'rectifier.noCap': 'No cap',
  'rectifier.peakDiodeCurrent': 'Peak diode current',
  'rectifier.peakInverseVoltageIs':
    'Peak inverse voltage is what actually kills diodes. A bridge diode blocks one `Vpeak`. A half wave or centre tapped diode has the negative peak on its anode while the cap holds its cathode at `Vdc`, so it blocks `Vpeak + Vdc`, i.e. about `2·Vpeak`. A 12 V secondary is already 34 V of PIV.',
  'rectifier.pivPerDiode': 'PIV per diode',
  'rectifier.ppFormula': 'pp, formula {vripple}',
  'rectifier.rectifier': 'Rectifier schematic',
  'rectifier.rectifier2': 'Rectifier',
  'rectifier.reservoirCap': 'Reservoir cap',
  'rectifier.rippleFactor': 'Ripple factor',
  'rectifier.rmsPeak': 'rms, {vPeakIn} peak',
  'rectifier.rmsPerDiode': 'RMS per diode',
  'rectifier.secondary': 'Secondary',
  'rectifier.sourceResistance': 'Source resistance',
  'rectifier.textbook': 'textbook {vdc}',
  'rectifier.theCapChargesTo':
    'The cap charges to the peak through the diodes, then supplies the load alone until the next peak. Treating that discharge as linear gives `Vr = Idc / (fr·C)`, where `fr` is the line frequency for a half wave rectifier and `2f` for a bridge or a centre tap, since both fill in the gap the half wave leaves. The output sits at the middle of that sawtooth, `Vdc = Vpeak - n·Vf - Vr/2`, with `n` = 2 for a bridge and 1 for the other two.',
  'rectifier.theTraceIsNot':
    'The trace is not the formula. It is a sample-by-sample solve that switches between two sub-circuits, conducting (source behind Rs into C parallel RL) and off (C discharging into RL), each integrated with exact zero-order-hold discretisation `v[n] = vInf + (v[n-1] - vInf)·e^(-dt/tau)`. That stays stable at any step size. It also explains why the measured ripple comes in under the formula: the cap only discharges for the part of the period the diodes are off, and it does so exponentially, not linearly.',
  'rectifier.title': 'Diode Rectifier',
  'rectifier.use':
    'Any mains or transformer-derived supply, and the front end of most non-USB power adapters. It tells you the ripple your smoothing capacitor leaves, which sets whether the regulator after it stays out of dropout, and the peak inverse voltage the diodes must survive.',
  'rectifier.vrrm': '{id} VRRM {vrrm}',
  'rectifier.vsec': 'Vsec',
  'rectifier.warn1':
    'Peak secondary is {vPeakIn}, below the {vf} of diode drop. Nothing ever conducts.',
  'rectifier.warn2': 'PIV {piv} exceeds the {id} VRRM of {vrrm}. The diode breaks down in reverse.',
  'rectifier.warn3': '{iAvgPerDiode} average per diode is over the {id} IO rating of {io}.',
  'rectifier.warn4':
    'Peak charging current {iPeak} is past the {id} IFSM of {isurge}. Add series resistance or a soft start.',
  'rectifier.warn5':
    'Half wave pulls DC through the secondary, which walks the transformer core toward saturation. Fine for a few milliamps, not for a supply.',
  'rectifier.warn6':
    'Ripple is {rippleFactor}% of the output. The Vdc = Vpeak - Vr/2 approximation only holds for small ripple, so trust the measured trace over the textbook column.',
  'rectifier.windingPlusDiodeBulk': 'Winding plus diode bulk. Sets the peak charging current.',
  'rectifier.xIdc': '{crestFactor}x Idc',
  'resistive-heating.5Tau': '5 tau',
  'resistive-heating.alloy': 'Alloy',
  'resistive-heating.at20C': 'at 20 °C',
  'resistive-heating.atEquilibrium': 'at equilibrium',
  'resistive-heating.atServiceTemp': 'at service temp',
  'resistive-heating.awg': 'AWG',
  'resistive-heating.belowEquilibrium': '(below equilibrium)',
  'resistive-heating.blurb':
    'Nichrome and pyrography tips: wire sizing, power, and time to temperature.',
  'resistive-heating.convectionH': 'Convection h',
  'resistive-heating.currentLimit': 'Current limit',
  'resistive-heating.driveAndEnvironment': 'Drive and environment',
  'resistive-heating.element': 'Element',
  'resistive-heating.elementMakersSizeOn':
    'Element makers size on surface load, watts per square metre of wire surface, not on total power. Two elements of the same wattage behave very differently if one packs it into half the surface.',
  'resistive-heating.energyToTarget': 'Energy to target',
  'resistive-heating.equilibriumTemp': 'Equilibrium temp',
  'resistive-heating.holdDuty': 'Hold duty',
  'resistive-heating.inrushCurrent': 'Inrush current',
  'resistive-heating.lede':
    'Nichrome and Kanthal elements: pyrography tips, foam cutters, small furnaces. The scope shows wire temperature in °C and dissipated power in W against time, settling at equilibrium rather than climbing forever.',
  'resistive-heating.length': 'Length',
  'resistive-heating.limitC': 'limit {maxTemp} °C',
  'resistive-heating.over100': 'over 100%',
  'resistive-heating.powerCold': 'Power cold',
  'resistive-heating.powerSettled': 'Power settled',
  'resistive-heating.radiatedShare': 'Radiated share',
  'resistive-heating.resistanceCold': 'Resistance cold',
  'resistive-heating.resistanceDriftsWithTemperature':
    'Resistance drifts with temperature too, so the settled power is not the switch-on power. This is why the simulation freezes the power over each step and applies the exact solution: the feedback is negative for every real element alloy, hotter means more resistance means less power, so it converges rather than running away.',
  'resistive-heating.resistanceHot': 'Resistance hot',
  'resistive-heating.restIsConvection': 'rest is convection',
  'resistive-heating.settledCurrent': 'Settled current',
  'resistive-heating.settlingTime': 'Settling time',
  'resistive-heating.sizeBy': 'Size by',
  'resistive-heating.surfaceLoad': 'Surface load',
  'resistive-heating.targetTemperature': 'Target temperature',
  'resistive-heating.temperatureIsNotThat':
    'Temperature is not that formula. The wire obeys a balance: `m·c·dT/dt = P - h·As·(T - Tamb)`. The loss term grows with temperature, so the wire settles at `Tamb + P/(h·As)` rather than climbing forever. That equilibrium is what the trace converges to, and the time constant `m·c/(h·As)` is independent of length: a longer wire has proportionally more mass and more surface.',
  'resistive-heating.theory1':
    'Resistance is `R = rho·L/A`, so power at a fixed supply is `P = V²/R`. Halving the length halves the resistance and doubles the power, which is the usual way people accidentally burn out a pen tip.',
  'resistive-heating.thermalTau': 'Thermal tau',
  'resistive-heating.timeToTarget': 'Time to target',
  'resistive-heating.title': 'Resistive Heating',
  'resistive-heating.use':
    'Pyrography pens, hot wire foam cutters, 3D printer hot ends and nozzles, small kilns, and soldering equipment. The key output is the equilibrium temperature: element wire settles where dissipation equals cooling, so the same wire and voltage behave completely differently in still air, in a draught, or buried in insulation.',
  'resistive-heating.warn1':
    'Equilibrium is above the {maxTemp} °C continuous rating for {label}. The element will oxidise fast and fail early. Use thicker wire, a longer run, or less voltage.',
  'resistive-heating.warn2':
    'The target sits above the equilibrium temperature, so the wire never reaches it no matter how long it runs. Raise the supply or reduce the cooling.',
  'resistive-heating.warn3':
    'Copper is here for contrast, not for building elements. Its temperature coefficient is roughly 80x that of nichrome, so its resistance and therefore its power swing wildly as it heats, and it oxidises away quickly at element temperatures.',
  'resistive-heating.wireMass': 'Wire mass',
  'resistor-code.4Band': '4 band',
  'resistor-code.5Band': '5 band',
  'resistor-code.bands': 'Bands',
  'resistor-code.blurb': 'Four and five band colours plus 3-digit, 4-digit and EIA-96 SMD codes.',
  'resistor-code.brown1': 'brown, 1%',
  'resistor-code.colourBands': 'Colour bands',
  'resistor-code.eia96IsThe':
    'EIA-96 is the compact scheme for tiny 1% parts: two digits index into the 96 values of the E96 series, and a letter gives the multiplier. So 68C is the 68th E96 value, 499, times 100, i.e. 49.9 kΩ. It is dense but requires the table.',
  'resistor-code.gold5': 'gold, 5%',
  'resistor-code.lede':
    'Colour bands and SMD codes both encode the same thing: a mantissa and a power of ten. Enter a value and read it back in every notation.',
  'resistor-code.matchingSeries': 'Matching series',
  'resistor-code.range': 'Range',
  'resistor-code.red2': 'red, 2%',
  'resistor-code.silver10': 'silver, 10%',
  'resistor-code.smd3Digit': 'SMD 3 digit',
  'resistor-code.smd4Digit': 'SMD 4 digit',
  'resistor-code.smdCodesWorkThe':
    'SMD codes work the same way. Three digits is two figures plus an exponent, so 472 is 47 × 10², i.e. 4.7 kΩ. Four digits is three figures plus an exponent, so 4701 is 470 × 10¹, also 4.7 kΩ. Note the last digit is never a zero of the value itself, which catches people out constantly.',
  'resistor-code.theory1':
    'Every marking scheme encodes a mantissa and a multiplier. Four bands give two significant figures and are used for 5% and 10% parts drawn from E24 and E12. Five bands give three figures for 1% and 2% parts from E96 and E48. The extra digit exists because a tighter tolerance needs a finer grid of values to be worth anything.',
  'resistor-code.title': 'Resistor Colour / SMD Code',
  'resistor-code.tolerance': 'Tolerance',
  'resistor-code.toleranceAndSeriesAlways':
    'Tolerance and series always match, and that is not a coincidence. The gaps in each series are sized so neighbouring values just touch at their tolerance limits: E24 has about 5% gaps and E96 about 1%. Buying a 1% part on an E12 nominal is pointless, since a nearer E96 value exists for whatever you actually wanted.',
  'resistor-code.toleranceBand': 'Tolerance band',
  'resistor-code.use':
    'Reading the part you just pulled out of the drawer, or marking one in a BOM. It covers colour bands and all three SMD schemes, including EIA-96 which is unreadable without the table, and shows why tolerance and the E-series always go together.',
  'resistor-code.value': 'Value',
  'resistor-code.warn1':
    'This value is not a member of the E96 series, so it has no EIA-96 code. EIA-96 marking only exists for 1% parts, which are drawn from E96 by definition. A 4.7 kΩ 5% part is an E24 value and would be marked 472 or 4701 instead.',
  'resistor-code.warn2':
    'Values under 10 Ω use the R notation on SMD parts, where R marks the decimal point: 4R7 is 4.7 Ω, R22 is 0.22 Ω. The plain digit codes cannot express a fraction.',
  'rl-filter.anInductorOpposesA':
    'An inductor opposes a change in current the way a capacitor opposes a change in voltage, so the whole RC page maps across: `tau = L / R` instead of `R·C`, and `fc = R / (2·pi·L)` instead of `1 / (2·pi·R·C)`. Reactance runs the other way, `XL = 2·pi·f·L` rises with frequency while `Xc` falls, which is why the output across the resistor is the low pass here and the high pass there.',
  'rl-filter.blurb': 'Inductive first-order filter, the dual of the RC case.',
  'rl-filter.coilDcrSlideTo': 'Coil DCR. Slide to the bottom for the ideal case.',
  'rl-filter.datasheetIsatPastThis': 'Datasheet Isat. Past this the core gives up and L collapses.',
  'rl-filter.db': '-∞ dB',
  'rl-filter.dcFeedthroughDcr': 'DC feedthrough (DCR)',
  'rl-filter.isat': '(Isat {isat})',
  'rl-filter.lede':
    'The dual of the RC filter: swap the capacitor for an inductor and the corner moves to R/L. Winding resistance is part of the model, because it is what stops real RL filters behaving like the textbook.',
  'rl-filter.magnitudeIsHR':
    'Magnitude is `|H| = R / |Z|` for the low pass and `sqrt(Rw² + XL²) / |Z|` for the high pass, with `|Z| = sqrt((R + Rw)² + XL²)`. With a lossless winding those collapse to the familiar `1 / sqrt(1 + (f/fc)²)` and `(f/fc) / sqrt(1 + (f/fc)²)`, and phase to `-atan(f/fc)` and `90° - atan(f/fc)`.',
  'rl-filter.passbandLossDcr': 'Passband loss (DCR)',
  'rl-filter.rlNetwork': 'RL network schematic',
  'rl-filter.rTotal': '(R total {rTotal})',
  'rl-filter.theScopeTraceIs':
    'The scope trace is not the transfer function. The solver integrates the loop current, `L·di/dt = v - i·(R + Rw)`, with exact zero-order-hold discretisation, `i[n] = i∞ + (i[n-1] - i∞)·e^(-dt/tau)`. That is stable at any step size, and the two element voltages come straight out of KVL, so `V(R) + V(L)` equals Vin sample for sample.',
  'rl-filter.title': 'RL Filter',
  'rl-filter.use':
    'Less common than RC because inductors are bulky and expensive, but unavoidable where current rather than voltage must be smoothed: motor drive filters, switch-mode converter output stages, and EMI chokes on supply leads. Also the natural model for any winding you did not intend to be a filter, such as a long cable pair or a relay coil.',
  'rl-filter.warn1':
    'Peak coil current {ipk} is past the {isat} saturation rating. A saturated core loses inductance, so the real corner climbs and this trace is no longer valid. Raise R, pick a bigger core, or cut the drive.',
  'rl-filter.warn2':
    'Peak current {ipk} exceeds the {GPIO_MAX_MA} mA an ESP32 pin can source. Drive this network from a buffer or a MOSFET, not straight off a GPIO.',
  'rl-filter.windingResistance': 'Winding resistance',
  'rl-filter.windingResistanceIsIn':
    'Winding resistance is in series with everything, so it never drops out. It raises the corner (fc uses R + Rw), costs the low pass some passband, and leaves the high pass a DC feedthrough floor of `Rw / (R + Rw)`. That, plus core saturation and self-resonance, is why filters at signal level are built from capacitors and inductors are kept for power work.',
  'rlc-resonance.blurb': 'Series and parallel resonance, damping and step ringing.',
  'rlc-resonance.checkIsat': '(check Isat)',
  'rlc-resonance.dampingAlpha': 'Damping alpha',
  'rlc-resonance.dampingZeta': 'Damping zeta',
  'rlc-resonance.drive': '(drive {drive})',
  'rlc-resonance.fromThereBwF0':
    'From there, `BW = f0 / Q`, `zeta = 1 / (2Q) = alpha / w0` and the ring frequency is `wd = w0·sqrt(1 - zeta²)`. zeta below 1 rings, zeta at 1 is critical damping (fastest settle with no overshoot), zeta above 1 crawls in without ringing. First peak overshoot is `exp(-pi·zeta / sqrt(1 - zeta²))`, which is 100% at zeta = 0 and why a lossless step doubles the supply.',
  'rlc-resonance.halfPowerBand': 'Half power band',
  'rlc-resonance.idealLAndC': '(ideal L and C, see below)',
  'rlc-resonance.impedanceZ0': 'Impedance Z0',
  'rlc-resonance.lede':
    'Step response of an RLC network. The horizontal axis is time, the trace is the capacitor voltage (series) or the tank node voltage (parallel). Drop R to watch it ring, raise it to damp it out.',
  'rlc-resonance.overshoot': 'Overshoot',
  'rlc-resonance.parallelHereIsDriven':
    'Parallel here is driven Thevenin style, i.e. the source feeds R in series into the L-C node. That is the same circuit as a current step `Vin/R` into R || L || C, so the parallel Q applies. Its output decays to zero because the inductor is a short at DC.',
  'rlc-resonance.peakVout': 'Peak Vout',
  'rlc-resonance.rForCritical': 'R for critical',
  'rlc-resonance.ringFrequencyFd': 'Ring frequency fd',
  'rlc-resonance.rlcNetwork': 'RLC network schematic',
  'rlc-resonance.rSetsHowFast':
    'R sets how fast the stored energy leaks away. Series: `Q = (1/R)·sqrt(L/C)` and `alpha = R / (2L)`. Parallel: `Q = R·sqrt(C/L)` and `alpha = 1 / (2·R·C)`. The two are reciprocal about the characteristic impedance `Z0 = sqrt(L/C)`, so series wants R small for a high Q and parallel wants R large.',
  'rlc-resonance.sqrtLC': '(sqrt(L/C))',
  'rlc-resonance.theory1':
    'Resonance is where the two reactances cancel, `Xl = Xc`, giving `f0 = 1 / (2·pi·sqrt(L·C))`. It does not depend on R.',
  'rlc-resonance.theTraceIsA':
    'The trace is a two-state simulation of `[Vc, Il]` using exact zero-order-hold discretisation, `x[n+1] = xss + e^(A·dt)·(x[n] - xss)`. The matrix exponential is closed form, so the solver is exact for a piecewise constant drive and stable at any step size. Forward Euler on a resonant second-order system diverges as soon as `dt &gt; 2/w0`.',
  'rlc-resonance.title': 'RLC Resonance',
  'rlc-resonance.use':
    'Tuned circuits in radio front ends, crystal and LC oscillators, and EMI filters. Just as often it is unintentional: any inductance with stray capacitance rings, which is why switching nodes overshoot and why a long supply lead into a decoupling capacitor can oscillate. Knowing f0 and Q tells you whether it will ring once or for a hundred cycles.',
  'rlc-resonance.warn1':
    'The capacitor reaches {peakVout} on a {drive} drive. An undamped series RLC tops out near 2x the supply, so rate the capacitor and the switching device for the peak, not the rail. Add series R or a snubber.',
  'rlc-resonance.warn2':
    "Q above {HIGH_Q_LIMIT} assumes a lossless L and C. A real inductor's winding resistance and core loss, plus the capacitor ESR, both sit in the loop and will hold the measured Q well below this. Add the coil DCR into R for a realistic answer.",
  'rlc-resonance.warn3':
    'The scope window holds {perRing} samples per ring cycle, so the drawn trace is aliased. The numbers above are still exact, they come from closed form, not the trace. Shorten the window or raise the source frequency to see the real ring.',
  'servo-pwm.actualAngle': 'Actual angle',
  'servo-pwm.actualPulse': 'Actual pulse',
  'servo-pwm.angle': 'Angle',
  'servo-pwm.angularResolution': 'Angular resolution',
  'servo-pwm.asked': 'asked {angle}°',
  'servo-pwm.at50HzThe':
    "At 50 Hz the LEDC timer allows up to 20 bits, so there is no reason to be stingy: use 16 bits and you get thousands of counts over the travel, well past what the servo's own potentiometer and gearbox can resolve.",
  'servo-pwm.blurb': 'Angle to pulse width to duty ticks at a chosen timer resolution.',
  'servo-pwm.countsOverTravel': 'Counts over travel',
  'servo-pwm.frameRate': 'Frame rate',
  'servo-pwm.framesShown': 'Frames shown',
  'servo-pwm.ledcTimer': 'LEDC timer',
  'servo-pwm.lede':
    'A hobby servo reads the width of a pulse, not its duty, and ignores the rest of the 20 ms frame. That makes duty resolution the limiting factor: only 5 to 10% of the register range does anything at all. The scope shows the signal pin over a couple of frames.',
  'servo-pwm.maxResolutionAtFrame': 'Max resolution at frame rate',
  'servo-pwm.ofTheFrame': 'of the frame',
  'servo-pwm.ofTotal': 'of {bits} total',
  'servo-pwm.oneWiringNoteThe':
    "One wiring note: the signal pin is happy at 3.3 V because servos read it as logic, but the motor itself wants 5 V or more and draws amps when stalled. Never power a servo from the ESP32 board's regulator, and keep the grounds common.",
  'servo-pwm.pulseRange': 'Pulse range',
  'servo-pwm.servo': 'Servo',
  'servo-pwm.signal': 'signal',
  'servo-pwm.step': '{degreesPerStep}°/step',
  'servo-pwm.thatIsWhatMakes':
    'That is what makes resolution awkward. The whole useful range is {minPulse2} out of a 20 ms frame, so only about {frameHz}% of the duty register does anything. At 8 bits that leaves roughly 13 counts for the entire travel, about 14° per step, which is why naive Arduino code with a low LEDC resolution produces jerky servos.',
  'servo-pwm.theory1':
    'Servo position is encoded purely in pulse width: {minPulse} at one end of travel, {maxPulse} at the other, repeated every 20 ms. The gap between pulses carries no information, it just refreshes the command.',
  'servo-pwm.title': 'Servo PWM',
  'servo-pwm.use':
    'Robot arms, pan and tilt mounts, RC conversions, and anything with a hobby servo. It matters because servos read pulse width rather than duty, so only a small slice of the timer range is useful, and a low LEDC resolution leaves too few steps across the travel to move smoothly.',
  'servo-pwm.warn1':
    '{degreesPerStep}° per step is coarser than the servo itself can resolve, so the controller is the limit, not the machine. Raise the LEDC resolution: at 50 Hz you can use up to {maxBits} bits at no cost.',
  'servo-pwm.warn2':
    'Above about 60 Hz you are outside what an analogue servo expects. Many digital servos accept 200 to 333 Hz and respond faster, but an analogue one may buzz, overheat or simply ignore the extra frames. Check the specification before pushing the frame rate.',
  'solar-sizing.autonomy': 'Autonomy',
  'solar-sizing.batteryNeeded': 'Battery needed',
  'solar-sizing.batterySizingIsThe':
    'Battery sizing is the opposite question: not the average day but the worst run of bad ones. `Cbat = Wh_day · days / DoD`. Depth of discharge matters enormously for cycle life: taking a lithium cell to 50% rather than 90% can multiply its usable cycles several times over, so the bigger battery often outlives the saving.',
  'solar-sizing.blurb': 'Panel and battery pick from a daily load profile, with autonomy days.',
  'solar-sizing.dailyConsumption': 'Daily consumption',
  'solar-sizing.dailySurplus': 'Daily surplus',
  'solar-sizing.daysAtDod': '{autonomyDays} days at {dod}% DoD',
  'solar-sizing.daysToRefill': 'Days to refill',
  'solar-sizing.depthOfDischarge': 'Depth of discharge',
  'solar-sizing.harvestPerDay': 'Harvest per day',
  'solar-sizing.lede':
    'Size a panel and battery for a solar powered node. The load comes from the same duty-cycle arithmetic as the deep sleep page, then the panel has to replace it on an average day and the battery has to carry the node through the bad ones.',
  'solar-sizing.loadProfile': 'Load profile',
  'solar-sizing.ofFullSunPer': 'of full sun per day used',
  'solar-sizing.panelFitted': 'Panel fitted',
  'solar-sizing.panelNeeded': 'Panel needed',
  'solar-sizing.panelRating': 'Panel rating',
  'solar-sizing.peakSunHours': 'Peak sun hours',
  'solar-sizing.rechargeTime': 'Recharge time',
  'solar-sizing.siteAndSystem': 'Site and system',
  'solar-sizing.systemEfficiency': 'System efficiency',
  'solar-sizing.theEfficiencyTermIs':
    'The efficiency term is not the cell efficiency, which is already in the watt rating. It covers the charge controller, wiring, temperature derating (panels lose about 0.4% per kelvin above 25 °C), dust and imperfect angle. Seventy percent is a reasonable planning figure for a small fixed installation.',
  'solar-sizing.theFailureModeWorth':
    'The failure mode worth avoiding is a system that breaks even on paper. It has no margin to refill the battery after a cloudy week, so it drifts down to empty and stays there. Oversizing the panel is much cheaper than oversizing the battery.',
  'solar-sizing.theory1':
    "Peak sun hours folds a whole day's irradiance curve into an equivalent number of hours at the panel's full 1000 W/m² rating. So daily harvest is simply `W · PSH · efficiency`, and the panel you need is `Wh_day / (PSH · efficiency)`.",
  'solar-sizing.title': 'Solar + Battery Sizing',
  'solar-sizing.toBreakEven': 'to break even',
  'solar-sizing.use':
    'Off-grid sensor nodes, weather stations and remote monitors. The failure mode it prevents is the system that breaks even on paper: it works all summer, then a cloudy week drains the battery and it never recovers, because the panel has no surplus to refill with.',
  'solar-sizing.warn1':
    'The panel harvests {harvestWh} Wh against a {whPerDay} Wh load, so the battery only ever drains and the node dies once it is empty. You need at least {panelW} W just to break even, and realistically two to three times that so it can also recover from cloudy spells.',
  'solar-sizing.warn2':
    'The surplus is positive but thin: refilling an empty battery takes {daysToRecharge} days, longer than the {autonomyDays} days of autonomy it provides. After one bad week the node may never catch up. Oversize the panel rather than the battery.',
  'solar-sizing.warn3':
    'Over 4 peak sun hours is a summer or low-latitude figure. Size on the worst month you expect to operate in, not the average: in northern Europe December can be under one peak sun hour, a factor of five below midsummer.',
  'thermal-design.125CForMost': '125 °C for most silicon, 150 to 175 °C for power MOSFETs.',
  'thermal-design.63OfTheRise': '(63% of the rise)',
  'thermal-design.aimForK': '(aim for {MARGIN_TARGET_K} K)',
  'thermal-design.aKelvinAndA':
    'A kelvin and a degree Celsius are the same size, so every resistance, rise and margin on this page is identical in either scale. Only the absolute temperatures differ.',
  'thermal-design.aLinearRegulatorThrows':
    'A linear regulator throws the whole voltage difference away as heat: `P = (Vin - Vout)·Iout + Vin·Iq`. Dropping 5 V to 3.3 V at 500 mA burns 0.85 W, which is why a bare SOT-223 AMS1117 runs hot on an ESP32 board and a switching regulator does not.',
  'thermal-design.atCAmbient': '(at {ambientC} °C ambient)',
  'thermal-design.blurb': 'Junction temperature from dissipation and the thermal resistance chain.',
  'thermal-design.budgetUsed': 'Budget used',
  'thermal-design.caseTc': 'Case Tc',
  'thermal-design.directWatts': 'Direct watts',
  'thermal-design.dpakOn1Sq': 'DPAK on 1 sq inch copper',
  'thermal-design.efficient': '({efficiency}% efficient)',
  'thermal-design.esp32PeaksNear500': 'ESP32 peaks near 500 mA on a WiFi transmit burst.',
  'thermal-design.grease02Pad':
    'Grease 0.2, pad 0.5, dry contact 1.0 on a TO-220. Use 0.01 for a soldered tab.',
  'thermal-design.input': 'Input',
  'thermal-design.insideASealedEnclosure':
    'Inside a sealed enclosure, 20 K above the room is normal.',
  'thermal-design.junctionTj': 'Junction Tj',
  'thermal-design.kOverAmbient': '({rise} K over ambient)',
  'thermal-design.lede':
    'Junction temperature through the Rjc, Rcs, Rsa chain. The scope shows the warm-up from a cold start, so the horizontal axis is time in seconds, not a waveform: the die steps up instantly and then rides the heatsink as it soaks.',
  'thermal-design.limits': 'Limits',
  'thermal-design.linearRegulator': 'Linear regulator',
  'thermal-design.loadTypicalPackage': 'Load typical package',
  'thermal-design.marginToTjMax': 'Margin to Tj max',
  'thermal-design.massTimesSpecificHeat':
    'Mass times specific heat. Aluminium is 897 J/(kg·K), so 20 g is 18 J/K.',
  'thermal-design.noneExists': 'none exists',
  'thermal-design.ofTheAmbientTo': '(of the ambient to Tj max span)',
  'thermal-design.powerCeiling': 'Power ceiling',
  'thermal-design.rcsInterface': 'Rcs interface',
  'thermal-design.regulator': 'Regulator',
  'thermal-design.rjcJunctionToCase': 'Rjc junction to case',
  'thermal-design.rsaRequired': 'Rsa required',
  'thermal-design.rsaSinkToAir': 'Rsa sink to air',
  'thermal-design.rthJunctionToAir': 'Rth junction to air',
  'thermal-design.safeToTouch': '(safe to touch)',
  'thermal-design.sinkHeatCapacity': 'Sink heat capacity',
  'thermal-design.sinkTimeConstant': 'Sink time constant',
  'thermal-design.sinkTs': 'Sink Ts',
  'thermal-design.sot223Ams1117On': 'SOT-223 (AMS1117) on copper pour',
  'thermal-design.sot23SmallSignal': 'SOT-23 small signal, free air',
  'thermal-design.tcase': 'Tcase',
  'thermal-design.theory1':
    'Heat flow is the electrical analogy: power is current, temperature rise is voltage, thermal resistance in K/W is resistance. The three legs sit in series, so `Tj = Ta + P·(Rjc + Rcs + Rsa)`. Rjc comes from the package, Rcs from the mounting interface, Rsa from the heatsink and the air moving over it.',
  'thermal-design.theTraceIsA':
    'The trace is a transient, not a waveform. The sink carries essentially all the heat capacity, so it is the single pole: `tau = Rsa·Cth` and `Ts(t) = Ts(∞) + (Ta - Ts(∞))·e^(-t/tau)`, integrated with the same exact zero-order-hold step the RC page uses so it stays stable at any dt. The die and the interface hold almost no heat next to a lump of aluminium, so on this time base the junction just sits `P·(Rjc + Rcs)` above the sink, which is why it jumps at t = 0 and then crawls. Real sinks are multi-pole, so treat the early part of the curve as indicative and the endpoint as the answer.',
  'thermal-design.title': 'Heatsink / Thermal',
  'thermal-design.tj': 'Tj',
  'thermal-design.to220BareFree': 'TO-220 bare, free air',
  'thermal-design.to220BoltedTo': 'TO-220 bolted to a small sink',
  'thermal-design.to247OnA': 'TO-247 on a large sink',
  'thermal-design.toSitOnC': '(to sit on {tjMaxC} °C)',
  'thermal-design.tsink': 'Tsink',
  'thermal-design.turnItRoundTo':
    'Turn it round to size the sink: `Rsa_required = (Tjmax - Ta)/P - Rjc - Rcs`. If that is zero or negative the package and the interface have already used the whole budget, and no heatsink helps. The matching power ceiling is `Pmax = (Tjmax - Ta)/Rth(j-a)`.',
  'thermal-design.use':
    'Any part that dissipates real power: regulators, MOSFETs, motor drivers, LED arrays. It answers the only question that matters, whether the junction stays under its limit at the worst-case ambient, and works backwards to the heatsink you need if it does not.',
  'thermal-design.warn1':
    '{tj} junction against a {tjMaxC} °C limit, and Rjc + Rcs alone already spend the whole budget at {power}. No heatsink can fix this: cut the dissipation below {maxPower}, improve the mounting, or move to a package with a lower Rjc.',
  'thermal-design.warn2':
    '{tj} junction against a {tjMaxC} °C limit. Needs a sink of {requiredRsa} or better just to reach the limit, so target roughly {e} for {MARGIN_TARGET_K} K of margin, or drop the power below {maxPower}.',
  'thermal-design.warn3':
    'Only {margin} K of margin. Tj max is an absolute maximum, not an operating point: leave {MARGIN_TARGET_K} K or more for part spread, a hot enclosure and a blocked airflow path.',
  'thermal-design.warn4':
    'Output is above the input, so this regulator is in dropout and the model does not apply. A linear regulator can only step down.',
  'thermal-design.whereTheHeatComes': 'Where the heat comes from',
  'thermal-design.willBurnOnContact': '(will burn on contact)',
  'timer-555.always50WithoutA': '(always >50% without a diode)',
  'timer-555.astable': 'Astable',
  'timer-555.blurb': 'Astable and monostable timing, duty cycle and the resulting waveform.',
  'timer-555.bothTripPointsScale':
    'Both trip points scale with Vcc, which is why the timing is supply independent to first order. The trace is simulated with the same exact zero-order-hold relaxation used elsewhere in this app, not drawn from the formula, so the power-on first cycle really does run ln3 long instead of ln2.',
  'timer-555.dischargeCurrent': 'Discharge current',
  'timer-555.dischargePinIsAsked':
    'Discharge pin is asked to sink {peak}, over its {rating} rating. Raise R1.',
  'timer-555.dischargePinIsOver': 'Discharge pin is over its sink rating. Raise R.',
  'timer-555.frequencyIs144':
    'Frequency is `1.44 / ((R1 + 2·R2)·C)`. The 0.693 is ln2, from the capacitor crossing between the 1/3 and 2/3 Vcc comparator trip points, which is a factor of two in the remaining distance to the rail.',
  'timer-555.lede':
    'The 555 in its two classic configurations. The scope shows the output pin against the capacitor voltage, so you can watch it ramp between the 1/3 and 2/3 Vcc trip points.',
  'timer-555.maxRetriggerRate': 'Max retrigger rate',
  'timer-555.monostable': 'Monostable',
  'timer-555.monostableTimingIs1':
    'Monostable timing is `1.1·R·C`, where 1.1 is ln3: the capacitor starts at 0 V rather than 1/3 Vcc, so it covers more of the exponential.',
  'timer-555.pastThePracticalCeiling':
    'Past the practical ceiling of about {ceiling} for this variant. Propagation delay starts to dominate the RC timing.',
  'timer-555.pin7PeakSink': 'Pin 7 peak sink',
  'timer-555.recoveryTime': 'Recovery time',
  'timer-555.startFromPowerOn': 'Start from power on',
  'timer-555.theory1':
    'The capacitor charges through R1+R2 toward Vcc and discharges through R2 alone, so the high time `0.693·(R1+R2)·C` is always longer than the low time `0.693·R2·C`. That is why a plain astable can never reach 50% duty: you need a diode across R2 to let it charge through R1 only.',
  'timer-555.threshold23Vcc': 'Threshold 2/3 Vcc',
  'timer-555.timeHigh': 'Time high',
  'timer-555.timeLow': 'Time low',
  'timer-555.timingNetwork': 'Timing network',
  'timer-555.timingResistanceIsHigh':
    'Timing resistance is high enough that threshold bias current shifts the result. Use larger C and smaller R.',
  'timer-555.timingResistanceIsHigh2':
    'Timing resistance is high enough that threshold bias current shifts the result.',
  'timer-555.title': '555 Timer',
  'timer-555.trig': 'Trig',
  'timer-555.trigger13Vcc': 'Trigger 1/3 Vcc',
  'timer-555.use':
    'Blinking lights, tone generation, PWM without a microcontroller, one-shot pulses, and reset supervision. Still worth knowing because it is often the cheapest and most reliable way to get a timed pulse without firmware, and because the astable duty limit explains a lot of confusing circuits.',
  'timer-555.variant': 'Variant',
  'timer-555.vcap': 'Vcap',
  'timer-555.vcc': 'Vcc',
  'timer-555.wantsToV': '{part} wants {min} to {max} V.',
  'timer-555.wantsToVAt': '{part} wants {min} to {max} V. At {vcc} the timing is not trustworthy.',
  'trace-width.allowedTempRise': 'Allowed temp rise',
  'trace-width.blurb': 'IPC-2221 width for a current and temperature rise, internal or external.',
  'trace-width.boardTemp': 'Board temp',
  'trace-width.copperThickness': 'Copper thickness',
  'trace-width.copperWeight': 'Copper weight',
  'trace-width.external': 'External',
  'trace-width.internal': 'Internal',
  'trace-width.layer': 'Layer',
  'trace-width.lede':
    "IPC-2221 trace sizing. Note this is a thermal limit, not a damage limit: the width is whatever keeps the copper's temperature rise under the figure you allow. Check the voltage drop separately, it often matters more.",
  'trace-width.mil': '{widthMils} mil',
  'trace-width.oz': '{ozCopper} oz',
  'trace-width.powerDissipated': 'Power dissipated',
  'trace-width.requiredWidth': 'Required width',
  'trace-width.requirement': 'Requirement',
  'trace-width.stackupAndGeometry': 'Stackup and geometry',
  'trace-width.theExponentOnCurrent':
    'The exponent on current, 1/0.725 ≈ 1.38, means width grows faster than current. Doubling the current needs about 2.6 times the copper, not twice. This is why high-current nets get out of hand quickly and end up as pours rather than traces.',
  'trace-width.theory1':
    'IPC-2221 is a curve fit to measured data, not a derivation: `I = k · dT^0.44 · A^0.725` with A in square mils. Inverted, the cross-section you need is `A = (I / (k·dT^0.44))^(1/0.725)`. The constant k is 0.048 for external traces and 0.024 for internal ones, because an inner layer is buried in laminate and can only shed heat sideways.',
  'trace-width.title': 'PCB Trace Width',
  'trace-width.traceLength': 'Trace length',
  'trace-width.traceResistance': 'Trace resistance',
  'trace-width.twoThingsThisDoes':
    "Two things this does not tell you. It is a steady-state thermal limit, so a brief surge can far exceed it safely. And it says nothing about voltage drop, which for long thin traces in low-voltage rails is usually the binding constraint: a trace can be thermally fine while dropping enough to upset a 3.3 V regulator's feedback.",
  'trace-width.use':
    'Laying out any board that carries more than a few hundred milliamps: power rails, motor drives, LED strips. It is a thermal limit rather than a damage limit, so it tells you how hot the copper gets, and it flags separately that voltage drop is often the real constraint on long low-voltage traces.',
  'trace-width.warn1':
    '{width} mm is below the {FAB_MIN_WIDTH} mm that low-cost fabricators reliably etch. Use their minimum instead: it costs nothing and the trace will simply run cooler than required.',
  'trace-width.warn2':
    'Internal layers have no air on either side, so IPC halves the constant and the trace needs about 2.7 times the cross-section for the same rise. Route high-current nets on outer layers where you can.',
  'trace-width.warn3':
    'A {riseK} K rise is aggressive. FR-4 is fine thermally but the trace is heating everything near it, including components whose ratings assume ambient. Most designs allow 10 to 20 K.',
  'trace-width.widthFollowsFromCross':
    'Width follows from cross-section and copper weight: `w = A / thickness`, where 1 oz copper is about 35 µm. So doubling to 2 oz halves the width you need, which is often cheaper than widening a congested board.',
  'transformer.apparentPower': 'Apparent power',
  'transformer.blurb': 'Turns ratio, reflected impedance, regulation and core loss estimate.',
  'transformer.copperLossOnly': 'copper loss only',
  'transformer.lede':
    'Turns ratio sets voltage, and its square sets impedance. Winding resistance is what turns a textbook ideal transformer into one whose output sags the moment you load it.',
  'transformer.lossesAndRating': 'Losses and rating',
  'transformer.primaryCopperLoss': 'Primary copper loss',
  'transformer.primaryCurrent': 'Primary current',
  'transformer.primaryResistance': 'Primary resistance',
  'transformer.primaryTurns': 'Primary turns',
  'transformer.primaryVoltage': 'Primary voltage',
  'transformer.ratedVa': 'rated {vaRating} VA',
  'transformer.reflectedImpedance': 'Reflected impedance',
  'transformer.regulation': 'Regulation',
  'transformer.regulationIsWhatWinding':
    'Regulation is what winding resistance costs you. Current through the secondary resistance, plus the primary resistance reflected across the same ratio, drops voltage in proportion to load. So the no-load voltage is always higher than the nameplate, and a small transformer can read 25% high when unloaded.',
  'transformer.secondaryCopperLoss': 'Secondary copper loss',
  'transformer.secondaryCurrent': 'Secondary current',
  'transformer.secondaryLoaded': 'Secondary, loaded',
  'transformer.secondaryNoLoad': 'Secondary, no load',
  'transformer.secondaryResistance': 'Secondary resistance',
  'transformer.secondaryTurns': 'Secondary turns',
  'transformer.seenByThePrimary': 'seen by the primary',
  'transformer.theConsequencePeopleForget':
    'The consequence people forget is impedance. A load Zs on the secondary appears to the primary as `(Np/Ns)²·Zs`. That square is why transformers match impedances as well as voltages, and it is the entire basis of valve amplifier output stages and RF matching networks.',
  'transformer.theory1':
    'The defining relations are `Vs = Vp·Ns/Np` and `Is = Ip·Np/Ns`. Voltage steps down while current steps up, so apparent power is conserved: a transformer moves energy, it does not make it.',
  'transformer.thisModelCoversCopper':
    'This model covers copper loss only. Real transformers also have core loss from hysteresis and eddy currents, which is roughly constant with load and dominates at light load, plus leakage inductance that worsens regulation further at higher frequencies. The VA rating is a thermal limit covering all of it together.',
  'transformer.title': 'Transformer',
  'transformer.turnsRatio': 'Turns ratio',
  'transformer.use':
    'Mains power supplies, isolation for safety, and impedance matching in audio and RF. The reflected impedance relation is the one people forget, and it is why a transformer is the standard way to match a low-impedance speaker or antenna to a high-impedance source.',
  'transformer.vaRating': 'VA rating',
  'transformer.warn1':
    '{VA} exceeds the {vaRating} VA rating. The windings will overheat, and since the rating is thermal rather than magnetic it may run for a while before failing, which is what makes it dangerous.',
  'transformer.warn2':
    '{regulation}% regulation means the output sags badly under load. Small transformers are much worse than large ones here, which is why a 5 VA part marked 12 V often measures 15 V unloaded.',
  'transformer.windings': 'Windings',
  'ui.0To3v3': '0 to 3V3',
  'ui.allSimulators': 'All simulators',
  'ui.amplitudePeak': 'Amplitude (peak)',
  'ui.backToTheCatalogue': 'Back to the catalogue',
  'ui.bipolar': 'bipolar',
  'ui.bipolar2': 'Bipolar',
  'ui.catalogue': 'Catalogue',
  'ui.channels': 'Channels',
  'ui.coarser': 'Coarser',
  'ui.filterSimulators': 'Filter simulators',
  'ui.finer': 'Finer',
  'ui.language': 'Language',
  'ui.loadingSimulator': 'Loading simulator...',
  'ui.logic': 'logic',
  'ui.noMatch': 'No match.',
  'ui.ofSimulatorsBuiltEvery':
    '{ready} of {total} simulators built. Every one runs the real formulas in the browser and drives the same live oscilloscope.',
  'ui.planned': 'planned',
  'ui.scrollOrPinchTo':
    'Scroll or pinch to zoom the time base, drag to pan, double click to reset.',
  'ui.signalSwing': 'Signal swing',
  'ui.simulatorsAndCalculatorsFor': 'Simulators and calculators for electronics engineers',
  'ui.stepHeight': 'Step height',
  'ui.theMathsBehindThis': 'The maths behind this page',
  'ui.timebase': 'Timebase',
  'ui.toggleSimulatorList': 'Toggle simulator list',
  'ui.tracePx': 'Trace {px} px',
  'ui.traceThickness': 'Trace thickness',
  'ui.voltsDiv': 'Volts / div',
  'ui.waveform': 'Waveform',
  'ui.whereIsItUsed': 'Where is it used?',
  'ui.zoomIn': 'Zoom in',
  'ui.zoomOut': 'Zoom out',
  'voltage-divider.1206OrAxial1': '1206 or axial (1/4 W)',
  'voltage-divider.axial12W': 'Axial (1/2 W)',
  'voltage-divider.blurb': 'Unloaded and loaded divider, output impedance, error from the load.',
  'voltage-divider.defaultsToThe3v3': 'Defaults to the 3V3 ESP32 rail.',
  'voltage-divider.hangRlOnIt':
    'Hang RL on it and the lower leg becomes `R2||RL`, giving `Vout = Vin·(R2||RL)/(R1 + R2||RL)`. Equivalently the source divides against its own impedance: `Vout·RL/(RL + Zout)`. The error is therefore `-Zout/(Zout + RL)`, which is -50% at RL = Zout, -9.1% at 10x and -1% at 100x.',
  'voltage-divider.inputResistanceOfWhatever': 'Input resistance of whatever the tap drives.',
  'voltage-divider.lede':
    'Two resistors and a tap. The unloaded answer is the easy part: what matters is the output impedance, and how much the thing you hang on the tap drags it down.',
  'voltage-divider.loadConnected': 'Load connected',
  'voltage-divider.loadDominates': '(load dominates)',
  'voltage-divider.loadError': 'Load error',
  'voltage-divider.lookingBackIntoThe':
    'Looking back into the tap with the supply shorted, R1 and R2 appear in parallel, so the Thevenin source impedance is `Zout = R1·R2/(R1+R2)`. That is the whole reason a divider is not a regulator.',
  'voltage-divider.noLoad': '(no load)',
  'voltage-divider.ofRating': '({rating}% of rating)',
  'voltage-divider.perHour': '({pTotal} per hour)',
  'voltage-divider.powerInLoad': 'Power in load',
  'voltage-divider.powerInR1': 'Power in R1',
  'voltage-divider.powerInR2': 'Power in R2',
  'voltage-divider.powerIsIR':
    'Power is `I²R` in R1 and `V²/R` in the shunt legs, and the three add up to `Vin·I`. The design tension is fixed: low resistances give a stiff output and burn current forever, high resistances sip current and collapse under any real load.',
  'voltage-divider.quiescentCurrent': 'Quiescent current',
  'voltage-divider.ratio': '(ratio {ratio})',
  'voltage-divider.resistiveVoltageDivider': 'Resistive voltage divider',
  'voltage-divider.resistorPackage': 'Resistor package',
  'voltage-divider.rl': 'RL',
  'voltage-divider.rlZout': 'RL / Zout',
  'voltage-divider.stiffEnough': '(stiff enough)',
  'voltage-divider.stringAlone': '(string alone)',
  'voltage-divider.theory1':
    'With nothing on the tap the current is the same in both legs, so `Vout = Vin·R2/(R1+R2)`. Only the ratio sets the voltage: 1k/1k and 1M/1M both give half the rail, but one wastes 1000x the current.',
  'voltage-divider.title': 'Voltage Divider',
  'voltage-divider.totalFromSupply': 'Total from supply',
  'voltage-divider.use':
    'Everywhere. Scaling a battery voltage into an ADC range, setting the feedback point of a regulator, biasing a transistor, and making a reference. The trap it exposes is loading: a divider that reads correctly on a meter can read completely wrong once the circuit it feeds draws current.',
  'voltage-divider.voutLoaded': 'Vout loaded',
  'voltage-divider.voutUnloaded': 'Vout unloaded',
  'voltage-divider.warn1':
    'One of the resistors is over its {rating} rating. Raise both values or move to a bigger package: the model is still linear, the part is not.',
  'voltage-divider.warn2':
    'Zout is {zout}, above the {ADC_MAX_SOURCE_OHMS} the ESP32 ADC wants. The sample-and-hold cap will not settle inside the sampling window, so readings come out low. Lower both resistors or buffer the tap with an op-amp follower.',
  'voltage-divider.warn3':
    'RL is only {stiffness}x Zout, so this is not a voltage source, it is a resistor network. Design around the loaded number or drop both divider values.',
  'wheatstone.adcCounts': '({counts} ADC counts)',
  'wheatstone.adcWantsUnder': '(ADC wants under {ADC_MAX_SOURCE_OHMS})',
  'wheatstone.arms': 'Arms',
  'wheatstone.at': '(at {arm} = {rArm})',
  'wheatstone.balance': 'Balance',
  'wheatstone.blurb': 'Bridge output against sensor resistance, and the balance condition.',
  'wheatstone.bothReferredToBridge': '(both referred to bridge ground)',
  'wheatstone.bridgeOutput': 'Bridge output',
  'wheatstone.excitation': 'Excitation',
  'wheatstone.excitationCurrent': 'Excitation current',
  'wheatstone.forNull': '{arm} for null',
  'wheatstone.fromNow': '({trim}{trim2} from now)',
  'wheatstone.lookingBackIntoThe':
    'Looking back into the output with the supply shorted, each pair is in parallel: `Rth = R1||R2 + R3||R4`. That is what a load sees, so a real load pulls the output down by `Rl/(Rth+Rl)`. Neither tap is at ground, so a single-ended ADC pin cannot read Vout directly, it needs a differential amplifier.',
  'wheatstone.nulled': 'nulled',
  'wheatstone.offNull': 'off null',
  'wheatstone.per1Of': 'Per 1% of {arm}',
  'wheatstone.sensitivityIsTheDerivative':
    'Sensitivity is the derivative at the operating point, for example `dVout/dR4 = -Vin·R3/(R3+R4)²`. With four equal arms that collapses to `Vin/4` per unit `ΔR/R`, the number every strain gauge datasheet quotes. The exact single-arm response is `Vout = -(Vin/4)·x/(1 + x/2)` for `x = ΔR/R`, so the amber tangent trace and the violet true curve pull apart as the sweep leaves the operating point. That gap is the bridge nonlinearity, about 0.05% at 1000 microstrain and several percent for a thermistor.',
  'wheatstone.sensorArm': 'Sensor arm',
  'wheatstone.spanAboutNominal': 'Span about nominal',
  'wheatstone.tangent': 'Tangent',
  'wheatstone.tapATapB': 'Tap A / tap B',
  'wheatstone.theory1':
    'Each half is a plain voltage divider, so the taps sit at `Vin·R2/(R1+R2)` and `Vin·R4/(R3+R4)`. The bridge output is their difference, `Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))`, which is zero when `R1/R2 = R3/R4`, i.e. `R1·R4 = R2·R3`. Balance depends on ratios only, so it is immune to supply drift.',
  'wheatstone.theveninRout': 'Thevenin Rout',
  'wheatstone.title': 'Wheatstone Bridge',
  'wheatstone.to': '{from} to {to}',
  'wheatstone.totalDissipation': 'Total dissipation',
  'wheatstone.twoDividersAcrossOne':
    "Two dividers across one supply, read as a difference. The trace is a sweep, not a waveform: the horizontal axis is {arm}, the sensor arm, so read the scope's per-division figure as ohms.",
  'wheatstone.use':
    'The standard front end for resistive sensors: strain gauges in load cells, RTDs for temperature, and pressure sensors. The bridge exists because it measures a small change against a reference rather than an absolute value, which cancels supply drift and lets you amplify hard without amplifying the offset.',
  'wheatstone.vin4PerUnit': '(Vin/4 per unit ΔR/R at balance)',
  'wheatstone.warn1':
    'Output is under one ADC count ({ADC_LSB} at {ADC_FULL_SCALE} full scale, 12 bit). Put an instrumentation amp in front of it, i.e. INA333 or INA826, or the reading is all noise.',
  'wheatstone.warn2':
    'A tap sits outside 0 to {ADC_FULL_SCALE}, the ESP32 ADC input range. Lower the excitation or divide the taps down before the pin.',
  'wheatstone.warn3':
    'Source impedance is above {ADC_MAX_SOURCE_OHMS}, so the ADC sample and hold will not settle inside its window. Use lower arm values or buffer the taps with an op amp.',
  'wheatstone.warn4':
    'Worst arm dissipates {maxArmPower}, past the {RESISTOR_POWER_W} a common 1/4 W part is rated for. Self-heating drifts the arm and shows up as output offset.',
  'wheatstone.wheatstoneBridge': 'Wheatstone bridge',
  'wheatstone.worstArm': '(worst arm {maxArmPower})',
  'wire-gauge.ampacityBundled': 'Ampacity, bundled',
  'wire-gauge.ampacityChassis': 'Ampacity, chassis',
  'wire-gauge.ampacityHereIsRule':
    'Ampacity here is rule-of-thumb guidance, roughly 7.5 A/mm² for a single chassis run in free air and 3.5 A/mm² bundled. Real installations are governed by wiring regulations that account for insulation rating, grouping and ambient temperature. Use this to choose a starting point, not to certify an installation.',
  'wire-gauge.blurb': 'AWG to diameter and resistance, ampacity and voltage drop over a run.',
  'wire-gauge.conductorTemp': 'Conductor temp',
  'wire-gauge.copperGainsAbout0':
    'Copper gains about 0.39% resistance per kelvin, so a wire that is already running warm gets worse: more resistance means more loss means more heat. That feedback is weak enough to be stable in copper, but it is why ampacity figures assume a temperature rise and why bundling wires derates them so heavily.',
  'wire-gauge.countReturnConductor': 'Count return conductor',
  'wire-gauge.freeAirSingleRun': 'free air, single run',
  'wire-gauge.lede':
    'Pick a wire gauge and see what it actually costs you: resistance, voltage lost on the way to the load, and heat. The default counts both conductors, which is the half that people usually forget.',
  'wire-gauge.loopResistance': 'Loop resistance',
  'wire-gauge.ofSupply': '{dropFraction}% of supply',
  'wire-gauge.powerLostAsHeat': 'Power lost as heat',
  'wire-gauge.resistanceIsRRho':
    'Resistance is `R = rho·L/A` with copper at 1.68e-8 Ω·m. The drop is `V = I·R` over *both* conductors, since the current has to come back. Halving that by only counting one leg is the single most common error in cable sizing.',
  'wire-gauge.resistancePerMetre': 'Resistance per metre',
  'wire-gauge.runLength': 'Run length',
  'wire-gauge.runResistance': 'Run resistance',
  'wire-gauge.theory1':
    'The AWG series is geometric: `d = 0.127 mm · 92^((36-n)/39)`. That ratio is chosen so six gauge steps is almost exactly a factor of four in area, three steps is a factor of two, and ten steps is a factor of ten. Handy for mental arithmetic: going from 22 AWG to 12 AWG gives ten times the copper.',
  'wire-gauge.title': 'Wire Gauge (AWG)',
  'wire-gauge.use':
    'Wiring anything beyond a breadboard: battery leads, motor supplies, LED strip feeds, car and solar installations. The voltage drop figure is the useful one, since a supply that measures correctly at the source can arrive well below spec at the load, and the return conductor doubles the drop people usually calculate.',
  'wire-gauge.voltageAtLoad': 'Voltage at load',
  'wire-gauge.warn1':
    '{current} through {awg} AWG exceeds the bundled-wiring guidance of {ampacityBundled}. In free air on its own it may be acceptable, but inside a loom or a conduit the heat has nowhere to go. Drop three gauges to double the copper.',
  'wire-gauge.warn2':
    'Losing {vDrop}, which is {dropFraction}% of the supply. Above about 3% most loads misbehave: regulators drop out, motors lose torque, and LED strips visibly dim toward the far end.',
  'wire-gauge.wire': 'Wire',
  'ws2812-power.25Headroom': '25% headroom',
  'ws2812-power.allWhiteFullBrightness': 'all white, full brightness',
  'ws2812-power.atFullWhiteLeds':
    'At full white, {ledCount} LEDs need {peakCurrent}. This is why a 5 metre 60/m strip is a genuinely serious load, around 18 A, and why almost nobody actually runs one at full white. Brightness scales the current linearly, so a strip limited to 25% is a far more practical proposition.',
  'ws2812-power.blurb': 'Strip current, supply sizing and where to inject power along the run.',
  'ws2812-power.bothConductors': 'both conductors',
  'ws2812-power.brightness': 'Brightness',
  'ws2812-power.channelsLit': 'Channels lit',
  'ws2812-power.content': 'Content',
  'ws2812-power.currentNow': 'Current now',
  'ws2812-power.dropAtFarEnd': 'Drop at far end',
  'ws2812-power.feedPowerAtIntervals': 'feed power at intervals',
  'ws2812-power.feedResistance': 'Feed resistance',
  'ws2812-power.feedWireGauge': 'Feed wire gauge',
  'ws2812-power.injectionPoints': 'Injection points',
  'ws2812-power.ledCount': 'LED count',
  'ws2812-power.lede':
    'Addressable strips draw far more than people expect and the far end browns out long before the supply gives up. WS2812s are 5 V parts, which also puts their data line at odds with a 3.3 V ESP32.',
  'ws2812-power.ledsPerMetre': 'LEDs per metre',
  'ws2812-power.peakPower': 'Peak power',
  'ws2812-power.powerNow': 'Power now',
  'ws2812-power.recommendedSupply': 'Recommended supply',
  'ws2812-power.single': 'Single',
  'ws2812-power.singleFeedIsFine': 'single feed is fine',
  'ws2812-power.sizeTheSupplyFor':
    'Size the supply for the peak you could command, not the average you intend. Software that accidentally sets every pixel white will pull the full current, and a supply sized for the artistic intent will either shut down or sag until the data signal fails.',
  'ws2812-power.strip': 'Strip',
  'ws2812-power.stripLength': 'Strip length',
  'ws2812-power.supplyWiring': 'Supply wiring',
  'ws2812-power.theory1':
    'Each WS2812 contains three LEDs at roughly 20 mA per channel, so a fully lit white pixel draws about 60 mA. The controller inside also draws about 1 mA even when the LED is dark, which is easy to forget on a long strip: 300 pixels idle still costs around 300 mA.',
  'ws2812-power.theSubtlerProblemIs':
    'The subtler problem is the copper. Current enters at one end and is consumed along the way, so the conductor carries the full load at the start and nothing at the end. The average is about half, so the end-to-end drop is roughly `I·R/2` rather than `I·R`. It still adds up fast on the thin traces built into the strip itself, which is why long runs need power injected at intervals rather than just fatter feed wire.',
  'ws2812-power.title': 'WS2812 LED Power',
  'ws2812-power.two': 'Two',
  'ws2812-power.use':
    'Addressable LED strips for lighting, signage and displays. The current is far higher than people expect, around 60 mA per pixel at full white, and the far end of a long strip browns out and shifts colour before the supply gives up. It also flags the 3.3 V data problem, which is why these strips work intermittently with an ESP32.',
  'ws2812-power.voltageAtFarEnd': 'Voltage at far end',
  'ws2812-power.warn1':
    'The far end sees only {endVoltage}. WS2812s dim and shift colour as the supply sags, typically toward red because the blue die has the highest forward voltage and starves first. Inject power at {injectionPoints} points along the run, or use heavier feed wire.',
  'ws2812-power.warn2':
    'WS2812 is a 5 V part and its data input wants at least 0.7·VDD, i.e. about 3.5 V. A 3.3 V ESP32 pin is marginally below that. It often works, and then stops working when the strip warms up or the wire gets longer. Use a level shifter, or power the first LED from 3.9 V through a diode so its logic threshold drops to meet the ESP32.',
  'zener.blurb': 'Series resistor sizing across the load range, zener power check.',
  'zener.constantTotalLoss': '(constant, total loss {pTotal})',
  'zener.datasheetImpedanceAtThe': 'Datasheet impedance at the test current. 1N4728A is 10 Ω.',
  'zener.datasheetIzkIs1': 'Datasheet Izk is 1 mA. Use 5 to 10 mA for a stiff output.',
  'zener.dropoutAtFullLoad': '(dropout at full load, to derated power at no load)',
  'zener.droppedOut': '(dropped out)',
  'zener.e24Pick': '(E24 pick {suggestion})',
  'zener.efficiencyAtFullLoad': 'Efficiency at full load',
  'zener.fitAPart': '(fit a {rsWattage} part)',
  'zener.ilMax': 'IL max',
  'zener.ilMin': 'IL min',
  'zener.includeSupplyToleranceAnd': 'Include supply tolerance and ripple peaks.',
  'zener.inputRange': 'Input range',
  'zener.inRegulation': '(in regulation)',
  'zener.izMinKnee': 'Iz min (knee)',
  'zener.izWorstCaseMax': 'Iz worst case max',
  'zener.izWorstCaseMin': 'Iz worst case min',
  'zener.lede':
    'Size the series resistor so the zener still regulates at the lowest input with the heaviest load, and still survives the highest input with no load at all. Every figure is a worst case, not a nominal.',
  'zener.lineSwing': '(line swing {lineSwing})',
  'zener.loadSwing': '(load swing {loadSwing})',
  'zener.midInput': '(mid input)',
  'zener.noPartFits': '(no part fits)',
  'zener.ofRating': '({pzFraction}% of rating)',
  'zener.powerFollowsDirectlyPz':
    'Power follows directly: `Pz = Vz·Iz` at the hot corner and `Prs = Irs²·Rs`. The current budget is `Iz_max = {POWER_DERATING} · Pz_max / Vz`, half the rating because datasheet numbers assume 25 C.',
  'zener.powerLimitToRegulation': '(power limit to regulation limit)',
  'zener.powerRating': 'Power rating',
  'zener.regulatingInputRange': 'Regulating input range',
  'zener.regulationQualityComesFrom':
    'Regulation quality comes from the dynamic impedance Zz, not the DC clamp. Rs and Zz form a divider for anything riding on the input, so `dVout/dVin = Zz / (Rs + Zz)`, and the output impedance seen by the load is `Rs ∥ Zz`. Note the trade: a large Rs is efficient but a poor regulator.',
  'zener.rippleRejection': 'Ripple rejection',
  'zener.rs': 'Rs',
  'zener.rsDissipation': 'Rs dissipation',
  'zener.rsFitted': 'Rs fitted',
  'zener.rsWindow': 'Rs window',
  'zener.theDcModelTreats':
    'The DC model treats the zener as an ideal Vz clamp above the knee and as an open circuit below it, which is why the low corner reports a plain series drop instead of a regulated output. Extrapolating the Zz tangent line down to zero current would look more sophisticated and be badly wrong: a 1N4728A is 10 Ω at 76 mA but 400 Ω at 1 mA.',
  'zener.theory1':
    'The zener is a shunt: it takes whatever current the load does not. `Rs = (Vin - Vz) / (Iz + IL)` is the whole design, evaluated at the two corners that bite. Lowest input with the heaviest load leaves the least current for the zener, which sets the largest usable Rs. Highest input with the lightest load pushes everything through the zener, which sets the smallest.',
  'zener.title': 'Zener Regulator',
  'zener.use':
    'Cheap voltage references, clamping an input to protect a pin, and low-current regulation where a proper regulator is overkill. The design is entirely about worst cases: the series resistor must pass enough current at minimum input and maximum load, without cooking the zener at maximum input and no load.',
  'zener.vinMax': 'Vin max',
  'zener.vinMaxIlMin': '(Vin max, IL min; budget {izMaxAllowed})',
  'zener.vinMin': 'Vin min',
  'zener.vinMinIlMax': '(Vin min, IL max; knee {izMin})',
  'zener.voutAtWorstCase': 'Vout at worst case',
  'zener.vz': 'Vz',
  'zener.warn1':
    'Vin min ({vinMin}) is not above Vz ({vz}). A shunt regulator can only drop voltage, so there is no resistor that works. Lower Vz or raise the input.',
  'zener.warn2':
    'No single resistor satisfies both extremes: Rs must be at least {rsMin} to keep the zener inside its power budget at {vinMax} with no load, but at most {rsMax} to hold the knee at {vinMin} with {ilMax}. Use a higher-wattage zener, narrow the input range, or move to a series pass regulator.',
  'zener.warn3':
    'Out of regulation at the low corner: Rs only delivers {irs} at {vinMin}, so the zener is left with {iz}, under the {izMin} knee. Output sags to {vout} and tracks the load. Reduce Rs below {rsMax}.',
  'zener.warn4':
    'Zener over its rating: {pz} in a {pzMax} part at {vinMax} with the load disconnected. It will fail, usually shorted, which then dumps {irs} into Rs. Raise Rs above {rsMin}.',
  'zener.warn5':
    'Zener at {pzFraction}% of its rating. Inside the absolute limit but past the {POWER_DERATING}% budget this page uses: ratings are quoted at 25 C and the part will run hot in still air.',
  'zener.worstCaseForThe': 'Worst case for the zener. Assume zero unless the load is always on.',
  'zener.zener': 'Zener',
  'zener.zenerDissipation': 'Zener dissipation',
  'zener.zenerShuntRegulator': 'Zener shunt regulator',
  'zener.zztDynamic': 'Zzt (dynamic)',
} as const

export type Key = keyof typeof en
