export type Language = 'english' | 'assamese' | 'bengali' | 'hindi' | 'manipuri' | 'khasi' | 'bhojpuri' | 'konkani'

export const LANG_STORAGE_KEY = 'nercare_language'

export interface PatientStrings {
  // Language screen
  chooseLanguage: string
  chooseLanguageSub: string
  continueBtn: string
  // Home greeting
  greeting: string
  // Home sections
  talkToMe: string
  companionTagline: string
  yourActivities: string
  brainGames: string
  helpsMemory: string
  // Activity cards
  rememberThis: string
  rememberThisDesc: string
  listenToMusic: string
  listenToMusicDesc: string
  dearDiary: string
  dearDiaryDesc: string
  whatDay: string
  whatDayDesc: string
  // Brain game cards
  memoryPairs: string
  memoryPairsDesc: string
  kitchenOrField: string
  kitchenOrFieldDesc: string
  whatComesNext: string
  whatComesNextDesc: string
  putInOrder: string
  putInOrderDesc: string
  // Shared UI
  goBack: string
  soundOn: string
  soundOff: string
  settings: string
  language: string
  changeLanguage: string
  // PraiseScreen
  wonderful: string
  continue: string
  // Streak
  streakTitle: string
  streakDoneToday: string
  streakWelcomeBack: string
  streakReady: string
  streakBegin: string
  streakBeginDesc: string
  // Reminiscence
  doYouRecognise: string
  yesIRemember: string
  showAnother: string
  // Music
  playNextSong: string
}

