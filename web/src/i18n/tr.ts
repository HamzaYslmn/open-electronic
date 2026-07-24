/**
 * Turkish, keyed by the English source text.
 *
 * Anything missing here falls back to the English key automatically, so this
 * file can grow without ever breaking the app. en.ts is the inventory of keys
 * this is checked against; symbols and part numbers (Vin, 1N4148) are
 * deliberately absent because they read the same in both languages.
 */
export const tr: Record<string, string> = {
  '-∞ dB': '-∞ dB',
  '-3 dB': '-3 dB',
  ', inverted': ', evrilmiş',
  ', past the {vBreakdown} rating of the switch. The transistor avalanches and takes the energy as heat, usually once.':
    ', bu da anahtarın {vBreakdown} dayanma geriliminin ötesinde. Transistör çığ kırılmasına girer ve enerjiyi ısı olarak alır, genellikle bir kez.',
  '. That is inside the rating here, but only because the coil is small.':
    '. Bu, burada dayanma geriliminin içinde kalıyor, ama yalnızca bobin küçük olduğu için.',
  '({active} active, top is H{top})': '({active} etkin, en üst H{top})',
  '({bits} bit, max {maxBits} at this f)': '({bits} bit, bu f değerinde en çok {maxBits})',
  '({counts} ADC counts)': '({counts} ADC adımı)',
  '({currentError} on target)': '(hedeften {currentError})',
  '({distortion} of harmonics 2 to 10)': '(2 - 10. harmoniklerden {distortion})',
  '({e}% of full)': '(tamın %{e} kadarı)',
  '({efficiency}% efficient)': '(%{efficiency} verim)',
  '({efficiency}% of what the switch passes)': '(anahtarın geçirdiğinin %{efficiency} kadarı)',
  '({gainDb} dB{inverted})': '({gainDb} dB{inverted})',
  '({gainError}% of the DC gain)': '(DC kazancının %{gainError} kadarı)',
  '({pin} in, {pout} out)': '({pin} giriş, {pout} çıkış)',
  '({pTotal} per hour)': '(saatte {pTotal})',
  '({pzFraction}% of rating)': '(anma değerinin %{pzFraction} kadarı)',
  '({rating}% of rating)': '(anma değerinin %{rating} kadarı)',
  '({ripplePercent}% of Vout)': "(Vout'un %{ripplePercent} kadarı)",
  '({rippleRatio}% of load)': '(yükün %{rippleRatio} kadarı)',
  '({rise} K over ambient)': '(ortam üzerine {rise} K)',
  '({riseK} K rise, limit {TJ_MAX_K})': '({riseK} K artış, sınır {TJ_MAX_K})',
  '({targetErr}{targetErr2} against target)': '(hedefe göre {targetErr}{targetErr2})',
  '({thermal} in free air)': '(serbest havada {thermal})',
  '({total} lost)': '({total} kayıp)',
  '({trim}{trim2} from now)': '(şimdikinden {trim}{trim2})',
  '({values} in {mode})': '({mode} bağlı {values})',
  '({vmin} to {vmax})': '({vmin} - {vmax})',
  '({voltage} across Rs)': '(Rs üzerinde {voltage})',
  '({vout}% of Vout)': "(Vout'un %{vout} kadarı)",
  '({voutRatio}% of Vout)': "(Vout'un %{voutRatio} kadarı)",
  '(1 / 2·pi·Rin·Cf)': '(1 / 2·pi·Rin·Cf)',
  '(1 + Rf/Rg, sets the bandwidth)': '(1 + Rf/Rg, bant genişliğini belirler)',
  '(10^(1/{steps}), half step {halfStep})': '(10^(1/{steps}), yarım adım {halfStep})',
  '(12-bit step {ADC_LSB})': '(12 bit adım {ADC_LSB})',
  '(2 per input cycle when tripping)': '(tetiklenirken giriş çevrimi başına 2)',
  '(2.197·tau)': '(2,197·tau)',
  '(5·tau = {settle5tau})': '(5·tau = {settle5tau})',
  '(63% of the rise)': "(artışın %63'ü)",
  '(a heatsink is mandatory)': '(soğutucu zorunludur)',
  '(ADC wants under {ADC_MAX_SOURCE_OHMS})': '(ADC {ADC_MAX_SOURCE_OHMS} altını ister)',
  '(aim for {MARGIN_TARGET_K} K)': '({MARGIN_TARGET_K} K hedefleyin)',
  '(always >50% without a diode)': '(diyot olmadan her zaman >%50)',
  '(as a share of total rms)': '(toplam etkin değerin oranı olarak)',
  '(at {ambientC} °C ambient)': '({ambientC} °C ortamda)',
  '(at {arm} = {rArm})': '({arm} = {rArm} iken)',
  '(at {pd} and {ambientK} ambient)': '({pd} ve {ambientK} ortamda)',
  '(at t = 0, V/R)': '(t = 0 anında, V/R)',
  '(barely filtered)': '(neredeyse hiç süzülmemiş)',
  '(below equilibrium)': '(dengenin altında)',
  '(below this it is just a {gain}x inverter)': '(bunun altında yalnızca {gain}x bir evirici olur)',
  '(both referred to bridge ground)': '(ikisi de köprü toprağına göre)',
  '(boundary at {boundary})': '(sınır {boundary})',
  '(burned in Rg and the pin, not the FET)': "(FET'te değil, Rg ile pinde harcanır)",
  '(check Isat)': "(Isat'ı denetleyin)",
  '(clean DC)': '(temiz DC)',
  '(conduction + switching)': '(iletim + anahtarlama)',
  '(constant, total loss {pTotal})': '(sabit, toplam kayıp {pTotal})',
  '(D·Id²·RDS at {duty}% duty)': '(%{duty} görev çevriminde D·Id²·RDS)',
  '(datasheet {rdsOnSpec} at {vgsSpec})': '(veri sayfası {vgsSpec} değerinde {rdsOnSpec})',
  '(DC {dc})': '(DC {dc})',
  '(deep in the passband)': '(geçirme bandının derinlerinde)',
  '(deep in the stopband)': '(durdurma bandının derinlerinde)',
  '(die limited)': '(yonga sınırlı)',
  '(drive {drive})': '(sürüş {drive})',
  '(drive limited, not die limited)': '(sürüş sınırlı, yonga sınırlı değil)',
  '(dropout at full load, to derated power at no load)':
    '(tam yükte düşüm sınırı, yüksüzde düşürülmüş güce kadar)',
  '(dropped out)': '(düşüm sınırında)',
  '(E24 {r2E24} gives {voutE24})': '(E24 {r2E24} ile {voutE24})',
  '(E24 pick {suggestion})': '(E24 seçimi {suggestion})',
  '(edges {trEff} / {tfEff})': '(kenarlar {trEff} / {tfEff})',
  '(equals the stored energy, whatever R is)': '(R ne olursa olsun depolanan enerjiye eşittir)',
  '(falls to zero each cycle)': '(her çevrimde sıfıra iner)',
  '(fit a {rsWattage} part)': '({rsWattage} bir parça takın)',
  '(free air is enough)': '(serbest hava yeterli)',
  '(full rail on every member)': '(her eleman üzerinde tam hat gerilimi)',
  '(GBW / {noiseGain})': '(GBW / {noiseGain})',
  '(GPIO limit {GPIO_MAX_MA} mA)': '(GPIO sınırı {GPIO_MAX_MA} mA)',
  '(healthy)': '(sağlıklı)',
  '(ideal L and C, see below)': '(ideal L ve C, aşağıya bakın)',
  '(ideal switch {idIdeal})': '(ideal anahtar {idIdeal})',
  '(ideal Vout/Vin {dutyIdeal} %)': '(ideal Vout/Vin %{dutyIdeal})',
  '(in regulation)': '(regülasyonda)',
  '(Isat {isat})': '(Isat {isat})',
  '(keep Isat above this)': "(Isat'ı bunun üstünde tutun)",
  '(line swing {lineSwing})': '(hat salınımı {lineSwing})',
  '(load dominates)': '(yük baskın)',
  '(load swing {loadSwing})': '(yük salınımı {loadSwing})',
  '(load takes {pLoad}, device draws {iDevice})': '(yük {pLoad} alır, eleman {iDevice} çeker)',
  '(mid input)': '(orta giriş)',
  '(min load {I_LOAD_MIN}, so R1 ≤ {r1Max})': '(en az yük {I_LOAD_MIN}, yani R1 ≤ {r1Max})',
  '(near the corner)': '(köşeye yakın)',
  '(needs {DROPOUT_V}, so Vin ≥ {vinMin})': '({DROPOUT_V} gerekir, yani Vin ≥ {vinMin})',
  '(never reaches zero)': '(hiç sıfıra inmez)',
  '(never trips)': '(hiç tetiklenmez)',
  '(never, target is past the asymptote)': '(hiçbir zaman, hedef asimptotun ötesinde)',
  '(no fundamental to compare against)': '(karşılaştırılacak temel bileşen yok)',
  '(no load)': '(yüksüz)',
  '(no part fits)': '(uyan parça yok)',
  '(of the ambient to Tj max span)': "(ortamdan Tj max'a olan aralığın)",
  '(over one GPIO)': "(tek bir GPIO'nun üzerinde)",
  '(part does {slewRate}, i.e. {e6} V/µs)': '(parça {slewRate} yapar, yani {e6} V/µs)',
  '(peak {peakAc})': '(tepe {peakAc})',
  '(period {fsw})': '(çevrim {fsw})',
  '(poor)': '(zayıf)',
  '(power limit to regulation limit)': '(güç sınırından regülasyon sınırına)',
  '(power-on, cap empty)': '(açılış, kondansatör boş)',
  '(R total {rTotal})': '(toplam R {rTotal})',
  '(rail headroom {headroom})': '(hat payı {headroom})',
  '(rails clip at {lo} / {hi})': '(hatlar {lo} / {hi} noktasında kırpar)',
  '(ratio {ratio})': '(oran {ratio})',
  '(Rin into a virtual earth)': '(sanal toprağa Rin)',
  '(ripple limited)': '(dalgalanmayla sınırlı)',
  '(rise {ta} K over {ta2} °C)': '({ta2} °C üzerine {ta} K artış)',
  '(safe to touch)': '(dokunmak güvenli)',
  '(scales with fsw)': '(fsw ile ölçeklenir)',
  '(sine 1.414, triangle 1.732)': '(sinüs 1,414, üçgen 1,732)',
  '(sqrt(L/C))': '(sqrt(L/C))',
  '(SR / 2·pi·Vpk)': '(SR / 2·pi·Vpk)',
  '(step response)': '(basamak yanıtı)',
  '(stiff enough)': '(yeterince sağlam)',
  '(straight onto the pin)': '(doğrudan pine)',
  '(string alone)': '(yalnızca bölücü)',
  '(target covered)': '(hedef kapsanıyor)',
  '(target outside)': '(hedef dışarıda)',
  '(tau = {tau})': '(tau = {tau})',
  '(the part rating, thermals have room)': '(parça sınırı, ısıl olarak yer var)',
  '(thermal, {pdMax} budget)': '(ısıl, {pdMax} bütçe)',
  '(to sit on {tjMaxC} °C)': "({tjMaxC} °C'de kalmak için)",
  '(V - Vsat) / R': '(V - Vsat) / R',
  '(VGS {vgsDrive} - Vth {vth})': '(VGS {vgsDrive} - Vth {vth})',
  '(Vin max, IL min; budget {izMaxAllowed})': '(Vin max, IL min; bütçe {izMaxAllowed})',
  '(Vin min, IL max; knee {izMin})': '(Vin min, IL max; dizin {izMin})',
  '(Vin/4 per unit ΔR/R at balance)': '(dengede birim ΔR/R başına Vin/4)',
  '(visible ripple)': '(görünür dalgalanma)',
  '(Vout/Vin, a linear regulator burns the rest)':
    '(Vout/Vin, doğrusal bir regülatör gerisini yakar)',
  '(Vref spread {V_REF_MIN} to {V_REF_MAX} V, resistors exact)':
    '(Vref saçılımı {V_REF_MIN} - {V_REF_MAX} V, dirençler tam)',
  '(Vs - Vf) / If': '(Vs - Vf) / If',
  '(widest gap, inside the {tolerance} grade)': '(en geniş boşluk, {tolerance} sınıfının içinde)',
  '(widest gap, past the {tolerance} grade)': '(en geniş boşluk, {tolerance} sınıfının ötesinde)',
  '(will burn on contact)': '(temasta yakar)',
  '(worst arm {maxArmPower})': '(en kötü kol {maxArmPower})',
  '{ADC_BITS} bits': '{ADC_BITS} bit',
  '{arm} for null': 'Sıfırlama için {arm}',
  '{autonomyDays} days at {dod}% DoD': "%{dod} DoD'de {autonomyDays} gün",
  '{avDb} dB, inverting': '{avDb} dB, eviren',
  '{conductionAngle}° conduction': '{conductionAngle}° iletim',
  '{crestFactor}x Idc': '{crestFactor}x Idc',
  '{current} is over the {maxCurrent} absolute maximum set for this LED. Continuous operation there shortens life or kills the die.':
    '{current}, bu LED için belirlenen {maxCurrent} mutlak en büyük değerin üzerinde. Orada sürekli çalışmak ömrü kısaltır ya da yongayı öldürür.',
  '{current} is past the {GPIO_MAX_MA} mA an ESP32 pin should source or sink. Drive the LED through a transistor, or raise the resistor. Real pin current also comes in lower than this, because the output stage drops its own voltage under load, which this ideal-source model does not include.':
    "{current}, bir ESP32 pininin vermesi ya da çekmesi gereken {GPIO_MAX_MA} mA sınırının ötesinde. LED'i bir transistör üzerinden sürün ya da direnci büyütün. Gerçek pin akımı bundan da düşük çıkar, çünkü çıkış katı yük altında kendi gerilimini düşürür ve bu ideal kaynak modeli bunu içermez.",
  '{current} through {awg} AWG exceeds the bundled-wiring guidance of {ampacityBundled}. In free air on its own it may be acceptable, but inside a loom or a conduit the heat has nowhere to go. Drop three gauges to double the copper.':
    '{awg} AWG üzerinden geçen {current}, {ampacityBundled} olan demet içi kablolama önerisini aşıyor. Tek başına serbest havada kabul edilebilir olabilir, ama bir demet ya da boru içinde ısının gidecek yeri yoktur. Bakırı ikiye katlamak için üç kalınlık aşağı inin.',
  '{currentReduction}% lower': '%{currentReduction} daha düşük',
  '{degreesPerStep}° per step is coarser than the servo itself can resolve, so the controller is the limit, not the machine. Raise the LEDC resolution: at 50 Hz you can use up to {maxBits} bits at no cost.':
    "Adım başına {degreesPerStep}°, servonun kendi çözebileceğinden kaba; yani sınır makine değil denetleyicidir. LEDC çözünürlüğünü yükseltin: 50 Hz'de bedelsiz olarak {maxBits} bite kadar çıkabilirsiniz.",
  '{degreesPerStep}°/step': '{degreesPerStep}°/adım',
  '{dividerCurrent} bleed': '{dividerCurrent} akıtma',
  '{dropFraction}% of supply': 'beslemenin %{dropFraction} kadarı',
  '{efficiency} of it reaches the die': 'bunun {efficiency} kadarı yongaya ulaşır',
  '{error} against {singleError}': '{error}, tek parçanın {singleError} değerine karşı',
  '{errorPpm} ppm is a drift of {secondsPerDay} seconds a day. For a real-time clock that is far too much. Pick capacitors closer to the ideal value, or trim one of them.':
    '{errorPpm} ppm, günde {secondsPerDay} saniyelik bir kaymadır. Bir gerçek zaman saati için bu fazlasıyla çok. İdeal değere daha yakın kondansatörler seçin ya da birini ayarlanabilir yapın.',
  '{eta}% of Carnot': "Carnot'un %{eta} kadarı",
  '{frequency} is not reachable at any resolution: even 1 bit needs the clock to be at least twice the output frequency, and the LEDC source is {APB_CLOCK}.':
    '{frequency} hiçbir çözünürlükte ulaşılabilir değil: 1 bit bile saatin çıkış frekansının en az iki katı olmasını gerektirir ve LEDC kaynağı {APB_CLOCK}.',
  '{from} to {to}': '{from} - {to}',
  '{hot} over the {rating} rating. Pick a larger part or raise the branch resistance.':
    '{hot}, {rating} değerinin üzerinde. Daha büyük bir parça seçin ya da kol direncini yükseltin.',
  '{iAvgPerDiode} average per diode is over the {id} IO rating of {io}.':
    'Diyot başına {iAvgPerDiode} ortalama, {id} parçasının {io} olan IO değerinin üzerinde.',
  '{id} IO {io}': '{id} IO {io}',
  '{id} VRRM {vrrm}': '{id} VRRM {vrrm}',
  '{iout} is past the {I_OUT_MAX} guaranteed output. The internal limiter takes over near 2.2 A typical, but that is a typical, not a promise.':
    '{iout}, garantili {I_OUT_MAX} çıkışının ötesinde. İçteki sınırlayıcı tipik olarak 2,2 A civarında devreye girer, ama bu bir tipik değerdir, bir söz değil.',
  '{iout} the load, avg inductor current': '{iout} yük, ortalama bobin akımı',
  '{iPeak} is well past the {GPIO_MAX_MA} mA an ESP32 pin can sink. The transistor in the schematic is not optional, and the pin drives its base or gate only.':
    '{iPeak}, bir ESP32 pininin çekebileceği {GPIO_MAX_MA} mA sınırının epey ötesinde. Şemadaki transistör isteğe bağlı değildir ve pin yalnızca onun beyzini ya da kapısını sürer.',
  '{mode} amplifier': '{mode} yükselteç',
  '{mode} RC network': '{mode} RC devresi',
  '{mode} RL network': '{mode} RL devresi',
  '{ozCopper} oz': '{ozCopper} oz',
  '{part} wants {min} to {max} V.': '{part}, {min} - {max} V ister.',
  '{part} wants {min} to {max} V. At {vcc} the timing is not trustworthy.':
    '{part}, {min} - {max} V ister. {vcc} değerinde zamanlama güvenilir değildir.',
  '{pCollector} collector': '{pCollector} kolektör',
  '{pDiodePer} each, {topology} diodes': 'her biri {pDiodePer}, {topology} diyot',
  '{pout} out, {ploss} conduction loss': '{pout} çıkış, {ploss} iletim kaybı',
  "{pShunt} in the shunt is significant heat, and the resistor's own temperature coefficient will then shift the reading. Use a lower value with more gain, or a proper 4-wire sense resistor.":
    'Şöntteki {pShunt} kayda değer bir ısıdır ve direncin kendi sıcaklık katsayısı o zaman okumayı kaydırır. Daha düşük değerli bir şöntle daha çok kazanç kullanın ya da düzgün bir 4 telli algılama direnci kullanın.',
  '{ready} of {total} simulators built. Every one runs the real formulas in the browser and drives the same live oscilloscope.':
    '{total} simülatörün {ready} tanesi hazır. Her biri gerçek formülleri tarayıcıda çalıştırır ve aynı canlı osiloskobu sürer.',
  '{regulation}% regulation means the output sags badly under load. Small transformers are much worse than large ones here, which is why a 5 VA part marked 12 V often measures 15 V unloaded.':
    "%{regulation} regülasyon, çıkışın yük altında kötü biçimde çöktüğü anlamına gelir. Küçük trafolar burada büyüklerden çok daha kötüdür; 12 V yazan 5 VA'lık bir parçanın yüksüzken çoğu zaman 15 V ölçmesinin nedeni budur.",
  '{requestedBits} bits is impossible at {frequency}. The timer silently uses {bits} bits, which is {stepCount} steps rather than the {requestedBits2} you asked for. Calling ledcSetup with an unsupported pair does not error, it just gives you less than you expect, which is a common source of banding on dimmed LEDs.':
    "{frequency} frekansında {requestedBits} bit olanaksız. Zamanlayıcı sessizce {bits} bit kullanır, bu da istediğiniz {requestedBits2} yerine {stepCount} adım demektir. ledcSetup'ı desteklenmeyen bir çiftle çağırmak hata vermez, yalnızca beklediğinizden azını verir; kısılmış LED'lerdeki bantlaşmanın yaygın bir kaynağı budur.",
  '{rippleRatio} of Iin, aim for {RIPPLE_TARGET}':
    "Iin'in {rippleRatio} kadarı, hedef {RIPPLE_TARGET}",
  '{rippleRatio}% of average': 'ortalamanın %{rippleRatio} kadarı',
  '{ron} of series resistance caps this stage at {voutMax} into a {iout} load, so {vout} is unreachable at any duty. Past the peak, more duty means less output: the inductor spends so long disconnected from the load that the extra I²R loss beats the extra energy stored. Lower the load, use a lower DCR inductor or a better switch.':
    "{ron} seri direnç bu katı {iout} yükte {voutMax} ile sınırlıyor, bu yüzden {vout} hiçbir görev çevriminde ulaşılabilir değil. Tepeden sonra daha fazla görev çevrimi daha az çıkış demektir: bobin yükten o kadar uzun süre kopuk kalır ki fazladan I²R kaybı depolanan fazladan enerjiyi yener. Yükü azaltın, daha düşük DCR'li bir bobin ya da daha iyi bir anahtar kullanın.",
  '{rPower} in a {ratingLabel} resistor. Pick a bigger package, or split the drop across two resistors in series.':
    '{ratingLabel} bir dirençte {rPower}. Daha büyük bir kılıf seçin ya da düşümü seri iki dirence bölün.',
  '{rPullup} is outside the {rMin} to {rMax} window. Too small and devices cannot hold a valid low, too large and the edge is too slow for the clock.':
    '{rPullup}, {rMin} - {rMax} penceresinin dışında. Çok küçükse aygıtlar geçerli bir alçak seviye tutamaz, çok büyükse kenar saat için fazla yavaştır.',
  '{rthSinkNeeded} K/W or better': '{rthSinkNeeded} K/W ya da daha iyisi',
  '{runtimeDays} days': '{runtimeDays} gün',
  '{runtimeDays} years': '{runtimeDays} yıl',
  '{satPercent}% of Isat': "Isat'ın %{satPercent} kadarı",
  '{secondsPerDay} s/day': '{secondsPerDay} sn/gün',
  '{secondsPerDay} s/year': '{secondsPerDay} sn/yıl',
  '{series} mantissas: `{mantissas}`': '{series} mantisleri: `{mantissas}`',
  '{series}S{parallel}P': '{series}S{parallel}P',
  '{target} is outside the 1 Ω to 10 MΩ range searched here, so the answers above are clamped to the end of the table rather than extrapolated. Real stock does go further, but not in a form you would put in a divider.':
    '{target}, burada taranan 1 Ω - 10 MΩ aralığının dışında; bu yüzden yukarıdaki yanıtlar dışdeğerlenmek yerine tablonun ucuna sıkıştırıldı. Gerçek stok daha ileri gider ama bir bölücüye koyacağınız biçimde değil.',
  '{tj} junction against a {tjMaxC} °C limit, and Rjc + Rcs alone already spend the whole budget at {power}. No heatsink can fix this: cut the dissipation below {maxPower}, improve the mounting, or move to a package with a lower Rjc.':
    "{tjMaxC} °C sınırına karşı {tj} jonksiyon ve Rjc + Rcs tek başına {power} değerinde bütçenin tamamını harcıyor. Hiçbir soğutucu bunu düzeltemez: güç kaybını {maxPower} altına indirin, montajı iyileştirin ya da daha düşük Rjc'li bir kılıfa geçin.",
  '{tj} junction against a {tjMaxC} °C limit. Needs a sink of {requiredRsa} or better just to reach the limit, so target roughly {e} for {MARGIN_TARGET_K} K of margin, or drop the power below {maxPower}.':
    '{tjMaxC} °C sınırına karşı {tj} jonksiyon. Yalnızca sınıra ulaşmak için bile {requiredRsa} ya da daha iyi bir soğutucu gerekir; yani {MARGIN_TARGET_K} K pay için kabaca {e} hedefleyin ya da gücü {maxPower} altına düşürün.',
  '{topology} rectifier': '{topology} doğrultucu',
  '{topology} RLC network': '{topology} RLC devresi',
  '{VA} exceeds the {vaRating} VA rating. The windings will overheat, and since the rating is thermal rather than magnetic it may run for a while before failing, which is what makes it dangerous.':
    '{VA}, {vaRating} VA değerini aşıyor. Sargılar aşırı ısınacaktır ve bu değer manyetik değil ısıl olduğundan parça bozulmadan önce bir süre çalışabilir; onu tehlikeli kılan da budur.',
  '{vAdcMax} is above the {usableHigh} V where this attenuation stays linear. Readings will compress and then clip near full charge, which is exactly where you most want accuracy. Increase R1 or pick a higher attenuation.':
    "{vAdcMax}, bu zayıflatmanın doğrusal kaldığı {usableHigh} V değerinin üzerinde. Okumalar sıkışacak, sonra da tam şarja yakın kırpılacak; oysa doğruluğu en çok istediğiniz yer tam orası. R1'i büyütün ya da daha yüksek bir zayıflatma seçin.",
  '{vAdcMin} is below the {usableLow} V floor. The ESP32 ADC is badly non-linear near zero and will read a dead-flat value there.':
    "{vAdcMin}, {usableLow} V tabanının altında. ESP32 ADC'si sıfıra yakın bölgede kötü biçimde doğrusal değildir ve orada dümdüz bir değer okur.",
  '{VIH_FRAC}% of Vcc': "Vcc'nin %{VIH_FRAC} kadarı",
  '{VIL_FRAC}% of Vcc': "Vcc'nin %{VIL_FRAC} kadarı",
  '{vOut} is past the {FULL_SCALE} ADC full scale, so the reading pins at maximum and you lose the top of the range entirely. Reduce the gain or the shunt.':
    '{vOut}, {FULL_SCALE} ADC tam ölçeğinin ötesinde; bu yüzden okuma en üst değere çakılır ve aralığın tepesini tamamen yitirirsiniz. Kazancı ya da şöntü küçültün.',
  '{voutError}% off target': 'hedeften %{voutError} sapma',
  '{vRippleCap} from C, {vRippleEsr} from ESR': "{vRippleCap} C'den, {vRippleEsr} ESR'den",
  '{whPerDay} Wh/day': '{whPerDay} Wh/gün',
  '{width} mm is below the {FAB_MIN_WIDTH} mm that low-cost fabricators reliably etch. Use their minimum instead: it costs nothing and the trace will simply run cooler than required.':
    '{width} mm, düşük maliyetli üreticilerin güvenilir biçimde aşındırabildiği {FAB_MIN_WIDTH} mm değerinin altında. Bunun yerine onların en küçük değerini kullanın: hiçbir maliyeti yoktur ve yol yalnızca gerekenden daha serin çalışır.',
  '{widthMils} mil': '{widthMils} mil',
  '|Vout|': '|Vout|',
  '|Z| at frequency': 'Bu frekansta |Z|',
  '0 dB': '0 dB',
  '0 to 3V3': '0 - 3V3',
  '0 V for single supply ESP32 work.': 'Tek beslemeli ESP32 işleri için 0 V.',
  '0.25 W axial, 0.125 W for 0805.': 'Eksenel için 0,25 W, 0805 için 0,125 W.',
  '0.7 x low rail': 'alçak hattın 0,7 katı',
  '1 nF is effectively no smoothing': '1 nF neredeyse hiç düzleştirme yapmaz',
  '1/4 W (1206, axial)': '1/4 W (1206, eksenel)',
  '10-90% transition': '%10-90 geçişi',
  '11 dB': '11 dB',
  '1200 / Rprog': '1200 / Rprog',
  '1206 or axial (1/4 W)': '1206 ya da eksenel (1/4 W)',
  '125 °C for most silicon, 150 to 175 °C for power MOSFETs.':
    "Çoğu silisyum için 125 °C, güç MOSFET'leri için 150 - 175 °C.",
  '1N4007 1 A silicon': '1N4007 1 A silisyum',
  '1N4148 signal': '1N4148 işaret',
  '1N5408 3 A silicon': '1N5408 3 A silisyum',
  '1N5819 Schottky': '1N5819 Schottky',
  '2.5 dB': '2,5 dB',
  '240 Ω is standard: {V_REF} keeps the part in regulation unloaded.':
    '240 Ω standarttır: {V_REF} parçayı yüksüzken regülasyonda tutar.',
  '25% headroom': '%25 pay',
  '298 K is 25 C. Still air inside a sealed box runs 10 to 20 K hotter.':
    '298 K, 25 C demektir. Kapalı bir kutu içindeki durgun hava 10 - 20 K daha sıcak çalışır.',
  '3.3 V is the ESP32 rail.': '3,3 V, ESP32 hattıdır.',
  '3V3 by default. Most relay coils are 5 V or 12 V parts.':
    'Öntanımlı 3V3. Çoğu röle bobini 5 V ya da 12 V parçadır.',
  '4 band': '4 bant',
  '4-switch': '4 anahtarlı',
  '5 band': '5 bant',
  '5 tau': '5 tau',
  '5/8 wave': '5/8 dalga',
  '555 Timer': '555 Zamanlayıcı',
  '6 dB': '6 dB',
  'A {riseK} K rise is aggressive. FR-4 is fine thermally but the trace is heating everything near it, including components whose ratings assume ambient. Most designs allow 10 to 20 K.':
    "{riseK} K'lik bir artış iddialıdır. FR-4 ısıl olarak sorunsuzdur ama yol, değerleri ortam sıcaklığını varsayan bileşenler dahil yakınındaki her şeyi ısıtır. Çoğu tasarım 10 - 20 K'ye izin verir.",
  'a {rthSinkNeeded} K/W sink': '{rthSinkNeeded} K/W bir soğutucu',
  'A bare TP4056 board has no protection. The version with the DW01 and dual MOSFET adds over-discharge, over-current and short-circuit protection, and lithium cells should not be used without it. Neither version does cell balancing, so neither is suitable for a multi-cell series pack.':
    "Çıplak bir TP4056 kartında hiçbir koruma yoktur. DW01 ve ikili MOSFET'li sürüm aşırı deşarj, aşırı akım ve kısa devre koruması ekler ve lityum hücreler bu olmadan kullanılmamalıdır. İki sürüm de hücre dengeleme yapmaz, yani hiçbiri çok hücreli seri paket için uygun değildir.",
  "A battery above the usable top needs a divider, `Vadc = Vbat·R2/(R1+R2)`. Dividing by two costs you half the resolution referred to the battery: each count is then worth `2·Vlsb`. That is usually fine, since a LiPo's whole useful range is 1.2 V and even halved that is over 600 counts.":
    "Kullanılabilir tepenin üstündeki bir pil bölücü ister, `Vadc = Vpil·R2/(R1+R2)`. İkiye bölmek, pile indirgenmiş çözünürlüğün yarısına mal olur: her adım o zaman `2·Vlsb` değerindedir. Bu genellikle sorun değildir, çünkü bir LiPo'nun tüm kullanışlı aralığı 1,2 V'tur ve yarılanmış hâliyle bile bu 600 adımın üzerindedir.",
  'A battery node lives or dies on its average current, not its peak. The scope shows the current profile over one wake/sleep cycle against the resulting average, on a linear time axis.':
    'Bataryayla çalışan bir düğüm tepe akımına değil ortalama akımına göre yaşar ya da ölür. Osiloskop, doğrusal zaman ekseninde bir uyanma/uyku çevrimi boyunca akım profilini ortaya çıkan ortalamayla birlikte gösterir.',
  'A compensated op-amp holds gain times bandwidth constant, so the closed-loop corner is `BW = GBW / noise gain`. Noise gain is `1 + Rf/Rg` for both topologies, which is why an inverting stage of -10 and a non-inverting stage of +11 have exactly the same bandwidth even though their signal gains differ.':
    "Dengelenmiş bir işlemsel yükselteç kazanç ile bant genişliğinin çarpımını sabit tutar, yani kapalı çevrim köşesi `BW = GBW / gürültü kazancı` olur. Gürültü kazancı iki topolojide de `1 + Rf/Rg`'dir; -10 kazançlı eviren bir katla +11 kazançlı evirmeyen bir katın işaret kazançları farklı olmasına karşın bant genişliklerinin tam olarak aynı olmasının nedeni budur.",
  'A converter that works whether the input is above or below the output, which is exactly the ESP32-on-a-LiPo problem: a cell runs 4.2 V down to 3.0 V while the rail must hold 3.3 V. The scope shows inductor, switch and rectifier current over a few switching periods.':
    'Giriş çıkışın üstünde de altında da olsa çalışan bir dönüştürücü; bu tam olarak LiPo üzerindeki ESP32 problemidir: hücre 4.2 Vtan 3.0 Va inerken hat 3.3 Vu tutmalıdır. Osiloskop birkaç anahtarlama periyodu boyunca bobin, anahtar ve doğrultucu akımını gösterir.',
  'A COP of 3 means a kWh of heat costs a third of the tariff, so the saving against a resistive heater is `1 - 1/COP`. That is the number that decides whether the machine pays back, and it collapses on the coldest days precisely when demand peaks, which is why the seasonal figure matters more than the headline one.':
    "COP'un 3 olması, bir kWh ısının tarifenin üçte birine mal olduğu anlamına gelir, yani dirençli bir ısıtıcıya göre tasarruf `1 - 1/COP` olur. Makinenin kendini amorti edip etmediğine karar veren sayı budur ve tam da talebin tepe yaptığı en soğuk günlerde çöker; sezonluk değerin manşet değerden daha önemli olmasının nedeni budur.",
  'A crystal is cut to hit its marked frequency only when it sees a specific capacitance. Get the load capacitors wrong and it still oscillates, just at the wrong frequency, which is why a clock that drifts is usually a capacitor problem rather than a crystal fault.':
    'Bir kristal, ancak belirli bir kapasiteyi gördüğünde üzerinde yazan frekansı tutturacak şekilde kesilir. Yük kondansatörlerini yanlış seçerseniz yine salınır, sadece yanlış frekansta; kayan bir saatin genelde kristal arızası değil kondansatör sorunu olmasının nedeni budur.',
  'a different topology': 'farklı bir topoloji',
  'A divider only shifts high to low. It cannot drive the high side from the low side, so it is useless for anything bidirectional such as I2C, and it wastes current continuously whenever the line is high.':
    'Bölücü yalnızca yüksekten alçağa çevirir. Üst tarafı alt taraftan süremez, yani I2C gibi çift yönlü hiçbir iş için kullanılamaz ve hat yüksek olduğu sürece sürekli akım harcar.',
  'A flyback diode across the coil gives the current a loop to run in. The switch node is then held at `Vsupply + Vf`, i.e. under a volt above the rail. The current freewheels down against the diode drop, `i(t) = (I + Vf/R)·e^(-t·R/L) - Vf/R`, reaching zero at `t = (L/R)·ln(1 + I·R/Vf)`. That is the catch: the clamp is why a relay with a plain diode drops out slowly. A Schottky clamps lower, a zener or a resistor in series with the diode releases faster at the cost of a higher switch voltage.':
    'Bobine paralel bir geri tepme diyodu akıma dolaşacağı bir çevrim verir. Anahtar düğümü o zaman `Vbesleme + Vf` değerinde, yani hattın bir voltun altında üstünde tutulur. Akım diyot düşümüne karşı serbestçe söner, `i(t) = (I + Vf/R)·e^(-t·R/L) - Vf/R`, ve `t = (L/R)·ln(1 + I·R/Vf)` anında sıfıra ulaşır. İşin püf noktası şu: sade diyotlu bir rölenin yavaş bırakmasının nedeni bu kırpıcıdır. Schottky daha alçak kırpar; zener ya da diyotla seri bir direnç, daha yüksek anahtar gerilimi karşılığında daha hızlı bırakır.',
  'A heat pump moves heat rather than making it, so it can deliver several kilowatts of heat per kilowatt of electricity. The ceiling is Carnot, set purely by the temperature lift.':
    'Bir ısı pompası ısı üretmez, taşır; bu yüzden kilovat elektrik başına birkaç kilovat ısı verebilir. Tavan değeri, tamamen sıcaklık farkının belirlediği Carnot sınırıdır.',
  'A hobby servo reads the width of a pulse, not its duty, and ignores the rest of the 20 ms frame. That makes duty resolution the limiting factor: only 5 to 10% of the register range does anything at all. The scope shows the signal pin over a couple of frames.':
    'Bir hobi servosu görev oranını değil darbenin genişliğini okur ve 20 mslik çerçevenin geri kalanını yok sayar. Bu da görev oranı çözünürlüğünü sınırlayıcı etken yapar: yazmaç aralığının yalnızca %5 ila %10u bir işe yarar. Osiloskop sinyal ucunu birkaç çerçeve boyunca gösterir.',
  'A kelvin and a degree Celsius are the same size, so every resistance, rise and margin on this page is identical in either scale. Only the absolute temperatures differ.':
    'Bir kelvin ile bir santigrat derece aynı büyüklüktedir, yani bu sayfadaki her direnç, artış ve pay iki ölçekte de aynıdır. Yalnızca mutlak sıcaklıklar farklıdır.',
  'A lift over about 55 K is outside what most domestic refrigerants manage. Real machines cut out or fall back to a resistive heater here, so treat this COP as optimistic.':
    "Yaklaşık 55 K üzerindeki bir yükseltme, çoğu evsel soğutucu akışkanın başarabileceğinin dışındadır. Gerçek makineler burada devreden çıkar ya da dirençli bir ısıtıcıya geçer, bu yüzden bu COP'u iyimser kabul edin.",
  'A linear regulator throws the whole voltage difference away as heat: `P = (Vin - Vout)·Iout + Vin·Iq`. Dropping 5 V to 3.3 V at 500 mA burns 0.85 W, which is why a bare SOT-223 AMS1117 runs hot on an ESP32 board and a switching regulator does not.':
    "Doğrusal bir regülatör gerilim farkının tamamını ısı olarak atar: `P = (Vin - Vout)·Iout + Vin·Iq`. 500 mA'de 5 V'u 3,3 V'a düşürmek 0,85 W yakar; çıplak bir SOT-223 AMS1117'nin ESP32 kartında ısınmasının, anahtarlamalı bir regülatörün ısınmamasının nedeni budur.",
  'A logic level N-channel MOSFET switching a load from an ESP32 GPIO. The scope shows gate and drain voltage over one or more PWM cycles, horizontal axis is time. Readouts below are the operating point, the loss split and the junction temperature.':
    'Bir ESP32 GPIO ucundan yük anahtarlayan lojik seviyeli N kanal MOSFET. Osiloskop, bir veya daha fazla PWM çevrimi boyunca geyt ve drain gerilimini gösterir, yatay eksen zamandır. Aşağıdaki göstergeler çalışma noktası, kayıp dağılımı ve jonksiyon sıcaklığıdır.',
  "A mechanical contact does not close once, it chatters for a few milliseconds. The scope shows the raw contact against the RC-filtered node and the input's logic-high threshold: the filter must ride over the whole burst without crossing back.":
    'Mekanik bir kontak bir kez kapanmaz, birkaç milisaniye boyunca zıplar. Osiloskop ham kontağı, RC ile filtrelenmiş düğümü ve girişin lojik yüksek eşiğini birlikte gösterir: filtre, geri dönmeden tüm zıplama boyunca dayanmalıdır.',
  'A preferred series splits each decade into N logarithmic steps, so `value = 10^(k/N)` for `k = 0..N-1`, rounded to two significant figures for E6, E12 and E24 and three for E48 and E96. Each step is a fixed ratio of `10^(1/N)`, which is why the same mantissas repeat from ohms to megohms. Error against a target is `(Rstd - Rtarget) / Rtarget`.':
    'Yeğlenen bir seri her dekatı N logaritmik adıma böler, yani `k = 0..N-1` için `değer = 10^(k/N)` olur; E6, E12 ve E24 için iki, E48 ve E96 için üç anlamlı basamağa yuvarlanır. Her adım sabit bir `10^(1/N)` oranıdır; aynı mantislerin ohmdan megaohma yinelenmesinin nedeni budur. Hedefe göre hata `(Rstd - Rhedef) / Rhedef` ile bulunur.',
  'A quarter-wave whip is only half an antenna. The other half is the ground plane, and without one the coax braid radiates instead, which detunes everything and makes performance depend on how you hold the board. Either give it radials, use a proper ground pour, or fit a half-wave dipole which needs no ground plane.':
    'Çeyrek dalga bir anten yalnızca yarım antendir. Diğer yarısı toprak düzlemidir ve o olmadan koaksiyel örgü ışıma yapar; bu da her şeyin akordunu bozar ve başarımı kartı nasıl tuttuğunuza bağlı hale getirir. Ya radyal teller ekleyin, ya düzgün bir toprak dökümü kullanın, ya da toprak düzlemi gerektirmeyen yarım dalga bir dipol takın.',
  'A relay or solenoid coil switched by a low-side transistor. The scope plots coil current against time across the switching cycle. Watch the ramp fill the core, then watch what the coil does to the transistor when the switch opens.':
    'Alçak taraf transistörüyle anahtarlanan bir röle veya solenoid bobini. Osiloskop, anahtarlama çevrimi boyunca bobin akımını zamana karşı çizer. Rampanın çekirdeği doldurmasını, sonra anahtar açıldığında bobinin transistöre ne yaptığını izleyin.',
  'A resistor and a capacitor: the most common filter in electronics. Adjust anything and the scope updates immediately.':
    'Bir direnç ve bir kondansatör: elektronikteki en yaygın filtre. Herhangi bir değeri değiştirin, osiloskop anında güncellenir.',
  'A resistor divider is fine for one-way signals into a 3.3 V input, and nothing else. It is unidirectional, it loads the driver continuously, and its own RC is set by the parallel combination of the two resistors, so making it low-current makes it slow.':
    "Direnç bölücü, 3,3 V'luk bir girişe giden tek yönlü işaretler için uygundur, başka hiçbir şey için değil. Tek yönlüdür, sürücüyü sürekli yükler ve kendi RC'sini iki direncin paralel bileşimi belirler, yani düşük akımlı yapmak onu yavaşlatır.",
  "A shunt turns current into voltage by Ohm's law, `Vshunt = I·R`. That voltage is subtracted from the supply reaching the load, which is the burden. Keep it under a percent or two of the rail, so a 5 V supply wants a burden well under 50 mV.":
    "Bir şönt, Ohm yasasıyla akımı gerilime çevirir, `Vşönt = I·R`. Bu gerilim yüke ulaşan beslemeden düşülür; yük payı budur. Hattın yüzde bir ikisinin altında tutun, yani 5 V'luk bir besleme 50 mV'un epey altında bir yük payı ister.",
  'A tap sits outside 0 to {ADC_FULL_SCALE}, the ESP32 ADC input range. Lower the excitation or divide the taps down before the pin.':
    'Bir orta uç, ESP32 ADC giriş aralığı olan 0 - {ADC_FULL_SCALE} dışında kalıyor. Uyartımı düşürün ya da orta uçları pinden önce bölücüyle küçültün.',
  'A thermistor is not linear, and that is the whole design problem. The scope sweeps divider output against TEMPERATURE, not time: the horizontal axis runs from the low to the high limit you set, in °C.':
    'Termistör doğrusal değildir ve tasarım probleminin tamamı budur. Osiloskop bölücü çıkışını zamana değil SICAKLIĞA karşı tarar: yatay eksen, belirlediğiniz alt sınırdan üst sınıra °C cinsinde gider.',
  'Above about 150 mA you are almost certainly transmitting. WiFi association costs far more energy than the transmission itself, so batching several readings into one wake is usually a bigger win than making each wake shorter.':
    "Yaklaşık 150 mA'in üzerinde neredeyse kesinlikle verici çalışıyordur. WiFi'ye bağlanmak iletimin kendisinden çok daha fazla enerji harcar, bu yüzden birkaç ölçümü tek uyanışta toplamak, her uyanışı kısaltmaktan genellikle daha çok kazandırır.",
  'Above about 60 Hz you are outside what an analogue servo expects. Many digital servos accept 200 to 333 Hz and respond faster, but an analogue one may buzz, overheat or simply ignore the extra frames. Check the specification before pushing the frame rate.':
    "Yaklaşık 60 Hz'in üzerinde, analog bir servonun beklediğinin dışındasınız. Birçok sayısal servo 200 - 333 Hz kabul eder ve daha hızlı yanıt verir, ama analog olanı vızıldayabilir, aşırı ısınabilir ya da fazladan çerçeveleri büsbütün yok sayabilir. Çerçeve hızını yükseltmeden önce belirtimi denetleyin.",
  'Above the {VIN_MAX} V absolute maximum. This destroys the part.':
    "Mutlak en büyük değer olan {VIN_MAX} V'un üzerinde. Bu, parçayı yok eder.",
  'above the supply rail': 'besleme hattının üzerine',
  'Absolute error': 'Mutlak hata',
  'Absolute max If': 'Mutlak en büyük If',
  'AC & Power Quality': 'AC ve Güç Kalitesi',
  'AC Impedance': 'AC Empedans',
  'across the internal 0.1 Ω': 'içteki 0,1 Ω üzerinde',
  'active': 'aktif',
  'Active current': 'Etkin akım',
  'active region': 'aktif bölge',
  'Active time': 'Etkin süre',
  'Actual angle': 'Gerçek açı',
  'Actual current': 'Gerçek akım',
  'Actual duty': 'Gerçek görev çevrimi',
  'Actual pulse': 'Gerçek darbe',
  'Actual Vout': 'Gerçek Vout',
  'ADC at empty battery': 'Pil boşken ADC',
  'ADC at full battery': 'Pil doluyken ADC',
  'ADC counts per K': 'K başına ADC adımı',
  'ADC range used': 'Kullanılan ADC aralığı',
  'Add harmonics to build square, triangle and distorted waveforms. THD readout.':
    'Kare, üçgen ve bozulmuş dalga şekilleri oluşturmak için harmonik ekleyin. THD göstergesi.',
  'Add up to ten sine waves, each an integer multiple of one fundamental, and watch the sum take shape. Horizontal axis is time.':
    'Her biri tek bir temel bileşenin tam katı olan on adede kadar sinüs dalgası ekleyin ve toplamın şekil almasını izleyin. Yatay eksen zamandır.',
  'Addressable LED strips for lighting, signage and displays. The current is far higher than people expect, around 60 mA per pixel at full white, and the far end of a long strip browns out and shifts colour before the supply gives up. It also flags the 3.3 V data problem, which is why these strips work intermittently with an ESP32.':
    'Aydınlatma, tabela ve ekranlar için adreslenebilir LED şeritler. Akım insanların beklediğinden çok yüksektir, tam beyazda piksel başına yaklaşık 60 mA, ve uzun bir şeridin uzak ucu besleme pes etmeden önce kararır ve renk kaydırır. Ayrıca 3.3 V veri sorununu da işaret eder; bu şeritlerin ESP32 ile aralıklı çalışmasının nedeni budur.',
  'Addressable strips draw far more than people expect and the far end browns out long before the supply gives up. WS2812s are 5 V parts, which also puts their data line at odds with a 3.3 V ESP32.':
    'Adreslenebilir şeritler insanların beklediğinden çok daha fazla akım çeker ve uzak uç, besleme pes etmeden çok önce kararır. WS2812 parçaları 5 Vtur, bu da veri hattını 3.3 V bir ESP32 ile uyumsuz hâle getirir.',
  'Adjust pin term': 'Ayar pini terimi',
  'After correction': 'Düzeltmeden sonra',
  'All simulators': 'Tüm simülatörler',
  'all white, full brightness': 'hepsi beyaz, tam parlaklık',
  'Allowed temp rise': 'İzin verilen sıcaklık artışı',
  'Alloy': 'Alaşım',
  'Amber / yellow': 'Kehribar / sarı',
  'Ambient': 'Ortam',
  'amp': 'yükselteç',
  'Ampacity here is rule-of-thumb guidance, roughly 7.5 A/mm² for a single chassis run in free air and 3.5 A/mm² bundled. Real installations are governed by wiring regulations that account for insulation rating, grouping and ambient temperature. Use this to choose a starting point, not to certify an installation.':
    'Buradaki akım taşıma kapasitesi kabaca bir el kuralıdır: serbest havada tek bir şase hattı için yaklaşık 7,5 A/mm², demet içinde 3,5 A/mm². Gerçek tesisatlar; yalıtım sınıfını, gruplamayı ve ortam sıcaklığını hesaba katan kablolama yönetmeliklerine tabidir. Bunu bir başlangıç noktası seçmek için kullanın, bir tesisatı belgelendirmek için değil.',
  'Ampacity, bundled': 'Akım kapasitesi, demet içi',
  'Ampacity, chassis': 'Akım kapasitesi, şase',
  'Amplifier': 'Yükselteç',
  'Amplifier gain': 'Yükselteç kazancı',
  'Amplifying a sensor signal into an ADC range, buffering a high-impedance source, summing and differencing, integrating, and comparing with hysteresis. Also for finding out why a circuit that works at DC misbehaves at speed: the gain-bandwidth limit and slew rate are what turn a textbook design into a distorted one.':
    'Sensör sinyalini ADC aralığına yükseltmek, yüksek empedanslı bir kaynağı tamponlamak, toplama ve fark alma, integral alma ve histerezisli karşılaştırma. Ayrıca DC çalışan bir devrenin hızda neden bozulduğunu bulmak için: kazanç-bant genişliği sınırı ve yükselme hızı, kitaptaki tasarımı bozulmuş bir tasarıma çeviren şeylerdir.',
  'Amplitude (peak)': 'Genlik (tepe)',
  'An ESP32 GPIO toggling into an RC network, i.e. a one-bit DAC. Horizontal axis is time: the ripple view frames a few switching periods, the startup view frames the full 5 tau charging curve. Hide Vpwm on the scope to see the ripple at its own scale.':
    'Bir RC ağına anahtarlanan ESP32 GPIO ucu, yani tek bitlik bir DAC. Yatay eksen zamandır: dalgalanma görünümü birkaç anahtarlama periyodunu, başlangıç görünümü tam 5 tau şarj eğrisini çerçeveler. Dalgalanmayı kendi ölçeğinde görmek için osiloskopta Vpwm izini gizleyin.',
  'An ideal current source holds {total} into any load, so the node sits at {voltage}. A real 3V3 supply cannot go there: switch to rail plus Rs to see what the circuit actually does.':
    'İdeal bir akım kaynağı her yüke {total} verir, bu yüzden düğüm {voltage} değerinde kalır. Gerçek bir 3V3 besleme oraya çıkamaz: devrenin gerçekte ne yaptığını görmek için hat artı Rs kipine geçin.',
  'An inductor opposes a change in current the way a capacitor opposes a change in voltage, so the whole RC page maps across: `tau = L / R` instead of `R·C`, and `fc = R / (2·pi·L)` instead of `1 / (2·pi·R·C)`. Reactance runs the other way, `XL = 2·pi·f·L` rises with frequency while `Xc` falls, which is why the output across the resistor is the low pass here and the high pass there.':
    'Bir bobin, kondansatörün gerilim değişimine karşı koyduğu gibi akım değişimine karşı koyar; bu yüzden tüm RC sayfası buraya eşlenir: `R·C` yerine `tau = L / R`, `1 / (2·pi·R·C)` yerine `fc = R / (2·pi·L)`. Reaktans ters yönde işler, `XL = 2·pi·f·L` frekansla yükselirken `Xc` düşer; direnç üzerindeki çıkışın burada alçak geçiren, orada yüksek geçiren olmasının nedeni budur.',
  "An RC low pass has unity gain at DC and the rectangle's average is `D·Vs`, so the settled output is `Vout = D·Vs` no matter what R and C are. R and C only decide how much of the switching gets through.":
    "Bir RC alçak geçiren DC'de birim kazançlıdır ve dikdörtgenin ortalaması `D·Vs` olduğundan, oturmuş çıkış R ve C ne olursa olsun `Vout = D·Vs` olur. R ve C yalnızca anahtarlamanın ne kadarının geçeceğine karar verir.",
  'Angle': 'Açı',
  'Angle to pulse width to duty ticks at a chosen timer resolution.':
    'Seçilen zamanlayıcı çözünürlüğünde açıdan darbe genişliğine ve görev sayacına.',
  'Angular resolution': 'Açısal çözünürlük',
  'Antenna Length': 'Anten Uzunluğu',
  'Any battery powered ESP32 node: sensors reporting to a server, trackers, remote monitors. Average current is the only figure that determines battery life, and this shows why the sleep current usually matters far more than the wake time. It is also how you discover that a permanently connected divider or a leaky regulator is what is really draining the pack.':
    'Bataryayla çalışan her ESP32 düğümü: sunucuya rapor veren sensörler, takip cihazları, uzak izleyiciler. Batarya ömrünü belirleyen tek değer ortalama akımdır ve bu sayfa uyku akımının neden genellikle uyanma süresinden çok daha önemli olduğunu gösterir. Ayrıca paketi gerçekte tüketen şeyin sürekli bağlı bir bölücü veya kaçaklı bir regülatör olduğunu böyle keşfedersiniz.',
  'Any mains or transformer-derived supply, and the front end of most non-USB power adapters. It tells you the ripple your smoothing capacitor leaves, which sets whether the regulator after it stays out of dropout, and the peak inverse voltage the diodes must survive.':
    'Şebekeden veya transformatörden türetilen her besleme ve USB olmayan çoğu adaptörün ön katı. Filtre kondansatörünüzün bıraktığı dalgalanmayı söyler; bu da ardındaki regülatörün düşme bölgesine girip girmeyeceğini belirler, ayrıca diyotların dayanması gereken ters tepe gerilimini verir.',
  'Any mechanical button, switch or relay contact read by a microcontroller. Contacts chatter for milliseconds on every press, so a naive read counts one press as several. This sizes the filter to ride over the bounce without becoming so slow it drops real presses.':
    'Bir mikrodenetleyici tarafından okunan her mekanik buton, anahtar veya röle kontağı. Kontaklar her basışta milisaniyelerce zıplar, bu yüzden naif bir okuma tek basışı birkaç kez sayar. Bu sayfa filtreyi, sıçramayı aşacak kadar yavaş ama gerçek basışları kaçıracak kadar yavaş olmayacak şekilde boyutlandırır.',
  'Any part that dissipates real power: regulators, MOSFETs, motor drivers, LED arrays. It answers the only question that matters, whether the junction stays under its limit at the worst-case ambient, and works backwards to the heatsink you need if it does not.':
    'Gerçek güç harcayan her parça: regülatörler, MOSFETler, motor sürücüleri, LED dizileri. Önemli olan tek soruyu yanıtlar, yani jonksiyonun en kötü ortam sıcaklığında sınırının altında kalıp kalmadığını, ve kalmıyorsa ihtiyacınız olan soğutucuya geri doğru çalışır.',
  'Apparent power': 'Görünür güç',
  'Apparent power S': 'Görünür güç S',
  'Arms': 'Kollar',
  'as requested': 'istendiği gibi',
  'asked {angle}°': 'istenen {angle}°',
  'asked {duty}%': 'istenen %{duty}',
  'Asleep': 'Uykuda',
  'astable': 'astable',
  'Astable': 'Astable',
  'Astable and monostable timing, duty cycle and the resulting waveform.':
    'Astable ve monostable zamanlama, görev oranı ve ortaya çıkan dalga şekli.',
  'at {frequency}': '{frequency} değerinde',
  'at {fRipple}': '{fRipple} değerinde',
  'At {maxRate} the filter cannot follow {pressRate} presses per second. Real presses will be merged or missed entirely.':
    '{maxRate} hızında süzgeç saniyede {pressRate} basışı izleyemez. Gerçek basışlar birleşecek ya da tümüyle kaçırılacaktır.',
  'at {supply}': '{supply} değerinde',
  'at {tempC} °C': "{tempC} °C'de",
  'At 2.4 GHz a quarter wave is about 31 mm, which is why chip and meander antennas are practical there and why an 868 MHz node needs a visibly long whip at about 86 mm. Getting the length wrong by 10% shifts resonance well outside a narrow band and can easily cost 10 dB, which is a factor of three in range.':
    "2,4 GHz'de çeyrek dalga yaklaşık 31 mm'dir; yonga ve kıvrımlı antenlerin orada uygulanabilir olmasının, 868 MHz'lik bir düğümün ise gözle görülür biçimde uzun, 86 mm civarı bir çubuğa ihtiyaç duymasının nedeni budur. Uzunluğu %10 yanlış tutmak rezonansı dar bir bandın epey dışına kaydırır ve kolaylıkla 10 dB'ye mal olur; bu da menzilde üç kat demektir.",
  'at 20 °C': "20 °C'de",
  "At 50 Hz the LEDC timer allows up to 20 bits, so there is no reason to be stingy: use 16 bits and you get thousands of counts over the travel, well past what the servo's own potentiometer and gearbox can resolve.":
    "50 Hz'de LEDC zamanlayıcısı 20 bite kadar izin verir, yani cimri olmanın anlamı yok: 16 bit kullanın, hareket boyunca binlerce adım elde edersiniz ve bu, servonun kendi potansiyometresi ile dişli kutusunun çözebileceğinin epey ötesindedir.",
  'at equilibrium': 'dengede',
  'At full white, {ledCount} LEDs need {peakCurrent}. This is why a 5 metre 60/m strip is a genuinely serious load, around 18 A, and why almost nobody actually runs one at full white. Brightness scales the current linearly, so a strip limited to 25% is a far more practical proposition.':
    "Tam beyazda {ledCount} LED {peakCurrent} ister. 5 metrelik 60/m bir şeridin gerçekten ciddi bir yük, yaklaşık 18 A olmasının ve neredeyse hiç kimsenin bir şeridi tam beyazda çalıştırmamasının nedeni budur. Parlaklık akımı doğrusal ölçekler, yani %25'le sınırlanmış bir şerit çok daha uygulanabilir bir öneridir.",
  'at service temp': 'servis sıcaklığında',
  'At the drive frequency the winding also presents `XL = 2·pi·f·L`, so the coil impedance is `|Z| = sqrt(R² + XL²)`. That is what limits current once you PWM the coil rather than switching it once.':
    'Sürüş frekansında sargı ayrıca `XL = 2·pi·f·L` gösterir, yani bobin empedansı `|Z| = sqrt(R² + XL²)` olur. Bobini bir kez anahtarlamak yerine PWM ile sürdüğünüzde akımı sınırlayan budur.',
  'at this load, with {ron} in series': 'bu yükte, seride {ron} ile',
  'at this shunt': 'bu şöntte',
  'Attenuation': 'Zayıflatma',
  'Attenuation at f_pwm': "f_pwm'de zayıflatma",
  'Attenuation ranges, divider design for battery sensing, effective resolution.':
    'Zayıflatma aralıkları, batarya ölçümü için bölücü tasarımı, etkin çözünürlük.',
  'Autonomy': 'Özerklik',
  'Average current': 'Ortalama akım',
  'Average current from a duty-cycled wake profile, and months of runtime.':
    'Görev çevrimli uyanma profilinden ortalama akım ve aylarca çalışma süresi.',
  'Average current is the time-weighted mean over one cycle, `Iavg = (Ion·ton + Isleep·tsleep) / (ton + tsleep)`. Runtime is then the usable capacity divided by that. Nothing else matters: the peak current only affects whether the supply can deliver it, not how long the pack lasts.':
    'Ortalama akım, bir çevrim boyunca zamanla ağırlıklı ortalamadır: `Iort = (Ion·ton + Iuyku·tuyku) / (ton + tuyku)`. Çalışma süresi de kullanılabilir kapasitenin buna bölümüdür. Başka hiçbir şey önemli değildir: tepe akım yalnızca beslemenin onu verip veremeyeceğini etkiler, paketin ne kadar dayanacağını değil.',
  'Average per diode': 'Diyot başına ortalama',
  'Awake': 'Uyanık',
  'awg': 'awg',
  'AWG': 'AWG',
  'AWG to diameter and resistance, ampacity and voltage drop over a run.':
    'AWG değerinden çap ve dirence, akım taşıma kapasitesi ve hat boyunca gerilim düşümü.',
  'Axial (1/2 W)': 'Eksenel (1/2 W)',
  'Back to the catalogue': 'Katalog sayfasına dön',
  'Balance': 'Denge',
  'Band': 'Bant',
  'Band preset': 'Bant ön ayarı',
  'Bands': 'Bantlar',
  'Bandwidth': 'Bant genişliği',
  'Bandwidth is a small-signal figure. Large signals hit the slew rate instead: a sine of peak Vp needs `2·pi·f·Vp` volts per second, so the largest undistorted sine is the full power bandwidth `SR / (2·pi·Vp)`. Past it the output turns into a triangle no matter what the gain plot says.':
    'Bant genişliği küçük işaret değeridir. Büyük işaretler bunun yerine yönelim hızına çarpar: tepe değeri Vp olan bir sinüs saniyede `2·pi·f·Vp` volt ister, yani bozulmasız en büyük sinüs, tam güç bant genişliği `SR / (2·pi·Vp)` olur. Bunun ötesinde kazanç grafiği ne derse desin çıkış üçgene döner.',
  'Bank': 'Grup',
  'Bank capacitance': 'Grup kapasitansı',
  'Bank reactance': 'Grup reaktansı',
  'Bank topology': 'Grup topolojisi',
  'Bank voltage rating': 'Grup gerilim değeri',
  'Bare wire, 0.95': 'Çıplak tel, 0,95',
  'Base current IB': 'Beyz akımı IB',
  'Base current is {ib}, past the {GPIO_MAX_MA} mA an ESP32 pin will source. Raise RB or drive the base from a buffer.':
    "Beyz akımı {ib}; bu, bir ESP32 pininin verebileceği {GPIO_MAX_MA} mA sınırının üzerinde. RB'yi büyütün ya da beyzi bir tampon üzerinden sürün.",
  'Base drive': 'Beyz sürüşü',
  'Base drive for hard saturation, overdrive factor, plus common-emitter bias.':
    'Tam doyum için beyz sürüşü, aşırı sürme katsayısı ve ortak emetör kutuplaması.',
  'Base resistor RB': 'Beyz direnci RB',
  'Battery': 'Batarya',
  'Battery monitoring, motor current limiting, power measurement, and overcurrent protection. The design is a three-way compromise between burden voltage, shunt dissipation and resolution, and this shows why a dedicated current-sense amplifier with a small shunt beats a large shunt read directly.':
    'Batarya izleme, motor akım sınırlama, güç ölçümü ve aşırı akım koruması. Tasarım, yük gerilimi, şönt güç kaybı ve çözünürlük arasında üç yönlü bir uzlaşmadır ve bu sayfa, küçük şöntlü özel bir akım ölçüm yükseltecinin doğrudan okunan büyük bir şöntü neden yendiğini gösterir.',
  'Battery needed': 'Gereken pil',
  'Battery Simulator': 'Batarya Simülatörü',
  'Battery sizing is the opposite question: not the average day but the worst run of bad ones. `Cbat = Wh_day · days / DoD`. Depth of discharge matters enormously for cycle life: taking a lithium cell to 50% rather than 90% can multiply its usable cycles several times over, so the bigger battery often outlives the saving.':
    "Pil boyutlandırması bunun tersi bir sorudur: ortalama gün değil, kötü günlerin en kötü serisi. `Cpil = Wh_gün · gün / DoD`. Deşarj derinliği çevrim ömrü için son derece önemlidir: bir lityum hücreyi %90 yerine %50'ye kadar boşaltmak kullanılabilir çevrim sayısını birkaç katına çıkarabilir, yani daha büyük pil çoğu zaman tasarruftan uzun yaşar.",
  'Because it is a linear charger, the input to cell voltage difference all becomes heat: `P = (Vin - Vcell)·I`. At 1 A from 5 V into a 3.0 V empty cell that is 2 W in a SOP-8, which is why these boards get hot and throttle. Feeding them from anything above 5 V makes it markedly worse.':
    "Doğrusal bir şarj devresi olduğundan giriş ile hücre gerilimi arasındaki farkın tamamı ısıya dönüşür: `P = (Vin - Vhücre)·I`. 5 V'tan 1 A ile 3,0 V'luk boş bir hücreye bu, bir SOP-8 içinde 2 W eder; bu kartların ısınıp kendini kısmasının nedeni budur. Onları 5 V'un üzerinde herhangi bir şeyden beslemek durumu belirgin biçimde kötüleştirir.",
  'before shortening': 'kısaltmadan önce',
  'below 0 V': "0 V'un altına",
  'below 0 V and above the supply rail': "0 V'un altına ve besleme hattının üzerine",
  'Below 100 W/m² the single diode model gets optimistic. Real panels lose fill factor faster than this in low light because the shunt path dominates.':
    '100 W/m² altında tek diyot modeli iyimserleşir. Gerçek paneller az ışıkta doluluk çarpanını bundan daha hızlı yitirir, çünkü paralel kaçak yolu baskın hale gelir.',
  'Below dropout: {headroom} of headroom where the LM317 needs {DROPOUT_V}. The pass element is saturated, so the output follows the input down and every figure above is meaningless. Raise Vin above {vinMin} or drop the target.':
    "Düşüm sınırının altında: LM317 {DROPOUT_V} isterken elde {headroom} pay var. Geçiş elemanı doyumdadır, yani çıkış girişi aşağı doğru izler ve yukarıdaki her değer anlamsızdır. Vin'i {vinMin} üzerine çıkarın ya da hedefi düşürün.",
  'Below the {VIN_MIN} V datasheet minimum. The internal reference is not guaranteed here.':
    "Veri sayfasının en küçük değeri olan {VIN_MIN} V'un altında. İçteki referans burada garanti edilmez.",
  'Best of the three': 'Üçünün en iyisi',
  'Beta': 'Beta',
  'Beta and Steinhart-Hart conversion, divider output curve, self-heating.':
    'Beta ve Steinhart-Hart dönüşümü, bölücü çıkış eğrisi, kendi kendine ısınma.',
  'Biased into saturation: VCE is pinned at {vce} and there is no headroom left to swing. Lower RC or R2, or raise RE.':
    "Doyuma kutuplanmış: VCE {vce} değerine çakılı ve salınacak boşluk kalmamış. RC ya da R2'yi düşürün, ya da RE'yi büyütün.",
  'bipolar': 'çift kutuplu',
  'Bipolar': 'Çift kutuplu',
  'Bit rate': 'Bit hızı',
  'BJT as Switch / Amplifier': 'Anahtar / Yükselteç Olarak BJT',
  'black': 'siyah',
  'BLE 1 Mbps': 'BLE 1 Mbps',
  'Blinking lights, tone generation, PWM without a microcontroller, one-shot pulses, and reset supervision. Still worth knowing because it is often the cheapest and most reliable way to get a timed pulse without firmware, and because the astable duty limit explains a lot of confusing circuits.':
    'Yanıp sönen ışıklar, ton üretimi, mikrodenetleyicisiz PWM, tek atımlı darbeler ve reset denetimi. Hâlâ bilmeye değer, çünkü yazılım olmadan zamanlanmış darbe almanın çoğu zaman en ucuz ve güvenilir yoludur ve astable görev oranı sınırı kafa karıştırıcı pek çok devreyi açıklar.',
  'blue': 'mavi',
  'Blue': 'Mavi',
  'Board': 'Kart',
  'Board temp': 'Kart sıcaklığı',
  'boost': 'yükseltici',
  'Boost Converter': 'Boost (Yükseltici) Dönüştürücü',
  'Boost converter power stage': 'Yükseltici dönüştürücü güç katı',
  'both conductors': 'her iki iletken',
  'Both phases of the trace step with exact zero-order-hold discretisation, `i[n] = I∞ + (i[n-1] - I∞)·e^(-dt/tau)`, so the samples sit on the analytic curve at any step size instead of ringing or diverging the way forward Euler does when dt passes tau.':
    "İzin her iki evresi de tam sıfırıncı derece tutma ayrıklaştırmasıyla ilerler, `i[n] = I∞ + (i[n-1] - I∞)·e^(-dt/tau)`; böylece örnekler, ileri Euler'in dt tau'yu geçtiğinde yaptığı gibi çınlamak ya da ıraksamak yerine her adım boyunda analitik eğrinin üzerinde durur.",
  'Both trip points scale with Vcc, which is why the timing is supply independent to first order. The trace is simulated with the same exact zero-order-hold relaxation used elsewhere in this app, not drawn from the formula, so the power-on first cycle really does run ln3 long instead of ln2.':
    'İki eşik de Vcc ile ölçeklenir; zamanlamanın birinci derecede beslemeden bağımsız olmasının nedeni budur. İz formülden çizilmez, bu uygulamanın başka yerlerinde kullanılan aynı tam sıfırıncı derece tutma gevşemesiyle benzetilir; bu yüzden açılıştaki ilk çevrim gerçekten de ln2 değil ln3 kadar sürer.',
  'Bounce duration': 'Sekme süresi',
  'bounce is {bounceMs}': 'sekme {bounceMs}',
  'Branch count': 'Kol sayısı',
  'Branch currents through parallel paths.': 'Paralel kollardan geçen akımlar.',
  'Branches': 'Kollar',
  'bridge': 'köprü',
  'Bridge': 'Köprü',
  'Bridge output': 'Köprü çıkışı',
  'Bridge output against sensor resistance, and the balance condition.':
    'Sensör direncine karşı köprü çıkışı ve denge koşulu.',
  'Brightness': 'Parlaklık',
  'brown': 'kahverengi',
  'brown, 1%': 'kahverengi, %1',
  'bss138': 'bss138',
  'BSS138 bidirectional shifter and divider shifting, with speed limits.':
    'BSS138 çift yönlü dönüştürücü ve bölücüyle seviye kaydırma, hız sınırlarıyla.',
  'BSS138 FET': 'BSS138 FET',
  'buck': 'düşürücü',
  'Buck Converter': 'Buck (Düşürücü) Dönüştürücü',
  'buck converter with a {rectifier}': '{rectifier} kullanan düşürücü dönüştürücü',
  'Buck-Boost Converter': 'Buck-Boost Dönüştürücü',
  'Budget': 'Bütçe',
  'Budget used': 'Kullanılan bütçe',
  'buffer': 'tampon',
  'Buffer (unity gain)': 'Tampon (birim kazanç)',
  'burden': 'yük payı',
  'Burden': 'Yük payı',
  'Bus': 'Veri yolu',
  'Bus capacitance': 'Veri yolu kapasitansı',
  'Bus capacitance is past the {maxCapacitance} the specification allows at this speed. Each device contributes roughly 10 pF and wiring adds about 1 pF per cm, so long ribbon runs add up fast.':
    'Veri yolu kapasitansı, belirtimin bu hızda izin verdiği {maxCapacitance} değerinin ötesinde. Her aygıt kabaca 10 pF katar ve kablolama santimetre başına yaklaşık 1 pF ekler, yani uzun şerit kablo hızla birikir.',
  'By Parseval the rms is `sqrt(sum Vn² / 2)` and depends only on the amplitudes, never on phase. The peak does depend on phase, so crest factor does too: flip the phase toggle on a sawtooth and the rms will not move.':
    'Parseval gereği etkin değer `sqrt(toplam Vn² / 2)` olur ve yalnızca genliklere bağlıdır, faza asla. Tepe değer faza bağlıdır, dolayısıyla tepe çarpanı da öyledir: bir testere dalgasında faz anahtarını çevirin, etkin değer kıpırdamaz.',
  'Bypass RE with a capacitor': "RE'yi kondansatörle baypas et",
  'C rate': 'C oranı',
  'C1 = C2 ideal': 'İdeal C1 = C2',
  'Cable and misc loss': 'Kablo ve diğer kayıplar',
  'Cable loss after': 'Sonrasında kablo kaybı',
  'Cable loss before': 'Öncesinde kablo kaybı',
  'Cable resistance': 'Kablo direnci',
  'Calculators hand you numbers like 26.36 kΩ. Stock does not. This picks the closest preferred value and the two-resistor pairs that get closer.':
    'Hesaplayıcılar size 26.36 kΩ gibi sayılar verir, stoklar vermez. Bu sayfa en yakın tercih edilen değeri ve daha da yaklaşan iki dirençli çiftleri seçer.',
  'cap {vRippleCap} + esr {vRippleEsr}': 'kondansatör {vRippleCap} + esr {vRippleEsr}',
  'Cap ESR': 'Kondansatör ESR',
  'Capacitance': 'Kapasitans',
  'Capacitive': 'Kapasitif',
  'Capacitor': 'Kondansatör',
  'Capacitor Calculator': 'Kondansatör Hesaplayıcı',
  'capacitors in {mode}': '{mode} bağlı kondansatörler',
  'Capacity': 'Kapasite',
  'Carnot ceiling': 'Carnot tavanı',
  'Carnot ceiling against real COP, and the cost compared with resistive heating.':
    'Gerçek COP değerine karşı Carnot tavanı ve dirençli ısıtmayla maliyet karşılaştırması.',
  'Case Tc': 'Kılıf Tc',
  'Catalogue': 'Katalog',
  'catch diode': 'yakalama diyodu',
  'CC phase': 'CC evresi',
  'ccm': 'ccm',
  'CCM': 'CCM',
  'Cell': 'Hücre',
  'Cell capacity': 'Hücre kapasitesi',
  'Cell edge': 'Hücre kenarı',
  'Cell temperature': 'Hücre sıcaklığı',
  'Cell temperature is outside the range this model was fitted over.':
    'Hücre sıcaklığı, bu modelin uyarlandığı aralığın dışında.',
  'Cells in parallel': 'Paralel hücre',
  'Cells in series': 'Seri hücre',
  'centre': 'orta uçlu',
  'Centre frequency': 'Merkez frekansı',
  'Centre tap': 'Orta uçlu',
  'Channel dissipation': 'Kanal güç kaybı',
  'Channels': 'Kanallar',
  'Channels lit': 'Yanan kanal',
  'charge': 'şarj',
  'Charge': 'Şarj',
  'Charge current is set by one resistor: `Ichg = 1200 / Rprog` amps with Rprog in ohms. The datasheet default of 1.2 kΩ gives 1 A, and 10 kΩ gives 120 mA, which is the right order for a small 200 mAh cell.':
    'Şarj akımını tek bir direnç belirler: Rprog ohm cinsinden olmak üzere `Ichg = 1200 / Rprog` amper. Veri sayfasının öntanımlı 1,2 kΩ değeri 1 A, 10 kΩ ise 120 mA verir; ikincisi küçük bir 200 mAh hücre için doğru mertebedir.',
  'Charge delivered': 'Verilen yük',
  'Charge per wake': 'Uyanış başına yük',
  'Charger': 'Şarj devresi',
  'Charging a capacitor through a resistor always dissipates `0.5·C·V²` in that resistor, exactly as much as ends up stored, no matter how large or small R is. That is why linear charging tops out at 50% efficient and why switchers exist.':
    'Bir kondansatörü direnç üzerinden şarj etmek, R ne kadar büyük ya da küçük olursa olsun o dirençte her zaman `0.5·C·V²` harcar; bu da tam olarak depolanan kadardır. Doğrusal şarjın %50 verimde tavan yapmasının ve anahtarlamalıların var olmasının nedeni budur.',
  'Charging at {cRate} C. Most lithium cells want 0.5 C to 1 C, and going faster shortens life sharply and generates heat the little TP4056 board cannot shed. Raise Rprog: {capacityAh} gives exactly 1 C for this cell.':
    "{cRate} C ile şarj ediliyor. Çoğu lityum hücre 0,5 C - 1 C ister; daha hızlısı ömrü keskin biçimde kısaltır ve küçük TP4056 kartının atamayacağı bir ısı üretir. Rprog'u büyütün: {capacityAh} bu hücre için tam 1 C verir.",
  'Charging through R follows `v(t) = V·(1 - e^(-t/RC))` and discharging follows `v(t) = V0·e^(-t/RC)`. Inverting the first gives `t = -R·C·ln(1 - v/V)`, which is where the time-to-target figure comes from. One tau is 63.2%, two is 86.5%, five is 99.3%, and the rail itself is an asymptote the curve never actually touches.':
    "R üzerinden şarj `v(t) = V·(1 - e^(-t/RC))`, deşarj ise `v(t) = V0·e^(-t/RC)` ile ilerler. İlkinin tersi `t = -R·C·ln(1 - v/V)` verir ve hedefe varış süresi buradan gelir. Bir tau %63,2, iki tau %86,5, beş tau %99,3'tür; hattın kendisi ise eğrinin hiçbir zaman gerçekten dokunmadığı bir asimptottur.",
  'Cheap voltage references, clamping an input to protect a pin, and low-current regulation where a proper regulator is overkill. The design is entirely about worst cases: the series resistor must pass enough current at minimum input and maximum load, without cooking the zener at maximum input and no load.':
    'Ucuz gerilim referansları, bir ucu korumak için giriş sınırlama ve düzgün bir regülatörün fazla kaçtığı düşük akımlı regülasyon. Tasarım tamamen en kötü durumlarla ilgilidir: seri direnç, minimum girişte ve maksimum yükte yeterli akımı geçirmeli, maksimum girişte ve yüksüz durumda zeneri yakmamalıdır.',
  'Chemistry': 'Kimya',
  'Chip dissipation': 'Yonga güç kaybı',
  'Cin ripple current': 'Cin dalgalanma akımı',
  'Circuit': 'Devre',
  'Clamp dissipation': 'Kırpıcı güç kaybı',
  'clamped from {requestedBits}': '{requestedBits} değerinden kısıtlandı',
  'Clamped to': 'Şuna kırpıldı',
  'classic': 'klasik',
  'Classic': 'Klasik',
  'Clip-on TO-220 fin 20 to 30, 25 mm extrusion 10, 50 mm block 4.':
    'Geçmeli TO-220 kanat 20 - 30, 25 mm profil 10, 50 mm blok 4.',
  'Clock drift': 'Saat kayması',
  'Closed-loop gain': 'Kapalı çevrim kazancı',
  'Closing the switch puts the supply across a series RL. Current cannot step, so it ramps: `i(t) = (V/R)·(1 - e^(-t·R/L))` with time constant `tau = L/R`. It is 63.2% of the way there after one tau and 99.3% after five, exactly like a capacitor charging, with current and voltage swapped.':
    "Anahtarı kapatmak beslemeyi seri bir RL üzerine koyar. Akım sıçrayamaz, bu yüzden rampa yapar: `tau = L/R` zaman sabitiyle `i(t) = (V/R)·(1 - e^(-t·R/L))`. Bir tau sonra yolun %63,2'sini, beş tau sonra %99,3'ünü almıştır; tıpkı bir kondansatörün şarjı gibi, akım ve gerilim yer değiştirmiş olarak.",
  'Coarser': 'Daha kaba',
  'coax': 'koaksiyel',
  'Coax dielectric, 0.66': 'Koaksiyel yalıtkan, 0,66',
  'Coil': 'Bobin',
  'Coil / Inductor Simulator': 'Bobin / Endüktans Simülatörü',
  'Coil DCR. Slide to the bottom for the ideal case.':
    "Bobin DCR'si. İdeal durum için en alta kaydırın.",
  'Coil impedance |Z|': 'Bobin empedansı |Z|',
  'Collector current': 'Kolektör akımı',
  'Collector RC': 'Kolektör RC',
  'Colour bands': 'Renk bantları',
  'Colour bands and SMD codes both encode the same thing: a mantissa and a power of ten. Enter a value and read it back in every notation.':
    'Renk bantları ve SMD kodları aynı şeyi kodlar: bir mantis ve onun on kuvveti. Bir değer girin ve her gösterimde geri okuyun.',
  'Combine a bank, read its stored energy, and watch it charge or discharge through a resistor. The scope axis is time from the switch closing.':
    'Bir kondansatör grubunu birleştirin, depolanan enerjisini okuyun ve bir dirençten şarj veya deşarj olmasını izleyin. Osiloskop ekseni, anahtarın kapanmasından itibaren geçen zamandır.',
  'common emitter amplifier': 'ortak emiterli yükselteç',
  'comparator': 'karşılaştırıcı',
  'Comparator + hysteresis': 'Karşılaştırıcı + histerezis',
  'Components': 'Bileşenler',
  'Conditions': 'Koşullar',
  'Conduction': 'İletim',
  'Conduction loss': 'İletim kaybı',
  'Conduction mode': 'İletim kipi',
  'Conductor': 'İletken',
  'Conductor temp': 'İletken sıcaklığı',
  'Configuration': 'Yapılandırma',
  'Connecting a 3.3 V ESP32 to 5 V peripherals: older sensors, character LCDs, WS2812 strips, and most Arduino-era shields. It matters because feeding 5 V into a 3.3 V pin damages it over time, and because a 3.3 V output is often just below what a 5 V part reads as a valid high, giving intermittent faults rather than clean failures.':
    '3.3 V bir ESP32yi 5 V çevre birimlerine bağlamak: eski sensörler, karakter LCDler, WS2812 şeritler ve Arduino döneminin çoğu shieldi. Önemlidir, çünkü 3.3 V bir uca 5 V vermek zamanla ona zarar verir ve 3.3 V çıkış çoğu zaman 5 V bir parçanın geçerli yüksek olarak okuduğu seviyenin hemen altında kalır; bu da temiz arıza yerine aralıklı hatalar üretir.',
  'Consumption': 'Tüketim',
  'Contact current': 'Kontak akımı',
  'Contacts bounce because they are springs. The moving contact strikes the fixed one and rebounds, making and breaking several times over roughly 1 to 10 ms for a typical tactile switch, longer for larger levers and relays.':
    'Kontaklar yaylı oldukları için seker. Hareketli kontak sabit olana çarpar ve geri teper; tipik bir dokunmatik anahtarda kabaca 1 - 10 ms boyunca birkaç kez kapanıp açılır, daha büyük kollarda ve rölelerde bu daha uzundur.',
  'Content': 'İçerik',
  'continuous': 'sürekli',
  'Convection h': 'Taşınım h',
  'Conversion ratio': 'Dönüşüm oranı',
  'Converter': 'Dönüştürücü',
  'Copper (for contrast)': 'Bakır (karşılaştırma için)',
  'Copper gains about 0.39% resistance per kelvin, so a wire that is already running warm gets worse: more resistance means more loss means more heat. That feedback is weak enough to be stable in copper, but it is why ampacity figures assume a temperature rise and why bundling wires derates them so heavily.':
    'Bakır kelvin başına yaklaşık %0,39 direnç kazanır, yani zaten ılık çalışan bir tel daha da kötüleşir: daha çok direnç daha çok kayıp, o da daha çok ısı demektir. Bu geri besleme bakırda kararlı kalacak kadar zayıftır, ama akım taşıma değerlerinin neden bir sıcaklık artışı varsaydığını ve tellerin demetlenmesinin onları neden bu kadar ağır biçimde düşürdüğünü açıklar.',
  'Copper is here for contrast, not for building elements. Its temperature coefficient is roughly 80x that of nichrome, so its resistance and therefore its power swing wildly as it heats, and it oxidises away quickly at element temperatures.':
    "Bakır burada karşılaştırma için var, eleman yapmak için değil. Sıcaklık katsayısı nikrom'unkinin kabaca 80 katıdır, yani ısındıkça direnci ve dolayısıyla gücü çılgınca oynar; ayrıca eleman sıcaklıklarında hızla oksitlenip yok olur.",
  'copper loss only': 'yalnızca bakır kaybı',
  'Copper resistance of the winding, from the inductor datasheet.':
    'Sargının bakır direnci, bobin veri sayfasından.',
  'Copper thickness': 'Bakır kalınlığı',
  'Copper weight': 'Bakır ağırlığı',
  'Correction adds a shunt reactance that supplies Q locally instead of dragging it down the cable: `Qc = P·(tan(phi1) - tan(phi2))`, giving `C = Qc / (2·pi·f·V²)`. The load still draws the same Q, it just comes from a capacitor a metre away rather than a generator miles away.':
    "Düzeltme, Q'yu kablo boyunca sürüklemek yerine yerinde sağlayan paralel bir reaktans ekler: `Qc = P·(tan(phi1) - tan(phi2))`, buradan da `C = Qc / (2·pi·f·V²)` çıkar. Yük yine aynı Q'yu çeker, yalnızca bu kez kilometrelerce ötedeki bir jeneratörden değil bir metre ötedeki kondansatörden gelir.",
  'Correction needed': 'Gereken düzeltme',
  'Cost per kWh heat': 'kWh ısı başına maliyet',
  'Count at full': 'Doluda adım sayısı',
  'Count return conductor': 'Dönüş iletkenini de say',
  'Counts over travel': 'Hareket boyunca adım',
  'Cout ESR': 'Cout ESR',
  'Cout ripple current': 'Cout dalgalanma akımı',
  'Crest factor': 'Tepe çarpanı',
  'Cross-section': 'Kesit',
  'Crystal': 'Kristal',
  'Crystal Load Capacitors': 'Kristal Yük Kondansatörleri',
  'current': 'akım',
  'Current': 'Akım',
  'Current after': 'Düzeltmeden sonraki akım',
  'Current density': 'Akım yoğunluğu',
  'Current Divider': 'Akım Bölücü',
  'Current from 1 V': '1 V için akım',
  'Current gain hFE': 'Akım kazancı hFE',
  'current hits zero': 'akım sıfıra iner',
  'current lags': 'akım geri kalır',
  'current leads': 'akım önceler',
  'Current limit': 'Akım sınırı',
  'Current now': 'Şimdiki akım',
  'Current ramp, stored energy and the kickback a coil produces when switched.':
    'Akım rampası, depolanan enerji ve bobin anahtarlandığında oluşan ters gerilim.',
  'Current resolution': 'Akım çözünürlüğü',
  'Current Sensing': 'Akım Ölçümü',
  'Current shift per {spread} of Vf': "Vf'nin {spread} kayması başına akım değişimi",
  'Current source': 'Akım kaynağı',
  'Current swing': 'Akım salınımı',
  'Curve': 'Eğri',
  'Custom': 'Özel',
  'Cut a wire whip to the right length. The physical element is always shorter than the free-space figure because the wave travels slower in and around the conductor.':
    'Tel anteni doğru uzunlukta kesin. Fiziksel eleman her zaman serbest uzay değerinden kısadır, çünkü dalga iletkenin içinde ve çevresinde daha yavaş ilerler.',
  'cut off': 'kesimde',
  'Cut off: the divider only puts {vth} on the base, under the 0.7 V the junction needs. Raise R2 or lower R1.':
    "Kesimde: bölücü beyze yalnızca {vth} veriyor, oysa jonksiyon 0,7 V istiyor. R2'yi büyütün ya da R1'i küçültün.",
  'cutoff': 'kesim',
  'Cutoff (off)': 'Kesim (kapalı)',
  'Cutoff fc': 'Kesim fc',
  "Cutoff is where the capacitor's reactance equals the resistance, so `fc = 1 / (2·pi·R·C)` and the output is down 3 dB.":
    'Kesim, kondansatörün reaktansının dirence eşit olduğu yerdir; yani `fc = 1 / (2·pi·R·C)` ve çıkış 3 dB düşüktür.',
  'Cutoff voltage': 'Kesim gerilimi',
  'Cutting a wire whip for a LoRa, WiFi or GPS module. It matters because a quarter wave is wavelength dependent and a 10% error can cost 10 dB, which is a factor of three in range. It also flags the ground plane requirement, which is why a bare whip on a small board performs so badly.':
    'Bir LoRa, WiFi veya GPS modülü için tel anten kesmek. Önemlidir, çünkü çeyrek dalga dalga boyuna bağlıdır ve %10 hata 10 dBye mal olabilir, bu da menzilde üç kat demektir. Ayrıca toprak düzlemi gereksinimini de işaret eder; küçük bir kart üzerindeki çıplak antenin bu kadar kötü çalışmasının nedeni budur.',
  'CV tail': 'CV kuyruğu',
  'Cycle period': 'Çevrim süresi',
  'Cycles shown': 'Gösterilen çevrim',
  'D = {duty} is past the {MAX_PRACTICAL_DUTY} where this model is worth trusting. The diode only conducts for {toff} per cycle, so the peak currents and the I²R losses climb fast, the right-half-plane zero drops to where the loop is hard to compensate, and most controllers clamp the duty here anyway. Raise Vin, or use a two-stage or transformer-coupled topology.':
    "D = {duty}, bu modelin güvenilir olduğu {MAX_PRACTICAL_DUTY} sınırının ötesinde. Diyot çevrim başına yalnızca {toff} iletir, bu yüzden tepe akımları ve I²R kayıpları hızla tırmanır, sağ yarı düzlem sıfırı çevrimin dengelenmesinin zor olduğu bölgeye iner ve çoğu denetleyici görev çevrimini zaten burada sınırlar. Vin'i yükseltin ya da iki katlı veya trafo kuplajlı bir topoloji kullanın.",
  'Daily consumption': 'Günlük tüketim',
  'Daily surplus': 'Günlük fazla',
  'Damping alpha': 'Sönüm alfa',
  'Damping zeta': 'Sönüm zeta',
  'Datasheet impedance at the test current. 1N4728A is 10 Ω.':
    'Test akımındaki veri sayfası empedansı. 1N4728A için 10 Ω.',
  'Datasheet Isat. Past this the core gives up and L collapses.':
    'Veri sayfası Isat değeri. Bunun ötesinde çekirdek pes eder ve L çöker.',
  'Datasheet Izk is 1 mA. Use 5 to 10 mA for a stiff output.':
    "Veri sayfası Izk değeri 1 mA'dir. Sağlam bir çıkış için 5 - 10 mA kullanın.",
  'Datasheet limit, 20 mA for most 5 mm parts.': 'Veri sayfası sınırı, çoğu 5 mm parça için 20 mA.',
  'Datasheet minimum, not typical. Saturation depends on the worst case.':
    'Veri sayfasındaki en küçük değer, tipik değer değil. Doyum en kötü duruma bağlıdır.',
  'Datasheet saturation current, not the RMS rating.':
    'Veri sayfasındaki doyum akımı, RMS değeri değil.',
  'Days to refill': 'Doldurma günü',
  'dc': 'dc',
  'DC bleed corner': 'DC boşaltma köşesi',
  'DC feedthrough (DCR)': 'DC sızması (DCR)',
  'DC offset': 'DC ofset',
  'DC output': 'DC çıkış',
  'DC step': 'DC basamak',
  'dcm': 'dcm',
  'DCM': 'DCM',
  'DCM below {ioutBoundary} of load': '{ioutBoundary} yükün altında DCM',
  'Decades shown': 'Gösterilen dekat',
  'Deciding whether a heat pump is worth installing, and understanding why the answer depends on flow temperature. It explains why underfloor heating suits heat pumps and old high-temperature radiators do not, and why the seasonal figure rather than the headline COP determines the running cost.':
    'Bir ısı pompasının kurmaya değip değmediğine karar vermek ve cevabın neden gidiş suyu sıcaklığına bağlı olduğunu anlamak. Yerden ısıtmanın ısı pompalarına neden uyduğunu, eski yüksek sıcaklıklı radyatörlerin neden uymadığını ve işletme maliyetini neden manşetteki COP yerine mevsimsel değerin belirlediğini açıklar.',
  'Deciding whether a LoRa or WiFi link will actually work at the range you need, before installing anything. It shows why lower frequencies reach further, why LoRa trades data rate for sensitivity, and why a link designed with no margin fails the first time it rains.':
    'Herhangi bir kurulum yapmadan önce bir LoRa veya WiFi bağlantısının ihtiyacınız olan menzilde gerçekten çalışıp çalışmayacağına karar vermek. Düşük frekansların neden daha uzağa gittiğini, LoRanın veri hızını hassasiyet için neden takas ettiğini ve pay bırakmadan tasarlanan bir bağlantının ilk yağmurda neden koptuğunu gösterir.',
  'Deep Sleep Battery Life': 'Derin Uyku Batarya Ömrü',
  'Defaults to the 3V3 ESP32 rail.': 'Öntanımlı olarak 3V3 ESP32 hattı.',
  'Depth of discharge': 'Deşarj derinliği',
  "Design a battery sense divider that fits the ADC's usable window without draining the pack. The ESP32 ADC is only linear over part of its nominal range, and its input needs a reasonably stiff source.":
    "Paketi tüketmeden ADC'nin kullanılabilir penceresine oturan bir batarya ölçüm bölücüsü tasarlayın. ESP32 ADC'si nominal aralığının yalnızca bir bölümünde doğrusaldır ve girişi makul ölçüde düşük empedanslı bir kaynak ister.",
  'Design outdoor': 'Tasarım dış sıcaklığı',
  'design target': 'tasarım hedefi',
  'diameter': 'çap',
  'Diameter': 'Çap',
  'difference': 'fark',
  'Difference': 'Fark',
  'digital, I2C': 'sayısal, I2C',
  'Dimming LEDs, driving motors and servos, and generating an analogue voltage from an ESP32. The frequency against resolution trade is a hardware limit people meet without noticing: asking for a high frequency silently reduces your duty resolution, which shows up as visible banding when dimming an LED at low brightness.':
    'LED karartma, motor ve servo sürme ve ESP32den analog gerilim üretme. Frekansa karşı çözünürlük dengesi, insanların farkına varmadan çarptığı bir donanım sınırıdır: yüksek frekans istemek görev oranı çözünürlüğünüzü sessizce düşürür ve bu, bir LEDi düşük parlaklıkta karartırken görünür bantlanma olarak ortaya çıkar.',
  'diode': 'diyot',
  'Diode': 'Diyot',
  'Diode dissipation': 'Diyot güç kaybı',
  'Diode drop Vd': 'Diyot düşümü Vd',
  'Diode loss': 'Diyot kaybı',
  'Diode Rectifier': 'Diyot Doğrultucu',
  'Diode reverse stress': 'Diyot ters zorlanması',
  'Diode Vf': 'Diyot Vf',
  'dipole, each leg is a quarter': 'dipol, her bacak bir çeyrek',
  'Direct watts': 'Doğrudan watt',
  'Direction': 'Yön',
  'discharge': 'deşarj',
  'Discharge': 'Deşarj',
  "Discharge a pack into a constant load and watch it sag. The scope plots terminal voltage against the open-circuit voltage over time: the gap between the two traces is the loss in the pack's own internal resistance.":
    'Bir paketi sabit yüke deşarj edin ve gerilimin düşmesini izleyin. Osiloskop, uç gerilimini açık devre gerilimine karşı zaman içinde çizer: iki iz arasındaki fark, paketin kendi iç direncindeki kayıptır.',
  'Discharge current': 'Deşarj akımı',
  'Discharge pin is asked to sink {peak}, over its {rating} rating. Raise R1.':
    "Deşarj pininden {peak} çekmesi isteniyor, bu da {rating} değerinin üzerinde. R1'i büyütün.",
  'Discharge pin is over its sink rating. Raise R.':
    "Deşarj pini akım çekme sınırının üzerinde. R'yi büyütün.",
  'Discharge under load with internal resistance sag and Peukert derating.':
    'Yük altında deşarj, iç direnç düşümü ve Peukert derecelendirmesi ile.',
  'Discontinuous conduction: the load is below {boundary}, so the inductor current hits zero every cycle. Duty no longer tracks Vout/Vin, the loop gain changes, and a diode version will ring on the switch node once the current stops. Raise L or fsw to push the boundary down.':
    "Kesintili iletim: yük {boundary} değerinin altında, bu yüzden bobin akımı her çevrimde sıfıra iniyor. Görev çevrimi artık Vout/Vin oranını izlemez, çevrim kazancı değişir ve diyotlu bir sürüm akım kesildiğinde anahtar düğümünde çınlar. Sınırı aşağı itmek için L'yi ya da fsw'yi yükseltin.",
  'Dissipation': 'Güç kaybı',
  'Dissipation constant': 'Isı dağıtma sabiti',
  'Dissipation is `I²·R` and it rises with the square of current, so a shunt sized for convenience at 1 A becomes a heater at 10 A. Worse, the heat changes the resistance, so the measurement drifts as the load increases: the reason precision shunts use low-tempco alloys and four-wire connections.':
    "Güç kaybı `I²·R` olur ve akımın karesiyle yükselir, yani 1 A için rahatça seçilmiş bir şönt 10 A'de ısıtıcıya döner. Daha kötüsü, ısı direnci değiştirir, bu yüzden yük arttıkça ölçüm kayar: hassas şöntlerin düşük sıcaklık katsayılı alaşımlar ve dört telli bağlantı kullanmasının nedeni budur.",
  'Dissipation is `Px = Ix²·Rx`, and the branch powers sum to `V·Itotal`. In rail mode the source sees `Rs + Req`, so `Itotal = Vs / (Rs + Req)` and Rs takes the rest of the supply.':
    'Güç kaybı `Px = Ix²·Rx` olur ve kol güçlerinin toplamı `V·Itoplam` eder. Hat kipinde kaynak `Rs + Req` görür, yani `Itoplam = Vs / (Rs + Req)` olur ve beslemenin geri kalanını Rs alır.',
  'Dissipation splits between the two parts: `P_R = I²R = (Vs - Vf)²/R` in the resistor and `P_LED = Vf·I` in the die. The fraction that reaches the LED is just `Vf / Vs`, which is why a 2 V red LED on a 12 V rail wastes five sixths of its power as heat in a resistor.':
    "Güç kaybı iki parça arasında bölünür: dirençte `P_R = I²R = (Vs - Vf)²/R` ve yongada `P_LED = Vf·I`. LED'e ulaşan pay yalnızca `Vf / Vs` kadardır; 12 V hattaki 2 V'luk kırmızı bir LED'in gücünün altıda beşini dirençte ısı olarak harcamasının nedeni budur.",
  'Distance': 'Uzaklık',
  'Distortion is the energy that is not the fundamental: `THD = sqrt(V2² + V3² + ... ) / V1`. An ideal square is 48.3%, a triangle 12.1%. Ten terms only get part of the way there. THD-R divides by the total rms instead, so it can never exceed 100%, which is what a meter reads.':
    "Bozulma, temel bileşen olmayan enerjidir: `THD = sqrt(V2² + V3² + ... ) / V1`. İdeal bir kare %48,3, üçgen %12,1'dir. On terim oraya ancak kısmen ulaşır. THD-R bunun yerine toplam etkin değere böler, bu yüzden hiçbir zaman %100'ü aşamaz; bir ölçü aletinin okuduğu da budur.",
  'divider': 'bölücü',
  'Divider': 'Bölücü',
  'Divider current': 'Bölücü akımı',
  'Divider drain': 'Bölücü tüketimi',
  'Divider is not stiff: it bleeds only {stiffness}x IB, so the bias point moves with hFE and temperature. Aim for 10x, i.e. lower R1 and R2 together.':
    "Bölücü yeterince sağlam değil: yalnızca IB'nin {stiffness} katını akıtıyor, bu yüzden kutuplama noktası hFE ve sıcaklıkla kayar. 10 katı hedefleyin, yani R1 ve R2'yi birlikte küçültün.",
  'Divider output': 'Bölücü çıkışı',
  'Divider stiffness': 'Bölücü sağlamlığı',
  'dpak': 'dpak',
  'DPAK on 1 sq inch copper': '1 inç kare bakır üzerinde DPAK',
  'Drain current': 'Drenaj akımı',
  'Drain per day': 'Günlük tüketim',
  'Drawing {cRate} C, past the {maxCRate} C continuous rating for {label}. Real cells overheat and age fast here, which this model does not simulate: it will happily show you a runtime you should not use.':
    '{cRate} C çekiliyor; bu, {label} için {maxCRate} C sürekli değerinin üzerinde. Gerçek hücreler burada aşırı ısınır ve hızla yaşlanır, bu model ise bunu benzetmez: size kullanmamanız gereken bir çalışma süresini seve seve gösterir.',
  'Drive': 'Sürüş',
  'Drive and environment': 'Sürüş ve ortam',
  'Drive waveform': 'Sürüş dalga şekli',
  'Driven straight from a GPIO': "Doğrudan bir GPIO'dan sürülüyor",
  'Driving a relay, a buzzer, a motor or an LED string from a microcontroller pin that cannot supply the current. The overdrive factor is the point: a transistor that is not driven hard into saturation dissipates far more than expected and gets hot, which is the usual cause of a switching transistor failing in a hobby circuit.':
    'Gerekli akımı veremeyen bir mikrodenetleyici ucundan röle, buzzer, motor veya LED dizisi sürmek. Asıl konu aşırı sürme katsayısıdır: doyuma sertçe sürülmeyen bir transistör beklenenden çok daha fazla güç harcar ve ısınır; hobi devrelerinde anahtarlama transistörünün bozulmasının olağan nedeni budur.',
  'Drop at far end': 'Uzak uçta düşüm',
  'Dropout: Vin is at or below Vout plus the switch and winding drops. The high side switch sits at 100% duty, there is no switching left to model, and the output just follows the input.':
    'Düşüm sınırı: Vin, Vout artı anahtar ve sargı düşümlerinin altında ya da onlara eşit. Üst taraf anahtarı %100 görev çevriminde kalır, modellenecek anahtarlama kalmaz ve çıkış yalnızca girişi izler.',
  'Duty': 'Görev oranı',
  'Duty cycle': 'Görev çevrimi',
  'Duty cycle D': 'Görev çevrimi D',
  'Duty D': 'Görev çevrimi D',
  'Duty is outside the range a real controller can hold. Near 0 or 1 the on-time approaches the minimum pulse width and the output collapses or pulse-skips.':
    "Görev çevrimi, gerçek bir denetleyicinin tutabileceği aralığın dışında. 0 ya da 1'e yakın yerlerde iletim süresi en küçük darbe genişliğine yaklaşır ve çıkış çöker ya da darbe atlar.",
  'Duty register': 'Görev çevrimi yazmacı',
  'Duty resolution': 'Görev çevrimi çözünürlüğü',
  'Duty step': 'Görev çevrimi adımı',
  'Duty steps': 'Görev çevrimi adımı',
  'Duty, inductor ripple, output ripple and the CCM/DCM boundary.':
    'Görev oranı, bobin dalgalanması, çıkış dalgalanması ve CCM/DCM sınırı.',
  'E series': 'E serisi',
  'E24 is the IEC 60063 preferred series, 24 values per decade for 5% parts, nominally `10^(n/24)` rounded to two figures. The nearest value is picked on log distance rather than on ohms, because tolerance is a ratio: 62 Ω is as far from 65 Ω as 68 Ω is, in percent.':
    "E24, IEC 60063 yeğlenen serisidir; %5'lik parçalar için dekat başına 24 değer, anma olarak iki basamağa yuvarlanmış `10^(n/24)`. En yakın değer ohm üzerinden değil logaritmik uzaklıkla seçilir, çünkü tolerans bir orandır: yüzde olarak 62 Ω, 65 Ω'a 68 Ω kadar uzaktır.",
  'E48 and E96 are exactly that rounding. E6, E12 and E24 are not: IEC 60063 keeps the historical 27, 33, 39, 47 and 82 where the arithmetic gives 26.1, 31.6, 38.3, 46.4 and 82.5. That is why E24 has a 13 to 15 gap worth 7.1% while its grade is only 5%.':
    "E48 ve E96 tam olarak bu yuvarlamadır. E6, E12 ve E24 değildir: IEC 60063, aritmetiğin 26,1, 31,6, 38,3, 46,4 ve 82,5 verdiği yerlerde tarihsel 27, 33, 39, 47 ve 82 değerlerini korur. E24'te sınıfı yalnızca %5 iken %7,1'lik bir 13 - 15 boşluğu olmasının nedeni budur.",
  'Each half is a plain voltage divider, so the taps sit at `Vin·R2/(R1+R2)` and `Vin·R4/(R3+R4)`. The bridge output is their difference, `Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))`, which is zero when `R1/R2 = R3/R4`, i.e. `R1·R4 = R2·R3`. Balance depends on ratios only, so it is immune to supply drift.':
    'Her yarı sade bir gerilim bölücüdür, yani orta uçlar `Vin·R2/(R1+R2)` ve `Vin·R4/(R3+R4)` değerlerinde durur. Köprü çıkışı bunların farkıdır, `Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))`, ve `R1/R2 = R3/R4` yani `R1·R4 = R2·R3` olduğunda sıfırdır. Denge yalnızca oranlara bağlıdır, bu yüzden besleme kaymasından etkilenmez.',
  'Each WS2812 contains three LEDs at roughly 20 mA per channel, so a fully lit white pixel draws about 60 mA. The controller inside also draws about 1 mA even when the LED is dark, which is easy to forget on a long strip: 300 pixels idle still costs around 300 mA.':
    "Her WS2812, kanal başına kabaca 20 mA çeken üç LED içerir, yani tam yanan beyaz bir piksel yaklaşık 60 mA çeker. İçindeki denetleyici de LED sönükken bile yaklaşık 1 mA çeker; uzun bir şeritte bunu unutmak kolaydır: boştaki 300 piksel yine de yaklaşık 300 mA'e mal olur.",
  'each, 4 or more': 'her biri, 4 veya daha fazla',
  'edge': 'kenar',
  'Edges in window': 'Penceredeki kenarlar',
  'Efficiency': 'Verim',
  'Efficiency at full load': 'Tam yükte verim',
  'Efficiency is a first-order budget, not a simulation: `Irms²·DCR` in the winding, `Irms²·Rds(on)` in each FET weighted by its conduction time or `Vf·Iout·(1-D)` for a catch diode, plus hard switching loss `0.5·Vin·I·(tr+tf)·fsw` and the controller quiescent draw. Gate charge, core loss, dead time and layout parasitics are not modelled, so expect the real board to land a couple of points lower.':
    "Verim bir benzetim değil, birinci derece bir bütçedir: sargıda `Irms²·DCR`, iletim süresine göre ağırlıklandırılmış her FET'te `Irms²·Rds(on)` ya da yakalama diyodu için `Vf·Iout·(1-D)`, artı sert anahtarlama kaybı `0.5·Vin·I·(tr+tf)·fsw` ve denetleyicinin durgun tüketimi. Kapı yükü, çekirdek kaybı, ölü zaman ve serim parazitikleri modellenmez, bu yüzden gerçek kartın birkaç puan aşağıda kalmasını bekleyin.",
  'Efficiency is dominated by two terms: the internal switch dropping about 1.16 V at 3 A, and the catch diode burning `Vf·Idiode` for the whole off-time. At low output voltages the diode conducts most of the period, which is why a 12 V to 3.3 V conversion is markedly less efficient than 12 V to 5 V.':
    "Verime iki terim egemendir: 3 A'de yaklaşık 1,16 V düşüren içteki anahtar ve tüm kesim süresi boyunca `Vf·Idiyot` yakan yakalama diyodu. Düşük çıkış gerilimlerinde diyot çevrimin çoğunda iletir; 12 V'tan 3,3 V'a dönüşümün 12 V'tan 5 V'a göre belirgin biçimde daha verimsiz olmasının nedeni budur.",
  'EIA-96 is the compact scheme for tiny 1% parts: two digits index into the 96 values of the E96 series, and a letter gives the multiplier. So 68C is the 68th E96 value, 499, times 100, i.e. 49.9 kΩ. It is dense but requires the table.':
    "EIA-96, küçücük %1'lik parçalar için sıkışık düzendir: iki rakam E96 serisinin 96 değeri içinde bir sıra numarasıdır, bir harf de çarpanı verir. Yani 68C, 68. E96 değeri olan 499'un 100 katı, yani 49,9 kΩ demektir. Yoğundur ama tabloyu gerektirir.",
  'EIRP': 'EIRP',
  'Electrical input': 'Elektriksel giriş',
  'Element': 'Eleman',
  'Element makers size on surface load, watts per square metre of wire surface, not on total power. Two elements of the same wattage behave very differently if one packs it into half the surface.':
    'Eleman üreticileri toplam güce göre değil, yüzey yüküne, yani tel yüzeyinin metrekaresi başına watta göre boyutlandırır. Aynı güçteki iki eleman, biri bunu yarı yüzeye sığdırıyorsa çok farklı davranır.',
  'Embedded / ESP32': 'Gömülü / ESP32',
  'Emitter re': 'Emiter re',
  'Emitter RE': 'Emiter RE',
  'Empty voltage': 'Boş gerilimi',
  'Energy & Thermal': 'Enerji ve Isı',
  'Energy at target': 'Hedefteki enerji',
  'Energy delivered': 'Verilen enerji',
  'Energy per wake': 'Uyanış başına enerji',
  'Energy to target': 'Hedefe kadar enerji',
  'Equilibrium is above the {maxTemp} °C continuous rating for {label}. The element will oxidise fast and fail early. Use thicker wire, a longer run, or less voltage.':
    'Denge sıcaklığı, {label} için {maxTemp} °C sürekli değerinin üzerinde. Eleman hızla oksitlenip erken bozulur. Daha kalın tel, daha uzun bir boy ya da daha düşük gerilim kullanın.',
  'Equilibrium temp': 'Denge sıcaklığı',
  'Equivalent R': 'Eşdeğer R',
  'ESP32 ADC / VBAT Sense': 'ESP32 ADC / VBAT Ölçümü',
  'ESP32 GPIO into an RC low pass': "RC alçak geçirene bağlı ESP32 GPIO'su",
  'ESP32 GPIO is {VCC} V': "ESP32 GPIO'su {VCC} V",
  'ESP32 input-high threshold is about 2.48 V on a 3V3 rail.':
    "ESP32'nin giriş-yüksek eşiği 3V3 hattında yaklaşık 2,48 V'tur.",
  'ESP32 LEDC PWM': 'ESP32 LEDC PWM',
  'ESP32 peaks near 500 mA on a WiFi transmit burst.':
    "Bir ESP32, WiFi iletim patlamasında 500 mA'e yaklaşır.",
  'esr {vrippleEsr} + cap {vrippleCap}': 'esr {vrippleEsr} + kondansatör {vrippleCap}',
  'Even clamped, the switch sits at {vSwitchClamped}, above its {vBreakdown} rating. The diode is not the problem, the supply is.':
    'Kırpılmış olsa bile anahtar {vSwitchClamped} geriliminde kalıyor; bu, {vBreakdown} değerinin üzerinde. Sorun diyot değil, besleme.',
  'Even done correctly this ADC is not precise. It has significant offset and gain error, varies part to part, and drifts with temperature. Use the factory calibration via esp_adc_cal, average many samples, and do not expect better than about 1%.':
    "Doğru yapıldığında bile bu ADC hassas değildir. Kayda değer ofset ve kazanç hatası vardır, parçadan parçaya değişir ve sıcaklıkla kayar. esp_adc_cal üzerinden fabrika kalibrasyonunu kullanın, çok sayıda örneğin ortalamasını alın ve %1'den iyisini beklemeyin.",
  'Every coulomb delivered to the load crosses `n` junctions, so conduction loss is `n·Vf·Idc` shared over the diodes in the circuit. The current is not shared evenly in time: the diodes only conduct near the peaks, so the peak current is many times `Idc`, which is why the conduction angle and crest factor are on the readout. Source resistance is what limits that spike, and a real transformer has some.':
    "Yüke ulaşan her kulon `n` jonksiyon geçer, yani iletim kaybı devredeki diyotlar arasında paylaşılan `n·Vf·Idc` olur. Akım zaman içinde eşit paylaşılmaz: diyotlar yalnızca tepelerin yakınında iletir, bu yüzden tepe akım `Idc`'nin kat kat üzerindedir; iletim açısı ile tepe çarpanının göstergede olmasının nedeni budur. Bu sıçramayı sınırlayan şey kaynak direncidir ve gerçek bir trafoda bir miktar vardır.",
  'Every I2C sensor, display and EEPROM on an ESP32 project. I2C is open drain, so the bus cannot rise without a pull-up, and the resistor value is a genuine constraint rather than a formality: too large and the edges are too slow for the clock, too small and devices cannot pull the line low. This is the usual reason an I2C bus works with a short jumper and fails with a metre of ribbon cable.':
    'Bir ESP32 projesindeki her I2C sensörü, ekranı ve EEPROMu. I2C açık drenajlıdır, bu yüzden hat pull-up olmadan yükselemez ve direnç değeri bir formalite değil gerçek bir kısıttır: çok büyükse kenarlar saat için fazla yavaş kalır, çok küçükse cihazlar hattı aşağı çekemez. Bir I2C hattının kısa jumper ile çalışıp bir metre şerit kabloyla bozulmasının olağan nedeni budur.',
  'Every marking scheme encodes a mantissa and a multiplier. Four bands give two significant figures and are used for 5% and 10% parts drawn from E24 and E12. Five bands give three figures for 1% and 2% parts from E96 and E48. The extra digit exists because a tighter tolerance needs a finer grid of values to be worth anything.':
    "Her işaretleme düzeni bir mantis ve bir çarpan kodlar. Dört bant iki anlamlı basamak verir ve E24 ile E12'den seçilen %5 ile %10'luk parçalarda kullanılır. Beş bant, E96 ve E48'den gelen %1 ve %2'lik parçalar için üç basamak verir. Fazladan basamak vardır çünkü daha dar bir toleransın işe yaraması için daha ince bir değer ızgarası gerekir.",
  'Every periodic waveform is a sum of sines at integer multiples of one fundamental: `v(t) = Vdc + sum Vn·sin(2·pi·n·f0·t + phi_n)`. Each slider sets one Vn. The scope evaluates that sum directly, so there is no solver and no step-size limit.':
    'Her dönemsel dalga şekli, tek bir temel bileşenin tam katlarındaki sinüslerin toplamıdır: `v(t) = Vdc + toplam Vn·sin(2·pi·n·f0·t + phi_n)`. Her sürgü bir Vn belirler. Osiloskop bu toplamı doğrudan hesaplar, yani ne bir çözücü ne de adım boyu sınırı vardır.',
  'Everything here swings about Vbias rather than about 0 V, because on a single 3.3 V supply there is no negative rail to swing into. That means the non-inverting pin of an inverting stage and the Rg leg of a non-inverting stage both return to mid rail, not to ground. Set Vbias to 0 and a split supply and the formulas collapse back to the textbook ones.':
    "Buradaki her şey 0 V çevresinde değil Vbias çevresinde salınır, çünkü tek bir 3,3 V beslemede salınılacak negatif hat yoktur. Bu, eviren bir katın evirmeyen pininin de evirmeyen bir katın Rg bacağının da toprağa değil orta hatta dönmesi demektir. Vbias'ı 0 yapıp çift besleme seçin, formüller ders kitabındaki hâllerine geri döner.",
  'Everything left over is heat. `Pd = (Vin - Vout)·I` with no switching and nowhere to hide, so efficiency is just Vout/Vin. The junction sits at `Tj = Ta + Pd·Rth` where Rth is the series path from junction to ambient: junction to case, case to heatsink through grease or a pad, then heatsink to air. Invert it to size the sink, `Rsa = (Tj_max - Ta)/Pd - Rjc - Rcs`. A negative answer means the package itself is the bottleneck and no heatsink will save it.':
    "Artan her şey ısıdır. Anahtarlama olmadığı ve saklanacak yer bulunmadığı için `Pd = (Vin - Vout)·I` olur, yani verim yalnızca Vout/Vin'dir. Jonksiyon `Tj = Ta + Pd·Rth` değerindedir; buradaki Rth jonksiyondan ortama giden seri yoldur: jonksiyondan kılıfa, macun ya da ped üzerinden kılıftan soğutucuya, sonra soğutucudan havaya. Soğutucuyu boyutlandırmak için tersine çevirin: `Rsa = (Tj_max - Ta)/Pd - Rjc - Rcs`. Negatif bir yanıt, darboğazın kılıfın kendisi olduğu ve hiçbir soğutucunun onu kurtaramayacağı anlamına gelir.",
  'Everywhere. Scaling a battery voltage into an ADC range, setting the feedback point of a regulator, biasing a transistor, and making a reference. The trap it exposes is loading: a divider that reads correctly on a meter can read completely wrong once the circuit it feeds draws current.':
    'Her yerde. Batarya gerilimini ADC aralığına ölçeklemek, bir regülatörün geri besleme noktasını ayarlamak, transistör kutuplamak ve referans üretmek. Ortaya çıkardığı tuzak yüklemedir: ölçü aletinde doğru okunan bir bölücü, beslediği devre akım çekmeye başlayınca tamamen yanlış okuyabilir.',
  'exact E24 hit': 'tam E24 tutturması',
  'Excitation': 'Uyartım',
  'Excitation current': 'Uyartım akımı',
  'Extended 0.5 to 2.5 ms': 'Genişletilmiş 0,5 - 2,5 ms',
  'external': 'dış',
  'External': 'Dış katman',
  'f / fc': 'f / fc',
  'f_pwm / fc': 'f_pwm / fc',
  'Fall time tf': 'Düşme süresi tf',
  'Fall to VIL': "VIL'ye düşme",
  'Fast 400 kHz': 'Hızlı 400 kHz',
  'Fast plus 1 MHz': 'Hızlı artı 1 MHz',
  'fc sits only {ratio}x below f_pwm. Aim for {FC_RATIO_GOOD}x (40 dB on the switching fundamental); under {FC_RATIO_MIN}x the RC is not smoothing, it is just rounding the edges. Raise f_pwm or raise R·C.':
    "fc, f_pwm'in yalnızca {ratio} katı altında. {FC_RATIO_GOOD} katı hedefleyin (anahtarlama temel bileşeninde 40 dB); {FC_RATIO_MIN} katının altında RC düzleştirme yapmaz, yalnızca kenarları yuvarlar. f_pwm'i ya da R·C'yi yükseltin.",
  'feed power at intervals': 'aralıklarla güç besleyin',
  'Feed resistance': 'Besleme direnci',
  'Feed wire gauge': 'Besleme teli kalınlığı',
  'Feedback Cf': 'Geri besleme Cf',
  'Feedback divider': 'Geri besleme bölücüsü',
  'Feedback R1': 'Geri besleme R1',
  'Feedback Rf': 'Geri besleme Rf',
  'FET Rds(on)': 'FET Rds(on)',
  'Fill factor': 'Doluluk çarpanı',
  'Fill factor `Pmp / (Voc·Isc)` measures how square the knee is. Series resistance flattens the top of the curve and shunt resistance tilts the flat current region, both dragging FF down from the 0.75 to 0.82 a healthy c-Si module shows.':
    "Doluluk çarpanı `Pmp / (Voc·Isc)`, dizin ne kadar dik olduğunu ölçer. Seri direnç eğrinin tepesini düzleştirir, paralel direnç ise düz akım bölgesini eğer; ikisi de FF'yi sağlıklı bir c-Si modülün gösterdiği 0,75 - 0,82 aralığından aşağı çeker.",
  'Filter': 'Süzgeç',
  'Filter and matching network design, understanding why a decoupling capacitor stops working above its self-resonance, and why cable and load impedance matters at frequency. Any time a circuit behaves differently at 1 kHz and 1 MHz, this is why.':
    'Filtre ve uyumlandırma ağı tasarımı, bir dekuplaj kondansatörünün kendi rezonansının üzerinde neden işlevini yitirdiğini ve kablo ile yük empedansının frekansta neden önemli olduğunu anlamak. Bir devre 1 kHzde ve 1 MHzde farklı davrandığında sebebi budur.',
  'Filter simulators': 'Simülatörleri filtrele',
  'Filter topology': 'Süzgeç topolojisi',
  'filtered': 'süzülmüş',
  'Filters & Signals': 'Filtreler ve Sinyaller',
  'Finer': 'Daha hassas',
  'First-order RC response in time and frequency, with live scope traces.':
    'Birinci derece RC tepkisi, zaman ve frekans düzleminde, canlı osiloskop izleriyle.',
  'fixed': 'sabit',
  'Float voltage': 'Yüzdürme gerilimi',
  'Flow (hot side)': 'Gidiş (sıcak taraf)',
  'Flyback clamp': 'Geri tepme kırpıcısı',
  'For a 32.768 kHz timekeeping crystal, 20 ppm is about 1.7 seconds a day, or ten minutes a year. If that matters, either trim the capacitors or use a temperature compensated module: temperature drift will typically dwarf the load error anyway, since a watch crystal has a parabolic tempco of about -0.035 ppm per °C squared.':
    "32,768 kHz'lik bir zaman tutma kristali için 20 ppm günde yaklaşık 1,7 saniye, yılda on dakikadır. Bu önemliyse ya kondansatörleri ayarlayın ya da sıcaklık dengelemeli bir modül kullanın: bir saat kristalinin °C karesi başına yaklaşık -0,035 ppm'lik parabolik sıcaklık katsayısı olduğundan, sıcaklık kayması zaten genellikle yük hatasını gölgede bırakır.",
  'For LEDs pick frequency above about 200 Hz to avoid visible flicker, and well above that if the light will ever be filmed. For motors, above 20 kHz puts the switching whine out of hearing, but check the resolution you have left at that frequency.':
    "LED'ler için görünür titremeyi önlemek üzere frekansı yaklaşık 200 Hz'in üstünde seçin, ışık kameraya girecekse epey üstünde. Motorlarda 20 kHz üstü anahtarlama uğultusunu duyulmaz kılar, ama o frekansta elinizde kalan çözünürlüğü denetleyin.",
  'Force both legs': 'İki bacağı da zorla',
  'Force every phase to 0': 'Tüm fazları 0 yap',
  'forward active': 'ileri aktif',
  'Forward voltage Vf': 'İleri gerilim Vf',
  'Four and five band colours plus 3-digit, 4-digit and EIA-96 SMD codes.':
    'Dört ve beş bantlı renkler, ayrıca 3 haneli, 4 haneli ve EIA-96 SMD kodları.',
  'four-switch': 'dört anahtarlı',
  'Fourier series preset': 'Fourier serisi ön ayarı',
  'Frame rate': 'Çerçeve hızı',
  'Frames shown': 'Gösterilen çerçeve',
  'free': 'serbest',
  'free air, single run': 'serbest hava, tek hat',
  'Free space path loss': 'Boş uzay yol kaybı',
  'Free space path loss is `20·log10(d_km) + 20·log10(f_MHz) + 32.44`. Two consequences worth internalising: doubling the distance costs 6 dB, and so does doubling the frequency. That second one is why 868 MHz reaches so much further than 2.4 GHz at the same power, before you even consider that lower frequencies penetrate obstacles better.':
    "Boş uzay yol kaybı `20·log10(d_km) + 20·log10(f_MHz) + 32.44` ile bulunur. İçselleştirmeye değer iki sonucu var: uzaklığı iki katına çıkarmak 6 dB'ye mal olur, frekansı iki katına çıkarmak da öyle. İkincisi, aynı güçte 868 MHz'in 2,4 GHz'den neden bu kadar uzağa ulaştığını açıklar; üstelik daha düşük frekansların engelleri daha iyi geçtiğini hesaba katmadan önce.",
  'Free space, 1.00': 'Boş uzay, 1,00',
  'Free-space path loss against receiver sensitivity, with the fade margin.':
    'Alıcı hassasiyetine karşı serbest uzay yol kaybı, sönümleme payıyla.',
  'freewheel to zero': 'sıfıra serbest sönüm',
  'Frequency': 'Frekans',
  'Frequency error': 'Frekans hatası',
  'Frequency f0': 'Frekans f0',
  'Frequency is `1.44 / ((R1 + 2·R2)·C)`. The 0.693 is ln2, from the capacitor crossing between the 1/3 and 2/3 Vcc comparator trip points, which is a factor of two in the remaining distance to the rail.':
    "Frekans `1.44 / ((R1 + 2·R2)·C)` ile bulunur. 0,693 sayısı ln2'dir ve kondansatörün 1/3 ile 2/3 Vcc karşılaştırıcı eşikleri arasında geçmesinden gelir; bu da hatta kalan uzaklıkta iki katlık bir orandır.",
  'From': 'Başlangıç',
  'from the 3 mA sink limit': '3 mA çekme sınırından',
  'from the rise-time limit': 'yükselme süresi sınırından',
  'From there `IC = hFE·IB`, `IE = (hFE+1)·IB` and `VCE = VCC - IC·RC - IE·RE`. Put VCE somewhere near the middle of the rail so the output can swing both ways.':
    "Oradan `IC = hFE·IB`, `IE = (hFE+1)·IB` ve `VCE = VCC - IC·RC - IE·RE` çıkar. VCE'yi hattın ortasına yakın bir yere koyun ki çıkış iki yöne de salınabilsin.",
  'From there, `BW = f0 / Q`, `zeta = 1 / (2Q) = alpha / w0` and the ring frequency is `wd = w0·sqrt(1 - zeta²)`. zeta below 1 rings, zeta at 1 is critical damping (fastest settle with no overshoot), zeta above 1 crawls in without ringing. First peak overshoot is `exp(-pi·zeta / sqrt(1 - zeta²))`, which is 100% at zeta = 0 and why a lossless step doubles the supply.':
    "Oradan `BW = f0 / Q`, `zeta = 1 / (2Q) = alpha / w0` çıkar ve çınlama frekansı `wd = w0·sqrt(1 - zeta²)` olur. zeta 1'in altındaysa çınlar, 1'e eşitse kritik sönümdür (aşımsız en hızlı oturma), 1'in üstündeyse çınlamadan sürünerek gelir. İlk tepe aşımı `exp(-pi·zeta / sqrt(1 - zeta²))` olup zeta = 0'da %100'dür; kayıpsız bir basamağın beslemeyi ikiye katlamasının nedeni budur.",
  'Full power bandwidth': 'Tam güç bant genişliği',
  'Full scale': 'Tam ölçek',
  'Full voltage': 'Dolu gerilimi',
  'Full wave': 'Tam dalga',
  'Fundamental': 'Temel bileşen',
  'Fundamentals': 'Temeller',
  'Gain at {frequency}': '{frequency} frekansında kazanç',
  'Gain bandwidth': 'Kazanç bant genişliği',
  'Gate charge Qg': 'Kapı yükü Qg',
  'Gate charge time': 'Kapı yükleme süresi',
  'Gate drive': 'Kapı sürüşü',
  'Gate drive margin, operating region, conduction and switching losses.':
    'Geyt sürüş payı, çalışma bölgesi, iletim ve anahtarlama kayıpları.',
  'Gate drive matters. With a 1.3 V threshold, a 3.3 V low rail gives 2 V of overdrive and works well. A 1.8 V rail leaves only 0.5 V, which is marginal and drifts with temperature.':
    "Kapı sürüşü önemlidir. 1,3 V eşikle, 3,3 V'luk bir alt hat 2 V aşırı sürüş verir ve iyi çalışır. 1,8 V'luk bir hat yalnızca 0,5 V bırakır; bu sınırdadır ve sıcaklıkla kayar.",
  'Gate drive power': 'Kapı sürüş gücü',
  'Gate drive VGS': 'Kapı sürüşü VGS',
  'Gate overdrive': 'Kapı aşırı sürüşü',
  'Gate resistor Rg': 'Kapı direnci Rg',
  'Gauge': 'Kalınlık',
  'Getting 3.3 V and 5 V parts to talk. The scope shows the rising edge at the low-side receiver against its logic-high threshold: if the curve does not clear the line quickly, the link is unreliable however correct the DC levels look.':
    '3.3 V ve 5 V parçaları konuşturmak. Osiloskop, alçak taraf alıcısındaki yükselen kenarı lojik yüksek eşiğiyle birlikte gösterir: eğri çizgiyi hızla geçmiyorsa, DC seviyeleri ne kadar doğru görünürse görünsün bağlantı güvenilmezdir.',
  'Glitches rejected up to': 'Şuna kadar gürültü elenir',
  'gold, 5%': 'altın, %5',
  'good': 'iyi',
  'GPS L1 1575 MHz': 'GPS L1 1575 MHz',
  'Grease 0.2, pad 0.5, dry contact 1.0 on a TO-220. Use 0.01 for a soldered tab.':
    "TO-220'de macun 0,2, ped 0,5, kuru temas 1,0. Lehimli tırnak için 0,01 kullanın.",
  'Grease alone 0.5, silicone pad 2, mica plus grease 1.4.':
    'Yalnız macun 0,5, silikon ped 2, mika artı macun 1,4.',
  'green': 'yeşil',
  'Green (GaP, older)': 'Yeşil (GaP, eski)',
  'Green (InGaN)': 'Yeşil (InGaN)',
  'grey': 'gri',
  'Ground leg Rg': 'Toprak bacağı Rg',
  'Ground radial': 'Toprak radyali',
  'H1 fundamental': 'H1 temel bileşen',
  'half': 'yarım',
  'Half and full wave with a smoothing cap. Ripple, PIV and diode dissipation.':
    'Filtre kondansatörlü yarım ve tam dalga. Dalgalanma, PIV ve diyot güç kaybı.',
  'Half power band': 'Yarı güç bandı',
  'Half wave': 'Yarım dalga',
  'Half wave pulls DC through the secondary, which walks the transformer core toward saturation. Fine for a few milliamps, not for a supply.':
    'Yarım dalga, ikincil üzerinden DC çeker ve bu da trafo çekirdeğini doyuma doğru yürütür. Birkaç miliamper için uygundur, bir güç kaynağı için değil.',
  'Half wave, full wave bridge or centre tapped, into a reservoir cap and a resistive load. The scope shows the secondary, the smoothed output and what the same rectifier gives with the cap removed.':
    'Yarım dalga, tam dalga köprü veya orta uçlu doğrultma; filtre kondansatörü ve dirençli yük ile. Osiloskop sekonderi, düzleştirilmiş çıkışı ve aynı doğrultucunun kondansatör çıkarıldığında verdiği sonucu gösterir.',
  'Hall-effect parts like the ACS712 avoid the burden entirely by measuring the magnetic field, giving full isolation. The price is offset drift, noise, and a zero point that sits at half the supply, so they are good for amps and poor for milliamps.':
    'ACS712 gibi Hall etkili parçalar manyetik alanı ölçerek yük payını tamamen ortadan kaldırır ve tam yalıtım sağlar. Bedeli ise ofset kayması, gürültü ve beslemenin yarısında duran bir sıfır noktasıdır; bu yüzden amperler için iyi, miliamperler için kötüdürler.',
  'handed back each cycle': 'her çevrimde geri verilen',
  'Hang RL on it and the lower leg becomes `R2||RL`, giving `Vout = Vin·(R2||RL)/(R1 + R2||RL)`. Equivalently the source divides against its own impedance: `Vout·RL/(RL + Zout)`. The error is therefore `-Zout/(Zout + RL)`, which is -50% at RL = Zout, -9.1% at 10x and -1% at 100x.':
    "Üzerine RL asın, alt bacak `R2||RL` olur ve `Vout = Vin·(R2||RL)/(R1 + R2||RL)` verir. Eşdeğer olarak kaynak kendi empedansına karşı bölünür: `Vout·RL/(RL + Zout)`. Dolayısıyla hata `-Zout/(Zout + RL)` olur; RL = Zout iken %-50, 10 katında %-9,1, 100 katında %-1'dir.",
  'hard on': 'tam iletimde',
  'Harmonic amplitudes': 'Harmonik genlikleri',
  'Harmonics Synthesiser': 'Harmonik Sentezleyici',
  'Harvest per day': 'Günlük hasat',
  'Headroom': 'Pay',
  'headroom {headroom}': 'pay {headroom}',
  'Headroom is the whole design question. Differentiating the loop equation gives `dI/dVf = -1/R`, so a {spread} bin-to-bin Vf shift changes the current by `0.1 / R` amps, i.e. by `0.1 / (Vs - Vf)` as a fraction. With a 3.2 V white LED on 3.3 V that is 100% of the current, which is exactly why white and blue parts want a driver rather than a resistor from 3.3 V.':
    "Tasarımın tüm meselesi paydır. Çevrim denkleminin türevi `dI/dVf = -1/R` verir, yani {spread} kadarlık bir grup farkı Vf kayması akımı `0.1 / R` amper, oransal olarak da `0.1 / (Vs - Vf)` kadar değiştirir. 3,3 V üzerindeki 3,2 V'luk beyaz bir LED'de bu, akımın %100'üdür; beyaz ve mavi parçaların 3,3 V'tan direnç yerine sürücü istemesinin nedeni tam olarak budur.",
  'Heat delivered': 'Verilen ısı',
  'Heat flow is the electrical analogy: power is current, temperature rise is voltage, thermal resistance in K/W is resistance. The three legs sit in series, so `Tj = Ta + P·(Rjc + Rcs + Rsa)`. Rjc comes from the package, Rcs from the mounting interface, Rsa from the heatsink and the air moving over it.':
    'Isı akışı elektriksel benzeşimdir: güç akımdır, sıcaklık artışı gerilimdir, K/W cinsinden ısıl direnç de dirençtir. Üç ayak seridir, yani `Tj = Ta + P·(Rjc + Rcs + Rsa)` olur. Rjc kılıftan, Rcs montaj arayüzünden, Rsa ise soğutucudan ve üzerinden geçen havadan gelir.',
  'Heat Pump / COP': 'Isı Pompası / COP',
  'Heatsink / Thermal': 'Soğutucu / Termal',
  'Heatsink fitted': 'Takılan soğutucu',
  'Heatsink needed': 'Gereken soğutucu',
  'Heatsink Rth': 'Soğutucu Rth',
  'High pass': 'Yüksek geçiren',
  'High side': 'Üst taraf',
  'Highest member voltage': 'En yüksek eleman gerilimi',
  'Highest Vout reachable': 'Ulaşılabilir en yüksek Vout',
  'highpass': 'yüksek geçiren',
  'Hold duty': 'Tutma görev çevrimi',
  'How fast the switch opens. This alone sets di/dt.':
    "Anahtarın ne kadar hızlı açıldığı. di/dt'yi tek başına bu belirler.",
  'Hysteresis band': 'Histerezis bandı',
  'Hz': 'Hz',
  'I coil': 'I bobin',
  'I diode': 'I diyot',
  'I no diode': 'I diyotsuz',
  'I switch': 'I anahtar',
  'I2C is open drain: devices only pull down, so a resistor has to pull back up and the bus capacitance fights it. The scope shows the rising edge after a device releases the line, against the edge an ideally sized pull-up would give.':
    'I2C açık drenajlıdır: cihazlar yalnızca aşağı çeker, bu yüzden hattı yukarı çekmek bir dirence düşer ve hat kapasitesi buna direnir. Osiloskop, bir cihaz hattı bıraktıktan sonraki yükselen kenarı, ideal boyutlu bir pull-up direncinin vereceği kenarla birlikte gösterir.',
  'I2C Pull-Up Resistor': 'I2C Pull-Up Direnci',
  'I²R, {ratingLabel} part': 'I²R, {ratingLabel} parça',
  'Iadj is 50 µA typical. With R1 at 240 Ω the program current is 5.2 mA, a hundred times larger, so the Iadj term is a rounding error. Scale the divider into the tens of kilohms to save power and Iadj becomes a first-order term that also drifts with temperature: 10 k over 10 k reads 3.0 V, not the 2.5 V the ratio promises.':
    "Iadj tipik olarak 50 µA'dir. R1 240 Ω iken program akımı 5,2 mA, yani yüz kat büyüktür ve Iadj terimi bir yuvarlama hatasından ibarettir. Güç tasarrufu için bölücüyü onlarca kiloohma çıkarın; o zaman Iadj sıcaklıkla da kayan birinci derece bir terime dönüşür: 10 k üstü 10 k, oranın vaat ettiği 2,5 V'u değil 3,0 V'u okur.",
  'IB {ib}': 'IB {ib}',
  'Icap': 'Icap',
  'Ideal': 'İdeal',
  'ideal {dutyIdeal}%': 'ideal {dutyIdeal}%',
  'ideal 1 - Vin/Vout = {dutyIdeal}': 'ideal 1 - Vin/Vout = {dutyIdeal}',
  'Ideal closed-loop gain with the three limits that actually bite: gain bandwidth product, slew rate and output swing. The scope shows Vin against Vout in real time.':
    'İdeal kapalı çevrim kazancı ve gerçekten sınırlayan üç etken: kazanç-bant genişliği çarpımı, yükselme hızı ve çıkış salınımı. Osiloskop, Vin ile Vout izlerini gerçek zamanlı gösterir.',
  'ideal R': 'ideal R',
  'Ideal resistor': 'İdeal direnç',
  'Ideality n': 'İdeallik n',
  'IL': 'IL',
  'IL max': 'IL max',
  'IL min': 'IL min',
  'imaginary part': 'sanal kısım',
  'Imp': 'Imp',
  'Imp²·Rs': 'Imp²·Rs',
  'Impedance against frequency for an R, L and C together. The scope sweeps FREQUENCY logarithmically, not time: each horizontal division is a fixed fraction of a decade, centred on the frequency you set. Magnitude is in ohms, phase in degrees.':
    'Birlikte bağlı R, L ve C için frekansa karşı empedans. Osiloskop zamanı değil FREKANSI logaritmik olarak tarar: her yatay bölme, ayarladığınız frekansa ortalanmış sabit bir dekat kesridir. Genlik ohm, faz derece cinsindendir.',
  'Impedance Z0': 'Empedans Z0',
  'In a series string the voltage divides inversely with capacitance, `Vi = V·Ctotal/Ci`, so the smallest capacitor takes the most volts. That is the usual failure mode when caps are stacked for a higher working voltage.':
    'Seri bir dizide gerilim kapasitansla ters orantılı bölünür, `Vi = V·Ctoplam/Ci`, yani en küçük kondansatör en çok volta maruz kalır. Kondansatörler daha yüksek çalışma gerilimi için üst üste bindirildiğinde alışılmış arıza biçimi budur.',
  'In steady state the inductor has to reset every cycle, so the volt-seconds put in must come back out: `Vin·D·T = (Vout - Vin)·(1-D)·T`, which rearranges to `D = 1 - Vin/Vout`. The output cap has the matching constraint on charge: the diode only conducts for `(1-D)` of the period, so the average inductor current is `Iin = Iout/(1-D)`. Power in equals power out, so stepping the voltage up steps the input current up by the same ratio. That current runs through the inductor, the switch and the diode, which is why a boost stresses its parts far harder than its output rating suggests.':
    'Kararlı durumda bobinin her çevrimde sıfırlanması gerekir, yani içeri konan volt-saniye geri çıkmalıdır: `Vin·D·T = (Vout - Vin)·(1-D)·T`, bu da `D = 1 - Vin/Vout` şeklinde düzenlenir. Çıkış kondansatörünün yük üzerinde buna eşlik eden bir kısıtı vardır: diyot çevrimin yalnızca `(1-D)` kadarında iletir, bu yüzden ortalama bobin akımı `Iin = Iout/(1-D)` olur. Giren güç çıkan güce eşittir, yani gerilimi yükseltmek giriş akımını aynı oranda yükseltir. O akım bobinden, anahtardan ve diyottan geçer; bir yükselticinin parçalarını çıkış değerinin ima ettiğinden çok daha fazla zorlamasının nedeni budur.',
  'INA219 (digital)': 'INA219 (sayısal)',
  'Include supply tolerance and ripple peaks.':
    'Besleme toleransını ve dalgalanma tepelerini de katın.',
  'Inductance': 'Endüktans',
  'Inductive': 'Endüktif',
  'Inductive first-order filter, the dual of the RC case.':
    'Endüktif birinci derece filtre, RC durumunun ikizi.',
  'Inductor': 'Bobin',
  'Inductor average': 'Bobin ortalaması',
  'Inductor current through one switching period. The horizontal axis is time inside the switching cycle, not the output waveform, so a full trace is a few microseconds wide.':
    'Bir anahtarlama periyodu boyunca bobin akımı. Yatay eksen çıkış dalga şekli değil, anahtarlama çevrimi içindeki zamandır, bu yüzden tam bir iz birkaç mikrosaniye genişliğindedir.',
  'Inductor DCR': 'Bobin DCR',
  'Inductor Isat': 'Bobin Isat',
  'Inductor L': 'Bobin L',
  'Inductor peak': 'Bobin tepesi',
  'Inductor ripple': 'Bobin dalgalanması',
  'Inductor ripple ΔIL': 'Bobin dalgalanması ΔIL',
  'Inductor RMS': 'Bobin RMS',
  'Industrial installations billed for reactive power, motor loads, and understanding why a 3 kW motor needs more than 3 kVA of supply. The cable loss comparison is the practical payoff, since correcting power factor reduces current and the loss falls with its square.':
    'Reaktif güç üzerinden faturalandırılan endüstriyel tesisler, motor yükleri ve 3 kWlık bir motorun neden 3 kVAdan fazla beslemeye ihtiyaç duyduğunu anlamak. Pratik kazanç kablo kaybı karşılaştırmasıdır, çünkü güç katsayısını düzeltmek akımı azaltır ve kayıp akımın karesiyle düşer.',
  'Infrared 940 nm': 'Kızılötesi 940 nm',
  'Injection points': 'Enjeksiyon noktası',
  'Input': 'Giriş',
  'Input B level': 'B girişi seviyesi',
  'Input B R2': 'B girişi R2',
  'Input current': 'Giriş akımı',
  'Input current Iin': 'Giriş akımı Iin',
  'Input impedance': 'Giriş empedansı',
  'Input is below the {vinMinimum} needed to hold this output at this load. The regulator runs at maximum duty and the output simply follows the input down, minus the switch drop.':
    'Giriş, bu çıkışı bu yükte tutmak için gereken {vinMinimum} değerinin altında. Regülatör en büyük görev çevriminde çalışır ve çıkış, anahtar düşümü çıkarıldıktan sonra girişi aşağı doğru izler.',
  'Input of {amplitude} peak exceeds the {maxInput} this Q point can amplify without clipping, which is the flat top on the trace.':
    '{amplitude} tepe giriş, bu Q noktasının kırpmadan yükseltebileceği {maxInput} sınırını aşıyor; iz üzerindeki düz tepe de bu.',
  'Input range': 'Giriş aralığı',
  'Input resistance of whatever the tap drives.': 'Orta ucun sürdüğü şeyin giriş direnci.',
  'Input Rin': 'Giriş Rin',
  'Input signal': 'Giriş işareti',
  'Input Vin': 'Giriş Vin',
  'Input voltage': 'Giriş gerilimi',
  'Input-to-output differential is {headroom}, past the {V_IO_MAX} absolute maximum. The part fails regardless of how cool you keep it.':
    'Giriş-çıkış farkı {headroom}, mutlak en büyük değer olan {V_IO_MAX} değerinin ötesinde. Ne kadar serin tutarsanız tutun parça bozulur.',
  'Inrush current': 'Ani akım',
  'Inrush is {peakCurrent}, over the {GPIO_MAX_MA} mA an ESP32 GPIO is rated for. An uncharged capacitor is a short circuit at t = 0, so drive it through a bigger resistor or a transistor.':
    "Ani akım {peakCurrent}, bir ESP32 GPIO'sunun dayandığı {GPIO_MAX_MA} mA sınırının üzerinde. Boş bir kondansatör t = 0 anında kısa devredir, bu yüzden onu daha büyük bir dirençten ya da bir transistörden sürün.",
  'Inside a sealed enclosure, 20 K above the room is normal.':
    'Kapalı bir muhafaza içinde oda sıcaklığının 20 K üstü olağandır.',
  'integrator': 'integral alıcı',
  'Integrator': 'İntegral alıcı',
  'Integrator unity gain': 'İntegral alıcı birim kazancı',
  'Interface Rth': 'Arayüz Rth',
  'internal': 'iç',
  'Internal': 'İç katman',
  'Internal layers have no air on either side, so IPC halves the constant and the trace needs about 2.7 times the cross-section for the same rise. Route high-current nets on outer layers where you can.':
    'İç katmanların iki yanında da hava yoktur, bu yüzden IPC sabiti yarıya indirir ve yol, aynı artış için yaklaşık 2,7 kat kesit ister. Yüksek akımlı hatları elinizden geldiğince dış katmanlardan geçirin.',
  'inverting': 'eviren',
  'Inverting': 'Evrilen',
  'Inverting and four-switch topologies across the full input range.':
    'Tüm giriş aralığında evirici ve dört anahtarlı topolojiler.',
  'Inverting, non-inverting, summing, difference, integrator and comparator modes.':
    'Evirici, evirmeyen, toplayıcı, fark, integral alıcı ve karşılaştırıcı modları.',
  'Iout': 'Iout',
  'IPC-2221 is a curve fit to measured data, not a derivation: `I = k · dT^0.44 · A^0.725` with A in square mils. Inverted, the cross-section you need is `A = (I / (k·dT^0.44))^(1/0.725)`. The constant k is 0.048 for external traces and 0.024 for internal ones, because an inner layer is buried in laminate and can only shed heat sideways.':
    "IPC-2221 bir türetme değil, ölçülmüş veriye uydurulmuş bir eğridir: A mil kare cinsinden olmak üzere `I = k · dT^0.44 · A^0.725`. Tersine çevrildiğinde gereken kesit `A = (I / (k·dT^0.44))^(1/0.725)` olur. k sabiti dış yollar için 0,048, iç yollar için 0,024'tür; çünkü bir iç katman lamine içine gömülüdür ve ısıyı yalnızca yanlara atabilir.",
  "IPC-2221 trace sizing. Note this is a thermal limit, not a damage limit: the width is whatever keeps the copper's temperature rise under the figure you allow. Check the voltage drop separately, it often matters more.":
    'IPC-2221 yol boyutlandırma. Bunun bir hasar sınırı değil termal sınır olduğunu unutmayın: genişlik, bakırın sıcaklık artışını izin verdiğiniz değerin altında tutan değerdir. Gerilim düşümünü ayrıca kontrol edin, çoğu zaman daha önemlidir.',
  'IPC-2221 width for a current and temperature rise, internal or external.':
    'Bir akım ve sıcaklık artışı için IPC-2221 genişliği, iç veya dış katman.',
  'Irect': 'Irect',
  'irf540n': 'irf540n',
  'irlz44n': 'irlz44n',
  'Irradiance': 'Işınım',
  'Isat {isat}': 'Isat {isat}',
  'Isc': 'Isc',
  'Isw': 'Isw',
  'Iz min (knee)': 'Iz min (dizin)',
  'Iz worst case max': 'En kötü durumda en büyük Iz',
  'Iz worst case min': 'En kötü durumda en küçük Iz',
  'Junction at {tj} °C, past the {TJ_MAX} °C limit. It will shut down thermally. Improve airflow, add a heatsink, or reduce the load.':
    "Jonksiyon {tj} °C'de, {TJ_MAX} °C sınırının ötesinde. Isıl olarak kapanacaktır. Hava akışını iyileştirin, soğutucu ekleyin ya da yükü azaltın.",
  'Junction at {tjK}, over the {TJ_MAX_K} limit. It may keep regulating but it is out of spec and its life is being spent fast. Needs {topology} , a lower Vin, or under {ioutCeiling} of load.':
    'Jonksiyon {tjK} değerinde, {TJ_MAX_K} sınırının üzerinde. Regüle etmeyi sürdürebilir ama belirtim dışıdır ve ömrü hızla tükenmektedir. {topology} , daha düşük bir Vin ya da {ioutCeiling} altında yük gerekir.',
  'Junction at {tjK}, past the internal thermal shutdown near 175 C. The regulator will fold the output back and oscillate in and out of shutdown rather than sit there. Shed {pdMax} or fit a better sink.':
    'Jonksiyon {tjK} değerinde, 175 C civarındaki içsel ısıl kapanmanın ötesinde. Regülatör orada durmak yerine çıkışı geri kısar ve kapanıp açılarak salınır. {pdMax} kadarını atın ya da daha iyi bir soğutucu takın.',
  'Junction is at {tj} °C, past the 150 °C rating. Add a heatsink (lower Rth), lower the current, or improve the gate drive.':
    "Jonksiyon {tj} °C'de, 150 °C değerinin ötesinde. Soğutucu ekleyin (Rth'yi düşürün), akımı azaltın ya da kapı sürüşünü iyileştirin.",
  'Junction temp': 'Jonksiyon sıcaklığı',
  'Junction temperature': 'Jonksiyon sıcaklığı',
  'Junction temperature from dissipation and the thermal resistance chain.':
    'Güç kaybı ve termal direnç zincirinden jonksiyon sıcaklığı.',
  'Junction temperature through the Rjc, Rcs, Rsa chain. The scope shows the warm-up from a cold start, so the horizontal axis is time in seconds, not a waveform: the die steps up instantly and then rides the heatsink as it soaks.':
    'Rjc, Rcs, Rsa zinciri üzerinden jonksiyon sıcaklığı. Osiloskop soğuk başlangıçtan itibaren ısınmayı gösterir, dolayısıyla yatay eksen bir dalga şekli değil saniye cinsinden zamandır: çip anında sıçrar, sonra soğutucu ısındıkça onunla birlikte yükselir.',
  'Junction Tj': 'Jonksiyon Tj',
  'Kanthal A1 (FeCrAl)': 'Kanthal A1 (FeCrAl)',
  'Keep the element clear of ground, metal and your hand. Detuning by proximity is the most common reason a bench-tested link fails once the board is in a case.':
    'Elemanı topraktan, metalden ve elinizden uzak tutun. Yakınlıktan kaynaklanan akort bozulması, tezgahta sınanmış bir bağlantının kart kutuya girdikten sonra çalışmamasının en yaygın nedenidir.',
  'Kick, unclamped': 'Kırpılmamış geri tepme',
  'L at DCM boundary': 'DCM sınırındaki L',
  'L for 40% ripple': '%40 dalgalanma için L',
  'L needed for CCM': 'CCM için gereken L',
  'lagging': 'geri kalan',
  'Language': 'Dil',
  'Layer': 'Katman',
  'Laying out any board that carries more than a few hundred milliamps: power rails, motor drives, LED strips. It is a thermal limit rather than a damage limit, so it tells you how hot the copper gets, and it flags separately that voltage drop is often the real constraint on long low-voltage traces.':
    'Birkaç yüz miliamperden fazla taşıyan her kartın yerleşimi: güç hatları, motor sürücüleri, LED şeritler. Bu bir hasar sınırı değil termal sınırdır, bu yüzden bakırın ne kadar ısındığını söyler ve uzun düşük gerilimli yollarda asıl kısıtın çoğu zaman gerilim düşümü olduğunu ayrıca belirtir.',
  'ldo': 'ldo',
  'Lead acid (SLA)': 'Kurşun asit (SLA)',
  'leading': 'önceleyen',
  'leaked through Rsh': 'Rsh üzerinden sızan',
  'LED': 'LED',
  'LED count': 'LED sayısı',
  'LED power': 'LED gücü',
  'LED Series Resistor': 'LED Seri Direnci',
  'LED with series resistor': 'Seri dirençli LED',
  'LEDC timer': 'LEDC zamanlayıcısı',
  'LEDs per metre': 'Metre başına LED',
  'Length': 'Uzunluk',
  'Less common than RC because inductors are bulky and expensive, but unavoidable where current rather than voltage must be smoothed: motor drive filters, switch-mode converter output stages, and EMI chokes on supply leads. Also the natural model for any winding you did not intend to be a filter, such as a long cable pair or a relay coil.':
    'Bobinler hacimli ve pahalı olduğu için RC kadar yaygın değildir, ancak gerilim yerine akımın düzleştirilmesi gerektiğinde kaçınılmazdır: motor sürücü filtreleri, anahtarlamalı dönüştürücü çıkış katları ve besleme hatlarındaki EMI bobinleri. Ayrıca filtre olmasını istemediğiniz her sargının, örneğin uzun bir kablo çiftinin veya röle bobininin, doğal modelidir.',
  'Li-ion 18650': 'Li-ion 18650',
  'LiFePO4': 'LiFePO4',
  'Lifted from outside': 'Dışarıdan çekilen',
  'limit {maxCapacitance}': 'sınır {maxCapacitance}',
  'limit {maxRise}': 'sınır {maxRise}',
  'limit {maxTemp} °C': 'sınır {maxTemp} °C',
  'Limits': 'Sınırlar',
  'Line current': 'Hat akımı',
  'Line voltage': 'Hat gerilimi',
  'Linear regulator': 'Doğrusal regülatör',
  'Linear Regulator (LM317)': 'Lineer Regülatör (LM317)',
  'Link margin': 'Bağlantı payı',
  'LiPo Charger (TP4056)': 'LiPo Şarj Devresi (TP4056)',
  'LiPo pouch': 'LiPo poşet',
  'Lithium charging is constant current then constant voltage. During CC the current is fixed and the cell voltage climbs. Once it reaches 4.2 V the charger holds that voltage instead and the current decays as the cell fills. Charging stops when the current falls to about a tenth of the set value.':
    "Lityum şarjı önce sabit akım, sonra sabit gerilimdir. CC sırasında akım sabittir ve hücre gerilimi tırmanır. 4,2 V'a ulaştığında şarj devresi bunun yerine gerilimi sabit tutar ve hücre doldukça akım söner. Akım ayarlanan değerin yaklaşık onda birine düştüğünde şarj durur.",
  'LM2596 Module': 'LM2596 Modülü',
  'LM317 adjustable regulator': 'LM317 ayarlanabilir regülatör',
  'Load': 'Yük',
  'Load actually seen': 'Gerçekte görülen yük',
  'Load cap pick from the crystal spec, plus the frequency pull it causes.':
    'Kristal özelliğinden yük kondansatörü seçimi ve yol açtığı frekans kayması.',
  'Load connected': 'Yük bağlı',
  'Load current': 'Yük akımı',
  'Load current ceiling': 'Yük akımı tavanı',
  'Load error': 'Yük hatası',
  'Load Iout': 'Yük Iout',
  'Load power': 'Yük gücü',
  'Load profile': 'Yük profili',
  'Load rail': 'Yük hattı',
  'Load resistance': 'Yük direnci',
  'Load type': 'Yük tipi',
  'Load typical package': 'Yükle, tipik kılıf',
  'Loading simulator...': 'Simülatör yükleniyor...',
  'logic': 'mantık',
  'Logic Level Shifter': 'Lojik Seviye Dönüştürücü',
  'Logic supply': 'Mantık beslemesi',
  'Looking back into the output with the supply shorted, each pair is in parallel: `Rth = R1||R2 + R3||R4`. That is what a load sees, so a real load pulls the output down by `Rl/(Rth+Rl)`. Neither tap is at ground, so a single-ended ADC pin cannot read Vout directly, it needs a differential amplifier.':
    "Besleme kısa devre edilmişken çıkıştan geriye bakıldığında her çift paraleldir: `Rth = R1||R2 + R3||R4`. Bir yükün gördüğü budur, yani gerçek bir yük çıkışı `Rl/(Rth+Rl)` oranında aşağı çeker. Orta uçların hiçbiri toprakta değildir, bu yüzden tek uçlu bir ADC pini Vout'u doğrudan okuyamaz, bir fark yükseltecine ihtiyaç duyar.",
  'Looking back into the tap with the supply shorted, R1 and R2 appear in parallel, so the Thevenin source impedance is `Zout = R1·R2/(R1+R2)`. That is the whole reason a divider is not a regulator.':
    'Besleme kısa devre edilmişken orta uçtan geriye bakıldığında R1 ile R2 paralel görünür, yani Thevenin kaynak empedansı `Zout = R1·R2/(R1+R2)` olur. Bir bölücünün regülatör olmamasının tüm nedeni budur.',
  'Loop resistance': 'Çevrim direnci',
  'LoRa 433 MHz': 'LoRa 433 MHz',
  'LoRa 868 MHz (EU)': 'LoRa 868 MHz (AB)',
  'LoRa 915 MHz (US)': 'LoRa 915 MHz (ABD)',
  'LoRa SF12 125 kHz': 'LoRa SF12 125 kHz',
  'LoRa SF7 125 kHz': 'LoRa SF7 125 kHz',
  'LoRa SF9 125 kHz': 'LoRa SF9 125 kHz',
  'Losing {vDrop}, which is {dropFraction}% of the supply. Above about 3% most loads misbehave: regulators drop out, motors lose torque, and LED strips visibly dim toward the far end.':
    "{vDrop} yitiriliyor, bu da beslemenin %{dropFraction} kadarı. Yaklaşık %3'ün üzerinde çoğu yük yanlış davranır: regülatörler düşüm sınırına girer, motorlar tork yitirir ve LED şeritleri uzak uca doğru gözle görülür biçimde kararır.",
  'loss {total}': 'kayıp {total}',
  'Loss in pack': 'Pakette kayıp',
  'Loss in R per charge': "Şarj başına R'deki kayıp",
  'Loss in the IC': 'Tümdevredeki kayıp',
  'Loss: catch diode': 'Kayıp: yakalama diyodu',
  'Loss: high side FET': 'Kayıp: üst taraf FET',
  'Loss: inductor DCR': 'Kayıp: bobin DCR',
  'Loss: low side FET': 'Kayıp: alt taraf FET',
  'Loss: switching': 'Kayıp: anahtarlama',
  'Losses and rating': 'Kayıplar ve anma değeri',
  'Losses put this output out of reach at this load: the duty needed exceeds what the stage can hold. Lower the load current, raise the input, or cut the resistive losses (lower DCR and Rds(on)).':
    'Kayıplar bu çıkışı bu yükte ulaşılamaz kılıyor: gereken görev çevrimi katın tutabileceğini aşıyor. Yük akımını azaltın, girişi yükseltin ya da dirençsel kayıpları kesin (daha düşük DCR ve Rds(on)).',
  'Losses split three ways. Conduction is `Pcond = D·Id²·RDS(on)`. Crossover is `Psw = 0.5·VDS·Id·(tr + tf)·fsw`, taking each edge as a current rise at full voltage followed by a voltage fall at full current, which is the conservative clamped inductive case. Gate charge costs `Pgate = Qg·VGS·fsw`, dissipated in the gate resistor and the driving pin rather than in the FET. Only the first two heat the die, so `Tj = Ta + (Pcond + Psw)·Rth(j-a)`.':
    "Kayıplar üçe ayrılır. İletim `Pcond = D·Id²·RDS(on)` olur. Geçiş kaybı `Psw = 0.5·VDS·Id·(tr + tf)·fsw` olup her kenarı tam gerilimde bir akım yükselişi ve ardından tam akımda bir gerilim düşüşü olarak alır; bu, kırpılmış endüktif durumun tutucu hâlidir. Kapı yükü `Pgate = Qg·VGS·fsw` kadara mal olur ve FET'te değil kapı direnci ile süren pinde harcanır. Yongayı yalnızca ilk ikisi ısıtır, yani `Tj = Ta + (Pcond + Psw)·Rth(j-a)` olur.",
  'Low pass': 'Alçak geçiren',
  'Low side': 'Alt taraf',
  'Low side device': 'Alt taraf elemanı',
  'Low side N-channel MOSFET switch': 'Alt taraf N kanallı MOSFET anahtar',
  'Low side switched coil': 'Alt taraftan anahtarlanan bobin',
  'Lower threshold': 'Alt eşik',
  'lowpass': 'alçak geçiren',
  'Machine': 'Makine',
  'Magnitude is `|H| = 1 / sqrt(1 + (f/fc)²)` for the low pass and `(f/fc) / sqrt(1 + (f/fc)²)` for the high pass. Phase is `-atan(f/fc)` and `90° - atan(f/fc)` respectively.':
    'Genlik, alçak geçiren için `|H| = 1 / sqrt(1 + (f/fc)²)`, yüksek geçiren için `(f/fc) / sqrt(1 + (f/fc)²)` olur. Faz ise sırasıyla `-atan(f/fc)` ve `90° - atan(f/fc)` olur.',
  'Magnitude is `|H| = R / |Z|` for the low pass and `sqrt(Rw² + XL²) / |Z|` for the high pass, with `|Z| = sqrt((R + Rw)² + XL²)`. With a lossless winding those collapse to the familiar `1 / sqrt(1 + (f/fc)²)` and `(f/fc) / sqrt(1 + (f/fc)²)`, and phase to `-atan(f/fc)` and `90° - atan(f/fc)`.':
    'Genlik, alçak geçiren için `|H| = R / |Z|`, yüksek geçiren için `sqrt(Rw² + XL²) / |Z|` olur; burada `|Z| = sqrt((R + Rw)² + XL²)`. Kayıpsız bir sargıda bunlar bildik `1 / sqrt(1 + (f/fc)²)` ve `(f/fc) / sqrt(1 + (f/fc)²)` ifadelerine, faz da `-atan(f/fc)` ve `90° - atan(f/fc)` ifadelerine iner.',
  'Mains power supplies, isolation for safety, and impedance matching in audio and RF. The reflected impedance relation is the one people forget, and it is why a transformer is the standard way to match a low-impedance speaker or antenna to a high-impedance source.':
    'Şebeke güç kaynakları, güvenlik için yalıtım ve ses ile RFde empedans uyumlandırma. İnsanların unuttuğu bağıntı yansıyan empedanstır ve düşük empedanslı bir hoparlörü veya anteni yüksek empedanslı bir kaynağa uyumlandırmanın standart yolunun transformatör olmasının nedeni budur.',
  'Making a cheap analogue output from a microcontroller that has no DAC, which covers most ESP32 use: setting a reference voltage, driving an analogue meter, generating a control voltage for a fan or a valve. The trade-off is always the same, less ripple means slower settling, and this page shows you exactly where the knee is.':
    'DAC içermeyen bir mikrodenetleyiciden ucuz analog çıkış üretmek, ki bu çoğu ESP32 kullanımını kapsar: referans gerilim ayarlamak, analog gösterge sürmek, bir fan veya vana için kontrol gerilimi üretmek. Denge her zaman aynıdır, daha az dalgalanma daha yavaş oturma demektir ve bu sayfa kırılma noktasının tam olarak nerede olduğunu gösterir.',
  'Margin over Vth': 'Vth üzerindeki pay',
  'Margin to Tj max': "Tj max'a pay",
  'marginal': 'sınırda',
  'Mass times specific heat. Aluminium is 897 J/(kg·K), so 20 g is 18 J/K.':
    'Kütle çarpı özgül ısı. Alüminyum 897 J/(kg·K), yani 20 g 18 J/K eder.',
  'Matching series': 'Eşleşen seri',
  'max {maxCRate} C': 'en çok {maxCRate} C',
  'max {TJ_MAX} °C': 'en çok {TJ_MAX} °C',
  'Max bit rate': 'En yüksek bit hızı',
  'Max freq at this res': 'Bu çözünürlükte en yüksek frekans',
  'Max input (peak)': 'En büyük giriş (tepe)',
  'Max resolution at frame rate': 'Bu çerçeve hızında en yüksek çözünürlük',
  'Max retrigger rate': 'En yüksek yeniden tetikleme hızı',
  'Maximum press rate': 'En yüksek basış hızı',
  'Maximum R': 'En büyük R',
  'MCP6002 is 1 MHz. OPA2340 is 5.5 MHz.': "MCP6002 1 MHz'dir. OPA2340 5,5 MHz'dir.",
  'mean': 'ortalama',
  'Mean current': 'Ortalama akım',
  'Mean output': 'Ortalama çıkış',
  'Measuring current means turning it into a voltage the ADC can read, without stealing too much of the supply doing it. The shunt is a compromise between burden voltage, dissipation and resolution.':
    "Akımı ölçmek, beslemeden fazla pay çalmadan onu ADC'nin okuyabileceği bir gerilime çevirmek demektir. Şönt; yük gerilimi, güç kaybı ve çözünürlük arasında bir uzlaşmadır.",
  'Method': 'Yöntem',
  'Mid rail on a single supply, 0 V on a split supply.':
    'Tek beslemede orta hat, çift beslemede 0 V.',
  'Midband gain is `Av = -RC / (RE + re)` where `re = VT/IE` is the intrinsic emitter resistance, about 26 mV over the emitter current. With RE much larger than re this is the familiar `-RC/RE`, set by resistors and therefore stable. Bypassing RE shorts it at signal frequencies, leaving `-RC/re`: much more gain, but now it moves with bias current and temperature.':
    "Orta bant kazancı `Av = -RC / (RE + re)` şeklindedir; burada `re = VT/IE` içsel emiter direncidir, emiter akımına bölünen yaklaşık 26 mV. RE, re'den çok büyük olduğunda bu, dirençlerle belirlenen ve bu yüzden kararlı olan bildik `-RC/RE` ifadesine iner. RE'yi baypaslamak onu işaret frekanslarında kısa devre eder ve geriye `-RC/re` kalır: çok daha fazla kazanç, ama artık kutuplama akımı ve sıcaklıkla birlikte kayan bir kazanç.",
  'Miller plateau': 'Miller platosu',
  'min {ibMin}': 'en az {ibMin}',
  'minimum': 'en az',
  'Minimum R': 'En küçük R',
  'Minimum Vin': 'En küçük Vin',
  'Mode': 'Kip',
  'Model parameters': 'Model parametreleri',
  'monostable': 'monostable',
  'Monostable': 'Monostable',
  'Monostable timing is `1.1·R·C`, where 1.1 is ln3: the capacitor starts at 0 V rather than 1/3 Vcc, so it covers more of the exponential.':
    "Monostable zamanlaması `1.1·R·C` olur; buradaki 1,1 ln3'tür: kondansatör 1/3 Vcc yerine 0 V'tan başlar, yani üstelin daha büyük bir kısmını kat eder.",
  'MOSFET': 'MOSFET',
  'MOSFET Circuit Simulator': 'MOSFET Devre Simülatörü',
  'Motional Cm': 'Hareketli Cm',
  'Narrow 1.0 to 2.0 ms, 90 deg': 'Dar 1,0 - 2,0 ms, 90 derece',
  'NE555 bipolar': 'NE555 bipolar',
  'Nearest E12/E24/E96 value and two-resistor combinations for any target.':
    'Herhangi bir hedef için en yakın E12/E24/E96 değeri ve iki dirençli kombinasyonlar.',
  'Nearest E24': 'En yakın E24',
  'Nearest resistor': 'En yakın direnç',
  'Nearest standard': 'En yakın standart',
  'Nearest standard value': 'En yakın standart değer',
  'Needs at least': 'En az şu kadar gerekir',
  'Negative rail': 'Negatif hat',
  'Neighbours': 'Komşular',
  'Network': 'Devre',
  'never': 'hiçbir zaman',
  'Never design to zero margin. This model assumes clear line of sight with nothing in the first Fresnel zone, which almost never holds. Ten dB is a working minimum, and twenty is sensible for anything you cannot easily go and fix.':
    'Asla sıfır paya göre tasarlamayın. Bu model, ilk Fresnel bölgesinde hiçbir şey olmayan açık bir görüş hattı varsayar ve bu neredeyse hiçbir zaman geçerli olmaz. On dB çalışan bir alt sınırdır, kolayca gidip düzeltemeyeceğiniz her şey için yirmi dB akla yatkındır.',
  'next step up {rUp}': 'bir üst adım {rUp}',
  'Nichrome 60/16 (NiCr C)': 'Nikrom 60/16 (NiCr C)',
  'Nichrome 80/20 (NiCr A)': 'Nikrom 80/20 (NiCr A)',
  'Nichrome and Kanthal elements: pyrography tips, foam cutters, small furnaces. The scope shows wire temperature in °C and dissipated power in W against time, settling at equilibrium rather than climbing forever.':
    'Nikrom ve Kanthal rezistanslar: pirograf uçları, köpük kesiciler, küçük fırınlar. Osiloskop tel sıcaklığını °C ve harcanan gücü W olarak zamana karşı gösterir; sonsuza kadar yükselmek yerine dengede oturur.',
  'Nichrome and pyrography tips: wire sizing, power, and time to temperature.':
    'Nikrom ve pirograf uçları: tel boyutlandırma, güç ve sıcaklığa ulaşma süresi.',
  'NiMH': 'NiMH',
  'No {series} part covers {target}: even at its {tolerance} grade, {single} only reaches {bandLow} to {bandHigh}. Use a pair, move to a finer series, or redesign around a value the series actually has.':
    'Hiçbir {series} parçası {target} değerini kapsamıyor: {tolerance} sınıfında bile {single} yalnızca {bandLow} ile {bandHigh} arasına ulaşıyor. Bir çift kullanın, daha ince bir seriye geçin ya da serinin gerçekten sahip olduğu bir değerin çevresinde yeniden tasarlayın.',
  'No cap': 'Kondansatörsüz',
  'No clamp fitted. Interrupting {iPeak} through {l} in {turnOff} drives the collector to {vSwitchOpen}{small} Real boards clamp it anyway: winding capacitance is the only thing holding this number finite.':
    'Kırpıcı takılı değil. {l} üzerinden geçen {iPeak} akımını {turnOff} içinde kesmek kolektörü {vSwitchOpen} değerine sürer{small} Gerçek kartlar bunu zaten kırpar: bu sayıyı sonlu tutan tek şey sargı kapasitansıdır.',
  'no freewheel path': 'serbest sönüm yolu yok',
  'no gain': 'kazanç yok',
  'No heatsink is enough: {pd} through the {rthJC} K/W junction-to-case path alone already exceeds the budget at {ambientK} ambient. Drop Vin closer to Vout, or use a switching regulator and stop converting the difference into heat.':
    "Hiçbir soğutucu yetmez: {rthJC} K/W jonksiyon-kılıf yolundan geçen {pd}, {ambientK} ortam sıcaklığında bütçeyi tek başına zaten aşıyor. Vin'i Vout'a yaklaştırın ya da anahtarlamalı bir regülatör kullanıp farkı ısıya çevirmeyi bırakın.",
  'No match.': 'Eşleşme yok.',
  'no pair beats the single value': 'hiçbir çift tek parçayı geçmiyor',
  'No resistance satisfies both limits here: the value needed to meet the rise time is already below the value a device can pull low. Shorten the bus, remove devices, or drop to a slower speed. This is the point where you need an active bus buffer.':
    'Burada iki sınırı da sağlayan bir direnç yok: yükselme süresini tutturmak için gereken değer, bir aygıtın alçağa çekebileceği değerin zaten altında. Veri yolunu kısaltın, aygıt çıkarın ya da daha yavaş bir hıza inin. Etkin bir veri yolu tamponuna ihtiyaç duyduğunuz nokta burasıdır.',
  'No single resistor satisfies both extremes: Rs must be at least {rsMin} to keep the zener inside its power budget at {vinMax} with no load, but at most {rsMax} to hold the knee at {vinMin} with {ilMax}. Use a higher-wattage zener, narrow the input range, or move to a series pass regulator.':
    'Hiçbir tek direnç iki uç durumu birden karşılamıyor: Rs, {vinMax} değerinde yüksüzken zeneri güç bütçesi içinde tutmak için en az {rsMin} olmalı, ama {ilMax} yükle {vinMin} değerinde dizini korumak için en çok {rsMax} olmalı. Daha yüksek güçlü bir zener kullanın, giriş aralığını daraltın ya da seri geçişli bir regülatöre geçin.',
  'no steady state': 'kararlı durum yok',
  'no value works': 'hiçbir değer uymuyor',
  'Node voltage': 'Düğüm gerilimi',
  'Noise gain': 'Gürültü kazancı',
  'Nominal voltage': 'Anma gerilimi',
  'Non-inverting': 'Evirmeyen',
  'none': 'yok',
  'None': 'Yok',
  'none exists': 'hiçbiri yok',
  'none is enough': 'hiçbiri yetmez',
  'noninverting': 'evirmeyen',
  'Not built yet.': 'Henüz hazır değil.',
  'Not saturated at {driveHigh} of drive: hFE·IB gives only {icAvailable} against the {icSat} the load wants, so the device sits in the active region at {vce} and burns {pCollector}. Drop RB to {rbForTarget} or below.':
    "{driveHigh} sürüşte doyuma girmiyor: hFE·IB yalnızca {icAvailable} veriyor, oysa yük {icSat} istiyor; bu yüzden eleman {vce} gerilimiyle aktif bölgede kalıyor ve {pCollector} harcıyor. RB'yi {rbForTarget} değerine ya da altına düşürün.",
  'Note the asymmetry on the trace: closing the switch shorts the capacitor straight to ground so the fall is almost instant, while opening it has to charge C through R. Only the rising edge is actually filtered, which is why a debounce that looks fine on press can still bounce on release.':
    "İzdeki asimetriye dikkat edin: anahtarı kapatmak kondansatörü doğrudan toprağa kısa devre eder, bu yüzden düşüş neredeyse anlıktır; açmak ise C'yi R üzerinden şarj etmek zorundadır. Gerçekte yalnızca yükselen kenar süzülür; basışta sorunsuz görünen bir sekme giderimin bırakışta hâlâ sekebilmesinin nedeni budur.",
  'nothing fitted': 'hiçbir şey takılı değil',
  'now {rb}': 'şu an {rb}',
  'NPN low side switch': 'NPN alt taraf anahtarı',
  'NPN low side switch driven from a 3V3 GPIO through RB. The scope shows the drive waveform and the collector voltage against time.':
    'RB üzerinden 3V3 GPIO ucundan sürülen NPN alçak taraf anahtarı. Osiloskop, sürüş dalga şeklini ve kolektör gerilimini zamana karşı gösterir.',
  'NTC Thermistor': 'NTC Termistör',
  'nulled': 'sıfırlanmış',
  'Occupied bandwidth': 'Kapladığı bant genişliği',
  'OCV': 'OCV',
  'of {bits} total': 'toplam {bits} içinden',
  'of full sun per day used': 'kullanılan tam güneş / gün',
  'of rated at this rate': 'bu hızda anma değerinin',
  'of the frame': 'çerçevenin',
  'of the supply': 'beslemenin',
  'off': 'kapalı',
  'off {toff}': 'kapalı {toff}',
  'off null': 'sıfırın dışında',
  'Off-grid sensor nodes, weather stations and remote monitors. The failure mode it prevents is the system that breaks even on paper: it works all summer, then a cloudy week drains the battery and it never recovers, because the panel has no surplus to refill with.':
    'Şebekeden bağımsız sensör düğümleri, meteoroloji istasyonları ve uzak izleyiciler. Önlediği arıza biçimi, kâğıt üzerinde başa baş çıkan sistemdir: tüm yaz çalışır, sonra bulutlu bir hafta bataryayı bitirir ve sistem bir daha toparlanamaz, çünkü panelin dolduracak fazlası yoktur.',
  'On the ESP32 the LEDC timer divides an 80 MHz clock into 2^bits steps per period, so frequency and duty resolution trade directly against each other. Push the frequency up and the resolution collapses. The scope shows the pin waveform and its average.':
    'ESP32 üzerinde LEDC zamanlayıcısı, 80 MHzlik saati periyot başına 2^bit adıma böler, bu yüzden frekans ve görev oranı çözünürlüğü doğrudan birbiriyle takas edilir. Frekansı yükseltin, çözünürlük çöker. Osiloskop uç dalga şeklini ve ortalamasını gösterir.',
  'On time': 'İletim süresi',
  'Once the valley current would go negative the diode has already turned off and the converter is in discontinuous conduction. The duty then follows from `Iout = Vin²·D²/(2·L·fsw·(Vout - Vin))`, i.e. `D = sqrt(2·L·fsw·Iout·(Vout - Vin))/Vin`. The boundary sits at `Iout = Vin·D(1-D)/(2·fsw·L)`.':
    'Vadi akımı negatife düşecek olduğunda diyot çoktan kesime girmiştir ve dönüştürücü kesintili iletimdedir. Görev çevrimi o zaman `Iout = Vin²·D²/(2·L·fsw·(Vout - Vin))` bağıntısından, yani `D = sqrt(2·L·fsw·Iout·(Vout - Vin))/Vin` olarak çıkar. Sınır `Iout = Vin·D(1-D)/(2·fsw·L)` noktasındadır.',
  "One loop, so Kirchhoff gives `Vs = Vf + I·R` and the resistor follows from Ohm's law: `R = (Vs - Vf) / If`. The LED is modelled as a fixed forward drop, the standard piecewise-linear diode approximation. Above the knee its I-V curve is steep enough that Vf barely moves, so the resistor, not the diode, sets the current.":
    'Tek çevrim olduğundan Kirchhoff `Vs = Vf + I·R` verir ve direnç Ohm yasasından çıkar: `R = (Vs - Vf) / If`. LED, standart parçalı doğrusal diyot yaklaşımıyla sabit bir ileri düşüm olarak modellenir. Dizin üstünde I-V eğrisi öyle diktir ki Vf neredeyse kıpırdamaz, yani akımı diyot değil direnç belirler.',
  'One of the resistors is over its {rating} rating. Raise both values or move to a bigger package: the model is still linear, the part is not.':
    'Dirençlerden biri {rating} anma değerinin üzerinde. İki değeri de büyütün ya da daha büyük bir kılıfa geçin: model hâlâ doğrusaldır, parça değildir.',
  'One PWM period is shorter than a scope sample at this time base, so the Vpwm trace is omitted rather than drawn aliased. Vout is a closed-form solution, so it stays exact.':
    'Bu zaman tabanında bir PWM çevrimi, bir osiloskop örneğinden kısa; bu yüzden Vpwm izi örtüşmeli çizilmek yerine hiç çizilmiyor. Vout kapalı biçimli bir çözümdür, yani tam kalır.',
  "One wiring note: the signal pin is happy at 3.3 V because servos read it as logic, but the motor itself wants 5 V or more and draws amps when stalled. Never power a servo from the ESP32 board's regulator, and keep the grounds common.":
    "Bir kablolama notu: işaret pini 3,3 V'ta sorunsuzdur çünkü servolar onu mantık olarak okur, ama motorun kendisi 5 V ya da üstünü ister ve tıkandığında amperler çeker. Bir servoyu asla ESP32 kartının regülatöründen beslemeyin ve toprakları ortak tutun.",
  'Only {contactCurrent} flows through the contact. Dry switching below about 100 µA lets oxide build up on the contact faces, which eventually stops the switch working at all. Lower R if the switch is a mechanical one.':
    "Kontaktan yalnızca {contactCurrent} geçiyor. Yaklaşık 100 µA altında kuru anahtarlama, kontak yüzeylerinde oksit birikmesine izin verir ve sonunda anahtarın büsbütün çalışmamasına yol açar. Anahtar mekanikse R'yi küçültün.",
  'Only {headroom} across the resistor. Normal part to part Vf spread of {spread} then moves the current by {current}, so the resistor is barely in control. Raise the rail or use a constant current driver.':
    'Direnç üzerinde yalnızca {headroom} var. Parçadan parçaya olağan {spread} Vf saçılımı akımı {current} kadar kaydırır, yani direncin denetimi neredeyse yok. Hattı yükseltin ya da sabit akım sürücüsü kullanın.',
  'Only {margin} K of margin. Tj max is an absolute maximum, not an operating point: leave {MARGIN_TARGET_K} K or more for part spread, a hot enclosure and a blocked airflow path.':
    'Yalnızca {margin} K pay var. Tj max bir çalışma noktası değil mutlak en büyük değerdir: parça saçılımı, sıcak bir muhafaza ve tıkanmış bir hava yolu için {MARGIN_TARGET_K} K ya da daha fazlasını bırakın.',
  'Only {marginDb} dB of margin. Free space loss is the best case: rain, foliage, a wall, a hand near the antenna or simple multipath fading each eat several dB. Aim for at least {MARGIN_MIN_DB} dB before calling a link dependable.':
    'Yalnızca {marginDb} dB pay var. Boş uzay kaybı en iyi durumdur: yağmur, yapraklar, bir duvar, antene yakın bir el ya da yalın çok yollu sönümleme, her biri birkaç dB yer. Bir bağlantıya güvenilir demeden önce en az {MARGIN_MIN_DB} dB hedefleyin.',
  "Only {rangeUsed}% of the ADC range is in use, so most of the converter's resolution is wasted. Raise the gain until full-scale current lands near the top of the range.":
    'ADC aralığının yalnızca %{rangeUsed} kadarı kullanılıyor, yani çeviricinin çözünürlüğünün çoğu boşa gidiyor. Tam ölçek akımı aralığın tepesine yaklaşana kadar kazancı yükseltin.',
  'Only {vgsMargin} of gate drive over the threshold. The FET turns on weakly and slowly, so edges degrade and the shifter becomes unreliable at temperature extremes where Vth shifts. Below about 1.8 V on the low side, use a dedicated shifter IC instead.':
    "Eşiğin üzerinde yalnızca {vgsMargin} kapı sürüşü var. FET zayıf ve yavaş iletime geçer, bu yüzden kenarlar bozulur ve Vth'nin kaydığı uç sıcaklıklarda seviye çevirici güvenilmez olur. Alt tarafta yaklaşık 1,8 V'un altında bunun yerine özel bir çevirici tümdevre kullanın.",
  'op-amp': 'op-amp',
  'Open drain means a device can only pull the line down. Releasing it leaves the bus capacitance to be charged through the pull-up, so the rising edge is an RC curve while the falling edge is nearly instant. Everything about pull-up sizing follows from that asymmetry.':
    'Açık drenaj, bir aygıtın hattı yalnızca aşağı çekebilmesi demektir. Bırakınca veri yolu kapasitansı pull-up üzerinden dolmak zorunda kalır, bu yüzden yükselen kenar bir RC eğrisiyken düşen kenar neredeyse anlıktır. Pull-up boyutlandırmasıyla ilgili her şey bu asimetriden çıkar.',
  'Operating mode': 'Çalışma kipi',
  'Operating point': 'Çalışma noktası',
  'Operating region': 'Çalışma bölgesi',
  'Operational Amplifier': 'İşlemsel Yükselteç',
  'orange': 'turuncu',
  'Out of regulation at the low corner: Rs only delivers {irs} at {vinMin}, so the zener is left with {iz}, under the {izMin} knee. Output sags to {vout} and tracks the load. Reduce Rs below {rsMax}.':
    "Alt köşede regülasyon dışı: Rs, {vinMin} değerinde yalnızca {irs} veriyor, yani zenere {iz} kalıyor ve bu {izMin} dizininin altında. Çıkış {vout} değerine çöküyor ve yükü izliyor. Rs'yi {rsMax} altına düşürün.",
  'Outdoor (cold side)': 'Dış ortam (soğuk taraf)',
  'Output': 'Çıkış',
  'Output cap': 'Çıkış kondansatörü',
  'Output Cout': 'Çıkış Cout',
  'Output impedance': 'Çıkış empedansı',
  'Output is above the input, so this regulator is in dropout and the model does not apply. A linear regulator can only step down.':
    'Çıkış girişin üzerinde, yani bu regülatör düşüm sınırındadır ve model geçerli değildir. Doğrusal bir regülatör yalnızca gerilim düşürebilir.',
  "Output is set by the feedback divider: `Vout = Vref·(1 + R2/R1)` with `Vref = {VREF} V`. Keep R1 in the 1k to 5k range the datasheet suggests: too high and the FB pin's own bias current shifts the output, too low and the divider wastes current continuously.":
    "Çıkışı geri besleme bölücüsü belirler: `Vref = {VREF} V` ile `Vout = Vref·(1 + R2/R1)`. R1'i veri sayfasının önerdiği 1k - 5k aralığında tutun: fazla büyükse FB pininin kendi kutuplama akımı çıkışı kaydırır, fazla küçükse bölücü sürekli akım harcar.",
  'Output is under one ADC count ({ADC_LSB} at {ADC_FULL_SCALE} full scale, 12 bit). Put an instrumentation amp in front of it, i.e. INA333 or INA826, or the reading is all noise.':
    'Çıkış bir ADC adımının altında ({ADC_FULL_SCALE} tam ölçekte {ADC_LSB}, 12 bit). Önüne bir enstrümantasyon yükselteci koyun, örneğin INA333 ya da INA826; yoksa okumanın tamamı gürültüdür.',
  'Output power': 'Çıkış gücü',
  'Output ripple': 'Çıkış dalgalanması',
  'Output ripple has two parts that do not peak together: the capacitor term `dIL/(8·fsw·C)` and the ESR term `dIL·ESR`. In most real designs with ceramic output caps the ESR term is small, but with electrolytics it dominates completely.':
    'Çıkış dalgalanmasının aynı anda tepe yapmayan iki bileşeni vardır: kondansatör terimi `dIL/(8·fsw·C)` ve ESR terimi `dIL·ESR`. Seramik çıkış kondansatörlü çoğu gerçek tasarımda ESR terimi küçüktür, ama elektrolitiklerde tamamen baskındır.',
  'Output ripple ΔVout': 'Çıkış dalgalanması ΔVout',
  'Output stage': 'Çıkış katı',
  'Output swing': 'Çıkış salınımı',
  'Output swing is limited by whichever end runs out first, the rail at `IC·RC` above the Q point or saturation at `VCE - VCEsat` below it. The trace applies the midband gain sample by sample and clips there, so it shows the headroom honestly, though a real stage clips softly at cutoff and the coupling capacitor rolls off the low end.':
    'Çıkış salınımını önce hangisi biterse o sınırlar: Q noktasının `IC·RC` kadar üstündeki hat ya da `VCE - VCEdoyum` kadar altındaki doyum. İz, orta bant kazancını örnek örnek uygular ve orada kırpar, yani boşluğu dürüstçe gösterir; gerçek bir kat ise kesimde yumuşak kırpar ve kuplaj kondansatörü alt uçtan söndürür.',
  'Output to ADC': "ADC'ye çıkış",
  'Output Vout': 'Çıkış Vout',
  'over {area} m²': '{area} m² üzerinde',
  'over 100%': '%100 üzeri',
  'Over 4 peak sun hours is a summer or low-latitude figure. Size on the worst month you expect to operate in, not the average: in northern Europe December can be under one peak sun hour, a factor of five below midsummer.':
    "4 tepe güneş saatinin üzeri bir yaz ya da düşük enlem değeridir. Ortalamaya göre değil, çalışmayı beklediğiniz en kötü aya göre boyutlandırın: Kuzey Avrupa'da aralık ayı bir tepe güneş saatinin altında olabilir, yani yaz ortasının beşte biri.",
  'Overdrive factor': 'Aşırı sürüş çarpanı',
  'Overshoot': 'Aşım',
  'Pack': 'Paket',
  'Pack efficiency': 'Paket verimi',
  'Pack resistance': 'Paket direnci',
  'Pack voltage': 'Paket gerilimi',
  'Package': 'Kılıf',
  'Package rating': 'Kılıf değeri',
  'pair': 'çift',
  "Pairs are searched over the whole 1 Ω to 10 MΩ table. Both `a + b` and `a·b / (a + b)` rise monotonically with b, so for each a the best partner is the table entry nearest the exact one, which makes the search a binary search per candidate rather than every pair. Parts are kept within {maxRatio}x of each other: past that the smaller one trims the result by less than the larger one's own tolerance, so the pair is a fiction.":
    'Çiftler 1 Ω - 10 MΩ tablosunun tamamında aranır. Hem `a + b` hem `a·b / (a + b)`, b ile birlikte tekdüze yükselir; bu yüzden her a için en iyi eş, tam değere en yakın tablo girdisidir ve bu da aramayı her aday için ikili arama haline getirir, tüm çiftleri denemek yerine. Parçalar birbirinin {maxRatio} katı içinde tutulur: ötesinde küçük olan, sonucu büyüğün kendi toleransından daha az düzeltir, yani çift bir kurgudan ibarettir.',
  'Panel (datasheet, at STC)': "Panel (veri sayfası, STC'de)",
  'Panel and battery pick from a daily load profile, with autonomy days.':
    'Günlük yük profilinden panel ve batarya seçimi, özerklik günleriyle.',
  'Panel fitted': 'Takılan panel',
  'Panel needed': 'Gereken panel',
  'Panel rating': 'Panel gücü',
  'parallel': 'paralel',
  'Parallel': 'Paralel',
  'Parallel branch network': 'Paralel kollu devre',
  "Parallel branches share a node voltage, so the current splits by conductance, not by resistance. The bar shows each branch's share of the total.":
    'Paralel kollar aynı düğüm gerilimini paylaşır, bu yüzden akım dirence göre değil iletkenliğe göre bölünür. Çubuk, her kolun toplamdaki payını gösterir.',
  'Parallel branches share one node pair, so they all see the same voltage. Conductance adds: `G = 1/R`, `Req = 1 / sum(G)`. Req is always smaller than the smallest branch, i.e. adding a path can only make the load heavier.':
    'Paralel kollar tek bir düğüm çiftini paylaşır, bu yüzden hepsi aynı gerilimi görür. Toplanan iletkenliktir: `G = 1/R`, `Req = 1 / toplam(G)`. Req her zaman en küçük koldan da küçüktür, yani bir yol eklemek yükü ancak ağırlaştırır.',
  'Parallel capacitors add plate area, so `C = C1 + C2 + ...`. In series every capacitor carries the same charge and the voltages add, so `1/C = 1/C1 + 1/C2 + ...` and the total is smaller than the smallest member.':
    'Paralel kondansatörler plaka alanı ekler, yani `C = C1 + C2 + ...`. Seride her kondansatör aynı yükü taşır ve gerilimler toplanır, yani `1/C = 1/C1 + 1/C2 + ...` olur ve toplam, en küçük elemandan da küçüktür.',
  'Parallel here is driven Thevenin style, i.e. the source feeds R in series into the L-C node. That is the same circuit as a current step `Vin/R` into R || L || C, so the parallel Q applies. Its output decays to zero because the inductor is a short at DC.':
    "Buradaki paralel devre Thevenin biçiminde sürülür, yani kaynak R üzerinden L-C düğümünü besler. Bu, R || L || C üzerine `Vin/R` akım basamağı uygulamakla aynı devredir, dolayısıyla paralel Q geçerlidir. Çıkışının sıfıra sönmesinin nedeni bobinin DC'de kısa devre olmasıdır.",
  'Parasitics': 'Parazitik etkiler',
  'Part': 'Parça',
  'Part and supply': 'Parça ve besleme',
  'Passband loss (DCR)': 'Geçirme bandı kaybı (DCR)',
  'Past the {IOUT_MAX} A rating. These modules are commonly sold claiming 3 A but with a heatsink barely adequate above 1.5 A.':
    '{IOUT_MAX} A değerinin ötesinde. Bu modüller yaygın olarak 3 A iddiasıyla satılır ama 1,5 A üzerinde soğutucusu ancak yeter.',
  'Past the practical ceiling of about {ceiling} for this variant. Propagation delay starts to dominate the RC timing.':
    'Bu çeşit için yaklaşık {ceiling} olan pratik tavanın ötesinde. Yayılma gecikmesi RC zamanlamasına egemen olmaya başlar.',
  'pcb': 'pcb',
  'PCB & Wiring': 'PCB ve Kablolama',
  'PCB microstrip, 0.55': 'PCB mikroşerit, 0,55',
  'PCB Trace Width': 'PCB Yol Genişliği',
  'peak {iPeak}': 'tepe {iPeak}',
  'Peak charging current {iPeak} is past the {id} IFSM of {isurge}. Add series resistance or a soft start.':
    'Tepe şarj akımı {iPeak}, {id} parçasının {isurge} olan IFSM değerinin ötesinde. Seri direnç ya da yumuşak başlatma ekleyin.',
  'Peak coil current': 'Tepe bobin akımı',
  'Peak coil current {ipk} is past the {isat} saturation rating. A saturated core loses inductance, so the real corner climbs and this trace is no longer valid. Raise R, pick a bigger core, or cut the drive.':
    "Tepe bobin akımı {ipk}, {isat} doyum değerinin ötesinde. Doyuma giren bir çekirdek endüktansını yitirir, yani gerçek köşe yukarı tırmanır ve bu iz artık geçerli değildir. R'yi büyütün, daha büyük bir çekirdek seçin ya da sürüşü kısın.",
  'Peak current': 'Tepe akım',
  'Peak current {ipeak} is over the {isat} saturation rating. A saturated core loses inductance, so the current ramp goes near vertical and the switch sees a spike this linear model does not predict. Every number above is optimistic. Use a bigger inductor, raise fsw or pick a higher Isat part.':
    "{ipeak} tepe akımı {isat} doyum değerinin üzerinde. Doyuma giren bir çekirdek endüktansını yitirir, bu yüzden akım rampası neredeyse dikleşir ve anahtar, bu doğrusal modelin öngörmediği bir sıçrama görür. Yukarıdaki her sayı iyimserdir. Daha büyük bir bobin kullanın, fsw'yi yükseltin ya da daha yüksek Isat'li bir parça seçin.",
  'Peak current {ipk} exceeds the {GPIO_MAX_MA} mA an ESP32 pin can source. Drive this network from a buffer or a MOSFET, not straight off a GPIO.':
    "Tepe akım {ipk}, bir ESP32 pininin verebileceği {GPIO_MAX_MA} mA sınırını aşıyor. Bu devreyi doğrudan bir GPIO'dan değil, bir tampon ya da MOSFET üzerinden sürün.",
  'Peak current is {satPercent}% of the {iSat} saturation point. Past saturation the inductance collapses, the ramp goes near vertical and the real current overshoots everything shown here. This model assumes L is constant, so treat the trace as optimistic.':
    "Tepe akım, {iSat} doyum noktasının %{satPercent} kadarı. Doyumdan sonra endüktans çöker, rampa neredeyse dikleşir ve gerçek akım burada gösterilen her şeyi aşar. Bu model L'yi sabit varsayar, bu yüzden izi iyimser kabul edin.",
  'Peak diode current': 'Tepe diyot akımı',
  'Peak gate current': 'Tepe kapı akımı',
  'Peak gate current is {igPeak}, over the {GPIO_MAX_MA} mA an ESP32 GPIO is rated for. Raise Rg or use a gate driver.':
    "Tepe kapı akımı {igPeak}; bu, bir ESP32 GPIO'sunun dayandığı {GPIO_MAX_MA} mA sınırının üzerinde. Rg'yi büyütün ya da bir kapı sürücüsü kullanın.",
  'Peak inductor current': 'Tepe bobin akımı',
  'Peak inductor current {ilPeak} is past the {isat} saturation rating. A saturated inductor loses inductance, so current runs away within a single switching cycle. Choose a larger core or raise L.':
    "{ilPeak} tepe bobin akımı {isat} doyum değerinin ötesinde. Doyuma giren bir bobin endüktansını yitirir, bu yüzden akım tek bir anahtarlama çevrimi içinde kaçar. Daha büyük bir çekirdek seçin ya da L'yi yükseltin.",
  'Peak inductor current is above the guaranteed current limit, so the part will trip into cycle-by-cycle limiting before reaching this load. Use a larger inductor.':
    'Tepe bobin akımı garantili akım sınırının üzerinde, yani parça bu yüke ulaşmadan çevrim çevrim sınırlamaya girer. Daha büyük bir bobin kullanın.',
  'Peak inverse voltage is what actually kills diodes. A bridge diode blocks one `Vpeak`. A half wave or centre tapped diode has the negative peak on its anode while the cap holds its cathode at `Vdc`, so it blocks `Vpeak + Vdc`, i.e. about `2·Vpeak`. A 12 V secondary is already 34 V of PIV.':
    "Diyotları gerçekte öldüren şey tepe ters gerilimdir. Bir köprü diyodu tek bir `Vtepe` bloklar. Yarım dalga ya da orta uçlu bir diyotta anotta negatif tepe varken kondansatör katodu `Vdc` değerinde tutar, yani `Vtepe + Vdc`, yani yaklaşık `2·Vtepe` bloklar. 12 V'luk bir ikincil daha şimdiden 34 V PIV demektir.",
  'Peak p(t)': 'Tepe p(t)',
  'Peak pin current': 'Tepe pin akımı',
  'Peak pin current is {gpioPeakA} at power-on, when the capacitor is still empty. That is past the 12 mA an ESP32 GPIO is rated for. Raise R.':
    "Kondansatör hâlâ boşken, açılış anında tepe pin akımı {gpioPeakA}. Bu, bir ESP32 GPIO'sunun dayandığı 12 mA sınırının ötesinde. R'yi büyütün.",
  'Peak power': 'Tepe güç',
  'Peak secondary is {vPeakIn}, below the {vf} of diode drop. Nothing ever conducts.':
    'İkincil tepe {vPeakIn}, {vf} diyot düşümünün altında. Hiçbir zaman iletim olmaz.',
  'Peak sun hours': 'Tepe güneş saati',
  "Peak sun hours folds a whole day's irradiance curve into an equivalent number of hours at the panel's full 1000 W/m² rating. So daily harvest is simply `W · PSH · efficiency`, and the panel you need is `Wh_day / (PSH · efficiency)`.":
    'Tepe güneş saati, bütün bir günün ışınım eğrisini panelin tam 1000 W/m² değerindeki eşdeğer saat sayısına indirger. Yani günlük hasat yalnızca `W · PSH · verim` olur ve gereken panel `Wh_gün / (PSH · verim)` eder.',
  'Peak to peak': 'Tepeden tepeye',
  'Peak Vout': 'Tepe Vout',
  'Per 1% of {arm}': "{arm} değerinin %1'i başına",
  'per ADC count': 'ADC adımı başına',
  'per count': 'adım başına',
  'per line, when low': 'hat başına, alçakken',
  'per LSB on the shunt ADC': "şönt ADC'sinde LSB başına",
  'Period': 'Çevrim',
  'Periods shown': 'Gösterilen çevrim',
  'Peukert usable': 'Peukert kullanılabilir',
  "Peukert's law captures the fact that capacity is not a constant: `t = H·(C/(I·H))^k`. With k above 1, heavy discharge extracts less total charge. Lead acid is the worst offender at k around 1.2 to 1.3; lithium is close to 1.05, which is why a LiPo holds its rating far better under load.":
    "Peukert yasası kapasitenin sabit olmadığını anlatır: `t = H·(C/(I·H))^k`. k birden büyük olduğunda ağır deşarj daha az toplam yük çeker. En kötüsü 1,2 ile 1,3 arası k değeriyle kurşun asittir; lityum 1,05'e yakındır, bu yüzden bir LiPo yük altında değerini çok daha iyi korur.",
  'phase': 'faz',
  'Phase': 'Faz',
  'Phase angle': 'Faz açısı',
  'Phase shift': 'Faz kayması',
  'Photocurrent scales almost exactly with irradiance, which is why Isc tracks sunlight linearly. Voc only moves with the logarithm of irradiance, so a panel in cloud keeps most of its voltage and loses current.':
    "Foto akım neredeyse tam olarak ışınımla ölçeklenir; Isc'nin güneş ışığını doğrusal izlemesinin nedeni budur. Voc yalnızca ışınımın logaritmasıyla değişir, yani buluttaki bir panel geriliminin çoğunu korur ve akımını yitirir.",
  'Photovoltaic Panel': 'Fotovoltaik Panel',
  'Pick a wire gauge and see what it actually costs you: resistance, voltage lost on the way to the load, and heat. The default counts both conductors, which is the half that people usually forget.':
    'Bir kablo kesiti seçin ve size gerçekte neye mal olduğunu görün: direnç, yüke giderken kaybedilen gerilim ve ısı. Varsayılan ayar iki iletkeni de sayar, ki bu insanların genelde unuttuğu yarısıdır.',
  'Pick R1 and R2 for the rail you want, then check the part survives it. The scope is not a waveform: the horizontal axis is load current from 0 to {max} A, so read the per-division figure in milliamps, and the vertical axis is junction temperature in kelvin against the 398 K (125 C) limit.':
    'İstediğiniz hat için R1 ve R2 seçin, sonra parçanın buna dayanıp dayanmadığını kontrol edin. Osiloskop bir dalga şekli göstermez: yatay eksen 0 ile {max} A arasındaki yük akımıdır, bu yüzden bölme başına değeri miliamper olarak okuyun; dikey eksen ise 398 K (125 C) sınırına karşı kelvin cinsinden jonksiyon sıcaklığıdır.',
  'Pick the series resistor, then see what the nearest stock value actually does to the current, the dissipation and the GPIO driving it. No waveform here, the whole circuit is DC.':
    'Seri direnci seçin, sonra en yakın stok değerinin akıma, güç kaybına ve onu süren GPIO ucuna gerçekte ne yaptığını görün. Burada dalga şekli yok, devrenin tamamı DC.',
  'pin': 'pin',
  'Pin 7 peak sink': 'Pin 7 tepe çekişi',
  'PIV {piv} exceeds the {id} VRRM of {vrrm}. The diode breaks down in reverse.':
    'PIV {piv}, {id} parçasının {vrrm} olan VRRM değerini aşıyor. Diyot ters yönde delinir.',
  'PIV per diode': 'Diyot başına PIV',
  'planned': 'planlandı',
  'Pmp': 'Pmp',
  'Pmp at STC': "STC'de Pmp",
  'Pmp temp coeff': 'Pmp sıcaklık katsayısı',
  'Positive rail': 'Pozitif hat',
  'power': 'güç',
  'Power': 'Güç',
  'Power ceiling': 'Güç tavanı',
  'Power cold': 'Soğuk güç',
  'Power Conversion': 'Güç Dönüşümü',
  'Power dissipated': 'Harcanan güç',
  'Power follows directly: `Pz = Vz·Iz` at the hot corner and `Prs = Irs²·Rs`. The current budget is `Iz_max = {POWER_DERATING} · Pz_max / Vz`, half the rating because datasheet numbers assume 25 C.':
    'Güç doğrudan çıkar: sıcak köşede `Pz = Vz·Iz` ve `Prs = Irs²·Rs`. Akım bütçesi `Iz_max = {POWER_DERATING} · Pz_max / Vz` olur; anma değerleri 25 C varsaydığı için yarısı alınır.',
  'Power in load': 'Yükteki güç',
  'Power in R1': "R1'deki güç",
  'Power in R2': "R2'deki güç",
  'Power is `I²R` in R1 and `V²/R` in the shunt legs, and the three add up to `Vin·I`. The design tension is fixed: low resistances give a stiff output and burn current forever, high resistances sip current and collapse under any real load.':
    "Güç, R1'de `I²R`, paralel bacaklarda `V²/R` olur ve üçü toplanınca `Vin·I` eder. Tasarımdaki gerilim değişmezdir: düşük dirençler sağlam bir çıkış verir ve sonsuza dek akım yakar; yüksek dirençler akımı azıcık içer ve gerçek bir yük altında çöker.",
  'Power lost as heat': 'Isı olarak yitirilen güç',
  'Power now': 'Şimdiki güç',
  'Power per line': 'Hat başına güç',
  'Power rating': 'Güç değeri',
  'Power settled': 'Oturmuş güç',
  'Power stage': 'Güç katı',
  'Power to load': 'Yüke giden güç',
  'pp': 'pp',
  'pp, formula {vripple}': 'tepeden tepeye, formül {vripple}',
  'Predicting how long a device runs, and why the last stretch of a discharge collapses so quickly. The sag figure matters for anything with a burst load: an ESP32 transmitting pulls enough current that internal resistance drops the rail, which is a common cause of brownout resets on a tired cell.':
    'Bir cihazın ne kadar çalışacağını ve deşarjın son bölümünün neden bu kadar hızlı çöktüğünü öngörmek. Gerilim düşümü değeri, ani yükü olan her şey için önemlidir: ileti yapan bir ESP32, iç direncin hattı düşürmesine yetecek kadar akım çeker; yorgun bir hücrede brownout resetlerinin yaygın nedeni budur.',
  'Preferred series': 'Yeğlenen seri',
  'Present PF': 'Şimdiki PF',
  'Presses per second': 'Saniyedeki basış',
  'Primary copper loss': 'Birincil bakır kaybı',
  'Primary current': 'Birincil akım',
  'Primary resistance': 'Birincil direnç',
  'Primary turns': 'Birincil sarım',
  'Primary voltage': 'Birincil gerilim',
  'Program current': 'Program akımı',
  'Program resistor to charge current, CC/CV phases and charge time.':
    'Program direncinden şarj akımı, CC/CV aşamaları ve şarj süresi.',
  'Prx': 'Prx',
  'Pull-up': 'Pull-up',
  'Pull-up current': 'Pull-up akımı',
  'Pull-up window from bus capacitance and speed, with the rise-time check.':
    'Hat kapasitesi ve hızından pull-up aralığı, yükselme süresi kontrolüyle.',
  'Pull-ups': 'Pull-up dirençleri',
  'Pulse range': 'Darbe aralığı',
  'Pulse width': 'Darbe genişliği',
  'pwm': 'pwm',
  'PWM': 'PWM',
  'PWM Low-Pass Filter': 'PWM Alçak Geçiren Filtre',
  'Pyrography pens, hot wire foam cutters, 3D printer hot ends and nozzles, small kilns, and soldering equipment. The key output is the equilibrium temperature: element wire settles where dissipation equals cooling, so the same wire and voltage behave completely differently in still air, in a draught, or buried in insulation.':
    'Pirograf kalemleri, sıcak tel köpük kesiciler, 3D yazıcı sıcak uçları ve nozulları, küçük fırınlar ve lehim ekipmanları. Anahtar çıktı denge sıcaklığıdır: rezistans teli, güç kaybının soğumaya eşit olduğu noktada oturur, bu yüzden aynı tel ve gerilim durgun havada, cereyanda veya yalıtıma gömülüyken tamamen farklı davranır.',
  "Q above {HIGH_Q_LIMIT} assumes a lossless L and C. A real inductor's winding resistance and core loss, plus the capacitor ESR, both sit in the loop and will hold the measured Q well below this. Add the coil DCR into R for a realistic answer.":
    "{HIGH_Q_LIMIT} üzerindeki Q, kayıpsız bir L ve C varsayar. Gerçek bir bobinin sargı direnci ve çekirdek kaybı, artı kondansatör ESR'si, ikisi de çevrimin içindedir ve ölçülen Q'yu bunun epey altında tutar. Gerçekçi bir yanıt için bobin DCR'sini R'ye katın.",
  'Q factor': 'Q çarpanı',
  'Q measures how sharp that is: `Q = (1/R)·sqrt(L/C)` for series. Bandwidth follows as `f0/Q`. High Q means a narrow, selective peak and a large circulating current; low Q means a broad gentle one.':
    'Q bunun ne kadar keskin olduğunu ölçer: seri için `Q = (1/R)·sqrt(L/C)`. Bant genişliği buradan `f0/Q` olarak çıkar. Yüksek Q dar ve seçici bir tepe ile büyük bir dolaşan akım demektir; düşük Q ise geniş ve yumuşak bir tepe demektir.',
  'Quantisation error': 'Niceleme hatası',
  'Quarter and half wave lengths for 433/868/915 MHz and 2.4 GHz, velocity factor included.':
    '433/868/915 MHz ve 2.4 GHz için çeyrek ve yarım dalga uzunlukları, hız katsayısı dahil.',
  'Quarter wave': 'Çeyrek dalga',
  'Quarter wave in free space': 'Boşlukta çeyrek dalga',
  'Quiescent current': 'Durgun akım',
  'Quiescent IC': 'Durgun IC',
  'quoted at VGS': "şu VGS'te belirtildi",
  'R at reference': 'Referanstaki R',
  'R for critical': 'Kritik sönüm için R',
  'R sets how fast the stored energy leaks away. Series: `Q = (1/R)·sqrt(L/C)` and `alpha = R / (2L)`. Parallel: `Q = R·sqrt(C/L)` and `alpha = 1 / (2·R·C)`. The two are reciprocal about the characteristic impedance `Z0 = sqrt(L/C)`, so series wants R small for a high Q and parallel wants R large.':
    'Depolanan enerjinin ne kadar hızlı sızacağını R belirler. Seri: `Q = (1/R)·sqrt(L/C)` ve `alpha = R / (2L)`. Paralel: `Q = R·sqrt(C/L)` ve `alpha = 1 / (2·R·C)`. İkisi, karakteristik empedans `Z0 = sqrt(L/C)` çevresinde birbirinin tersidir; yani yüksek Q için seri küçük R, paralel ise büyük R ister.',
  'R{i} current': 'R{i} akımı',
  'R1 (FB to gnd)': "R1 (FB'den şaseye)",
  'R1 (OUT to ADJ)': "R1 (OUT'tan ADJ'ye)",
  'R1 (rail to base)': 'R1 (hattan beyze)',
  'R1 (series)': 'R1 (seri)',
  'R1 (top)': 'R1 (üst)',
  'R1 draws only {iProgram}, under the {I_LOAD_MIN} minimum load. With the real load disconnected the output drifts up. Use R1 no larger than {r1Max}, or fit a permanent bleeder.':
    "R1 yalnızca {iProgram} çekiyor; bu, {I_LOAD_MIN} en küçük yükün altında. Gerçek yük bağlı değilken çıkış yukarı kayar. R1'i {r1Max} değerinden büyük seçmeyin ya da kalıcı bir boşaltma direnci takın.",
  'R1 has an upper bound the ratio does not show. The part needs {I_LOAD_MIN} of load to regulate, so the divider is normally sized to supply it on its own: `R1 ≤ Vref/Imin = {I_LOAD_MIN2}` . That is where the 240 Ω on every reference schematic comes from.':
    "R1'in oranın göstermediği bir üst sınırı vardır. Parça regüle edebilmek için {I_LOAD_MIN} yük ister, bu yüzden bölücü normalde bunu tek başına sağlayacak biçimde boyutlandırılır: `R1 ≤ Vref/Imin = {I_LOAD_MIN2}` . Her referans şemadaki 240 Ω buradan gelir.",
  'R2 (ADJ to GND)': "R2 (ADJ'den GND'ye)",
  'R2 (base to gnd)': 'R2 (beyzden şaseye)',
  'R2 (bottom)': 'R2 (alt)',
  'R2 (to ground)': 'R2 (toprağa)',
  'R2 for target': 'Hedef için R2',
  'R2 from {series}': '{series} serisinden R2',
  'R2 ideal': 'İdeal R2',
  'Radiated share': 'Işıma payı',
  'Radio': 'Telsiz',
  'Rail + Rs': 'Hat + Rs',
  'Rail to rail': 'Hattan hatta',
  'Rail Vs': 'Hat Vs',
  'Rails': 'Hatlar',
  'Range': 'Aralık',
  'Range at {MARGIN_MIN_DB} dB margin': '{MARGIN_MIN_DB} dB payla menzil',
  'Range at 0 dB margin': '0 dB payla menzil',
  'rate it for {vDiodeStress}': '{vDiodeStress} için seçin',
  'rated {vaRating} VA': 'anma {vaRating} VA',
  'Rated capacity': 'Anma kapasitesi',
  'raw': 'ham',
  'RB dissipation': 'RB güç kaybı',
  'RB for ODF {ODF_TARGET}': 'ODF {ODF_TARGET} için RB',
  'RC and Schmitt trigger debounce sizing from measured bounce time.':
    'Ölçülen sıçrama süresinden RC ve Schmitt tetikleyici debounce boyutlandırma.',
  'RC Filter (Low / High Pass)': 'RC Filtre (Alçak / Yüksek Geçiren)',
  'RC, ro ignored': 'RC, ro yok sayıldı',
  'Rcs interface': 'Arayüz Rcs',
  'RDS(on) at this VGS': "Bu VGS'te RDS(on)",
  'RDS(on) is not a constant. Deep in triode the channel is `rds = 1 / (k·Vov)`, so a datasheet quote pins down k: `k = 1 / (RDS(on)spec · (VGSspec - Vth))`, and at any other gate voltage `RDS(on) = RDS(on)spec · (VGSspec - Vth) / (VGS - Vth)`. That is why a part advertised at 22 mΩ is nearer 51 mΩ on 3.3 V, and why a part quoted at 10 V is simply off.':
    "RDS(on) sabit değildir. Triyot bölgesinin derinlerinde kanal `rds = 1 / (k·Vov)` olur, yani veri sayfasındaki bir değer k'yi belirler: `k = 1 / (RDS(on)veri · (VGSveri - Vth))`, ve başka herhangi bir kapı geriliminde `RDS(on) = RDS(on)veri · (VGSveri - Vth) / (VGS - Vth)` olur. 22 mΩ diye duyurulan bir parçanın 3,3 V'ta 51 mΩ'a yakın olmasının ve 10 V'ta belirtilmiş bir parçanın büsbütün konu dışı kalmasının nedeni budur.",
  'RDS(on) quoted': 'Belirtilen RDS(on)',
  'Reactance': 'Reaktans',
  'Reactance is frequency dependent: `XL = 2·pi·f·L` rises with frequency and `XC = 1/(2·pi·f·C)` falls. Written as complex impedances they are `+jXL` and `-jXC`, so they subtract rather than add, and at one particular frequency they cancel entirely.':
    'Reaktans frekansa bağlıdır: `XL = 2·pi·f·L` frekansla yükselir, `XC = 1/(2·pi·f·C)` ise düşer. Karmaşık empedans olarak yazıldıklarında `+jXL` ve `-jXC` olurlar, yani toplanmak yerine birbirlerinden çıkarlar ve belirli bir frekansta tamamen sönümlenirler.',
  'Reactance Xc': 'Reaktans Xc',
  'Reactance XL': 'Reaktans XL',
  'Reactive energy / day': 'Günlük reaktif enerji',
  'Reactive Energy / Power Factor': 'Reaktif Enerji / Güç Katsayısı',
  'Reactive power Q': 'Reaktif güç Q',
  'Reading a battery level, a potentiometer, or any analogue sensor on an ESP32. It matters because the ADC is only linear over part of its range, so a divider that lands outside the usable window reads compressed or flat exactly where you need accuracy, and because a high-impedance divider gives readings that quietly depend on the sampling rate.':
    'Bir ESP32 üzerinde batarya seviyesi, potansiyometre veya herhangi bir analog sensör okumak. Önemlidir, çünkü ADC yalnızca aralığının bir bölümünde doğrusaldır, dolayısıyla kullanılabilir pencerenin dışına düşen bir bölücü tam da doğruluğa ihtiyaç duyduğunuz yerde sıkışık veya düz okur; ayrıca yüksek empedanslı bir bölücü, örnekleme hızına sessizce bağlı okumalar verir.',
  'Reading the part you just pulled out of the drawer, or marking one in a BOM. It covers colour bands and all three SMD schemes, including EIA-96 which is unreadable without the table, and shows why tolerance and the E-series always go together.':
    'Çekmeceden yeni çıkardığınız parçayı okumak veya bir BOM içinde işaretlemek. Renk bantlarını ve üç SMD şemasının hepsini kapsar, tablo olmadan okunamayan EIA-96 dahil, ve toleransla E-serisinin neden her zaman birlikte gittiğini gösterir.',
  'Real COP': 'Gerçek COP',
  'Real machines reach a fraction of Carnot, here the second-law efficiency, typically 0.4 to 0.6 for domestic units. So `COP = eta · Th/(Th - Tc)` and the heat delivered is `Qh = COP · W`.':
    "Gerçek makineler Carnot'un bir kısmına ulaşır; buradaki ikinci yasa verimi, evsel birimlerde tipik olarak 0,4 - 0,6'dır. Yani `COP = eta · Th/(Th - Tc)` olur ve verilen ısı `Qh = COP · W` eder.",
  'real part': 'gerçek kısım',
  'Real parts': 'Gerçek parçalar',
  'Real power': 'Aktif güç',
  'Real power P': 'Aktif güç P',
  'Real-time clocks, radio frequency references, and any microcontroller with an external crystal. If the load capacitors are wrong the crystal still oscillates, just at the wrong frequency, so this is usually the answer when a clock drifts by minutes a month or a radio link will not tune.':
    'Gerçek zamanlı saatler, radyo frekans referansları ve harici kristalli her mikrodenetleyici. Yük kondansatörleri yanlışsa kristal yine salınır, sadece yanlış frekansta; bu yüzden bir saat ayda dakikalarca kaydığında veya bir radyo bağlantısı ayarlanmadığında cevap genellikle budur.',
  'Real, reactive and apparent power, with the capacitor needed to correct PF.':
    'Aktif, reaktif ve görünür güç, güç katsayısını düzeltmek için gereken kondansatörle.',
  'Received power': 'Alınan güç',
  'Recharge time': 'Doldurma süresi',
  'Recommended': 'Önerilen',
  'Recommended supply': 'Önerilen besleme',
  'Recovery time': 'Toparlanma süresi',
  'Rectifier': 'Doğrultucu',
  'Rectifier stress': 'Doğrultucu zorlanması',
  'red': 'kırmızı',
  'Red': 'Kırmızı',
  'red, 2%': 'kırmızı, %2',
  'Reference R2': 'Referans R2',
  'Reference temp': 'Referans sıcaklığı',
  'Reference Vbias': 'Referans Vbias',
  'Reference Vref': 'Referans Vref',
  'Reflected impedance': 'Yansıyan empedans',
  'Regulating input range': 'Regüle eden giriş aralığı',
  'Regulation': 'Regülasyon',
  'Regulation is what winding resistance costs you. Current through the secondary resistance, plus the primary resistance reflected across the same ratio, drops voltage in proportion to load. So the no-load voltage is always higher than the nameplate, and a small transformer can read 25% high when unloaded.':
    'Regülasyon, sargı direncinin size ödettiği bedeldir. İkincil direncinden geçen akım, artı aynı oranla yansıtılan birincil direnci, gerilimi yükle orantılı olarak düşürür. Yani yüksüz gerilim her zaman etiket değerinden yüksektir ve küçük bir trafo yüksüzken %25 fazla okuyabilir.',
  'Regulation quality comes from the dynamic impedance Zz, not the DC clamp. Rs and Zz form a divider for anything riding on the input, so `dVout/dVin = Zz / (Rs + Zz)`, and the output impedance seen by the load is `Rs ∥ Zz`. Note the trade: a large Rs is efficient but a poor regulator.':
    "Regülasyon kalitesi DC kırpmasından değil, dinamik empedans Zz'den gelir. Rs ile Zz, girişe binen her şey için bir bölücü oluşturur, yani `dVout/dVin = Zz / (Rs + Zz)` olur ve yükün gördüğü çıkış empedansı `Rs ∥ Zz` eder. Ödünleşmeye dikkat: büyük bir Rs verimlidir ama kötü bir regülatördür.",
  'Regulator': 'Regülatör',
  'Relays, solenoids, motors and switch-mode converters. The critical output is the kickback: interrupting current through an inductor produces a voltage spike that destroys the transistor doing the switching. This shows how big that spike is and what a flyback diode clamps it to, which is why that diode is not optional.':
    'Röleler, solenoidler, motorlar ve anahtarlamalı dönüştürücüler. Kritik çıktı ters gerilimdir: bir bobinden geçen akımı kesmek, anahtarlamayı yapan transistörü yok eden bir gerilim tepesi üretir. Bu sayfa o tepenin ne kadar büyük olduğunu ve bir freewheeling diyotun onu neye sınırladığını gösterir; o diyotun neden isteğe bağlı olmadığı da budur.',
  'Release time': 'Bırakma süresi',
  'Requested bits': 'İstenen bit',
  'Required width': 'Gereken genişlik',
  'Requirement': 'Gereksinim',
  'Reservoir cap': 'Depo kondansatörü',
  'resistance': 'direnç',
  'Resistance': 'Direnç',
  'Resistance cold': 'Soğuk direnç',
  'Resistance drifts with temperature too, so the settled power is not the switch-on power. This is why the simulation freezes the power over each step and applies the exact solution: the feedback is negative for every real element alloy, hotter means more resistance means less power, so it converges rather than running away.':
    'Direnç de sıcaklıkla kayar, yani oturmuş güç açılış gücü değildir. Benzetimin gücü her adımda dondurup tam çözümü uygulamasının nedeni budur: geri besleme her gerçek eleman alaşımı için negatiftir, daha sıcak demek daha çok direnç, o da daha az güç demektir; bu yüzden kaçmak yerine yakınsar.',
  'Resistance hot': 'Sıcak direnç',
  'Resistance is `R = rho·L/A` with copper at 1.68e-8 Ω·m. The drop is `V = I·R` over *both* conductors, since the current has to come back. Halving that by only counting one leg is the single most common error in cable sizing.':
    'Direnç, bakır için 1,68e-8 Ω·m ile `R = rho·L/A` olur. Düşüm, akımın geri dönmesi gerektiği için *her iki* iletken üzerinden `V = I·R` eder. Yalnızca bir bacağı sayarak bunu yarıya indirmek, kablo boyutlandırmasındaki en yaygın tek hatadır.',
  'Resistance is `R = rho·L/A`, so power at a fixed supply is `P = V²/R`. Halving the length halves the resistance and doubles the power, which is the usual way people accidentally burn out a pen tip.':
    'Direnç `R = rho·L/A` ile bulunur, yani sabit bir beslemede güç `P = V²/R` olur. Uzunluğu yarıya indirmek direnci yarıya indirir ve gücü ikiye katlar; insanların kalem ucunu kazara yakmasının alışılmış yolu budur.',
  'Resistance now': 'Şimdiki direnç',
  'Resistance per metre': 'Metre başına direnç',
  'Resistive and constant-power loads behave differently as the pack drains. A resistor draws less current as voltage falls, so it tails off gently. A constant-power load draws *more* current as voltage falls, which accelerates the collapse at the end: this is exactly the behaviour of a switching regulator feeding an ESP32, and it is why the last few percent of a pack disappears so suddenly.':
    "Dirençli ve sabit güçlü yükler paket boşalırken farklı davranır. Bir direnç gerilim düştükçe daha az akım çeker, bu yüzden yumuşakça söner. Sabit güçlü bir yük ise gerilim düştükçe *daha fazla* akım çeker ve bu da sondaki çöküşü hızlandırır: bir ESP32'yi besleyen anahtarlamalı regülatörün davranışı tam olarak budur ve paketin son yüzde birkaçının neden bu kadar ani yok olduğunu açıklar.",
  'Resistive equivalent': 'Dirençli eşdeğeri',
  'Resistive Heating': 'Dirençli Isıtma',
  'Resistive season': 'Dirençli sezon',
  'Resistive voltage divider': 'Dirençli gerilim bölücü',
  'Resistor': 'Direnç',
  'Resistor Colour / SMD Code': 'Direnç Renk / SMD Kodu',
  'Resistor headroom': 'Direnç payı',
  'Resistor package': 'Direnç kılıfı',
  'Resistor pick, dissipation, and a warning when a GPIO cannot source the current.':
    'Direnç seçimi, güç kaybı ve GPIO akımı veremediğinde uyarı.',
  'Resistor power': 'Direnç gücü',
  'Resistor rating': 'Direnç gücü',
  'Resistor series': 'Direnç serisi',
  'Resolution': 'Çözünürlük',
  'Resolution at battery': 'Pildeki çözünürlük',
  'Resonance f0': 'Rezonans f0',
  'Resonance is where the two reactances cancel, `Xl = Xc`, giving `f0 = 1 / (2·pi·sqrt(L·C))`. It does not depend on R.':
    "Rezonans, iki reaktansın sönümlendiği yerdir, `Xl = Xc`; buradan `f0 = 1 / (2·pi·sqrt(L·C))` çıkar. R'ye bağlı değildir.",
  'Response at {frequency}': '{frequency} frekansındaki yanıt',
  'rest is convection': 'gerisi taşınım',
  'Reverse flow peak': 'Ters akış tepesi',
  'Rf': 'Rf',
  'RF Link Budget (LoRa / WiFi)': 'RF Link Bütçesi (LoRa / WiFi)',
  'Rin': 'Rin',
  'Ring frequency fd': 'Çınlama frekansı fd',
  'ripple': 'dalgalanma',
  'Ripple': 'Dalgalanma',
  'Ripple factor': 'Dalgalanma çarpanı',
  'Ripple is {rippleFactor}% of the output. The Vdc = Vpeak - Vr/2 approximation only holds for small ripple, so trust the measured trace over the textbook column.':
    'Dalgalanma çıkışın %{rippleFactor} kadarı. Vdc = Vtepe - Vr/2 yaklaşıklığı yalnızca küçük dalgalanmalarda geçerlidir, bu yüzden ders kitabı sütunu yerine ölçülen ize güvenin.',
  'Ripple is {rippleRatio} of the average input current. The usual target is 30 to 40%: past that the peak current, the core loss and the output ripple all grow for no benefit. Raise L or fsw.':
    "Dalgalanma, ortalama giriş akımının {rippleRatio} kadarı. Alışılmış hedef %30 - 40'tır: ötesinde tepe akımı, çekirdek kaybı ve çıkış dalgalanması hiçbir kazanç sağlamadan büyür. L'yi ya da fsw'yi yükseltin.",
  'Ripple is {rippleRatio}% of the load current. The usual design target is 20 to 40%: more than that wastes inductor headroom and pushes the peak toward saturation.':
    "Dalgalanma, yük akımının %{rippleRatio} kadarı. Alışılmış tasarım hedefi %20 - 40'tır: fazlası bobin boşluğunu harcar ve tepeyi doyuma doğru iter.",
  'Ripple is `dIL = vL(on)·D/(fsw·L)`. Aim for 30 to 40% of the average current: less means a bulky inductor, more pushes the peak toward saturation and raises RMS heating. When ripple exceeds twice the average, current hits zero and the converter drops into discontinuous conduction.':
    "Dalgalanma `dIL = vL(on)·D/(fsw·L)` ile bulunur. Ortalama akımın %30 - 40'ını hedefleyin: azı hantal bir bobin demektir, fazlası tepeyi doyuma iter ve RMS ısınmasını artırır. Dalgalanma ortalamanın iki katını aştığında akım sıfıra iner ve dönüştürücü kesintili iletime düşer.",
  'Ripple is just the ramp: with `Vin` across the inductor for `ton = D/fsw`, `dIL = Vin·D/(fsw·L)` peak to peak, sitting on top of `Iin`. What matters for the inductor is the peak, `Iin + dIL/2`, because that is what saturates the core. Output ripple is `Iout·D/(fsw·Cout)` from the charge the cap gives up while the diode is off, plus `Ipeak·ESR` from the current step, which in a real design is usually the bigger of the two.':
    'Dalgalanma yalnızca rampadır: bobin üzerinde `ton = D/fsw` boyunca `Vin` varken tepeden tepeye `dIL = Vin·D/(fsw·L)` olur ve bu `Iin` üzerine biner. Bobin için önemli olan tepe değeridir, `Iin + dIL/2`, çünkü çekirdeği doyuran odur. Çıkış dalgalanması, diyot kapalıyken kondansatörün verdiği yükten gelen `Iout·D/(fsw·Cout)` ile akım basamağından gelen `Ipeak·ESR` toplamıdır; gerçek bir tasarımda genellikle ikincisi baskındır.',
  'Ripple is usually quoted as `Vpp ≈ Vs·D·(1-D) / (f·R·C)`, which is the small-ripple limit. This page solves it exactly: with `a = e^(-D·T/tau)` and `b = e^(-(1-D)·T/tau)`, matching charge against discharge over one period gives `Vpp = Vs·(1-a)(1-b) / (1-a·b)`. The two agree to a fraction of a percent once tau is more than about ten switching periods, and the approximation reads high below that. Worst-case ripple is always at 50% duty.':
    'Dalgalanma genellikle `Vpp ≈ Vs·D·(1-D) / (f·R·C)` olarak verilir ve bu küçük dalgalanma sınırıdır. Bu sayfa onu tam olarak çözer: `a = e^(-D·T/tau)` ve `b = e^(-(1-D)·T/tau)` ile bir çevrim boyunca şarjı deşarja eşitlemek `Vpp = Vs·(1-a)(1-b) / (1-a·b)` verir. tau yaklaşık on anahtarlama çevriminden büyük olduğunda ikisi yüzdenin kesri kadar uyuşur; bunun altında yaklaşıklık yüksek okur. En kötü dalgalanma her zaman %50 görev çevrimindedir.',
  'Ripple on the ADC': "ADC'deki dalgalanma",
  'Ripple rejection': 'Dalgalanma bastırma',
  'Ripple split C / ESR': 'Dalgalanma payı C / ESR',
  'Ripple Vpp': 'Dalgalanma Vpp',
  'Rise time': 'Yükselme süresi',
  'Rise time (10-90%)': 'Yükselme süresi (%10-90)',
  'Rise time tr': 'Yükselme süresi tr',
  'Rise to VIH': "VIH'ye yükselme",
  'Rise vs bit period': 'Yükselme / bit süresi',
  'Rjc junction to case': 'Jonksiyondan kılıfa Rjc',
  'RL': 'RL',
  'RL / Zout': 'RL / Zout',
  'RL Filter': 'RL Filtre',
  'RL is only {stiffness}x Zout, so this is not a voltage source, it is a resistor network. Design around the loaded number or drop both divider values.':
    "RL, Zout'un yalnızca {stiffness} katı; yani bu bir gerilim kaynağı değil, bir direnç ağıdır. Yüklü değere göre tasarlayın ya da iki bölücü değerini de küçültün.",
  'RLC Resonance': 'RLC Rezonansı',
  'RMS': 'RMS',
  'RMS per diode': 'Diyot başına RMS',
  'rms, {vPeakIn} peak': 'rms, {vPeakIn} tepe',
  'RMS, AC only': 'RMS, yalnızca AC',
  'RMS, with DC': 'RMS, DC dahil',
  'Robot arms, pan and tilt mounts, RC conversions, and anything with a hobby servo. It matters because servos read pulse width rather than duty, so only a small slice of the timer range is useful, and a low LEDC resolution leaves too few steps across the travel to move smoothly.':
    'Robot kolları, pan-tilt düzenekleri, RC dönüşümleri ve hobi servosu içeren her şey. Önemlidir, çünkü servolar görev oranını değil darbe genişliğini okur, dolayısıyla zamanlayıcı aralığının yalnızca küçük bir dilimi işe yarar ve düşük LEDC çözünürlüğü, hareket boyunca pürüzsüz hareket için fazla az adım bırakır.',
  'Rprog': 'Rprog',
  'rrl': 'rrl',
  'Rs': 'Rs',
  'Rs dissipation': 'Rs güç kaybı',
  'Rs fitted': 'Takılan Rs',
  'Rs window': 'Rs penceresi',
  'Rsa required': 'Gereken Rsa',
  'Rsa sink to air': 'Soğutucudan havaya Rsa',
  'Rth junction to air': 'Jonksiyondan havaya Rth',
  'Rth junction to ambient': 'Jonksiyondan ortama Rth',
  'Run length': 'Hat uzunluğu',
  'Run resistance': 'Hat direnci',
  'Running cost': 'İşletme maliyeti',
  'Running in discontinuous conduction: inductor current reaches zero each cycle. The conversion ratio then depends on load, not just duty, so the output moves as the load changes and the control loop gets harder.':
    'Kesintili iletimde çalışıyor: bobin akımı her çevrimde sıfıra iniyor. Dönüşüm oranı o zaman yalnızca görev çevrimine değil yüke de bağlıdır, bu yüzden yük değiştikçe çıkış kayar ve denetim çevrimi zorlaşır.',
  'Running something from a battery that is below the voltage it needs: 3.7 V lithium up to 5 V, or two AA cells up to 3.3 V. The catch this page makes visible is input current, which is always higher than output current, so a boost from a nearly flat cell draws far more than beginners expect.':
    'İhtiyaç duyduğu gerilimin altındaki bir bataryadan bir şey çalıştırmak: 3.7 V lityumdan 5 Va veya iki AA pilden 3.3 Va. Bu sayfanın görünür kıldığı incelik giriş akımıdır; her zaman çıkış akımından yüksektir, bu yüzden neredeyse boşalmış bir pilden yapılan yükseltme, yeni başlayanların beklediğinden çok daha fazla akım çeker.',
  'Runtime': 'Çalışma süresi',
  'Runtime to cover season': 'Sezonu karşılayan çalışma süresi',
  'RX antenna gain': 'RX anten kazancı',
  'saturated': 'doyumda',
  'Saturated dissipation is `P = VCEsat·IC + VBE·IB`, a few milliwatts here. In the active region VCE is volts rather than 0.2 V and the same current turns into heat, which is how switching transistors die.':
    'Doyumdaki güç kaybı `P = VCEdoyum·IC + VBE·IB` olur, burada birkaç miliwatt. Aktif bölgede VCE 0,2 V yerine voltlar mertebesindedir ve aynı akım ısıya dönüşür; anahtarlama transistörleri işte böyle ölür.',
  'saturated, thin margin': 'doyumda, pay dar',
  'saturation': 'doyum',
  'Saturation (constant current)': 'Doyum (sabit akım)',
  'Saturation current': 'Doyum akımı',
  'Saturation headroom': 'Doyum payı',
  'saves {lossSaved}': '{lossSaved} tasarruf',
  'Saving at this point': 'Bu noktadaki tasarruf',
  'Saw': 'Testere',
  'sawtooth': 'testere',
  'Sawtooth': 'Testere',
  'schottky': 'schottky',
  'Schottky': 'Schottky',
  'Schottky 0.3 to 0.5 V, silicon 0.7 V, sync rectifier near 0.':
    'Schottky 0,3 - 0,5 V, silisyum 0,7 V, senkron doğrultucu sıfıra yakın.',
  'Scope': 'Osiloskop',
  'Scope window': 'Osiloskop penceresi',
  'Scroll or pinch to zoom the time base, drag to pan, double click to reset.':
    'Zaman tabanını yakınlaştırmak için kaydırın veya sıkıştırın, kaydırmak için sürükleyin, sıfırlamak için çift tıklayın.',
  'SDA': 'SDA',
  'Season heat demand': 'Sezonluk ısı talebi',
  'Seasonal COP': 'Sezonluk COP',
  'Seasonal cost': 'Sezonluk maliyet',
  'Seasonal electricity': 'Sezonluk elektrik',
  'Seasonal saving': 'Sezonluk tasarruf',
  'Second-law efficiency': 'İkinci yasa verimi',
  'Secondary': 'İkincil',
  'Secondary copper loss': 'İkincil bakır kaybı',
  'Secondary current': 'İkincil akım',
  'Secondary resistance': 'İkincil direnç',
  'Secondary turns': 'İkincil sarım',
  'Secondary, loaded': 'İkincil, yüklü',
  'Secondary, no load': 'İkincil, yüksüz',
  'seen by the primary': 'birincilin gördüğü',
  'seg': 'seg',
  'Self heating': 'Kendi kendini ısıtma',
  'Self heating error': 'Kendi kendini ısıtma hatası',
  'Self heating is the trap. Current through the bead makes heat, the dissipation constant (typically 1 to 5 mW/K in still air) converts that to a temperature error, and the sensor confidently reports it. Keep the current small, or power the divider only for the microseconds you are sampling.':
    'Asıl tuzak kendi kendini ısıtmadır. Boncuktan geçen akım ısı üretir, ısı dağıtma sabiti (durgun havada tipik olarak 1 - 5 mW/K) bunu bir sıcaklık hatasına çevirir ve algılayıcı bunu güvenle bildirir. Akımı küçük tutun ya da bölücüye yalnızca örnekleme yaptığınız mikrosaniyeler boyunca güç verin.',
  'Semiconductors': 'Yarı İletkenler',
  'sensitivity': 'duyarlılık',
  'Sensitivity': 'Duyarlılık',
  'Sensitivity is the derivative at the operating point, for example `dVout/dR4 = -Vin·R3/(R3+R4)²`. With four equal arms that collapses to `Vin/4` per unit `ΔR/R`, the number every strain gauge datasheet quotes. The exact single-arm response is `Vout = -(Vin/4)·x/(1 + x/2)` for `x = ΔR/R`, so the amber tangent trace and the violet true curve pull apart as the sweep leaves the operating point. That gap is the bridge nonlinearity, about 0.05% at 1000 microstrain and several percent for a thermistor.':
    'Duyarlılık, çalışma noktasındaki türevdir, örneğin `dVout/dR4 = -Vin·R3/(R3+R4)²`. Dört eşit kolla bu, birim `ΔR/R` başına `Vin/4` ifadesine iner; her gerinim ölçer veri sayfasının verdiği sayı budur. Tek kollu tam yanıt, `x = ΔR/R` için `Vout = -(Vin/4)·x/(1 + x/2)` olur; bu yüzden kehribar renkli teğet izi ile mor gerçek eğri, tarama çalışma noktasından uzaklaştıkça birbirinden ayrılır. O açıklık köprü doğrusalsızlığıdır; 1000 mikrogerinimde yaklaşık %0,05, bir termistörde ise yüzde birkaçtır.',
  'Sensitivity is where LoRa earns its keep. Spreading the signal over more time buys processing gain: SF7 gets to about -123 dBm, SF12 to about -137 dBm. That 14 dB is a factor of five in range, paid for in data rate and airtime.':
    "LoRa'nın hakkını verdiği yer duyarlılıktır. İşareti daha uzun zamana yaymak işlem kazancı sağlar: SF7 yaklaşık -123 dBm'e, SF12 yaklaşık -137 dBm'e iner. O 14 dB, menzilde beş kat demektir ve bedeli veri hızı ile yayın süresidir.",
  "Sensitivity peaks when the series resistor equals the thermistor's resistance at the temperature you care most about. For best resolution around {t0C} °C, set the series resistor to {r0}.":
    'Duyarlılık, seri direnç termistörün en çok önemsediğiniz sıcaklıktaki direncine eşit olduğunda tepe yapar. {t0C} °C çevresinde en iyi çözünürlük için seri direnci {r0} yapın.',
  'Sensor': 'Algılayıcı',
  'Sensor arm': 'Algılayıcı kolu',
  'Sensor range': 'Algılayıcı aralığı',
  'Sensors & Measurement': 'Sensörler ve Ölçüm',
  'series': 'seri',
  'Series': 'Seri',
  'Series and parallel resonance, damping and step ringing.':
    'Seri ve paralel rezonans, sönümleme ve basamak çınlaması.',
  'Series and parallel RLC impedance against frequency, magnitude and phase.':
    'Frekansa karşı seri ve paralel RLC empedansı, genlik ve faz.',
  'Series loss': 'Seri kayıp',
  'Series resistor': 'Seri direnç',
  'Series resistor sizing across the load range, zener power check.':
    'Yük aralığı boyunca seri direnç boyutlandırma, zener güç kontrolü.',
  'Series Rs': 'Seri Rs',
  'Series/parallel, stored energy, charge and discharge curves.':
    'Seri/paralel, depolanan enerji, şarj ve deşarj eğrileri.',
  'Servo': 'Servo',
  'Servo position is encoded purely in pulse width: {minPulse} at one end of travel, {maxPulse} at the other, repeated every 20 ms. The gap between pulses carries no information, it just refreshes the command.':
    "Servo konumu yalnızca darbe genişliğinde kodlanır: hareketin bir ucunda {minPulse}, öbür ucunda {maxPulse}, her 20 ms'de yinelenir. Darbeler arasındaki boşluk hiçbir bilgi taşımaz, yalnızca komutu tazeler.",
  'Servo PWM': 'Servo PWM',
  'Set current': 'Ayarlanan akım',
  'Set resistors, dissipation and whether it needs a heatsink.':
    'Ayar dirençleri, güç kaybı ve soğutucu gerekip gerekmediği.',
  'sets its temperature': 'sıcaklığını bu belirler',
  'Settled (5 tau)': 'Oturdu (5 tau)',
  'Settled current': 'Oturmuş akım',
  'Settling time': 'Oturma süresi',
  'Settling to 1%': "%1'e oturma",
  'Shunt + amplifier': 'Şönt + yükselteç',
  'Shunt C0': 'Paralel C0',
  'Shunt capacitor': 'Paralel kondansatör',
  'Shunt front end': 'Şönt ön katı',
  'Shunt inductor': 'Paralel bobin',
  'Shunt loss': 'Paralel kayıp',
  'Shunt power': 'Şönt gücü',
  'Shunt resistance': 'Şönt direnci',
  'Shunt resistance is too low to support the stated Voc, so the model collapses Voc toward Iph·Rsh. Raise Rsh or lower Voc: a real panel this shunted would be faulty.':
    "Paralel direnç, belirtilen Voc'yi destekleyemeyecek kadar düşük; bu yüzden model Voc'yi Iph·Rsh değerine doğru çökertiyor. Rsh'yi yükseltin ya da Voc'yi düşürün: bu kadar paralel kaçaklı gerçek bir panel arızalı olurdu.",
  'Shunt Rsh': 'Paralel Rsh',
  'Shunt sizing against burden voltage, plus ACS712 and INA219 resolution.':
    'Yük gerilimine karşı şönt boyutlandırma, ayrıca ACS712 ve INA219 çözünürlüğü.',
  'Shunt voltage': 'Şönt gerilimi',
  'signal': 'işaret',
  'Signal swing': 'Sinyal salınımı',
  'silicon': 'silisyum',
  'silver, 10%': 'gümüş, %10',
  'Simple adjustable supplies, current sources for LEDs and battery charging, and cases where switching noise is unacceptable. The critical output is dissipation: a linear regulator burns the voltage difference as heat, so 12 V to 3.3 V at 1 A means nearly 9 W and a heatsink, which is why a buck converter usually wins.':
    'Basit ayarlanabilir beslemeler, LEDler ve batarya şarjı için akım kaynakları ve anahtarlama gürültüsünün kabul edilemez olduğu durumlar. Kritik çıktı güç kaybıdır: lineer regülatör gerilim farkını ısı olarak yakar, dolayısıyla 1 Ade 12 Vtan 3.3 Va neredeyse 9 W ve bir soğutucu demektir; buck dönüştürücünün genelde kazanmasının nedeni budur.',
  'Simulators and calculators for electronics engineers':
    'Elektronik mühendisleri için simülatörler ve hesaplayıcılar',
  'sine': 'sinüs',
  'Sine': 'Sinüs',
  'Single': 'Tek',
  'Single diode model of a silicon panel. The scope plots the I-V and P-V curves against PANEL VOLTAGE, not time: the horizontal axis runs 0 V to Voc. Power is scaled down by 10 so it shares the axis with current.':
    'Silisyum bir panelin tek diyot modeli. Osiloskop, I-V ve P-V eğrilerini zamana değil PANEL GERİLİMİNE karşı çizer: yatay eksen 0 Vtan Voc değerine gider. Güç, akımla aynı ekseni paylaşsın diye 10a bölünmüştür.',
  'single feed is fine': 'tek besleme yeterli',
  'single part': 'tek parça',
  'Single-diode model: I-V and P-V curves, MPP against irradiance and temperature.':
    'Tek diyot modeli: I-V ve P-V eğrileri, ışınım ve sıcaklığa karşı MPP.',
  'Sink current': 'Çekilen akım',
  'Sink heat capacity': 'Soğutucu ısı sığası',
  'Sink time constant': 'Soğutucu zaman sabiti',
  'Sink Ts': 'Soğutucu Ts',
  'Site and system': 'Saha ve sistem',
  'Size a panel and battery for a solar powered node. The load comes from the same duty-cycle arithmetic as the deep sleep page, then the panel has to replace it on an average day and the battery has to carry the node through the bad ones.':
    'Güneş enerjili bir düğüm için panel ve batarya boyutlandırın. Yük, derin uyku sayfasındaki aynı görev çevrimi aritmetiğinden gelir; ardından panelin bunu ortalama bir günde geri koyması, bataryanın ise düğümü kötü günlerde taşıması gerekir.',
  'Size by': 'Boyutlandırma ölçütü',
  'Size the series resistor so the zener still regulates at the lowest input with the heaviest load, and still survives the highest input with no load at all. Every figure is a worst case, not a nominal.':
    'Seri direnci, zener en düşük girişte ve en ağır yükte hâlâ regüle edecek, en yüksek girişte ve hiç yük yokken hâlâ dayanacak şekilde boyutlandırın. Her değer nominal değil, en kötü durumdur.',
  'Size the supply for the peak you could command, not the average you intend. Software that accidentally sets every pixel white will pull the full current, and a supply sized for the artistic intent will either shut down or sag until the data signal fails.':
    'Beslemeyi, amaçladığınız ortalamaya göre değil, komut verebileceğiniz tepeye göre boyutlandırın. Her pikseli yanlışlıkla beyaz yapan bir yazılım tüm akımı çeker ve sanatsal niyete göre boyutlandırılmış bir besleme ya kapanır ya da veri işareti bozulana dek çöker.',
  'Sizing decoupling and bulk capacitors, timing networks, energy storage for a burst load such as a radio transmission, and working out how long a supply rail holds up after power is removed. The energy figure is what tells you whether a capacitor can carry an ESP32 through a WiFi transmit spike.':
    'Dekuplaj ve toplu kondansatörleri, zamanlama ağlarını, radyo iletimi gibi ani yükler için enerji depolamasını boyutlandırmak ve güç kesildikten sonra besleme hattının ne kadar dayandığını bulmak. Enerji değeri, bir kondansatörün ESP32 kartını WiFi iletim tepesi boyunca taşıyıp taşıyamayacağını söyleyen şeydir.',
  'Sizing panels, understanding why an MPPT controller earns its cost, and why a panel rated 100 W rarely delivers it. The temperature coefficient is the practical takeaway: panels lose voltage as they heat, so a string sized on a datasheet at 25 °C can drop below the MPPT input window on a hot roof.':
    'Panel boyutlandırmak, bir MPPT kontrolcüsünün maliyetini neden çıkardığını ve 100 W etiketli bir panelin bunu neden nadiren verdiğini anlamak. Pratik çıkarım sıcaklık katsayısıdır: paneller ısındıkça gerilim kaybeder, bu yüzden 25 °C veri sayfasına göre boyutlandırılmış bir dizi, sıcak bir çatıda MPPT giriş aralığının altına düşebilir.',
  'Sleep current': 'Uyku akımı',
  "Sleep current is {sleepShare}% of the budget, so optimising the wake phase buys you almost nothing. Attack the standby draw instead: a linear regulator's quiescent current, a permanently connected divider, or a peripheral left powered are the usual culprits, and each can dwarf the ESP32's own 10 µA.":
    "Uyku akımı bütçenin %{sleepShare} kadarı, yani uyanık evreyi iyileştirmek size neredeyse hiçbir şey kazandırmaz. Bunun yerine bekleme tüketimine yüklenin: bir doğrusal regülatörün durgun akımı, sürekli bağlı bir bölücü ya da açık bırakılmış bir çevre birimi alışılmış suçlulardır ve her biri ESP32'nin kendi 10 µA'ini gölgede bırakabilir.",
  'Sleep share of budget': 'Bütçedeki uyku payı',
  'Sleep time': 'Uyku süresi',
  'Slew demanded': 'İstenen yönelim hızı',
  'Slew limited. The output needs {slewNeeded} but the part only does {slewRate}, so sine waves come out as triangles and the small-signal bandwidth figure no longer applies.':
    'Yönelim hızıyla sınırlı. Çıkış {slewNeeded} istiyor ama parça yalnızca {slewRate} yapıyor, bu yüzden sinüsler üçgen olarak çıkıyor ve küçük işaret bant genişliği değeri artık geçerli değil.',
  'Slew rate': 'Yönelim hızı',
  'slightly more gain': 'biraz daha kazanç',
  'Smaller R1 means a wider hysteresis band.': 'Küçük R1, geniş bir histerezis bandı demektir.',
  'SMD 3 digit': 'SMD 3 rakam',
  'SMD 4 digit': 'SMD 4 rakam',
  'SMD codes work the same way. Three digits is two figures plus an exponent, so 472 is 47 × 10², i.e. 4.7 kΩ. Four digits is three figures plus an exponent, so 4701 is 470 × 10¹, also 4.7 kΩ. Note the last digit is never a zero of the value itself, which catches people out constantly.':
    'SMD kodları aynı biçimde çalışır. Üç rakam, iki basamak artı bir üstür; yani 472, 47 × 10², yani 4,7 kΩ demektir. Dört rakam, üç basamak artı bir üstür; yani 4701, 470 × 10¹, yine 4,7 kΩ eder. Son rakamın hiçbir zaman değerin kendi sıfırı olmadığına dikkat edin; insanlar sürekli buna takılır.',
  'Solar + Battery Sizing': 'Güneş Paneli + Batarya Boyutlandırma',
  'SOT-223 (AMS1117) on copper pour': 'Bakır döküm üzerinde SOT-223 (AMS1117)',
  'SOT-23 small signal, free air': 'SOT-23 küçük işaret, serbest hava',
  'sot223': 'sot223',
  'sot23': 'sot23',
  'Source': 'Kaynak',
  'Source impedance': 'Kaynak empedansı',
  'Source impedance is above {ADC_MAX_SOURCE_OHMS}, so the ADC sample and hold will not settle inside its window. Use lower arm values or buffer the taps with an op amp.':
    "Kaynak empedansı {ADC_MAX_SOURCE_OHMS} üzerinde, yani ADC'nin örnekle ve tut devresi penceresi içinde oturmayacak. Daha küçük kol değerleri kullanın ya da orta uçları bir işlemsel yükselteçle tamponlayın.",
  'Source impedance of {sourceImpedance} is above the recommended {ADC_MAX_SOURCE_Z}. The sample-and-hold capacitor cannot charge in time, so readings come out low and depend on the sampling rate. Either lower the divider resistances or put a 100 nF capacitor across R2 to act as a charge reservoir.':
    "{sourceImpedance} kaynak empedansı, önerilen {ADC_MAX_SOURCE_Z} değerinin üzerinde. Örnekle ve tut kondansatörü zamanında dolamaz, bu yüzden okumalar düşük çıkar ve örnekleme hızına bağlı olur. Ya bölücü dirençlerini küçültün ya da yük deposu olarak R2'ye paralel 100 nF kondansatör koyun.",
  'Source load |Z|': 'Kaynak yükü |Z|',
  'Source resistance': 'Kaynak direnci',
  'Span about nominal': 'Anma değeri çevresinde aralık',
  'spec {clSpec}': 'veri sayfası {clSpec}',
  'Specified CL': 'Belirtilen CL',
  'Speed': 'Hız',
  'square': 'kare',
  'Square': 'Kare',
  'Stackup and geometry': 'Katman dizilimi ve geometri',
  'Stage': 'Kat',
  'Stainless 304': 'Paslanmaz 304',
  'Standard 1.0 to 2.0 ms': 'Standart 1,0 - 2,0 ms',
  'Standard 100 kHz': 'Standart 100 kHz',
  'Standard Resistor Values': 'Standart Direnç Değerleri',
  'Start from power on': 'Açılıştan başlat',
  'Start voltage': 'Başlangıç gerilimi',
  'Starting voltage': 'Başlangıç gerilimi',
  'startup': 'açılış',
  'Startup': 'Açılış',
  'static, when low': 'durağan, alçakken',
  'Steady current': 'Kararlı akım',
  'Steady-state inductor current in a step-up converter. The horizontal axis is time, a few switching periods wide. Sky is the inductor, green is what the switch pulls to ground, amber is what the diode hands to the output cap: the gap between those two is why the input current runs higher than the output current.':
    'Yükseltici dönüştürücüde kararlı hâl bobin akımı. Yatay eksen zamandır, birkaç anahtarlama periyodu genişliğinde. Mavi bobin, yeşil anahtarın toprağa çektiği akım, sarı diyotun çıkış kondansatörüne verdiği akımdır: bu ikisi arasındaki fark, giriş akımının çıkış akımından neden yüksek olduğunu açıklar.',
  'Steinhart-Hart, `1/T = A + B·ln(R) + C·ln(R)³`, gets to a few millikelvin over a wide range but needs three calibration points. The Beta form is the special case with C = 0.':
    'Steinhart-Hart, `1/T = A + B·ln(R) + C·ln(R)³`, geniş bir aralıkta birkaç milikelvine iner ama üç kalibrasyon noktası ister. Beta biçimi, bunun C = 0 olan özel hâlidir.',
  'Step height': 'Basamak yüksekliği',
  'Step ratio': 'Adım oranı',
  'Step response of an RLC network. The horizontal axis is time, the trace is the capacitor voltage (series) or the tank node voltage (parallel). Drop R to watch it ring, raise it to damp it out.':
    'Bir RLC ağının basamak tepkisi. Yatay eksen zamandır, iz kondansatör gerilimi (seri) veya tank düğüm gerilimidir (paralel). Çınlamayı görmek için R değerini düşürün, sönümlemek için yükseltin.',
  'Step size': 'Adım boyu',
  'Step-up duty, switch stress and inductor sizing.':
    'Yükseltme görev oranı, anahtar gerilim stresi ve bobin boyutlandırma.',
  'Stepping a higher rail down efficiently: 12 V to 5 V, 5 V to 3.3 V, battery to logic. This is how nearly every ESP32 board makes its 3.3 V rail from USB. The inductor ripple and CCM/DCM boundary decide whether the converter is quiet and well behaved or noisy and load dependent.':
    'Yüksek bir hattı verimli şekilde düşürmek: 12 Vtan 5 Va, 5 Vtan 3.3 Va, bataryadan lojiğe. Hemen her ESP32 kartı 3.3 V hattını USBden böyle üretir. Bobin dalgalanması ve CCM/DCM sınırı, dönüştürücünün sessiz ve uslu mu yoksa gürültülü ve yüke bağımlı mı olduğuna karar verir.',
  'Stored charge': 'Depolanan yük',
  'Stored energy': 'Depolanan enerji',
  'Stored energy at peak': 'Tepede depolanan enerji',
  'Stored energy is `E = 0.5·C·V²` and stored charge is `Q = C·V`. Energy is quadratic in voltage, so half the rail holds a quarter of the energy.':
    'Depolanan enerji `E = 0.5·C·V²`, depolanan yük ise `Q = C·V` ile bulunur. Enerji gerilimin karesiyle değişir, bu yüzden hattın yarısı enerjinin dörtte birini tutar.',
  'Stray capacitance alone already exceeds the specified load, so no external capacitors can bring it down: the crystal will always run slow. Shorten the tracks, remove ground pour from under them, or choose a crystal specified for a higher CL.':
    'Kaçak kapasitans tek başına belirtilen yükü zaten aşıyor, bu yüzden hiçbir dış kondansatör bunu aşağı çekemez: kristal her zaman yavaş çalışacaktır. Yolları kısaltın, altlarındaki toprak dökümünü kaldırın ya da daha yüksek CL için belirtilmiş bir kristal seçin.',
  'Stray capacitance is not a rounding error here. Two or three picofarads per pin is typical for a small package with short tracks, and against a 12.5 pF specified load that is a quarter of the budget. Ignoring it is the single most common reason a design runs fast or slow by tens of ppm.':
    "Kaçak kapasitans burada yuvarlama hatası değildir. Kısa yollu küçük bir kılıf için pin başına iki üç pikofarad tipiktir ve 12,5 pF'lik belirtilmiş bir yükün karşısında bu, bütçenin dörtte biridir. Bunu yok saymak, bir tasarımın onlarca ppm hızlı ya da yavaş çalışmasının en yaygın tek nedenidir.",
  'Stray per pin': 'Pin başına kaçak',
  'Strip': 'Şerit',
  'Strip current, supply sizing and where to inject power along the run.':
    'Şerit akımı, besleme boyutlandırma ve hat boyunca güç besleme noktaları.',
  'Strip length': 'Şerit uzunluğu',
  'Subtracted level': 'Çıkarılan seviye',
  'Sum': 'Toplam',
  'summing': 'toplayıcı',
  'Summing': 'Toplayıcı',
  'Supply': 'Besleme',
  'supply + Vf ({vf})': 'besleme + Vf ({vf})',
  'Supply and bias': 'Besleme ve kutuplama',
  'Supply and load': 'Besleme ve yük',
  'Supply being measured': 'Ölçülen besleme',
  'Supply current': 'Besleme akımı',
  'Supply draw': 'Besleme çekişi',
  'Supply VCC': 'Besleme VCC',
  'Supply Vs': 'Besleme Vs',
  'Supply VS': 'Besleme VS',
  'Supply wiring': 'Besleme kablolaması',
  'Surface load': 'Yüzey yükü',
  'Sweep': 'Tarama',
  'Sweep range': 'Tarama aralığı',
  'Swing': 'Salınım',
  'swing {swing}': 'salınım {swing}',
  'switch': 'anahtar',
  'Switch': 'Anahtar',
  'switch {iswRms} rms, diode {iout} avg': 'anahtar {iswRms} rms, diyot {iout} ort.',
  'Switch and clamp': 'Anahtar ve kırpıcı',
  'Switch and input': 'Anahtar ve giriş',
  'Switch Debounce RC': 'Buton Debounce RC',
  'Switch Rds(on)': 'Anahtar Rds(on)',
  'switch sees {vSwitchOpen}': 'anahtar {vSwitchOpen} görür',
  'Switch stress': 'Anahtar zorlanması',
  'switch turn-off': 'anahtar kapanması',
  'Switch Vceo rating': 'Anahtar Vceo değeri',
  'Switch voltage stress': 'Anahtar gerilim zorlanması',
  'Switching': 'Anahtarlama',
  'Switching freq': 'Anahtarlama frekansı',
  'Switching frequency': 'Anahtarlama frekansı',
  'Switching fsw': 'Anahtarlama fsw',
  'Switching loss': 'Anahtarlama kaybı',
  'Switching periods shown': 'Gösterilen anahtarlama çevrimi',
  'sync': 'sync',
  'Synchronous': 'Senkron',
  'synchronous FET': 'senkron FET',
  'System efficiency': 'Sistem verimi',
  'Tangent': 'Teğet',
  'Tap A / tap B': 'Orta uç A / orta uç B',
  'Target': 'Hedef',
  'Target current If': 'Hedef akım If',
  'Target PF': 'Hedef PF',
  'Target temperature': 'Hedef sıcaklık',
  'Target voltage': 'Hedef gerilim',
  'Target Vout': 'Hedef Vout',
  'Tariff per kWh': 'kWh başına tarife',
  'Tcase': 'Tcase',
  'Temperature is not that formula. The wire obeys a balance: `m·c·dT/dt = P - h·As·(T - Tamb)`. The loss term grows with temperature, so the wire settles at `Tamb + P/(h·As)` rather than climbing forever. That equilibrium is what the trace converges to, and the time constant `m·c/(h·As)` is independent of length: a longer wire has proportionally more mass and more surface.':
    'Sıcaklık o formül değildir. Tel bir dengeye uyar: `m·c·dT/dt = P - h·As·(T - Tortam)`. Kayıp terimi sıcaklıkla büyür, bu yüzden tel sonsuza tırmanmak yerine `Tortam + P/(h·As)` değerine oturur. İzin yakınsadığı denge budur ve `m·c/(h·As)` zaman sabiti uzunluktan bağımsızdır: daha uzun bir telin orantılı olarak daha çok kütlesi ve daha çok yüzeyi vardır.',
  'Temperature lift': 'Sıcaklık yükseltmesi',
  'Temperature now': 'Şimdiki sıcaklık',
  'Temperature sensing in 3D printer hot ends and beds, battery packs, and general monitoring, where a thermistor is far cheaper than a digital sensor. The non-linearity is the design problem, and this shows where the divider is sensitive and where it goes blind, plus the self-heating error that makes a sensor read its own current.':
    '3D yazıcı sıcak uçları ve tablalarında, batarya paketlerinde ve genel izlemede sıcaklık ölçümü; termistörün dijital sensörden çok daha ucuz olduğu yerler. Tasarım problemi doğrusalsızlıktır ve bu sayfa bölücünün nerede duyarlı, nerede kör olduğunu, ayrıca sensörün kendi akımını okumasına yol açan kendi kendine ısınma hatasını gösterir.',
  'Temperature works the other way. Isc creeps up a little, but I0 climbs steeply with T, so Voc falls about 0.3% per kelvin and takes Pmp with it. This is why a cold bright day outperforms a hot one, and why panel Vmp must be checked at the lowest expected temperature when sizing a string against an MPPT input.':
    "Sıcaklık ters yönde çalışır. Isc biraz yükselir ama I0, T ile dik biçimde tırmanır, yani Voc kelvin başına yaklaşık %0,3 düşer ve Pmp'yi de beraberinde götürür. Soğuk ve parlak bir günün sıcak bir günden iyi olmasının, ve bir diziyi MPPT girişine göre boyutlandırırken panel Vmp'sinin beklenen en düşük sıcaklıkta denetlenmesi gerekmesinin nedeni budur.",
  'Temperatures': 'Sıcaklıklar',
  'Terminal voltage is `V = OCV(depth) - I·Rint`. The open-circuit curve falls with depth of discharge, and the internal resistance subtracts a further drop proportional to current. That is the whole reason a battery reads 4.2 V at rest and 3.7 V the moment you load it.':
    'Uç gerilimi `V = OCV(derinlik) - I·Rint` ile bulunur. Açık devre eğrisi deşarj derinliğiyle düşer ve iç direnç akımla orantılı bir düşüş daha çıkarır. Bir pilin boştayken 4,2 V, yüklendiği anda 3,7 V okumasının tüm nedeni budur.',
  'textbook {vdc}': 'ders kitabı {vdc}',
  'Th/(Th-Tc)': 'Th/(Th-Tc)',
  'That current is energy in the core, `E = 0.5·L·I²`. Open the switch and the energy has nowhere to go, so the coil produces whatever voltage keeps the current flowing: `Vkick = L·di/dt`. Turn off 44 mA through 100 mH in one microsecond and that is over 4 kV. The switch, not the coil, is what fails.':
    "O akım çekirdekteki enerjidir, `E = 0.5·L·I²`. Anahtarı açın, enerjinin gidecek yeri kalmaz ve bobin akımı sürdürecek gerilimi ne ise onu üretir: `Vkick = L·di/dt`. 100 mH üzerinden geçen 44 mA'i bir mikrosaniyede kesin, bu 4 kV'un üzerindedir. Bozulan bobin değil, anahtardır.",
  'That is a hard trade. 13 bits, the Arduino default, caps out at {maxFrequency}. Wanting 100 kHz for a buck converter leaves only 9 bits. Wanting 1 MHz leaves 6, which is 64 steps and useless for anything analogue.':
    "Bu sert bir ödünleşmedir. Arduino'nun öntanımlısı olan 13 bit, {maxFrequency} değerinde tavan yapar. Bir düşürücü dönüştürücü için 100 kHz istemek geriye yalnızca 9 bit bırakır. 1 MHz istemek 6 bit bırakır; bu da 64 adım eder ve analog hiçbir iş için kullanılmaz.",
  'That is resonance, `f0 = 1/(2·pi·sqrt(LC))`. In series the cancellation leaves only R, so impedance hits a minimum and current peaks. In parallel it is the admittances that cancel, so impedance hits a maximum and the network becomes a tank that draws almost nothing from the source while circulating a large current internally.':
    'İşte bu rezonanstır, `f0 = 1/(2·pi·sqrt(LC))`. Seri bağlamada sönümlemeden geriye yalnızca R kalır, bu yüzden empedans en küçük değerine iner ve akım tepe yapar. Paralel bağlamada sönümlenen admitanslardır, bu yüzden empedans en büyük değerine çıkar ve devre kaynaktan neredeyse hiç akım çekmezken içinde büyük bir akım dolaştıran bir tank haline gelir.',
  'That is what makes resolution awkward. The whole useful range is {minPulse2} out of a 20 ms frame, so only about {frameHz}% of the duty register does anything. At 8 bits that leaves roughly 13 counts for the entire travel, about 14° per step, which is why naive Arduino code with a low LEDC resolution produces jerky servos.':
    "Çözünürlüğü zor kılan da budur. Kullanışlı aralığın tamamı 20 ms'lik çerçevenin {minPulse2} kadarıdır, yani görev çevrimi yazmacının yalnızca yaklaşık %{frameHz} kadarı bir işe yarar. 8 bitte bu, tüm hareket için kabaca 13 adım, adım başına yaklaşık 14° bırakır; düşük LEDC çözünürlüğüne sahip acemi Arduino kodunun sarsak servolar üretmesinin nedeni budur.",
  'That is what the negative dip in p(t) on the trace is. Instantaneous power is `P + S·cos(2wt - phi)`, so it swings `P ± S`. Once S exceeds P, which is exactly when the power factor drops below 1, the trough goes below zero and power flows backwards.':
    "İzdeki p(t) eğrisinin negatife inen çukuru işte budur. Anlık güç `P + S·cos(2wt - phi)` olduğundan `P ± S` arasında salınır. S, P'yi aştığında, yani tam olarak güç çarpanı 1'in altına düştüğünde, çukur sıfırın altına iner ve güç geriye akar.",
  'THD': 'THD',
  'THD-R': 'THD-R',
  'The 50 µA adjust current adds {iadjTerm} through R2, which is {vout}% of the output and drifts with temperature. Scale both resistors down so the program current dominates.':
    "50 µA'lik ayar akımı R2 üzerinden {iadjTerm} ekler; bu, çıkışın %{vout} kadarıdır ve sıcaklıkla kayar. Program akımı baskın olsun diye iki direnci de küçültün.",
  'The 555 in its two classic configurations. The scope shows the output pin against the capacitor voltage, so you can watch it ramp between the 1/3 and 2/3 Vcc trip points.':
    '555 entegresinin iki klasik yapılandırması. Osiloskop çıkış ucunu kondansatör gerilimine karşı gösterir, böylece 1/3 ve 2/3 Vcc eşikleri arasındaki rampayı izleyebilirsiniz.',
  'The ACS712 is a 5 V part with a mid-rail zero point, so its quiescent output is about 2.5 V, well above what an ESP32 pin tolerates. It needs a divider or a 3.3 V-friendly alternative. Its noise floor also makes it poor below a few hundred milliamps.':
    "ACS712, orta hat sıfır noktalı 5 V'luk bir parçadır, yani durgun çıkışı yaklaşık 2,5 V'tur ve bu bir ESP32 pininin dayanabileceğinin epey üzerindedir. Bir bölücüye ya da 3,3 V uyumlu bir alternatife ihtiyaç duyar. Gürültü tabanı da onu birkaç yüz miliamperin altında kötü kılar.",
  'The AWG series is geometric: `d = 0.127 mm · 92^((36-n)/39)`. That ratio is chosen so six gauge steps is almost exactly a factor of four in area, three steps is a factor of two, and ten steps is a factor of ten. Handy for mental arithmetic: going from 22 AWG to 12 AWG gives ten times the copper.':
    "AWG serisi geometriktir: `d = 0,127 mm · 92^((36-n)/39)`. Bu oran öyle seçilmiştir ki altı kalınlık adımı alanda neredeyse tam olarak dört kat, üç adım iki kat, on adım ise on kat eder. Zihinden hesap için kullanışlıdır: 22 AWG'den 12 AWG'ye geçmek on kat bakır verir.",
  'The base resistor sets everything: `IB = (Vin - VBE) / RB` with VBE taken as 0.7 V. The transistor can then deliver `IC = hFE·IB`, but the load only asks for `IC(sat) = (Vload - VCEsat) / RL`. Whichever is smaller wins.':
    'Her şeyi beyz direnci belirler: VBE 0,7 V alındığında `IB = (Vin - VBE) / RB`. Transistör bundan sonra `IC = hFE·IB` verebilir, ama yük yalnızca `IC(doyum) = (Vyük - VCEdoyum) / RL` kadarını ister. Hangisi küçükse o kazanır.',
  'The bead is dissipating {selfHeatW}, warming itself by {selfHeatK} K. It is measuring its own current, not the ambient. Raise the series resistor, or switch the divider on only while sampling.':
    'Boncuk {selfHeatW} harcıyor ve kendini {selfHeatK} K ısıtıyor. Ortamı değil, kendi akımını ölçüyor. Seri direnci büyütün ya da bölücüyü yalnızca örnekleme sırasında devreye alın.',
  'The Beta equation is `1/T = 1/T0 + ln(R/R0)/B`, rearranged to `R = R0·exp(B·(1/T - 1/T0))`. One parameter, one calibration point, good to about half a kelvin over a 50 K span. Datasheets quote different B values for different intervals, e.g. B25/85, precisely because it is only a local fit.':
    "Beta denklemi `1/T = 1/T0 + ln(R/R0)/B` şeklindedir ve `R = R0·exp(B·(1/T - 1/T0))` olarak düzenlenir. Tek parametre, tek kalibrasyon noktası, 50 K'lik bir aralıkta yarım kelvin kadar isabetli. Veri sayfalarının farklı aralıklar için farklı B değerleri vermesinin, örneğin B25/85, nedeni tam olarak bunun yalnızca yerel bir uyum olmasıdır.",
  'The blue adjustable buck module in every parts kit, used to get 5 V or 3.3 V from a 12 V supply. This page exists because the modules are sold claiming 3 A while their thermal design gives out long before that, and because setting the feedback divider by trial and error is how people destroy what they are powering.':
    'Her parça setindeki mavi ayarlanabilir buck modülü, 12 V beslemeden 5 V veya 3.3 V almak için kullanılır. Bu sayfa var, çünkü modüller 3 A iddiasıyla satılırken termal tasarımları çok daha önce pes eder ve geri besleme bölücüsünü deneme yanılmayla ayarlamak, insanların besledikleri şeyi yakma biçimidir.',
  'The blue buck module from every parts kit. Pick the feedback divider for a target rail, then check it against the real limits: 3 A, 40 V, and a package that gets hot long before it hits either. The scope shows inductor current at the fixed 150 kHz.':
    'Her parça setindeki mavi buck modülü. Hedef hat için geri besleme bölücüsünü seçin, sonra gerçek sınırlara karşı kontrol edin: 3 A, 40 V ve bunların ikisine de ulaşmadan çok önce ısınan bir paket. Osiloskop, sabit 150 kHzde bobin akımını gösterir.',
  "The BSS138 circuit is deceptively clever. The FET's gate sits at the low-side rail and its source faces the low side. Pull the low side down and VGS becomes the full low rail, turning the FET on and dragging the high side down with it. Drive the high side low and the body diode conducts first, pulling the source down, which then turns the FET on properly. That is what makes one FET bidirectional.":
    "BSS138 devresi aldatıcı biçimde zekidir. FET'in kapısı alt taraf hattında durur ve kaynağı alt tarafa bakar. Alt tarafı aşağı çekin, VGS tüm alt hat gerilimi olur; FET iletime geçer ve üst tarafı da birlikte aşağı sürükler. Üst tarafı alçağa sürün, önce gövde diyodu iletir ve kaynağı aşağı çeker, bu da FET'i düzgün biçimde iletime sokar. Tek bir FET'i çift yönlü kılan şey budur.",
  'The cap charges to the peak through the diodes, then supplies the load alone until the next peak. Treating that discharge as linear gives `Vr = Idc / (fr·C)`, where `fr` is the line frequency for a half wave rectifier and `2f` for a bridge or a centre tap, since both fill in the gap the half wave leaves. The output sits at the middle of that sawtooth, `Vdc = Vpeak - n·Vf - Vr/2`, with `n` = 2 for a bridge and 1 for the other two.':
    "Kondansatör diyotlar üzerinden tepe değere kadar dolar, sonra bir sonraki tepeye dek yükü tek başına besler. O deşarjı doğrusal saymak `Vr = Idc / (fr·C)` verir; buradaki `fr`, yarım dalga doğrultucu için şebeke frekansı, köprü ya da orta uçlu için 2f'dir, çünkü ikisi de yarım dalganın bıraktığı boşluğu doldurur. Çıkış bu testere dişinin ortasında, `Vdc = Vtepe - n·Vf - Vr/2` noktasında durur; köprü için `n` = 2, diğer ikisi için 1'dir.",
  'The capacitor charges through R1+R2 toward Vcc and discharges through R2 alone, so the high time `0.693·(R1+R2)·C` is always longer than the low time `0.693·R2·C`. That is why a plain astable can never reach 50% duty: you need a diode across R2 to let it charge through R1 only.':
    "Kondansatör R1+R2 üzerinden Vcc'ye doğru dolar ve yalnızca R2 üzerinden boşalır, yani yüksek süre `0.693·(R1+R2)·C` her zaman düşük süre `0.693·R2·C` değerinden uzundur. Sade bir astable'ın %50 görev çevrimine asla ulaşamamasının nedeni budur: yalnızca R1 üzerinden dolmasını sağlamak için R2'ye paralel bir diyot gerekir.",
  'The capacitor reaches {peakVout} on a {drive} drive. An undamped series RLC tops out near 2x the supply, so rate the capacitor and the switching device for the peak, not the rail. Add series R or a snubber.':
    'Kondansatör {drive} sürüşte {peakVout} değerine ulaşıyor. Sönümsüz bir seri RLC beslemenin yaklaşık 2 katında tavan yapar, bu yüzden kondansatörü ve anahtarlama elemanını hatta göre değil tepeye göre seçin. Seri R ya da bir snubber ekleyin.',
  'The Carnot ceiling for heating is `COP = Th / (Th - Tc)`, with both temperatures in kelvin. Only the difference matters, which is why a heat pump feeding underfloor pipes at 35 °C thrashes one feeding radiators at 65 °C: the lift is smaller, so the ceiling is higher.':
    'Isıtmada Carnot tavanı `COP = Th / (Th - Tc)` ile bulunur, iki sıcaklık da kelvin cinsindendir. Yalnızca fark önemlidir; yerden ısıtma borularını 35 °C ile besleyen bir ısı pompasının, radyatörleri 65 °C ile besleyeni ezip geçmesinin nedeni budur: yükseltme küçüktür, dolayısıyla tavan yüksektir.',
  'The ceiling comes from the edge: `Rmax = tr / (0.8473·Cb)`. The 0.8473 is `ln(0.7/0.3)`, from the 30% to 70% points the specification measures between.':
    'Üst sınır kenardan gelir: `Rmax = tr / (0.8473·Cb)`. 0,8473 sayısı `ln(0.7/0.3)` değeridir ve belirtimin arasını ölçtüğü %30 - %70 noktalarından gelir.',
  'The channel follows the square law. Below threshold there is no channel at all. Above it, with `Vov = VGS - Vth`, the drain current is `Id = k·(Vov·VDS - VDS²/2)` in triode and saturates at `Id = 0.5·k·Vov²` once `VDS &gt; Vov`. The operating point is the intersection of that curve with the load line `VDS = VS - Id·Rload`, solved in closed form rather than iterated.':
    'Kanal kare yasasını izler. Eşiğin altında hiç kanal yoktur. Üstünde, `Vov = VGS - Vth` ile drenaj akımı triyot bölgesinde `Id = k·(Vov·VDS - VDS²/2)` olur ve `VDS &gt; Vov` olduğunda `Id = 0.5·k·Vov²` değerinde doyar. Çalışma noktası, bu eğrinin `VDS = VS - Id·Ryük` yük doğrusuyla kesişimidir ve yinelemeli değil kapalı biçimde çözülür.',
  'The chip dissipates {dissipation} at the start of charging. It is a linear charger, so every volt between input and cell becomes heat in that small package. It will thermally throttle, stretching the charge time well past the estimate here. Keep the input close to 5 V.':
    "Yonga, şarjın başında {dissipation} harcıyor. Bu doğrusal bir şarj devresidir, yani giriş ile hücre arasındaki her volt o küçük kılıfta ısıya dönüşür. Isıl olarak kendini kısacak ve şarj süresini buradaki tahminin epey ötesine uzatacaktır. Girişi 5 V'a yakın tutun.",
  'The classic single-lithium-cell problem: a cell runs 4.2 V down to 3.0 V while the rail must hold 3.3 V, so the converter must step both down and up over the discharge. Also used in car electronics where 12 V sags on cranking and spikes on load dump.':
    'Klasik tek lityum hücre problemi: hücre 4.2 Vtan 3.0 Va inerken hat 3.3 Vu tutmak zorundadır, bu yüzden dönüştürücü deşarj boyunca hem düşürmeli hem yükseltmelidir. Ayrıca marşta düşen ve yük atmada sıçrayan 12 V ile araç elektroniğinde kullanılır.',
  'The cold side is at or above the hot side, so there is no lift to perform and the COP is undefined. Raise the flow temperature or lower the outdoor temperature.':
    'Soğuk taraf sıcak tarafla aynı ya da üzerinde, yani yapılacak bir yükseltme yok ve COP tanımsız. Gidiş sıcaklığını yükseltin ya da dış sıcaklığı düşürün.',
  'The comparator is the same part with positive feedback instead of negative. The non-inverting node sits on a divider between Vref through R2 and the output through R1, so `Vth = (Vref·R2 + Vout·R1)/(R1 + R2)`. With R2 much larger than R1 that is the familiar `Vth = Vref ± Vout·R1/(R1+R2)`, and the band is exactly `(Vhigh - Vlow)·R1/(R1+R2)`. Anything smaller than that band cannot make the output chatter.':
    "Karşılaştırıcı, negatif yerine pozitif geri beslemeli aynı parçadır. Evirmeyen düğüm, R2 üzerinden Vref ile R1 üzerinden çıkış arasındaki bir bölücüde durur, yani `Vth = (Vref·R2 + Vout·R1)/(R1 + R2)` olur. R2, R1'den çok büyükken bu, bildik `Vth = Vref ± Vout·R1/(R1+R2)` ifadesidir ve bant tam olarak `(Vhigh - Vlow)·R1/(R1+R2)` kadardır. Bu banttan küçük hiçbir şey çıkışı titretemez.",
  'The consequence is that it is an open-drain circuit: it can only pull down, and both sides need pull-ups. Speed is therefore set entirely by the RC of the pull-up against bus capacitance, exactly as with I2C. These boards top out around a few hundred kHz with typical 10 kΩ pull-ups.':
    "Bunun sonucu, devrenin açık drenajlı olmasıdır: yalnızca aşağı çekebilir ve iki tarafta da pull-up gerekir. Dolayısıyla hızı tümüyle pull-up ile veri yolu kapasitansının RC'si belirler, tıpkı I2C'de olduğu gibi. Bu kartlar tipik 10 kΩ pull-up ile birkaç yüz kHz civarında tavan yapar.",
  'The consequence is unintuitive. An ESP32 drawing 80 mA for 3 seconds every hour averages about 77 µA, so a 2 Ah cell lasts over two years. The same chip left awake would flatten it in a day. Deep sleep is not an optimisation, it is the entire design.':
    "Sonuç sezgiye aykırıdır. Her saat 3 saniye boyunca 80 mA çeken bir ESP32 ortalama yaklaşık 77 µA yapar, yani 2 Ah'lik bir hücre iki yıldan uzun dayanır. Aynı yonga uyanık bırakılsa onu bir günde bitirirdi. Derin uyku bir iyileştirme değil, tasarımın kendisidir.",
  'The consequence people forget is impedance. A load Zs on the secondary appears to the primary as `(Np/Ns)²·Zs`. That square is why transformers match impedances as well as voltages, and it is the entire basis of valve amplifier output stages and RF matching networks.':
    'İnsanların unuttuğu sonuç empedanstır. İkincildeki bir Zs yükü, birincile `(Np/Ns)²·Zs` olarak görünür. Trafoların gerilimlerin yanı sıra empedansları da uyumlamasının nedeni bu karedir ve lambalı yükselteç çıkış katlarının ve RF uyumlama devrelerinin tüm temeli budur.',
  "The curve on screen is the real design constraint. Sensitivity is highest where the thermistor's resistance matches the series resistor, and falls away at both ends: at high temperature the thermistor is a short next to the fixed resistor, and at low temperature it swamps it. So a 10k NTC with a 10k series resistor resolves beautifully near 25 °C and poorly at 120 °C.":
    "Ekrandaki eğri gerçek tasarım kısıtıdır. Duyarlılık, termistörün direnci seri dirence eşit olduğunda en yüksektir ve iki uçta da düşer: yüksek sıcaklıkta termistör sabit direncin yanında kısa devredir, düşük sıcaklıkta ise onu boğar. Bu yüzden 10k seri dirençli 10k'lık bir NTC, 25 °C civarında çok güzel, 120 °C'de ise kötü çözer.",
  'The CV tail is slower than people expect. It carries only the last fifth or so of the capacity but takes a substantial part of the total time, because current is decaying exponentially the whole way. This is why charging to 90% is much faster per unit of energy than charging to 100%, and why stopping early is kind to the cell.':
    "CV kuyruğu insanların beklediğinden yavaştır. Kapasitenin yalnızca son beşte biri kadarını taşır ama toplam sürenin kayda değer bir kısmını alır, çünkü akım boyunca üstel olarak sönmektedir. %90'a şarj etmenin enerji birimi başına %100'e şarj etmekten çok daha hızlı olmasının ve erken durmanın hücreye iyi gelmesinin nedeni budur.",
  'The DC model treats the zener as an ideal Vz clamp above the knee and as an open circuit below it, which is why the low corner reports a plain series drop instead of a regulated output. Extrapolating the Zz tangent line down to zero current would look more sophisticated and be badly wrong: a 1N4728A is 10 Ω at 76 mA but 400 Ω at 1 mA.':
    "DC modeli zeneri, dizinin üstünde ideal bir Vz kırpıcısı, altında ise açık devre sayar; alt köşenin regüle bir çıkış yerine yalın bir seri düşüm bildirmesinin nedeni budur. Zz teğet doğrusunu sıfır akıma kadar uzatmak daha gelişmiş görünür ve fena hâlde yanlış olurdu: bir 1N4728A, 76 mA'de 10 Ω, 1 mA'de ise 400 Ω'dur.",
  'The defining relations are `Vs = Vp·Ns/Np` and `Is = Ip·Np/Ns`. Voltage steps down while current steps up, so apparent power is conserved: a transformer moves energy, it does not make it.':
    'Tanımlayıcı bağıntılar `Vs = Vp·Ns/Np` ve `Is = Ip·Np/Ns` şeklindedir. Gerilim düşerken akım yükselir, yani görünür güç korunur: bir trafo enerjiyi taşır, üretmez.',
  'The design has two sides. Too fast and the chatter gets through. Too slow and you cannot press the button quickly, and the slow edge spends a long time in the forbidden zone between VIL and VIH, where an input without a Schmitt trigger can oscillate. This is exactly why you want a Schmitt input here, and the ESP32 GPIOs have one.':
    "Tasarımın iki yüzü var. Çok hızlıysa gürültü geçer. Çok yavaşsa düğmeye hızlı basamazsınız ve yavaş kenar, Schmitt tetiklemesi olmayan bir girişin salınabileceği VIL ile VIH arasındaki yasak bölgede uzun süre kalır. Burada Schmitt girişi istemenizin nedeni tam olarak budur ve ESP32 GPIO'larında bu vardır.",
  'The divider is solved as its Thevenin equivalent, `VTH = VCC·R2/(R1+R2)` and `RTH = R1||R2`, so the base loop gives `IB = (VTH - VBE) / (RTH + (hFE+1)·RE)`. That is the exact answer, not the "assume IB is negligible" shortcut, which is why a floppy divider shows up here as a shifted Q point instead of reading correct.':
    'Bölücü Thevenin eşdeğeri olarak çözülür, `VTH = VCC·R2/(R1+R2)` ve `RTH = R1||R2`; böylece beyz çevrimi `IB = (VTH - VBE) / (RTH + (hFE+1)·RE)` verir. Bu, "IB ihmal edilebilir" kestirmesi değil, tam çözümdür; gevşek bir bölücünün burada doğru okumak yerine kaymış bir Q noktası olarak görünmesinin nedeni de budur.',
  "The drops are folded in rather than bolted on. Volt-second balance with the diode drop Vd, the switch drop Iin·Rds(on) and the winding drop Iin·DCR, substituting Iin = Iout/(1-D), is a quadratic in `x = 1-D`: `x²(Vout+Vd) - x(Vin + Iout·Ron) + Iout(DCR+Ron) = 0`. The larger root is the real operating point. When the discriminant goes negative there is no solution at all: that is the ceiling `Vout_max = (Vin + Iout·Ron)²/(4·Iout·(DCR+Ron)) - Vd`, which with no switch drop is Erickson's `M_max = 0.5·sqrt(R/R_L)`. A boost cannot give infinite gain, and real parts stop it long before D reaches 1.":
    "Düşümler sonradan eklenmez, hesabın içine katılır. Diyot düşümü Vd, anahtar düşümü Iin·Rds(on) ve sargı düşümü Iin·DCR ile volt-saniye dengesi, Iin = Iout/(1-D) yerine konduğunda `x = 1-D` cinsinden ikinci dereceden bir denklem verir: `x²(Vout+Vd) - x(Vin + Iout·Ron) + Iout(DCR+Ron) = 0`. Büyük kök gerçek çalışma noktasıdır. Diskriminant negatife düştüğünde hiçbir çözüm yoktur: bu, anahtar düşümü olmadığında Erickson'ın `M_max = 0.5·sqrt(R/R_L)` ifadesine inen `Vout_max = (Vin + Iout·Ron)²/(4·Iout·(DCR+Ron)) - Vd` tavanıdır. Bir yükseltici sonsuz kazanç veremez ve gerçek parçalar onu D 1'e varmadan çok önce durdurur.",
  'The dual of the RC filter: swap the capacitor for an inductor and the corner moves to R/L. Winding resistance is part of the model, because it is what stops real RL filters behaving like the textbook.':
    'RC filtrenin ikizi: kondansatörü bobinle değiştirin, köşe frekansı R/L olur. Sargı direnci modelin parçasıdır, çünkü gerçek RL filtrelerin kitaptaki gibi davranmasını engelleyen şey odur.',
  'The duty register is an integer, so the achievable duty is quantised to `1/2^bits`. Filtered into an analogue voltage that step is `Vcc/2^bits`, which is the real resolution of a PWM DAC: at 3.3 V and 10 bits it is about 3.2 mV, and no amount of filtering recovers anything finer.':
    "Görev çevrimi yazmacı bir tam sayıdır, yani ulaşılabilir görev çevrimi `1/2^bit` adımlarına nicelenir. Analog bir gerilime süzüldüğünde bu adım `Vcc/2^bit` olur ve bir PWM DAC'ının gerçek çözünürlüğü budur: 3,3 V ve 10 bitte yaklaşık 3,2 mV'tur ve ne kadar süzerseniz süzün daha incesini geri kazanamazsınız.",
  'The edge takes {worstRise}, which caps the usable rate at about {maxBitRate}. At {bitRate} the signal never reaches a valid level before it is asked to change again. Use a stronger pull-up or reduce bus capacitance.':
    'Kenar {worstRise} sürüyor ve bu, kullanılabilir hızı yaklaşık {maxBitRate} ile sınırlıyor. {bitRate} hızında işaret, yeniden değişmesi istenmeden önce geçerli bir seviyeye hiç ulaşamaz. Daha güçlü bir pull-up kullanın ya da veri yolu kapasitansını azaltın.',
  'The edge times used are `max(tr, Qg·Rg/VGS)`. A gate cannot move faster than the drive can shift its charge, so a large gate resistor on a GPIO, not the die, usually sets the switching speed and therefore the switching loss.':
    'Kullanılan kenar süreleri `max(tr, Qg·Rg/VGS)` şeklindedir. Bir kapı, sürücünün yükünü kaydırabileceğinden hızlı hareket edemez; bu yüzden anahtarlama hızını, dolayısıyla anahtarlama kaybını, genellikle yonga değil bir GPIO üzerindeki büyük kapı direnci belirler.',
  'The edges take {tfEff} out of a {fsw} period. The FET spends most of the cycle in transition, so the hard switching loss model no longer applies and the real device will be hotter than shown.':
    'Kenarlar {fsw} çevriminin {tfEff} kadarını alıyor. FET çevrimin çoğunu geçişte geçiriyor, yani sert anahtarlama kaybı modeli artık geçerli değil ve gerçek eleman gösterilenden daha sıcak olacaktır.',
  'The efficiency term is not the cell efficiency, which is already in the watt rating. It covers the charge controller, wiring, temperature derating (panels lose about 0.4% per kelvin above 25 °C), dust and imperfect angle. Seventy percent is a reasonable planning figure for a small fixed installation.':
    'Verim terimi hücre verimi değildir; o zaten watt değerinin içindedir. Şarj denetleyicisini, kablolamayı, sıcaklık düşümünü (paneller 25 °C üzerinde kelvin başına yaklaşık %0,4 yitirir), tozu ve kusurlu açıyı kapsar. Küçük ve sabit bir kurulum için yüzde yetmiş akla yatkın bir planlama değeridir.',
  'The ESP32 ADC is 12 bits, so full scale divides into 4096 counts. The attenuator in front of it sets what full scale means: 0 dB gives about 1.1 V, 11 dB about 3.9 V. Only part of each range is linear, which is why the usable window is narrower than the nominal figure.':
    "ESP32 ADC'si 12 bittir, yani tam ölçek 4096 adıma bölünür. Önündeki zayıflatıcı tam ölçeğin ne demek olduğunu belirler: 0 dB yaklaşık 1,1 V, 11 dB yaklaşık 3,9 V verir. Her aralığın yalnızca bir kısmı doğrusaldır; kullanılabilir pencerenin anma değerinden dar olmasının nedeni budur.",
  'The exponent on current, 1/0.725 ≈ 1.38, means width grows faster than current. Doubling the current needs about 2.6 times the copper, not twice. This is why high-current nets get out of hand quickly and end up as pours rather than traces.':
    'Akımın üssü, 1/0,725 ≈ 1,38, genişliğin akımdan hızlı büyüdüğü anlamına gelir. Akımı ikiye katlamak iki değil, yaklaşık 2,6 kat bakır ister. Yüksek akımlı hatların hızla kontrolden çıkıp yol yerine döküme dönüşmesinin nedeni budur.',
  'The failure mode worth avoiding is a system that breaks even on paper. It has no margin to refill the battery after a cloudy week, so it drifts down to empty and stays there. Oversizing the panel is much cheaper than oversizing the battery.':
    'Kaçınmaya değer arıza biçimi, kağıt üzerinde başa baş gelen bir sistemdir. Bulutlu bir haftadan sonra pili doldurmak için hiçbir payı yoktur, bu yüzden boşa doğru kayar ve orada kalır. Paneli büyütmek, pili büyütmekten çok daha ucuzdur.',
  'The far end sees only {endVoltage}. WS2812s dim and shift colour as the supply sags, typically toward red because the blue die has the highest forward voltage and starves first. Inject power at {injectionPoints} points along the run, or use heavier feed wire.':
    "Uzak uç yalnızca {endVoltage} görüyor. WS2812'ler besleme çöktükçe kararır ve renk kaydırır; genellikle kırmızıya doğru, çünkü mavi yonga en yüksek ileri gerilime sahiptir ve ilk o aç kalır. Hat boyunca {injectionPoints} noktadan güç besleyin ya da daha kalın besleme teli kullanın.",
  'The FET is sitting in saturation, i.e. behaving as a constant current source at {id} with {vds} across it. That is a linear regulator, not a switch, and it dissipates {pCond}. Raise VGS or raise the load resistance.':
    "FET doyumda oturuyor, yani üzerinde {vds} varken {id} değerinde sabit bir akım kaynağı gibi davranıyor. Bu bir anahtar değil doğrusal regülatördür ve {pCond} harcar. VGS'yi ya da yük direncini yükseltin.",
  'The filter settles in {tRise}, faster than the {bounceMs} of bounce, so chatter still reaches the pin. Raise R or C until the rise time comfortably exceeds the bounce duration.':
    "Süzgeç {tRise} içinde oturuyor, bu da {bounceMs} sekmeden hızlı; bu yüzden gürültü hâlâ pine ulaşıyor. Yükselme süresi sekme süresini rahatça aşana kadar R'yi ya da C'yi büyütün.",
  'The first circuit anyone builds, and still the one most often got wrong. Driving indicator LEDs from a GPIO, sizing current for a panel of them, and checking the pin can actually source what you are asking. Drive an LED straight from a 3.3 V pin with no resistor and you exceed the GPIO rating and cook either the LED or the pin.':
    'Herkesin kurduğu ilk devre ve hâlâ en sık yanlış yapılanı. GPIO ucundan gösterge LEDleri sürmek, bir panel dolusu için akım boyutlandırmak ve ucun istediğiniz akımı gerçekten verebildiğini kontrol etmek. Bir LEDi 3.3 V ucundan dirençsiz sürerseniz GPIO sınırını aşarsınız ve ya LEDi ya da ucu yakarsınız.',
  'The floor comes from the low level: a device must sink enough current to hold the line under {I2C_VOL} V, and the specification only guarantees 3 mA. So `Rmin = (Vcc - 0.4) / 3mA`, about 970 Ω at 3.3 V.':
    "Alt sınır alçak seviyeden gelir: bir aygıt, hattı {I2C_VOL} V altında tutmaya yetecek akımı çekmelidir ve belirtim yalnızca 3 mA garanti eder. Yani `Rmin = (Vcc - 0.4) / 3mA`, 3,3 V'ta yaklaşık 970 Ω.",
  'The four-switch stage puts a buck leg and a boost leg around one inductor. It keeps the output positive and, crucially, runs as a plain buck when Vin is comfortably above Vout and a plain boost when it is below, only using both legs in the narrow band between. That is why it is far more efficient than the inverting stage: in either single-leg mode only one pair of switches is chopping.':
    "Dört anahtarlı kat, tek bir bobinin çevresine bir düşürücü bacak ile bir yükseltici bacak yerleştirir. Çıkışı pozitif tutar ve daha da önemlisi, Vin Vout'un rahatça üzerindeyken sade bir düşürücü, altındayken sade bir yükseltici gibi çalışır; her iki bacağı yalnızca aradaki dar bantta kullanır. Evrilen kattan çok daha verimli olmasının nedeni budur: tek bacaklı kiplerin her ikisinde de yalnızca bir çift anahtar kıyar.",
  'the free part': 'bedava kısım',
  'The frequency against resolution trade-off, and the real duty step size.':
    'Frekansa karşı çözünürlük dengesi ve gerçek görev oranı adım büyüklüğü.',
  'The inductor empties every cycle, so this is discontinuous conduction and D = 1 - Vin/Vout no longer applies. The duty above is the DCM solution instead. Output ripple and the peak current are both worse than the CCM formulas suggest, and the loop gain changes shape. Above {ioutBoundary} of load, or above {lBoundary} of inductance, it goes back to CCM.':
    "Bobin her çevrimde boşalıyor, yani bu kesintili iletimdir ve D = 1 - Vin/Vout artık geçerli değildir. Yukarıdaki görev çevrimi bunun yerine DCM çözümüdür. Çıkış dalgalanması da tepe akımı da CCM formüllerinin söylediğinden kötüdür ve çevrim kazancının biçimi değişir. {ioutBoundary} yükün ya da {lBoundary} endüktansın üzerinde CCM'ye geri döner.",
  'The input pin leaves the supply range ({inMin} to {inMax} against rails of {vneg} to {vpos}). Real input stages stop working there and some parts phase invert, so this trace is fiction outside the rails.':
    'Giriş pini besleme aralığını terk ediyor ({vneg} - {vpos} hatlarına karşı {inMin} - {inMax}). Gerçek giriş katları orada çalışmayı bırakır ve bazı parçalar faz evirir, yani bu iz hatların dışında kurgudur.',
  "The integrator's unity gain frequency ({integratorUnity}) is within a decade of the op-amp's GBW ({gbw}). The op-amp runs out of open-loop gain before the capacitor takes over, so the integration stops being clean. Raise Rin or Cf, or pick a faster part.":
    "İntegral alıcının birim kazanç frekansı ({integratorUnity}), işlemsel yükseltecin GBW değerine ({gbw}) bir dekat kadar yakın. Kondansatör devreyi devralmadan işlemsel yükseltecin açık çevrim kazancı tükeniyor, bu yüzden integral alma temiz olmaktan çıkıyor. Rin ya da Cf'yi büyütün, ya da daha hızlı bir parça seçin.",
  'The inverting buck-boost gives `Vout = -Vin·D/(1-D)`, so duty is `D = |Vout|/(|Vout| + Vin)`. It steps up or down freely, but the output is negative and both switch and rectifier stand off `Vin + |Vout|`.':
    'Evrilen düşürücü-yükseltici `Vout = -Vin·D/(1-D)` verir, yani görev çevrimi `D = |Vout|/(|Vout| + Vin)` olur. Serbestçe yükseltir ya da düşürür, ama çıkış negatiftir ve hem anahtar hem doğrultucu `Vin + |Vout|` gerilimine dayanmalıdır.',
  'The LEDC timer cannot do {bits} bits at {f}. 2^bits · f must stay under the 80 MHz APB clock, so {maxBits} bits is the ceiling here. The driver will reject the config.':
    'LEDC zamanlayıcısı {f} frekansında {bits} bit yapamaz. 2^bit · f çarpımı 80 MHz APB saatinin altında kalmalıdır, yani buradaki tavan {maxBits} bittir. Sürücü bu yapılandırmayı geri çevirecektir.',
  'The LEDC timer counts to `2^bits` once per PWM period from an 80 MHz source, so the fastest it can run at a given resolution is `f_max = 80 MHz / 2^bits`. Rearranged, the best resolution at a given frequency is `floor(log2(80e6 / f))`.':
    "LEDC zamanlayıcısı 80 MHz'lik bir kaynaktan PWM çevrimi başına bir kez `2^bit` değerine kadar sayar, yani belirli bir çözünürlükte ulaşabileceği en yüksek hız `f_max = 80 MHz / 2^bit` olur. Yeniden düzenlenirse, belirli bir frekanstaki en iyi çözünürlük `floor(log2(80e6 / f))` olur.",
  'The link does not close: received power is {marginDb} dB below the sensitivity floor. Halving the distance buys 6 dB, and so does doubling both antenna gains. A slower LoRa spreading factor buys far more.':
    'Bağlantı kurulmuyor: alınan güç, duyarlılık tabanının {marginDb} dB altında. Uzaklığı yarıya indirmek 6 dB kazandırır, iki anten kazancını da ikiye katlamak da öyle. Daha yavaş bir LoRa yayılma çarpanı çok daha fazlasını kazandırır.',
  'The LM317 is a floating regulator: it does nothing but hold `Vref = {V_REF} V` between OUT and ADJ. R1 sits across that reference, so it carries a fixed `Iprog = Vref/R1` whatever the load does. That current plus the adjust pin current runs to ground through R2, so `Vout = Vref·(1 + R2/R1) + Iadj·R2`.':
    'LM317 yüzen bir regülatördür: OUT ile ADJ arasında `Vref = {V_REF} V` tutmaktan başka bir şey yapmaz. R1 bu referansın üzerinde durur, yani yük ne yaparsa yapsın sabit bir `Iprog = Vref/R1` taşır. O akım artı ayar pini akımı R2 üzerinden toprağa akar, yani `Vout = Vref·(1 + R2/R1) + Iadj·R2` olur.',
  'The load asks for more power than this pack can ever deliver. Maximum power transfer caps it at `OCV² / (4·Rint)`, and past that no operating point exists at any voltage. Reduce the load or add cells in parallel to drop Rint.':
    "Yük, bu paketin verebileceğinden daha fazla güç istiyor. En büyük güç aktarımı bunu `OCV² / (4·Rint)` ile sınırlar ve bunun ötesinde hiçbir gerilimde çalışma noktası yoktur. Yükü azaltın ya da Rint'i düşürmek için paralel hücre ekleyin.",
  'The maths behind this page': 'Bu sayfanın arkasındaki matematik',
  'The most common filter in electronics. Smoothing a PWM output into an analogue voltage, removing switching noise from a sensor line, anti-aliasing in front of an ADC, and setting the roll-off in audio tone controls. Get the cutoff wrong and you either pass the noise you meant to remove or slug the signal you meant to keep.':
    'Elektronikteki en yaygın filtre. PWM çıkışını analog gerilime düzleştirmek, sensör hattından anahtarlama gürültüsünü temizlemek, ADC önünde örtüşme önlemek ve ses tonu kontrollerinde eğimi belirlemek. Kesim frekansını yanlış seçerseniz ya temizlemek istediğiniz gürültüyü geçirirsiniz ya da korumak istediğiniz sinyali körelirsiniz.',
  'The node sits at `V = Itotal·Req`, so each branch carries `Ix = V/Rx = Itotal·Gx / sum(G)`. The low-resistance branch takes the most current, which is the opposite of the voltage divider intuition. For two branches this collapses to `I1 = Itotal·R2 / (R1 + R2)`, the other resistor on top.':
    'Düğüm `V = Itoplam·Req` değerinde durur, bu yüzden her kol `Ix = V/Rx = Itoplam·Gx / toplam(G)` taşır. En çok akımı en düşük dirençli kol alır; bu, gerilim bölücü sezgisinin tam tersidir. İki kol için bu, üstte diğer direncin olduğu `I1 = Itoplam·R2 / (R1 + R2)` ifadesine iner.',
  'The oscillator sees the two load capacitors in series, plus whatever the pins and tracks contribute: `CL = C1·C2/(C1+C2) + Cstray`. With C1 = C2 that simplifies to `C1/2 + Cstray`, so `C1 = C2 = 2·(CL - Cstray)`.':
    'Osilatör iki yük kondansatörünü seri görür, üstüne de pinlerin ve yolların kattığı ne varsa eklenir: `CL = C1·C2/(C1+C2) + Ckaçak`. C1 = C2 ile bu `C1/2 + Ckaçak` haline gelir, yani `C1 = C2 = 2·(CL - Ckaçak)`.',
  'The output is on a rail for {clipped}% of the window. Beyond that point the gain formula no longer describes the circuit: reduce the gain, reduce the input, or widen the supply.':
    'Çıkış, pencerenin %{clipped} kadarında bir hatta yapışık. O noktadan sonra kazanç formülü devreyi artık betimlemez: kazancı azaltın, girişi azaltın ya da beslemeyi genişletin.',
  'The overdrive factor is the ratio, `ODF = IB·hFE / IC(load)`. Below 1 the transistor never saturates and sits in the active region dropping volts across itself. Design for ODF of about {ODF_TARGET} so worst case hFE, cold silicon and a heavier load still leave it hard on.':
    "Aşırı sürüş çarpanı bu ikisinin oranıdır: `ODF = IB·hFE / IC(yük)`. 1'in altında transistör hiç doyuma girmez ve üzerine volt düşüren aktif bölgede kalır. Yaklaşık {ODF_TARGET} ODF için tasarlayın ki en kötü hFE, soğuk silisyum ve daha ağır bir yük bile onu tam iletimde bıraksın.",
  'The pack is already below its cutoff at the first sample, so there is no usable runtime. The load is too heavy for this pack size.':
    'Paket daha ilk örnekte kesim geriliminin altında, bu yüzden kullanılabilir bir çalışma süresi yok. Yük, bu paket boyu için fazla ağır.',
  'The panel harvests {harvestWh} Wh against a {whPerDay} Wh load, so the battery only ever drains and the node dies once it is empty. You need at least {panelW} W just to break even, and realistically two to three times that so it can also recover from cloudy spells.':
    "Panel, {whPerDay} Wh'lik bir yüke karşı {harvestWh} Wh topluyor; yani pil yalnızca boşalır ve boşaldığında düğüm ölür. Yalnızca başa baş gelmek için en az {panelW} W gerekir, gerçekçi olarak da bunun iki üç katı gerekir ki bulutlu dönemlerden de çıkabilsin.",
  'The payoff is I²R. Cable loss falls with the square of current, so dragging power factor from 0.75 to 0.95 cuts current by about 21% and cable loss by about 38%. That is also why utilities bill industrial sites for reactive power: it occupies their conductors without registering on an energy meter.':
    "Kazanç I²R'dedir. Kablo kaybı akımın karesiyle düşer, yani güç çarpanını 0,75'ten 0,95'e çekmek akımı yaklaşık %21, kablo kaybını yaklaşık %38 azaltır. Şebeke işletmelerinin sanayi tesislerine reaktif güç faturası kesmesinin nedeni de budur: iletkenlerini işgal eder ama enerji sayacında görünmez.",
  'The phase trace tells you which element is winning. Below series resonance the capacitor dominates and current leads voltage, giving negative phase. Above it the inductor dominates and current lags. Exactly at f0 the network looks purely resistive, which is what makes it useful for matching and filtering.':
    'Faz izi hangi elemanın baskın olduğunu söyler. Seri rezonansın altında kondansatör baskındır ve akım gerilimi önceler, bu da negatif faz verir. Üstünde bobin baskındır ve akım geri kalır. Tam f0 noktasında devre saf dirençli görünür; matematikte ve süzgeçlemede kullanışlı olmasının nedeni budur.',
  'The physical length is always shorter than `lambda/4` in vacuum. The wave travels partly in the conductor and its surroundings, so the velocity factor applies: about 0.95 for a bare wire, 0.66 for typical coax dielectric, and nearer 0.55 for a microstrip trace where half the field sits in FR-4.':
    'Fiziksel uzunluk her zaman boşluktaki `lambda/4` değerinden kısadır. Dalga kısmen iletkenin ve çevresinin içinden ilerler, bu yüzden hız çarpanı devreye girer: çıplak tel için yaklaşık 0,95, tipik koaksiyel yalıtkanı için 0,66, alanın yarısı FR-4 içinde kalan bir mikroşerit yol için ise 0,55 civarı.',
  'The presets are the classic series. Square is odd harmonics at `1/n` all in phase, sawtooth is every harmonic at `1/n` with alternating sign, triangle is odd harmonics at `1/n²` with alternating sign. Their ideal peaks are `V1·pi/4`, `V1·pi/2` and `V1·pi²/8`, which is the amber trace.':
    'Ön ayarlar klasik serilerdir. Kare, hepsi aynı fazda `1/n` genlikli tek harmoniklerdir; testere, işareti değişen `1/n` genlikli her harmoniktir; üçgen ise işareti değişen `1/n²` genlikli tek harmoniklerdir. İdeal tepeleri `V1·pi/4`, `V1·pi/2` ve `V1·pi²/8` olup kehribar renkli iz bunu gösterir.',
  "The pull follows from the crystal's motional capacitance: `df/f = Cm/2 · (1/(C0+CL_actual) - 1/(C0+CL_spec))`. Too much load pulls the frequency down, too little pulls it up. Cm is tiny, femtofarads, which is exactly why a crystal is stable at all: the load has only a weak grip on it.":
    'Çekme, kristalin hareketli kapasitansından çıkar: `df/f = Cm/2 · (1/(C0+CL_gerçek) - 1/(C0+CL_veri))`. Fazla yük frekansı aşağı, az yük yukarı çeker. Cm femtofarad mertebesinde çok küçüktür; bir kristalin kararlı olmasının nedeni tam olarak budur: yükün onun üzerinde ancak zayıf bir tutuşu vardır.',
  'The ramp gives the ripple directly: `ΔIL = Voff·(1-D) / (fsw·L)`, i.e. `Vout·(1-D)/(fsw·L)` in the ideal case. The capacitor swallows the triangular part of that current, and integrating half a triangle of charge gives `ΔVout = ΔIL / (8·fsw·C)`. Real ESR adds `ΔIL·ESR` on top, which on an electrolytic is usually the larger of the two.':
    'Rampa dalgalanmayı doğrudan verir: `ΔIL = Voff·(1-D) / (fsw·L)`, yani ideal durumda `Vout·(1-D)/(fsw·L)`. Kondansatör bu akımın üçgen kısmını yutar ve yarım üçgenlik yükün integrali `ΔVout = ΔIL / (8·fsw·C)` verir. Gerçek ESR bunun üzerine `ΔIL·ESR` ekler; bir elektrolitikte genellikle ikisinden büyüğü budur.',
  'The RC filter turns each brief opening into a small exponential wobble instead of a full rail-to-rail transition. The node only registers as high once it crosses VIH, which for an ESP32 is about {VIH_FRAC}% of the supply, and that takes `t = -R·C·ln(1 - VIH/Vcc)`, i.e. 1.386 time constants.':
    'RC süzgeci her kısa açılmayı, tam hattan hatta bir geçiş yerine küçük bir üstel salınıma çevirir. Düğüm ancak VIH eşiğini geçtiğinde yüksek sayılır; ESP32 için bu, beslemenin yaklaşık %{VIH_FRAC} kadarıdır ve bu da `t = -R·C·ln(1 - VIH/Vcc)`, yani 1,386 zaman sabiti sürer.',
  'The resolution you actually get is one ADC step referred back to the input, `Vlsb / (R·gain)`. Gain is what rescues you from the burden-versus- resolution trap: a small shunt keeps the burden low, and the amplifier recovers the signal. That is exactly what a dedicated current-sense amplifier does, and it also handles the common-mode problem of high-side sensing, where the shunt sits at supply potential rather than near ground.':
    'Gerçekte elde ettiğiniz çözünürlük, girişe indirgenmiş bir ADC adımıdır: `Vlsb / (R·kazanç)`. Sizi yük payı ile çözünürlük arasındaki kıskaçtan kurtaran şey kazançtır: küçük bir şönt yük payını düşük tutar, yükselteç de işareti geri kazanır. Özel bir akım algılama yükseltecinin yaptığı tam olarak budur; ayrıca şöntün toprak yerine besleme potansiyelinde durduğu üst taraf algılamadaki ortak kip sorununu da çözer.',
  'The scope samples those closed forms directly rather than integrating, so the trace is exact at any zoom and cannot go unstable when dt exceeds tau.':
    "Osiloskop integral almak yerine bu kapalı biçimleri doğrudan örnekler, bu yüzden iz her yakınlaştırmada tamdır ve dt tau'yu aştığında kararsızlaşamaz.",
  'The scope trace is a sample-by-sample simulation. Every pole uses exact zero-order-hold discretisation, `y[n] = target + (y[n-1] - target)·e^(-dt/tau)`, so it stays stable at any time base; slew limiting and rail clipping are then applied per sample, which is what puts the flat tops and straight edges on the trace. The integrator is modelled as the practical one, Rf across Cf, so it has a finite DC gain instead of drifting into a rail.':
    "Osiloskop izi örnek örnek bir benzetimdir. Her kutup tam sıfırıncı derece tutma ayrıklaştırması kullanır, `y[n] = hedef + (y[n-1] - hedef)·e^(-dt/tau)`, bu yüzden her zaman tabanında kararlı kalır; yönelim sınırlaması ve hat kırpması ardından örnek başına uygulanır ve izdeki düz tepeler ile dik kenarlar buradan gelir. İntegral alıcı, Cf'ye paralel Rf ile pratik biçiminde modellenmiştir, yani bir hatta sürüklenmek yerine sonlu bir DC kazancı vardır.",
  'The scope trace is built from that piecewise description evaluated directly at each sample time, so it is exact at any time base and integrating `VDS·Id` over it returns the same numbers as the closed forms above.':
    'Osiloskop izi, bu parçalı tanımın her örnek anında doğrudan hesaplanmasıyla kurulur; bu yüzden her zaman tabanında tamdır ve üzerinde `VDS·Id` integrali almak yukarıdaki kapalı biçimlerle aynı sayıları verir.',
  'The scope trace is not that formula. It is a sample-by-sample simulation using exact zero-order-hold discretisation, `y[n] = x[n] + (y[n-1] - x[n])·e^(-dt/tau)`, which stays stable at any step size and reproduces clipping, ringing and PWM edges that a frequency-domain answer cannot show.':
    'Osiloskop izi o formül değildir. Tam sıfırıncı derece tutma ayrıklaştırmasıyla örnek örnek yapılan bir benzetimdir: `y[n] = x[n] + (y[n-1] - x[n])·e^(-dt/tau)`. Bu, her adım boyunda kararlı kalır ve frekans bölgesi yanıtının gösteremeyeceği kırpma, çınlama ve PWM kenarlarını üretir.',
  'The scope trace is not the transfer function. The solver integrates the loop current, `L·di/dt = v - i·(R + Rw)`, with exact zero-order-hold discretisation, `i[n] = i∞ + (i[n-1] - i∞)·e^(-dt/tau)`. That is stable at any step size, and the two element voltages come straight out of KVL, so `V(R) + V(L)` equals Vin sample for sample.':
    "Osiloskop izi transfer işlevi değildir. Çözücü çevrim akımının integralini alır, `L·di/dt = v - i·(R + Rw)`, tam sıfırıncı derece tutma ayrıklaştırmasıyla: `i[n] = i∞ + (i[n-1] - i∞)·e^(-dt/tau)`. Bu her adım boyunda kararlıdır ve iki eleman gerilimi doğrudan Kirchhoff gerilim yasasından çıkar, yani `V(R) + V(L)` örnek örnek Vin'e eşittir.",
  'The scope window holds {perRing} samples per ring cycle, so the drawn trace is aliased. The numbers above are still exact, they come from closed form, not the trace. Shorten the window or raise the source frequency to see the real ring.':
    'Osiloskop penceresi çınlama çevrimi başına {perRing} örnek tutuyor, yani çizilen iz örtüşmeli. Yukarıdaki sayılar yine de tamdır; izden değil kapalı biçimden gelirler. Gerçek çınlamayı görmek için pencereyi kısaltın ya da kaynak frekansını yükseltin.',
  'The single diode model is `I = Iph - I0·(e^((V + I·Rs)/a) - 1) - (V + I·Rs)/Rsh`, where `a = Ns·n·k·T/q` is the modified thermal voltage of the whole series string. It is implicit in I, so the solver iterates rather than evaluating a formula.':
    'Tek diyot modeli `I = Iph - I0·(e^((V + I·Rs)/a) - 1) - (V + I·Rs)/Rsh` şeklindedir; buradaki `a = Ns·n·k·T/q`, tüm seri dizinin değiştirilmiş ısıl gerilimidir. I cinsinden kapalı olmadığı için çözücü bir formül hesaplamak yerine yineleme yapar.',
  'The standard front end for resistive sensors: strain gauges in load cells, RTDs for temperature, and pressure sensors. The bridge exists because it measures a small change against a reference rather than an absolute value, which cancels supply drift and lets you amplify hard without amplifying the offset.':
    'Dirençli sensörler için standart ön kat: yük hücrelerindeki gerinim ölçerler, sıcaklık için RTDler ve basınç sensörleri. Köprü, mutlak bir değer yerine küçük bir değişimi referansa karşı ölçtüğü için vardır; bu da besleme kaymasını iptal eder ve ofseti yükseltmeden kuvvetli yükseltme yapmanızı sağlar.',
  'The standard way to switch anything substantial from an ESP32: motors, heaters, LED strips, solenoids. The critical check is gate drive, since a 3.3 V pin cannot fully turn on a MOSFET specified at 10 V VGS. That is the single most common ESP32 hardware mistake, and it shows up as a FET that works on the bench and burns out under load.':
    'Bir ESP32 ile ciddi bir yükü anahtarlamanın standart yolu: motorlar, ısıtıcılar, LED şeritler, solenoidler. Kritik kontrol geyt sürüşüdür, çünkü 3.3 V uç 10 V VGS için belirtilmiş bir MOSFETi tam olarak iletime sokamaz. Bu, en yaygın ESP32 donanım hatasıdır ve masada çalışan, yük altında yanan bir FET olarak ortaya çıkar.',
  'The string is unbalanced. Series capacitors share charge, not voltage, so the smallest member sits at {maxMemberVoltage} of the applied {supply} instead of an even {values}. Check it against its voltage rating, or add balancing resistors across each cap.':
    'Dizi dengesiz. Seri kondansatörler gerilimi değil yükü paylaşır, bu yüzden en küçük eleman eşit {values} yerine uygulanan {supply} geriliminin {maxMemberVoltage} kadarını üstlenir. Bunu kendi gerilim değeriyle karşılaştırın ya da her kondansatöre paralel dengeleme dirençleri ekleyin.',
  'The subtler problem is the copper. Current enters at one end and is consumed along the way, so the conductor carries the full load at the start and nothing at the end. The average is about half, so the end-to-end drop is roughly `I·R/2` rather than `I·R`. It still adds up fast on the thin traces built into the strip itself, which is why long runs need power injected at intervals rather than just fatter feed wire.':
    'Daha ince sorun bakırdır. Akım bir uçtan girer ve yol boyunca tüketilir, yani iletken başta tüm yükü, sonda hiçbir şeyi taşır. Ortalama kabaca yarıdır, yani uçtan uca düşüm `I·R` yerine kabaca `I·R/2` olur. Yine de şeridin kendi içindeki ince yollarda hızla birikir; uzun hatların yalnızca daha kalın besleme teli değil, aralıklarla güç enjeksiyonu istemesinin nedeni budur.',
  'The sum swings {swing}. A single-supply DAC or a filtered PWM pin cannot produce that, the real output would flat-top and add distortion this model does not include. Trim the amplitudes or move the DC offset.':
    'Toplam {swing} salınıyor. Tek beslemeli bir DAC ya da süzülmüş bir PWM pini bunu üretemez; gerçek çıkış düz tepe yapar ve bu modelin içermediği bir bozulma ekler. Genlikleri kısın ya da DC ofsetini kaydırın.',
  'The surplus is positive but thin: refilling an empty battery takes {daysToRecharge} days, longer than the {autonomyDays} days of autonomy it provides. After one bad week the node may never catch up. Oversize the panel rather than the battery.':
    'Fazla pozitif ama ince: boş bir pili doldurmak {daysToRecharge} gün sürüyor, bu da sağladığı {autonomyDays} günlük özerklikten uzun. Kötü bir haftadan sonra düğüm asla toparlayamayabilir. Pili değil paneli büyütün.',
  "The switching frequency is fixed at 150 kHz internally, which is the module's main limitation. Low frequency means a physically large inductor and capacitor for a given ripple, since `dIL = Vout·(1-D)/(fsw·L)` and `dV = dIL/(8·fsw·C)` both scale inversely with fsw.":
    "Anahtarlama frekansı içeriden 150 kHz'e sabitlenmiştir ve modülün başlıca kısıtı budur. Düşük frekans, belirli bir dalgalanma için fiziksel olarak büyük bir bobin ve kondansatör demektir, çünkü `dIL = Vout·(1-D)/(fsw·L)` ve `dV = dIL/(8·fsw·C)` ifadelerinin ikisi de fsw ile ters orantılıdır.",
  'The target is above the supply, so the curve never reaches it. Nothing above the rail is reachable through a passive RC.':
    'Hedef beslemenin üzerinde, bu yüzden eğri ona hiç ulaşmaz. Hattın üstündeki hiçbir değere pasif bir RC ile erişilemez.',
  'The target is below the {VREF} V feedback reference, which this topology cannot produce at all.':
    'Hedef, {VREF} V geri besleme referansının altında; bu topoloji bunu hiçbir şekilde üretemez.',
  'The target power factor is at or below the present one, so there is nothing to correct. Raise the target above {pf}.':
    'Hedef güç çarpanı şimdikiyle aynı ya da altında, yani düzeltilecek bir şey yok. Hedefi {pf} üzerine çıkarın.',
  'The target sits above the equilibrium temperature, so the wire never reaches it no matter how long it runs. Raise the supply or reduce the cooling.':
    'Hedef, denge sıcaklığının üzerinde; bu yüzden tel ne kadar uzun çalışırsa çalışsın ona ulaşamaz. Beslemeyi yükseltin ya da soğutmayı azaltın.',
  'the tariff itself': 'tarifenin kendisi',
  'The tension is drain against impedance. A divider is connected permanently, so 100 kΩ plus 100 kΩ across 4.2 V wastes 21 µA continuously, which is more than an ESP32 in deep sleep. Going to megohms fixes that but breaks the ADC, whose input needs to charge a sampling capacitor. The usual answers are a MOSFET to switch the divider on only while measuring, or a capacitor across the bottom leg.':
    "Gerilim, tüketim ile empedans arasındadır. Bölücü sürekli bağlıdır, yani 4,2 V üzerindeki 100 kΩ artı 100 kΩ sürekli 21 µA harcar ve bu, derin uykudaki bir ESP32'den fazladır. Megaohmlara çıkmak bunu düzeltir ama girişi bir örnekleme kondansatörünü doldurmak zorunda olan ADC'yi bozar. Alışılmış yanıtlar, bölücüyü yalnızca ölçüm sırasında devreye alan bir MOSFET ya da alt bacağa paralel bir kondansatördür.",
  'The thermal check is usually the real limit, not the current rating. Only the loss inside the IC heats the junction, so `Tj = Tamb + Pic·ThetaJA`. On a bare module with no airflow ThetaJA is poor, and 1 to 2 W of internal loss is enough to reach thermal shutdown.':
    'Gerçek sınır genellikle akım değeri değil, ısıl denetimdir. Jonksiyonu yalnızca tümdevrenin içindeki kayıp ısıtır, yani `Tj = Tortam + Pic·ThetaJA`. Hava akışı olmayan çıplak bir modülde ThetaJA kötüdür ve 1 - 2 W içsel kayıp ısıl kapanmaya ulaşmaya yeter.',
  'The tolerance grades exist to close those gaps. The worst target sits at the midpoint of a gap `[a, b]`, an error of `(b - a) / (b + a)` away from either neighbour: exactly 20% for E6, so a 20% part always covers it. Every finer grade leaves a sliver open, E24 worst at 7.1% against a 5% part, so some targets sit between two parts whichever one you buy. That is what the tolerance band readout is checking.':
    "Tolerans sınıfları bu boşlukları kapatmak için vardır. En kötü hedef bir `[a, b]` boşluğunun ortasında, her iki komşudan da `(b - a) / (b + a)` uzaklıkta durur: E6 için tam %20, yani %20'lik bir parça onu her zaman kapsar. Her ince sınıf küçük bir aralık açık bırakır; E24 en kötü durumda %5'lik bir parçaya karşı %7,1'dir, yani bazı hedefler hangisini alırsanız alın iki parçanın arasında kalır. Tolerans bandı göstergesi bunu denetler.",
  'The TP4056 module everyone uses. The scope shows the classic CC/CV profile against time: constant current until the cell reaches 4.2 V, then constant voltage while the current tails away.':
    'Herkesin kullandığı TP4056 modülü. Osiloskop klasik CC/CV profilini zamana karşı gösterir: hücre 4.2 Va ulaşana kadar sabit akım, sonra akım sönerken sabit gerilim.',
  'The TP4056 module used in nearly every hobby lithium project. It matters because one resistor sets the charge current and getting it wrong either takes all day or charges the cell faster than it should be charged, and because the module is a linear charger that gets hot at high current.':
    'Neredeyse her hobi lityum projesinde kullanılan TP4056 modülü. Önemlidir, çünkü tek bir direnç şarj akımını belirler ve yanlış seçmek ya tüm günü alır ya da hücreyi olması gerekenden hızlı şarj eder; ayrıca modül yüksek akımda ısınan lineer bir şarj devresidir.',
  'The trace is a per-sample algebraic solve. There is no storage element in this model, so edges are instant: a real device adds a turn-off storage time of hundreds of nanoseconds, which is exactly what heavy overdrive makes worse.':
    'İz, örnek başına cebirsel bir çözümdür. Bu modelde depolayıcı eleman yoktur, bu yüzden kenarlar anlıktır: gerçek bir eleman yüzlerce nanosaniyelik bir kapanma depolama süresi ekler ve ağır aşırı sürüşün kötüleştirdiği şey tam olarak budur.',
  'The trace is a transient, not a waveform. The sink carries essentially all the heat capacity, so it is the single pole: `tau = Rsa·Cth` and `Ts(t) = Ts(∞) + (Ta - Ts(∞))·e^(-t/tau)`, integrated with the same exact zero-order-hold step the RC page uses so it stays stable at any dt. The die and the interface hold almost no heat next to a lump of aluminium, so on this time base the junction just sits `P·(Rjc + Rcs)` above the sink, which is why it jumps at t = 0 and then crawls. Real sinks are multi-pole, so treat the early part of the curve as indicative and the endpoint as the answer.':
    'İz bir dalga şekli değil, bir geçici tepkidir. Isı sığasının neredeyse tamamını soğutucu taşır, yani tek kutup odur: `tau = Rsa·Cth` ve `Ts(t) = Ts(∞) + (Ta - Ts(∞))·e^(-t/tau)`, RC sayfasının kullandığı aynı tam sıfırıncı derece tutma adımıyla hesaplanır, böylece her dt değerinde kararlı kalır. Yonga ile arayüz, bir alüminyum kütlenin yanında neredeyse hiç ısı tutmaz; bu yüzden bu zaman tabanında jonksiyon yalnızca soğutucunun `P·(Rjc + Rcs)` kadar üstünde durur ve bu da t = 0 anında sıçrayıp sonra sürünmesini açıklar. Gerçek soğutucular çok kutupludur, bu yüzden eğrinin başını fikir verici, bitiş noktasını ise yanıt olarak alın.',
  'The trace is a two-state simulation of `[Vc, Il]` using exact zero-order-hold discretisation, `x[n+1] = xss + e^(A·dt)·(x[n] - xss)`. The matrix exponential is closed form, so the solver is exact for a piecewise constant drive and stable at any step size. Forward Euler on a resonant second-order system diverges as soon as `dt &gt; 2/w0`.':
    'İz, `[Vc, Il]` durum çiftinin tam sıfırıncı derece tutma ayrıklaştırmasıyla iki durumlu benzetimidir: `x[n+1] = xss + e^(A·dt)·(x[n] - xss)`. Matris üsteli kapalı biçimdedir, yani çözücü parçalı sabit bir sürüş için tamdır ve her adım boyunda kararlıdır. Rezonanslı ikinci dereceden bir sistemde ileri Euler, `dt &gt; 2/w0` olur olmaz ıraksar.',
  'The trace is not integrated. Inside a switching period the inductor current is exactly two straight lines, so it is evaluated from the closed-form corner points at whatever sample spacing the scope needs. Dragging fsw or L across decades changes the detail on screen but nothing can accumulate or diverge.':
    "İz integralle bulunmaz. Bir anahtarlama çevrimi içinde bobin akımı tam olarak iki doğrudur, bu yüzden osiloskobun istediği örnek aralığında kapalı biçimli köşe noktalarından hesaplanır. fsw'yi ya da L'yi dekatlar boyunca sürüklemek ekrandaki ayrıntıyı değiştirir ama hiçbir şey birikemez ya da ıraksayamaz.",
  'The trace is not the formula. It is a sample-by-sample solve that switches between two sub-circuits, conducting (source behind Rs into C parallel RL) and off (C discharging into RL), each integrated with exact zero-order-hold discretisation `v[n] = vInf + (v[n-1] - vInf)·e^(-dt/tau)`. That stays stable at any step size. It also explains why the measured ripple comes in under the formula: the cap only discharges for the part of the period the diodes are off, and it does so exponentially, not linearly.':
    "İz formül değildir. İki alt devre arasında geçiş yapan, örnek örnek bir çözümdür: iletim (Rs arkasındaki kaynaktan C paralel RL'ye) ve kesim (C'nin RL'ye deşarjı); her biri tam sıfırıncı derece tutma ayrıklaştırması `v[n] = vInf + (v[n-1] - vInf)·e^(-dt/tau)` ile hesaplanır. Bu, her adım boyunda kararlı kalır. Ayrıca ölçülen dalgalanmanın neden formülün altında çıktığını da açıklar: kondansatör yalnızca çevrimin diyotların kapalı olduğu kısmında ve doğrusal değil üstel olarak boşalır.",
  'The trace is that equation swept over load current, not a time-domain simulation: Tj is linear in Iout at fixed headroom, offset at zero load by the divider current the regulator still has to pass. Where it crosses the flat 398 K line is the honest current limit of the design, which is usually well below the 1.5 A the datasheet front page advertises.':
    "İz, bir zaman bölgesi benzetimi değil, o denklemin yük akımı boyunca taranmış hâlidir: sabit payda Tj, Iout ile doğrusaldır ve sıfır yükte regülatörün yine de geçirmesi gereken bölücü akımı kadar kaydırılmıştır. Düz 398 K çizgisini kestiği yer, tasarımın dürüst akım sınırıdır ve bu genellikle veri sayfasının ilk sayfasında duyurulan 1,5 A'in epey altındadır.",
  'The trace is the closed-form piecewise-linear solution of `di/dt = v/L` evaluated per sample, so it stays exact and periodic at any switching frequency the sliders reach.':
    'İz, `di/dt = v/L` denkleminin örnek başına hesaplanan kapalı biçimli parçalı doğrusal çözümüdür, bu yüzden sürgülerin ulaşabildiği her anahtarlama frekansında tam ve dönemsel kalır.',
  'The trace is the closed-form response, `y(t) = y_ss(t) + (y0 - y_ss(0))·e^(-t/tau)`, i.e. the periodic steady state plus one decaying exponential. That is exact for a linear time-invariant filter, so it cannot go unstable at any time base.':
    'İz, kapalı biçimli yanıttır: `y(t) = y_ss(t) + (y0 - y_ss(0))·e^(-t/tau)`, yani dönemsel kararlı durum artı sönen tek bir üstel. Bu, doğrusal ve zamanla değişmeyen bir süzgeç için tamdır, dolayısıyla hiçbir zaman tabanında kararsızlaşamaz.',
  'The tradeoff is the whole point: ripple falls as `1/(R·C)` and settling rises as `5·R·C`, so trading one for the other buys nothing. Raising f_pwm is the only free win, up to the point where the LEDC timer runs out of duty resolution, since `2^bits · f` must stay under the 80 MHz APB clock.':
    "Bütün mesele ödünleşmedir: dalgalanma `1/(R·C)` ile düşer, oturma süresi ise `5·R·C` ile yükselir; yani birini diğerine değişmek hiçbir şey kazandırmaz. Tek bedava kazanç f_pwm'i yükseltmektir, ta ki LEDC zamanlayıcısının görev çevrimi çözünürlüğü tükenene dek; çünkü `2^bit · f` çarpımı 80 MHz APB saatinin altında kalmalıdır.",
  'The ubiquitous 150 kHz buck module: feedback divider, limits, efficiency.':
    'Her yerde bulunan 150 kHz buck modülü: geri besleme bölücü, sınırlar, verim.',
  'The usable fraction is doing real work here. Nominal capacity assumes a slow discharge to a low cutoff at room temperature, none of which holds in the field. Planning on 80% is normal, and less in the cold.':
    'Kullanılabilir oran burada gerçek iş görür. Anma kapasitesi, oda sıcaklığında düşük bir kesime kadar yavaş bir deşarj varsayar ve sahada bunların hiçbiri geçerli değildir. %80 üzerinden planlamak olağandır, soğukta daha da azı.',
  'the usual whip': 'alışılmış çubuk anten',
  'The valley current is `Iout - ΔIL/2`, so at `Iout = ΔIL/2` the current just touches zero. Below that boundary the converter is discontinuous and the duty collapses to `D = sqrt(2·L·fsw·Iout·Voff / (Von·(Von+Voff)))`.':
    'Vadi akımı `Iout - ΔIL/2` olduğundan `Iout = ΔIL/2` noktasında akım sıfıra tam değer. Bu sınırın altında dönüştürücü kesintilidir ve görev çevrimi `D = sqrt(2·L·fsw·Iout·Voff / (Von·(Von+Voff)))` ifadesine çöker.',
  "The whole budget is one line in dB: `Prx = Ptx + Gtx + Grx - FSPL - losses`, and the link closes when Prx sits above the receiver's sensitivity. Working in decibels turns every multiplication into an addition, which is the only reason this is tractable by hand.":
    'Tüm bütçe dB cinsinden tek satırdır: `Prx = Ptx + Gtx + Grx - FSPL - kayıplar`, ve Prx alıcının duyarlılığının üstünde durduğunda bağlantı kurulur. Desibel ile çalışmak her çarpmayı toplamaya çevirir; bunun elle hesaplanabilir olmasının tek nedeni budur.',
  'The window spans decades, so the sensible choice is the geometric mean rather than the arithmetic one. 4.7 kΩ is the traditional default and it is fine for a short 100 kHz bus, but at 400 kHz with any real cable length it is often too weak, which is the usual cause of an I2C bus that works on the bench and fails with a longer lead.':
    "Pencere dekatlar boyunca uzanır, bu yüzden akla yatkın seçim aritmetik değil geometrik ortalamadır. 4,7 kΩ geleneksel öntanımlıdır ve kısa bir 100 kHz veri yolu için uygundur, ama 400 kHz'de gerçek bir kablo boyuyla çoğu zaman fazla zayıf kalır; tezgahta çalışıp uzun kabloyla arızalanan bir I2C veri yolunun alışılmış nedeni budur.",
  'The zener is a shunt: it takes whatever current the load does not. `Rs = (Vin - Vz) / (Iz + IL)` is the whole design, evaluated at the two corners that bite. Lowest input with the heaviest load leaves the least current for the zener, which sets the largest usable Rs. Highest input with the lightest load pushes everything through the zener, which sets the smallest.':
    "Zener bir paralel elemandır: yükün almadığı akımı o alır. `Rs = (Vin - Vz) / (Iz + IL)` tasarımın tamamıdır ve can yakan iki uç durumda hesaplanır. En ağır yükle en düşük giriş, zenere en az akımı bırakır ve kullanılabilir en büyük Rs'yi belirler. En hafif yükle en yüksek giriş her şeyi zenerden geçirir ve en küçüğünü belirler.",
  'Thermal': 'Isıl',
  'Thermal path': 'Isıl yol',
  'Thermal tau': 'Isıl tau',
  'Thermistor': 'Termistör',
  'These are mains potentials. A correction capacitor stays charged after disconnection and must carry bleed resistors, and it must be rated for at least {capVoltageRating} RMS.':
    'Bunlar şebeke gerilimleridir. Bir düzeltme kondansatörü ayrıldıktan sonra yüklü kalır ve boşaltma dirençleri taşımak zorundadır; ayrıca en az {capVoltageRating} RMS için seçilmelidir.',
  'Theta JA': 'Theta JA',
  'Thevenin Rout': 'Thevenin Rout',
  'Third capacitor': 'Üçüncü kondansatör',
  'This load already leads, so correcting it needs a shunt *inductor*, not a capacitor. Capacitive loads at scale are unusual: long lightly loaded cables and large filter banks are the usual causes.':
    'Bu yük zaten ileri fazda, yani düzeltmek için kondansatör değil paralel bir *bobin* gerekir. Büyük ölçekte kapasitif yükler olağandışıdır: uzun ve az yüklü kablolar ile büyük süzgeç grupları alışılmış nedenlerdir.',
  'This model covers copper loss only. Real transformers also have core loss from hysteresis and eddy currents, which is roughly constant with load and dominates at light load, plus leakage inductance that worsens regulation further at higher frequencies. The VA rating is a thermal limit covering all of it together.':
    'Bu model yalnızca bakır kaybını kapsar. Gerçek trafolarda ayrıca histerezis ve girdap akımlarından gelen, yükle kabaca sabit kalan ve hafif yükte baskın olan çekirdek kaybı, artı yüksek frekanslarda regülasyonu daha da bozan kaçak endüktans vardır. VA değeri bunların tümünü birlikte kapsayan ısıl bir sınırdır.',
  'This value is not a member of the E96 series, so it has no EIA-96 code. EIA-96 marking only exists for 1% parts, which are drawn from E96 by definition. A 4.7 kΩ 5% part is an E24 value and would be marked 472 or 4701 instead.':
    "Bu değer E96 serisinin bir üyesi değil, bu yüzden EIA-96 kodu yok. EIA-96 işaretlemesi yalnızca, tanımı gereği E96'dan seçilen %1'lik parçalar için vardır. 4,7 kΩ %5'lik bir parça E24 değeridir ve bunun yerine 472 ya da 4701 olarak işaretlenir.",
  'Threshold 2/3 Vcc': 'Eşik 2/3 Vcc',
  'Threshold Vth': 'Eşik Vth',
  'Time constant': 'Zaman sabiti',
  'Time constant L/R': 'Zaman sabiti L/R',
  'Time high': 'Yüksek süresi',
  'Time low': 'Düşük süresi',
  'Time on a rail': 'Hatta geçen süre',
  'Time to fall to target': 'Hedefe düşme süresi',
  'Time to reach target': 'Hedefe ulaşma süresi',
  'Time to target': 'Hedefe varma süresi',
  'Timebase': 'Zaman tabanı',
  'Timer': 'Zamanlayıcı',
  'Timing network': 'Zamanlama devresi',
  'Timing resistance is high enough that threshold bias current shifts the result.':
    'Zamanlama direnci, eşik kutuplama akımının sonucu kaydıracağı kadar yüksek.',
  'Timing resistance is high enough that threshold bias current shifts the result. Use larger C and smaller R.':
    'Zamanlama direnci, eşik kutuplama akımının sonucu kaydıracağı kadar yüksek. Daha büyük C ve daha küçük R kullanın.',
  'Tj': 'Tj',
  'Tj fitted': 'Soğutuculu Tj',
  'Tj free air': 'Serbest havada Tj',
  'Tj max': 'En büyük Tj',
  'Tj with no heatsink': 'Soğutucusuz Tj',
  'TLC555 CMOS': 'TLC555 CMOS',
  'To': 'Bitiş',
  'to break even': 'başa baş gelmek için',
  'TO-220 bare, free air': 'Çıplak TO-220, serbest hava',
  'TO-220 bolted to a small sink': 'Küçük soğutucuya cıvatalı TO-220',
  'TO-247 on a large sink': 'Büyük soğutucuda TO-247',
  'TO-263 (D2PAK)': 'TO-263 (D2PAK)',
  'to220': 'to220',
  'to220-air': 'to220-air',
  'to220-sink': 'to220-sink',
  'to247-sink': 'to247-sink',
  'to263': 'to263',
  'Toggle simulator list': 'Simülatör listesini aç/kapat',
  'Tolerance': 'Tolerans',
  'Tolerance and series always match, and that is not a coincidence. The gaps in each series are sized so neighbouring values just touch at their tolerance limits: E24 has about 5% gaps and E96 about 1%. Buying a 1% part on an E12 nominal is pointless, since a nearer E96 value exists for whatever you actually wanted.':
    "Tolerans ile seri her zaman eşleşir ve bu bir rastlantı değildir. Her serideki boşluklar, komşu değerler tolerans sınırlarında birbirine tam değecek biçimde ayarlanmıştır: E24'te boşluklar yaklaşık %5, E96'da yaklaşık %1'dir. E12 anma değerinde %1'lik bir parça almak anlamsızdır, çünkü gerçekte istediğiniz her ne ise ona daha yakın bir E96 değeri vardır.",
  'Tolerance band': 'Tolerans bandı',
  'Tolerance band at {tolerance}': '{tolerance} toleransta bant',
  'Topology': 'Topoloji',
  'Total charge time': 'Toplam şarj süresi',
  'Total current': 'Toplam akım',
  'Total dissipation': 'Toplam güç kaybı',
  'Total draw is {total}, past the {GPIO_MAX_MA} mA an ESP32 pin may source or sink. Feed the bank from the rail through a MOSFET or a driver, not straight off a GPIO.':
    "Toplam çekiş {total}; bu, bir ESP32 pininin verebileceği ya da çekebileceği {GPIO_MAX_MA} mA sınırının ötesinde. Grubu doğrudan bir GPIO'dan değil, hattan bir MOSFET ya da sürücü üzerinden besleyin.",
  'Total from supply': 'Beslemeden toplam',
  'Total loss': 'Toplam kayıp',
  'Total power': 'Toplam güç',
  'Trace {px} px': 'İz {px} px',
  'Trace length': 'Yol uzunluğu',
  'Trace resistance': 'Yol direnci',
  'Trace thickness': 'İz kalınlığı',
  'Transformer': 'Transformatör',
  'Transistor dissipation': 'Transistör güç kaybı',
  'triangle': 'üçgen',
  'Triangle': 'Üçgen',
  'Trig': 'Tetik',
  'Trigger 1/3 Vcc': 'Tetik 1/3 Vcc',
  'triode': 'triyot',
  'Triode (ohmic, fully on)': 'Triyot (omik, tam iletimde)',
  'Truncating at a step leaves ringing that never goes away. The overshoot converges to 8.95% of the jump, i.e. 1.179 times the flat top, which is why a square built from harmonics reads a crest factor near 1.18 instead of the ideal 1.0. Adding terms narrows the ripple, it does not shrink it.':
    "Bir basamakta kesmek, hiç yok olmayan bir çınlama bırakır. Aşım, sıçramanın %8,95'ine, yani düz tepenin 1,179 katına yakınsar; harmoniklerden kurulmuş bir karenin ideal 1,0 yerine 1,18'e yakın bir tepe çarpanı okumasının nedeni budur. Terim eklemek dalgayı daraltır, küçültmez.",
  'Tsink': 'Tsink',
  'Tuned circuits in radio front ends, crystal and LC oscillators, and EMI filters. Just as often it is unintentional: any inductance with stray capacitance rings, which is why switching nodes overshoot and why a long supply lead into a decoupling capacitor can oscillate. Knowing f0 and Q tells you whether it will ring once or for a hundred cycles.':
    'Radyo ön katlarındaki ayarlı devreler, kristal ve LC osilatörler ve EMI filtreleri. En az o kadar sık istemeden de ortaya çıkar: kaçak kapasiteye sahip her endüktans çınlar, anahtarlama düğümlerinin aşım yapmasının ve bir dekuplaj kondansatörüne giden uzun besleme hattının salınmasının nedeni budur. f0 ve Q değerlerini bilmek, bir kez mi yoksa yüz çevrim boyunca mı çınlayacağını söyler.',
  'Turn it round to size the sink: `Rsa_required = (Tjmax - Ta)/P - Rjc - Rcs`. If that is zero or negative the package and the interface have already used the whole budget, and no heatsink helps. The matching power ceiling is `Pmax = (Tjmax - Ta)/Rth(j-a)`.':
    'Soğutucuyu boyutlandırmak için tersine çevirin: `Rsa_gerekli = (Tjmax - Ta)/P - Rjc - Rcs`. Bu sıfır ya da negatifse kılıf ile arayüz bütçenin tamamını çoktan harcamıştır ve hiçbir soğutucu yaramaz. Buna karşılık gelen güç tavanı `Pmax = (Tjmax - Ta)/Rth(j-a)` olur.',
  'Turn PWM into an analogue voltage. Ripple against settling time.':
    'PWM sinyalini analog gerilime çevirin. Dalgalanmaya karşı oturma süresi.',
  'Turn-off time': 'Kapanma süresi',
  'Turns ratio': 'Sarım oranı',
  'Turns ratio sets voltage, and its square sets impedance. Winding resistance is what turns a textbook ideal transformer into one whose output sags the moment you load it.':
    'Sarım oranı gerilimi, karesi ise empedansı belirler. Kitaptaki ideal transformatörü, yüklediğiniz anda çıkışı düşen bir transformatöre çeviren şey sargı direncidir.',
  'Turns ratio, reflected impedance, regulation and core loss estimate.':
    'Sarım oranı, yansıyan empedans, regülasyon ve çekirdek kaybı tahmini.',
  'Two': 'İki',
  "Two dividers across one supply, read as a difference. The trace is a sweep, not a waveform: the horizontal axis is {arm}, the sensor arm, so read the scope's per-division figure as ohms.":
    'Tek bir besleme üzerinde iki bölücü, fark olarak okunur. İz bir dalga şekli değil taramadır: yatay eksen sensör kolu olan {arm} değeridir, bu yüzden osiloskobun bölme başına değerini ohm olarak okuyun.',
  'Two in parallel': 'Paralel iki adet',
  'Two in series': 'Seri iki adet',
  'Two resistors and a tap. The unloaded answer is the easy part: what matters is the output impedance, and how much the thing you hang on the tap drags it down.':
    'İki direnç ve bir orta uç. Yüksüz sonuç işin kolay kısmıdır: asıl önemli olan çıkış empedansı ve orta uca astığınız şeyin onu ne kadar aşağı çektiğidir.',
  "Two things this does not tell you. It is a steady-state thermal limit, so a brief surge can far exceed it safely. And it says nothing about voltage drop, which for long thin traces in low-voltage rails is usually the binding constraint: a trace can be thermally fine while dropping enough to upset a 3.3 V regulator's feedback.":
    "Bunun size söylemediği iki şey var. Bu bir kararlı durum ısıl sınırıdır, yani kısa bir sıçrama bunu güvenle çok aşabilir. Ve gerilim düşümü hakkında hiçbir şey söylemez; oysa düşük gerilimli hatlardaki uzun ve ince yollarda bağlayıcı kısıt genellikle odur: bir yol ısıl olarak sorunsuzken 3,3 V'luk bir regülatörün geri beslemesini bozacak kadar düşüm yapabilir.",
  'TX antenna gain': 'TX anten kazancı',
  'TX power': 'TX gücü',
  'Type': 'Tip',
  'Type the raw number your divider or current limit asked for.':
    'Bölücünüzün ya da akım sınırınızın istediği ham sayıyı yazın.',
  'undefined': 'tanımsız',
  'under': 'altında',
  'Under 8 bits the steps are visible on an LED. For smooth dimming keep the frequency low enough for 10 bits or more, and remember perceived brightness is roughly the square of duty, so the low end needs the finest steps.':
    '8 bitin altında adımlar LED üzerinde görünür olur. Yumuşak kısma için frekansı 10 bit ya da üzerine yetecek kadar düşük tutun ve algılanan parlaklığın kabaca görev çevriminin karesi olduğunu unutmayın; alt uç en ince adımları ister.',
  'Understanding why a square wave upsets an audio chain, why non-sinusoidal load current on the mains causes trouble, and what THD actually measures. Directly relevant to PWM: the whole reason a PWM signal needs filtering is the harmonic content sitting above the fundamental.':
    'Kare dalganın bir ses zincirini neden bozduğunu, şebekedeki sinüs olmayan yük akımının neden sorun çıkardığını ve THD değerinin gerçekte neyi ölçtüğünü anlamak. PWM ile doğrudan ilgilidir: bir PWM sinyalinin filtrelenmesi gerekmesinin tüm nedeni, temel bileşenin üzerinde duran harmonik içeriktir.',
  'Unloaded and loaded divider, output impedance, error from the load.':
    'Yüksüz ve yüklü bölücü, çıkış empedansı, yükten kaynaklanan hata.',
  'Unregulated input, at its lowest. Include ripple troughs.':
    'Regüle edilmemiş giriş, en düşük değerinde. Dalgalanma çukurlarını da katın.',
  'Upper threshold': 'Üst eşik',
  'usable {usableLow} to {usableHigh} V': 'kullanılabilir {usableLow} - {usableHigh} V',
  'Usable fraction': 'Kullanılabilir oran',
  'usable in practice': 'uygulamada kullanılabilir',
  'Usable resolution': 'Kullanılabilir çözünürlük',
  'Use {value} (E24)': '{value} kullan (E24)',
  'UV 395 nm': 'Morötesi 395 nm',
  'V across R': 'R üzerindeki V',
  'VA rating': 'VA değeri',
  'valley {ivalley}, Isat {isat}': 'vadi {ivalley}, Isat {isat}',
  'Valley current': 'Vadi akımı',
  'Value': 'Değer',
  'Values under 10 Ω use the R notation on SMD parts, where R marks the decimal point: 4R7 is 4.7 Ω, R22 is 0.22 Ω. The plain digit codes cannot express a fraction.':
    '10 Ω altındaki değerler SMD parçalarda R gösterimini kullanır; burada R ondalık ayracı belirtir: 4R7 4,7 Ω, R22 ise 0,22 Ω demektir. Yalın rakam kodları bir kesri anlatamaz.',
  'Variant': 'Çeşit',
  'Vb': 'Vb',
  'VB / VE / VC': 'VB / VE / VC',
  'Vbias sits outside the usable output range, so the stage has nowhere to swing. On a single supply set it to half the positive rail, i.e. {vpos}.':
    'Vbias kullanılabilir çıkış aralığının dışında, bu yüzden katın salınacak yeri yok. Tek beslemede onu pozitif hattın yarısına, yani {vpos} değerine ayarlayın.',
  'Vc': 'Vc',
  'Vcap': 'Vcap',
  'Vcc': 'Vcc',
  'Vce': 'Vce',
  'VCE': 'VCE',
  'Vcell': 'Vcell',
  'Vdrive': 'Vdrive',
  'Vds': 'Vds',
  'VDS on state': 'İletimde VDS',
  'Velocity factor': 'Hız çarpanı',
  'Vf · I': 'Vf · I',
  'Vf of {vf} is at or above the {supply} rail, so the LED never turns on and no resistor value helps. Use a lower Vf part, or boost the rail with a charge pump or a step-up converter.':
    "{vf} olan Vf, {supply} hattıyla aynı ya da üzerinde; bu yüzden LED hiç yanmaz ve hiçbir direnç değeri işe yaramaz. Daha düşük Vf'li bir parça kullanın ya da hattı bir yük pompası veya yükseltici dönüştürücüyle çıkarın.",
  'Vgs': 'Vgs',
  'VGS of {vgsDrive} is at or below the {vth} threshold, so no channel forms and the load never sees current. This is the classic failure of hanging a standard MOSFET off a 3.3 V pin: pick a logic level part, or add a gate driver or a small BJT level shifter to swing the gate to 10 V.':
    "{vgsDrive} olan VGS, {vth} eşiğiyle aynı ya da altında; bu yüzden kanal oluşmaz ve yük hiç akım görmez. Standart bir MOSFET'i 3,3 V'luk bir pine asmanın klasik başarısızlığı budur: mantık seviyeli bir parça seçin ya da kapıyı 10 V'a salındırmak için bir kapı sürücüsü veya küçük bir BJT seviye çevirici ekleyin.",
  'VIH': 'VIH',
  'Vin': 'Vin',
  'Vin max': 'Vin max',
  'Vin min': 'Vin min',
  'Vin min ({vinMin}) is not above Vz ({vz}). A shunt regulator can only drop voltage, so there is no resistor that works. Lower Vz or raise the input.':
    "Vin min ({vinMin}), Vz ({vz}) değerinin üzerinde değil. Paralel bir regülatör yalnızca gerilim düşürebilir, yani işe yarayan hiçbir direnç yok. Vz'yi düşürün ya da girişi yükseltin.",
  'violet': 'mor',
  'Vmp': 'Vmp',
  'Voc': 'Voc',
  'Voc temp coeff': 'Voc sıcaklık katsayısı',
  'Volt-second balance says the inductor must gain as much current in the on time as it loses in the off time, so `Von·D = Voff·(1-D)` and `D = Voff / (Von + Voff)`. With no losses that is the familiar `D = Vout / Vin`. This page keeps the switch, diode and winding drops inside Von and Voff, which is why the reported duty sits slightly above the ideal ratio.':
    'Volt-saniye dengesi, bobinin iletim süresinde kazandığı akımı kesim süresinde yitirmesi gerektiğini söyler, yani `Von·D = Voff·(1-D)` ve `D = Voff / (Von + Voff)`. Kayıpsız durumda bu, bildik `D = Vout / Vin` ifadesidir. Bu sayfa anahtar, diyot ve sargı düşümlerini Von ile Voff içinde tutar; bildirilen görev çevriminin ideal orandan biraz yüksek olmasının nedeni budur.',
  'voltage': 'gerilim',
  'Voltage at far end': 'Uzak uçta gerilim',
  'Voltage at load': 'Yükteki gerilim',
  'Voltage Divider': 'Gerilim Bölücü',
  'Voltage divider biased common emitter on the 3V3 rail. The scope shows the base voltage and the inverted collector output against time.':
    '3V3 hattında gerilim bölücülü ortak emiterli kat. Osiloskop, beyz gerilimini ve evrilmiş kolektör çıkışını zamana karşı gösterir.',
  'Voltage drop': 'Gerilim düşümü',
  'Voltage gain Av': 'Gerilim kazancı Av',
  'Volts / div': 'Volt / bölme',
  'Volts per LSB': 'LSB başına volt',
  'Vout': 'Vout',
  'Vout + Vd, so rate it for {vSwitchStress}': 'Vout + Vd, yani {vSwitchStress} için seçin',
  'Vout at worst case': 'En kötü durumda Vout',
  'Vout loaded': 'Yüklü Vout',
  'Vout of {vout} is not above the {vin} input, so there is nothing for a boost to do. With the switch off the inductor and diode are just a lossy wire and the output sits at Vin minus a diode drop. Use a buck stage below the input, or a buck-boost if the input crosses the output.':
    '{vout} çıkışı {vin} girişinin üzerinde değil, bu yüzden yükselticiye iş kalmıyor. Anahtar kapalıyken bobin ve diyot kayıplı bir telden ibarettir ve çıkış, Vin eksi bir diyot düşümünde kalır. Girişin altında bir düşürücü kat kullanın, giriş çıkışı kesiyorsa düşürücü-yükseltici kullanın.',
  'Vout target': 'Hedef Vout',
  'Vout unloaded': 'Yüksüz Vout',
  'Vout worst case': 'En kötü durumda Vout',
  'Vpwm': 'Vpwm',
  'Vs - Vf': 'Vs - Vf',
  'Vsec': 'Vsec',
  'VT / IE': 'VT / IE',
  'Vterm': 'Vterm',
  'Vth': 'Vth',
  'Vth {BSS138_VGS_TH} V': 'Vth {BSS138_VGS_TH} V',
  'Vz': 'Vz',
  'Wake cycles': 'Uyanış çevrimi',
  'Watch current lag voltage and instantaneous power dip negative. That negative dip is energy the load borrows and hands straight back, which the cable has to carry both ways for nothing. Current and power traces are scaled onto the voltage axis; the readouts carry the true values.':
    'Akımın gerilimin gerisinde kalmasını ve anlık gücün negatife düşmesini izleyin. O negatif çukur, yükün ödünç alıp hemen geri verdiği enerjidir ve kablo bunu boşuna iki yönde taşır. Akım ve güç izleri gerilim eksenine ölçeklenmiştir; gerçek değerler göstergelerdedir.',
  'watts': 'watt',
  'Waveform': 'Dalga şekli',
  'Wavelength': 'Dalga boyu',
  'Wavelength is `lambda = c/f`. A quarter-wave element is resonant because the reflection from its open end arrives back at the feed in phase, presenting a real impedance of roughly 37 Ω over a perfect ground plane, which is a reasonable match to 50 Ω coax.':
    'Dalga boyu `lambda = c/f` ile bulunur. Çeyrek dalga bir eleman rezonanstadır çünkü açık ucundan yansıyan dalga besleme noktasına aynı fazda geri döner ve kusursuz bir toprak düzlemi üzerinde yaklaşık 37 Ω gerçek empedans gösterir; bu da 50 Ω koaksiyel için makul bir uyumdur.',
  'wets the contact': 'kontağı ıslatır',
  'Wheatstone bridge': 'Wheatstone köprüsü',
  'Wheatstone Bridge': 'Wheatstone Köprüsü',
  'Where is it used?': 'Nerede kullanılır?',
  'Where the core gives up and L collapses.': "Çekirdeğin pes ettiği ve L'nin çöktüğü nokta.",
  'Where the heat comes from': 'Isının kaynağı',
  'Which term dominates decides where to spend effort. Once the sleep phase carries most of the average, shortening the wake is wasted work, and the target becomes standby leakage: regulator quiescent current, pull-up and divider networks, and sensors that stay powered.':
    'Hangi terimin baskın olduğu, çabanın nereye harcanacağını belirler. Uyku evresi ortalamanın çoğunu taşımaya başladıktan sonra uyanık süreyi kısaltmak boşa emektir ve hedef bekleme sızıntısı olur: regülatör durgun akımı, pull-up ve bölücü ağları ve açık kalan algılayıcılar.',
  'while held low': 'alçak tutulurken',
  'white': 'beyaz',
  'White': 'Beyaz',
  'Width follows from cross-section and copper weight: `w = A / thickness`, where 1 oz copper is about 35 µm. So doubling to 2 oz halves the width you need, which is often cheaper than widening a congested board.':
    "Genişlik kesitten ve bakır ağırlığından çıkar: `w = A / kalınlık`; burada 1 oz bakır yaklaşık 35 µm'dir. Yani 2 oz'a çıkmak gereken genişliği yarıya indirir ve bu, sıkışık bir kartı genişletmekten çoğu zaman daha ucuzdur.",
  'WiFi 5 GHz': 'WiFi 5 GHz',
  'WiFi 802.11b 1 Mbps': 'WiFi 802.11b 1 Mbps',
  'WiFi 802.11n MCS7': 'WiFi 802.11n MCS7',
  'WiFi/BLE 2.4 GHz': 'WiFi/BLE 2,4 GHz',
  "Will the link close? The scope sweeps received power against DISTANCE, not time: the horizontal axis runs from zero out past the maximum range, and the flat line is the receiver's sensitivity floor. Where they cross, the link dies.":
    'Bağlantı kurulacak mı? Osiloskop alınan gücü zamana değil MESAFEYE karşı tarar: yatay eksen sıfırdan maksimum menzilin ötesine uzanır ve düz çizgi alıcının hassasiyet tabanıdır. Kesiştikleri yerde bağlantı ölür.',
  'Winding DCR': 'Sargı DCR',
  'Winding dissipation': 'Sargı güç kaybı',
  'Winding plus diode bulk. Sets the peak charging current.':
    'Sargı artı diyot gövdesi. Tepe şarj akımını bu belirler.',
  'Winding resistance': 'Sargı direnci',
  'Winding resistance is in series with everything, so it never drops out. It raises the corner (fc uses R + Rw), costs the low pass some passband, and leaves the high pass a DC feedthrough floor of `Rw / (R + Rw)`. That, plus core saturation and self-resonance, is why filters at signal level are built from capacitors and inductors are kept for power work.':
    'Sargı direnci her şeyle seridir, yani hiçbir zaman devreden çıkmaz. Köşeyi yükseltir (fc, R + Rw kullanır), alçak geçirenin geçirme bandından bir miktar götürür ve yüksek geçirene `Rw / (R + Rw)` kadar bir DC sızma tabanı bırakır. Bu, artı çekirdek doyumu ve kendi kendine rezonans, işaret seviyesindeki süzgeçlerin kondansatörlerden kurulmasının ve bobinlerin güç işlerine saklanmasının nedenidir.',
  'Windings': 'Sargılar',
  'wire': 'tel',
  'Wire': 'Tel',
  'Wire Gauge (AWG)': 'Kablo Kesiti (AWG)',
  'Wire mass': 'Tel kütlesi',
  'Wiring anything beyond a breadboard: battery leads, motor supplies, LED strip feeds, car and solar installations. The voltage drop figure is the useful one, since a supply that measures correctly at the source can arrive well below spec at the load, and the return conductor doubles the drop people usually calculate.':
    'Breadboardun ötesindeki her kablolama: batarya kabloları, motor beslemeleri, LED şerit beslemeleri, araç ve güneş enerjisi kurulumları. İşe yarayan değer gerilim düşümüdür, çünkü kaynakta doğru ölçülen bir besleme yüke spesifikasyonun epey altında ulaşabilir ve dönüş iletkeni, insanların genelde hesapladığı düşümü ikiye katlar.',
  "With a sinusoidal supply, `S = Vrms·Irms`, `P = S·cos(phi)` and `Q = S·sin(phi)`. Only P does work. Q is energy shuttled into the load's magnetic field and back out every half cycle, and the cable carries it both ways.":
    "Sinüs biçimli bir beslemede `S = Vrms·Irms`, `P = S·cos(phi)` ve `Q = S·sin(phi)` olur. İş yapan yalnızca P'dir. Q, her yarım çevrimde yükün manyetik alanına gidip geri gelen enerjidir ve kablo onu iki yönde de taşır.",
  'With enough open-loop gain the inverting pin tracks the non-inverting pin, so the resistor network alone sets the gain: `Av = -Rf/Rin` inverting, `Av = 1 + Rf/Rg` non-inverting, `Av = 1` for a buffer. The summing amp is superposition on one virtual earth, `Vout = -Rf·(V1/R1 + V2/R2)`, and the difference amp is `Vout = Vref + (Rf/Rin)·(V+ - V-)` with matched ratios on both branches.':
    'Yeterli açık çevrim kazancıyla eviren pin evirmeyen pini izler, yani kazancı yalnızca direnç ağı belirler: evirende `Av = -Rf/Rin`, evirmeyende `Av = 1 + Rf/Rg`, tamponda `Av = 1`. Toplayıcı yükselteç tek bir sanal toprakta süperpozisyondur, `Vout = -Rf·(V1/R1 + V2/R2)`, fark yükselteci ise iki kolda eşleşmiş oranlarla `Vout = Vref + (Rf/Rin)·(V+ - V-)` olur.',
  'With nothing on the tap the current is the same in both legs, so `Vout = Vin·R2/(R1+R2)`. Only the ratio sets the voltage: 1k/1k and 1M/1M both give half the rail, but one wastes 1000x the current.':
    'Orta uçta hiçbir şey yokken akım iki bacakta da aynıdır, yani `Vout = Vin·R2/(R1+R2)` olur. Gerilimi yalnızca oran belirler: 1k/1k da 1M/1M de hattın yarısını verir, ama biri 1000 kat fazla akım harcar.',
  'Working out how current splits between parallel paths: paralleled resistors sharing power, LEDs unwisely paralleled on one resistor, and multiple return paths in a ground plane. It is also the model for why paralleling batteries or regulators without ballast leads to one of them doing all the work.':
    'Akımın paralel kollar arasında nasıl bölündüğünü bulmak: gücü paylaşan paralel dirençler, tek dirence tedbirsizce paralellenmiş LEDler ve toprak düzlemindeki çoklu dönüş yolları. Ayrıca dengeleme olmadan paralellenen bataryaların veya regülatörlerin neden birinin tüm işi yapmasına yol açtığının da modelidir.',
  'Worst arm dissipates {maxArmPower}, past the {RESISTOR_POWER_W} a common 1/4 W part is rated for. Self-heating drifts the arm and shows up as output offset.':
    'En kötü kol {maxArmPower} harcıyor; bu, alışılmış 1/4 W bir parçanın dayandığı {RESISTOR_POWER_W} değerinin ötesinde. Kendi kendini ısıtma kolu kaydırır ve çıkışta ofset olarak görünür.',
  'Worst case for {series}': '{series} için en kötü durum',
  'Worst case for the zener. Assume zero unless the load is always on.':
    'Zener için en kötü durum. Yük her zaman açık değilse sıfır varsayın.',
  'Worst case, not average. An ESP32 peaks near 0.5 A on transmit.':
    "Ortalama değil, en kötü durum. Bir ESP32 iletimde 0,5 A'e yaklaşır.",
  'Worst sag': 'En kötü çökme',
  'WS2812 is a 5 V part and its data input wants at least 0.7·VDD, i.e. about 3.5 V. A 3.3 V ESP32 pin is marginally below that. It often works, and then stops working when the strip warms up or the wire gets longer. Use a level shifter, or power the first LED from 3.9 V through a diode so its logic threshold drops to meet the ESP32.':
    "WS2812 bir 5 V parçasıdır ve veri girişi en az 0,7·VDD, yani yaklaşık 3,5 V ister. 3,3 V'luk bir ESP32 pini bunun kıl payı altındadır. Çoğu zaman çalışır, sonra şerit ısındığında ya da tel uzadığında çalışmayı bırakır. Bir seviye çevirici kullanın ya da ilk LED'i bir diyot üzerinden 3,9 V ile besleyin ki mantık eşiği ESP32'yi karşılayacak kadar düşsün.",
  'WS2812 LED Power': 'WS2812 LED Gücü',
  'XC': 'XC',
  'XL': 'XL',
  'yellow': 'sarı',
  'You cannot buy the resistance your formula produced. This turns a calculated value into something purchasable, tells you the error you are accepting, and finds two-resistor combinations when a single standard value is not close enough, which matters for precision dividers and gain-setting networks.':
    'Formülünüzün ürettiği direnci satın alamazsınız. Bu sayfa hesaplanan değeri satın alınabilir bir şeye çevirir, kabul ettiğiniz hatayı söyler ve tek bir standart değer yeterince yakın olmadığında iki dirençli kombinasyonlar bulur; bu da hassas bölücüler ve kazanç belirleyen ağlar için önemlidir.',
  'you have {l}': 'elinizdeki {l}',
  'you want {pressRate} Hz': 'istenen {pressRate} Hz',
  'Zener': 'Zener',
  'Zener at {pzFraction}% of its rating. Inside the absolute limit but past the {POWER_DERATING}% budget this page uses: ratings are quoted at 25 C and the part will run hot in still air.':
    "Zener, anma değerinin %{pzFraction} kadarında. Mutlak sınırın içinde ama bu sayfanın kullandığı %{POWER_DERATING} bütçesinin ötesinde: anma değerleri 25 C'de verilir ve parça durgun havada sıcak çalışır.",
  'Zener dissipation': 'Zener güç kaybı',
  'Zener over its rating: {pz} in a {pzMax} part at {vinMax} with the load disconnected. It will fail, usually shorted, which then dumps {irs} into Rs. Raise Rs above {rsMin}.':
    "Zener anma değerinin üzerinde: yük bağlı değilken {vinMax} değerinde {pzMax} bir parçada {pz}. Genellikle kısa devre olacak biçimde bozulur ve bu da Rs üzerine {irs} boşaltır. Rs'yi {rsMin} üzerine çıkarın.",
  'Zener Regulator': 'Zener Regülatör',
  'Zener shunt regulator': 'Zener paralel regülatör',
  'Zero-current output': 'Sıfır akım çıkışı',
  'Zf': 'Zf',
  'Zoom in': 'Yakınlaştır',
  'Zoom out': 'Uzaklaştır',
  'Zout is {zout}, above the {ADC_MAX_SOURCE_OHMS} the ESP32 ADC wants. The sample-and-hold cap will not settle inside the sampling window, so readings come out low. Lower both resistors or buffer the tap with an op-amp follower.':
    "Zout {zout}, ESP32 ADC'sinin istediği {ADC_MAX_SOURCE_OHMS} değerinin üzerinde. Örnekle ve tut kondansatörü örnekleme penceresi içinde oturmayacaktır, bu yüzden okumalar düşük çıkar. İki direnci de küçültün ya da orta ucu bir işlemsel yükselteç izleyiciyle tamponlayın.",
  'Zzt (dynamic)': 'Zzt (dinamik)',
}
