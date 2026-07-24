import type { Key } from './en'

/**
 * Turkish. Typed against en.ts, so adding a string there fails the build here
 * until it is translated. Fetched only when Turkish is selected, see LOADERS in
 * index.tsx.
 */
export const tr: Record<Key, string> = {
  'ac-impedance.3Db': '-3 dB',
  'ac-impedance.blurb': 'Seri ve paralel RLC empedansının frekansla değişimi, genlik ve faz.',
  'ac-impedance.centreFrequency': 'Merkez frekansı',
  'ac-impedance.currentFrom1V': "1 V'ta akım",
  'ac-impedance.decadesShown': 'Gösterilen dekat',
  'ac-impedance.imaginaryPart': 'sanal kısım',
  'ac-impedance.lede':
    "Bir R, L ve C'nin birlikte frekansa göre empedansı. Osiloskop zamanı değil FREKANSI logaritmik olarak tarar: her yatay bölme, ayarladığınız frekans etrafında ortalanmış sabit bir dekat kesridir. Genlik ohm, faz derece cinsindendir.",
  'ac-impedance.phase': 'faz',
  'ac-impedance.phase2': 'Faz',
  'ac-impedance.qMeasuresHowSharp':
    'Q bunun ne kadar keskin olduğunu ölçer: seri bağlantı için `Q = (1/R)·sqrt(L/C)`. Bant genişliği buradan `f0/Q` olarak çıkar. Yüksek Q, dar ve seçici bir tepe ile büyük bir dolaşan akım demektir; düşük Q ise geniş ve yumuşak bir tepe demektir.',
  'ac-impedance.reactance': 'Reaktans',
  'ac-impedance.reactanceIsFrequencyDependent':
    'Reaktans frekansa bağlıdır: `XL = 2·pi·f·L` frekansla yükselir, `XC = 1/(2·pi·f·C)` ise düşer. Karmaşık empedans olarak yazıldıklarında `+jXL` ve `-jXC` olur, yani toplanmak yerine birbirinden çıkarılır ve belirli bir frekansta tamamen birbirini götürür.',
  'ac-impedance.realPart': 'gerçek kısım',
  'ac-impedance.thatIsResonanceF0':
    'İşte bu rezonanstır, `f0 = 1/(2·pi·sqrt(LC))`. Seri bağlantıda birbirini götüren terimlerden geriye yalnızca R kalır, bu yüzden empedans en küçük değerine iner ve akım tepe yapar. Paralel bağlantıda ise birbirini götüren admitanslardır, bu yüzden empedans en büyük değerine çıkar ve devre, kaynaktan neredeyse hiç akım çekmezken içinde büyük bir akım dolaştıran bir tank devresine dönüşür.',
  'ac-impedance.thePhaseTraceTells':
    'Faz izi hangi elemanın baskın olduğunu gösterir. Seri rezonansın altında kondansatör baskındır ve akım gerilimin önüne geçer, bu da negatif faz verir. Üstünde ise bobin baskındır ve akım gerilimin gerisinde kalır. Tam f0 noktasında devre saf dirençli görünür; uyumlandırma ve süzgeçlemede işe yaramasının nedeni de budur.',
  'ac-impedance.title': 'AC Empedans',
  'ac-impedance.use':
    "Süzgeç ve uyumlandırma ağı tasarımı, bir dekuplaj kondansatörünün öz rezonansının üzerinde neden işlevini yitirdiğini ve kablo ile yük empedansının frekansta neden önemli olduğunu anlamak. Bir devre 1 kHz'de ve 1 MHz'de farklı davrandığında sebebi budur.",
  'ac-impedance.xc': 'XC',
  'ac-impedance.xl': 'XL',
  'ac-impedance.zAtFrequency': 'Bu frekansta |Z|',
  'antenna-length.58Wave': '5/8 dalga',
  'antenna-length.at24Ghz':
    "2,4 GHz'de çeyrek dalga yaklaşık 31 mm'dir; yonga ve kıvrımlı antenlerin orada işe yaramasının, 868 MHz'lik bir düğümün ise gözle görülür biçimde uzun, yaklaşık 86 mm'lik bir çubuğa ihtiyaç duymasının nedeni budur. Uzunluğu %10 hatalı tutmak rezonansı dar bandın epey dışına kaydırır ve kolaylıkla 10 dB'ye, yani menzilde üç kat kayba mal olabilir.",
  'antenna-length.bandPreset': 'Bant ön ayarı',
  'antenna-length.beforeShortening': 'kısaltmadan önce',
  'antenna-length.blurb':
    '433/868/915 MHz ve 2,4 GHz için çeyrek ve yarım dalga uzunlukları, hız katsayısı dahil.',
  'antenna-length.conductor': 'İletken',
  'antenna-length.dipoleEachLegIs': 'dipol, her kol bir çeyrek',
  'antenna-length.each4OrMore': 'her biri, 4 veya daha fazla',
  'antenna-length.fullWave': 'Tam dalga',
  'antenna-length.groundRadial': 'Toprak radyali',
  'antenna-length.keepTheElementClear':
    'Elemanı topraktan, metalden ve elinizden uzak tutun. Yakınlıktan kaynaklanan akort bozulması, tezgahta sınanmış bir bağlantının kart kutuya girdikten sonra çalışmamasının en yaygın nedenidir.',
  'antenna-length.lede':
    'Tel anteni doğru uzunlukta kesin. Fiziksel eleman her zaman serbest uzay değerinden kısadır, çünkü dalga iletkenin içinde ve çevresinde daha yavaş ilerler.',
  'antenna-length.quarterWave': 'Çeyrek dalga',
  'antenna-length.quarterWaveInFree': 'Serbest uzayda çeyrek dalga',
  'antenna-length.slightlyMoreGain': 'biraz daha kazanç',
  'antenna-length.theory1':
    'Dalga boyu `lambda = c/f` ile bulunur. Çeyrek dalga bir eleman rezonanstadır çünkü açık ucundan yansıyan dalga besleme noktasına aynı fazda geri döner ve kusursuz bir toprak düzlemi üzerinde yaklaşık 37 Ω gerçek empedans gösterir; bu da 50 Ω koaksiyel için makul bir uyumdur.',
  'antenna-length.thePhysicalLengthIs':
    'Fiziksel uzunluk her zaman boşluktaki `lambda/4` değerinden kısadır. Dalga kısmen iletkenin ve çevresinin içinden ilerler, bu yüzden hız çarpanı devreye girer: çıplak tel için yaklaşık 0,95, tipik koaksiyel yalıtkanı için 0,66, alanın yarısı FR-4 içinde kalan bir mikroşerit yol için ise 0,55 civarı.',
  'antenna-length.theUsualWhip': 'alışılmış çubuk anten',
  'antenna-length.title': 'Anten Uzunluğu',
  'antenna-length.use':
    "Bir LoRa, WiFi veya GPS modülü için tel anten kesmek. Önemlidir, çünkü çeyrek dalga uzunluğu dalga boyuna bağlıdır ve %10 hata 10 dB'ye mal olabilir, bu da menzilde üç kat demektir. Ayrıca toprak düzlemi gereksinimini de işaret eder; küçük bir kart üzerindeki çıplak antenin bu kadar kötü çalışmasının nedeni budur.",
  'antenna-length.velocityFactor': 'Hız çarpanı',
  'antenna-length.warn1':
    'Çeyrek dalga bir anten yalnızca yarım antendir. Diğer yarısı toprak düzlemidir ve o olmadan koaksiyel örgü ışıma yapar; bu da her şeyin akordunu bozar ve başarımı kartı nasıl tuttuğunuza bağlı hale getirir. Ya radyal teller ekleyin, ya düzgün bir toprak dökümü kullanın, ya da toprak düzlemi gerektirmeyen yarım dalga bir dipol takın.',
  'antenna-length.wavelength': 'Dalga boyu',
  'battery.blurb': 'Yük altında deşarj, iç direnç düşümü ve Peukert etkisiyle kapasite azalması.',
  'battery.cellCapacity': 'Hücre kapasitesi',
  'battery.cellsInParallel': 'Paralel hücre',
  'battery.chargeDelivered': 'Verilen yük',
  'battery.chemistry': 'Kimya',
  'battery.cutoffVoltage': 'Kesim gerilimi',
  'battery.energyDelivered': 'Verilen enerji',
  'battery.lede':
    'Bir paketi sabit yüke deşarj edin ve gerilimin düşmesini izleyin. Osiloskop, uç gerilimini açık devre gerilimine karşı zaman içinde çizer: iki iz arasındaki fark, paketin kendi iç direncindeki kayıptır.',
  'battery.lossInPack': 'Pakette kayıp',
  'battery.maxC': 'en çok {maxCRate} C',
  'battery.meanCurrent': 'Ortalama akım',
  'battery.nominalVoltage': 'Anma gerilimi',
  'battery.ocv': 'OCV',
  'battery.ofRatedAtThis': 'bu hızda anma değerinin',
  'battery.pack': 'Paket',
  'battery.packEfficiency': 'Paket verimi',
  'battery.packResistance': 'Paket direnci',
  'battery.peukertSLawCaptures':
    "Peukert yasası kapasitenin sabit olmadığını anlatır: `t = H·(C/(I·H))^k`. k birden büyük olduğunda ağır deşarj daha az toplam yük çeker. En kötüsü 1,2 ile 1,3 arasındaki k değeriyle kurşun asittir; lityum 1,05'e yakındır, bu yüzden bir LiPo yük altında değerini çok daha iyi korur.",
  'battery.peukertUsable': 'Peukert kullanılabilir',
  'battery.power': 'Güç',
  'battery.ratedCapacity': 'Anma kapasitesi',
  'battery.resistiveAndConstantPower':
    "Dirençli ve sabit güçlü yükler, paket boşalırken farklı davranır. Bir direnç gerilim düştükçe daha az akım çeker, bu yüzden yumuşakça söner. Sabit güçlü bir yük ise gerilim düştükçe *daha fazla* akım çeker ve bu da sondaki çöküşü hızlandırır: bir ESP32'yi besleyen anahtarlamalı regülatörün davranışı tam olarak budur ve paketin son yüzde birkaçının neden bu kadar ani yok olduğunu açıklar.",
  'battery.sP': '{series}S{parallel}P',
  'battery.startVoltage': 'Başlangıç gerilimi',
  'battery.theory1':
    'Uç gerilimi `V = OCV(depth) - I·Rint` ile bulunur. Açık devre eğrisi deşarj derinliğiyle düşer ve iç direnç akımla orantılı bir düşüş daha çıkarır. Bir pilin boştayken 4,2 V, yüklendiği anda 3,7 V okumasının tüm nedeni budur.',
  'battery.title': 'Batarya Simülatörü',
  'battery.use':
    'Bir cihazın ne kadar süre çalışacağını ve deşarjın son bölümünün neden bu kadar hızlı çöktüğünü öngörmek. Gerilim düşümü değeri, ani yük çeken her devre için önemlidir: veri gönderen bir ESP32, iç direncin hattı düşürmesine yetecek kadar akım çeker; yorgun bir hücrede brownout resetlerinin yaygın nedeni budur.',
  'battery.vterm': 'Vterm',
  'battery.warn1':
    "Yük, bu paketin verebileceğinden daha fazla güç istiyor. En büyük güç aktarımı bunu `OCV² / (4·Rint)` ile sınırlar ve bunun ötesinde hiçbir gerilimde çalışma noktası yoktur. Yükü azaltın ya da Rint'i düşürmek için paralel hücre ekleyin.",
  'battery.warn2':
    '{cRate} C çekiliyor; bu, {label} için {maxCRate} C sürekli değerinin üzerinde. Gerçek hücreler burada aşırı ısınır ve hızla yaşlanır, bu model ise bunu benzetmez: size kullanmamanız gereken bir çalışma süresini seve seve gösterir.',
  'battery.warn3':
    'Paket daha ilk örnekte kesim geriliminin altında, bu yüzden kullanılabilir bir çalışma süresi yok. Yük, bu paket boyu için fazla ağır.',
  'battery.worstSag': 'En kötü düşüm',
  'bjt-switch.amplifier': 'Yükselteç',
  'bjt-switch.baseCurrentIb': 'Beyz akımı IB',
  'bjt-switch.baseDrive': 'Beyz sürüşü',
  'bjt-switch.baseResistorRb': 'Beyz direnci RB',
  'bjt-switch.bleed': '{dividerCurrent} akıtma',
  'bjt-switch.blurb':
    'Tam doyum için beyz sürüşü, aşırı sürme katsayısı ve ortak emiter kutuplaması.',
  'bjt-switch.bypassReWithA': "RE'yi kondansatörle baypas edin",
  'bjt-switch.collector': '{pCollector} kolektör',
  'bjt-switch.collectorCurrent': 'Kolektör akımı',
  'bjt-switch.collectorRc': 'Kolektör RC',
  'bjt-switch.commonEmitterAmplifier': 'ortak emiterli yükselteç',
  'bjt-switch.currentGainHfe': 'Akım kazancı hFE',
  'bjt-switch.datasheetMinimumNotTypical':
    'Veri sayfasındaki en küçük değer, tipik değer değil. Doyum en kötü duruma bağlıdır.',
  'bjt-switch.dbInverting': '{avDb} dB, eviren',
  'bjt-switch.dividerStiffness': 'Bölücü sağlamlığı',
  'bjt-switch.driveWaveform': 'Sürüş dalga şekli',
  'bjt-switch.emitterRe': 'Emiter RE',
  'bjt-switch.emitterRe2': 'Emiter re',
  'bjt-switch.fromThereIcHfe':
    "Oradan `IC = hFE·IB`, `IE = (hFE+1)·IB` ve `VCE = VCC - IC·RC - IE·RE` çıkar. VCE'yi hattın ortasına yakın bir yere koyun ki çıkış iki yöne de salınabilsin.",
  'bjt-switch.ib': 'IB {ib}',
  'bjt-switch.inputSignal': 'Giriş işareti',
  'bjt-switch.lede':
    'RB üzerinden 3V3 GPIO ucundan sürülen NPN alt taraf anahtarı. Osiloskop, sürüş dalga şeklini ve kolektör gerilimini zamana karşı gösterir.',
  'bjt-switch.lede2':
    '3V3 hattında gerilim bölücülü ortak emiterli kat. Osiloskop, beyz gerilimini ve evrilmiş kolektör çıkışını zamana karşı gösterir.',
  'bjt-switch.loadPower': 'Yük gücü',
  'bjt-switch.loadRail': 'Yük hattı',
  'bjt-switch.maxInputPeak': 'En büyük giriş (tepe)',
  'bjt-switch.midbandGainIsAv':
    "Orta bant kazancı `Av = -RC / (RE + re)` şeklindedir; burada `re = VT/IE` içsel emiter direncidir, emiter akımına bölünen yaklaşık 26 mV. RE, re'den çok büyük olduğunda bu, dirençlerle belirlenen ve bu yüzden kararlı olan bildik `-RC/RE` ifadesine iner. RE'yi baypaslamak onu işaret frekanslarında kısa devre eder ve geriye `-RC/re` kalır: çok daha fazla kazanç, ama artık kutuplama akımı ve sıcaklıkla birlikte kayan bir kazanç.",
  'bjt-switch.min': 'en az {ibMin}',
  'bjt-switch.noGain': 'kazanç yok',
  'bjt-switch.now': 'şu an {rb}',
  'bjt-switch.npnLowSideSwitch': 'NPN alt taraf anahtarı',
  'bjt-switch.operatingMode': 'Çalışma kipi',
  'bjt-switch.outputSwingIsLimited':
    'Çıkış salınımını önce hangisi biterse o sınırlar: Q noktasının `IC·RC` kadar üstündeki hat ya da `VCE - VCEsat` kadar altındaki doyum. İz, orta bant kazancını örnek örnek uygular ve orada kırpar, yani boşluğu dürüstçe gösterir; gerçek bir kat ise kesimde yumuşak kırpar ve kuplaj kondansatörü alt uçtan söndürür.',
  'bjt-switch.overdriveFactor': 'Aşırı sürüş çarpanı',
  'bjt-switch.quiescentIc': 'Durgun IC',
  'bjt-switch.r1RailToBase': 'R1 (hattan beyze)',
  'bjt-switch.r2BaseToGnd': 'R2 (beyzden şaseye)',
  'bjt-switch.rbDissipation': 'RB güç kaybı',
  'bjt-switch.rbForOdf': 'ODF {ODF_TARGET} için RB',
  'bjt-switch.rcRoIgnored': 'RC, ro yok sayıldı',
  'bjt-switch.saturatedDissipationIsP':
    'Doyumdaki güç kaybı `P = VCEsat·IC + VBE·IB` olur, burada birkaç miliwatt. Aktif bölgede VCE 0,2 V yerine voltlar mertebesindedir ve aynı akım ısıya dönüşür; anahtarlama transistörleri işte böyle ölür.',
  'bjt-switch.stage': 'Kat',
  'bjt-switch.supplyAndBias': 'Besleme ve kutuplama',
  'bjt-switch.supplyVcc': 'Besleme VCC',
  'bjt-switch.swing': 'salınım {swing}',
  'bjt-switch.switch2': 'Anahtar',
  'bjt-switch.theBaseResistorSets':
    'Her şeyi beyz direnci belirler: VBE 0,7 V alındığında `IB = (Vin - VBE) / RB`. Transistör bundan sonra `IC = hFE·IB` verebilir, ama yük yalnızca `IC(sat) = (Vload - VCEsat) / RL` kadarını ister. Hangisi küçükse o kazanır.',
  'bjt-switch.theDividerIsSolved':
    'Bölücü Thevenin eşdeğeri olarak çözülür, `VTH = VCC·R2/(R1+R2)` ve `RTH = R1||R2`; böylece beyz çevrimi `IB = (VTH - VBE) / (RTH + (hFE+1)·RE)` verir. Bu, "IB ihmal edilebilir" kestirmesi değil, tam çözümdür; gevşek bir bölücünün burada doğru okumak yerine kaymış bir Q noktası olarak görünmesinin nedeni de budur.',
  'bjt-switch.theOverdriveFactorIs':
    "Aşırı sürüş çarpanı bu ikisinin oranıdır: `ODF = IB·hFE / IC(load)`. 1'in altında transistör hiç doyuma girmez ve üzerine volt düşüren aktif bölgede kalır. Yaklaşık {ODF_TARGET} ODF için tasarlayın ki en kötü hFE, soğuk silisyum ve daha ağır bir yük bile onu tam iletimde bıraksın.",
  'bjt-switch.theTraceIsA':
    'İz, örnek başına cebirsel bir çözümdür. Bu modelde depolama elemanı yoktur, bu yüzden kenarlar anlıktır: gerçek bir transistör yüzlerce nanosaniyelik bir kapanma depolama süresi ekler ve ağır aşırı sürüşün kötüleştirdiği şey tam olarak budur.',
  'bjt-switch.title': 'Anahtar / Yükselteç Olarak BJT',
  'bjt-switch.transistorDissipation': 'Transistör güç kaybı',
  'bjt-switch.use':
    'Gerekli akımı veremeyen bir mikrodenetleyici ucundan röle, buzzer, motor veya LED dizisi sürmek. Asıl konu aşırı sürme katsayısıdır: doyuma sertçe sürülmeyen bir transistör beklenenden çok daha fazla güç harcar ve ısınır; hobi devrelerinde anahtarlama transistörünün bozulmasının olağan nedeni budur.',
  'bjt-switch.vb': 'Vb',
  'bjt-switch.vbVeVc': 'VB / VE / VC',
  'bjt-switch.vce': 'Vce',
  'bjt-switch.vce2': 'VCE',
  'bjt-switch.vdrive': 'Vdrive',
  'bjt-switch.voltageGainAv': 'Gerilim kazancı Av',
  'bjt-switch.vtIe': 'VT / IE',
  'bjt-switch.warn1':
    "{driveHigh} sürüşte doyuma girmiyor: hFE·IB yalnızca {icAvailable} veriyor, oysa yük {icSat} istiyor; bu yüzden eleman {vce} gerilimiyle aktif bölgede kalıyor ve {pCollector} harcıyor. RB'yi {rbForTarget} değerine ya da altına düşürün.",
  'bjt-switch.warn2':
    "Beyz akımı {ib}; bu, bir ESP32 pininin verebileceği {GPIO_MAX_MA} mA sınırının üzerinde. RB'yi büyütün ya da beyzi bir tampon üzerinden sürün.",
  'bjt-switch.warn3':
    "Doyuma kutuplanmış: VCE {vce} değerine çakılı ve salınacak boşluk kalmamış. RC ya da R2'yi düşürün, ya da RE'yi büyütün.",
  'bjt-switch.warn4':
    "Kesimde: bölücü beyze yalnızca {vth} veriyor, oysa jonksiyon 0,7 V istiyor. R2'yi büyütün ya da R1'i küçültün.",
  'bjt-switch.warn5':
    "Bölücü yeterince sağlam değil: yalnızca IB'nin {stiffness} katını akıtıyor, bu yüzden kutuplama noktası hFE ve sıcaklıkla kayar. 10 katı hedefleyin, yani R1 ve R2'yi birlikte küçültün.",
  'bjt-switch.warn6':
    '{amplitude} tepe giriş, bu Q noktasının kırpmadan yükseltebileceği {maxInput} sınırını aşıyor; iz üzerindeki düz tepe de bu.',
  'boost.atThisLoadWith': 'bu yükte, seri kolda {ron} ile',
  'boost.blurb': 'Yükseltme görev çevrimi, anahtar gerilim stresi ve bobin boyutlandırma.',
  'boost.boostConverterPowerStage': 'Yükseltici dönüştürücü güç katı',
  'boost.coutEsr': 'Cout ESR',
  'boost.datasheetSaturationCurrentNot': 'Veri sayfasındaki doyum akımı, RMS değeri değil.',
  'boost.dcmBelowOfLoad': '{ioutBoundary} yükün altında DCM',
  'boost.diodeDropVd': 'Diyot düşümü Vd',
  'boost.diodeReverseStress': 'Diyot ters zorlanması',
  'boost.dutyD': 'Görev çevrimi D',
  'boost.fromCFromEsr': "{vRippleCap} C'den, {vRippleEsr} ESR'den",
  'boost.highestVoutReachable': 'Ulaşılabilir en yüksek Vout',
  'boost.ideal1VinVout': 'ideal 1 - Vin/Vout = {dutyIdeal}',
  'boost.iDiode': 'I diyot',
  'boost.inductorIsat': 'Bobin Isat',
  'boost.inductorL': 'Bobin L',
  'boost.inputCurrentIin': 'Giriş akımı Iin',
  'boost.iSwitch': 'I anahtar',
  'boost.lede':
    'Yükseltici dönüştürücüde kararlı hâl bobin akımı. Yatay eksen zamandır, birkaç anahtarlama periyodu genişliğinde. Mavi iz bobini, yeşil iz anahtarın toprağa çektiği akımı, sarı iz ise diyotun çıkış kondansatörüne verdiği akımı gösterir: bu ikisi arasındaki fark, giriş akımının çıkış akımından neden yüksek olduğunu açıklar.',
  'boost.lNeededForCcm': 'CCM için gereken L',
  'boost.loadIout': 'Yük Iout',
  'boost.noSteadyState': 'kararlı durum yok',
  'boost.off': 'kapalı {toff}',
  'boost.ofIinAimFor': "Iin'in {rippleRatio} kadarı, hedef {RIPPLE_TARGET}",
  'boost.onceTheValleyCurrent':
    'Vadi akımı negatife düşecek olduğunda diyot çoktan kesime girmiştir ve dönüştürücü kesintili iletimdedir. Görev çevrimi o zaman `Iout = Vin²·D²/(2·L·fsw·(Vout - Vin))` bağıntısından, yani `D = sqrt(2·L·fsw·Iout·(Vout - Vin))/Vin` olarak çıkar. Sınır `Iout = Vin·D(1-D)/(2·fsw·L)` noktasındadır.',
  'boost.outConductionLoss': '{pout} çıkış, {ploss} iletim kaybı',
  'boost.outputCout': 'Çıkış Cout',
  'boost.rateItFor': '{vDiodeStress} için seçin',
  'boost.realParts': 'Gerçek bileşenler',
  'boost.rippleIsJustThe':
    'Dalgalanma yalnızca rampadır: bobin üzerinde `ton = D/fsw` boyunca `Vin` varken tepeden tepeye `dIL = Vin·D/(fsw·L)` olur ve bu `Iin` üzerine biner. Bobin için önemli olan tepe değeridir, `Iin + dIL/2`, çünkü çekirdeği doyuran odur. Çıkış dalgalanması, diyot kapalıyken kondansatörün verdiği yükten gelen `Iout·D/(fsw·Cout)` ile akım basamağından gelen `Ipeak·ESR` toplamıdır; gerçek bir tasarımda genellikle ikincisi baskındır.',
  'boost.schottky03To': 'Schottky 0,3 - 0,5 V, silisyum 0,7 V, senkron doğrultucu sıfıra yakın.',
  'boost.scope': 'Osiloskop',
  'boost.switchingFsw': 'Anahtarlama fsw',
  'boost.switchingPeriodsShown': 'Gösterilen anahtarlama çevrimi',
  'boost.switchRdsOn': 'Anahtar Rds(on)',
  'boost.switchRmsDiodeAvg': 'anahtar {iswRms} rms, diyot {iout} ort.',
  'boost.switchVoltageStress': 'Anahtar gerilim zorlanması',
  'boost.theDropsAreFolded':
    "Düşümler sonradan eklenmez, hesabın içine katılır. Diyot düşümü Vd, anahtar düşümü Iin·Rds(on) ve sargı düşümü Iin·DCR ile volt-saniye dengesi, Iin = Iout/(1-D) yerine konduğunda `x = 1-D` cinsinden ikinci dereceden bir denklem verir: `x²(Vout+Vd) - x(Vin + Iout·Ron) + Iout(DCR+Ron) = 0`. Büyük kök gerçek çalışma noktasıdır. Diskriminant negatife düştüğünde hiçbir çözüm yoktur: bu, anahtar düşümü olmadığında Erickson'ın `M_max = 0.5·sqrt(R/R_L)` ifadesine inen `Vout_max = (Vin + Iout·Ron)²/(4·Iout·(DCR+Ron)) - Vd` tavanıdır. Bir yükseltici sonsuz kazanç veremez ve gerçek parçalar onu D 1'e varmadan çok önce durdurur.",
  'boost.theLoadAvgInductor': '{iout} yük, ortalama bobin akımı',
  'boost.theory1':
    'Kararlı durumda bobinin her çevrimde sıfırlanması gerekir, yani içeri konan volt-saniye geri çıkmalıdır: `Vin·D·T = (Vout - Vin)·(1-D)·T`, bu da `D = 1 - Vin/Vout` şeklinde düzenlenir. Çıkış kondansatörünün yük üzerinde buna eşlik eden bir kısıtı vardır: diyot çevrimin yalnızca `(1-D)` kadarında iletir, bu yüzden ortalama bobin akımı `Iin = Iout/(1-D)` olur. Giren güç çıkan güce eşittir, yani gerilimi yükseltmek giriş akımını aynı oranda yükseltir. O akım bobinden, anahtardan ve diyottan geçer; bir yükselticinin parçalarını çıkış değerinin ima ettiğinden çok daha fazla zorlamasının nedeni budur.',
  'boost.theTraceIsNot':
    "İz integralle bulunmaz. Bir anahtarlama çevrimi içinde bobin akımı tam olarak iki doğrudur, bu yüzden osiloskobun istediği örnek aralığında kapalı biçimli köşe noktalarından hesaplanır. fsw'yi ya da L'yi dekatlar boyunca sürüklemek ekrandaki ayrıntıyı değiştirir ama hiçbir şey birikemez ya da ıraksayamaz.",
  'boost.title': 'Boost (Yükseltici) Dönüştürücü',
  'boost.use':
    "İhtiyaç duyulan gerilimin altındaki bir bataryadan bir şey çalıştırmak: 3,7 V'luk lityumdan 5 V'a, ya da iki AA pilden 3,3 V'a çıkmak gibi. Bu sayfanın görünür kıldığı incelik giriş akımıdır; her zaman çıkış akımından yüksektir, bu yüzden neredeyse boşalmış bir hücreden yapılan yükseltme, yeni başlayanların beklediğinden çok daha fazla akım çeker.",
  'boost.valleyIsat': 'vadi {ivalley}, Isat {isat}',
  'boost.voutVdSoRate': 'Vout + Vd, yani anahtarı {vSwitchStress} için seçin',
  'boost.warn1':
    '{vout} çıkışı {vin} girişinin üzerinde değil, bu yüzden yükselticiye iş kalmıyor. Anahtar kapalıyken bobin ve diyot kayıplı bir telden ibarettir ve çıkış, Vin eksi bir diyot düşümünde kalır. Girişin altında bir düşürücü kat kullanın, giriş çıkışı kesiyorsa düşürücü-yükseltici kullanın.',
  'boost.warn2':
    "{ron} seri direnç bu katı {iout} yükte {voutMax} ile sınırlıyor, bu yüzden {vout} hiçbir görev çevriminde ulaşılabilir değil. Tepeden sonra daha fazla görev çevrimi daha az çıkış demektir: bobin yükten o kadar uzun süre kopuk kalır ki fazladan I²R kaybı depolanan fazladan enerjiyi yener. Yükü azaltın, daha düşük DCR'li bir bobin ya da daha iyi bir anahtar kullanın.",
  'boost.warn3':
    "D = {duty}, bu modelin güvenilir olduğu {MAX_PRACTICAL_DUTY} sınırının ötesinde. Diyot çevrim başına yalnızca {toff} iletir, bu yüzden tepe akımları ve I²R kayıpları hızla tırmanır, sağ yarı düzlem sıfırı çevrimin dengelenmesinin zor olduğu bölgeye iner ve çoğu denetleyici görev çevrimini zaten burada sınırlar. Vin'i yükseltin ya da iki katlı veya trafo kuplajlı bir topoloji kullanın.",
  'boost.warn4':
    "{ipeak} tepe akımı {isat} doyum değerinin üzerinde. Doyuma giren bir çekirdek endüktansını yitirir, bu yüzden akım rampası neredeyse dikleşir ve anahtar, bu doğrusal modelin öngörmediği bir sıçrama görür. Yukarıdaki her sayı iyimserdir. Daha büyük bir bobin kullanın, fsw'yi yükseltin ya da daha yüksek Isat'li bir parça seçin.",
  'boost.warn5':
    "Bobin her çevrimde boşalıyor, yani bu kesintili iletimdir ve D = 1 - Vin/Vout artık geçerli değildir. Yukarıdaki görev çevrimi bunun yerine DCM çözümüdür. Çıkış dalgalanması da tepe akımı da CCM formüllerinin söylediğinden kötüdür ve çevrim kazancının biçimi değişir. {ioutBoundary} yükün ya da {lBoundary} endüktansın üzerinde CCM'ye geri döner.",
  'boost.warn6':
    "Dalgalanma, ortalama giriş akımının {rippleRatio} kadarı. Alışılmış hedef %30 - 40'tır: ötesinde tepe akımı, çekirdek kaybı ve çıkış dalgalanması hiçbir kazanç sağlamadan büyür. L'yi ya da fsw'yi yükseltin.",
  'boost.youHave': 'elinizdeki {l}',
  'buck-boost.4Switch': '4 anahtarlı',
  'buck-boost.blurb': 'Tüm giriş aralığında evirici ve dört anahtarlı topolojiler.',
  'buck-boost.capEsr': 'kondansatör {vRippleCap} + esr {vRippleEsr}',
  'buck-boost.cinRippleCurrent': 'Cin dalgalanma akımı',
  'buck-boost.conversionRatio': 'Dönüşüm oranı',
  'buck-boost.coutRippleCurrent': 'Cout dalgalanma akımı',
  'buck-boost.currentHitsZero': 'akım sıfıra iner',
  'buck-boost.designTarget': 'tasarım hedefi',
  'buck-boost.forceBothLegs': 'İki bacağı da zorlayın',
  'buck-boost.inductorAverage': 'Bobin ortalaması',
  'buck-boost.inductorPeak': 'Bobin tepesi',
  'buck-boost.irect': 'Irect',
  'buck-boost.isat': 'Isat {isat}',
  'buck-boost.isw': 'Isw',
  'buck-boost.lAtDcmBoundary': 'DCM sınırındaki L',
  'buck-boost.lede':
    "Giriş çıkışın üstünde de altında da olsa çalışan bir dönüştürücü; bu tam olarak LiPo üzerindeki ESP32 problemidir: hücre 4,2 V'tan 3,0 V'a inerken hat 3,3 V'u tutmalıdır. Osiloskop birkaç anahtarlama periyodu boyunca bobin, anahtar ve doğrultucu akımını gösterir.",
  'buck-boost.lFor40Ripple': '%40 dalgalanma için L',
  'buck-boost.loss': 'kayıp {total}',
  'buck-boost.ofAverage': 'ortalamanın %{rippleRatio} kadarı',
  'buck-boost.outputRippleHasTwo':
    'Çıkış dalgalanmasının aynı anda tepe yapmayan iki bileşeni vardır: kondansatör terimi `dIL/(8·fsw·C)` ve ESR terimi `dIL·ESR`. Seramik çıkış kondansatörlü çoğu gerçek tasarımda ESR terimi küçüktür, ama elektrolitiklerde tamamen baskındır.',
  'buck-boost.rectifierStress': 'Doğrultucu zorlanması',
  'buck-boost.rippleIsDilVl':
    "Dalgalanma `dIL = vL(on)·D/(fsw·L)` ile bulunur. Ortalama akımın %30 - 40'ını hedefleyin: azı hantal bir bobin demektir, fazlası tepeyi doyuma iter ve RMS ısınmasını artırır. Dalgalanma ortalamanın iki katını aştığında akım sıfıra iner ve dönüştürücü kesintili iletime düşer.",
  'buck-boost.rms': 'RMS',
  'buck-boost.switchStress': 'Anahtar zorlanması',
  'buck-boost.theFourSwitchStage':
    "Dört anahtarlı kat, tek bir bobinin çevresine bir düşürücü bacak ile bir yükseltici bacak yerleştirir. Çıkışı pozitif tutar ve daha da önemlisi, Vin Vout'un rahatça üzerindeyken sade bir düşürücü, altındayken sade bir yükseltici gibi çalışır; her iki bacağı yalnızca aradaki dar bantta kullanır. Evrilen kattan çok daha verimli olmasının nedeni budur: tek bacaklı kiplerin her ikisinde de yalnızca bir çift anahtar kıyar.",
  'buck-boost.theory1':
    'Evrilen düşürücü-yükseltici `Vout = -Vin·D/(1-D)` verir, yani görev çevrimi `D = |Vout|/(|Vout| + Vin)` olur. Serbestçe yükseltir ya da düşürür, ama çıkış negatiftir ve hem anahtar hem doğrultucu `Vin + |Vout|` gerilimine dayanmalıdır.',
  'buck-boost.title': 'Buck-Boost Dönüştürücü',
  'buck-boost.use':
    "Klasik tek lityum hücre problemi: hücre 4,2 V'tan 3,0 V'a inerken hat 3,3 V'u tutmak zorundadır, bu yüzden dönüştürücü deşarj boyunca hem düşürmeli hem yükseltmelidir. Ayrıca marşta düşen ve yük atmada sıçrayan 12 V ile araç elektroniğinde kullanılır.",
  'buck-boost.vout': '|Vout|',
  'buck-boost.warn1':
    'Kayıplar bu çıkışı bu yükte ulaşılamaz kılıyor: gereken görev çevrimi katın tutabileceğini aşıyor. Yük akımını azaltın, girişi yükseltin ya da dirençsel kayıpları kesin (daha düşük DCR ve Rds(on)).',
  'buck-boost.warn2':
    "{ilPeak} tepe bobin akımı {isat} doyum değerinin ötesinde. Doyuma giren bir bobin endüktansını yitirir, bu yüzden akım tek bir anahtarlama çevrimi içinde kaçar. Daha büyük bir çekirdek seçin ya da L'yi yükseltin.",
  'buck-boost.warn3':
    "Görev çevrimi, gerçek bir denetleyicinin tutabileceği aralığın dışında. 0 ya da 1'e yakın yerlerde iletim süresi en küçük darbe genişliğine yaklaşır ve çıkış çöker ya da darbe atlar.",
  'buck-boost.warn4':
    'Kesintili iletimde çalışıyor: bobin akımı her çevrimde sıfıra iniyor. Dönüşüm oranı o zaman yalnızca görev çevrimine değil yüke de bağlıdır, bu yüzden yük değiştikçe çıkış kayar ve denetim çevrimi zorlaşır.',
  'buck.blurb': 'Görev çevrimi, bobin dalgalanması, çıkış dalgalanması ve CCM/DCM sınırı.',
  'buck.boundaryAt': '(sınır {boundary})',
  'buck.buckConverterWithA': '{rectifier} kullanan düşürücü dönüştürücü',
  'buck.catchDiode': 'yakalama diyodu',
  'buck.copperResistanceOfThe': 'Sargının bakır direnci, bobin veri sayfasından.',
  'buck.dutyCycleD': 'Görev çevrimi D',
  'buck.efficiencyIsAFirst':
    "Verim bir benzetim değil, birinci derece bir bütçedir: sargıda `Irms²·DCR`, iletim süresine göre ağırlıklandırılmış her FET'te `Irms²·Rds(on)` ya da yakalama diyodu için `Vf·Iout·(1-D)`, artı sert anahtarlama kaybı `0.5·Vin·I·(tr+tf)·fsw` ve denetleyicinin durgun tüketimi. Kapı yükü, çekirdek kaybı, ölü zaman ve serim parazitikleri modellenmez, bu yüzden gerçek kartın birkaç puan aşağıda kalmasını bekleyin.",
  'buck.icap': 'Icap',
  'buck.idealVoutVin': '(ideal Vout/Vin %{dutyIdeal})',
  'buck.inductorRippleIl': 'Bobin dalgalanması ΔIL',
  'buck.inOut': '({pin} giriş, {pout} çıkış)',
  'buck.iout': 'Iout',
  'buck.keepIsatAboveThis': "(Isat'ı bunun üstünde tutun)",
  'buck.lede':
    'Bir anahtarlama periyodu boyunca bobin akımı. Yatay eksen çıkış dalga şekli değil, anahtarlama çevrimi içindeki zamandır, bu yüzden tam bir iz birkaç mikrosaniye genişliğindedir.',
  'buck.lossCatchDiode': 'Kayıp: yakalama diyodu',
  'buck.lossHighSideFet': 'Kayıp: üst taraf FET',
  'buck.lossInductorDcr': 'Kayıp: bobin DCR',
  'buck.lossLowSideFet': 'Kayıp: alt taraf FET',
  'buck.lossSwitching': 'Kayıp: anahtarlama',
  'buck.lost': '({total} kayıp)',
  'buck.lowSideDevice': 'Alt taraf elemanı',
  'buck.ofLoad': '(yükün %{rippleRatio} kadarı)',
  'buck.ofVout': "(Vout'un %{voutRatio} kadarı)",
  'buck.outputRippleVout': 'Çıkış dalgalanması ΔVout',
  'buck.parasitics': 'Parazitik etkiler',
  'buck.period': '(periyot {fsw})',
  'buck.rippleSplitCEsr': 'Dalgalanma payı C / ESR',
  'buck.scalesWithFsw': '(fsw ile ölçeklenir)',
  'buck.schottky': 'Schottky',
  'buck.synchronous': 'Senkron',
  'buck.synchronousFet': 'senkron FET',
  'buck.theory1':
    'Volt-saniye dengesi, bobinin iletim süresinde kazandığı akımı kesim süresinde yitirmesi gerektiğini söyler, yani `Von·D = Voff·(1-D)` ve `D = Voff / (Von + Voff)`. Kayıpsız durumda bu, bildik `D = Vout / Vin` ifadesidir. Bu sayfa anahtar, diyot ve sargı düşümlerini Von ile Voff içinde tutar; bildirilen görev çevriminin ideal orandan biraz yüksek olmasının nedeni budur.',
  'buck.theRampGivesThe':
    'Rampa dalgalanmayı doğrudan verir: `ΔIL = Voff·(1-D) / (fsw·L)`, yani ideal durumda `Vout·(1-D)/(fsw·L)`. Kondansatör bu akımın üçgen kısmını yutar ve yarım üçgenlik yükün integrali `ΔVout = ΔIL / (8·fsw·C)` verir. Gerçek ESR bunun üzerine `ΔIL·ESR` ekler; bir elektrolitikte genellikle ikisinden büyüğü budur.',
  'buck.theTraceIsThe':
    'İz, `di/dt = v/L` denkleminin örnek başına hesaplanan kapalı biçimli parçalı doğrusal çözümüdür, bu yüzden sürgülerin ulaşabildiği her anahtarlama frekansında tam ve dönemsel kalır.',
  'buck.theValleyCurrentIs':
    'Vadi akımı `Iout - ΔIL/2` olduğundan, `Iout = ΔIL/2` noktasında akım tam sıfıra dokunur. Bu sınırın altında dönüştürücü kesintili hale gelir ve görev çevrimi `D = sqrt(2·L·fsw·Iout·Voff / (Von·(Von+Voff)))` ifadesine çöker.',
  'buck.title': 'Buck (Düşürücü) Dönüştürücü',
  'buck.use':
    "Yüksek bir hattı verimli şekilde düşürmek: 12 V'tan 5 V'a, 5 V'tan 3,3 V'a, bataryadan lojiğe. Hemen her ESP32 kartı 3,3 V hattını USB'den böyle üretir. Bobin dalgalanması ve CCM/DCM sınırı, dönüştürücünün sessiz ve uslu mu yoksa gürültülü ve yüke bağımlı mı olduğuna karar verir.",
  'buck.valleyCurrent': 'Vadi akımı',
  'buck.warn1':
    'Düşüm sınırı: Vin, Vout artı anahtar ve sargı düşümlerinin altında ya da onlara eşit. Üst taraf anahtarı %100 görev çevriminde kalır, modellenecek anahtarlama kalmaz ve çıkış yalnızca girişi izler.',
  'buck.warn2':
    "Kesintili iletim: yük {boundary} değerinin altında, bu yüzden bobin akımı her çevrimde sıfıra iniyor. Görev çevrimi artık Vout/Vin oranını izlemez, çevrim kazancı değişir ve diyotlu bir sürüm akım kesildiğinde anahtar düğümünde çınlar. Sınırı aşağı itmek için L'yi ya da fsw'yi yükseltin.",
  'buck.warn3':
    "Dalgalanma, yük akımının %{rippleRatio} kadarı. Alışılmış tasarım hedefi %20 - 40'tır: fazlası bobin boşluğunu harcar ve tepeyi doyuma doğru iter.",
  'capacitor.1090Transition': '%10-90 geçişi',
  'capacitor.2197Tau': '(2,197·tau)',
  'capacitor.at': '{supply} değerinde',
  'capacitor.atT0V': '(t = 0 anında, V/R)',
  'capacitor.bank': 'Banka',
  'capacitor.bankCapacitance': 'Banka kapasitansı',
  'capacitor.bankTopology': 'Banka topolojisi',
  'capacitor.blurb': 'Seri/paralel, depolanan enerji, şarj ve deşarj eğrileri.',
  'capacitor.capacitorsIn': 'Kondansatör bankası şeması',
  'capacitor.charge': 'Şarj',
  'capacitor.chargingACapacitorThrough':
    'Bir kondansatörü direnç üzerinden şarj etmek, R ne kadar büyük ya da küçük olursa olsun o dirençte her zaman `0.5·C·V²` harcar; bu da tam olarak depolanan kadardır. Doğrusal şarjın %50 verimde tavan yapmasının ve anahtarlamalıların var olmasının nedeni budur.',
  'capacitor.chargingThroughRFollows':
    "R üzerinden şarj `v(t) = V·(1 - e^(-t/RC))`, deşarj ise `v(t) = V0·e^(-t/RC)` ile ilerler. İlkinin tersi `t = -R·C·ln(1 - v/V)` verir ve hedefe varış süresi buradan gelir. Bir tau %63,2, iki tau %86,5, beş tau %99,3'tür; hattın kendisi ise eğrinin hiçbir zaman gerçekten dokunmadığı bir asimptottur.",
  'capacitor.curve': 'Eğri',
  'capacitor.direction': 'Yön',
  'capacitor.discharge': 'Deşarj',
  'capacitor.energyAtTarget': 'Hedefteki enerji',
  'capacitor.equalsTheStoredEnergy': '(R ne olursa olsun depolanan enerjiye eşittir)',
  'capacitor.esp32InputHighThreshold':
    "ESP32'nin giriş-yüksek eşiği 3V3 hattında yaklaşık 2,48 V'tur.",
  'capacitor.fullRailOnEvery': '(her eleman üzerinde tam hat gerilimi)',
  'capacitor.highestMemberVoltage': 'En yüksek eleman gerilimi',
  'capacitor.in': '({mode} bağlı {values})',
  'capacitor.inASeriesString':
    'Seri bir dizide gerilim kapasitansla ters orantılı bölünür, `Vi = V·Ctotal/Ci`, yani en küçük kondansatör en çok volta maruz kalır. Kondansatörler daha yüksek çalışma gerilimi için üst üste bindirildiğinde alışılmış arıza biçimi budur.',
  'capacitor.lede':
    'Bir kondansatör grubunu birleştirin, depolanan enerjisini okuyun ve bir dirençten şarj veya deşarj olmasını izleyin. Osiloskop ekseni, anahtarın kapanmasından itibaren geçen zamandır.',
  'capacitor.lossInRPer': "Şarj başına R'deki kayıp",
  'capacitor.neverTargetIsPast': '(hiçbir zaman, hedef asimptotun ötesinde)',
  'capacitor.ofFull': '(tamın %{e} kadarı)',
  'capacitor.settled5Tau': 'Oturdu (5 tau)',
  'capacitor.startingVoltage': 'Başlangıç gerilimi',
  'capacitor.storedCharge': 'Depolanan yük',
  'capacitor.storedEnergy': 'Depolanan enerji',
  'capacitor.storedEnergyIsE':
    'Depolanan enerji `E = 0.5·C·V²`, depolanan yük ise `Q = C·V` ile bulunur. Enerji gerilimin karesiyle değişir, bu yüzden hattın yarısı enerjinin dörtte birini tutar.',
  'capacitor.targetVoltage': 'Hedef gerilim',
  'capacitor.theory1':
    'Paralel kondansatörler plaka alanı ekler, yani `C = C1 + C2 + ...`. Seride her kondansatör aynı yükü taşır ve gerilimler toplanır, yani `1/C = 1/C1 + 1/C2 + ...` olur ve toplam, en küçük elemandan da küçüktür.',
  'capacitor.theScopeSamplesThose':
    "Osiloskop integral almak yerine bu kapalı biçimleri doğrudan örnekler, bu yüzden iz her yakınlaştırmada tamdır ve dt tau'yu aştığında kararsızlaşamaz.",
  'capacitor.thirdCapacitor': 'Üçüncü kondansatör',
  'capacitor.timeToFallTo': 'Hedefe düşme süresi',
  'capacitor.timeToReachTarget': 'Hedefe ulaşma süresi',
  'capacitor.title': 'Kondansatör Hesaplayıcı',
  'capacitor.use':
    'Dekuplaj ve toplu kondansatörleri, zamanlama ağlarını, radyo iletimi gibi ani yükler için enerji depolamasını boyutlandırmak ve güç kesildikten sonra besleme hattının ne kadar dayandığını bulmak. Enerji değeri, bir kondansatörün ESP32 kartını WiFi iletim tepesi boyunca taşıyıp taşıyamayacağını söyleyen şeydir.',
  'capacitor.vAcrossR': 'R üzerindeki V',
  'capacitor.warn1':
    "Ani akım {peakCurrent}, bir ESP32 GPIO'sunun dayandığı {GPIO_MAX_MA} mA sınırının üzerinde. Boş bir kondansatör t = 0 anında kısa devredir, bu yüzden onu daha büyük bir dirençten ya da bir transistörden sürün.",
  'capacitor.warn2':
    'Hedef beslemenin üzerinde, bu yüzden eğri ona hiç ulaşmaz. Hattın üstündeki hiçbir değere pasif bir RC ile erişilemez.',
  'capacitor.warn3':
    'Dizi dengesiz. Seri kondansatörler gerilimi değil yükü paylaşır, bu yüzden en küçük eleman eşit {values} yerine uygulanan {supply} geriliminin {maxMemberVoltage} kadarını üstlenir. Bunu kendi gerilim değeriyle karşılaştırın ya da her kondansatöre paralel dengeleme dirençleri ekleyin.',
  'cat.acPowerQuality': 'AC ve Güç Kalitesi',
  'cat.embeddedEsp32': 'Gömülü / ESP32',
  'cat.energyThermal': 'Enerji ve Isı',
  'cat.filtersSignals': 'Filtreler ve Sinyaller',
  'cat.fundamentals': 'Temeller',
  'cat.pcbWiring': 'PCB ve Kablolama',
  'cat.powerConversion': 'Güç Dönüşümü',
  'cat.semiconductors': 'Yarı İletkenler',
  'cat.sensorsMeasurement': 'Sensörler ve Ölçüm',
  'coil.3v3ByDefaultMost':
    "Varsayılan olarak 3V3. Çoğu röle bobini 5 V ya da 12 V'luk parçalardır.",
  'coil.aFlybackDiodeAcross':
    'Bobine paralel bir geri tepme diyodu, akımın dolaşabileceği bir çevrim sağlar. Anahtar düğümü böylece `Vsupply + Vf` değerinde, yani hat geriliminin bir volttan az üzerinde tutulur. Akım diyot düşümüne karşı serbestçe söner, `i(t) = (I + Vf/R)·e^(-t·R/L) - Vf/R`, ve `t = (L/R)·ln(1 + I·R/Vf)` anında sıfıra ulaşır. İşin püf noktası şu: sade diyotlu bir rölenin yavaş bırakmasının nedeni bu kırpıcıdır. Schottky daha alçak kırpar; zener ya da diyotla seri bir direnç, daha yüksek anahtar gerilimi karşılığında daha hızlı bırakır.',
  'coil.at': '{frequency} değerinde',
  'coil.atTheDriveFrequency':
    'Sürüş frekansında sargı ayrıca `XL = 2·pi·f·L` gösterir, yani bobin empedansı `|Z| = sqrt(R² + XL²)` olur. Bobini bir kez anahtarlamak yerine PWM ile sürdüğünüzde akımı sınırlayan budur.',
  'coil.blurb': 'Akım rampası, depolanan enerji ve bobin anahtarlandığında oluşan ters gerilim.',
  'coil.bothPhasesOfThe':
    "İzin her iki evresi de tam sıfırıncı derece tutma ayrıklaştırmasıyla ilerler, `i[n] = I∞ + (i[n-1] - I∞)·e^(-dt/tau)`; böylece örnekler, ileri Euler'in dt tau'yu geçtiğinde yaptığı gibi çınlamak ya da ıraksamak yerine her adım boyunda analitik eğrinin üzerinde durur.",
  'coil.clampDissipation': 'Kırpıcı güç kaybı',
  'coil.clampedTo': 'Kırpıldığı değer',
  'coil.coil': 'Bobin',
  'coil.coilImpedanceZ': 'Bobin empedansı |Z|',
  'coil.currentSwing': 'Akım salınımı',
  'coil.fallsToZeroEach': '(her çevrimde sıfıra iner)',
  'coil.flybackClamp': 'Geri tepme kırpıcısı',
  'coil.freewheelToZero': 'sıfıra serbest sönüm',
  'coil.howFastTheSwitch': "Anahtarın ne kadar hızlı açıldığı. di/dt'yi tek başına bu belirler.",
  'coil.iCoil': 'I bobin',
  'coil.iNoDiode': 'I diyotsuz',
  'coil.kickUnclamped': 'Kırpılmamış geri tepme',
  'coil.lede':
    'Alçak taraf transistörüyle anahtarlanan bir röle veya solenoid bobini. Osiloskop, anahtarlama çevrimi boyunca bobin akımını zamana karşı çizer. Rampanın çekirdeği doldurmasını, sonra anahtar açıldığında bobinin transistöre ne yaptığını izleyin.',
  'coil.lowSideSwitchedCoil': 'Alt taraftan anahtarlanan bobin',
  'coil.neverReachesZero': '(hiç sıfıra inmez)',
  'coil.noFreewheelPath': 'serbest sönüm yolu yok',
  'coil.nothingFitted': 'hiçbir şey takılı değil',
  'coil.ofIsat': "Isat'ın %{satPercent} kadarı",
  'coil.pastTheRatingOf':
    ', bu da anahtarın {vBreakdown} dayanma geriliminin ötesinde. Transistör çığ kırılmasına girer ve enerjiyi ısı olarak alır, genellikle bir kez.',
  'coil.peak': 'tepe {iPeak}',
  'coil.releaseTime': 'Bırakma süresi',
  'coil.saturationHeadroom': 'Doyum payı',
  'coil.steadyCurrent': 'Kararlı akım',
  'coil.storedEnergyAtPeak': 'Tepede depolanan enerji',
  'coil.supplyVf': 'besleme + Vf ({vf})',
  'coil.switchAndClamp': 'Anahtar ve kırpıcı',
  'coil.switchSees': 'anahtar {vSwitchOpen} görür',
  'coil.switchTurnOff': 'anahtar kapanması',
  'coil.switchVceoRating': 'Anahtar Vceo değeri',
  'coil.thatCurrentIsEnergy':
    "O akım çekirdekteki enerjidir, `E = 0.5·L·I²`. Anahtarı açın, enerjinin gidecek yeri kalmaz ve bobin akımı sürdürecek gerilimi ne ise onu üretir: `Vkick = L·di/dt`. 100 mH üzerinden geçen 44 mA'i bir mikrosaniyede kesin, bu 4 kV'un üzerindedir. Bozulan bobin değil, anahtardır.",
  'coil.thatIsInsideThe':
    '. Bu, burada dayanma geriliminin içinde kalıyor, ama yalnızca bobin küçük olduğu için.',
  'coil.theory1':
    "Anahtarı kapatmak beslemeyi seri bir RL üzerine koyar. Akım sıçrayamaz, bu yüzden rampa yapar: `tau = L/R` zaman sabitiyle `i(t) = (V/R)·(1 - e^(-t·R/L))`. Bir tau sonra yolun %63,2'sini, beş tau sonra %99,3'ünü almıştır; tıpkı bir kondansatörün şarjı gibi, akım ve gerilim yer değiştirmiş olarak.",
  'coil.timeConstantLR': 'Zaman sabiti L/R',
  'coil.title': 'Bobin / Endüktans Simülatörü',
  'coil.turnOffTime': 'Kapanma süresi',
  'coil.use':
    'Röleler, solenoidler, motorlar ve anahtarlamalı dönüştürücüler. Kritik çıktı ters gerilimdir: bir bobinden geçen akımı kesmek, anahtarlamayı yapan transistörü yok eden bir gerilim tepesi üretir. Bu sayfa o tepenin ne kadar büyük olduğunu ve bir geri tepme diyodunun onu neye sınırladığını gösterir; o diyotun neden isteğe bağlı olmadığı da budur.',
  'coil.vVsatR': '(V - Vsat) / R',
  'coil.warn1':
    'Kırpıcı takılı değil. {l} üzerinden geçen {iPeak} akımını {turnOff} içinde kesmek kolektörü {vSwitchOpen} değerine sürer{small} Gerçek kartlar bunu zaten kırpar: bu sayıyı sonlu tutan tek şey sargı kapasitansıdır.',
  'coil.warn2':
    'Kırpılmış olsa bile anahtar {vSwitchClamped} geriliminde kalıyor; bu, {vBreakdown} değerinin üzerinde. Sorun diyot değil, besleme.',
  'coil.warn3':
    "Tepe akım {iSat} doyum noktasının %{satPercent} kadarı. Doyum noktasından sonra endüktans çöker, rampa neredeyse dikleşir ve gerçek akım burada gösterilen her şeyi aşar. Bu model L'yi sabit kabul ettiğinden, izi olduğundan iyimser sayın.",
  'coil.warn4':
    '{iPeak}, bir ESP32 pininin çekebileceği {GPIO_MAX_MA} mA sınırının epey üzerinde. Şemadaki transistör isteğe bağlı değildir, pin yalnızca onun beyzini ya da kapısını sürer.',
  'coil.whereTheCoreGives': "Çekirdeğin pes ettiği ve L'nin çöktüğü nokta.",
  'coil.windingDcr': 'Sargı DCR',
  'coil.windingDissipation': 'Sargı güç kaybı',
  'common.33VIs': '3,3 V ESP32 hattıdır.',
  'common.activeCurrent': 'Etkin akım',
  'common.activeTime': 'Etkin süre',
  'common.actualCurrent': 'Gerçek akım',
  'common.ambient': 'Ortam',
  'common.averageCurrent': 'Ortalama akım',
  'common.bandwidth': 'Bant genişliği',
  'common.battery': 'Batarya',
  'common.bus': 'Veri yolu',
  'common.capacitance': 'Kapasitans',
  'common.capacitor': 'Kondansatör',
  'common.capacity': 'Kapasite',
  'common.capEsr': 'Kondansatör ESR',
  'common.ccm': 'CCM',
  'common.cellsInSeries': 'Seri hücre sayısı',
  'common.circuit': 'Devre',
  'common.components': 'Bileşenler',
  'common.conduction': 'İletim',
  'common.conductionMode': 'İletim kipi',
  'common.continuous': 'sürekli',
  'common.cRate': 'C oranı',
  'common.crossSection': 'Kesit',
  'common.current': 'Akım',
  'common.currentDensity': 'Akım yoğunluğu',
  'common.cutoffFc': 'Kesim fc',
  'common.cyclesShown': 'Gösterilen çevrim',
  'common.dcm': 'DCM',
  'common.dcOffset': 'DC ofset',
  'common.diameter': 'Çap',
  'common.diodeVf': 'Diyot Vf',
  'common.dissipation': 'Güç kaybı',
  'common.divider': 'Bölücü',
  'common.dividerCurrent': 'Bölücü akımı',
  'common.dividerOutput': 'Bölücü çıkışı',
  'common.drive': 'Sürme',
  'common.duty': 'Görev oranı',
  'common.dutyCycle': 'Görev çevrimi',
  'common.dutyRegister': 'Görev çevrimi yazmacı',
  'common.efficiency': 'Verim',
  'common.fetRdsOn': 'FET Rds(on)',
  'common.fFc': 'f / fc',
  'common.filter': 'Süzgeç',
  'common.filterTopology': 'Süzgeç topolojisi',
  'common.frequency': 'Frekans',
  'common.gainAt': '{frequency} frekansında kazanç',
  'common.gateDriveVgs': 'Kapı sürme VGS',
  'common.gauge': 'Kalınlık',
  'common.halfWave': 'Yarım dalga',
  'common.highPass': 'Yüksek geçiren',
  'common.ideal': 'ideal {dutyIdeal}%',
  'common.il': 'IL',
  'common.inductance': 'Endüktans',
  'common.inductor': 'Bobin',
  'common.inductorDcr': 'Bobin DCR',
  'common.inductorRipple': 'Bobin dalgalanması',
  'common.inductorRms': 'Bobin RMS',
  'common.inputCurrent': 'Giriş akımı',
  'common.inputImpedance': 'Giriş empedansı',
  'common.inputVin': 'Giriş Vin',
  'common.inverting': 'Eviren',
  'common.junctionTemp': 'Jonksiyon sıcaklığı',
  'common.load': 'Yük',
  'common.loadCurrent': 'Yük akımı',
  'common.loadResistance': 'Yük direnci',
  'common.loadType': 'Yük tipi',
  'common.lowPass': 'Alçak geçiren',
  'common.mean': 'ortalama',
  'common.method': 'Yöntem',
  'common.mode': 'Kip',
  'common.never': 'hiçbir zaman',
  'common.none': 'yok',
  'common.notBuiltYet': 'Henüz hazır değil.',
  'common.onTime': 'İletim süresi',
  'common.operatingPoint': 'Çalışma noktası',
  'common.output': 'Çıkış',
  'common.outputCap': 'Çıkış kondansatörü',
  'common.outputImpedance': 'Çıkış empedansı',
  'common.outputPower': 'Çıkış gücü',
  'common.outputRipple': 'Çıkış dalgalanması',
  'common.outputSwing': 'Çıkış salınımı',
  'common.outputVout': 'Çıkış Vout',
  'common.packVoltage': 'Paket gerilimi',
  'common.parallel': 'Paralel',
  'common.peakCoilCurrent': 'Tepe bobin akımı',
  'common.peakCurrent': 'Tepe akım',
  'common.peakInductorCurrent': 'Tepe bobin akımı',
  'common.perAdcCount': 'ADC adımı başına',
  'common.period': 'Çevrim',
  'common.periodsShown': 'Gösterilen çevrim',
  'common.phaseShift': 'Faz kayması',
  'common.powerStage': 'Güç katı',
  'common.pullUp': 'Pull-up',
  'common.pulseWidth': 'Darbe genişliği',
  'common.pwm2': 'PWM',
  'common.qFactor': 'Q çarpanı',
  'common.r1Top': 'R1 (üst)',
  'common.r2Bottom': 'R2 (alt)',
  'common.rails': 'Hatlar',
  'common.reactanceXl': 'Reaktans XL',
  'common.resistance': 'Direnç',
  'common.resistor': 'Direnç',
  'common.resolution': 'Çözünürlük',
  'common.resonanceF0': 'Rezonans f0',
  'common.ripple': 'Dalgalanma',
  'common.riseTime': 'Yükselme süresi',
  'common.riseTime1090': 'Yükselme süresi (%10-90)',
  'common.runtime': 'Çalışma süresi',
  'common.saturationCurrent': 'Doyum akımı',
  'common.sensitivity': 'Duyarlılık',
  'common.series': 'Seri',
  'common.seriesResistor': 'Seri direnç',
  'common.seriesRs': 'Seri Rs',
  'common.settlingTo1': "%1'e oturma",
  'common.sine': 'Sinüs',
  'common.sleepCurrent': 'Uyku akımı',
  'common.sleepTime': 'Uyku süresi',
  'common.source': 'Kaynak',
  'common.sourceLoadZ': 'Kaynak yükü |Z|',
  'common.square': 'Kare',
  'common.supply': 'Besleme',
  'common.supplyCurrent': 'Besleme akımı',
  'common.sweep': 'Tarama',
  'common.switchingFreq': 'Anahtarlama frekansı',
  'common.switchingFrequency': 'Anahtarlama frekansı',
  'common.target': 'Hedef',
  'common.thermal': 'Isıl',
  'common.thermalPath': 'Isıl yol',
  'common.timeConstant': 'Zaman sabiti',
  'common.tjMax': 'Maksimum Tj',
  'common.topology': 'Topoloji',
  'common.totalLoss': 'Toplam kayıp',
  'common.triangle': 'Üçgen',
  'common.usableResolution': 'Kullanılabilir çözünürlük',
  'common.useE24': '{value} kullanın (E24)',
  'common.vc': 'Vc',
  'common.vih': 'VIH',
  'common.vin': 'Vin',
  'common.voltageDrop': 'Gerilim düşümü',
  'common.vout': 'Vout',
  'common.white': 'Beyaz',
  'crystal-caps.absoluteError': 'Mutlak hata',
  'crystal-caps.blurb':
    'Kristal veri sayfasından yük kondansatörü seçimi ve bunun yol açtığı frekans kayması.',
  'crystal-caps.board': 'Kart',
  'crystal-caps.c1C2Ideal': 'İdeal C1 = C2',
  'crystal-caps.clockDrift': 'Saat kayması',
  'crystal-caps.crystal': 'Kristal',
  'crystal-caps.forA32768':
    "32,768 kHz'lik bir zaman tutma kristali için 20 ppm, günde yaklaşık 1,7 saniyeye, yılda ise on dakikaya karşılık gelir. Bu önemliyse ya kondansatörleri ince ayarlayın ya da sıcaklık dengelemeli bir modül kullanın. Zaten bir saat kristalinin sıcaklık katsayısı yaklaşık -0,035 ppm/°C² olan parabolik bir eğri izlediğinden, sıcaklık kayması genellikle yük hatasını gölgede bırakır.",
  'crystal-caps.frequencyError': 'Frekans hatası',
  'crystal-caps.lede':
    'Bir kristal, ancak belirli bir kapasitansı gördüğünde üzerinde yazan frekansı tutturacak şekilde kesilir. Yük kondansatörlerini yanlış seçerseniz yine salınır, sadece yanlış frekansta; kayan bir saatin genelde kristal arızası değil kondansatör sorunu olmasının nedeni budur.',
  'crystal-caps.loadActuallySeen': 'Gerçekte görülen yük',
  'crystal-caps.motionalCm': 'Hareketli Cm',
  'crystal-caps.nearestStandard': 'En yakın standart',
  'crystal-caps.sDay': '{secondsPerDay} sn/gün',
  'crystal-caps.shuntC0': 'Şönt C0',
  'crystal-caps.spec': 'belirtilen {clSpec}',
  'crystal-caps.specifiedCl': 'Belirtilen CL',
  'crystal-caps.strayCapacitanceIsNot':
    "Kaçak kapasitans burada yuvarlama hatası değildir. Kısa yollu, küçük bir kılıf için pin başına iki üç pikofarad tipiktir ve 12,5 pF'lik belirtilmiş bir yükün karşısında bu, bütçenin dörtte biridir. Bunu yok saymak, bir tasarımın onlarca ppm hızlı ya da yavaş çalışmasının en yaygın tek nedenidir.",
  'crystal-caps.strayPerPin': 'Pin başına kaçak',
  'crystal-caps.sYear': '{secondsPerDay} sn/yıl',
  'crystal-caps.theory1':
    'Osilatör iki yük kondansatörünü seri görür, üstüne pinlerin ve yolların kattığı her şey eklenir: `CL = C1·C2/(C1+C2) + Cstray`. C1 = C2 olduğunda bu `C1/2 + Cstray` halini alır, yani `C1 = C2 = 2·(CL - Cstray)`.',
  'crystal-caps.thePullFollowsFrom':
    'Çekme, kristalin hareketli kapasitansından kaynaklanır: `df/f = Cm/2 · (1/(C0+CL_actual) - 1/(C0+CL_spec))`. Fazla yük frekansı aşağı, az yük yukarı çeker. Cm, femtofarad mertebesinde son derece küçüktür; bir kristalin zaten kararlı olmasının nedeni tam olarak budur: yükün üzerinde yalnızca zayıf bir tutuşu vardır.',
  'crystal-caps.title': 'Kristal Yük Kondansatörleri',
  'crystal-caps.use':
    'Gerçek zamanlı saatler, radyo frekans referansları ve harici kristalli her mikrodenetleyici. Yük kondansatörleri yanlışsa kristal yine salınır, sadece yanlış frekansta; bu yüzden bir saat ayda dakikalarca kaydığında veya bir radyo bağlantısı ayarlanmadığında cevap genellikle budur.',
  'crystal-caps.warn1':
    'Kaçak kapasitans tek başına belirtilen yükü zaten aşıyor, bu yüzden hiçbir dış kondansatör bunu aşağı çekemez: kristal her zaman yavaş çalışacaktır. Yolları kısaltın, altlarındaki toprak dökümünü kaldırın ya da daha yüksek CL için belirtilmiş bir kristal seçin.',
  'crystal-caps.warn2':
    '{errorPpm} ppm, günde {secondsPerDay} saniyelik bir kaymadır. Bir gerçek zaman saati için bu oldukça fazladır. İdeal değere daha yakın kondansatörler seçin ya da birinde ince ayar yapın.',
  'current-divider.025WAxial': 'Eksenel için 0,25 W, 0805 için 0,125 W.',
  'current-divider.acrossRs': '(Rs üzerinde {voltage})',
  'current-divider.blurb': 'Paralel kollardan geçen akımlar.',
  'current-divider.branchCount': 'Kol sayısı',
  'current-divider.branches': 'Kollar',
  'current-divider.currentSource': 'Akım kaynağı',
  'current-divider.dissipationIsPxIx':
    'Güç kaybı `Px = Ix²·Rx` olur ve kol güçlerinin toplamı `V·Itotal` eder. Hat kipinde kaynak `Rs + Req` görür, yani `Itotal = Vs / (Rs + Req)` olur ve kalan gerilimi Rs üstlenir.',
  'current-divider.equivalentR': 'Eşdeğer R',
  'current-divider.lede':
    'Paralel kollar aynı düğüm gerilimini paylaşır, bu yüzden akım dirence göre değil iletkenliğe göre bölünür. Çubuk, her kolun toplamdaki payını gösterir.',
  'current-divider.nodeVoltage': 'Düğüm gerilimi',
  'current-divider.overOneGpio': '(tek bir GPIO üzerinden)',
  'current-divider.parallelBranchNetwork': 'Paralel kollu devre',
  'current-divider.railRs': 'Hat + Rs',
  'current-divider.rCurrent': 'R{i} akımı',
  'current-divider.resistorRating': 'Direnç gücü',
  'current-divider.supplyVs': 'Besleme Vs',
  'current-divider.theNodeSitsAt':
    'Düğüm `V = Itotal·Req` değerinde durur, bu yüzden her kol `Ix = V/Rx = Itotal·Gx / sum(G)` taşır. En düşük dirençli kol en çok akımı alır; bu, gerilim bölücü sezgisinin tam tersidir. İki kol için bu, üstte diğer direncin olduğu `I1 = Itotal·R2 / (R1 + R2)` ifadesine indirgenir.',
  'current-divider.theory1':
    'Paralel kollar tek bir düğüm çiftini paylaşır, bu yüzden hepsi aynı gerilimi görür. İletkenlikler toplanır: `G = 1/R`, `Req = 1 / sum(G)`. Req her zaman en küçük koldan da küçüktür, yani bir yol eklemek yükü ancak ağırlaştırabilir.',
  'current-divider.title': 'Akım Bölücü',
  'current-divider.totalCurrent': 'Toplam akım',
  'current-divider.totalPower': 'Toplam güç',
  'current-divider.use':
    'Akımın paralel kollar arasında nasıl bölündüğünü bulmak: gücü paylaşan paralel dirençler, tek dirence tedbirsizce paralellenmiş LEDler ve toprak düzlemindeki çoklu dönüş yolları. Ayrıca dengeleme olmadan paralellenen bataryaların veya regülatörlerin neden birinin tüm yükü üstlenmesine yol açtığının da modelidir.',
  'current-divider.warn1':
    "Toplam çekiş {total}; bu, bir ESP32 pininin verebileceği ya da çekebileceği {GPIO_MAX_MA} mA sınırının ötesinde. Grubu doğrudan bir GPIO'dan değil, hattan bir MOSFET ya da sürücü üzerinden besleyin.",
  'current-divider.warn2':
    '{hot}, {rating} değerinin üzerinde. Daha büyük bir parça seçin ya da kol direncini yükseltin.',
  'current-divider.warn3':
    'İdeal bir akım kaynağı her yüke {total} verir, bu yüzden düğüm {voltage} değerinde kalır. Gerçek bir 3V3 besleme bu gerilime ulaşamaz: devrenin gerçekte ne yaptığını görmek için hat artı Rs kipine geçin.',
  'current-sense.acrossTheInternal0': 'içteki 0,1 Ω üzerinde',
  'current-sense.adcRangeUsed': 'Kullanılan ADC aralığı',
  'current-sense.amplifierGain': 'Yükselteç kazancı',
  'current-sense.atThisShunt': 'bu şöntte',
  'current-sense.blurb':
    'Yük payı gerilimine karşı şönt boyutlandırma, ayrıca ACS712 ve INA219 çözünürlüğü.',
  'current-sense.burden': 'yük payı',
  'current-sense.burden2': 'Yük payı',
  'current-sense.currentResolution': 'Akım çözünürlüğü',
  'current-sense.digitalI2c': 'sayısal, I2C',
  'current-sense.dissipationIsIR':
    "Güç kaybı `I²·R` olur ve akımın karesiyle yükselir, yani 1 A için rahatça seçilmiş bir şönt 10 A'de ısıtıcıya döner. Daha kötüsü, ısı direnci değiştirir, bu yüzden yük arttıkça ölçüm kayar: hassas şöntlerin düşük sıcaklık katsayılı alaşımlar ve dört telli bağlantı kullanmasının nedeni budur.",
  'current-sense.hallEffectPartsLike':
    'ACS712 gibi Hall etkili parçalar manyetik alanı ölçerek yük payını tamamen ortadan kaldırır ve tam yalıtım sağlar. Bedeli ise ofset kayması, gürültü ve beslemenin yarısında duran bir sıfır noktasıdır; bu yüzden amperler için iyi, miliamperler için kötüdürler.',
  'current-sense.lede':
    "Akımı ölçmek, beslemeden fazla pay çalmadan onu ADC'nin okuyabileceği bir gerilime çevirmek demektir. Şönt, yük payı gerilimi, güç kaybı ve çözünürlük arasında bir uzlaşmadır.",
  'current-sense.ofTheSupply': 'beslemenin',
  'current-sense.outputToAdc': "ADC'ye çıkış",
  'current-sense.perLsbOnThe': "şönt ADC'sinde LSB başına",
  'current-sense.sensor': 'Algılayıcı',
  'current-sense.sensorRange': 'Algılayıcı aralığı',
  'current-sense.shuntFrontEnd': 'Şönt ön katı',
  'current-sense.shuntPower': 'Şönt gücü',
  'current-sense.shuntResistance': 'Şönt direnci',
  'current-sense.shuntVoltage': 'Şönt gerilimi',
  'current-sense.supplyBeingMeasured': 'Ölçülen besleme',
  'current-sense.theory1':
    "Bir şönt, Ohm yasasıyla akımı gerilime çevirir: `Vshunt = I·R`. Bu gerilim yüke ulaşan beslemeden düşülür, yük payı budur. Hattın yüzde bir ikisinin altında tutulmalıdır; örneğin 5 V'luk bir beslemede yük payının 50 mV'un epeyce altında kalması istenir.",
  'current-sense.theResolutionYouActually':
    'Gerçekte elde ettiğiniz çözünürlük, girişe indirgenmiş bir ADC adımıdır: `Vlsb / (R·gain)`. Sizi yük payı ile çözünürlük arasındaki kıskaçtan kurtaran şey kazançtır: küçük bir şönt yük payını düşük tutar, yükselteç de işareti geri kazanır. Özel bir akım algılama yükseltecinin yaptığı tam olarak budur; ayrıca şöntün toprak yerine besleme potansiyelinde durduğu üst taraf algılamadaki ortak kip sorununu da çözer.',
  'current-sense.title': 'Akım Ölçümü',
  'current-sense.use':
    'Batarya izleme, motor akım sınırlama, güç ölçümü ve aşırı akım koruması. Tasarım; yük payı gerilimi, şönt güç kaybı ve çözünürlük arasında üç yönlü bir uzlaşmadır ve bu sayfa, küçük şöntlü özel bir akım ölçüm yükseltecinin doğrudan okunan büyük bir şöntü neden yendiğini gösterir.',
  'current-sense.warn1':
    '{vOut}, {FULL_SCALE} ADC tam ölçeğinin ötesinde; bu yüzden okuma en üst değere çakılır ve aralığın tepesini tamamen yitirirsiniz. Kazancı ya da şöntü küçültün.',
  'current-sense.warn2':
    'ADC aralığının yalnızca %{rangeUsed} kadarı kullanılıyor, yani çeviricinin çözünürlüğünün çoğu boşa gidiyor. Tam ölçek akımı aralığın tepesine yaklaşana kadar kazancı yükseltin.',
  'current-sense.warn3':
    'Şönt üzerindeki {pShunt} kayda değer bir ısıdır ve direncin kendi sıcaklık katsayısı bu durumda okumayı kaydırır. Daha düşük değerli bir şönt kullanıp kazancı artırın ya da düzgün bir 4 telli algılama direnci tercih edin.',
  'current-sense.warn4':
    "ACS712, orta hat sıfır noktalı 5 V'luk bir parçadır, yani durgun çıkışı yaklaşık 2,5 V'tur ve bu bir ESP32 pininin dayanabileceğinin epey üzerindedir. Bir gerilim bölücüye ya da 3,3 V uyumlu bir alternatife ihtiyaç duyar. Gürültü tabanı da onu birkaç yüz miliamperin altında zayıf kılar.",
  'current-sense.zeroCurrentOutput': 'Sıfır akım çıkışı',
  'debounce.blurb': 'Ölçülen sıçrama süresinden RC ve Schmitt tetikleyici debounce boyutlandırma.',
  'debounce.bounceDuration': 'Sekme süresi',
  'debounce.bounceIs': 'sekme {bounceMs}',
  'debounce.contactCurrent': 'Kontak akımı',
  'debounce.fallToVil': "VIL'ye düşme",
  'debounce.filtered': 'süzülmüş',
  'debounce.glitchesRejectedUpTo': 'Şuna kadar gürültü elenir',
  'debounce.lede':
    'Mekanik bir kontak bir kez kapanmaz, birkaç milisaniye boyunca seker. Osiloskop, ham kontağı, RC ile süzülmüş düğümü ve girişin lojik yüksek eşiğini birlikte gösterir: süzgeç, geri dönmeden tüm sekme boyunca dayanmalıdır.',
  'debounce.logicSupply': 'Mantık beslemesi',
  'debounce.maximumPressRate': 'En yüksek basış hızı',
  'debounce.noteTheAsymmetryOn':
    "İzdeki asimetriye dikkat edin: anahtarı kapatmak kondansatörü doğrudan toprağa kısa devre eder, bu yüzden düşüş neredeyse anlıktır; açmak ise C'yi R üzerinden şarj etmek zorundadır. Gerçekte yalnızca yükselen kenar süzülür; basışta sorunsuz görünen bir debounce devresinin bırakışta hâlâ sekebilmesinin nedeni budur.",
  'debounce.ofVcc': "Vcc'nin %{VIH_FRAC} kadarı",
  'debounce.ofVcc2': "Vcc'nin %{VIL_FRAC} kadarı",
  'debounce.pressesPerSecond': 'Saniyedeki basış',
  'debounce.raw': 'ham',
  'debounce.riseToVih': "VIH'ye yükselme",
  'debounce.switchAndInput': 'Anahtar ve giriş',
  'debounce.theDesignHasTwo':
    "Tasarımın iki yüzü var. Çok hızlıysa sekme geçer. Çok yavaşsa düğmeye hızlı basamazsınız ve yavaş kenar, Schmitt tetiklemesi olmayan bir girişin salınabileceği VIL ile VIH arasındaki yasak bölgede uzun süre kalır. Burada Schmitt girişi istemenizin nedeni tam olarak budur ve ESP32 GPIO'larında bu zaten vardır.",
  'debounce.theory1':
    'Kontaklar yaylı oldukları için seker. Hareketli kontak sabit olana çarpar ve geri teper; tipik bir dokunmatik anahtarda kabaca 1-10 ms boyunca birkaç kez kapanıp açılır, daha büyük kollarda ve rölelerde bu süre daha uzundur.',
  'debounce.theRcFilterTurns':
    'RC süzgeci her kısa açılmayı, tam hattan hatta bir geçiş yerine küçük bir üstel salınıma çevirir. Düğüm ancak VIH eşiğini geçtiğinde yüksek sayılır; ESP32 için bu, beslemenin yaklaşık %{VIH_FRAC} kadarıdır ve bu da `t = -R·C·ln(1 - VIH/Vcc)`, yani 1,386 zaman sabiti sürer.',
  'debounce.title': 'Buton Debounce RC',
  'debounce.use':
    'Bir mikrodenetleyici tarafından okunan her mekanik buton, anahtar veya röle kontağı. Kontaklar her basışta milisaniyelerce zıplar, bu yüzden naif bir okuma tek basışı birkaç kez sayar. Bu sayfa, süzgeci sıçramayı aşacak kadar yavaş ama gerçek basışları kaçırmayacak kadar hızlı olacak şekilde boyutlandırır.',
  'debounce.warn1':
    "Süzgeç {tRise} içinde oturuyor; bu, {bounceMs}'lik sekmeden daha hızlı, yani gürültü hâlâ pine ulaşıyor. Yükselme süresi sekme süresini rahatça aşana kadar R'yi ya da C'yi büyütün.",
  'debounce.warn2':
    '{maxRate} hızında süzgeç, saniyede {pressRate} basışı izleyemez. Gerçek basışlar birleşecek ya da tümüyle kaçırılacaktır.',
  'debounce.warn3':
    "Kontaktan yalnızca {contactCurrent} geçiyor. Yaklaşık 100 µA'in altında kuru anahtarlama, kontak yüzeylerinde oksit birikmesine izin verir ve sonunda anahtarın büsbütün çalışmamasına yol açar. Anahtar mekanikse R'yi küçültün.",
  'debounce.wetsTheContact': 'kontağı ıslatır',
  'debounce.youWantHz': 'istenen {pressRate} Hz',
  'deep-sleep.asleep': 'Uykuda',
  'deep-sleep.awake': 'Uyanık',
  'deep-sleep.blurb':
    'Görev çevrimli uyanma profilinden ortalama akım ve aylarca süren çalışma ömrü.',
  'deep-sleep.chargePerWake': 'Uyanış başına yük',
  'deep-sleep.consumption': 'Tüketim',
  'deep-sleep.cyclePeriod': 'Çevrim süresi',
  'deep-sleep.days': '{runtimeDays} gün',
  'deep-sleep.energyPerWake': 'Uyanış başına enerji',
  'deep-sleep.lede':
    'Bataryayla çalışan bir düğüm, tepe akımına değil ortalama akımına göre yaşar ya da ölür. Osiloskop, doğrusal zaman ekseninde bir uyanma/uyku çevrimi boyunca akım profilini, ortaya çıkan ortalamayla birlikte gösterir.',
  'deep-sleep.sleepShareOfBudget': 'Bütçedeki uyku payı',
  'deep-sleep.theConsequenceIsUnintuitive':
    "Sonuç sezgiye aykırıdır. Her saat 3 saniye boyunca 80 mA çeken bir ESP32 ortalama yaklaşık 77 µA çeker, yani 2 Ah'lik bir hücre iki yıldan uzun dayanır. Aynı yonga uyanık bırakılsa onu bir günde bitirirdi. Derin uyku bir iyileştirme değil, tasarımın kendisidir.",
  'deep-sleep.theory1':
    'Ortalama akım, bir çevrim boyunca zamanla ağırlıklı ortalamadır: `Iavg = (Ion·ton + Isleep·tsleep) / (ton + tsleep)`. Çalışma süresi, kullanılabilir kapasitenin buna bölümüdür. Başka hiçbir şey önemli değildir: tepe akım yalnızca beslemenin bunu sağlayıp sağlayamayacağını etkiler, paketin ne kadar dayanacağını değil.',
  'deep-sleep.theUsableFractionIs':
    'Kullanılabilir oran burada gerçek iş görür. Anma kapasitesi, oda sıcaklığında düşük bir kesime kadar yavaş bir deşarj varsayar ve sahada bunların hiçbiri geçerli değildir. %80 üzerinden planlamak olağandır, soğukta ise daha da azı.',
  'deep-sleep.title': 'Derin Uyku Batarya Ömrü',
  'deep-sleep.usableFraction': 'Kullanılabilir oran',
  'deep-sleep.use':
    'Bataryayla çalışan her ESP32 düğümü: sunucuya rapor veren sensörler, takip cihazları, uzak izleyiciler. Batarya ömrünü belirleyen tek değer ortalama akımdır ve bu sayfa, uyku akımının neden genellikle uyanma süresinden çok daha önemli olduğunu gösterir. Ayrıca paketi gerçekte tüketen şeyin sürekli bağlı bir bölücü veya kaçaklı bir regülatör olduğunu böyle keşfedersiniz.',
  'deep-sleep.wakeCycles': 'Uyanış çevrimi',
  'deep-sleep.warn1':
    "Uyku akımı bütçenin %{sleepShare} kadarı, yani uyanık evreyi iyileştirmek size neredeyse hiçbir şey kazandırmaz. Bunun yerine bekleme tüketimine yüklenin: bir doğrusal regülatörün durgun akımı, sürekli bağlı bir bölücü ya da açık bırakılmış bir çevre birimi alışılmış suçlulardır ve her biri ESP32'nin kendi 10 µA'lik akımını gölgede bırakabilir.",
  'deep-sleep.warn2':
    "Yaklaşık 150 mA'in üzerinde neredeyse kesinlikle verici çalışıyordur. WiFi'ye bağlanmak iletimin kendisinden çok daha fazla enerji harcar, bu yüzden birkaç ölçümü tek uyanışta toplamak, her uyanışı kısaltmaktan genellikle daha çok kazandırır.",
  'deep-sleep.whDay': '{whPerDay} Wh/gün',
  'deep-sleep.whichTermDominatesDecides':
    'Hangi terimin baskın olduğu, çabanın nereye harcanacağını belirler. Uyku evresi ortalamanın çoğunu taşımaya başladıktan sonra uyanık süreyi kısaltmak boşa emektir ve hedef bekleme sızıntısı olur: regülatör durgun akımı, pull-up ve bölücü ağları ve açık kalan algılayıcılar.',
  'deep-sleep.years': '{runtimeDays} yıl',
  'e-series.101HalfStep': '(10^(1/{steps}), yarım adım {halfStep})',
  'e-series.against': '{error}, tek parçanın {singleError} değerine karşı',
  'e-series.bestOfTheThree': 'Üçünün en iyisi',
  'e-series.blurb':
    'Herhangi bir hedef için en yakın E12/E24/E96 değeri ve iki dirençli kombinasyonlar.',
  'e-series.e48AndE96Are':
    "E48 ve E96 tam olarak bu yuvarlamadır. E6, E12 ve E24 değildir: IEC 60063, aritmetiğin 26,1, 31,6, 38,3, 46,4 ve 82,5 verdiği yerlerde tarihsel 27, 33, 39, 47 ve 82 değerlerini korur. E24'te sınıfı yalnızca %5 iken %7,1'lik bir 13-15 boşluğu olmasının nedeni budur.",
  'e-series.eSeries': 'E serisi',
  'e-series.lede':
    'Hesap makineleri size 26,36 kΩ gibi sayılar verir ama piyasada böyle bir değer bulunmaz. Bu sayfa en yakın tercih edilen değeri ve daha da yaklaştıran iki dirençli çiftleri seçer.',
  'e-series.mantissas': '{series} mantisleri: `{mantissas}`',
  'e-series.nearestStandardValue': 'En yakın standart değer',
  'e-series.neighbours': 'Komşular',
  'e-series.noPairBeatsThe': 'hiçbir çift tek parçayı geçemiyor',
  'e-series.pair': 'çift',
  'e-series.pairsAreSearchedOver':
    'Çiftler, 1 Ω ile 10 MΩ arasındaki tablonun tamamında aranır. Hem `a + b` hem de `a·b / (a + b)`, b arttıkça tekdüze biçimde artar; bu yüzden her a için en iyi eş, tam değere en yakın tablo girdisidir ve bu da aramayı tüm çiftleri denemek yerine her aday için ikili aramaya dönüştürür. Parçalar birbirinin {maxRatio} katı içinde tutulur: bu sınırın ötesinde küçük parça, sonucu büyük parçanın kendi toleransından daha az düzeltir, yani çift kullanmak bir kurgudan ibaret kalır.',
  'e-series.preferredSeries': 'Tercih edilen seri',
  'e-series.singlePart': 'tek parça',
  'e-series.stepRatio': 'Adım oranı',
  'e-series.targetCovered': '(hedef kapsam içinde)',
  'e-series.targetOutside': '(hedef kapsam dışında)',
  'e-series.theory1':
    "Tercih edilen bir seri her dekadı N logaritmik adıma böler; böylece `k = 0..N-1` için `value = 10^(k/N)` olur ve E6, E12, E24'te iki, E48 ile E96'da üç anlamlı basamağa yuvarlanır. Her adım sabit bir `10^(1/N)` oranıdır; aynı mantislerin ohmdan megaohma tekrarlanmasının nedeni de budur. Hedefe göre hata `(Rstd - Rtarget) / Rtarget` ile hesaplanır.",
  'e-series.theToleranceGradesExist':
    "Tolerans sınıfları bu boşlukları kapatmak içindir. En kötü hedef, bir `[a, b]` boşluğunun tam ortasında durur ve her iki komşusuna da `(b - a) / (b + a)` kadar hatayla uzaktır: E6'da bu tam olarak %20'dir, yani %20 toleranslı bir parça onu her zaman kapsar. Her ince sınıf küçük bir aralığı açık bırakır; E24'te en kötü durum %5'lik bir parçaya karşı %7,1'dir, yani bazı hedefler hangi parçayı alırsanız alın iki parçanın arasında kalır. Tolerans bandı göstergesinin denetlediği şey tam olarak budur.",
  'e-series.title': 'Standart Direnç Değerleri',
  'e-series.toleranceBandAt': '{tolerance} toleransındaki bant',
  'e-series.twoInParallel': 'Paralel iki adet',
  'e-series.twoInSeries': 'Seri iki adet',
  'e-series.typeTheRawNumber': 'Bölücünüzün ya da akım sınırınızın istediği ham sayıyı yazın.',
  'e-series.use':
    'Formülünüzün ürettiği direnç değerini satın alamazsınız. Bu sayfa hesaplanan değeri satın alınabilir bir değere çevirir, kabul ettiğiniz hatayı gösterir ve tek bir standart değer yeterince yakın olmadığında iki dirençli kombinasyonlar bulur; bu da hassas bölücüler ve kazanç ayarlayan ağlar için önem taşır.',
  'e-series.warn1':
    '{target}, burada taranan 1 Ω ile 10 MΩ aralığının dışında; bu yüzden yukarıdaki yanıtlar dışa uyarlanmak yerine tablonun ucuna sabitlendi. Gerçek stok bu aralığın ötesine gider ama bir bölücüye koyacağınız türden değil.',
  'e-series.warn2':
    'Hiçbir {series} parçası {target} değerini kapsamıyor: {tolerance} sınıfında bile {single}, yalnızca {bandLow} ile {bandHigh} arasına ulaşır. Bir çift kullanın, daha ince bir seriye geçin ya da serinin gerçekten sahip olduğu bir değere göre yeniden tasarlayın.',
  'e-series.widestGapInsideThe': '(en geniş boşluk, {tolerance} sınıfının içinde)',
  'e-series.widestGapPastThe': '(en geniş boşluk, {tolerance} sınıfının ötesinde)',
  'e-series.worstCaseFor': '{series} için en kötü durum',
  'esp32-adc.aBatteryAboveThe':
    "Kullanılabilir üst sınırın üzerindeki bir pil bölücü gerektirir, `Vadc = Vbat·R2/(R1+R2)`. İkiye bölmek, pile göre çözünürlüğün yarısına mal olur: her adım artık `2·Vlsb` değerindedir. Bu genellikle sorun yaratmaz, çünkü bir LiPo'nun tüm kullanışlı aralığı 1,2 V'tur ve yarılansa bile bu 600 adımın üzerindedir.",
  'esp32-adc.adcAtEmptyBattery': 'Pil boşken ADC',
  'esp32-adc.adcAtFullBattery': 'Pil doluyken ADC',
  'esp32-adc.attenuation': 'Zayıflatma',
  'esp32-adc.bits': '{ADC_BITS} bit',
  'esp32-adc.blurb':
    'Zayıflatma aralıkları, batarya ölçümü için bölücü tasarımı, etkin çözünürlük.',
  'esp32-adc.converter': 'Dönüştürücü',
  'esp32-adc.countAtFull': 'Doluda adım sayısı',
  'esp32-adc.dividerDrain': 'Bölücü tüketimi',
  'esp32-adc.drainPerDay': 'Günlük tüketim',
  'esp32-adc.emptyVoltage': 'Boşken gerilim',
  'esp32-adc.evenDoneCorrectlyThis':
    "Doğru yapılsa bile bu ADC hassas değildir. Belirgin bir ofset ve kazanç hatası vardır, parçadan parçaya değişir ve sıcaklıkla kayar. esp_adc_cal ile gelen fabrika kalibrasyonunu kullanın, çok sayıda örneğin ortalamasını alın ve yaklaşık %1'den iyi bir sonuç beklemeyin.",
  'esp32-adc.fullScale': 'Tam ölçek',
  'esp32-adc.fullVoltage': 'Doluyken gerilim',
  'esp32-adc.lede':
    "Paketi tüketmeden ADC'nin kullanılabilir penceresine oturan bir batarya ölçüm bölücüsü tasarlayın. ESP32 ADC'si nominal aralığının yalnızca bir bölümünde doğrusaldır ve girişi makul ölçüde düşük empedanslı bir kaynak ister.",
  'esp32-adc.perCount': 'adım başına',
  'esp32-adc.resolutionAtBattery': 'Pildeki çözünürlük',
  'esp32-adc.sourceImpedance': 'Kaynak empedansı',
  'esp32-adc.theory1':
    "ESP32 ADC'si 12 bittir, yani tam ölçek 4096 adıma bölünür. Önündeki zayıflatıcı, tam ölçeğin ne anlama geldiğini belirler: 0 dB yaklaşık 1,1 V, 11 dB ise yaklaşık 3,9 V verir. Her aralığın yalnızca bir bölümü doğrusaldır; kullanılabilir pencerenin anma değerinden daha dar olmasının nedeni de budur.",
  'esp32-adc.theTensionIsDrain':
    "Buradaki gerilim, tüketim ile empedans arasındaki çekişmedir. Bölücü sürekli bağlı olduğundan, 4,2 V üzerindeki 100 kΩ artı 100 kΩ sürekli 21 µA harcar; bu, derin uykudaki bir ESP32'den bile fazladır. Megaohmlara çıkmak bunu düzeltir ama girişi bir örnekleme kondansatörünü doldurmak zorunda olan ADC'yi bozar. Alışılmış çözümler, bölücüyü yalnızca ölçüm sırasında devreye alan bir MOSFET ya da alt bacağa paralel bağlanan bir kondansatördür.",
  'esp32-adc.title': 'ESP32 ADC / VBAT Ölçümü',
  'esp32-adc.usableToV': 'kullanılabilir {usableLow} - {usableHigh} V',
  'esp32-adc.use':
    'ESP32 üzerinde pil seviyesi, potansiyometre ya da herhangi bir analog sensör okumak. Önemlidir çünkü ADC yalnızca aralığının bir bölümünde doğrusaldır; bu yüzden kullanılabilir pencerenin dışına düşen bir bölücü, tam da doğruluğa ihtiyaç duyduğunuz yerde sıkışık ya da düz okur. Ayrıca yüksek empedanslı bir bölücü, sessizce örnekleme hızına bağlı okumalar verir.',
  'esp32-adc.voltsPerLsb': 'LSB başına volt',
  'esp32-adc.warn1':
    "{vAdcMax}, bu zayıflatmanın doğrusal kaldığı {usableHigh} V sınırının üzerinde. Okumalar tam şarja yakın önce sıkışır sonra kırpılır; oysa doğruluğu en çok istediğiniz nokta tam orasıdır. R1'i büyütün ya da daha yüksek bir zayıflatma seçin.",
  'esp32-adc.warn2':
    "{vAdcMin}, {usableLow} V alt sınırının altında. ESP32 ADC'si sıfıra yakın bölgede ciddi biçimde doğrusal değildir ve orada tamamen düz bir değer okur.",
  'esp32-adc.warn3':
    "{sourceImpedance} kaynak empedansı, önerilen {ADC_MAX_SOURCE_Z} değerinin üzerinde. Örnekle ve tut kondansatörü zamanında dolamaz; bu yüzden okumalar düşük çıkar ve örnekleme hızına bağlı kalır. Bölücü dirençlerini küçültün ya da yük deposu görevi görmesi için R2'ye paralel bir 100 nF kondansatör ekleyin.",
  'harmonics.aboveTheSupplyRail': 'besleme hattının üzerine',
  'harmonics.activeTopIsH': '({active} etkin, en üst H{top})',
  'harmonics.asAShareOf': '(toplam etkin değerin oranı olarak)',
  'harmonics.below0V': "0 V'un altına",
  'harmonics.below0VAnd': "0 V'un altına ve besleme hattının üzerine",
  'harmonics.blurb':
    'Kare, üçgen ve bozulmuş dalga şekilleri oluşturmak için harmonik ekleyin. THD göstergesi.',
  'harmonics.byParsevalTheRms':
    'Parseval teoremine göre etkin değer `sqrt(sum Vn² / 2)` olur ve yalnızca genliklere bağlıdır, faza hiç bağlı değildir. Tepe değer ise faza bağlıdır, dolayısıyla tepe çarpanı da bağlıdır: bir testere dalgasında faz anahtarını çevirin, etkin değer kıpırdamaz.',
  'harmonics.crestFactor': 'Tepe çarpanı',
  'harmonics.dc': '(DC {dc})',
  'harmonics.distortionIsTheEnergy':
    "Bozulma, temel bileşen olmayan enerjidir: `THD = sqrt(V2² + V3² + ... ) / V1`. İdeal bir kare dalga %48,3, üçgen dalga ise %12,1'dir. On terim bu değere ancak kısmen yaklaşır. THD-R bunun yerine toplam etkin değere böler, bu yüzden hiçbir zaman %100'ü aşamaz; bir ölçü aletinin gösterdiği değer de budur.",
  'harmonics.forceEveryPhaseTo': 'Tüm fazları 0 yap',
  'harmonics.fourierSeriesPreset': 'Fourier serisi ön ayarı',
  'harmonics.frequencyF0': 'Frekans f0',
  'harmonics.fundamental': 'Temel bileşen',
  'harmonics.h1Fundamental': 'H1 temel bileşen',
  'harmonics.harmonicAmplitudes': 'Harmonik genlikleri',
  'harmonics.ideal': 'İdeal',
  'harmonics.lede':
    'Her biri tek bir temel bileşenin tam katı olan en fazla on sinüs dalgası ekleyin ve toplamın şekillenmesini izleyin. Yatay eksen zamandır.',
  'harmonics.noFundamentalToCompare': '(karşılaştırılacak temel bileşen yok)',
  'harmonics.occupiedBandwidth': 'Kapladığı bant genişliği',
  'harmonics.ofHarmonics2To': '(2 - 10. harmoniklerden {distortion})',
  'harmonics.peak': '(tepe {peakAc})',
  'harmonics.peakToPeak': 'Tepeden tepeye',
  'harmonics.railHeadroom': '(hat payı {headroom})',
  'harmonics.rmsAcOnly': 'RMS, yalnızca AC',
  'harmonics.rmsWithDc': 'RMS, DC dahil',
  'harmonics.saw': 'Testere',
  'harmonics.sine1414Triangle': '(sinüs 1,414, üçgen 1,732)',
  'harmonics.sum': 'Toplam',
  'harmonics.swing': 'Salınım',
  'harmonics.thd': 'THD',
  'harmonics.thdR': 'THD-R',
  'harmonics.theory1':
    'Her dönemsel dalga şekli, tek bir temel bileşenin tam katlarındaki sinüslerin toplamıdır: `v(t) = Vdc + sum Vn·sin(2·pi·n·f0·t + phi_n)`. Her sürgü bir Vn değerini belirler. Osiloskop bu toplamı doğrudan hesaplar; dolayısıyla ne bir çözücüye ne de adım boyu sınırına ihtiyaç vardır.',
  'harmonics.thePresetsAreThe':
    "Ön ayarlar klasik serilerdir. Kare dalga, hepsi aynı fazda `1/n` genlikli tek harmoniklerdir; testere dalgası, işareti dönüşümlü `1/n` genlikli her harmoniktir; üçgen dalga ise işareti dönüşümlü `1/n²` genlikli tek harmoniklerdir. İdeal tepe değerleri `V1·pi/4`, `V1·pi/2` ve `V1·pi²/8`'dir; kehribar renkli iz de bunu gösterir.",
  'harmonics.title': 'Harmonik Sentezleyici',
  'harmonics.truncatingAtAStep':
    "Bir basamakta kesmek, hiç kaybolmayan bir çınlama bırakır. Aşım, sıçramanın %8,95'ine, yani düz tepenin 1,179 katına yakınsar; harmoniklerden kurulan bir kare dalganın ideal 1,0 yerine 1,18'e yakın bir tepe çarpanı vermesinin nedeni de budur. Terim eklemek dalgalanmayı daraltır, küçültmez.",
  'harmonics.undefined': 'tanımsız',
  'harmonics.use':
    "Kare dalganın bir ses zincirini neden bozduğunu, şebekedeki sinüs olmayan yük akımının neden soruna yol açtığını ve THD'nin gerçekte neyi ölçtüğünü anlamak. PWM ile doğrudan ilgilidir: bir PWM sinyalinin süzülmesi gerekmesinin tek nedeni, temel bileşenin üzerinde duran harmonik içeriktir.",
  'harmonics.warn1':
    'Toplam {swing} kadar salınıyor. Tek beslemeli bir DAC ya da süzülmüş bir PWM ucu bunu üretemez; gerçek çıkış düz tepe yapar ve bu modelin içermediği bir bozulma ekler. Genlikleri kısın ya da DC ofsetini kaydırın.',
  'heat-pump.aCopOf3':
    'COP değerinin 3 olması, bir kWh ısının tarifenin üçte birine mal olduğu anlamına gelir; yani dirençli bir ısıtıcıya kıyasla tasarruf `1 - 1/COP` olur. Makinenin kendini amorti edip etmeyeceğine karar veren sayı budur ve tam da talebin tepe yaptığı en soğuk günlerde çöker; sezonluk değerin manşet değerden daha önemli olmasının nedeni de budur.',
  'heat-pump.blurb':
    'Gerçek COP değerine karşı Carnot tavanı ve dirençli ısıtmayla maliyet karşılaştırması.',
  'heat-pump.carnotCeiling': 'Carnot tavanı',
  'heat-pump.costPerKwhHeat': 'kWh ısı başına maliyet',
  'heat-pump.designOutdoor': 'Tasarım dış sıcaklığı',
  'heat-pump.electricalInput': 'Elektriksel giriş',
  'heat-pump.flowHotSide': 'Gidiş (sıcak taraf)',
  'heat-pump.heatDelivered': 'Verilen ısı',
  'heat-pump.lede':
    'Bir ısı pompası ısı üretmez, onu taşır; bu yüzden her kilovat elektrik başına birkaç kilovat ısı verebilir. Üst sınır, yalnızca sıcaklık farkının belirlediği Carnot sınırıdır.',
  'heat-pump.liftedFromOutside': 'Dışarıdan çekilen',
  'heat-pump.machine': 'Makine',
  'heat-pump.ofCarnot': "Carnot'un %{eta} kadarı",
  'heat-pump.outdoorColdSide': 'Dış ortam (soğuk taraf)',
  'heat-pump.realCop': 'Gerçek COP',
  'heat-pump.realMachinesReachA':
    'Gerçek makineler Carnot değerinin ancak bir kısmına ulaşır; bu oran ikinci yasa verimidir ve evsel birimlerde tipik olarak 0,4 ile 0,6 arasındadır. Buna göre `COP = eta · Th/(Th - Tc)` olur ve verilen ısı `Qh = COP · W` ile bulunur.',
  'heat-pump.resistiveEquivalent': 'Dirençli eşdeğeri',
  'heat-pump.resistiveSeason': 'Dirençli sezon',
  'heat-pump.runningCost': 'İşletme maliyeti',
  'heat-pump.runtimeToCoverSeason': 'Sezonu karşılayan çalışma süresi',
  'heat-pump.savingAtThisPoint': 'Bu noktadaki tasarruf',
  'heat-pump.seasonalCop': 'Sezonluk COP',
  'heat-pump.seasonalCost': 'Sezonluk maliyet',
  'heat-pump.seasonalElectricity': 'Sezonluk elektrik',
  'heat-pump.seasonalSaving': 'Sezonluk tasarruf',
  'heat-pump.seasonHeatDemand': 'Sezonluk ısı talebi',
  'heat-pump.secondLawEfficiency': 'İkinci yasa verimi',
  'heat-pump.tariffPerKwh': 'kWh başına tarife',
  'heat-pump.temperatureLift': 'Sıcaklık yükseltmesi',
  'heat-pump.temperatures': 'Sıcaklıklar',
  'heat-pump.theFreePart': 'bedava kısım',
  'heat-pump.theory1':
    'Isıtmada Carnot tavanı `COP = Th / (Th - Tc)` ile bulunur; iki sıcaklık da kelvin cinsindendir. Yalnızca fark önemlidir; yerden ısıtma borularını 35 °C ile besleyen bir ısı pompasının, radyatörleri 65 °C ile besleyeni ezip geçmesinin nedeni budur: yükseltme daha küçüktür, dolayısıyla tavan daha yüksektir.',
  'heat-pump.theTariffItself': 'tarifenin kendisi',
  'heat-pump.thThTc': 'Th/(Th-Tc)',
  'heat-pump.title': 'Isı Pompası / COP',
  'heat-pump.use':
    'Bir ısı pompası kurmaya değip değmediğine karar vermek ve yanıtın neden gidiş suyu sıcaklığına bağlı olduğunu anlamak. Yerden ısıtmanın ısı pompalarına neden uyduğunu, eski yüksek sıcaklıklı radyatörlerin neden uymadığını ve işletme maliyetini manşetteki COP değil sezonluk değerin neden belirlediğini açıklar.',
  'heat-pump.warn1':
    'Soğuk taraf, sıcak tarafla aynı ya da onun üzerinde; yani yapılacak bir yükseltme yok ve COP tanımsız kalıyor. Gidiş sıcaklığını yükseltin ya da dış sıcaklığı düşürün.',
  'heat-pump.warn2':
    "Yaklaşık 55 K'nin üzerindeki bir yükseltme, çoğu evsel soğutucu akışkanın başarabildiği sınırın dışındadır. Gerçek makineler bu noktada devre dışı kalır ya da dirençli bir ısıtıcıya geçer; bu yüzden bu COP değerini iyimser kabul edin.",
  'i2c-pullup.blurb':
    'Veri yolu kapasitansı ve hızından pull-up aralığı, yükselme süresi kontrolüyle.',
  'i2c-pullup.busCapacitance': 'Veri yolu kapasitansı',
  'i2c-pullup.fromThe3Ma': '3 mA çekme sınırından',
  'i2c-pullup.fromTheRiseTime': 'yükselme süresi sınırından',
  'i2c-pullup.idealR': 'ideal R',
  'i2c-pullup.lede':
    'I2C açık drenajlıdır: aygıtlar hattı yalnızca aşağı çeker, bu yüzden onu yukarı çekmek bir dirence düşer ve veri yolu kapasitansı buna direnir. Osiloskop, bir aygıt hattı bıraktıktan sonraki yükselen kenarı, ideal boyutlu bir pull-up direncinin vereceği kenarla karşılaştırmalı olarak gösterir.',
  'i2c-pullup.limit': 'sınır {maxRise}',
  'i2c-pullup.limit2': 'sınır {maxCapacitance}',
  'i2c-pullup.maximumR': 'En büyük R',
  'i2c-pullup.minimumR': 'En küçük R',
  'i2c-pullup.powerPerLine': 'Hat başına güç',
  'i2c-pullup.recommended': 'Önerilen',
  'i2c-pullup.riseVsBitPeriod': 'Yükselme / bit süresi',
  'i2c-pullup.sda': 'SDA',
  'i2c-pullup.sinkCurrent': 'Çekilen akım',
  'i2c-pullup.speed': 'Hız',
  'i2c-pullup.staticWhenLow': 'durağan, alçakken',
  'i2c-pullup.theCeilingComesFrom':
    "Üst sınır kenardan gelir: `Rmax = tr / (0.8473·Cb)`. 0,8473 değeri `ln(0.7/0.3)`'tür ve belirtimin ölçüm yaptığı %30 ile %70 noktalarından türer.",
  'i2c-pullup.theFloorComesFrom':
    "Alt sınır, alçak seviyeden gelir: bir aygıt, hattı {I2C_VOL} V'un altında tutmaya yetecek akımı çekebilmelidir ve belirtim yalnızca 3 mA garanti eder. Yani `Rmin = (Vcc - 0.4) / 3mA` olur, 3,3 V'ta yaklaşık 970 Ω.",
  'i2c-pullup.theory1':
    'Açık drenaj, bir aygıtın hattı yalnızca aşağı çekebilmesi demektir. Hat bırakıldığında veri yolu kapasitansı pull-up üzerinden dolmak zorunda kalır; bu yüzden yükselen kenar bir RC eğrisi izlerken düşen kenar neredeyse anındadır. Pull-up boyutlandırmasına dair her şey bu asimetriden kaynaklanır.',
  'i2c-pullup.theWindowSpansDecades':
    "Bu pencere dekatlar boyunca uzandığından akla yatkın seçim aritmetik değil geometrik ortalamadır. 4,7 kΩ geleneksel varsayılan değerdir ve kısa bir 100 kHz veri yolu için gayet uygundur, ama 400 kHz'de gerçek bir kablo boyuyla çoğu zaman fazla zayıf kalır; tezgahta çalışıp uzun bir kabloyla arızalanan I2C veri yollarının alışılmış nedeni budur.",
  'i2c-pullup.title': 'I2C Pull-Up Direnci',
  'i2c-pullup.use':
    "Bir ESP32 projesindeki her I2C sensörü, ekranı ve EEPROM'u. I2C açık drenajlıdır, bu yüzden hat bir pull-up olmadan yükselemez ve direnç değeri bir formaliteden çok gerçek bir kısıttır: çok büyükse kenarlar saat için fazla yavaş kalır, çok küçükse aygıtlar hattı aşağı çekemez. Bir I2C hattının kısa bir jumper ile çalışıp bir metrelik şerit kabloyla arızalanmasının alışılmış nedeni budur.",
  'i2c-pullup.warn1':
    'Burada iki sınırı da sağlayan bir direnç değeri yok: yükselme süresini tutturmak için gereken değer, bir aygıtın alçağa çekebileceği değerin zaten altında. Veri yolunu kısaltın, aygıt sayısını azaltın ya da daha yavaş bir hıza geçin. Etkin bir veri yolu tamponuna ihtiyaç duyacağınız nokta tam olarak burasıdır.',
  'i2c-pullup.warn2':
    '{rPullup}, {rMin} ile {rMax} arasındaki pencerenin dışında. Çok küçükse aygıtlar geçerli bir alçak seviye tutamaz, çok büyükse kenar saat için fazla yavaş kalır.',
  'i2c-pullup.warn3':
    'Veri yolu kapasitansı, belirtimin bu hızda izin verdiği {maxCapacitance} değerinin ötesinde. Her aygıt yaklaşık 10 pF katar, kablolama da santimetre başına yaklaşık 1 pF ekler; yani uzun şerit kablolar bu değeri hızla artırır.',
  'i2c-pullup.whileHeldLow': 'alçak tutulurken',
  'led-resistor.14W1206': '1/4 W (1206, eksenel)',
  'led-resistor.absoluteMaxIf': 'Mutlak en büyük If',
  'led-resistor.blurb': 'Direnç seçimi, güç kaybı ve GPIO akımı veremediğinde uyarı.',
  'led-resistor.currentShiftPerOf': "Vf'nin {spread} kayması başına akım değişimi",
  'led-resistor.custom': 'Özel',
  'led-resistor.datasheetLimit20Ma': 'Veri sayfası sınırı, çoğu 5 mm parça için 20 mA.',
  'led-resistor.dissipationSplitsBetweenThe':
    "Güç kaybı iki parça arasında paylaşılır: dirençte `P_R = I²R = (Vs - Vf)²/R`, yongada ise `P_LED = Vf·I`. LED'e ulaşan pay yalnızca `Vf / Vs` kadardır; 12 V'luk bir hatta bağlı 2 V'luk kırmızı bir LED'in gücünün altıda beşini dirençte ısı olarak harcamasının nedeni de budur.",
  'led-resistor.drivenStraightFromA': "Doğrudan bir GPIO'dan sürülüyor",
  'led-resistor.e24IsTheIec':
    "E24, IEC 60063'ün tercih edilen serisidir; %5'lik parçalar için dekat başına 24 değer içerir ve nominal olarak iki basamağa yuvarlanmış `10^(n/24)`'tür. En yakın değer ohm cinsinden değil logaritmik uzaklığa göre seçilir, çünkü tolerans bir orandır: yüzde olarak 62 Ω, 65 Ω'a 68 Ω kadar uzaktır.",
  'led-resistor.exactE24Hit': 'tam E24 tutturması',
  'led-resistor.forwardVoltageVf': 'İleri gerilim Vf',
  'led-resistor.headroomIsTheWhole':
    "Tasarımın tüm meselesi paydır. Çevrim denkleminin türevi `dI/dVf = -1/R` verir, yani gruplar arasındaki {spread} kadarlık bir Vf kayması akımı `0.1 / R` amper, oransal olarak da `0.1 / (Vs - Vf)` kadar değiştirir. 3,3 V üzerindeki 3,2 V'luk beyaz bir LED'de bu, akımın %100'üdür; beyaz ve mavi parçaların 3,3 V'tan bir dirence değil sürücüye ihtiyaç duymasının nedeni tam olarak budur.",
  'led-resistor.idealResistor': 'İdeal direnç',
  'led-resistor.iRPart': 'I²R, {ratingLabel} parça',
  'led-resistor.led': 'LED',
  'led-resistor.lede':
    "Seri direnci seçin, ardından en yakın stok değerinin akıma, güç kaybına ve onu süren GPIO'ya gerçekte ne yaptığını görün. Burada dalga şekli yoktur, devrenin tamamı DC'dir.",
  'led-resistor.ledPower': 'LED gücü',
  'led-resistor.ledWithSeriesResistor': 'Seri dirençli LED',
  'led-resistor.nearestE24': 'En yakın E24',
  'led-resistor.nextStepUp': 'bir üst adım {rUp}',
  'led-resistor.noValueWorks': 'hiçbir değer uymuyor',
  'led-resistor.ofItReachesThe': 'bunun {efficiency} kadarı yongaya ulaşır',
  'led-resistor.onTarget': '(hedeften {currentError})',
  'led-resistor.packageRating': 'Kılıf değeri',
  'led-resistor.railVs': 'Hat Vs',
  'led-resistor.resistorHeadroom': 'Direnç payı',
  'led-resistor.resistorPower': 'Direnç gücü',
  'led-resistor.supplyDraw': 'Besleme çekişi',
  'led-resistor.targetCurrentIf': 'Hedef akım If',
  'led-resistor.theory1':
    'Tek bir çevrim olduğundan Kirchhoff `Vs = Vf + I·R` verir ve direnç Ohm yasasından çıkar: `R = (Vs - Vf) / If`. LED, standart parçalı doğrusal diyot yaklaşımıyla sabit bir ileri düşüm olarak modellenir. Dizin üzerinde I-V eğrisi öyle diktir ki Vf neredeyse hiç kıpırdamaz; dolayısıyla akımı belirleyen diyot değil dirençtir.',
  'led-resistor.title': 'LED Seri Direnci',
  'led-resistor.type': 'Tip',
  'led-resistor.use':
    "Herkesin kurduğu ilk devre, ama hâlâ en sık yanlış yapılanı. GPIO'dan gösterge LED'leri sürmek, bir panel dolusu LED için akımı boyutlandırmak ve ucun istediğiniz akımı gerçekten verip veremediğini kontrol etmek bu işin konusu. Bir LED'i 3,3 V'luk uçtan dirençsiz sürerseniz GPIO sınırını aşarsınız ve LED'i ya da ucu yakarsınız.",
  'led-resistor.vfI': 'Vf · I',
  'led-resistor.vsVf': 'Vs - Vf',
  'led-resistor.vsVfIf': '(Vs - Vf) / If',
  'led-resistor.warn1':
    "{vf} değerindeki Vf, {supply} hattıyla aynı ya da üzerinde olduğundan LED hiçbir zaman yanmaz ve hiçbir direnç değeri işe yaramaz. Daha düşük Vf'li bir parça kullanın ya da hattı bir yük pompası veya yükseltici dönüştürücüyle yükseltin.",
  'led-resistor.warn2':
    'Direnç üzerinde yalnızca {headroom} pay var. Parçadan parçaya olağan {spread} Vf dağılımı akımı {current} kadar kaydırır, yani direncin kontrolü neredeyse kalmaz. Hattı yükseltin ya da sabit akımlı bir sürücü kullanın.',
  'led-resistor.warn3':
    "{current}, bir ESP32 pininin vermesi ya da çekmesi gereken {GPIO_MAX_MA} mA sınırının ötesinde. LED'i bir transistör üzerinden sürün ya da direnci büyütün. Gerçek pin akımı da bundan düşük çıkar, çünkü çıkış katı yük altında kendi gerilimini düşürür ve bu ideal kaynak modeli bunu hesaba katmaz.",
  'led-resistor.warn4':
    '{current}, bu LED için belirlenen {maxCurrent} mutlak en büyük değerin üzerinde. Orada sürekli çalıştırmak ömrü kısaltır ya da LED yongasını yakar.',
  'led-resistor.warn5':
    '{ratingLabel} bir dirençte {rPower}. Daha büyük bir kılıf seçin ya da düşümü seri bağlı iki dirence bölün.',
  'ledc-pwm.actualDuty': 'Gerçek görev çevrimi',
  'ledc-pwm.asked': 'istenen %{duty}',
  'ledc-pwm.asRequested': 'istendiği gibi',
  'ledc-pwm.blurb':
    'Frekans ile çözünürlük arasındaki ödünleşim ve gerçek görev çevrimi adım büyüklüğü.',
  'ledc-pwm.clampedFrom': '{requestedBits} değerinden kısıtlandı',
  'ledc-pwm.dutySteps': 'Görev çevrimi adımları',
  'ledc-pwm.forLedsPickFrequency':
    "LED'lerde görünür titremeyi önlemek için frekansı yaklaşık 200 Hz'in üzerinde seçin; ışık kameraya çekilecekse bunun epeyce üstüne çıkın. Motorlarda 20 kHz üzeri anahtarlama uğultusunu duyulmaz kılar, ama o frekansta elinizde kalan çözünürlüğü kontrol edin.",
  'ledc-pwm.lede':
    "ESP32 üzerinde LEDC zamanlayıcısı, 80 MHz'lik saati periyot başına 2^bit adıma böler; bu yüzden frekans ile görev çevrimi çözünürlüğü doğrudan birbirinin ödünüdür. Frekansı yükseltin, çözünürlük çöker. Osiloskop pinin dalga şeklini ve ortalamasını gösterir.",
  'ledc-pwm.maxFreqAtThis': 'Bu çözünürlükte en yüksek frekans',
  'ledc-pwm.pin': 'pin',
  'ledc-pwm.quantisationError': 'Niceleme hatası',
  'ledc-pwm.requestedBits': 'İstenen bit',
  'ledc-pwm.stepSize': 'Adım boyu',
  'ledc-pwm.thatIsAHard':
    "Bu sıkı bir ödünleşimdir. Arduino'nun varsayılanı olan 13 bit, {maxFrequency} değerinde tavan yapar. Bir düşürücü dönüştürücü için 100 kHz istemek geriye yalnızca 9 bit bırakır. 1 MHz istemekse 6 bit bırakır; bu da 64 adım eder ve analog hiçbir iş için işe yaramaz.",
  'ledc-pwm.theDutyRegisterIs':
    "Görev çevrimi yazmacı bir tam sayıdır, bu yüzden ulaşılabilir görev çevrimi `1/2^bits` adımlarına nicelenir. Analog bir gerilime süzüldüğünde bu adım `Vcc/2^bits` olur; bir PWM DAC'ının gerçek çözünürlüğü de budur: 3,3 V ve 10 bitte yaklaşık 3,2 mV eder ve ne kadar süzerseniz süzün daha incesini geri kazanamazsınız.",
  'ledc-pwm.theory1':
    "LEDC zamanlayıcısı, 80 MHz'lik bir kaynaktan her PWM periyodunda bir kez `2^bits` değerine kadar sayar; yani belirli bir çözünürlükte ulaşabileceği en yüksek hız `f_max = 80 MHz / 2^bits` olur. Bunu yeniden düzenlersek, belirli bir frekanstaki en iyi çözünürlük `floor(log2(80e6 / f))` olur.",
  'ledc-pwm.timer': 'Zamanlayıcı',
  'ledc-pwm.title': 'ESP32 LEDC PWM',
  'ledc-pwm.use':
    "LED karartma, motor ve servo sürme ve ESP32'den analog gerilim üretme. Frekans ile çözünürlük arasındaki ödünleşim, insanların fark etmeden çarptığı bir donanım sınırıdır: yüksek frekans istemek görev çevrimi çözünürlüğünüzü sessizce düşürür, bu da bir LED'i düşük parlaklıkta karartırken görünür bantlanma olarak ortaya çıkar.",
  'ledc-pwm.warn1':
    '{frequency}, hiçbir çözünürlükte ulaşılabilir değil: 1 bit bile saatin çıkış frekansının en az iki katı olmasını gerektirir, LEDC kaynağı ise {APB_CLOCK}.',
  'ledc-pwm.warn2':
    "{frequency} frekansında {requestedBits} bit olanaksız. Zamanlayıcı sessizce {bits} bit kullanır; bu da istediğiniz {requestedBits2} yerine {stepCount} adım demektir. ledcSetup'ı desteklenmeyen bir çiftle çağırmak hata vermez, yalnızca beklediğinizden azını verir; kısılmış LED'lerdeki bantlanmanın yaygın bir nedeni de budur.",
  'ledc-pwm.warn3':
    '8 bitin altında adımlar LED üzerinde gözle görülür. Yumuşak karartma için frekansı 10 bit ya da üzerini verecek kadar düşük tutun ve algılanan parlaklığın kabaca görev çevriminin karesi olduğunu unutmayın; alt uç en ince adımları gerektirir.',
  'level-shifter.07XLow': 'alçak hattın 0,7 katı',
  'level-shifter.aResistorDividerIs':
    "Direnç bölücü, 3,3 V'luk bir girişe giden tek yönlü işaretler için uygundur, başka hiçbir şey için değil. Tek yönlüdür, sürücüyü sürekli yükler ve kendi RC'sini iki direncin paralel bileşimi belirler; yani düşük akımlı yapmak onu yavaşlatır.",
  'level-shifter.bitRate': 'Bit hızı',
  'level-shifter.blurb':
    'BSS138 çift yönlü dönüştürücü ve bölücüyle seviye kaydırma, hız sınırlarıyla.',
  'level-shifter.bss138Fet': 'BSS138 FET',
  'level-shifter.edge': 'kenar',
  'level-shifter.gateDriveMattersWith':
    "Kapı sürüşü önemlidir. 1,3 V eşikle, 3,3 V'luk bir alt hat 2 V aşırı sürüş verir ve iyi çalışır. 1,8 V'luk bir hat yalnızca 0,5 V bırakır; bu sınırdadır ve sıcaklıkla kayar.",
  'level-shifter.highSide': 'Üst taraf',
  'level-shifter.lede':
    '3,3 V ve 5 V parçaları konuşturmak. Osiloskop, alt taraf alıcısındaki yükselen kenarı lojik yüksek eşiğiyle birlikte gösterir: eğri çizgiyi hızla geçmiyorsa, DC seviyeleri ne kadar doğru görünürse görünsün bağlantı güvenilmezdir.',
  'level-shifter.lowSide': 'Alt taraf',
  'level-shifter.marginOverVth': 'Vth üzerindeki pay',
  'level-shifter.maxBitRate': 'En yüksek bit hızı',
  'level-shifter.needsAtLeast': 'En az şu kadar gerekir',
  'level-shifter.perLineWhenLow': 'hat başına, alçakken',
  'level-shifter.pullUpCurrent': 'Pull-up akımı',
  'level-shifter.pullUps': 'Pull-up dirençleri',
  'level-shifter.r1Series': 'R1 (seri)',
  'level-shifter.r2ToGround': 'R2 (toprağa)',
  'level-shifter.theConsequenceIsThat':
    "Bunun sonucu, devrenin açık drenajlı olmasıdır: yalnızca aşağı çekebilir ve iki tarafta da pull-up gerekir. Dolayısıyla hızı tümüyle pull-up ile veri yolu kapasitansının RC'si belirler, tıpkı I2C'de olduğu gibi. Bu kartlar tipik 10 kΩ pull-up ile birkaç yüz kHz civarında tavan yapar.",
  'level-shifter.theory1':
    "BSS138 devresi aldatıcı biçimde zekidir. FET'in kapısı alt taraf hattında durur ve kaynağı alt tarafa bakar. Alt tarafı aşağı çekin, VGS tüm alt hat gerilimi olur; FET iletime geçer ve üst tarafı da birlikte aşağı sürükler. Üst tarafı alçağa sürün, önce gövde diyodu iletir ve kaynağı aşağı çeker, bu da FET'i düzgün biçimde iletime sokar. Tek bir FET'i çift yönlü kılan şey budur.",
  'level-shifter.title': 'Lojik Seviye Dönüştürücü',
  'level-shifter.use':
    "3,3 V'luk bir ESP32'yi 5 V çevre birimlerine bağlamak: eski sensörler, karakter LCD'ler, WS2812 şeritler ve Arduino döneminin çoğu shield'i. Önemlidir, çünkü 3,3 V'luk bir uca 5 V vermek onu zamanla zedeler ve 3,3 V çıkış çoğu zaman 5 V'luk bir parçanın geçerli yüksek olarak okuduğu seviyenin hemen altında kalır; bu da temiz arıza yerine aralıklı hatalar üretir.",
  'level-shifter.vthV': 'Vth {BSS138_VGS_TH} V',
  'level-shifter.warn1':
    "Eşiğin üzerinde yalnızca {vgsMargin} kapı sürüşü var. FET zayıf ve yavaş iletime geçer, bu yüzden kenarlar bozulur ve Vth'nin kaydığı uç sıcaklıklarda seviye çevirici güvenilmez olur. Alt tarafta yaklaşık 1,8 V'un altında, bunun yerine özel bir çevirici tümdevre kullanın.",
  'level-shifter.warn2':
    'Kenar {worstRise} sürüyor ve bu, kullanılabilir hızı yaklaşık {maxBitRate} ile sınırlıyor. {bitRate} hızında işaret, yeniden değişmesi istenmeden önce geçerli bir seviyeye hiç ulaşamaz. Daha güçlü bir pull-up kullanın ya da veri yolu kapasitansını azaltın.',
  'level-shifter.warn3':
    'Bölücü yalnızca yüksekten alçağa çevirir. Üst tarafı alt taraftan süremez, yani I2C gibi çift yönlü hiçbir iş için kullanılamaz ve hat yüksek olduğu sürece sürekli akım harcar.',
  'link-budget.band': 'Bant',
  'link-budget.blurb': 'Alıcı hassasiyetine karşı serbest uzay yol kaybı, sönümleme payıyla.',
  'link-budget.budget': 'Bütçe',
  'link-budget.cableAndMiscLoss': 'Kablo ve diğer kayıplar',
  'link-budget.distance': 'Uzaklık',
  'link-budget.eirp': 'EIRP',
  'link-budget.freeSpacePathLoss': 'Boş uzay yol kaybı',
  'link-budget.freeSpacePathLoss2':
    "Boş uzay yol kaybı `20·log10(d_km) + 20·log10(f_MHz) + 32.44` ile bulunur. İçselleştirmeye değer iki sonucu var: uzaklığı iki katına çıkarmak 6 dB'ye mal olur, frekansı iki katına çıkarmak da öyle. İkincisi, aynı güçte 868 MHz'in 2,4 GHz'den neden bu kadar uzağa ulaştığını açıklar; üstelik daha düşük frekansların engelleri daha iyi geçtiğini hesaba katmadan önce.",
  'link-budget.lede':
    'Bağlantı kurulacak mı? Osiloskop, alınan gücü zamana değil MESAFEYE karşı tarar: yatay eksen sıfırdan başlayıp menzilin en ötesine uzanır, düz çizgi ise alıcının hassasiyet tabanıdır. Kesiştikleri noktada bağlantı kopar.',
  'link-budget.linkMargin': 'Bağlantı payı',
  'link-budget.neverDesignToZero':
    'Asla sıfır paya göre tasarlamayın. Bu model, ilk Fresnel bölgesinde hiçbir şey olmayan açık bir görüş hattı varsayar ve bu neredeyse hiçbir zaman geçerli olmaz. On dB çalışan bir alt sınırdır, kolayca gidip düzeltemeyeceğiniz her şey için yirmi dB akla yatkındır.',
  'link-budget.prx': 'Prx',
  'link-budget.radio': 'Telsiz',
  'link-budget.rangeAt0Db': '0 dB payla menzil',
  'link-budget.rangeAtDbMargin': '{MARGIN_MIN_DB} dB payla menzil',
  'link-budget.receivedPower': 'Alınan güç',
  'link-budget.rxAntennaGain': 'RX anten kazancı',
  'link-budget.sensitivity': 'duyarlılık',
  'link-budget.sensitivityIsWhereLora':
    "LoRa'nın hakkını verdiği yer duyarlılıktır. İşareti daha uzun zamana yaymak işlem kazancı sağlar: SF7 yaklaşık -123 dBm'e, SF12 yaklaşık -137 dBm'e iner. O 14 dB, menzilde beş kat demektir ve bedeli veri hızı ile yayın süresidir.",
  'link-budget.theory1':
    'Tüm bütçe dB cinsinden tek satırdır: `Prx = Ptx + Gtx + Grx - FSPL - losses`, ve bağlantı Prx alıcının duyarlılığının üzerinde durduğunda kurulur. Desibel ile çalışmak her çarpmayı toplamaya çevirir; bunun elle hesaplanabilir olmasının tek nedeni budur.',
  'link-budget.title': 'RF Link Bütçesi (LoRa / WiFi)',
  'link-budget.txAntennaGain': 'TX anten kazancı',
  'link-budget.txPower': 'TX gücü',
  'link-budget.usableInPractice': 'uygulamada kullanılabilir',
  'link-budget.use':
    "Herhangi bir kurulum yapmadan önce, bir LoRa ya da WiFi bağlantısının ihtiyacınız olan menzilde gerçekten çalışıp çalışmayacağına karar vermek. Düşük frekansların neden daha uzağa ulaştığını, LoRa'nın veri hızını hassasiyet için neden feda ettiğini ve pay bırakmadan tasarlanan bir bağlantının ilk yağmurda neden koptuğunu gösterir.",
  'link-budget.warn1':
    'Bağlantı kurulmuyor: alınan güç, duyarlılık tabanının {marginDb} dB altında. Uzaklığı yarıya indirmek 6 dB kazandırır, iki anten kazancını da ikiye katlamak da öyle. Daha yavaş bir LoRa yayılma çarpanı çok daha fazlasını kazandırır.',
  'link-budget.warn2':
    'Yalnızca {marginDb} dB pay var. Boş uzay kaybı en iyi durumdur: yağmur, yapraklar, bir duvar, antene yakın bir el ya da yalın çok yollu sönümleme, her biri birkaç dB yer. Bir bağlantıya güvenilir demeden önce en az {MARGIN_MIN_DB} dB hedefleyin.',
  'lipo-charger.1200Rprog': '1200 / Rprog',
  'lipo-charger.becauseItIsA':
    "Doğrusal bir şarj devresi olduğundan giriş ile hücre gerilimi arasındaki farkın tamamı ısıya dönüşür: `P = (Vin - Vcell)·I`. 5 V'tan 1 A ile 3,0 V'luk boş bir hücreye bu, bir SOP-8 içinde 2 W eder; bu kartların ısınıp kendini kısmasının nedeni budur. Onları 5 V'un üzerinde herhangi bir şeyden beslemek durumu belirgin biçimde kötüleştirir.",
  'lipo-charger.blurb': 'Program direncinden şarj akımı, CC/CV aşamaları ve şarj süresi.',
  'lipo-charger.ccPhase': 'CC evresi',
  'lipo-charger.cell': 'Hücre',
  'lipo-charger.charger': 'Şarj devresi',
  'lipo-charger.chipDissipation': 'Yonga güç kaybı',
  'lipo-charger.cvTail': 'CV kuyruğu',
  'lipo-charger.floatVoltage': 'Yüzdürme gerilimi',
  'lipo-charger.inputVoltage': 'Giriş gerilimi',
  'lipo-charger.lede':
    "Herkesin kullandığı TP4056 modülü. Osiloskop, klasik CC/CV profilini zamana karşı gösterir: hücre 4,2 V'a ulaşana kadar sabit akım, ardından akım sönerken sabit gerilim.",
  'lipo-charger.lithiumChargingIsConstant':
    "Lityum şarjı önce sabit akım, sonra sabit gerilimdir. CC sırasında akım sabittir ve hücre gerilimi tırmanır. 4,2 V'a ulaştığında şarj devresi bunun yerine gerilimi sabit tutar ve hücre doldukça akım söner. Akım, ayarlanan değerin yaklaşık onda birine düştüğünde şarj durur.",
  'lipo-charger.nearestResistor': 'En yakın direnç',
  'lipo-charger.rprog': 'Rprog',
  'lipo-charger.setCurrent': 'Ayarlanan akım',
  'lipo-charger.theCvTailIs':
    "CV kuyruğu insanların beklediğinden yavaştır. Kapasitenin yalnızca son beşte biri kadarını taşır ama toplam sürenin kayda değer bir kısmını alır, çünkü akım boyunca üstel olarak sönmektedir. Yüzde 90'a şarj etmenin enerji birimi başına yüzde 100'e şarj etmekten çok daha hızlı olmasının ve erken durmanın hücreye iyi gelmesinin nedeni budur.",
  'lipo-charger.theory1':
    'Şarj akımını tek bir direnç belirler: Rprog ohm cinsinden olmak üzere `Ichg = 1200 / Rprog` amper. Veri sayfasının varsayılan 1,2 kΩ değeri 1 A, 10 kΩ ise 120 mA verir; ikincisi küçük bir 200 mAh hücre için doğru mertebedir.',
  'lipo-charger.title': 'LiPo Şarj Devresi (TP4056)',
  'lipo-charger.totalChargeTime': 'Toplam şarj süresi',
  'lipo-charger.use':
    'Neredeyse her hobi lityum projesinde kullanılan TP4056 modülü. Önemlidir, çünkü tek bir direnç şarj akımını belirler ve yanlış seçmek ya tüm günü alır ya da hücreyi olması gerekenden hızlı şarj eder; ayrıca modül yüksek akımda ısınan doğrusal bir şarj devresidir.',
  'lipo-charger.vcell': 'Vcell',
  'lipo-charger.warn1':
    "{cRate} C ile şarj ediliyor. Çoğu lityum hücre 0,5 C ile 1 C arası ister; daha hızlısı ömrü keskin biçimde kısaltır ve küçük TP4056 kartının atamayacağı bir ısı üretir. Rprog'u büyütün: {capacityAh} bu hücre için tam 1 C verir.",
  'lipo-charger.warn2':
    "Yonga, şarjın başında {dissipation} harcıyor. Bu doğrusal bir şarj devresidir, yani giriş ile hücre arasındaki her volt o küçük kılıfta ısıya dönüşür. Isıl olarak kendini kısacak ve şarj süresini buradaki tahminin epey ötesine uzatacaktır. Girişi 5 V'a yakın tutun.",
  'lipo-charger.warn3':
    "Çıplak bir TP4056 kartında hiçbir koruma yoktur. DW01 ve ikili MOSFET'li sürüm aşırı deşarj, aşırı akım ve kısa devre koruması ekler; lityum hücreler bu olmadan kullanılmamalıdır. İki sürüm de hücre dengeleme yapmaz, yani hiçbiri çok hücreli seri paket için uygun değildir.",
  'lm2596.actualVout': 'Gerçek Vout',
  'lm2596.blurb': 'Her yerde bulunan 150 kHz buck modülü: geri besleme bölücü, sınırlar, verim.',
  'lm2596.diodeLoss': 'Diyot kaybı',
  'lm2596.efficiencyIsDominatedBy':
    "Verime iki terim egemendir: 3 A'de yaklaşık 1,16 V düşüren içteki anahtar ve tüm kesim süresi boyunca `Vf·Idiode` harcayan yakalama diyodu. Düşük çıkış gerilimlerinde diyot çevrimin çoğunda iletir; bu yüzden 12 V'tan 3,3 V'a dönüşüm 12 V'tan 5 V'a dönüşümden belirgin biçimde daha az verimlidir.",
  'lm2596.esrCap': 'esr {vrippleEsr} + kondansatör {vrippleCap}',
  'lm2596.feedbackDivider': 'Geri besleme bölücüsü',
  'lm2596.fixed': 'sabit',
  'lm2596.headroom': 'pay {headroom}',
  'lm2596.lede':
    "Her parça setindeki mavi buck modülü. Hedef hat için geri besleme bölücüsünü seçin, sonra gerçek sınırlara karşı kontrol edin: 3 A, 40 V ve bunların ikisine de ulaşmadan çok önce ısınan bir kılıf. Osiloskop, sabit 150 kHz'de bobin akımını gösterir.",
  'lm2596.lossInTheIc': 'Tümdevredeki kayıp',
  'lm2596.maxC': 'en çok {TJ_MAX} °C',
  'lm2596.minimumVin': 'En küçük Vin',
  'lm2596.offTarget': 'hedeften %{voutError} sapma',
  'lm2596.r1FbToGnd': "R1 (FB'den toprağa)",
  'lm2596.r2From': '{series} serisinden R2',
  'lm2596.r2Ideal': 'İdeal R2',
  'lm2596.resistorSeries': 'Direnç serisi',
  'lm2596.setsItsTemperature': 'sıcaklığını bu belirler',
  'lm2596.theory1':
    "Çıkışı geri besleme bölücüsü belirler: `Vref = {VREF} V` ile `Vout = Vref·(1 + R2/R1)`. R1'i veri sayfasının önerdiği 1k - 5k aralığında tutun: fazla büyükse FB pininin kendi kutuplama akımı çıkışı kaydırır, fazla küçükse bölücü sürekli akım harcar.",
  'lm2596.theSwitchingFrequencyIs':
    "Anahtarlama frekansı içeriden 150 kHz'e sabitlenmiştir ve modülün başlıca kısıtı budur. Düşük frekans, belirli bir dalgalanma için fiziksel olarak büyük bir bobin ve kondansatör demektir, çünkü `dIL = Vout·(1-D)/(fsw·L)` ve `dV = dIL/(8·fsw·C)` ifadelerinin ikisi de fsw ile ters orantılıdır.",
  'lm2596.thetaJa': 'Theta JA',
  'lm2596.theThermalCheckIs':
    "Gerçek sınır genellikle akım değeri değil, ısıl denetimdir. Jonksiyonu yalnızca tümdevrenin içindeki kayıp ısıtır, yani `Tj = Tamb + Pic·ThetaJA`. Hava akışı olmayan çıplak bir modülde ThetaJA kötüdür ve 1 ila 2 W'lık içsel kayıp ısıl kapanmaya ulaşmaya yeter.",
  'lm2596.title': 'LM2596 Modülü',
  'lm2596.use':
    'Her parça setindeki mavi ayarlanabilir buck modülü, 12 V beslemeden 5 V veya 3,3 V almak için kullanılır. Bu sayfa var, çünkü modüller 3 A iddiasıyla satılırken termal tasarımları çok daha önce pes eder ve geri besleme bölücüsünü deneme yanılmayla ayarlamak, insanların besledikleri şeyi yakma biçimidir.',
  'lm2596.voutTarget': 'Hedef Vout',
  'lm2596.warn1':
    'Giriş, bu çıkışı bu yükte tutmak için gereken {vinMinimum} değerinin altında. Regülatör en büyük görev çevriminde çalışır ve çıkış, anahtar düşümü çıkarıldıktan sonra girişi aşağı doğru izler.',
  'lm2596.warn2':
    "Veri sayfasının en küçük değeri olan {VIN_MIN} V'un altında. İçteki referans burada garanti edilmez.",
  'lm2596.warn3': "Mutlak en büyük değer olan {VIN_MAX} V'un üzerinde. Bu, parçayı yok eder.",
  'lm2596.warn4':
    '{IOUT_MAX} A değerinin ötesinde. Bu modüller yaygın olarak 3 A iddiasıyla satılır ama 1,5 A üzerinde soğutucusu ancak yeter.',
  'lm2596.warn5':
    'Tepe bobin akımı garantili akım sınırının üzerinde, yani parça bu yüke ulaşmadan çevrim çevrim sınırlamaya girer. Daha büyük bir bobin kullanın.',
  'lm2596.warn6':
    "Jonksiyon {tj} °C'de, {TJ_MAX} °C sınırının ötesinde. Isıl olarak kapanacaktır. Hava akışını iyileştirin, soğutucu ekleyin ya da yükü azaltın.",
  'lm2596.warn7':
    'Hedef, {VREF} V geri besleme referansının altında; bu topoloji bunu hiçbir şekilde üretemez.',
  'lm317.240IsStandardKeeps': '240 Ω standarttır: {V_REF} parçayı yüksüzken regülasyonda tutar.',
  'lm317.298KIs25':
    '298 K, 25 C demektir. Kapalı bir kutu içindeki durgun hava 10 - 20 K daha sıcak çalışır.',
  'lm317.aDifferentTopology': 'farklı bir topoloji',
  'lm317.adjustPinTerm': 'Ayar pini terimi',
  'lm317.againstTarget': '(hedefe göre {targetErr}{targetErr2})',
  'lm317.aHeatsinkIsMandatory': '(soğutucu zorunludur)',
  'lm317.aKWSink': "{rthSinkNeeded} K/W'lık bir soğutucu",
  'lm317.atAndAmbient': '({pd} güçte, {ambientK} ortamda)',
  'lm317.blurb': 'Ayar dirençleri, güç kaybı ve soğutucu gerekip gerekmediği.',
  'lm317.clipOnTo220': 'Geçmeli TO-220 kanat 20 - 30, 25 mm profil 10, 50 mm blok 4.',
  'lm317.e24Gives': '(E24 {r2E24}, {voutE24} verir)',
  'lm317.everythingLeftOverIs':
    "Artan her şey ısıdır. Anahtarlama olmadığı ve saklanacak yer bulunmadığı için `Pd = (Vin - Vout)·I` olur, yani verim yalnızca Vout/Vin'dir. Jonksiyon `Tj = Ta + Pd·Rth` değerindedir; buradaki Rth jonksiyondan ortama giden seri yoldur: jonksiyondan kılıfa, macun ya da ped üzerinden kılıftan soğutucuya, sonra soğutucudan havaya. Soğutucuyu boyutlandırmak için tersine çevirin: `Rsa = (Tj_max - Ta)/Pd - Rjc - Rcs`. Negatif bir yanıt, darboğazın kılıfın kendisi olduğu ve hiçbir soğutucunun onu kurtaramayacağı anlamına gelir.",
  'lm317.freeAirIsEnough': '(serbest hava yeterli)',
  'lm317.greaseAlone05': 'Yalnızca macun 0,5, silikon ped 2, mika artı macun 1,4.',
  'lm317.headroom': 'Pay',
  'lm317.heatsinkFitted': 'Takılı soğutucu',
  'lm317.heatsinkNeeded': 'Gereken soğutucu',
  'lm317.heatsinkRth': 'Soğutucu Rth',
  'lm317.iadjIs50A':
    "Iadj tipik olarak 50 µA'dir. R1 240 Ω iken program akımı 5,2 mA'dir, yani yüz kat daha büyüktür ve Iadj terimi yalnızca bir yuvarlama hatasıdır. Güç tasarrufu için bölücüyü onlarca kiloohma çıkarırsanız Iadj sıcaklıkla da kayan birinci dereceden bir terime dönüşür: 10 k'lık R2 ile 10 k'lık R1, oranın vaat ettiği 2,5 V yerine 3,0 V okur.",
  'lm317.inFreeAir': '(serbest havada {thermal})',
  'lm317.interfaceRth': 'Arayüz Rth',
  'lm317.kRiseLimit': '({riseK} K artış, sınır {TJ_MAX_K})',
  'lm317.kWOrBetter': '{rthSinkNeeded} K/W ya da daha iyisi',
  'lm317.lm317AdjustableRegulator': 'LM317 ayarlanabilir regülatör',
  'lm317.loadCurrentCeiling': 'Yük akımı tavanı',
  'lm317.loadTakesDeviceDraws': '(yük {pLoad} alır, eleman {iDevice} çeker)',
  'lm317.minLoadSoR1': '(en düşük yük {I_LOAD_MIN}, yani R1 ≤ {r1Max})',
  'lm317.needsSoVin': '({DROPOUT_V} gerekir, yani Vin ≥ {vinMin})',
  'lm317.noneIsEnough': 'hiçbiri yetmez',
  'lm317.ofVout': "(Vout'un %{vout} kadarı)",
  'lm317.package': 'Kılıf',
  'lm317.pickR1AndR2':
    'İstediğiniz hat için R1 ve R2 seçin, sonra parçanın buna dayanıp dayanmadığını kontrol edin. Osiloskop bir dalga şekli göstermez: yatay eksen 0 ile {max} A arasındaki yük akımıdır, bu yüzden bölme başına değeri miliamper olarak okuyun; dikey eksen ise 398 K (125 C) sınırına karşı kelvin cinsinden jonksiyon sıcaklığıdır.',
  'lm317.programCurrent': 'Program akımı',
  'lm317.r1HasAnUpper':
    "R1'in oranın göstermediği bir üst sınırı vardır. Parça regüle edebilmek için {I_LOAD_MIN} yük ister, bu yüzden bölücü normalde bunu tek başına sağlayacak biçimde boyutlandırılır: `R1 ≤ Vref/Imin = {I_LOAD_MIN2}` . Her referans şemadaki 240 Ω buradan gelir.",
  'lm317.r1OutToAdj': "R1 (OUT'tan ADJ'ye)",
  'lm317.r2AdjToGnd': "R2 (ADJ'den GND'ye)",
  'lm317.r2ForTarget': 'Hedef için R2',
  'lm317.supplyAndLoad': 'Besleme ve yük',
  'lm317.targetVout': 'Hedef Vout',
  'lm317.theory1':
    'LM317 yüzen bir regülatördür: OUT ile ADJ arasında `Vref = {V_REF} V` tutmaktan başka bir şey yapmaz. R1 bu referansın üzerinde durur, yani yük ne yaparsa yapsın sabit bir `Iprog = Vref/R1` taşır. O akım artı ayar pini akımı R2 üzerinden toprağa akar, yani `Vout = Vref·(1 + R2/R1) + Iadj·R2` olur.',
  'lm317.thePartRatingThermals': '(parça sınırı, ısıl olarak yer var)',
  'lm317.thermalBudget': '(ısıl sınır, bütçe {pdMax})',
  'lm317.theTraceIsThat':
    "İz, bir zaman bölgesi benzetimi değil, o denklemin yük akımı boyunca taranmış hâlidir: sabit payda Tj, Iout ile doğrusaldır ve sıfır yükte regülatörün yine de geçirmesi gereken bölücü akımı kadar kaydırılmıştır. Düz 398 K çizgisini kestiği yer, tasarımın dürüst akım sınırıdır ve bu genellikle veri sayfasının ilk sayfasında duyurulan 1,5 A'in epey altındadır.",
  'lm317.title': 'Doğrusal Regülatör (LM317)',
  'lm317.tjFitted': 'Soğutuculu Tj',
  'lm317.tjFreeAir': 'Serbest havada Tj',
  'lm317.tjWithNoHeatsink': 'Soğutucusuz Tj',
  'lm317.unregulatedInputAtIts':
    'Regüle edilmemiş giriş, en düşük değerinde. Dalgalanma çukurlarını da katın.',
  'lm317.use':
    "Basit ayarlanabilir beslemeler, LEDler ve batarya şarjı için akım kaynakları ve anahtarlama gürültüsünün kabul edilemez olduğu durumlar. Kritik nokta güç kaybıdır: doğrusal regülatör gerilim farkını ısı olarak harcar, yani 1 A'de 12 V'tan 3,3 V'a düşürmek neredeyse 9 W ve bir soğutucu demektir; buck dönüştürücünün genelde tercih edilmesinin nedeni budur.",
  'lm317.voutVinALinear': '(Vout/Vin, doğrusal bir regülatör gerisini yakar)',
  'lm317.voutWorstCase': 'En kötü durumda Vout',
  'lm317.vrefSpreadToV': '(Vref saçılımı {V_REF_MIN} - {V_REF_MAX} V, dirençler tam)',
  'lm317.warn1':
    "Düşüm sınırının altında: LM317 {DROPOUT_V} isterken elde {headroom} pay var. Geçiş elemanı doyumdadır, yani çıkış girişi aşağı doğru izler ve yukarıdaki her değer anlamsızdır. Vin'i {vinMin} üzerine çıkarın ya da hedefi düşürün.",
  'lm317.warn2':
    'Giriş-çıkış farkı {headroom}, mutlak en büyük değer olan {V_IO_MAX} değerinin ötesinde. Ne kadar serin tutarsanız tutun parça bozulur.',
  'lm317.warn3':
    'Jonksiyon {tjK} değerinde, 175 C civarındaki içsel ısıl kapanmanın ötesinde. Regülatör orada durmak yerine çıkışı geri kısar ve kapanıp açılarak salınır. {pdMax} kadarını atın ya da daha iyi bir soğutucu takın.',
  'lm317.warn4':
    'Jonksiyon {tjK} değerinde, {TJ_MAX_K} sınırının üzerinde. Regüle etmeyi sürdürebilir ama belirtim dışıdır ve ömrü hızla tükenmektedir. {topology} , daha düşük bir Vin ya da {ioutCeiling} altında yük gerekir.',
  'lm317.warn5':
    "Hiçbir soğutucu yetmez: {rthJC} K/W jonksiyon-kılıf yolundan geçen {pd}, {ambientK} ortam sıcaklığında bütçeyi tek başına zaten aşıyor. Vin'i Vout'a yaklaştırın ya da anahtarlamalı bir regülatör kullanıp farkı ısıya çevirmeyi bırakın.",
  'lm317.warn6':
    '{iout}, garantili {I_OUT_MAX} çıkışının ötesinde. İçteki sınırlayıcı tipik olarak 2,2 A civarında devreye girer, ama bu bir tipik değerdir, bir söz değil.',
  'lm317.warn7':
    "R1 yalnızca {iProgram} çekiyor; bu, {I_LOAD_MIN} en küçük yükün altında. Gerçek yük bağlı değilken çıkış yukarı kayar. R1'i {r1Max} değerinden büyük seçmeyin ya da kalıcı bir boşaltma direnci takın.",
  'lm317.warn8':
    "50 µA'lik ayar akımı R2 üzerinden {iadjTerm} ekler; bu, çıkışın %{vout} kadarıdır ve sıcaklıkla kayar. Program akımı baskın olsun diye iki direnci de küçültün.",
  'lm317.worstCaseNotAverage':
    "Ortalama değil, en kötü durum. Bir ESP32 iletimde 0,5 A'e yaklaşır.",
  'mosfet-switch.blurb': 'Kapı sürüş payı, çalışma bölgesi, iletim ve anahtarlama kayıpları.',
  'mosfet-switch.burnedInRgAnd': "(FET'te değil, Rg ile pinde harcanır)",
  'mosfet-switch.channelDissipation': 'Kanal güç kaybı',
  'mosfet-switch.conductionLoss': 'İletim kaybı',
  'mosfet-switch.conductionSwitching': '(iletim + anahtarlama)',
  'mosfet-switch.datasheetAt': '(veri sayfası {vgsSpec} değerinde {rdsOnSpec})',
  'mosfet-switch.dIdRdsAt': '(%{duty} görev çevriminde D·Id²·RDS)',
  'mosfet-switch.dieLimited': '(yonga sınırlı)',
  'mosfet-switch.drainCurrent': 'Drain akımı',
  'mosfet-switch.driveLimitedNotDie': '(sürüş sınırlı, yonga sınırlı değil)',
  'mosfet-switch.edges': '(kenarlar {trEff} / {tfEff})',
  'mosfet-switch.esp32GpioIsV': "ESP32 GPIO'su {VCC} V",
  'mosfet-switch.fallTimeTf': 'Düşme süresi tf',
  'mosfet-switch.gateChargeQg': 'Kapı yükü Qg',
  'mosfet-switch.gateChargeTime': 'Kapı yükleme süresi',
  'mosfet-switch.gateDrive': 'Kapı sürüşü',
  'mosfet-switch.gateDrivePower': 'Kapı sürüş gücü',
  'mosfet-switch.gateOverdrive': 'Kapı aşırı sürüşü',
  'mosfet-switch.gateResistorRg': 'Kapı direnci Rg',
  'mosfet-switch.gpioLimitMa': '(GPIO sınırı {GPIO_MAX_MA} mA)',
  'mosfet-switch.idealSwitch': '(ideal anahtar {idIdeal})',
  'mosfet-switch.junctionTemperature': 'Jonksiyon sıcaklığı',
  'mosfet-switch.lede':
    'Bir ESP32 GPIO ucundan yük anahtarlayan lojik seviyeli N kanal MOSFET. Osiloskop, bir veya daha fazla PWM çevrimi boyunca kapı ve drain gerilimini gösterir, yatay eksen zamandır. Aşağıdaki göstergeler çalışma noktası, kayıp dağılımı ve jonksiyon sıcaklığıdır.',
  'mosfet-switch.lossesSplitThreeWays':
    "Kayıplar üçe ayrılır. İletim kaybı `Pcond = D·Id²·RDS(on)` olur. Geçiş kaybı `Psw = 0.5·VDS·Id·(tr + tf)·fsw` olup her kenarı tam gerilimde bir akım yükselişi, ardından tam akımda bir gerilim düşüşü olarak ele alır; bu, kırpılmış endüktif yük için tutucu bir varsayımdır. Kapı yükü `Pgate = Qg·VGS·fsw` kadar bir güce mal olur ve bu, FET'te değil kapı direnci ile sürücü pininde harcanır. Yongayı yalnızca ilk iki kayıp ısıtır, yani `Tj = Ta + (Pcond + Psw)·Rth(j-a)` olur.",
  'mosfet-switch.lowSideNChannel': 'Alt taraf N kanallı MOSFET anahtar',
  'mosfet-switch.millerPlateau': 'Miller platosu',
  'mosfet-switch.mosfet': 'MOSFET',
  'mosfet-switch.ofWhatTheSwitch': '(anahtarın geçirdiğinin %{efficiency} kadarı)',
  'mosfet-switch.operatingRegion': 'Çalışma bölgesi',
  'mosfet-switch.part': 'Parça',
  'mosfet-switch.peakGateCurrent': 'Tepe kapı akımı',
  'mosfet-switch.powerToLoad': 'Yüke giden güç',
  'mosfet-switch.quotedAtVgs': "VGS'te belirtildi",
  'mosfet-switch.rdsOnAtThis': "Bu VGS'te RDS(on)",
  'mosfet-switch.rdsOnIsNot':
    "RDS(on) sabit bir değer değildir. Triyot bölgesinin derinlerinde kanal `rds = 1 / (k·Vov)` olur, yani veri sayfasındaki bir değer k'yi sabitler: `k = 1 / (RDS(on)spec · (VGSspec - Vth))`, başka herhangi bir kapı geriliminde ise `RDS(on) = RDS(on)spec · (VGSspec - Vth) / (VGS - Vth)` olur. 22 mΩ diye duyurulan bir parçanın 3,3 V'ta 51 mΩ'a yakın olmasının, 10 V'ta belirtilmiş bir parçanın ise büsbütün konu dışı kalmasının nedeni budur.",
  'mosfet-switch.rdsOnQuoted': 'Belirtilen RDS(on)',
  'mosfet-switch.riseKOverC': '({ta2} °C üzerine {ta} K artış)',
  'mosfet-switch.riseTimeTr': 'Yükselme süresi tr',
  'mosfet-switch.rthJunctionToAmbient': 'Jonksiyondan ortama Rth',
  'mosfet-switch.supplyVs': 'Besleme VS',
  'mosfet-switch.switching': 'Anahtarlama',
  'mosfet-switch.switchingLoss': 'Anahtarlama kaybı',
  'mosfet-switch.theChannelFollowsThe':
    'Kanal kare yasasını izler. Eşiğin altında hiç kanal yoktur. Üstünde, `Vov = VGS - Vth` ile drain akımı triyot bölgesinde `Id = k·(Vov·VDS - VDS²/2)` olur ve `VDS &gt; Vov` olduğunda `Id = 0.5·k·Vov²` değerinde doyar. Çalışma noktası, bu eğrinin `VDS = VS - Id·Rload` yük doğrusuyla kesişimidir ve yinelemeli değil kapalı biçimde çözülür.',
  'mosfet-switch.theEdgeTimesUsed':
    'Kullanılan kenar süreleri `max(tr, Qg·Rg/VGS)` şeklindedir. Bir kapı, sürücünün yükünü kaydırabileceğinden hızlı hareket edemez; bu yüzden anahtarlama hızını, dolayısıyla anahtarlama kaybını, genellikle yonga değil bir GPIO üzerindeki büyük kapı direnci belirler.',
  'mosfet-switch.theScopeTraceIs':
    'Osiloskop izi, bu parçalı tanımın her örnek anında doğrudan hesaplanmasıyla kurulur; bu yüzden her zaman tabanında tamdır ve üzerinde `VDS·Id` integrali almak yukarıdaki kapalı biçimlerle aynı sayıları verir.',
  'mosfet-switch.thresholdVth': 'Eşik Vth',
  'mosfet-switch.title': 'MOSFET Devre Simülatörü',
  'mosfet-switch.use':
    "Bir ESP32'den ciddi bir yükü anahtarlamanın standart yolu: motorlar, ısıtıcılar, LED şeritler, solenoidler. Kritik kontrol kapı sürüşüdür, çünkü 3,3 V'luk bir uç, 10 V VGS için belirtilmiş bir MOSFET'i tam olarak iletime sokamaz. Bu, en yaygın ESP32 donanım hatasıdır ve masada çalışan ama yük altında yanan bir FET olarak ortaya çıkar.",
  'mosfet-switch.vds': 'Vds',
  'mosfet-switch.vdsOnState': 'İletimde VDS',
  'mosfet-switch.vgs': 'Vgs',
  'mosfet-switch.vgsVth': '(VGS {vgsDrive} - Vth {vth})',
  'mosfet-switch.warn1':
    "{vgsDrive} değerindeki VGS, {vth} eşiğine eşit ya da altında kalıyor; bu yüzden kanal oluşmaz ve yük hiç akım görmez. Standart bir MOSFET'i 3,3 V'luk bir pine asmanın klasik başarısızlığı budur: mantık seviyeli bir parça seçin ya da kapıyı 10 V'a salındırmak için bir kapı sürücüsü veya küçük bir BJT seviye çevirici ekleyin.",
  'mosfet-switch.warn2':
    "FET doyumda oturuyor, yani üzerinde {vds} varken {id} değerinde sabit bir akım kaynağı gibi davranıyor. Bu bir anahtar değil doğrusal regülatördür ve {pCond} harcar. VGS'yi ya da yük direncini yükseltin.",
  'mosfet-switch.warn3':
    "Tepe kapı akımı {igPeak}; bu, bir ESP32 GPIO'sunun dayandığı {GPIO_MAX_MA} mA sınırının üzerinde. Rg'yi büyütün ya da bir kapı sürücüsü kullanın.",
  'mosfet-switch.warn4':
    'Kenarlar {fsw} çevriminin {tfEff} kadarını alıyor. FET çevrimin çoğunu geçişte geçiriyor, yani sert anahtarlama kaybı modeli artık geçerli değil ve gerçek eleman gösterilenden daha sıcak olacaktır.',
  'mosfet-switch.warn5':
    "Jonksiyon {tj} °C'de, 150 °C değerinin ötesinde. Soğutucu ekleyin (Rth'yi düşürün), akımı azaltın ya da kapı sürüşünü iyileştirin.",
  'ntc-thermistor.adcCountsPerK': 'K başına ADC adımı',
  'ntc-thermistor.atC': "{tempC} °C'de",
  'ntc-thermistor.beta': 'Beta',
  'ntc-thermistor.blurb':
    'Beta ve Steinhart-Hart dönüşümü, bölücü çıkış eğrisi, kendi kendine ısınma.',
  'ntc-thermistor.dissipationConstant': 'Isı dağıtma sabiti',
  'ntc-thermistor.from': 'Başlangıç',
  'ntc-thermistor.lede':
    'Termistör doğrusal değildir ve tasarım probleminin tamamı budur. Osiloskop bölücü çıkışını zamana değil SICAKLIĞA karşı tarar: yatay eksen, belirlediğiniz alt sınırdan üst sınıra °C cinsinde gider.',
  'ntc-thermistor.rAtReference': 'Referanstaki R',
  'ntc-thermistor.referenceTemp': 'Referans sıcaklığı',
  'ntc-thermistor.resistanceNow': 'Anlık direnç',
  'ntc-thermistor.selfHeating': 'Öz ısınma',
  'ntc-thermistor.selfHeatingError': 'Öz ısınma hatası',
  'ntc-thermistor.selfHeatingIsThe':
    'Asıl tuzak öz ısınmadır. Boncuktan geçen akım ısı üretir, ısı dağıtma sabiti (durgun havada tipik olarak 1 - 5 mW/K) bunu bir sıcaklık hatasına çevirir ve algılayıcı bunu hiç çekinmeden ölçüm diye bildirir. Akımı küçük tutun ya da bölücüye yalnızca örnekleme yaptığınız mikrosaniyeler boyunca güç verin.',
  'ntc-thermistor.steinhartHart1T':
    'Steinhart-Hart, `1/T = A + B·ln(R) + C·ln(R)³`, geniş bir aralıkta birkaç milikelvine iner ama üç kalibrasyon noktası ister. Beta biçimi, bunun C = 0 olan özel hâlidir.',
  'ntc-thermistor.sweepRange': 'Tarama aralığı',
  'ntc-thermistor.temperatureNow': 'Anlık sıcaklık',
  'ntc-thermistor.theCurveOnScreen':
    "Ekrandaki eğri, asıl tasarım kısıtını gösterir. Duyarlılık, termistörün direnci seri dirence eşit olduğunda en yüksek olur ve iki uçta da düşer: yüksek sıcaklıkta termistör, sabit direncin yanında neredeyse kısa devre gibidir; düşük sıcaklıkta ise onu bastırır. Bu yüzden 10 k'lık bir seri dirençle kullanılan 10 k'lık bir NTC, 25 °C civarında çok iyi, 120 °C'de ise zayıf çözünürlük verir.",
  'ntc-thermistor.theory1':
    "Beta denklemi `1/T = 1/T0 + ln(R/R0)/B` şeklindedir ve `R = R0·exp(B·(1/T - 1/T0))` olarak düzenlenir. Tek parametre, tek kalibrasyon noktası, 50 K'lik bir aralıkta yarım kelvin kadar isabetli. Veri sayfalarının farklı aralıklar için farklı B değerleri vermesinin, örneğin B25/85, nedeni tam olarak bunun yalnızca yerel bir uyum olmasıdır.",
  'ntc-thermistor.thermistor': 'Termistör',
  'ntc-thermistor.title': 'NTC Termistör',
  'ntc-thermistor.to': 'Bitiş',
  'ntc-thermistor.use':
    '3D yazıcı sıcak uçları ve tablalarında, batarya paketlerinde ve genel izlemede sıcaklık ölçümü; termistörün dijital sensörden çok daha ucuz olduğu yerler. Tasarım problemi doğrusalsızlıktır ve bu sayfa bölücünün nerede duyarlı, nerede kör olduğunu, ayrıca sensörün kendi akımını okumasına yol açan kendi kendine ısınma hatasını gösterir.',
  'ntc-thermistor.warn1':
    'Boncuk {selfHeatW} harcıyor ve kendini {selfHeatK} K ısıtıyor. Ortamı değil, kendi akımını ölçüyor. Seri direnci büyütün ya da bölücüyü yalnızca örnekleme sırasında devreye alın.',
  'ntc-thermistor.warn2':
    'Duyarlılık, seri direnç termistörün en çok önemsediğiniz sıcaklıktaki direncine eşit olduğunda tepe yapar. {t0C} °C çevresinde en iyi çözünürlük için seri direnci {r0} yapın.',
  'op-amp.0VForSingle': 'Tek beslemeli ESP32 işleri için 0 V.',
  'op-amp.12PiRin': '(1 / 2·pi·Rin·Cf)',
  'op-amp.1RfRgSets': '(1 + Rf/Rg, bant genişliğini belirler)',
  'op-amp.2PerInputCycle': '(tetiklenirken giriş çevrimi başına 2)',
  'op-amp.aCompensatedOpAmp':
    "Dengelenmiş bir işlemsel yükselteç, kazanç ile bant genişliğinin çarpımını sabit tutar; bu yüzden kapalı çevrim köşe frekansı `BW = GBW / noise gain` olur. Gürültü kazancı iki topoloji için de `1 + Rf/Rg`'dir; -10 kazançlı eviren bir katla +11 kazançlı evirmeyen bir katın işaret kazançları farklı olsa da bant genişliklerinin tam olarak aynı olmasının nedeni budur.",
  'op-amp.amplifier': 'İşlemsel yükselteç şeması',
  'op-amp.bandwidthIsASmall':
    'Bant genişliği küçük işaretler için geçerli bir değerdir. Büyük işaretler bunun yerine yönelim hızına çarpar: tepe değeri Vp olan bir sinüs saniyede `2·pi·f·Vp` volt ister, yani bozulmasız en büyük sinüs, tam güç bant genişliği `SR / (2·pi·Vp)` olur. Bunun ötesinde, kazanç grafiği ne derse desin çıkış üçgene döner.',
  'op-amp.belowThisItIs': '(bunun altında yalnızca {gain}x bir evirici olur)',
  'op-amp.blurb': 'Evirici, evirmeyen, toplayıcı, fark, integral alıcı ve karşılaştırıcı modları.',
  'op-amp.classic': 'klasik',
  'op-amp.classic2': 'Klasik',
  'op-amp.closedLoopGain': 'Kapalı çevrim kazancı',
  'op-amp.configuration': 'Yapılandırma',
  'op-amp.db': '({gainDb} dB{inverted})',
  'op-amp.dcBleedCorner': 'DC boşaltma köşesi',
  'op-amp.edgesInWindow': 'Penceredeki kenarlar',
  'op-amp.everythingHereSwingsAbout':
    "Buradaki her şey 0 V çevresinde değil Vbias çevresinde salınır, çünkü tek bir 3,3 V beslemede salınılacak negatif hat yoktur. Bu, eviren bir katın evirmeyen pininin de evirmeyen bir katın Rg bacağının da toprağa değil orta hatta dönmesi demektir. Vbias'ı 0 yapıp çift besleme seçtiğinizde formüller ders kitabındaki hâllerine geri döner.",
  'op-amp.feedbackCf': 'Geri besleme Cf',
  'op-amp.feedbackR1': 'Geri besleme R1',
  'op-amp.feedbackRf': 'Geri besleme Rf',
  'op-amp.fullPowerBandwidth': 'Tam güç bant genişliği',
  'op-amp.gainBandwidth': 'Kazanç bant genişliği',
  'op-amp.gbw': '(GBW / {noiseGain})',
  'op-amp.groundLegRg': 'Toprak bacağı Rg',
  'op-amp.hysteresisBand': 'Histerezis bandı',
  'op-amp.inputBLevel': 'B girişi seviyesi',
  'op-amp.inputBR2': 'B girişi R2',
  'op-amp.inputRin': 'Giriş Rin',
  'op-amp.integratorUnityGain': 'İntegral alıcı birim kazancı',
  'op-amp.inverted': ', evrilmiş',
  'op-amp.lede':
    'İdeal kapalı çevrim kazancı ve gerçekten sınırlayan üç etken: kazanç-bant genişliği çarpımı, yükselme hızı ve çıkış salınımı. Osiloskop, Vin ile Vout izlerini gerçek zamanlı gösterir.',
  'op-amp.lowerThreshold': 'Alt eşik',
  'op-amp.mcp6002Is1Mhz': "MCP6002 1 MHz'dir. OPA2340 5,5 MHz'dir.",
  'op-amp.midRailOnA': 'Tek beslemede orta hat, çift beslemede 0 V.',
  'op-amp.negativeRail': 'Negatif hat',
  'op-amp.network': 'Devre',
  'op-amp.neverTrips': '(hiç tetiklenmez)',
  'op-amp.noiseGain': 'Gürültü kazancı',
  'op-amp.ofTheDcGain': '(DC kazancının %{gainError} kadarı)',
  'op-amp.outputStage': 'Çıkış katı',
  'op-amp.partAndSupply': 'Parça ve besleme',
  'op-amp.partDoesIE': '(parça {slewRate} yapar, yani {e6} V/µs)',
  'op-amp.positiveRail': 'Pozitif hat',
  'op-amp.railsClipAt': '(hatlar {lo} / {hi} noktasında kırpar)',
  'op-amp.railToRail': 'Hattan hatta',
  'op-amp.referenceR2': 'Referans R2',
  'op-amp.referenceVbias': 'Referans Vbias',
  'op-amp.referenceVref': 'Referans Vref',
  'op-amp.responseAt': '{frequency} frekansındaki yanıt',
  'op-amp.rinIntoAVirtual': '(sanal toprağa Rin)',
  'op-amp.rrl': 'rrl',
  'op-amp.slewDemanded': 'İstenen yönelim hızı',
  'op-amp.slewRate': 'Yönelim hızı',
  'op-amp.smallerR1MeansA': 'Küçük R1, geniş bir histerezis bandı demektir.',
  'op-amp.sr2PiVpk': '(SR / 2·pi·Vpk)',
  'op-amp.straightOntoThePin': '(doğrudan pine)',
  'op-amp.subtractedLevel': 'Çıkarılan seviye',
  'op-amp.theComparatorIsThe':
    "Karşılaştırıcı, negatif yerine pozitif geri beslemeli aynı parçadır. Evirmeyen düğüm, R2 üzerinden Vref ile R1 üzerinden çıkış arasındaki bir bölücüde durur, yani `Vth = (Vref·R2 + Vout·R1)/(R1 + R2)` olur. R2, R1'den çok büyükken bu, bildik `Vth = Vref ± Vout·R1/(R1+R2)` ifadesidir ve bant tam olarak `(Vhigh - Vlow)·R1/(R1+R2)` kadardır. Bu banttan küçük hiçbir şey çıkışı titretemez.",
  'op-amp.theory1':
    'Yeterli açık çevrim kazancıyla eviren pin evirmeyen pini izler, yani kazancı yalnızca direnç ağı belirler: evirende `Av = -Rf/Rin`, evirmeyende `Av = 1 + Rf/Rg`, tamponda `Av = 1`. Toplayıcı yükselteç tek bir sanal toprakta süperpozisyondur, `Vout = -Rf·(V1/R1 + V2/R2)`, fark yükselteci ise iki kolda eşleşmiş oranlarla `Vout = Vref + (Rf/Rin)·(V+ - V-)` olur.',
  'op-amp.theScopeTraceIs':
    "Osiloskop izi, örnek örnek yürütülen bir benzetimdir. Her kutup, `y[n] = target + (y[n-1] - target)·e^(-dt/tau)` biçiminde tam sıfırıncı derece tutma ayrıklaştırması kullanır; bu sayede hangi zaman tabanında olursa olsun kararlı kalır. Ardından örnek başına yönelim hızı sınırlaması ve hat kırpması uygulanır, izdeki düz tepelerin ve dik kenarların kaynağı da budur. İntegral alıcı, Cf'ye paralel Rf ile pratikteki haliyle modellenmiştir; böylece bir hatta sürüklenmek yerine sonlu bir DC kazancına sahip olur.",
  'op-amp.timeOnARail': 'Hatta geçen süre',
  'op-amp.title': 'İşlemsel Yükselteç',
  'op-amp.to': '({vmin} - {vmax})',
  'op-amp.upperThreshold': 'Üst eşik',
  'op-amp.use':
    "Bir sensör sinyalini ADC aralığına yükseltmek, yüksek empedanslı bir kaynağı tamponlamak, toplama ve fark alma yapmak, integral almak ve histerezisli karşılaştırma yapmak için kullanılır. Ayrıca DC'de düzgün çalışan bir devrenin hızlandıkça neden bozulduğunu anlamak için de kullanılır: kazanç-bant genişliği sınırı ile yönelim hızı, kitaptaki tasarımı bozuk bir tasarıma çeviren etkenlerdir.",
  'op-amp.vth': 'Vth',
  'op-amp.warn1':
    'Çıkış, pencerenin %{clipped} kadarında bir hatta yapışık kalıyor. Bu noktadan sonra kazanç formülü devreyi artık tanımlamaz: kazancı azaltın, girişi azaltın ya da beslemeyi genişletin.',
  'op-amp.warn2':
    'Yönelim hızıyla sınırlı. Çıkış {slewNeeded} istiyor ama parça yalnızca {slewRate} yapabiliyor, bu yüzden sinüs dalgaları üçgene dönüşüyor ve küçük işaret bant genişliği değeri artık geçerli olmuyor.',
  'op-amp.warn3':
    'Giriş pini besleme aralığının dışına çıkıyor ({vneg} - {vpos} hatlarına karşı {inMin} - {inMax}). Gerçek giriş katları bu noktada çalışmayı durdurur ve bazı parçalarda faz evrilmesi görülür; yani hatların dışındaki bu iz kurgudan ibarettir.',
  'op-amp.warn4':
    'Vbias kullanılabilir çıkış aralığının dışında kaldığından katın salınacak yeri kalmıyor. Tek beslemede bunu pozitif hattın yarısına, yani {vpos} değerine ayarlayın.',
  'op-amp.warn5':
    "İntegral alıcının birim kazanç frekansı ({integratorUnity}), işlemsel yükseltecin GBW değerinden ({gbw}) yalnızca bir dekat uzaklıkta. Kondansatör devreyi ele almadan önce işlemsel yükseltecin açık çevrim kazancı tükeniyor, bu yüzden integral alma temiz kalmıyor. Rin ya da Cf'yi büyütün ya da daha hızlı bir parça seçin.",
  'opt.0Db': '0 dB',
  'opt.11Db': '11 dB',
  'opt.1n40071ASilicon': '1N4007 1 A silisyum',
  'opt.1n4148Signal': '1N4148 işaret',
  'opt.1n54083ASilicon': '1N5408 3 A silisyum',
  'opt.1n5819Schottky': '1N5819 Schottky',
  'opt.25Db': '2,5 dB',
  'opt.6Db': '6 dB',
  'opt.amberYellow': 'Kehribar / sarı',
  'opt.bareWire095': 'Çıplak tel, 0,95',
  'opt.black': 'siyah',
  'opt.ble1Mbps': 'BLE 1 Mbps',
  'opt.blue': 'Mavi',
  'opt.blue2': 'mavi',
  'opt.bridge': 'Köprü',
  'opt.brown': 'kahverengi',
  'opt.bufferUnityGain': 'Tampon (birim kazanç)',
  'opt.centreTap': 'Orta uçlu',
  'opt.coax': 'koaksiyel',
  'opt.coaxDielectric066': 'Koaksiyel yalıtkan, 0,66',
  'opt.comparatorHysteresis': 'Karşılaştırıcı + histerezis',
  'opt.copperForContrast': 'Bakır (karşılaştırma için)',
  'opt.dcStep': 'DC basamak',
  'opt.difference': 'Fark',
  'opt.extended05To': 'Genişletilmiş 0,5 - 2,5 ms',
  'opt.fast400Khz': 'Hızlı 400 kHz',
  'opt.fastPlus1Mhz': 'Hızlı artı 1 MHz',
  'opt.free': 'serbest',
  'opt.freeSpace100': 'Boş uzay, 1,00',
  'opt.gpsL11575Mhz': 'GPS L1 1575 MHz',
  'opt.green': 'yeşil',
  'opt.greenGapOlder': 'Yeşil (GaP, eski)',
  'opt.greenIngan': 'Yeşil (InGaN)',
  'opt.grey': 'gri',
  'opt.ina219Digital': 'INA219 (sayısal)',
  'opt.infrared940Nm': 'Kızılötesi 940 nm',
  'opt.integrator': 'İntegral alıcı',
  'opt.kanthalA1Fecral': 'Kanthal A1 (FeCrAl)',
  'opt.leadAcidSla': 'Kurşun asit (SLA)',
  'opt.lifepo4': 'LiFePO4',
  'opt.liIon18650': 'Li-ion 18650',
  'opt.lipoPouch': 'LiPo poşet',
  'opt.lora433Mhz': 'LoRa 433 MHz',
  'opt.lora868MhzEu': 'LoRa 868 MHz (AB)',
  'opt.lora915MhzUs': 'LoRa 915 MHz (ABD)',
  'opt.loraSf12125Khz': 'LoRa SF12 125 kHz',
  'opt.loraSf7125Khz': 'LoRa SF7 125 kHz',
  'opt.loraSf9125Khz': 'LoRa SF9 125 kHz',
  'opt.narrow10To': 'Dar 1,0 - 2,0 ms, 90 derece',
  'opt.ne555Bipolar': 'NE555 bipolar',
  'opt.nichrome6016Nicr': 'Nikrom 60/16 (NiCr C)',
  'opt.nichrome8020Nicr': 'Nikrom 80/20 (NiCr A)',
  'opt.nimh': 'NiMH',
  'opt.none': 'Yok',
  'opt.nonInverting': 'Evirmeyen',
  'opt.orange': 'turuncu',
  'opt.pcb': 'pcb',
  'opt.pcbMicrostrip055': 'PCB mikroşerit, 0,55',
  'opt.red': 'Kırmızı',
  'opt.red2': 'kırmızı',
  'opt.sawtooth': 'Testere dişi',
  'opt.shuntAmplifier': 'Şönt + yükselteç',
  'opt.stainless304': 'Paslanmaz 304',
  'opt.standard100Khz': 'Standart 100 kHz',
  'opt.standard10To': 'Standart 1,0 - 2,0 ms',
  'opt.summing': 'Toplayıcı',
  'opt.tlc555Cmos': 'TLC555 CMOS',
  'opt.to263D2pak': 'TO-263 (D2PAK)',
  'opt.uv395Nm': 'Morötesi 395 nm',
  'opt.violet': 'mor',
  'opt.white': 'beyaz',
  'opt.wifi5Ghz': 'WiFi 5 GHz',
  'opt.wifi80211b1': 'WiFi 802.11b 1 Mbps',
  'opt.wifi80211nMcs7': 'WiFi 802.11n MCS7',
  'opt.wifiBle24': 'WiFi/BLE 2,4 GHz',
  'opt.wire': 'tel',
  'opt.yellow': 'sarı',
  'photovoltaic.blurb': 'Tek diyot modeli: I-V ve P-V eğrileri, ışınım ve sıcaklığa karşı MPP.',
  'photovoltaic.cellEdge': 'Hücre kenarı',
  'photovoltaic.cellTemperature': 'Hücre sıcaklığı',
  'photovoltaic.conditions': 'Koşullar',
  'photovoltaic.fillFactor': 'Doluluk çarpanı',
  'photovoltaic.fillFactorPmpVoc':
    "Doluluk çarpanı `Pmp / (Voc·Isc)`, eğrinin dirseğinin ne kadar keskin olduğunu ölçer. Seri direnç eğrinin tepesini düzleştirir, paralel direnç ise düz akım bölgesini eğimlendirir; ikisi de FF'yi, sağlıklı bir c-Si modülün gösterdiği 0,75 - 0,82 aralığının altına çeker.",
  'photovoltaic.healthy': '(sağlıklı)',
  'photovoltaic.idealityN': 'İdealite n',
  'photovoltaic.imp': 'Imp',
  'photovoltaic.impRs': 'Imp²·Rs',
  'photovoltaic.irradiance': 'Işınım',
  'photovoltaic.isc': 'Isc',
  'photovoltaic.leakedThroughRsh': 'Rsh üzerinden sızan',
  'photovoltaic.lede':
    "Silisyum bir panelin tek diyot modeli. Osiloskop, I-V ve P-V eğrilerini zamana değil PANEL GERİLİMİNE karşı çizer: yatay eksen 0 V'tan Voc'a kadar uzanır. Güç, akımla aynı ekseni paylaşsın diye 10'a bölünerek ölçeklenmiştir.",
  'photovoltaic.modelParameters': 'Model parametreleri',
  'photovoltaic.overM': '{area} m² üzerinde',
  'photovoltaic.panelDatasheetAtStc': "Panel (veri sayfası, STC'de)",
  'photovoltaic.photocurrentScalesAlmostExactly':
    "Fotoakım neredeyse tam olarak ışınımla ölçeklenir; Isc'nin güneş ışığını doğrusal izlemesinin nedeni budur. Voc yalnızca ışınımın logaritmasıyla değişir, yani buluttaki bir panel geriliminin çoğunu korur ve akımını yitirir.",
  'photovoltaic.pmp': 'Pmp',
  'photovoltaic.pmpAtStc': "STC'de Pmp",
  'photovoltaic.pmpTempCoeff': 'Pmp sıcaklık katsayısı',
  'photovoltaic.poor': '(zayıf)',
  'photovoltaic.seriesLoss': 'Seri kayıp',
  'photovoltaic.shuntLoss': 'Paralel kayıp',
  'photovoltaic.shuntRsh': 'Paralel Rsh',
  'photovoltaic.temperatureWorksTheOther':
    "Sıcaklık ters yönde etki eder. Isc hafifçe yükselir, ama I0 sıcaklıkla birlikte dik biçimde tırmanır; bu yüzden Voc kelvin başına yaklaşık %0,3 düşer ve Pmp'yi de beraberinde götürür. Soğuk ve güneşli bir günün sıcak bir günden daha iyi performans vermesinin nedeni budur; bir diziyi MPPT girişine göre boyutlandırırken panel Vmp değerinin beklenen en düşük sıcaklıkta denetlenmesi gerekmesinin nedeni de budur.",
  'photovoltaic.theory1':
    'Tek diyot modeli `I = Iph - I0·(e^((V + I·Rs)/a) - 1) - (V + I·Rs)/Rsh` şeklindedir; burada `a = Ns·n·k·T/q`, tüm seri dizinin değiştirilmiş ısıl gerilimidir. I için kapalı biçimde çözülemediğinden çözücü, bir formül hesaplamak yerine yineleme yapar.',
  'photovoltaic.title': 'Fotovoltaik Panel',
  'photovoltaic.use':
    "Panel boyutlandırma, bir MPPT kontrolcüsünün neden fiyatına değdiğini ve 100 W etiketli bir panelin bunu neden nadiren verdiğini anlamak için kullanılır. Pratikteki çıkarım sıcaklık katsayısıdır: paneller ısındıkça gerilim kaybeder, bu yüzden 25 °C'deki veri sayfası değerine göre boyutlandırılmış bir dizi, sıcak bir çatıda MPPT giriş aralığının altına düşebilir.",
  'photovoltaic.vmp': 'Vmp',
  'photovoltaic.voc': 'Voc',
  'photovoltaic.vocTempCoeff': 'Voc sıcaklık katsayısı',
  'photovoltaic.warn1':
    "Paralel direnç, belirtilen Voc'yi destekleyemeyecek kadar düşük; bu yüzden model Voc'yi Iph·Rsh değerine doğru çökertiyor. Rsh'yi yükseltin ya da Voc'yi düşürün: bu kadar paralel kaçaklı gerçek bir panel arızalı olurdu.",
  'photovoltaic.warn2':
    '100 W/m² altında tek diyot modeli iyimserleşir. Gerçek paneller az ışıkta doluluk çarpanını bundan daha hızlı yitirir, çünkü paralel kaçak yolu baskın hale gelir.',
  'photovoltaic.warn3': 'Hücre sıcaklığı, bu modelin uyarlandığı aralığın dışında.',
  'pwm-filter.12BitStep': '(12 bit adım {ADC_LSB})',
  'pwm-filter.5Tau': '(5·tau = {settle5tau})',
  'pwm-filter.anRcLowPass':
    "Bir RC alçak geçiren süzgeç DC'de birim kazanca sahiptir ve dikdörtgen dalganın ortalaması `D·Vs` olduğundan, R ve C ne olursa olsun oturmuş çıkış `Vout = D·Vs` olur. R ve C yalnızca anahtarlama bileşeninin ne kadarının sızacağını belirler.",
  'pwm-filter.attenuationAtFPwm': "f_pwm'de zayıflatma",
  'pwm-filter.bitMaxAtThis': '({bits} bit, bu f değerinde en çok {maxBits})',
  'pwm-filter.blurb': 'PWM sinyalini analog gerilime çevirin. Dalgalanmaya karşı oturma süresi.',
  'pwm-filter.dutyResolution': 'Görev çevrimi çözünürlüğü',
  'pwm-filter.dutyStep': 'Görev çevrimi adımı',
  'pwm-filter.esp32GpioIntoAn': "RC alçak geçiren süzgece bağlı ESP32 GPIO'su",
  'pwm-filter.fPwmFc': 'f_pwm / fc',
  'pwm-filter.lede':
    "Bir RC ağına anahtarlanan ESP32 GPIO ucu, yani tek bitlik bir DAC. Yatay eksen zamandır: dalgalanma görünümü birkaç anahtarlama periyodunu, açılış görünümü ise tam 5 tau'luk şarj eğrisini çerçeveler. Dalgalanmayı kendi ölçeğinde görmek için osiloskopta Vpwm izini gizleyin.",
  'pwm-filter.meanOutput': 'Ortalama çıkış',
  'pwm-filter.ofVout': "(Vout'un %{ripplePercent} kadarı)",
  'pwm-filter.peakPinCurrent': 'Tepe pin akımı',
  'pwm-filter.powerOnCapEmpty': '(açılış, kondansatör boş)',
  'pwm-filter.rippleIsUsuallyQuoted':
    'Dalgalanma genellikle `Vpp ≈ Vs·D·(1-D) / (f·R·C)` biçiminde verilir; bu, küçük dalgalanma yaklaşıklığıdır. Bu sayfa denklemi tam olarak çözer: `a = e^(-D·T/tau)` ve `b = e^(-(1-D)·T/tau)` tanımlanıp bir çevrim boyunca şarj ile deşarj eşitlenirse `Vpp = Vs·(1-a)(1-b) / (1-a·b)` elde edilir. tau, anahtarlama periyodunun yaklaşık on katından büyük olduğunda ikisi neredeyse birebir örtüşür; bunun altında yaklaşık formül yüksek okur. En kötü durum dalgalanması her zaman %50 görev çevriminde görülür.',
  'pwm-filter.rippleLimited': '(dalgalanmayla sınırlı)',
  'pwm-filter.rippleOnTheAdc': "ADC'deki dalgalanma",
  'pwm-filter.rippleVpp': 'Dalgalanma Vpp',
  'pwm-filter.scopeWindow': 'Osiloskop penceresi',
  'pwm-filter.startup': 'Açılış',
  'pwm-filter.tau': '(tau = {tau})',
  'pwm-filter.theTraceIsThe':
    'İz, kapalı biçimli yanıttır: `y(t) = y_ss(t) + (y0 - y_ss(0))·e^(-t/tau)`, yani dönemsel kararlı durum artı sönen tek bir üstel terim. Bu, doğrusal ve zamanla değişmeyen bir süzgeç için tam bir çözümdür, dolayısıyla hiçbir zaman tabanında kararsız hale gelemez.',
  'pwm-filter.theTradeoffIsThe':
    "Ödünleşim tam olarak meselenin kendisidir: dalgalanma `1/(R·C)` ile düşer, oturma süresi ise `5·R·C` ile yükselir; birini diğeriyle değiş tokuş etmenin hiçbir kazancı yoktur. Tek bedava kazanç, LEDC zamanlayıcısının görev çevrimi çözünürlüğü tükenene kadar f_pwm'i yükseltmektir; çünkü `2^bits · f` çarpımı 80 MHz'lik APB saatinin altında kalmalıdır.",
  'pwm-filter.title': 'PWM Alçak Geçiren Süzgeç',
  'pwm-filter.use':
    "DAC'ı olmayan bir mikrodenetleyiciden ucuz bir analog çıkış üretmek için kullanılır; ESP32 kullanımının çoğu da budur: bir referans gerilim ayarlamak, analog bir gösterge sürmek, bir fan ya da vana için kontrol gerilimi üretmek. Ödünleşim her zaman aynıdır: daha az dalgalanma, daha yavaş oturma demektir; bu sayfa da kırılma noktasının tam olarak nerede olduğunu gösterir.",
  'pwm-filter.vpwm': 'Vpwm',
  'pwm-filter.warn1':
    "fc, f_pwm değerinin yalnızca {ratio} katı kadar altında kalıyor. {FC_RATIO_GOOD} katı hedefleyin (anahtarlama temel bileşeninde 40 dB); {FC_RATIO_MIN} katının altında RC düzleştirme yapmaz, yalnızca kenarları yuvarlar. f_pwm'i ya da R·C'yi yükseltin.",
  'pwm-filter.warn2':
    "LEDC zamanlayıcısı {f} frekansında {bits} bit çözünürlüğü sağlayamaz. 2^bits · f çarpımı 80 MHz'lik APB saatinin altında kalmalıdır; bu yüzden buradaki üst sınır {maxBits} bittir. Sürücü bu yapılandırmayı reddedecektir.",
  'pwm-filter.warn3':
    "Kondansatör henüz boşken, açılış anındaki tepe pin akımı {gpioPeakA}. Bu değer, bir ESP32 GPIO'su için belirtilen 12 mA sınırının üzerinde. R'yi büyütün.",
  'pwm-filter.warn4':
    'Bu zaman tabanında bir PWM periyodu, bir osiloskop örneğinden daha kısa; bu yüzden Vpwm izi örtüşmeli (aliased) çizilmek yerine hiç gösterilmiyor. Vout kapalı biçimli bir çözüm olduğundan tam kalmaya devam ediyor.',
  'rc-filter.blurb':
    'Birinci derece RC tepkisi, zaman ve frekans düzleminde, canlı osiloskop izleriyle.',
  'rc-filter.cutoffIsWhereThe':
    'Kesim noktası, kondansatörün reaktansının dirence eşitlendiği noktadır; bu yüzden `fc = 1 / (2·pi·R·C)` olur ve çıkış 3 dB düşmüştür.',
  'rc-filter.lede':
    'Bir direnç ve bir kondansatör: elektronikteki en yaygın süzgeç. Herhangi bir değeri değiştirin, osiloskop anında güncellenir.',
  'rc-filter.magnitudeIsH1':
    'Genlik, alçak geçiren için `|H| = 1 / sqrt(1 + (f/fc)²)`, yüksek geçiren için ise `(f/fc) / sqrt(1 + (f/fc)²)` olarak bulunur. Faz ise sırasıyla `-atan(f/fc)` ve `90° - atan(f/fc)`dir.',
  'rc-filter.rcNetwork': 'RC devresi şeması',
  'rc-filter.reactanceXc': 'Reaktans Xc',
  'rc-filter.theScopeTraceIs':
    'Osiloskop izi o formülün kendisi değildir. Tam sıfırıncı derece tutma ayrıklaştırmasıyla örnek örnek yürütülen bir benzetimdir: `y[n] = x[n] + (y[n-1] - x[n])·e^(-dt/tau)`. Bu, her adım boyunda kararlı kalır ve frekans bölgesindeki bir yanıtın gösteremeyeceği kırpmayı, çınlamayı ve PWM kenarlarını da üretir.',
  'rc-filter.title': 'RC Süzgeç (Alçak / Yüksek Geçiren)',
  'rc-filter.use':
    'Elektronikteki en yaygın süzgeç. PWM çıkışını analog gerilime dönüştürmek, sensör hattındaki anahtarlama gürültüsünü temizlemek, ADC önünde örtüşme önleme (anti-aliasing) yapmak ve ses tonu kontrollerinde eğimi belirlemek için kullanılır. Kesim frekansını yanlış seçerseniz ya gidermek istediğiniz gürültüyü geçirirsiniz ya da korumak istediğiniz sinyali fazlasıyla zayıflatırsınız.',
  'reactive-power.afterCorrection': 'Düzeltmeden sonra',
  'reactive-power.apparentPowerS': 'Görünür güç S',
  'reactive-power.bankReactance': 'Grup reaktansı',
  'reactive-power.bankVoltageRating': 'Grup gerilim değeri',
  'reactive-power.blurb':
    'Aktif, reaktif ve görünür güç, güç katsayısını düzeltmek için gereken kondansatörle.',
  'reactive-power.cableLossAfter': 'Sonrasında kablo kaybı',
  'reactive-power.cableLossBefore': 'Öncesinde kablo kaybı',
  'reactive-power.cableResistance': 'Kablo direnci',
  'reactive-power.capacitive': 'Kapasitif',
  'reactive-power.correctionAddsAShunt':
    "Düzeltme, Q'yu kablo boyunca sürüklemek yerine yerinde sağlayan paralel bir reaktans ekler: `Qc = P·(tan(phi1) - tan(phi2))`, buradan da `C = Qc / (2·pi·f·V²)` çıkar. Yük yine aynı Q'yu çeker, yalnızca bu kez kilometrelerce ötedeki bir jeneratörden değil bir metre ötedeki kondansatörden gelir.",
  'reactive-power.correctionNeeded': 'Gereken düzeltme',
  'reactive-power.currentAfter': 'Düzeltmeden sonraki akım',
  'reactive-power.currentLags': 'akım geride kalır',
  'reactive-power.currentLeads': 'akım öne geçer',
  'reactive-power.handedBackEachCycle': 'her çevrimde geri verilen',
  'reactive-power.inductive': 'Endüktif',
  'reactive-power.lede':
    'Akımın gerilimin gerisinde kalmasını ve anlık gücün negatife düşmesini izleyin. Bu negatif çukur, yükün ödünç alıp hemen geri verdiği enerjidir; kablo ise bunu boşuna iki yönde de taşımak zorunda kalır. Akım ve güç izleri gerilim eksenine ölçeklenmiştir, gerçek değerler ise göstergelerde yer alır.',
  'reactive-power.lineCurrent': 'Hat akımı',
  'reactive-power.lineVoltage': 'Hat gerilimi',
  'reactive-power.lower': '%{currentReduction} daha düşük',
  'reactive-power.minimum': 'en az',
  'reactive-power.peakPT': 'Tepe p(t)',
  'reactive-power.phaseAngle': 'Faz açısı',
  'reactive-power.presentPf': 'Mevcut PF',
  'reactive-power.reactiveEnergyDay': 'Günlük reaktif enerji',
  'reactive-power.reactivePowerQ': 'Reaktif güç Q',
  'reactive-power.realPower': 'Aktif güç',
  'reactive-power.realPowerP': 'Aktif güç P',
  'reactive-power.reverseFlowPeak': 'Ters akış tepesi',
  'reactive-power.saves': '{lossSaved} tasarruf',
  'reactive-power.shuntCapacitor': 'Paralel kondansatör',
  'reactive-power.shuntInductor': 'Paralel bobin',
  'reactive-power.targetPf': 'Hedef PF',
  'reactive-power.thatIsWhatThe':
    "İzdeki p(t) eğrisinde görülen negatife inen çukur işte budur. Anlık güç `P + S·cos(2wt - phi)` olduğundan `P ± S` arasında salınır. S, P'yi aştığında, yani güç katsayısı tam olarak 1'in altına düştüğü anda, çukur sıfırın altına iner ve güç geriye doğru akar.",
  'reactive-power.theory1':
    "Sinüs biçimli bir beslemede `S = Vrms·Irms`, `P = S·cos(phi)` ve `Q = S·sin(phi)` olur. İş yapan yalnızca P'dir. Q, her yarım çevrimde yükün manyetik alanına gidip geri gelen enerjidir ve kablo onu iki yönde de taşır.",
  'reactive-power.thePayoffIsI':
    "Kazanç I²R'de gizlidir. Kablo kaybı akımın karesiyle düştüğünden, güç katsayısını 0,75'ten 0,95'e çıkarmak akımı yaklaşık %21, kablo kaybını da yaklaşık %38 azaltır. Şebeke işletmelerinin sanayi tesislerine reaktif güç üzerinden fatura kesmesinin nedeni de budur: iletkenleri işgal eder ama enerji sayacında görünmez.",
  'reactive-power.title': 'Reaktif Enerji / Güç Katsayısı',
  'reactive-power.use':
    "Reaktif güç üzerinden faturalandırılan sanayi tesisleri, motor yükleri ve 3 kW'lık bir motorun neden 3 kVA'dan fazla beslemeye ihtiyaç duyduğunu anlamak için kullanılır. Pratikteki kazanç kablo kaybı karşılaştırmasındadır, çünkü güç katsayısını düzeltmek akımı azaltır ve kayıp da akımın karesiyle düşer.",
  'reactive-power.warn1':
    'Hedef güç katsayısı şimdikiyle aynı ya da daha düşük, yani düzeltilecek bir şey yok. Hedefi {pf} üzerine çıkarın.',
  'reactive-power.warn2':
    'Bu yük zaten ileri fazda, yani düzeltmek için kondansatör değil paralel bir *bobin* gerekir. Büyük ölçekte kapasitif yükler olağandışıdır: uzun ve az yüklü kablolar ile büyük süzgeç grupları alışılmış nedenlerdir.',
  'reactive-power.warn3':
    'Bunlar şebeke gerilimleridir. Bir düzeltme kondansatörü ayrıldıktan sonra yüklü kalır ve boşaltma dirençleri taşımak zorundadır; ayrıca en az {capVoltageRating} RMS için seçilmelidir.',
  'rectifier.1NfIsEffectively': '1 nF neredeyse hiç düzleştirme yapmaz',
  'rectifier.at': '{fRipple} değerinde',
  'rectifier.averagePerDiode': 'Diyot başına ortalama',
  'rectifier.blurb': 'Filtre kondansatörlü yarım ve tam dalga. Dalgalanma, PIV ve diyot güç kaybı.',
  'rectifier.conduction': '{conductionAngle}° iletim',
  'rectifier.dcOutput': 'DC çıkış',
  'rectifier.diode': 'Diyot',
  'rectifier.diodeDissipation': 'Diyot güç kaybı',
  'rectifier.eachDiodes': 'her biri {pDiodePer}, {topology} diyot',
  'rectifier.everyCoulombDeliveredTo':
    "Yüke ulaşan her kulon `n` jonksiyondan geçer, bu yüzden iletim kaybı devredeki diyotlar arasında paylaşılan `n·Vf·Idc` olur. Akım zaman içinde eşit dağılmaz: diyotlar yalnızca tepelerin yakınında iletime geçer, bu yüzden tepe akım `Idc`'nin kat kat üzerindedir; iletim açısının ve tepe çarpanının göstergede yer almasının nedeni de budur. Bu sıçramayı sınırlayan şey kaynak direncidir ve gerçek bir trafoda bir miktarı vardır.",
  'rectifier.io': '{id} IO {io}',
  'rectifier.lede':
    'Yarım dalga, tam dalga köprü ya da orta uçlu doğrultma; bir depo kondansatörü ve dirençli bir yükle. Osiloskop sekonderi, düzleştirilmiş çıkışı ve aynı doğrultucunun kondansatörü çıkarıldığında verdiği sonucu gösterir.',
  'rectifier.noCap': 'Kondansatörsüz',
  'rectifier.peakDiodeCurrent': 'Tepe diyot akımı',
  'rectifier.peakInverseVoltageIs':
    "Diyotları asıl öldüren şey tepe ters gerilimdir (PIV). Bir köprü diyodu tek bir `Vpeak` bloke eder. Yarım dalga ya da orta uçlu bir diyotta ise anotta negatif tepe varken kondansatör katodu `Vdc` seviyesinde tutar, yani diyot `Vpeak + Vdc`, başka deyişle yaklaşık `2·Vpeak` bloke etmek zorunda kalır. 12 V'luk bir ikincil sargı bile daha şimdiden 34 V'luk bir PIV demektir.",
  'rectifier.pivPerDiode': 'Diyot başına PIV',
  'rectifier.ppFormula': 'tepeden tepeye, formül {vripple}',
  'rectifier.rectifier': 'Doğrultucu şeması',
  'rectifier.rectifier2': 'Doğrultucu',
  'rectifier.reservoirCap': 'Depo kondansatörü',
  'rectifier.rippleFactor': 'Dalgalanma çarpanı',
  'rectifier.rmsPeak': 'rms, {vPeakIn} tepe',
  'rectifier.rmsPerDiode': 'Diyot başına RMS',
  'rectifier.secondary': 'İkincil',
  'rectifier.sourceResistance': 'Kaynak direnci',
  'rectifier.textbook': 'ders kitabı {vdc}',
  'rectifier.theCapChargesTo':
    "Kondansatör diyotlar üzerinden tepe değere kadar dolar, ardından bir sonraki tepeye kadar yükü tek başına besler. Bu deşarjı doğrusal kabul etmek `Vr = Idc / (fr·C)` verir; burada `fr`, yarım dalga doğrultucu için şebeke frekansı, köprü ya da orta uçlu doğrultucu için ise `2f`'dir, çünkü ikisi de yarım dalganın bıraktığı boşluğu doldurur. Çıkış bu testere dişi dalganın ortasında, `Vdc = Vpeak - n·Vf - Vr/2` noktasında oturur; `n`, köprüde 2, diğer ikisinde 1'dir.",
  'rectifier.theTraceIsNot':
    "İz, formülün kendisi değildir. İki alt devre arasında geçiş yapan, örnek örnek yürütülen bir çözümdür: iletim hali (Rs arkasındaki kaynaktan C'ye paralel RL'ye) ve kesim hali (C'nin RL üzerinden boşalması); her ikisi de tam sıfırıncı derece tutma ayrıklaştırmasıyla, `v[n] = vInf + (v[n-1] - vInf)·e^(-dt/tau)`, hesaplanır. Bu, her adım boyunda kararlı kalır. Aynı zamanda ölçülen dalgalanmanın neden formülün altında çıktığını da açıklar: kondansatör yalnızca çevrimin diyotların kapalı olduğu bölümünde, doğrusal değil üstel biçimde boşalır.",
  'rectifier.title': 'Diyot Doğrultucu',
  'rectifier.use':
    'Şebekeden ya da bir transformatörden beslenen her kaynak ve USB dışı çoğu adaptörün ön katı için geçerlidir. Filtre kondansatörünüzün bıraktığı dalgalanmayı, ardından gelen regülatörün düşüm (dropout) bölgesine girip girmeyeceğini belirleyen değeri, ayrıca diyotların dayanması gereken ters tepe gerilimini gösterir.',
  'rectifier.vrrm': '{id} VRRM {vrrm}',
  'rectifier.vsec': 'Vsec',
  'rectifier.warn1':
    'İkincil tepe gerilim {vPeakIn}, {vf} diyot düşümünün altında kalıyor. Bu yüzden hiçbir zaman iletime geçilmez.',
  'rectifier.warn2':
    "PIV {piv}, {id} parçasının VRRM değeri olan {vrrm}'i aşıyor. Diyot ters yönde delinir.",
  'rectifier.warn3':
    "Diyot başına düşen {iAvgPerDiode} ortalama akım, {id} parçasının IO değeri olan {io}'yu aşıyor.",
  'rectifier.warn4':
    "Tepe şarj akımı {iPeak}, {id} parçasının IFSM değeri olan {isurge}'yi aşıyor. Seri direnç ya da yumuşak başlatma ekleyin.",
  'rectifier.warn5':
    'Yarım dalga, ikincil üzerinden DC çeker ve bu da trafo çekirdeğini doyuma doğru sürükler. Birkaç miliamperlik yükler için sorun değildir, bir güç kaynağı için değildir.',
  'rectifier.warn6':
    'Dalgalanma, çıkışın %{rippleFactor} kadarı. Vdc = Vpeak - Vr/2 yaklaşıklığı yalnızca küçük dalgalanmalarda geçerlidir, o yüzden ders kitabı değeri yerine ölçülen ize güvenin.',
  'rectifier.windingPlusDiodeBulk':
    'Sargı artı diyot gövde direnci. Tepe şarj akımını bu belirler.',
  'rectifier.xIdc': '{crestFactor}x Idc',
  'resistive-heating.5Tau': '5 tau',
  'resistive-heating.alloy': 'Alaşım',
  'resistive-heating.at20C': "20 °C'de",
  'resistive-heating.atEquilibrium': 'dengede',
  'resistive-heating.atServiceTemp': 'servis sıcaklığında',
  'resistive-heating.awg': 'AWG',
  'resistive-heating.belowEquilibrium': '(dengenin altında)',
  'resistive-heating.blurb':
    'Nikrom ve pirograf uçları: tel boyutlandırma, güç ve sıcaklığa ulaşma süresi.',
  'resistive-heating.convectionH': 'Taşınım h',
  'resistive-heating.currentLimit': 'Akım sınırı',
  'resistive-heating.driveAndEnvironment': 'Sürüş ve ortam',
  'resistive-heating.element': 'Eleman',
  'resistive-heating.elementMakersSizeOn':
    'Eleman üreticileri boyutlandırmayı toplam güce göre değil yüzey yüküne, yani tel yüzeyinin metrekaresi başına düşen watta göre yapar. Aynı güçteki iki eleman, biri bu gücü yarı yüzeye sığdırıyorsa çok farklı davranır.',
  'resistive-heating.energyToTarget': 'Hedefe kadar enerji',
  'resistive-heating.equilibriumTemp': 'Denge sıcaklığı',
  'resistive-heating.holdDuty': 'Tutma görev çevrimi',
  'resistive-heating.inrushCurrent': 'Ani akım',
  'resistive-heating.lede':
    'Nikrom ve Kanthal rezistanslar: pirograf uçları, köpük kesiciler, küçük fırınlar. Osiloskop, tel sıcaklığını °C, harcanan gücü ise W cinsinden zamana karşı gösterir; sonsuza kadar yükselmek yerine dengede oturur.',
  'resistive-heating.length': 'Uzunluk',
  'resistive-heating.limitC': 'sınır {maxTemp} °C',
  'resistive-heating.over100': '%100 üzeri',
  'resistive-heating.powerCold': 'Soğuk güç',
  'resistive-heating.powerSettled': 'Oturmuş güç',
  'resistive-heating.radiatedShare': 'Işıma payı',
  'resistive-heating.resistanceCold': 'Soğuk direnç',
  'resistive-heating.resistanceDriftsWithTemperature':
    'Direnç sıcaklıkla da kayar, yani oturmuş güç açılış anındaki güç değildir. Benzetimin her adımda gücü sabit tutup tam çözümü uygulamasının nedeni budur: geri besleme her gerçek eleman alaşımında negatiftir, çünkü daha sıcak tel daha çok direnç, daha çok direnç de daha az güç demektir; bu yüzden sistem kaçmak yerine yakınsar.',
  'resistive-heating.resistanceHot': 'Sıcak direnç',
  'resistive-heating.restIsConvection': 'gerisi taşınım',
  'resistive-heating.settledCurrent': 'Oturmuş akım',
  'resistive-heating.settlingTime': 'Oturma süresi',
  'resistive-heating.sizeBy': 'Boyutlandırma ölçütü',
  'resistive-heating.surfaceLoad': 'Yüzey yükü',
  'resistive-heating.targetTemperature': 'Hedef sıcaklık',
  'resistive-heating.temperatureIsNotThat':
    'Sıcaklık o formülle bulunmaz. Tel şu dengeye uyar: `m·c·dT/dt = P - h·As·(T - Tamb)`. Kayıp terimi sıcaklıkla büyüdüğü için tel sonsuza tırmanmak yerine `Tamb + P/(h·As)` değerinde oturur. İzin yakınsadığı denge noktası budur ve `m·c/(h·As)` zaman sabiti uzunluktan bağımsızdır: daha uzun bir telin hem kütlesi hem de yüzeyi orantılı olarak artar.',
  'resistive-heating.theory1':
    'Direnç `R = rho·L/A` ile bulunur, yani sabit bir beslemede güç `P = V²/R` olur. Uzunluğu yarıya indirmek direnci yarıya indirir, gücü ise ikiye katlar; insanların bir kalem ucunu kazara yakmasının olağan yolu budur.',
  'resistive-heating.thermalTau': 'Isıl tau',
  'resistive-heating.timeToTarget': 'Hedefe varma süresi',
  'resistive-heating.title': 'Dirençli Isıtma',
  'resistive-heating.use':
    'Pirograf kalemleri, sıcak tel köpük kesiciler, 3D yazıcı sıcak uçları ve nozulları, küçük fırınlar ve lehim ekipmanları. Buradaki anahtar çıktı denge sıcaklığıdır: rezistans teli, harcanan gücün soğumaya eşit olduğu noktada oturur; bu yüzden aynı tel ve gerilim durgun havada, cereyanda ya da yalıtıma gömülüyken tamamen farklı davranır.',
  'resistive-heating.warn1':
    'Denge sıcaklığı, {label} için geçerli {maxTemp} °C sürekli çalışma sınırının üzerinde. Eleman hızla oksitlenir ve erken bozulur. Daha kalın tel, daha uzun bir boy ya da daha düşük gerilim kullanın.',
  'resistive-heating.warn2':
    'Hedef, denge sıcaklığının üzerinde; bu yüzden tel ne kadar uzun çalışırsa çalışsın oraya ulaşamaz. Beslemeyi yükseltin ya da soğutmayı azaltın.',
  'resistive-heating.warn3':
    'Bakır burada karşılaştırma için var, eleman yapmak için değil. Sıcaklık katsayısı nikromunkinin kabaca 80 katıdır; bu yüzden ısındıkça direnci ve dolayısıyla gücü çılgınca oynar, ayrıca eleman sıcaklıklarında hızla oksitlenip yok olur.',
  'resistive-heating.wireMass': 'Tel kütlesi',
  'resistor-code.4Band': '4 bant',
  'resistor-code.5Band': '5 bant',
  'resistor-code.bands': 'Bantlar',
  'resistor-code.blurb':
    'Dört ve beş bantlı renkler, ayrıca 3 haneli, 4 haneli ve EIA-96 SMD kodları.',
  'resistor-code.brown1': 'kahverengi, %1',
  'resistor-code.colourBands': 'Renk bantları',
  'resistor-code.eia96IsThe':
    "EIA-96, minik %1'lik parçalar için sıkıştırılmış bir düzendir: iki basamak E96 serisinin 96 değerinden birine işaret eder, bir harf de çarpanı verir. Yani 68C, 68. E96 değeri olan 499'un 100 katı, yani 49,9 kΩ demektir. Yoğundur ama tabloyu gerektirir.",
  'resistor-code.gold5': 'altın, %5',
  'resistor-code.lede':
    'Renk bantları ve SMD kodları aynı şeyi kodlar: bir mantis ve onun on kuvveti. Bir değer girin ve her gösterimde geri okuyun.',
  'resistor-code.matchingSeries': 'Eşleşen seri',
  'resistor-code.range': 'Aralık',
  'resistor-code.red2': 'kırmızı, %2',
  'resistor-code.silver10': 'gümüş, %10',
  'resistor-code.smd3Digit': 'SMD 3 rakam',
  'resistor-code.smd4Digit': 'SMD 4 rakam',
  'resistor-code.smdCodesWorkThe':
    'SMD kodları aynı biçimde çalışır. Üç rakam iki basamak artı bir üstür; yani 472, 47 × 10², yani 4,7 kΩ demektir. Dört rakam üç basamak artı bir üstür; yani 4701, 470 × 10¹, yine 4,7 kΩ eder. Son basamağın değerin kendisinde bir sıfır anlamına gelmediğine dikkat edin, bu nokta insanları sürekli yanıltır.',
  'resistor-code.theory1':
    "Her işaretleme düzeni bir mantis ve bir çarpan kodlar. Dört bant iki anlamlı basamak verir ve E24 ile E12'den seçilen %5'lik ve %10'luk parçalarda kullanılır. Beş bant ise E96 ve E48'den gelen %1'lik ve %2'lik parçalar için üç basamak verir. Fazladan basamağın nedeni, daha dar bir toleransın işe yaraması için daha ince bir değer ızgarasının gerekmesidir.",
  'resistor-code.title': 'Direnç Renk / SMD Kodu',
  'resistor-code.tolerance': 'Tolerans',
  'resistor-code.toleranceAndSeriesAlways':
    "Tolerans ile seri her zaman eşleşir ve bu bir rastlantı değildir. Her serideki boşluklar, komşu değerler tolerans sınırlarında tam birbirine değecek biçimde ayarlanmıştır: E24'te boşluklar yaklaşık %5, E96'da ise yaklaşık %1'dir. E12 anma değerinde %1'lik bir parça almak anlamsızdır, çünkü gerçekte aradığınız değere daha yakın bir E96 değeri zaten vardır.",
  'resistor-code.toleranceBand': 'Tolerans bandı',
  'resistor-code.use':
    "Çekmeceden yeni çıkardığınız bir parçayı okurken ya da bir BOM'da işaretlerken işinize yarar. Renk bantlarını ve tablo olmadan okunamayan EIA-96 dahil üç SMD şemasının tamamını kapsar, tolerans ile E-serisinin neden her zaman birlikte gittiğini de gösterir.",
  'resistor-code.value': 'Değer',
  'resistor-code.warn1':
    "Bu değer E96 serisinin bir üyesi değil, bu yüzden bir EIA-96 kodu yok. EIA-96 işaretlemesi yalnızca, tanımı gereği E96'dan seçilen %1'lik parçalar için vardır. 4,7 kΩ %5'lik bir parça E24 değeridir ve bunun yerine 472 ya da 4701 olarak işaretlenir.",
  'resistor-code.warn2':
    '10 Ω altındaki değerler SMD parçalarda R gösterimini kullanır; burada R ondalık ayracın yerini tutar: 4R7, 4,7 Ω demektir, R22 ise 0,22 Ω. Yalın rakam kodları bir kesri ifade edemez.',
  'rl-filter.anInductorOpposesA':
    'Bir bobin, kondansatörün gerilim değişimine karşı koyduğu gibi akım değişimine karşı koyar; bu yüzden RC sayfasının tamamı buraya eşlenir: `R·C` yerine `tau = L / R`, `1 / (2·pi·R·C)` yerine `fc = R / (2·pi·L)` gelir. Reaktans ise ters yönde işler: `XL = 2·pi·f·L` frekansla yükselirken `Xc` düşer; çıkışın direnç üzerinde alınmasının burada alçak geçiren, orada ise yüksek geçiren olmasının nedeni budur.',
  'rl-filter.blurb': 'Endüktif birinci derece filtre, RC durumunun ikizi.',
  'rl-filter.coilDcrSlideTo': "Bobin DCR'si. İdeal durum için en alta kaydırın.",
  'rl-filter.datasheetIsatPastThis':
    'Veri sayfası Isat değeri. Bunun ötesinde çekirdek pes eder ve L çöker.',
  'rl-filter.db': '-∞ dB',
  'rl-filter.dcFeedthroughDcr': 'DC sızması (DCR)',
  'rl-filter.isat': '(Isat {isat})',
  'rl-filter.lede':
    "RC filtrenin ikizi: kondansatörü bir bobinle değiştirin, köşe frekansı R/L'ye kayar. Sargı direnci modelin bir parçasıdır, çünkü gerçek RL filtrelerin kitaptaki gibi davranmasını engelleyen şey tam olarak budur.",
  'rl-filter.magnitudeIsHR':
    'Genlik, alçak geçiren için `|H| = R / |Z|`, yüksek geçiren için `sqrt(Rw² + XL²) / |Z|` olur; burada `|Z| = sqrt((R + Rw)² + XL²)`. Kayıpsız bir sargıda bunlar bildik `1 / sqrt(1 + (f/fc)²)` ve `(f/fc) / sqrt(1 + (f/fc)²)` ifadelerine, faz da `-atan(f/fc)` ve `90° - atan(f/fc)` ifadelerine indirgenir.',
  'rl-filter.passbandLossDcr': 'Geçirme bandı kaybı (DCR)',
  'rl-filter.rlNetwork': 'RL devresi şeması',
  'rl-filter.rTotal': '(toplam R {rTotal})',
  'rl-filter.theScopeTraceIs':
    "Osiloskop izi transfer işlevi değildir. Çözücü, çevrim akımının integralini `L·di/dt = v - i·(R + Rw)` denklemiyle, tam sıfırıncı derece tutma ayrıklaştırmasıyla alır: `i[n] = i∞ + (i[n-1] - i∞)·e^(-dt/tau)`. Bu, her adım büyüklüğünde kararlıdır ve iki eleman gerilimi de doğrudan Kirchhoff gerilim yasasından çıkar; yani `V(R) + V(L)` örnek örnek Vin'e eşittir.",
  'rl-filter.title': 'RL Filtre',
  'rl-filter.use':
    'Bobinler hacimli ve pahalı olduğu için RC kadar yaygın değildir, ama gerilim yerine akımın düzeltilmesi gerektiğinde kaçınılmazdır: motor sürücü filtreleri, anahtarlamalı dönüştürücü çıkış katları ve besleme hatlarındaki EMI bobinleri. Ayrıca filtre olmasını hiç istemediğiniz her sargının, örneğin uzun bir kablo çiftinin ya da röle bobininin, doğal modelidir.',
  'rl-filter.warn1':
    "Tepe bobin akımı {ipk}, {isat} doyum değerinin ötesinde. Doyuma giren bir çekirdek endüktansını yitirir, yani gerçek köşe frekansı yukarı tırmanır ve bu iz artık geçerli değildir. R'yi büyütün, daha büyük bir çekirdek seçin ya da sürüşü kısın.",
  'rl-filter.warn2':
    "Tepe akım {ipk}, bir ESP32 pininin verebileceği {GPIO_MAX_MA} mA sınırını aşıyor. Bu devreyi doğrudan bir GPIO'dan değil, bir tampon ya da MOSFET üzerinden sürün.",
  'rl-filter.windingResistance': 'Sargı direnci',
  'rl-filter.windingResistanceIsIn':
    'Sargı direnci devrenin her yeriyle seri bağlıdır, bu yüzden hiçbir zaman devre dışı kalmaz. Köşe frekansını yükseltir (fc, R + Rw kullanır), alçak geçirenin geçirme bandından bir pay götürür ve yüksek geçirene `Rw / (R + Rw)` değerinde bir DC sızma tabanı bırakır. Çekirdek doyumu ve öz-rezonansla birlikte bu, işaret seviyesindeki süzgeçlerin neden kondansatörlerden kurulduğunun ve bobinlerin neden güç uygulamalarına saklandığının nedenidir.',
  'rlc-resonance.blurb': 'Seri ve paralel rezonans, sönümleme ve basamak çınlaması.',
  'rlc-resonance.checkIsat': "(Isat'ı denetleyin)",
  'rlc-resonance.dampingAlpha': 'Sönüm alfa',
  'rlc-resonance.dampingZeta': 'Sönüm zeta',
  'rlc-resonance.drive': '(sürüş {drive})',
  'rlc-resonance.fromThereBwF0':
    "Oradan `BW = f0 / Q`, `zeta = 1 / (2Q) = alpha / w0` çıkar ve çınlama frekansı `wd = w0·sqrt(1 - zeta²)` olur. zeta 1'in altındaysa çınlar, 1'e eşitse kritik sönümdür (aşımsız en hızlı oturma), 1'in üstündeyse çınlamadan sürünerek oturur. İlk tepe aşımı `exp(-pi·zeta / sqrt(1 - zeta²))` olup zeta = 0'da %100'dür; kayıpsız bir basamağın beslemeyi ikiye katlamasının nedeni budur.",
  'rlc-resonance.halfPowerBand': 'Yarı güç bandı',
  'rlc-resonance.idealLAndC': '(ideal L ve C, aşağıya bakın)',
  'rlc-resonance.impedanceZ0': 'Empedans Z0',
  'rlc-resonance.lede':
    "Bir RLC ağının basamak tepkisi. Yatay eksen zamandır, iz ise kondansatör gerilimidir (seri) ya da tank düğüm gerilimidir (paralel). Çınlamayı görmek için R'yi düşürün, sönümlemek için yükseltin.",
  'rlc-resonance.overshoot': 'Aşım',
  'rlc-resonance.parallelHereIsDriven':
    "Buradaki paralel devre Thevenin biçiminde sürülür, yani kaynak R üzerinden L-C düğümünü besler. Bu, R || L || C üzerine `Vin/R` akım basamağı uygulamakla aynı devredir, dolayısıyla paralel Q burada da geçerlidir. Çıkışın sıfıra sönmesinin nedeni, bobinin DC'de kısa devre olmasıdır.",
  'rlc-resonance.peakVout': 'Tepe Vout',
  'rlc-resonance.rForCritical': 'Kritik sönüm için R',
  'rlc-resonance.ringFrequencyFd': 'Çınlama frekansı fd',
  'rlc-resonance.rlcNetwork': 'RLC devresi şeması',
  'rlc-resonance.rSetsHowFast':
    'Depolanan enerjinin ne kadar hızlı sızacağını R belirler. Seri devrede: `Q = (1/R)·sqrt(L/C)` ve `alpha = R / (2L)`. Paralel devrede: `Q = R·sqrt(C/L)` ve `alpha = 1 / (2·R·C)`. İkisi, karakteristik empedans `Z0 = sqrt(L/C)` çevresinde birbirinin tersidir; yani yüksek Q için seri devre küçük R, paralel devre ise büyük R ister.',
  'rlc-resonance.sqrtLC': '(sqrt(L/C))',
  'rlc-resonance.theory1':
    "Rezonans, iki reaktansın birbirini götürdüğü noktadır, `Xl = Xc`; buradan `f0 = 1 / (2·pi·sqrt(L·C))` çıkar. R'ye bağlı değildir.",
  'rlc-resonance.theTraceIsA':
    'İz, `[Vc, Il]` durum çiftinin tam sıfırıncı derece tutma ayrıklaştırmasıyla iki durumlu benzetimidir: `x[n+1] = xss + e^(A·dt)·(x[n] - xss)`. Matris üsteli kapalı biçimde ifade edilir, yani çözücü parçalı sabit bir sürüş için tamdır ve her adım büyüklüğünde kararlıdır. Rezonanslı ikinci dereceden bir sistemde ileri Euler, `dt &gt; 2/w0` olur olmaz ıraksar.',
  'rlc-resonance.title': 'RLC Rezonansı',
  'rlc-resonance.use':
    'Radyo ön katlarındaki ayarlı devreler, kristal ve LC osilatörler ve EMI filtreleri. En az o kadar sık istemeden de ortaya çıkar: kaçak kapasitesi olan her endüktans çınlar; anahtarlama düğümlerinin aşım yapmasının ve bir dekuplaj kondansatörüne giden uzun besleme hattının salınmasının nedeni de budur. f0 ve Q değerlerini bilmek, devrenin bir kez mi yoksa yüz çevrim boyunca mı çınlayacağını söyler.',
  'rlc-resonance.warn1':
    'Kondansatör, {drive} sürüşte {peakVout} değerine ulaşıyor. Sönümsüz bir seri RLC, beslemenin yaklaşık 2 katında tavan yapar; bu yüzden kondansatörü ve anahtarlama elemanını hat gerilimine göre değil bu tepe değere göre seçin. Seri R ya da bir snubber ekleyin.',
  'rlc-resonance.warn2':
    "{HIGH_Q_LIMIT} üzerindeki bir Q, kayıpsız bir L ve C varsayar. Gerçek bir bobinin sargı direnci ile çekirdek kaybı ve buna ek olarak kondansatörün ESR'si, ikisi de çevrimin içindedir ve ölçülen Q'yu bunun epey altında tutar. Gerçekçi bir sonuç için bobinin DCR'sini R'ye katın.",
  'rlc-resonance.warn3':
    'Osiloskop penceresi, çınlama çevrimi başına yalnızca {perRing} örnek tutuyor, yani çizilen iz örtüşmelidir (alias). Yukarıdaki sayılar yine de tamdır; izden değil kapalı biçimli çözümden gelirler. Gerçek çınlamayı görmek için pencereyi kısaltın ya da kaynak frekansını yükseltin.',
  'servo-pwm.actualAngle': 'Gerçek açı',
  'servo-pwm.actualPulse': 'Gerçek darbe',
  'servo-pwm.angle': 'Açı',
  'servo-pwm.angularResolution': 'Açısal çözünürlük',
  'servo-pwm.asked': 'istenen {angle}°',
  'servo-pwm.at50HzThe':
    "50 Hz'de LEDC zamanlayıcısı 20 bite kadar izin verir, yani cimri davranmanın anlamı yok: 16 bit kullanın, hareket boyunca binlerce adım elde edersiniz; bu da servonun kendi potansiyometresinin ve dişli kutusunun çözebileceğinin epey ötesindedir.",
  'servo-pwm.blurb':
    'Seçilen zamanlayıcı çözünürlüğünde açıdan darbe genişliğine, oradan da görev sayacına.',
  'servo-pwm.countsOverTravel': 'Hareket boyunca adım',
  'servo-pwm.frameRate': 'Çerçeve hızı',
  'servo-pwm.framesShown': 'Gösterilen çerçeve',
  'servo-pwm.ledcTimer': 'LEDC zamanlayıcısı',
  'servo-pwm.lede':
    "Bir hobi servosu, görev oranını değil darbenin genişliğini okur ve 20 ms'lik çerçevenin geri kalanını yok sayar. Bu da görev oranı çözünürlüğünü sınırlayıcı etken hâline getirir: yazmaç aralığının yalnızca %5 ila %10'u bir işe yarar. Osiloskop, işaret ucunu birkaç çerçeve boyunca gösterir.",
  'servo-pwm.maxResolutionAtFrame': 'Bu çerçeve hızında en yüksek çözünürlük',
  'servo-pwm.ofTheFrame': 'çerçevenin',
  'servo-pwm.ofTotal': 'toplam {bits} içinden',
  'servo-pwm.oneWiringNoteThe':
    "Bir kablolama notu: işaret pini 3,3 V'ta sorunsuzdur, çünkü servolar onu mantık seviyesi olarak okur; ama motorun kendisi 5 V ya da üstünü ister ve tıkandığında amperlerce akım çeker. Bir servoyu asla ESP32 kartının regülatöründen beslemeyin ve topraklarını ortak tutun.",
  'servo-pwm.pulseRange': 'Darbe aralığı',
  'servo-pwm.servo': 'Servo',
  'servo-pwm.signal': 'işaret',
  'servo-pwm.step': '{degreesPerStep}°/adım',
  'servo-pwm.thatIsWhatMakes':
    "Çözünürlüğü zorlaştıran da budur. Kullanışlı aralığın tamamı, 20 ms'lik çerçevenin yalnızca {minPulse2} kadarıdır, yani görev çevrimi yazmacının ancak yaklaşık %{frameHz} kadarı bir işe yarar. 8 bitte bu, tüm hareket için kabaca 13 adım, adım başına yaklaşık 14° bırakır; düşük LEDC çözünürlüğüne sahip acemi Arduino kodunun sarsak servolar üretmesinin nedeni budur.",
  'servo-pwm.theory1':
    "Servo konumu yalnızca darbe genişliğinde kodlanır: hareketin bir ucunda {minPulse}, öbür ucunda {maxPulse}, her 20 ms'de bir yinelenir. Darbeler arasındaki boşluk hiçbir bilgi taşımaz, yalnızca komutu tazeler.",
  'servo-pwm.title': 'Servo PWM',
  'servo-pwm.use':
    'Robot kolları, pan-tilt düzenekleri, RC dönüşümleri ve hobi servosu içeren her düzenek. Önemlidir, çünkü servolar görev oranını değil darbe genişliğini okur; dolayısıyla zamanlayıcı aralığının yalnızca küçük bir dilimi işe yarar ve düşük bir LEDC çözünürlüğü, hareket boyunca pürüzsüz devinim için yetersiz sayıda adım bırakır.',
  'servo-pwm.warn1':
    "Adım başına {degreesPerStep}°, servonun kendi çözebileceğinden daha kaba; yani sınırı belirleyen makine değil denetleyicidir. LEDC çözünürlüğünü yükseltin: 50 Hz'de bedelsiz olarak {maxBits} bite kadar çıkabilirsiniz.",
  'servo-pwm.warn2':
    "Yaklaşık 60 Hz'in üzerinde, analog bir servonun beklediğinin dışına çıkmış olursunuz. Birçok sayısal servo 200-333 Hz arasını kabul eder ve daha hızlı yanıt verir, ama analog bir servo vızıldayabilir, aşırı ısınabilir ya da fazladan çerçeveleri büsbütün yok sayabilir. Çerçeve hızını yükseltmeden önce belirtimi denetleyin.",
  'solar-sizing.autonomy': 'Özerklik',
  'solar-sizing.batteryNeeded': 'Gereken pil',
  'solar-sizing.batterySizingIsThe':
    "Pil boyutlandırması bunun tersi bir sorudur: ortalama gün değil, kötü günlerin en kötü serisi önemlidir. `Cbat = Wh_day · days / DoD`. Deşarj derinliği çevrim ömrü için son derece önemlidir: bir lityum hücreyi %90 yerine %50'ye kadar boşaltmak kullanılabilir çevrim sayısını birkaç katına çıkarabilir, yani daha büyük bir pil çoğu zaman kendi maliyetini fazlasıyla çıkarır.",
  'solar-sizing.blurb': 'Günlük yük profilinden panel ve batarya seçimi, özerklik günleriyle.',
  'solar-sizing.dailyConsumption': 'Günlük tüketim',
  'solar-sizing.dailySurplus': 'Günlük fazla',
  'solar-sizing.daysAtDod': "%{dod} DoD'de {autonomyDays} gün",
  'solar-sizing.daysToRefill': 'Doldurma günü',
  'solar-sizing.depthOfDischarge': 'Deşarj derinliği',
  'solar-sizing.harvestPerDay': 'Günlük hasat',
  'solar-sizing.lede':
    'Güneş enerjili bir düğüm için panel ve batarya boyutlandırın. Yük, derin uyku sayfasındaki aynı görev çevrimi aritmetiğinden gelir; ardından panelin bunu ortalama bir günde geri koyması, bataryanın ise düğümü kötü günlerde ayakta tutması gerekir.',
  'solar-sizing.loadProfile': 'Yük profili',
  'solar-sizing.ofFullSunPer': 'kullanılan tam güneş / gün',
  'solar-sizing.panelFitted': 'Takılan panel',
  'solar-sizing.panelNeeded': 'Gereken panel',
  'solar-sizing.panelRating': 'Panel gücü',
  'solar-sizing.peakSunHours': 'Tepe güneş saati',
  'solar-sizing.rechargeTime': 'Şarj süresi',
  'solar-sizing.siteAndSystem': 'Saha ve sistem',
  'solar-sizing.systemEfficiency': 'Sistem verimi',
  'solar-sizing.theEfficiencyTermIs':
    'Verim terimi, zaten watt değerinin içinde olan hücre verimi değildir. Şarj denetleyiciyi, kablolamayı, sıcaklık kaybını (paneller 25 °C üzerinde her kelvin için yaklaşık %0,4 kaybeder), tozu ve kusurlu açıyı kapsar. Küçük, sabit bir kurulum için yüzde yetmiş makul bir planlama değeridir.',
  'solar-sizing.theFailureModeWorth':
    'Kaçınılması gereken arıza türü, kağıt üzerinde başa baş gelen bir sistemdir. Bulutlu bir haftanın ardından pili yeniden doldurmaya yetecek payı yoktur, bu yüzden yavaşça boşalır ve öyle kalır. Paneli büyütmek pili büyütmekten çok daha ucuzdur.',
  'solar-sizing.theory1':
    'Tepe güneş saati, bir günün tüm ışınım eğrisini panelin tam 1000 W/m² değerindeki eşdeğer saat sayısına indirger. Böylece günlük hasat basitçe `W · PSH · efficiency` olur, gereken panel gücü de `Wh_day / (PSH · efficiency)` ile bulunur.',
  'solar-sizing.title': 'Güneş Paneli + Batarya Boyutlandırma',
  'solar-sizing.toBreakEven': 'başa baş gelmek için',
  'solar-sizing.use':
    'Şebekeden bağımsız sensör düğümleri, meteoroloji istasyonları ve uzak izleme sistemleri. Önlediği arıza türü, kağıt üzerinde başa baş gelen sistemdir: tüm yaz boyunca çalışır, sonra bulutlu bir hafta pili bitirir ve panelin dolduracak fazlası olmadığı için sistem bir daha toparlanamaz.',
  'solar-sizing.warn1':
    "Panel, {whPerDay} Wh'lik yüke karşılık {harvestWh} Wh topluyor; yani pil sürekli boşalır ve boşaldığında düğüm çalışmayı durdurur. Yalnızca başa baş gelmek için bile en az {panelW} W gerekir, gerçekçi olarak bulutlu dönemlerden de toparlanabilmesi için bunun iki üç katı gerekir.",
  'solar-sizing.warn2':
    'Fazlalık pozitif ama sınırlı: boş bir pili yeniden doldurmak {daysToRecharge} gün sürüyor, bu da sağladığı {autonomyDays} günlük özerklikten daha uzun. Kötü bir haftanın ardından düğüm bir daha yetişemeyebilir. Pili değil paneli büyütün.',
  'solar-sizing.warn3':
    "4 tepe güneş saatinin üzeri yaz ya da düşük enlem değeridir. Ortalamaya göre değil, çalışacağınızı beklediğiniz en kötü aya göre boyutlandırın: Kuzey Avrupa'da aralık ayı bir tepe güneş saatinin altına inebilir, bu da yaz ortasının beşte biri demektir.",
  'thermal-design.125CForMost': "Çoğu silisyum için 125 °C, güç MOSFET'leri için 150 - 175 °C.",
  'thermal-design.63OfTheRise': "(artışın %63'ü)",
  'thermal-design.aimForK': '({MARGIN_TARGET_K} K hedefleyin)',
  'thermal-design.aKelvinAndA':
    'Bir kelvin ile bir santigrat derece aynı büyüklüktedir, bu yüzden bu sayfadaki her direnç, artış ve pay her iki ölçekte de aynı kalır. Yalnızca mutlak sıcaklıklar farklıdır.',
  'thermal-design.aLinearRegulatorThrows':
    "Doğrusal bir regülatör gerilim farkının tamamını ısı olarak harcar: `P = (Vin - Vout)·Iout + Vin·Iq`. 500 mA akımda 5 V'u 3,3 V'a düşürmek 0,85 W ısı üretir; çıplak bir SOT-223 AMS1117'nin ESP32 kartında ısınıp anahtarlamalı bir regülatörün ısınmamasının nedeni budur.",
  'thermal-design.atCAmbient': '({ambientC} °C ortamda)',
  'thermal-design.blurb': 'Güç kaybı ve ısıl direnç zincirinden jonksiyon sıcaklığı.',
  'thermal-design.budgetUsed': 'Kullanılan bütçe',
  'thermal-design.caseTc': 'Kılıf Tc',
  'thermal-design.directWatts': 'Doğrudan watt',
  'thermal-design.dpakOn1Sq': '1 inç karelik bakır üzerinde DPAK',
  'thermal-design.efficient': '(%{efficiency} verim)',
  'thermal-design.esp32PeaksNear500':
    "ESP32, WiFi gönderim patlamasında yaklaşık 500 mA'e tepe yapar.",
  'thermal-design.grease02Pad':
    "TO-220'de macun 0,2, ped 0,5, kuru temas 1,0. Lehimli tırnak için 0,01 kullanın.",
  'thermal-design.input': 'Giriş',
  'thermal-design.insideASealedEnclosure':
    'Kapalı bir muhafaza içinde, oda sıcaklığının 20 K üzerinde olması normaldir.',
  'thermal-design.junctionTj': 'Jonksiyon Tj',
  'thermal-design.kOverAmbient': '(ortamın {rise} K üzerinde)',
  'thermal-design.lede':
    'Rjc, Rcs, Rsa zinciri boyunca jonksiyon sıcaklığı. Osiloskop soğuk başlangıçtan itibaren ısınmayı gösterir; bu yüzden yatay eksen bir dalga şekli değil, saniye cinsinden zamandır: çip anında sıçrar, ardından soğutucu ısındıkça onunla birlikte yükselir.',
  'thermal-design.limits': 'Sınırlar',
  'thermal-design.linearRegulator': 'Doğrusal regülatör',
  'thermal-design.loadTypicalPackage': 'Tipik kılıf yükleyin',
  'thermal-design.marginToTjMax': "Tj max'a pay",
  'thermal-design.massTimesSpecificHeat':
    "Kütle çarpı özgül ısı. Alüminyum için bu değer 897 J/(kg·K)'dir, yani 20 g için 18 J/K eder.",
  'thermal-design.noneExists': 'hiçbiri yok',
  'thermal-design.ofTheAmbientTo': "(ortamdan Tj max'a olan aralığın)",
  'thermal-design.powerCeiling': 'Güç tavanı',
  'thermal-design.rcsInterface': 'Rcs arayüzü',
  'thermal-design.regulator': 'Regülatör',
  'thermal-design.rjcJunctionToCase': 'Jonksiyondan kılıfa Rjc',
  'thermal-design.rsaRequired': 'Gereken Rsa',
  'thermal-design.rsaSinkToAir': 'Soğutucudan havaya Rsa',
  'thermal-design.rthJunctionToAir': 'Jonksiyondan havaya Rth',
  'thermal-design.safeToTouch': '(dokunması güvenli)',
  'thermal-design.sinkHeatCapacity': 'Soğutucu ısı sığası',
  'thermal-design.sinkTimeConstant': 'Soğutucu zaman sabiti',
  'thermal-design.sinkTs': 'Soğutucu Ts',
  'thermal-design.sot223Ams1117On': 'Bakır dolgu üzerinde SOT-223 (AMS1117)',
  'thermal-design.sot23SmallSignal': 'SOT-23 küçük sinyal, serbest hava',
  'thermal-design.tcase': 'Tcase',
  'thermal-design.theory1':
    'Isı akışı, elektriksel benzetmeyle anlaşılır: güç akımı, sıcaklık artışı gerilimi, K/W cinsinden ısıl direnç de direnci temsil eder. Üç ayak seri bağlıdır, yani `Tj = Ta + P·(Rjc + Rcs + Rsa)` olur. Rjc kılıftan, Rcs montaj arayüzünden, Rsa ise soğutucudan ve üzerinden geçen havadan gelir.',
  'thermal-design.theTraceIsA':
    'İz bir dalga şekli değil, bir geçici tepkidir. Isı sığasının neredeyse tamamını soğutucu taşıdığından tek kutup odur: `tau = Rsa·Cth` ve `Ts(t) = Ts(∞) + (Ta - Ts(∞))·e^(-t/tau)`, uygulamanın diğer yerlerinde de kullanılan aynı tam sıfırıncı derece tutma adımıyla hesaplanır ve böylece her dt değerinde kararlı kalır. Çip ile arayüz, yanındaki alüminyum kütleye kıyasla neredeyse hiç ısı tutmaz; bu yüzden bu zaman ölçeğinde jonksiyon yalnızca soğutucunun `P·(Rjc + Rcs)` kadar üzerinde durur, bu da t = 0 anında sıçrayıp ardından yavaşça ilerlemesinin nedenidir. Gerçek soğutucular çok kutupludur, bu yüzden eğrinin başlangıcını gösterge, bitiş noktasını ise gerçek yanıt olarak alın.',
  'thermal-design.title': 'Soğutucu / Termal',
  'thermal-design.tj': 'Tj',
  'thermal-design.to220BareFree': 'Çıplak TO-220, serbest hava',
  'thermal-design.to220BoltedTo': 'Küçük soğutucuya cıvatalı TO-220',
  'thermal-design.to247OnA': 'Büyük soğutucuda TO-247',
  'thermal-design.toSitOnC': "({tjMaxC} °C'de kalmak için)",
  'thermal-design.tsink': 'Tsink',
  'thermal-design.turnItRoundTo':
    'Soğutucuyu boyutlandırmak için bunu tersine çevirin: `Rsa_required = (Tjmax - Ta)/P - Rjc - Rcs`. Bu değer sıfır ya da negatifse kılıf ile arayüz bütçenin tamamını zaten harcamış demektir ve hiçbir soğutucu işe yaramaz. Buna karşılık gelen güç tavanı `Pmax = (Tjmax - Ta)/Rth(j-a)` olur.',
  'thermal-design.use':
    "Gerçek güç harcayan her parça için: regülatörler, MOSFET'ler, motor sürücüleri, LED dizileri. Önemli olan tek soruyu, yani jonksiyonun en kötü durum ortam sıcaklığında sınırının altında kalıp kalmadığını yanıtlar; kalmıyorsa da gereken soğutucuyu bulmak için tersinden hesaplar.",
  'thermal-design.warn1':
    "{tjMaxC} °C sınırına karşı {tj} jonksiyon sıcaklığı var ve Rjc + Rcs tek başına {power} değerinde bütçenin tamamını harcıyor. Hiçbir soğutucu bunu düzeltemez: güç kaybını {maxPower} altına indirin, montajı iyileştirin ya da daha düşük Rjc'li bir kılıfa geçin.",
  'thermal-design.warn2':
    '{tjMaxC} °C sınırına karşı {tj} jonksiyon sıcaklığı var. Yalnızca sınıra ulaşmak için bile {requiredRsa} ya da daha iyi bir soğutucu gerekir; {MARGIN_TARGET_K} K pay için kabaca {e} hedefleyin ya da gücü {maxPower} altına düşürün.',
  'thermal-design.warn3':
    'Yalnızca {margin} K pay var. Tj max bir çalışma noktası değil, mutlak bir üst sınırdır: parça toleransı, sıcak bir muhafaza ve tıkalı hava akışı için {MARGIN_TARGET_K} K ya da daha fazlasını bırakın.',
  'thermal-design.warn4':
    'Çıkış girişten yüksek, yani bu regülatör düşüm bölgesindedir ve model geçerli değildir. Doğrusal bir regülatör yalnızca gerilimi düşürebilir.',
  'thermal-design.whereTheHeatComes': 'Isının kaynağı',
  'thermal-design.willBurnOnContact': '(temasta yakar)',
  'timer-555.always50WithoutA': '(diyot olmadan her zaman >%50)',
  'timer-555.astable': 'Astable',
  'timer-555.blurb': 'Astable ve monostable zamanlama, görev çevrimi ve ortaya çıkan dalga şekli.',
  'timer-555.bothTripPointsScale':
    'İki eşik noktası da Vcc ile ölçeklenir; zamanlamanın birinci dereceden beslemeden bağımsız olmasının nedeni budur. İz formülden çizilmez; bu uygulamanın başka yerlerinde kullanılan aynı tam sıfırıncı derece tutma gevşemesiyle benzetilir, bu yüzden açılıştaki ilk çevrim gerçekten de ln2 değil ln3 kadar sürer.',
  'timer-555.dischargeCurrent': 'Deşarj akımı',
  'timer-555.dischargePinIsAsked':
    "Deşarj pininden {peak} çekmesi isteniyor, bu da {rating} değerinin üzerinde. R1'i büyütün.",
  'timer-555.dischargePinIsOver': "Deşarj pini akım çekme sınırının üzerinde. R'yi büyütün.",
  'timer-555.frequencyIs144':
    "Frekans `1.44 / ((R1 + 2·R2)·C)` ile bulunur. 0,693 değeri ln2'dir ve kondansatörün 1/3 ile 2/3 Vcc karşılaştırıcı eşikleri arasında geçişinden gelir; bu da hatta kalan mesafede iki kat oranına karşılık gelir.",
  'timer-555.lede':
    '555 entegresinin iki klasik bağlantısı. Osiloskop çıkış ucunu kondansatör gerilimine karşı gösterir, böylece 1/3 ile 2/3 Vcc eşikleri arasındaki rampayı izleyebilirsiniz.',
  'timer-555.maxRetriggerRate': 'En yüksek yeniden tetikleme hızı',
  'timer-555.monostable': 'Monostable',
  'timer-555.monostableTimingIs1':
    "Monostable zamanlaması `1.1·R·C` olur; buradaki 1,1 değeri ln3'tür: kondansatör 1/3 Vcc yerine 0 V'tan başladığı için üstel eğrinin daha büyük bir bölümünü kat eder.",
  'timer-555.pastThePracticalCeiling':
    'Bu çeşit için yaklaşık {ceiling} olan pratik üst sınırın ötesinde. Yayılma gecikmesi RC zamanlamasına baskın gelmeye başlar.',
  'timer-555.pin7PeakSink': 'Pin 7 tepe çekişi',
  'timer-555.recoveryTime': 'Toparlanma süresi',
  'timer-555.startFromPowerOn': 'Açılıştan başlatın',
  'timer-555.theory1':
    "Kondansatör, R1+R2 üzerinden Vcc'ye doğru dolar ve yalnızca R2 üzerinden boşalır; bu yüzden yüksek süre `0.693·(R1+R2)·C` her zaman düşük süre `0.693·R2·C` değerinden uzundur. Sıradan bir astable devrenin asla %50 görev çevrimine ulaşamamasının nedeni budur: yalnızca R1 üzerinden dolmasını sağlamak için R2'ye paralel bir diyot eklemek gerekir.",
  'timer-555.threshold23Vcc': 'Eşik 2/3 Vcc',
  'timer-555.timeHigh': 'Yüksek süresi',
  'timer-555.timeLow': 'Düşük süresi',
  'timer-555.timingNetwork': 'Zamanlama devresi',
  'timer-555.timingResistanceIsHigh':
    'Zamanlama direnci, eşik kutuplama akımının sonucu kaydıracağı kadar yüksek. Daha büyük C ve daha küçük R kullanın.',
  'timer-555.timingResistanceIsHigh2':
    'Zamanlama direnci, eşik kutuplama akımının sonucu kaydıracağı kadar yüksek.',
  'timer-555.title': '555 Zamanlayıcı',
  'timer-555.trig': 'Tetik',
  'timer-555.trigger13Vcc': 'Tetik 1/3 Vcc',
  'timer-555.use':
    'Yanıp sönen ışıklar, ton üretimi, mikrodenetleyicisiz PWM, tek atımlı darbeler ve reset denetimi için kullanılır. Hâlâ bilinmeye değer, çünkü yazılım olmadan zamanlanmış bir darbe elde etmenin çoğu zaman en ucuz ve en güvenilir yoludur; ayrıca astable görev çevrimi sınırı pek çok kafa karıştırıcı devreyi açıklığa kavuşturur.',
  'timer-555.variant': 'Çeşit',
  'timer-555.vcap': 'Vcap',
  'timer-555.vcc': 'Vcc',
  'timer-555.wantsToV': '{part}, {min} - {max} V ister.',
  'timer-555.wantsToVAt':
    '{part}, {min} - {max} V ister. {vcc} değerinde zamanlama güvenilir değildir.',
  'trace-width.allowedTempRise': 'İzin verilen sıcaklık artışı',
  'trace-width.blurb': 'Bir akım ve sıcaklık artışı için IPC-2221 genişliği, iç veya dış katman.',
  'trace-width.boardTemp': 'Kart sıcaklığı',
  'trace-width.copperThickness': 'Bakır kalınlığı',
  'trace-width.copperWeight': 'Bakır ağırlığı',
  'trace-width.external': 'Dış katman',
  'trace-width.internal': 'İç katman',
  'trace-width.layer': 'Katman',
  'trace-width.lede':
    'IPC-2221 yol boyutlandırması. Bunun bir hasar sınırı değil, ısıl sınır olduğunu unutmayın: genişlik, bakırın sıcaklık artışını izin verdiğiniz değerin altında tutan genişliktir. Gerilim düşümünü ayrıca kontrol edin, çoğu zaman daha önemlidir.',
  'trace-width.mil': '{widthMils} mil',
  'trace-width.oz': '{ozCopper} oz',
  'trace-width.powerDissipated': 'Harcanan güç',
  'trace-width.requiredWidth': 'Gereken genişlik',
  'trace-width.requirement': 'Gereksinim',
  'trace-width.stackupAndGeometry': 'Katman dizilimi ve geometri',
  'trace-width.theExponentOnCurrent':
    'Akımın üssü, 1/0,725 ≈ 1,38, genişliğin akımdan daha hızlı büyüdüğü anlamına gelir. Akımı iki katına çıkarmak, iki değil yaklaşık 2,6 kat bakır gerektirir. Yüksek akımlı hatların hızla kontrolden çıkıp yol olmaktan çıkarak dolguya dönüşmesinin nedeni budur.',
  'trace-width.theory1':
    "IPC-2221 bir türetim değil, ölçülmüş veriye uydurulmuş bir eğridir: A, mil kare cinsinden olmak üzere `I = k · dT^0.44 · A^0.725`. Tersinden çözüldüğünde gereken kesit `A = (I / (k·dT^0.44))^(1/0.725)` olur. k sabiti dış yollar için 0,048, iç yollar için 0,024'tür; çünkü iç katman laminat içine gömülüdür ve ısıyı yalnızca yanlara doğru atabilir.",
  'trace-width.title': 'PCB Yol Genişliği',
  'trace-width.traceLength': 'Yol uzunluğu',
  'trace-width.traceResistance': 'Yol direnci',
  'trace-width.twoThingsThisDoes':
    "Bunun size söylemediği iki şey var. Bu, kararlı durum ısıl bir sınırdır, yani kısa süreli bir sıçrama bunu güvenle çok aşabilir. Ayrıca gerilim düşümü hakkında hiçbir şey söylemez; oysa düşük gerilimli hatlardaki uzun ve ince yollarda bağlayıcı kısıt genellikle odur: bir yol ısıl açıdan sorunsuzken 3,3 V'luk bir regülatörün geri beslemesini bozacak kadar düşüm yapabilir.",
  'trace-width.use':
    'Birkaç yüz miliamperin üzerinde akım taşıyan her kartın yerleşiminde: güç hatları, motor sürücüleri, LED şeritler. Bu bir hasar sınırı değil ısıl sınırdır, bu yüzden bakırın ne kadar ısınacağını gösterir; ayrıca uzun düşük gerilimli yollarda asıl kısıtın çoğu zaman gerilim düşümü olduğunu belirtir.',
  'trace-width.warn1':
    '{width} mm, düşük maliyetli üreticilerin güvenilir biçimde aşındırabildiği {FAB_MIN_WIDTH} mm değerinin altında. Bunun yerine onların asgari değerini kullanın: hiçbir maliyeti yoktur ve yol yalnızca gerekenden daha serin çalışır.',
  'trace-width.warn2':
    'İç katmanların her iki yanında da hava bulunmaz, bu yüzden IPC sabiti yarıya iner ve yol, aynı sıcaklık artışı için yaklaşık 2,7 kat daha fazla kesit ister. Yüksek akımlı hatları mümkün olduğunca dış katmanlardan geçirin.',
  'trace-width.warn3':
    "{riseK} K'lik bir artış oldukça yüksektir. FR-4 ısıl açıdan sorunsuzdur ama yol, değerleri ortam sıcaklığını esas alan bileşenler dahil yakınındaki her şeyi ısıtır. Çoğu tasarımda 10 - 20 K'ye izin verilir.",
  'trace-width.widthFollowsFromCross':
    "Genişlik, kesit ve bakır ağırlığından çıkar: `w = A / thickness`; burada 1 oz bakır yaklaşık 35 µm'dir. Yani 2 oz'a çıkmak gereken genişliği yarıya indirir ve bu, sıkışık bir kartı genişletmekten çoğu zaman daha ucuza gelir.",
  'transformer.apparentPower': 'Görünür güç',
  'transformer.blurb': 'Sarım oranı, yansıyan empedans, regülasyon ve çekirdek kaybı tahmini.',
  'transformer.copperLossOnly': 'yalnızca bakır kaybı',
  'transformer.lede':
    'Sarım oranı gerilimi, karesi ise empedansı belirler. Ders kitabındaki ideal transformatörü, yüklediğiniz anda çıkışı çöken gerçek bir transformatöre dönüştüren şey sargı direncidir.',
  'transformer.lossesAndRating': 'Kayıplar ve anma değeri',
  'transformer.primaryCopperLoss': 'Birincil bakır kaybı',
  'transformer.primaryCurrent': 'Birincil akım',
  'transformer.primaryResistance': 'Birincil direnç',
  'transformer.primaryTurns': 'Birincil sarım',
  'transformer.primaryVoltage': 'Birincil gerilim',
  'transformer.ratedVa': 'anma {vaRating} VA',
  'transformer.reflectedImpedance': 'Yansıyan empedans',
  'transformer.regulation': 'Regülasyon',
  'transformer.regulationIsWhatWinding':
    'Regülasyon, sargı direncinin size ödettiği bedeldir. İkincil dirençten geçen akım, artı aynı oranla yansıtılan birincil direnç, gerilimi yükle orantılı biçimde düşürür. Bu yüzden yüksüz gerilim her zaman etiket değerinden yüksektir ve küçük bir transformatör yüksüzken %25 fazla gösterebilir.',
  'transformer.secondaryCopperLoss': 'İkincil bakır kaybı',
  'transformer.secondaryCurrent': 'İkincil akım',
  'transformer.secondaryLoaded': 'İkincil, yüklü',
  'transformer.secondaryNoLoad': 'İkincil, yüksüz',
  'transformer.secondaryResistance': 'İkincil direnç',
  'transformer.secondaryTurns': 'İkincil sarım',
  'transformer.seenByThePrimary': 'birincilin gördüğü',
  'transformer.theConsequencePeopleForget':
    'İnsanların unuttuğu sonuç empedanstır. İkincildeki bir Zs yükü, birincile `(Np/Ns)²·Zs` olarak görünür. Transformatörlerin gerilimlerin yanı sıra empedansları da uyumlaştırmasının nedeni bu karesel ilişkidir; lambalı yükselteç çıkış katlarının ve RF uyumlama devrelerinin de tüm temelini oluşturur.',
  'transformer.theory1':
    'Tanımlayıcı bağıntılar `Vs = Vp·Ns/Np` ve `Is = Ip·Np/Ns` şeklindedir. Gerilim düşerken akım yükselir, yani görünür güç korunur: bir transformatör enerjiyi taşır, üretmez.',
  'transformer.thisModelCoversCopper':
    'Bu model yalnızca bakır kaybını kapsar. Gerçek transformatörlerde ayrıca histerezis ve girdap akımlarından kaynaklanan, yükle kabaca sabit kalan ve hafif yükte baskın olan çekirdek kaybı, bir de yüksek frekanslarda regülasyonu daha da bozan kaçak endüktans bulunur. VA değeri, bunların tümünü birlikte kapsayan bir ısıl sınırdır.',
  'transformer.title': 'Transformatör',
  'transformer.turnsRatio': 'Sarım oranı',
  'transformer.use':
    "Şebeke güç kaynaklarında, güvenlik amaçlı yalıtımda ve ses ile RF'de empedans uyumlamada kullanılır. İnsanların unuttuğu ilişki yansıyan empedanstır; düşük empedanslı bir hoparlörü ya da anteni yüksek empedanslı bir kaynağa uyumlamanın standart yolunun transformatör olmasının nedeni de budur.",
  'transformer.vaRating': 'VA değeri',
  'transformer.warn1':
    '{VA}, {vaRating} VA değerini aşıyor. Sargılar aşırı ısınacaktır; değer manyetik değil ısıl olduğundan parça bozulmadan önce bir süre çalışmaya devam edebilir, onu tehlikeli kılan da budur.',
  'transformer.warn2':
    "%{regulation} regülasyon, çıkışın yük altında ciddi biçimde çöktüğü anlamına gelir. Küçük transformatörler bu konuda büyüklerden çok daha kötüdür; 12 V yazan 5 VA'lık bir parçanın yüksüzken çoğu zaman 15 V ölçmesinin nedeni budur.",
  'transformer.windings': 'Sargılar',
  'ui.0To3v3': '0 - 3V3',
  'ui.allSimulators': 'Tüm simülatörler',
  'ui.amplitudePeak': 'Genlik (tepe)',
  'ui.backToTheCatalogue': 'Kataloğa dön',
  'ui.bipolar': 'çift kutuplu',
  'ui.bipolar2': 'Çift kutuplu',
  'ui.catalogue': 'Katalog',
  'ui.channels': 'Kanallar',
  'ui.coarser': 'Daha kaba',
  'ui.filterSimulators': 'Simülatörleri filtrele',
  'ui.finer': 'Daha hassas',
  'ui.language': 'Dil',
  'ui.loadingSimulator': 'Simülatör yükleniyor...',
  'ui.logic': 'mantık',
  'ui.noMatch': 'Eşleşme yok.',
  'ui.ofSimulatorsBuiltEvery':
    '{total} simülatörün {ready} tanesi hazır. Her biri tarayıcıda gerçek formülleri çalıştırır ve aynı canlı osiloskobu sürer.',
  'ui.planned': 'planlandı',
  'ui.scrollOrPinchTo':
    'Zaman tabanını yakınlaştırmak için kaydırın ya da iki parmakla sıkıştırın, kaydırmak için sürükleyin, sıfırlamak için çift tıklayın.',
  'ui.signalSwing': 'Sinyal salınımı',
  'ui.simulatorsAndCalculatorsFor': 'Elektronik mühendisleri için simülatörler ve hesaplayıcılar',
  'ui.stepHeight': 'Basamak yüksekliği',
  'ui.theMathsBehindThis': 'Bu sayfanın arkasındaki matematik',
  'ui.timebase': 'Zaman tabanı',
  'ui.toggleSimulatorList': 'Simülatör listesini aç/kapat',
  'ui.tracePx': 'İz {px} px',
  'ui.traceThickness': 'İz kalınlığı',
  'ui.voltsDiv': 'Volt / bölme',
  'ui.waveform': 'Dalga şekli',
  'ui.whereIsItUsed': 'Nerede kullanılır?',
  'ui.zoomIn': 'Yakınlaştır',
  'ui.zoomOut': 'Uzaklaştır',
  'voltage-divider.1206OrAxial1': '1206 ya da eksenel (1/4 W)',
  'voltage-divider.axial12W': 'Eksenel (1/2 W)',
  'voltage-divider.blurb': 'Yüksüz ve yüklü bölücü, çıkış empedansı, yükten kaynaklanan hata.',
  'voltage-divider.defaultsToThe3v3': 'Varsayılan değer 3V3 ESP32 hattıdır.',
  'voltage-divider.hangRlOnIt':
    "Üzerine RL bağlayın, alt kol `R2||RL` olur ve `Vout = Vin·(R2||RL)/(R1 + R2||RL)` sonucunu verir. Eşdeğer olarak kaynak kendi empedansına karşı bölünür: `Vout·RL/(RL + Zout)`. Dolayısıyla hata `-Zout/(Zout + RL)` olur: RL = Zout iken %-50, 10 katında %-9,1, 100 katında %-1'dir.",
  'voltage-divider.inputResistanceOfWhatever': 'Orta ucun sürdüğü şeyin giriş direnci.',
  'voltage-divider.lede':
    'İki direnç ve bir orta uç. Yüksüz sonuç işin kolay kısmı: asıl önemli olan çıkış empedansı ve orta uca bağladığınız şeyin onu ne kadar aşağı çektiğidir.',
  'voltage-divider.loadConnected': 'Yük bağlı',
  'voltage-divider.loadDominates': '(yük baskın)',
  'voltage-divider.loadError': 'Yük hatası',
  'voltage-divider.lookingBackIntoThe':
    'Besleme kısa devre edilmiş haldeyken orta uçtan geriye bakıldığında R1 ile R2 paralel görünür, yani Thevenin kaynak empedansı `Zout = R1·R2/(R1+R2)` olur. Bir bölücünün regülatör olmamasının tek nedeni de budur.',
  'voltage-divider.noLoad': '(yüksüz)',
  'voltage-divider.ofRating': '(anma değerinin %{rating} kadarı)',
  'voltage-divider.perHour': '(saatte {pTotal})',
  'voltage-divider.powerInLoad': 'Yükteki güç',
  'voltage-divider.powerInR1': "R1'deki güç",
  'voltage-divider.powerInR2': "R2'deki güç",
  'voltage-divider.powerIsIR':
    "Güç, R1'de `I²R`, şönt bacaklarda `V²/R` olur ve üçü toplanınca `Vin·I` eder. Tasarımın ödünleşimi değişmez: düşük dirençler sağlam bir çıkış verir ama sürekli akım harcar, yüksek dirençler akımı azıcık kullanır ama gerçek bir yük altında çöker.",
  'voltage-divider.quiescentCurrent': 'Durgun akım',
  'voltage-divider.ratio': '(oran {ratio})',
  'voltage-divider.resistiveVoltageDivider': 'Dirençli gerilim bölücü',
  'voltage-divider.resistorPackage': 'Direnç kılıfı',
  'voltage-divider.rl': 'RL',
  'voltage-divider.rlZout': 'RL / Zout',
  'voltage-divider.stiffEnough': '(yeterince sağlam)',
  'voltage-divider.stringAlone': '(yalnızca bölücü)',
  'voltage-divider.theory1':
    'Orta uçta hiçbir şey yokken akım iki bacakta da aynıdır, bu yüzden `Vout = Vin·R2/(R1+R2)` olur. Gerilimi yalnızca oran belirler: 1k/1k de 1M/1M de hattın yarısını verir, ama biri 1000 kat daha fazla akım harcar.',
  'voltage-divider.title': 'Gerilim Bölücü',
  'voltage-divider.totalFromSupply': 'Beslemeden toplam',
  'voltage-divider.use':
    'Her yerde. Batarya gerilimini ADC aralığına ölçeklemek, bir regülatörün geri besleme noktasını ayarlamak, bir transistörü kutuplamak ve referans üretmek. Ortaya çıkardığı tuzak yüklemedir: ölçü aletinde doğru okunan bir bölücü, beslediği devre akım çekmeye başlayınca tamamen yanlış okuyabilir.',
  'voltage-divider.voutLoaded': 'Yüklü Vout',
  'voltage-divider.voutUnloaded': 'Yüksüz Vout',
  'voltage-divider.warn1':
    'Dirençlerden biri {rating} anma değerinin üzerinde. İki değeri de büyütün ya da daha büyük bir kılıfa geçin: model hâlâ doğrusaldır, ama parça değildir.',
  'voltage-divider.warn2':
    "Zout {zout}, ESP32 ADC'sinin istediği {ADC_MAX_SOURCE_OHMS} değerinin üzerinde. Örnekle ve tut kondansatörü örnekleme penceresi içinde oturmayacaktır, bu yüzden okumalar düşük çıkar. İki direnci de küçültün ya da orta ucu bir işlemsel yükselteç izleyiciyle tamponlayın.",
  'voltage-divider.warn3':
    "RL, Zout'un yalnızca {stiffness} katı; yani bu bir gerilim kaynağı değil, bir direnç ağıdır. Yüklü değere göre tasarlayın ya da iki bölücü değerini de küçültün.",
  'wheatstone.adcCounts': '({counts} ADC adımı)',
  'wheatstone.adcWantsUnder': '(ADC {ADC_MAX_SOURCE_OHMS} altını ister)',
  'wheatstone.arms': 'Kollar',
  'wheatstone.at': '({arm} = {rArm} iken)',
  'wheatstone.balance': 'Denge',
  'wheatstone.blurb': 'Sensör direncine karşı köprü çıkışı ve denge koşulu.',
  'wheatstone.bothReferredToBridge': '(ikisi de köprü toprağına göre)',
  'wheatstone.bridgeOutput': 'Köprü çıkışı',
  'wheatstone.excitation': 'Uyartım',
  'wheatstone.excitationCurrent': 'Uyartım akımı',
  'wheatstone.forNull': 'Sıfırlama için {arm}',
  'wheatstone.fromNow': '(şimdikinden {trim}{trim2})',
  'wheatstone.lookingBackIntoThe':
    "Besleme kısa devre edilmişken çıkıştan geriye bakıldığında her çift paraleldir: `Rth = R1||R2 + R3||R4`. Bir yükün gördüğü budur, yani gerçek bir yük çıkışı `Rl/(Rth+Rl)` oranında aşağı çeker. Orta uçların hiçbiri toprakta değildir, bu yüzden tek uçlu bir ADC pini Vout'u doğrudan okuyamaz; bir fark yükseltecine ihtiyaç duyar.",
  'wheatstone.nulled': 'sıfırlanmış',
  'wheatstone.offNull': 'sıfırın dışında',
  'wheatstone.per1Of': "{arm} değerinin %1'i başına",
  'wheatstone.sensitivityIsTheDerivative':
    'Duyarlılık, çalışma noktasındaki türevdir, örneğin `dVout/dR4 = -Vin·R3/(R3+R4)²`. Dört eşit kolla bu, birim `ΔR/R` başına `Vin/4` ifadesine iner; her gerinim ölçer veri sayfasının verdiği sayı budur. Tek kollu tam yanıt, `x = ΔR/R` için `Vout = -(Vin/4)·x/(1 + x/2)` olur; bu yüzden kehribar renkli teğet izi ile mor gerçek eğri, tarama çalışma noktasından uzaklaştıkça birbirinden ayrılır. O açıklık köprü doğrusalsızlığıdır; 1000 mikrogerinimde yaklaşık %0,05, bir termistörde ise yüzde birkaçtır.',
  'wheatstone.sensorArm': 'Algılayıcı kolu',
  'wheatstone.spanAboutNominal': 'Anma değeri çevresinde aralık',
  'wheatstone.tangent': 'Teğet',
  'wheatstone.tapATapB': 'Orta uç A / orta uç B',
  'wheatstone.theory1':
    'Her yarı sade bir gerilim bölücüdür, yani orta uçlar `Vin·R2/(R1+R2)` ve `Vin·R4/(R3+R4)` değerlerinde durur. Köprü çıkışı bunların farkıdır, `Vout = Vin·(R2/(R1+R2) - R4/(R3+R4))`, ve `R1/R2 = R3/R4` yani `R1·R4 = R2·R3` olduğunda sıfırdır. Denge yalnızca oranlara bağlıdır, bu yüzden besleme kaymasından etkilenmez.',
  'wheatstone.theveninRout': 'Thevenin Rout',
  'wheatstone.title': 'Wheatstone Köprüsü',
  'wheatstone.to': '{from} - {to}',
  'wheatstone.totalDissipation': 'Toplam güç kaybı',
  'wheatstone.twoDividersAcrossOne':
    'Tek bir besleme üzerinde iki bölücü, fark olarak okunur. İz bir dalga şekli değil taramadır: yatay eksen sensör kolu olan {arm} değeridir, bu yüzden osiloskobun bölme başına değerini ohm olarak okuyun.',
  'wheatstone.use':
    "Dirençli sensörler için standart ön kat: yük hücrelerindeki gerinim ölçerler, sıcaklık için RTD'ler ve basınç sensörleri. Köprü, mutlak bir değer yerine küçük bir değişimi referansa karşı ölçtüğü için vardır; bu da besleme kaymasını iptal eder ve ofseti yükseltmeden kuvvetli yükseltme yapmanızı sağlar.",
  'wheatstone.vin4PerUnit': '(dengede birim ΔR/R başına Vin/4)',
  'wheatstone.warn1':
    'Çıkış bir ADC adımının altında ({ADC_FULL_SCALE} tam ölçekte {ADC_LSB}, 12 bit). Önüne bir enstrümantasyon yükselteci koyun, örneğin INA333 ya da INA826; yoksa okumanın tamamı gürültüdür.',
  'wheatstone.warn2':
    'Bir orta uç, ESP32 ADC giriş aralığı olan 0 - {ADC_FULL_SCALE} dışında kalıyor. Uyartımı düşürün ya da orta uçları pinden önce bölücüyle küçültün.',
  'wheatstone.warn3':
    "Kaynak empedansı {ADC_MAX_SOURCE_OHMS} üzerinde, yani ADC'nin örnekle ve tut devresi penceresi içinde oturmayacak. Daha küçük kol değerleri kullanın ya da orta uçları bir işlemsel yükselteçle tamponlayın.",
  'wheatstone.warn4':
    "En kötü kol {maxArmPower} harcıyor; bu, alışılmış 1/4 W'lık bir parçanın dayandığı {RESISTOR_POWER_W} değerinin ötesinde. Kendi kendine ısınma kol direncini kaydırır ve bu, çıkışta ofset olarak görünür.",
  'wheatstone.wheatstoneBridge': 'Wheatstone köprüsü',
  'wheatstone.worstArm': '(en kötü kol {maxArmPower})',
  'wire-gauge.ampacityBundled': 'Akım kapasitesi, demet içi',
  'wire-gauge.ampacityChassis': 'Akım kapasitesi, şase',
  'wire-gauge.ampacityHereIsRule':
    'Buradaki akım taşıma kapasitesi kabaca bir el kuralıdır: serbest havada tek bir şase hattı için yaklaşık 7,5 A/mm², demet içinde 3,5 A/mm². Gerçek tesisatlar; yalıtım sınıfını, gruplamayı ve ortam sıcaklığını hesaba katan kablolama yönetmeliklerine tabidir. Bunu bir başlangıç noktası seçmek için kullanın, bir tesisatı belgelendirmek için değil.',
  'wire-gauge.blurb':
    'AWG değerinden çap ve dirence, akım taşıma kapasitesi ve hat boyunca gerilim düşümü.',
  'wire-gauge.conductorTemp': 'İletken sıcaklığı',
  'wire-gauge.copperGainsAbout0':
    'Bakır kelvin başına yaklaşık %0,39 direnç kazanır, yani zaten ılık çalışan bir tel daha da kötüleşir: daha çok direnç daha çok kayıp, o da daha çok ısı demektir. Bu geri besleme bakırda kararlı kalacak kadar zayıftır, ama akım taşıma değerlerinin neden bir sıcaklık artışı varsaydığını ve tellerin demetlenmesinin onları neden bu kadar ağır biçimde düşürdüğünü açıklar.',
  'wire-gauge.countReturnConductor': 'Dönüş iletkenini de sayın',
  'wire-gauge.freeAirSingleRun': 'serbest hava, tek hat',
  'wire-gauge.lede':
    'Bir kablo kesiti seçin ve size gerçekte neye mal olduğunu görün: direnç, yüke giderken kaybedilen gerilim ve ısı. Varsayılan ayar iki iletkeni de sayar, ki bu insanların genelde unuttuğu yarısıdır.',
  'wire-gauge.loopResistance': 'Çevrim direnci',
  'wire-gauge.ofSupply': 'beslemenin %{dropFraction} kadarı',
  'wire-gauge.powerLostAsHeat': 'Isı olarak yitirilen güç',
  'wire-gauge.resistanceIsRRho':
    'Direnç, bakır için 1,68e-8 Ω·m ile `R = rho·L/A` olur. Düşüm, akımın geri dönmesi gerektiği için *her iki* iletken üzerinden `V = I·R` eder. Yalnızca bir bacağı sayarak bunu yarıya indirmek, kablo boyutlandırmasındaki en yaygın tek hatadır.',
  'wire-gauge.resistancePerMetre': 'Metre başına direnç',
  'wire-gauge.runLength': 'Hat uzunluğu',
  'wire-gauge.runResistance': 'Hat direnci',
  'wire-gauge.theory1':
    "AWG serisi geometriktir: `d = 0.127 mm · 92^((36-n)/39)`. Bu oran öyle seçilmiştir ki altı kalınlık adımı alanda neredeyse tam olarak dört kat, üç adım iki kat, on adım ise on kat eder. Zihinden hesap için kullanışlıdır: 22 AWG'den 12 AWG'ye geçmek on kat bakır verir.",
  'wire-gauge.title': 'Kablo Kesiti (AWG)',
  'wire-gauge.use':
    'Breadboardun ötesindeki her kablolama: batarya kabloları, motor beslemeleri, LED şerit beslemeleri, araç ve güneş enerjisi kurulumları. İşe yarayan değer gerilim düşümüdür, çünkü kaynakta doğru ölçülen bir besleme yüke spesifikasyonun epey altında ulaşabilir ve dönüş iletkeni, insanların genelde hesapladığı düşümü ikiye katlar.',
  'wire-gauge.voltageAtLoad': 'Yükteki gerilim',
  'wire-gauge.warn1':
    '{awg} AWG üzerinden geçen {current}, {ampacityBundled} olan demet içi kablolama önerisini aşıyor. Tek başına serbest havada kabul edilebilir olabilir, ama bir demet ya da boru içinde ısının gidecek yeri yoktur. Bakırı ikiye katlamak için üç kalınlık aşağı inin.',
  'wire-gauge.warn2':
    "{vDrop} yitiriliyor, bu da beslemenin %{dropFraction} kadarı. Yaklaşık %3'ün üzerinde çoğu yük yanlış davranır: regülatörler düşüm sınırına girer, motorlar tork yitirir ve LED şeritleri uzak uca doğru gözle görülür biçimde kararır.",
  'wire-gauge.wire': 'Tel',
  'ws2812-power.25Headroom': '%25 pay',
  'ws2812-power.allWhiteFullBrightness': 'hepsi beyaz, tam parlaklık',
  'ws2812-power.atFullWhiteLeds':
    "Tam beyazda {ledCount} LED {peakCurrent} ister. 5 metrelik 60/m bir şeridin gerçekten ciddi bir yük olmasının, yaklaşık 18 A çekmesinin ve neredeyse hiç kimsenin bir şeridi tam beyazda çalıştırmamasının nedeni budur. Parlaklık akımı doğrusal ölçekler, yani %25'le sınırlanmış bir şerit çok daha uygulanabilir bir öneridir.",
  'ws2812-power.blurb':
    'Şerit akımı, besleme boyutlandırması ve hat boyunca güç besleme noktaları.',
  'ws2812-power.bothConductors': 'her iki iletken',
  'ws2812-power.brightness': 'Parlaklık',
  'ws2812-power.channelsLit': 'Yanan kanal',
  'ws2812-power.content': 'İçerik',
  'ws2812-power.currentNow': 'Şimdiki akım',
  'ws2812-power.dropAtFarEnd': 'Uzak uçta düşüm',
  'ws2812-power.feedPowerAtIntervals': 'aralıklarla güç besleyin',
  'ws2812-power.feedResistance': 'Besleme direnci',
  'ws2812-power.feedWireGauge': 'Besleme teli kalınlığı',
  'ws2812-power.injectionPoints': 'Enjeksiyon noktası',
  'ws2812-power.ledCount': 'LED sayısı',
  'ws2812-power.lede':
    "Adreslenebilir şeritler insanların beklediğinden çok daha fazla akım çeker ve uzak uç, besleme pes etmeden çok önce kararır. WS2812 parçaları 5 V'tur, bu da veri hattını 3,3 V'luk bir ESP32 ile uyumsuz hâle getirir.",
  'ws2812-power.ledsPerMetre': 'Metre başına LED',
  'ws2812-power.peakPower': 'Tepe güç',
  'ws2812-power.powerNow': 'Şimdiki güç',
  'ws2812-power.recommendedSupply': 'Önerilen besleme',
  'ws2812-power.single': 'Tek',
  'ws2812-power.singleFeedIsFine': 'tek besleme yeterli',
  'ws2812-power.sizeTheSupplyFor':
    'Beslemeyi, amaçladığınız ortalamaya göre değil, komut verebileceğiniz tepeye göre boyutlandırın. Her pikseli yanlışlıkla beyaz yapan bir yazılım tüm akımı çeker ve sanatsal niyete göre boyutlandırılmış bir besleme ya kapanır ya da veri işareti bozulana dek çöker.',
  'ws2812-power.strip': 'Şerit',
  'ws2812-power.stripLength': 'Şerit uzunluğu',
  'ws2812-power.supplyWiring': 'Besleme kablolaması',
  'ws2812-power.theory1':
    "Her WS2812, kanal başına kabaca 20 mA çeken üç LED içerir, yani tam yanan beyaz bir piksel yaklaşık 60 mA çeker. İçindeki denetleyici de LED sönükken bile yaklaşık 1 mA çeker; uzun bir şeritte bunu unutmak kolaydır: boştaki 300 piksel yine de yaklaşık 300 mA'e mal olur.",
  'ws2812-power.theSubtlerProblemIs':
    'Daha ince sorun bakırdır. Akım bir uçtan girer ve yol boyunca tüketilir, yani iletken başta tüm yükü, sonda hiçbir şeyi taşır. Ortalama kabaca yarıdır, yani uçtan uca düşüm `I·R` yerine kabaca `I·R/2` olur. Yine de şeridin kendi içindeki ince yollarda hızla birikir; uzun hatların yalnızca daha kalın besleme teli değil, aralıklarla güç enjeksiyonu istemesinin nedeni budur.',
  'ws2812-power.title': 'WS2812 LED Gücü',
  'ws2812-power.two': 'İki',
  'ws2812-power.use':
    'Aydınlatma, tabela ve ekranlar için adreslenebilir LED şeritler. Akım insanların beklediğinden çok yüksektir, tam beyazda piksel başına yaklaşık 60 mA, ve uzun bir şeridin uzak ucu besleme pes etmeden önce kararır ve renk kaydırır. Ayrıca 3,3 V veri sorununu da işaret eder; bu şeritlerin ESP32 ile aralıklı çalışmasının nedeni budur.',
  'ws2812-power.voltageAtFarEnd': 'Uzak uçta gerilim',
  'ws2812-power.warn1':
    "Uzak uç yalnızca {endVoltage} görüyor. WS2812'ler besleme çöktükçe kararır ve renk kaydırır; genellikle kırmızıya doğru, çünkü mavi yonga en yüksek ileri gerilime sahiptir ve ilk o aç kalır. Hat boyunca {injectionPoints} noktadan güç besleyin ya da daha kalın besleme teli kullanın.",
  'ws2812-power.warn2':
    "WS2812 bir 5 V parçasıdır ve veri girişi en az 0,7·VDD, yani yaklaşık 3,5 V ister. 3,3 V'luk bir ESP32 pini bunun kıl payı altındadır. Çoğu zaman çalışır, sonra şerit ısındığında ya da tel uzadığında çalışmayı bırakır. Bir seviye çevirici kullanın ya da ilk LED'i bir diyot üzerinden 3,9 V ile besleyin ki mantık eşiği ESP32'yi karşılayacak kadar düşsün.",
  'zener.blurb': 'Yük aralığı boyunca seri direnç boyutlandırma, zener güç kontrolü.',
  'zener.constantTotalLoss': '(sabit, toplam kayıp {pTotal})',
  'zener.datasheetImpedanceAtThe': 'Test akımındaki veri sayfası empedansı. 1N4728A için 10 Ω.',
  'zener.datasheetIzkIs1':
    "Veri sayfası Izk değeri 1 mA'dir. Sağlam bir çıkış için 5 - 10 mA kullanın.",
  'zener.dropoutAtFullLoad': '(tam yükte düşüm sınırından, yüksüzde düşürülmüş güce kadar)',
  'zener.droppedOut': '(regülasyon dışı)',
  'zener.e24Pick': '(E24 seçimi {suggestion})',
  'zener.efficiencyAtFullLoad': 'Tam yükte verim',
  'zener.fitAPart': '({rsWattage} bir parça takın)',
  'zener.ilMax': 'IL max',
  'zener.ilMin': 'IL min',
  'zener.includeSupplyToleranceAnd': 'Besleme toleransını ve dalgalanma tepelerini de katın.',
  'zener.inputRange': 'Giriş aralığı',
  'zener.inRegulation': '(regülasyonda)',
  'zener.izMinKnee': 'Iz min (dizin)',
  'zener.izWorstCaseMax': 'En kötü durumda en büyük Iz',
  'zener.izWorstCaseMin': 'En kötü durumda en küçük Iz',
  'zener.lede':
    'Seri direnci, zener en düşük girişte ve en ağır yükte hâlâ regüle edecek, en yüksek girişte ve hiç yük yokken hâlâ dayanacak şekilde boyutlandırın. Her değer nominal değil, en kötü durumdur.',
  'zener.lineSwing': '(hat salınımı {lineSwing})',
  'zener.loadSwing': '(yük salınımı {loadSwing})',
  'zener.midInput': '(orta giriş)',
  'zener.noPartFits': '(uyan parça yok)',
  'zener.ofRating': '(anma değerinin %{pzFraction} kadarı)',
  'zener.powerFollowsDirectlyPz':
    'Güç doğrudan çıkar: sıcak köşede `Pz = Vz·Iz` ve `Prs = Irs²·Rs`. Akım bütçesi `Iz_max = {POWER_DERATING} · Pz_max / Vz` olur; anma değerleri 25 C varsaydığı için yarısı alınır.',
  'zener.powerLimitToRegulation': '(güç sınırından regülasyon sınırına)',
  'zener.powerRating': 'Güç değeri',
  'zener.regulatingInputRange': 'Regüle eden giriş aralığı',
  'zener.regulationQualityComesFrom':
    "Regülasyon kalitesi DC kırpmasından değil, dinamik empedans Zz'den gelir. Rs ile Zz, girişe binen her şey için bir bölücü oluşturur, yani `dVout/dVin = Zz / (Rs + Zz)` olur ve yükün gördüğü çıkış empedansı `Rs ∥ Zz` eder. Ödünleşmeye dikkat: büyük bir Rs verimlidir ama kötü bir regülatördür.",
  'zener.rippleRejection': 'Dalgalanma bastırma',
  'zener.rs': 'Rs',
  'zener.rsDissipation': 'Rs güç kaybı',
  'zener.rsFitted': 'Takılan Rs',
  'zener.rsWindow': 'Rs penceresi',
  'zener.theDcModelTreats':
    "DC modeli zeneri, dizinin üstünde ideal bir Vz kırpıcısı, altında ise açık devre sayar; alt köşenin regüle bir çıkış yerine yalın bir seri düşüm bildirmesinin nedeni budur. Zz teğet doğrusunu sıfır akıma kadar uzatmak daha gelişmiş görünür ve fena hâlde yanlış olurdu: bir 1N4728A, 76 mA'de 10 Ω, 1 mA'de ise 400 Ω'dur.",
  'zener.theory1':
    "Zener bir şönttür: yükün almadığı akımı o alır. `Rs = (Vin - Vz) / (Iz + IL)` tasarımın tamamıdır ve can yakan iki uç durumda hesaplanır. En ağır yükle en düşük giriş, zenere en az akımı bırakır ve kullanılabilir en büyük Rs'yi belirler. En hafif yükle en yüksek giriş her şeyi zenerden geçirir ve en küçüğünü belirler.",
  'zener.title': 'Zener Regülatör',
  'zener.use':
    'Ucuz gerilim referansları, bir ucu korumak için giriş sınırlama ve düzgün bir regülatörün fazla kaçtığı düşük akımlı regülasyon. Tasarım tamamen en kötü durumlarla ilgilidir: seri direnç, minimum girişte ve maksimum yükte yeterli akımı geçirmeli, maksimum girişte ve yüksüz durumda zeneri yakmamalıdır.',
  'zener.vinMax': 'Vin max',
  'zener.vinMaxIlMin': '(Vin max, IL min; bütçe {izMaxAllowed})',
  'zener.vinMin': 'Vin min',
  'zener.vinMinIlMax': '(Vin min, IL max; dizin {izMin})',
  'zener.voutAtWorstCase': 'En kötü durumda Vout',
  'zener.vz': 'Vz',
  'zener.warn1':
    "Vin min ({vinMin}), Vz ({vz}) değerinin üzerinde değil. Şönt bir regülatör yalnızca gerilim düşürebilir, yani işe yarayan hiçbir direnç yok. Vz'yi düşürün ya da girişi yükseltin.",
  'zener.warn2':
    'Hiçbir tek direnç iki uç durumu birden karşılamıyor: Rs, {vinMax} değerinde yüksüzken zeneri güç bütçesi içinde tutmak için en az {rsMin} olmalı, ama {ilMax} yükle {vinMin} değerinde dizini korumak için en çok {rsMax} olmalı. Daha yüksek güçlü bir zener kullanın, giriş aralığını daraltın ya da seri geçişli bir regülatöre geçin.',
  'zener.warn3':
    "Alt köşede regülasyon dışı: Rs, {vinMin} değerinde yalnızca {irs} veriyor, yani zenere {iz} kalıyor ve bu {izMin} dizininin altında. Çıkış {vout} değerine çöküyor ve yükü izliyor. Rs'yi {rsMax} altına düşürün.",
  'zener.warn4':
    "Zener anma değerinin üzerinde: yük bağlı değilken {vinMax} değerinde {pzMax} bir parçada {pz}. Genellikle kısa devre olacak biçimde bozulur ve bu da Rs üzerine {irs} boşaltır. Rs'yi {rsMin} üzerine çıkarın.",
  'zener.warn5':
    "Zener, anma değerinin %{pzFraction} kadarında. Mutlak sınırın içinde ama bu sayfanın kullandığı %{POWER_DERATING} bütçesinin ötesinde: anma değerleri 25 C'de verilir ve parça durgun havada sıcak çalışır.",
  'zener.worstCaseForThe': 'Zener için en kötü durum. Yük her zaman açık değilse sıfır varsayın.',
  'zener.zener': 'Zener',
  'zener.zenerDissipation': 'Zener güç kaybı',
  'zener.zenerShuntRegulator': 'Zener şönt regülatör',
  'zener.zztDynamic': 'Zzt (dinamik)',
}