const STRINGS: Record<Language, PatientStrings> = {
  english: {
    chooseLanguage: 'Choose your language',
    chooseLanguageSub: 'You can change this anytime from Settings.',
    continueBtn: 'Continue →',
    greeting: 'Hello',
    talkToMe: 'Talk to Me',
    companionTagline: 'Devi is here whenever you need',
    yourActivities: 'Your activities',
    brainGames: 'Brain games',
    helpsMemory: 'Helps memory',
    rememberThis: 'Remember This?',
    rememberThisDesc: 'Familiar things from home',
    listenToMusic: 'Listen to Music',
    listenToMusicDesc: 'Songs from your home region',
    dearDiary: 'Dear Diary',
    dearDiaryDesc: 'Speak your thoughts freely',
    whatDay: 'What Day Is It?',
    whatDayDesc: 'A gentle question about today',
    memoryPairs: 'Memory Pairs',
    memoryPairsDesc: 'Flip cards to find matching pairs',
    kitchenOrField: 'Kitchen or Field?',
    kitchenOrFieldDesc: 'Sort familiar objects into groups',
    whatComesNext: 'What Comes Next?',
    whatComesNextDesc: 'Complete the pattern',
    putInOrder: 'Put in Order',
    putInOrderDesc: 'Arrange steps in the right order',
    goBack: '← Go Back',
    soundOn: '🔊 Sound on',
    soundOff: '🔇 Sound off',
    settings: 'Settings',
    language: 'Language',
    changeLanguage: 'Change language',
    wonderful: 'Wonderful!',
    continue: 'Continue →',
    streakTitle: 'Your Memory Streak',
    streakDoneToday: 'You made time for yourself today.',
    streakWelcomeBack: 'Welcome back! Ready for another memory moment?',
    streakReady: "Ready for today's memory moment?",
    streakBegin: 'Begin Your Memory Journey',
    streakBeginDesc: 'Complete any activity to start your streak',
    doYouRecognise: 'Do you recognise this?',
    yesIRemember: '❤️  Yes, I remember this',
    showAnother: 'Show me another →',
    playNextSong: 'Play the next song →',
  },

  assamese: {
    chooseLanguage: 'আপোনাৰ ভাষা বাছি লওক',
    chooseLanguageSub: 'আপুনি যিকোনো সময়ত সেটিংছৰ পৰা সলনি কৰিব পাৰে।',
    continueBtn: 'আগবাঢ়ক →',
    greeting: 'নমস্কাৰ',
    talkToMe: 'মোৰ সৈতে কথা পাতক',
    companionTagline: 'দেৱী সদায় আপোনাৰ কাষত আছে',
    yourActivities: 'আপোনাৰ কাৰ্যবোৰ',
    brainGames: 'মগজুৰ খেলা',
    helpsMemory: 'স্মৃতি উন্নত কৰে',
    rememberThis: 'এইটো মনত পৰে?',
    rememberThisDesc: 'ঘৰৰ পৰিচিত বস্তু',
    listenToMusic: 'গান শুনক',
    listenToMusicDesc: 'আপোনাৰ অঞ্চলৰ গান',
    dearDiary: 'প্ৰিয় দিনলিপি',
    dearDiaryDesc: 'আপোনাৰ মনৰ কথা কওক',
    whatDay: 'আজি কি বাৰ?',
    whatDayDesc: 'আজিৰ বিষয়ে এটা সহজ প্ৰশ্ন',
    memoryPairs: 'স্মৃতিৰ যোৰ',
    memoryPairsDesc: 'কাৰ্ড ওলটাই যোৰ বিচাৰক',
    kitchenOrField: 'পাকঘৰ নে পথাৰ?',
    kitchenOrFieldDesc: 'পৰিচিত বস্তু বিভক্ত কৰক',
    whatComesNext: 'পিছত কি?',
    whatComesNextDesc: 'ধাৰা সম্পূৰ্ণ কৰক',
    putInOrder: 'ক্ৰমত সজাওক',
    putInOrderDesc: 'পদক্ষেপবোৰ সঠিক ক্ৰমত ৰাখক',
    goBack: '← ঘূৰি যাওক',
    soundOn: '🔊 শব্দ চালু',
    soundOff: '🔇 শব্দ বন্ধ',
    settings: 'বিন্যাস',
    language: 'ভাষা',
    changeLanguage: 'ভাষা সলনি কৰক',
    wonderful: 'অপূৰ্ব!',
    continue: 'আগবাঢ়ক →',
    streakTitle: 'আপোনাৰ স্মৃতিৰ ধাৰা',
    streakDoneToday: 'আজি আপুনি নিজৰ বাবে সময় উলিয়াইছে।',
    streakWelcomeBack: 'আপোনাক আকৌ দেখি ভাল লাগিল!',
    streakReady: 'আজিৰ স্মৃতিৰ মুহূৰ্তৰ বাবে সাজু?',
    streakBegin: 'আপোনাৰ স্মৃতিৰ যাত্ৰা আৰম্ভ কৰক',
    streakBeginDesc: 'যিকোনো কাৰ্য সম্পূৰ্ণ কৰি আৰম্ভ কৰক',
    doYouRecognise: 'এইটো চিনি পাইছে?',
    yesIRemember: '❤️  হয়, মনত আছে',
    showAnother: 'আন এটা দেখুৱাওক →',
    playNextSong: 'পৰৱৰ্তী গান বজাওক →',
  },

  bengali: {
    chooseLanguage: 'আপনার ভাষা বেছে নিন',
    chooseLanguageSub: 'আপনি যেকোনো সময় সেটিংস থেকে পরিবর্তন করতে পারবেন।',
    continueBtn: 'এগিয়ে যান →',
    greeting: 'নমস্কার',
    talkToMe: 'আমার সাথে কথা বলুন',
    companionTagline: 'দেবী সর্বদা আপনার পাশে',
    yourActivities: 'আপনার কার্যক্রম',
    brainGames: 'মস্তিষ্কের খেলা',
    helpsMemory: 'স্মৃতি উন্নত করে',
    rememberThis: 'এটা মনে আছে?',
    rememberThisDesc: 'ঘরের পরিচিত জিনিস',
    listenToMusic: 'গান শুনুন',
    listenToMusicDesc: 'আপনার এলাকার গান',
    dearDiary: 'প্রিয় ডায়েরি',
    dearDiaryDesc: 'মনের কথা বলুন',
    whatDay: 'আজ কী বার?',
    whatDayDesc: 'আজ সম্পর্কে একটি সহজ প্রশ্ন',
    memoryPairs: 'স্মৃতির জোড়া',
    memoryPairsDesc: 'কার্ড উল্টে জোড়া খুঁজুন',
    kitchenOrField: 'রান্নাঘর না মাঠ?',
    kitchenOrFieldDesc: 'পরিচিত জিনিস আলাদা করুন',
    whatComesNext: 'পরে কী আসবে?',
    whatComesNextDesc: 'ধারা সম্পূর্ণ করুন',
    putInOrder: 'ক্রমে সাজান',
    putInOrderDesc: 'ধাপগুলো সঠিক ক্রমে রাখুন',
    goBack: '← ফিরে যান',
    soundOn: '🔊 শব্দ চালু',
    soundOff: '🔇 শব্দ বন্ধ',
    settings: 'সেটিংস',
    language: 'ভাষা',
    changeLanguage: 'ভাষা পরিবর্তন করুন',
    wonderful: 'অসাধারণ!',
    continue: 'এগিয়ে যান →',
    streakTitle: 'আপনার স্মৃতির ধারা',
    streakDoneToday: 'আজ আপনি নিজের জন্য সময় দিয়েছেন।',
    streakWelcomeBack: 'ফিরে আসায় স্বাগত! আরেকটি স্মৃতির মুহূর্তের জন্য প্রস্তুত?',
    streakReady: 'আজকের স্মৃতির মুহূর্তের জন্য প্রস্তুত?',
    streakBegin: 'আপনার স্মৃতির যাত্রা শুরু করুন',
    streakBeginDesc: 'যেকোনো কার্যক্রম শেষ করে শুরু করুন',
    doYouRecognise: 'এটা চিনতে পারছেন?',
    yesIRemember: '❤️  হ্যাঁ, মনে আছে',
    showAnother: 'আরেকটি দেখান →',
    playNextSong: 'পরের গান বাজান →',
  },

  hindi: {
    chooseLanguage: 'अपनी भाषा चुनें',
    chooseLanguageSub: 'आप इसे सेटिंग्स से कभी भी बदल सकते हैं।',
    continueBtn: 'आगे बढ़ें →',
    greeting: 'नमस्ते',
    talkToMe: 'मुझसे बात करें',
    companionTagline: 'देवी हमेशा आपके साथ है',
    yourActivities: 'आपकी गतिविधियाँ',
    brainGames: 'दिमागी खेल',
    helpsMemory: 'याददाश्त सुधारे',
    rememberThis: 'क्या यह याद है?',
    rememberThisDesc: 'घर की जानी-पहचानी चीज़ें',
    listenToMusic: 'संगीत सुनें',
    listenToMusicDesc: 'आपके क्षेत्र के गीत',
    dearDiary: 'प्रिय डायरी',
    dearDiaryDesc: 'अपने मन की बात कहें',
    whatDay: 'आज कौन-सा दिन है?',
    whatDayDesc: 'आज के बारे में एक सरल प्रश्न',
    memoryPairs: 'याददाश्त के जोड़े',
    memoryPairsDesc: 'कार्ड पलटकर जोड़े ढूँढें',
    kitchenOrField: 'रसोई या खेत?',
    kitchenOrFieldDesc: 'जानी-पहचानी चीज़ें अलग करें',
    whatComesNext: 'आगे क्या आएगा?',
    whatComesNextDesc: 'क्रम पूरा करें',
    putInOrder: 'क्रम में लगाएँ',
    putInOrderDesc: 'चरणों को सही क्रम में रखें',
    goBack: '← वापस जाएँ',
    soundOn: '🔊 ध्वनि चालू',
    soundOff: '🔇 ध्वनि बंद',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    changeLanguage: 'भाषा बदलें',
    wonderful: 'बहुत अच्छे!',
    continue: 'आगे बढ़ें →',
    streakTitle: 'आपकी स्मृति की लय',
    streakDoneToday: 'आज आपने अपने लिए समय निकाला।',
    streakWelcomeBack: 'वापसी पर स्वागत! फिर से तैयार हैं?',
    streakReady: 'आज के स्मृति के पल के लिए तैयार?',
    streakBegin: 'अपनी स्मृति की यात्रा शुरू करें',
    streakBeginDesc: 'कोई भी गतिविधि पूरी करके शुरू करें',
    doYouRecognise: 'क्या आप इसे पहचानते हैं?',
    yesIRemember: '❤️  हाँ, मुझे याद है',
    showAnother: 'कोई और दिखाएँ →',
    playNextSong: 'अगला गाना बजाएँ →',
  },

  manipuri: {
    chooseLanguage: 'নহাক্কী ভাষা হান্থোকপা',
    chooseLanguageSub: 'সেটিংদা মতমগী মতম সলানবা থম্বা ঙম্মি।',
    continueBtn: 'হান্না চৎলগু →',
    greeting: 'নমস্কার',
    talkToMe: 'এন্না পান্দে',
    companionTagline: 'দেবী নহাক্না মতমগী মতম লৈরে',
    yourActivities: 'নহাক্কী থৌরমশিং',
    brainGames: 'মাং গী খেল',
    helpsMemory: 'কোথোকপা হেন্না তাবা',
    rememberThis: 'হায়বদু কোথোকপা?',
    rememberThisDesc: 'ইমা পুম্নমক থোং শিংনা',
    listenToMusic: 'সানা শাওনা হায়রে',
    listenToMusicDesc: 'নহাক্কী মফম গী সানা',
    dearDiary: 'প্রিয় ডায়েরি',
    dearDiaryDesc: 'নহাক্কী মতম ওইবা মথৌ হায়জদুনা',
    whatDay: 'নুংশিদা মরি লৈবা?',
    whatDayDesc: 'নুংশিদা মতুংদা হোংলগা',
    memoryPairs: 'কোথোকপা জোড়া',
    memoryPairsDesc: 'কার্ড ওইরম্বা জোড়া পাউথোকপা',
    kitchenOrField: 'থাবক না শাগোই?',
    kitchenOrFieldDesc: 'থোং শিংনা লম্বি ওইথোকপা',
    whatComesNext: 'মথক অমদা?',
    whatComesNextDesc: 'সিরিজ পুরাক্লগা',
    putInOrder: 'ক্রম ওইথোকপা',
    putInOrderDesc: 'ফাওবা মতম মথক অমদা থোকপা',
    goBack: '← হায়রে থোকপু',
    soundOn: '🔊 শব্দ চালু',
    soundOff: '🔇 শব্দ বন্ধ',
    settings: 'সেটিং',
    language: 'ভাষা',
    changeLanguage: 'ভাষা সলানবা',
    wonderful: 'চাউখৎলে!',
    continue: 'হান্না চৎলগু →',
    streakTitle: 'নহাক্কী কোথোকপা সিরিজ',
    streakDoneToday: 'নুংশিদা নহাক্না মতম হায়বিবা।',
    streakWelcomeBack: 'হায়রে লাকপদা সাকহেল্লম্মক!',
    streakReady: 'নুংশিদা কোথোকপা অমনা তৈরি?',
    streakBegin: 'নহাক্কী কোথোকপা যাত্রা শুরু করুন',
    streakBeginDesc: 'যেকোনো থৌরম পুরাক্লগা শুরু করুন',
    doYouRecognise: 'হায়বদু নহাক্না উৎনবা?',
    yesIRemember: '❤️  হৌজিক, কোথোকই',
    showAnother: 'অনৌবা হন্থরে →',
    playNextSong: 'মথক সানা বজাওক →',
  },

  khasi: {
    chooseLanguage: 'Sngewbha ia ka ktien',
    chooseLanguageSub: 'Phi lah ban sla sha Settings neitom neitom.',
    continueBtn: 'Leit sha wang →',
    greeting: 'Khublei',
    talkToMe: 'Shim ia nga',
    companionTagline: 'Devi don sha phi neitom neitom',
    yourActivities: 'Ia ki thmu jong phi',
    brainGames: 'Ki khana myndeng',
    helpsMemory: 'La kynjot ymtoi',
    rememberThis: 'Dei phi kynmaw ia kane?',
    rememberThisDesc: 'Ki jingshisha sha ing',
    listenToMusic: 'Shim ia ki jingtrei',
    listenToMusicDesc: 'Ki jingtrei jong phi ri',
    dearDiary: 'Ka Diary jong ngan',
    dearDiaryDesc: 'Ong ia ki jingkyrkhu',
    whatDay: 'Ubha kyndong u sngi?',
    whatDayDesc: 'Kynmaw ia u sngi mynta',
    memoryPairs: 'Ki phar ymtoi',
    memoryPairsDesc: 'Syngit ia ki kaad ban kynmaw ki phar',
    kitchenOrField: 'Ka nongkynmaw wana ka shnong?',
    kitchenOrFieldDesc: 'Saphsap ia ki jingshisha',
    whatComesNext: 'Aiu lah pynlait?',
    whatComesNextDesc: 'Pynlait ia ka pattern',
    putInOrder: 'Saphsap ia ki rit',
    putInOrderDesc: 'Saphsap ia ki rit sha ka pyrtha',
    goBack: '← Leit sha go',
    soundOn: '🔊 Ktien don',
    soundOff: '🔇 Ktien em',
    settings: 'Settings',
    language: 'Ktien',
    changeLanguage: 'Sla ia ka ktien',
    wonderful: 'Khublei shibun!',
    continue: 'Leit sha wang →',
    streakTitle: 'Ka jingkhein ymtoi jong phi',
    streakDoneToday: 'U sngi mynta phi la pynman ia ka thmu.',
    streakWelcomeBack: 'Khublei phi la pynlait! Ready ban thaw pat?',
    streakReady: 'Ready ban thaw ia ka thmu u sngi mynta?',
    streakBegin: 'Thaw ia ka jingwyllong',
    streakBeginDesc: 'Pynman ban nongtlak ia kaba phi',
    doYouRecognise: 'Dei phi shna ia kane?',
    yesIRemember: '❤️  Hoi, kynmaw ngan',
    showAnother: 'Ban ynda pat →',
    playNextSong: 'Pynkmen ia ka jingtrei pat →',
  },
  bhojpuri: {
    chooseLanguage: 'अपन भाषा चुनीं',
    chooseLanguageSub: 'रउआ एकरा के सेटिंग्स से कबो भी बदल सकीले।',
    continueBtn: 'आगे बढ़ीं →',
    greeting: 'प्रणाम',
    talkToMe: 'हमरा से बात करीं',
    companionTagline: 'देवी रउआ खातिर हर घरी मौजूद बाड़ी',
    yourActivities: 'रउआ खातिर गतिविधि',
    brainGames: 'दिमागी खेल',
    helpsMemory: 'याददाश्त तेज रखे में मदद करेला',
    rememberThis: 'ई चीज याद बा?',
    rememberThisDesc: 'घर-आंगन के पुरान चीजन के याद करीं',
    listenToMusic: 'गीत-संगीत सुनीं',
    listenToMusicDesc: 'अपन माटी के सुरीला गीत',
    dearDiary: 'हमार डायरी',
    dearDiaryDesc: 'अपन मन के बात अउर याद दर्ज करीं',
    whatDay: 'आज कवन दिन ह?',
    whatDayDesc: 'आज के दिन अउर तारीख जानीं',
    memoryPairs: 'जोड़ा मिलाईं',
    memoryPairsDesc: 'पत्ता पलट के सही जोड़ा खोजल जाई',
    kitchenOrField: 'रसोइया कि खेत?',
    kitchenOrFieldDesc: 'चीजन के उनकर सही जगह पर रखीं',
    whatComesNext: 'एकरा बाद का आई?',
    whatComesNextDesc: 'पैटर्न पूरा करीं',
    putInOrder: 'क्रम से सजाईं',
    putInOrderDesc: 'काम के सही क्रम में रखीं',
    goBack: '← पाछे जाईं',
    soundOn: '🔊 आवाज चालू',
    soundOff: '🔇 आवाज बंद',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    changeLanguage: 'भाषा बदलीं',
    wonderful: 'बहुत बढ़िया! 🎉',
    continue: 'आगे बढ़ीं →',
    streakTitle: 'रउआ नियमितता',
    streakDoneToday: 'आज के गतिविधि पूरा भइल।',
    streakWelcomeBack: 'स्वागत बा! आज कुछ नया कइल जाव?',
    streakReady: 'आज के गतिविधि खातिर तैयार बानी?',
    streakBegin: 'शुरू करीं',
    streakBeginDesc: 'दिन के शुरुआत नीक करीं',
    doYouRecognise: 'का रउआ एकरा के पहचानत बानी?',
    yesIRemember: '❤️ हाँ, हमरा याद बा',
    showAnother: 'अगिला देखीं →',
    playNextSong: 'अगिला गाना बजाईं →',
  },
  konkani: {
    chooseLanguage: 'तुमची भास वेंचून काढा',
    chooseLanguageSub: 'हें तुमी केन्नाय सेटिंग्सांतल्यान बदलूंक शकतात.',
    continueBtn: 'फुडें वचा →',
    greeting: 'नमस्कार',
    talkToMe: 'म्हाका उलय',
    companionTagline: 'देवी तुज्या वांगडा सदांच आसा',
    yourActivities: 'तुमल्यो कार्यावळी',
    brainGames: 'मेंदवाचे खेळ',
    helpsMemory: 'याद बरी दवरपाक मजत करता',
    rememberThis: 'हें तुमकां उगडास आसा?',
    rememberThisDesc: 'घरांतल्या पोरन्या वस्तूंचो उगडास',
    listenToMusic: 'संगीत आयका',
    listenToMusicDesc: 'तुमच्या गांवांतलीं सोबीत पदां',
    dearDiary: 'म्हजी डायरी',
    dearDiaryDesc: 'तुमच्यो यादी आनी विचार सांगा',
    whatDay: 'आयज खंयचो दीस?',
    whatDayDesc: 'आयचो वार आनी तारीख तपासात',
    memoryPairs: 'जोडयो जुळयात',
    memoryPairsDesc: 'कार्ड्स उलटून सारक्यो जोडयो सोदात',
    kitchenOrField: 'रांदचेकूड काय शेत?',
    kitchenOrFieldDesc: 'वस्तू तांच्या जागेर दवरात',
    whatComesNext: 'फुडें कितें येतले?',
    whatComesNextDesc: 'पॅटर्न पुराय करात',
    putInOrder: 'क्रमान मांडा',
    putInOrderDesc: 'पावलां योग्य क्रमान मांडा',
    goBack: '← फाटीं वचा',
    soundOn: '🔊 आवाज चालू',
    soundOff: '🔇 आवाज बंद',
    settings: 'सेटिंग्स',
    language: 'भास',
    changeLanguage: 'भास बदलात',
    wonderful: 'भोव बरें! 🎉',
    continue: 'फुडें वचा →',
    streakTitle: 'तुमचो नेमाचो प्रवास',
    streakDoneToday: 'आयचो अभ्यास पुराय जालो.',
    streakWelcomeBack: 'परत येवकार! आयज खेळूंक तयार आसात?',
    streakReady: 'आयच्या खेळाक तयार आसात?',
    streakBegin: 'सुरू करात',
    streakBeginDesc: 'आयच्या दिसाची सोबीत सुरवात',
    doYouRecognise: 'तुमी हें वळखतात काय?',
    yesIRemember: '❤️ हय, म्हाका उगडास आसा',
    showAnother: 'दुसरें पळयात →',
    playNextSong: 'फुडलें पद वाजय →',
  },
}

export function t(lang: Language): PatientStrings {
  return STRINGS[lang]
}

// For the language selection screen
export interface LangOption {
  lang: Language
  nativeName: string
  romanName: string
  speechLang: string
  speechText: string
}

export const LANG_OPTIONS: LangOption[] = [
  { lang: 'assamese', nativeName: 'অসমীয়া',       romanName: 'Assamese', speechLang: 'as-IN',  speechText: 'অসমীয়া' },
  { lang: 'bengali',  nativeName: 'বাংলা',          romanName: 'Bengali',  speechLang: 'bn-IN',  speechText: 'বাংলা' },
  { lang: 'hindi',    nativeName: 'हिंदी',           romanName: 'Hindi',    speechLang: 'hi-IN',  speechText: 'हिंदी' },
  { lang: 'bhojpuri', nativeName: 'भोजपुरी',        romanName: 'Bhojpuri', speechLang: 'hi-IN',  speechText: 'प्रणाम, भोजपुरी' },
  { lang: 'konkani',  nativeName: 'कोंकणी',         romanName: 'Konkani',  speechLang: 'hi-IN',  speechText: 'नमस्कार, कोंकणी' },
  { lang: 'english',  nativeName: 'English',        romanName: '',         speechLang: 'en-IN',  speechText: 'English' },
  { lang: 'manipuri', nativeName: 'মেইতেই',         romanName: 'Manipuri', speechLang: 'mni-IN', speechText: 'মেইতেই' },
  { lang: 'khasi',    nativeName: 'Ka Ktien Khasi', romanName: 'Khasi',    speechLang: 'en-IN',  speechText: 'Khublei, Khasi' },
]
