import type { Language } from './i18n'

export interface MusicTrack {
  id: string
  lang?: Language
  isPopular?: boolean
  emoji: string
  title: string
  artist?: string
  region: string
  instrument: string
  lyric: string
  fullLyrics?: string[]
  romanLyric?: string
  lyricEng: string
  scene: string
  notes: number[]
  bpm: number
  youtubeId?: string
}

export const TWINKLE_NOTES = [
  261.63, 261.63, 392, 392, 440, 440, 392, 0,
  349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63, 0,
  392, 392, 349.23, 349.23, 329.63, 329.63, 293.66, 0,
  392, 392, 349.23, 349.23, 329.63, 329.63, 293.66, 0,
  261.63, 261.63, 392, 392, 440, 440, 392, 0,
  349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
]

const DEFAULT_POP_NOTES = [
  329.63, 392, 440, 493.88, 523.25, 493.88, 440, 392, 0,
  329.63, 349.23, 392, 440, 392, 349.23, 329.63
]

export const MUSIC_TRACKS: MusicTrack[] = [
  // ─── Twinkle Twinkle in all 8 Languages ───
  {
    id: 'twinkle-english',
    lang: 'english',
    emoji: '⭐',
    title: 'Twinkle Twinkle Little Star',
    region: 'English Nursery Rhyme',
    instrument: 'Celesta & Acoustic Guitar',
    lyric: 'Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.',
    lyricEng: '"Twinkle, twinkle, little star, how I wonder what you are..."',
    scene: 'A calm starry night, watching diamonds twinkle softly in the clear sky.',
    notes: TWINKLE_NOTES,
    bpm: 82,
    youtubeId: 'yCjJyiqpAuU'
  },
  {
    id: 'twinkle-assamese',
    lang: 'assamese',
    emoji: '🌟',
    title: 'টিপ-টিপ সৰু তৰা (Twinkle Twinkle)',
    region: 'Assam — শিশু গীত',
    instrument: 'বাঁহী আৰু খোল (Flute & Bells)',
    lyric: 'টিপ-টিপ কৰা সৰু তৰা,\nভাবোঁ তুমি কেনেকুৱা বাৰু?\nআকাশৰ বহু ওপৰত থকা,\nহীৰাৰ দৰে উজলি উঠা।',
    lyricEng: '"Twinkle, twinkle, little star, shining like a diamond high in the night sky..."',
    scene: 'A cool evening breeze in the village courtyard, watching stars twinkle above the betel nut palms.',
    notes: TWINKLE_NOTES,
    bpm: 82
  },
  {
    id: 'twinkle-bengali',
    lang: 'bengali',
    emoji: '✨',
    title: 'টিপটিপ করে ছোট তারা (Twinkle Twinkle)',
    region: 'Bengal — শিশু সঙ্গীত',
    instrument: 'বাঁশি ও হারমোনিয়াম (Flute & Harmonium)',
    lyric: 'টিপটিপ জ্বলে ছোট তারা,\nকেমন আছো বলো তোমরা?\nনীল আকাশের অনেক দূরে,\nহীরার মতো আছো জুড়ে।',
    lyricEng: '"Little star twinkling gently, how high you shine like a diamond in the blue sky..."',
    scene: 'Sitting on the terrace under the open Bengal night sky, counting the peaceful stars.',
    notes: TWINKLE_NOTES,
    bpm: 82
  },
  {
    id: 'twinkle-hindi',
    lang: 'hindi',
    emoji: '⭐',
    title: 'ट्विंकल ट्विंकल नन्हे तारे (Twinkle Twinkle)',
    region: 'Hindi — बाल गीत',
    instrument: 'जलतरंग और बाँसुरी (Jaltarang & Flute)',
    lyric: 'चमचम चमके नन्हे तारे,\nलगते हमको कितने प्यारे!\nआसमान में सबसे ऊँचे,\nहीरे जैसे चमक दिखाते।',
    lyricEng: '"Twinkle, twinkle, tiny stars, you look so dear to our hearts, shining bright like diamonds..."',
    scene: 'Lying on the cot in the open courtyard on a peaceful summer night, gazing at the glittering stars.',
    notes: TWINKLE_NOTES,
    bpm: 82,
    youtubeId: 'Oq5Qn9h73YQ'
  },
  {
    id: 'twinkle-bhojpuri',
    lang: 'bhojpuri',
    emoji: '🌟',
    title: 'चमचम चमके नन्हू तारा (Twinkle Twinkle)',
    region: 'Bhojpuri — लोक बाल गीत',
    instrument: 'बाँसुरी अउर मंजीरा (Flute & Manjira)',
    lyric: 'चमचम चमके नन्हू तारा,\nलागेला तू कतना प्यारा!\nआसमान में ऊँच उड़ान,\nहीरा जइसन रूप ललाम।',
    lyricEng: '"Twinkle twinkle little star, you look so lovely in the sky, shimmering like a precious diamond..."',
    scene: 'Resting on the verandah after the evening lamps are lit, singing along to the starry night.',
    notes: TWINKLE_NOTES,
    bpm: 82
  },
  {
    id: 'twinkle-konkani',
    lang: 'konkani',
    emoji: '✨',
    title: 'लुकलुक करता ल्हानशा तारा (Twinkle Twinkle)',
    region: 'Goa / Konkan — बालगीत',
    instrument: 'बांसरी आनी घुमट (Flute & Ghumat)',
    lyric: 'लुकलुक करता ल्हानशा तारा,\nकितें तूं म्हाका कळना जालां!\nआकाशांत मळबांत वयर,\nहीऱ्याभाशेन लखलखताय थंय.',
    lyricEng: '"Little star shimmering with light, how wondrous you are, shining like a diamond over the sea..."',
    scene: 'Looking out toward the Arabian Sea under a soft Konkan night sky sprinkled with stars.',
    notes: TWINKLE_NOTES,
    bpm: 82
  },
  {
    id: 'twinkle-manipuri',
    lang: 'manipuri',
    emoji: '⭐',
    title: 'থৌনা তাবা পিকচবা থবাং (Twinkle Twinkle)',
    region: 'Manipur — অঙাংগী শৈশক',
    instrument: 'পেনা অমসুং বাঁশী (Pena & Bamboo Flute)',
    lyric: 'থৌনা তাবা পিকচবা থবাং,\nনহাক করম্বনো হায়বা খাঙনিংই!\nস্বর্গগী অতৈয়া অৱাংবদা,\nহীরাগুম্না ঙাল্লি অতীয়াদা।',
    lyricEng: '"Twinkle twinkle little star, shining in the high heavenly sky like a luminous diamond..."',
    scene: 'Overlooking Loktak lake at dusk as gentle ripples mirror the first stars of the evening.',
    notes: TWINKLE_NOTES,
    bpm: 82
  },
  {
    id: 'twinkle-khasi',
    lang: 'khasi',
    emoji: '🌟',
    title: 'Ki Khlur Ba Thaba (Twinkle Twinkle)',
    region: 'Meghalaya — Jingrwai Khynnah',
    instrument: 'Tangmuri & Duitara lute',
    lyric: 'Thaba, thaba, khlur barit,\nKae phi long nga kwah ban tip!\nSha jrong eh ha sahit bneng,\nKum u mawlynnai ba phylla.',
    lyricEng: '"Twinkle, twinkle, little star, high up in the heavens shining like a wondrous diamond..."',
    scene: 'From the green peaks of Cherrapunji, gazing at the crystal-clear stars blanketed in mountain mist.',
    notes: TWINKLE_NOTES,
    bpm: 82
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── HINDI SONGS (7 Famous Hits + Classics) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'tum-hi-ho',
    lang: 'hindi',
    isPopular: true,
    emoji: '❤️',
    title: 'तुम ही हो (Tum Hi Ho)',
    artist: 'Arijit Singh',
    region: 'Hindi Romantic Anthem (Aashiqui 2)',
    instrument: 'Piano & Strings',
    lyric: 'हम तेरे बिन अब रह नहीं सकते\nतेरे बिना क्या वजूद मेरा\nतुझसे जुदा गर हो जाएंगे\nतो खुद से ही हो जाएंगे जुदा...',
    romanLyric: 'Hum tere bin ab reh nahi sakte, tere bina kya wajood mera...\nTujhse juda gar ho jaayenge, toh khud se hi ho jaayenge juda.',
    fullLyrics: [
      'हम तेरे बिन अब रह नहीं सकते, तेरे बिना क्या वजूद मेरा',
      'तुझसे जुदा गर हो जाएंगे, तो खुद से ही हो जाएंगे जुदा',
      'क्योंकि तुम ही हो, अब तुम ही हो',
      'जिंदगी अब तुम ही हो...',
      'चैन भी, मेरा दर्द भी, मेरी आशिकी अब तुम ही हो!'
    ],
    lyricEng: '"Because you alone are my life, my peace, my pain, and my devotion..."',
    scene: 'Gentle raindrops falling on the windowpane, bringing warm memories of boundless love.',
    notes: DEFAULT_POP_NOTES,
    bpm: 86,
    youtubeId: 'Umqb9Ken_mc'
  },
  {
    id: 'kesariya',
    lang: 'hindi',
    isPopular: true,
    emoji: '🧡',
    title: 'केसरिया (Kesariya)',
    artist: 'Arijit Singh',
    region: 'Hindi Hit (Brahmāstra)',
    instrument: 'Acoustic Guitar & Bansuri',
    lyric: 'केसरिया तेरा इश्क़ है पिया\nरंग जाऊं जो मैं हाथ लगाऊं\nदिन बीते सारा तेरी फ़िक्र में\nरैन सारी तेरी ख़ैर मनाऊं...',
    romanLyric: 'Kesariya tera ishq hai piya, rang jaaun jo main haath lagaaun...\nDin beete saara teri fikar mein, rain saari teri khair manaaun.',
    fullLyrics: [
      'केसरिया तेरा इश्क़ है पिया, रंग जाऊं जो मैं हाथ लगाऊं',
      'दिन बीते सारा तेरी फ़िक्र में, रैन सारी तेरी ख़ैर मनाऊं',
      'पतझड़ के मौसम में भी रंगी चनार जैसी',
      'झोंके जो हवा के तो बसंत बहार जैसी...',
      'केसरिया तेरा इश्क़ है पिया!'
    ],
    lyricEng: '"Saffron-hued is your sweet love, dear; the whole day passes thinking of you..."',
    scene: 'Sunlight washing over the golden ghats of Varanasi and petals floating on the river.',
    notes: DEFAULT_POP_NOTES,
    bpm: 90,
    youtubeId: 'BddP6PYo2sU'
  },
  {
    id: 'apna-bana-le',
    lang: 'hindi',
    isPopular: true,
    emoji: '🐺',
    title: 'अपना बना ले (Apna Bana Le)',
    artist: 'Arijit Singh',
    region: 'Hindi Hit (Bhediya)',
    instrument: 'Acoustic Guitar & Piano',
    lyric: 'तू मेरा कोई ना हो के भी कुछ लागे\nकिया रे जो भी तूने कैसे किया रे\nजिया को मेरे बांध ऐसे लिया रे...',
    romanLyric: 'Tu mera koi na hoke bhi kuch laage, kiya re jo bhi tune kaise kiya re...\nApna bana le piya, apna bana le piya!',
    fullLyrics: [
      'तू मेरा कोई ना हो के भी कुछ लागे',
      'किया रे जो भी तूने कैसे किया रे',
      'जिया को मेरे बांध ऐसे लिया रे...',
      'अपना बना ले पिया, अपना बना ले पिया',
      'दिल के नगर में शहर तू बसा ले पिया!'
    ],
    lyricEng: '"Make me yours, my beloved; build your peaceful city in my heart..."',
    scene: 'Green pine-covered hills in Arunachal Pradesh at dawn, peaceful and whispering in the breeze.',
    notes: DEFAULT_POP_NOTES,
    bpm: 88,
    youtubeId: 'VMuEerBSn10'
  },
  {
    id: 'chaiyya-chaiyya',
    lang: 'hindi',
    isPopular: true,
    emoji: '🚂',
    title: 'छैंया छैंया (Chaiyya Chaiyya)',
    artist: 'Sukhwinder Singh & Sapna Awasthi',
    region: 'Hindi Folk-Fusion (Dil Se / A.R. Rahman)',
    instrument: 'Dholak, Shenai & Train Beats',
    lyric: 'चल छैंया छैंया छैंया छैंया\nजिनके सर हो इश्क़ की छांव\nपांव के नीचे जन्नत होगी\nचल छैंया छैंया...',
    romanLyric: 'Chal chaiyya chaiyya chaiyya chaiyya, jinke sar ho ishq ki chhaanv...\nPaanv ke neeche jannat hogi, chal chaiyya chaiyya!',
    fullLyrics: [
      'जिनके सर हो इश्क़ की छांव, पांव के नीचे जन्नत होगी',
      'चल छैंया छैंया छैंया छैंया...',
      'वो यार है जो खुशबू की तरह, जिसकी ज़ुबां उर्दू की तरह',
      'मेरी शाम-रात, मेरी कायनात, वो यार मेरा सैयां सैयां!',
      'चल छैंया छैंया!'
    ],
    lyricEng: '"Walk beneath the cool shade of love, where heaven lies under your dancing feet..."',
    scene: 'A toy train winding joyfully through the misty Nilgiri hills with rhythmic clapping.',
    notes: DEFAULT_POP_NOTES,
    bpm: 102,
    youtubeId: 'PQmSUHh0Xdc'
  },
  {
    id: 'kabira',
    lang: 'hindi',
    isPopular: true,
    emoji: '🍂',
    title: 'कबीरा (Kabira)',
    artist: 'Arijit Singh & Tochi Raina',
    region: 'Hindi Soul (Yeh Jawaani Hai Deewani)',
    instrument: 'Dufli, Acoustic Guitar & Harmonium',
    lyric: 'कैसी तेरी खुदगर्जी\nना धूप चुने ना छांव\nकैसी तेरी खुदगर्जी\nकिसी तौर टिके ना पांव...\nमन मस्त मगन मन मस्त मगन!',
    romanLyric: 'Kaisi teri khudgarzi, na dhoop chune na chhaanv...\nRe Kabira maan jaa, re Fakeera maan jaa!',
    fullLyrics: [
      'कैसी तेरी खुदगर्जी, ना धूप चुने ना छांव',
      'कैसी तेरी खुदगर्जी, किसी तौर टिके ना पांव...',
      'रे कबीरा मान जा, रे फकीरा मान जा',
      'आजा तुझको पुकारे तेरी परछाइयां!',
      'टूटी चारपाई वही, ठंडी पुरवाई रस्ता देखे...'
    ],
    lyricEng: '"Listen, O wandering Kabira, come home to the cool evening breeze and the family waiting for you..."',
    scene: 'Old family home in the village at sunset, sitting together on a woven charpai drinking warm tea.',
    notes: DEFAULT_POP_NOTES,
    bpm: 82,
    youtubeId: 'jHNNsdjC0QY'
  },
  {
    id: 'tujh-mein-rab',
    lang: 'hindi',
    isPopular: true,
    emoji: '🙏',
    title: 'तुझ में रब दिखता है (Tujh Mein Rab Dikhta Hai)',
    artist: 'Roop Kumar Rathod',
    region: 'Hindi Devotional & Romantic (Rab Ne Bana Di Jodi)',
    instrument: 'Sarangi & Acoustic Strings',
    lyric: 'तुझ में रब दिखता है, यारा मैं क्या करूँ\nसजदे सर झुकता है, यारा मैं क्या करूँ...',
    romanLyric: 'Tujh mein rab dikhta hai, yaara main kya karoon...\nSajde sar jhukta hai, yaara main kya karoon!',
    fullLyrics: [
      'तुझ में रब दिखता है, यारा मैं क्या करूँ',
      'सजदे सर झुकता है, यारा मैं क्या करूँ',
      'रब ने बना दी जोड़ी...',
      'चम-चम आए मुझे तरसाए, तेरा साया तेरे संग आए',
      'तुझ में रब दिखता है, यारा मैं क्या करूँ!'
    ],
    lyricEng: '"In you, I see the divine; my head bows in heartfelt reverence..."',
    scene: 'Golden Temple pond at dusk, pure calm, devotion, and unconditional life partnership.',
    notes: DEFAULT_POP_NOTES,
    bpm: 78,
    youtubeId: 'qoq8B8ThgEM'
  },
  {
    id: 'gulabi-aankhen',
    lang: 'hindi',
    isPopular: true,
    emoji: '🌹',
    title: 'गुलाबी आँखें (Gulabi Aankhen)',
    artist: 'Mohammed Rafi',
    region: 'Hindi Golden Era Retro (The Train)',
    instrument: 'Bongos, Brass & Accordion',
    lyric: 'गुलाबी आँखें जो तेरी देखीं\nशराबी ये दिल हो गया\nसंभालो मुझको ओ मेरे यारों\nसंभलना मुश्किल हो गया...',
    romanLyric: 'Gulabi aankhen jo teri dekheen, sharabi ye dil ho gaya...\nSambhaalo mujhko o mere yaaron, sambhalna mushkil ho gaya!',
    fullLyrics: [
      'गुलाबी आँखें जो तेरी देखीं, शराबी ये दिल हो गया',
      'संभालो मुझको ओ मेरे यारों, संभलना मुश्किल हो गया',
      'दिल में मेरे ख़्वाब तेरे, तस्वीरें जैसे हों दीवार पे',
      'तुझपे फ़िदा मैं क्यों हुआ, आता है गुस्सा मुझे प्यार पे!',
      'गुलाबी आँखें जो तेरी देखीं...'
    ],
    lyricEng: '"When I saw your lovely rose-like eyes, my heart was enchanted beyond words..."',
    scene: 'A retro café with smiling friends singing together to Mohammed Rafi on the transistor radio.',
    notes: DEFAULT_POP_NOTES,
    bpm: 112,
    youtubeId: 'I5t894l5b1w'
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── BENGALI SONGS (7 Popular Hits + Classics) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'tomake-chai',
    lang: 'bengali',
    isPopular: true,
    emoji: '☕',
    title: 'তোমাকে চাই (Tomake Chai)',
    artist: 'Kabir Suman',
    region: 'Bengal Modern Classic (1992)',
    instrument: 'Acoustic Guitar & Mouth Organ',
    lyric: 'হাজার বছর ধরে শুধু তোমাকে চাই\nশিউলির ঘ্রাণে ঘ্রাণে তোমাকে চাই\nবৃষ্টির ছন্দে ছন্দে তোমাকে চাই...',
    romanLyric: 'Haajar bochor dhore shudhu tomake chai, shiulir ghrane ghrane tomake chai...',
    fullLyrics: [
      'হাজার বছর ধরে শুধু তোমাকে চাই',
      'শিউলির ঘ্রাণে ঘ্রাণে তোমাকে চাই',
      'এক কাপ চায়ের আড্ডায় তোমাকে চাই',
      'রাস্তার ভিড়ে আর ট্রামের লাইনে তোমাকে চাই...',
      'তোমাকে চাই, তোমাকে চাই!'
    ],
    lyricEng: '"Across a thousand years, in the fragrance of autumn shiuli flowers, I want you beside me..."',
    scene: 'College street tea shop on a rainy afternoon, reading poetry and sharing laughter.',
    notes: DEFAULT_POP_NOTES,
    bpm: 80,
    youtubeId: 'NjLWfE5JkXs'
  },
  {
    id: 'amake-amar-moto',
    lang: 'bengali',
    isPopular: true,
    emoji: '🌧️',
    title: 'আমাকে আমার মতো থাকতে দাও (Amake Amar Moto)',
    artist: 'Anupam Roy',
    region: 'Bengal Modern Melody (Autograph)',
    instrument: 'Acoustic Guitar & Piano',
    lyric: 'আমাকে আমার মতো থাকতে দাও\nআমি নিজেকে নিজের মতো গুছিয়ে নিয়েছি\nযতটা তোমায় দেখতে পাই\nততটাই ভালোবেসে ফেলেছি...',
    romanLyric: 'Amake amar moto thakte dao, aami nijeke nijer moto guchiye niyechi...',
    fullLyrics: [
      'আমাকে আমার মতো থাকতে দাও',
      'আমি নিজেকে নিজের মতো গুছিয়ে নিয়েছি',
      'যেটা ছিল না ছিল না সেটা না পাওয়াই থাক',
      'সব পেলে নষ্ট জীবন...',
      'আমাকে আমার মতো থাকতে দাও!'
    ],
    lyricEng: '"Let me be in my own world, at peace with life and all its quiet beauty..."',
    scene: 'Looking at raindrops stream down the window of a Kolkata yellow taxi at dusk.',
    notes: DEFAULT_POP_NOTES,
    bpm: 84,
    youtubeId: 'ZcY96tC0AQs'
  },
  {
    id: 'benche-thakar-gaan',
    lang: 'bengali',
    isPopular: true,
    emoji: '☀️',
    title: 'বেঁচে থাকার গান (Benche Thakar Gaan)',
    artist: 'Anupam Roy & Rupam Islam',
    region: 'Bengal Uplifting Melody (Autograph)',
    instrument: 'Electric & Acoustic Guitars',
    lyric: 'বেঁচে থাকার গান গাইব আবার\nকুয়াশার চাদর সরিয়ে দেবো\nনতুন ভোরে আলো দেখতে পাবো...',
    romanLyric: 'Benche thakar gaan gaaibo aabar, kuyashar chador soriye debo...',
    fullLyrics: [
      'বেঁচে থাকার গান গাইব আবার',
      'কুয়াশার চাদর সরিয়ে দেবো',
      'নতুন ভোরে আলো দেখতে পাবো...',
      'যদি হারাই আমি মেঘের দেশে',
      'তুমি খুঁজে নিও ভালোবেসে!'
    ],
    lyricEng: '"I shall sing the anthem of life once more, parting the mist to welcome the morning sunshine..."',
    scene: 'Walking by Victoria Memorial early in the morning as gentle fog rises into brilliant sunlight.',
    notes: DEFAULT_POP_NOTES,
    bpm: 92,
    youtubeId: 'k2oYJb-N144'
  },
  {
    id: 'bojhena-shey-bojhena',
    lang: 'bengali',
    isPopular: true,
    emoji: '💔',
    title: 'বোঝেনা সে বোঝেনা (Bojhena Shey Bojhena)',
    artist: 'Arijit Singh',
    region: 'Bengal Superhit Romance',
    instrument: 'Strings, Flute & Piano',
    lyric: 'বোঝেনা সে বোঝেনা\nকিছুতেই বোঝেনা\nমন আমার মানে না\nবোঝেনা সে বোঝেনা...',
    romanLyric: 'Bojhena shey bojhena, kichutei bojhena... mon aamar maane na!',
    fullLyrics: [
      'বোঝেনা সে বোঝেনা, কিছুতেই বোঝেনা',
      'মন আমার মানে না, বোঝেনা সে বোঝেনা',
      'কেন মেঘে মেঘে আকাশ ভরে যায়',
      'কেন চোখ দুটো আজ জলে ভিজে যায়...',
      'বোঝেনা সে বোঝেনা!'
    ],
    lyricEng: '"My heart wanders and yearns, why does the quiet heart refuse to understand..."',
    scene: 'Gentle breeze over the Hooghly riverbank in the evening as boats drift slowly by.',
    notes: DEFAULT_POP_NOTES,
    bpm: 88,
    youtubeId: 'J2JQQm1h6xQ'
  },
  {
    id: 'barandaye-roddur',
    lang: 'bengali',
    isPopular: true,
    emoji: '🌿',
    title: 'বারান্দায় রোদ্দুর (Barandaye Roddur)',
    artist: 'Bhoomi (Surojit Chatterjee)',
    region: 'Bengal Folk Rock Classic',
    instrument: 'Dotara, Flute & Khamak',
    lyric: 'বারান্দায় রোদ্দুর, আমি আরামকেদারায়\nচোখ বুজে বসে আছি একলা নিরালায়...\nএকটু একটু করে মনে পড়ে কত কথা!',
    romanLyric: 'Barandaye roddur, aami aaramkedaray, chokh buje boshe aachi ekla niralaaye...',
    fullLyrics: [
      'বারান্দায় রোদ্দুর, আমি আরামকেদারায়',
      'চোখ বুজে বসে আছি একলা নিরালায়...',
      'স্মৃতির পাতা উল্টে যায়',
      'পুরোনো দিন হাতছানি দেয়',
      'বারান্দায় রোদ্দুর, মিষ্টি সোনা রোদ!'
    ],
    lyricEng: '"Warm sunlight on the verandah, resting on the armchair with fond memories flowing back..."',
    scene: 'Rocking gently in an armchair on the sunny red-tiled balcony with a warm cup of chai.',
    notes: DEFAULT_POP_NOTES,
    bpm: 96,
    youtubeId: 'E70oxtms_qg'
  },
  {
    id: 'e-tumi-kemon-tumi',
    lang: 'bengali',
    isPopular: true,
    emoji: '🎭',
    title: 'এ তুমি কেমন তুমি (E Tumi Kemon Tumi)',
    artist: 'Rupankar Bagchi (Kabir Suman)',
    region: 'National Award Winner (Jaatishwar)',
    instrument: 'Dotara, Cello & Violin',
    lyric: 'এ তুমি কেমন তুমি\nচোখের তারায় লুকিয়ে থাকো\nএ কেমন আলো আঁধার\nমনের গভীরে ছবি আঁকো...',
    romanLyric: 'E tumi kemon tumi, chokher taray lukiye thaako... e kemon aalo aandhar!',
    fullLyrics: [
      'এ তুমি কেমন তুমি, চোখের তারায় লুকিয়ে থাকো',
      'এ কেমন আলো আঁধার, মনের গভীরে ছবি আঁকো...',
      'তুমি কার কে তোমায় চেনে',
      'তুমি ভাসাও সুরের বানে',
      'এ তুমি কেমন তুমি!'
    ],
    lyricEng: '"What wondrous soul are you, dwelling in the twinkle of my eyes and painting melodies in my heart..."',
    scene: 'Classic heritage Kolkata mansion glowing in warm incandescent light with classical string music.',
    notes: DEFAULT_POP_NOTES,
    bpm: 76,
    youtubeId: 'B_ucVJpcHVc'
  },
  {
    id: 'majhe-majhe-tobo',
    lang: 'bengali',
    isPopular: true,
    emoji: '🌺',
    title: 'মাঝে মাঝে তব দেখা পাই (Majhe Majhe Tobo)',
    artist: 'Rabindranath Tagore',
    region: 'Bengal Soul Devotional (Rabindra Sangeet)',
    instrument: 'Esraj & Harmonium',
    lyric: 'মাঝে মাঝে তব দেখা পাই, চিরদিন কেন পাই না?\nকেন মেঘ আসে হৃদয়-আকাশে, तोমারে দেখিতে দেয় না...',
    romanLyric: 'Majhe majhe tobo dekha paai, chirodin keno paai na?\nKeno megh aashe hridoyo aakashe, tomare dekhite dey na...',
    fullLyrics: [
      'মাঝে মাঝে তব দেখা পাই, চিরদিন কেন পাই না?',
      'কেন মেঘ আসে হৃদয়-আকাশে, তোমারে দেখিতে দেয় না...',
      'খনিক আলোকে আঁখির পলকে তোমারে যবে পাই দেখে',
      'ভয় হয় পাছে হারাই তোমারে, হারায়ে তোমারে কাঁদে হিয়া!',
      'মাঝে মাঝে তব দেখা পাই...'
    ],
    lyricEng: '"Sometimes I catch a glimpse of your grace; why can I not feel it always? Dispel the clouds from my heart..."',
    scene: 'Sitting under the shade of a serene banyan tree in Santiniketan at dawn, peaceful and grounded.',
    notes: DEFAULT_POP_NOTES,
    bpm: 74,
    youtubeId: 'XOuc-oVSOnw'
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── BHOJPURI SONGS (6 Major Hits) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'lollypop-lagelu',
    lang: 'bhojpuri',
    isPopular: true,
    emoji: '🍭',
    title: 'लॉलीपॉप लागेलू (Lollypop Lagelu)',
    artist: 'Pawan Singh',
    region: 'Bhojpuri Global Anthem',
    instrument: 'Dhol, Brass & Synthesizer',
    lyric: 'कमरिया करे लपालप, लॉलीपॉप लागेलू!\nजब तू हँसेलु त गोरिया\nलागेलु बड़ी कमाल...',
    romanLyric: 'Kamariya kare lapa lap, lollypop lagelu! Jab tu hansele ta goriya...',
    fullLyrics: [
      'कमरिया करे लपालप, लॉलीपॉप लागेलू!',
      'जब तू हँसेलु त गोरिया, लागेलु बड़ी कमाल',
      'जिला टॉप लागेलू हो, जिला टॉप लागेलू!',
      'कमरिया करे लपालप, लॉलीपॉप लागेलू!'
    ],
    lyricEng: '"Your joyous laugh and rhythmic celebration brings lively smiles across the whole district..."',
    scene: 'A festive village celebration where everyone claps in rhythm and dances with vibrant energy.',
    notes: DEFAULT_POP_NOTES,
    bpm: 110,
    youtubeId: 'Gr8G_ldltDE'
  },
  {
    id: 'raate-diya-butake',
    lang: 'bhojpuri',
    isPopular: true,
    emoji: '🪔',
    title: 'राते दिया बुताके (Raate Diya Butake)',
    artist: 'Pawan Singh & Indu Sonali',
    region: 'Bhojpuri Superhit (Satya)',
    instrument: 'Dholak, Shenai & Beats',
    lyric: 'राते दिया बुताके पिया क्या-क्या किया हो\nतोहरा से का बताईं हमार मन खुश किया हो...',
    romanLyric: 'Raate diya butaake piya kya-kya kiya ho, tohra se ka bataai hamaar man khush kiya ho...',
    fullLyrics: [
      'राते दिया बुताके पिया क्या-क्या किया हो',
      'तोहरा से का बताईं हमार मन खुश किया हो',
      'हँसि-हँसि बोले सजनवा, मीठी-मीठी बतियाँ',
      'राते दिया बुताके पिया क्या-क्या किया!'
    ],
    lyricEng: '"When the evening lamps were turned soft, sweet laughter and fond memories filled the night..."',
    scene: 'Lively courtyard music on a cool night after the village festival finishes.',
    notes: DEFAULT_POP_NOTES,
    bpm: 104,
    youtubeId: 'H0wcEX6BXEw'
  },
  {
    id: 'chhalakata-hamro',
    lang: 'bhojpuri',
    isPopular: true,
    emoji: '🌊',
    title: 'छलकता हमरो जवनिया (Chhalakata Hamro Jawaniya)',
    artist: 'Pawan Singh & Priyanka Singh',
    region: 'Bhojpuri Mega Hit',
    instrument: 'Dholak, Casio & Brass',
    lyric: 'छलकता हमरो जवनिया ये राजा\nजैसे छलके गगरिया के पानी...',
    romanLyric: 'Chhalakata hamro jawaniya ye raja, jaise chhalke gagariya ke paani...',
    fullLyrics: [
      'छलकता हमरो जवनिया ये राजा',
      'जैसे छलके गगरिया के पानी...',
      'धीरे-धीरे चलिहें बलमुआ',
      'लागे ना नजरिया तोहार!'
    ],
    lyricEng: '"Joy spills over like sweet water from a golden pitcher on a sunny village morning..."',
    scene: 'Women filling water pots from the village well, singing and teasing each other happily.',
    notes: DEFAULT_POP_NOTES,
    bpm: 108,
    youtubeId: 'zlzR3AOhCmg'
  },
  {
    id: 'raja-raja-kareja',
    lang: 'bhojpuri',
    isPopular: true,
    emoji: '👑',
    title: 'राजा राजा करेजा में समा जा (Raja Raja Kareja)',
    artist: 'Pawan Singh / Radhe Shyam Rasiya',
    region: 'Bhojpuri Folk Dance Hit',
    instrument: 'Harmonium & Nagada',
    lyric: 'राजा राजा राजा करेजा में समा जा\nतोहरा बिना लागे ना मोरा मनवा...',
    romanLyric: 'Raja raja raja kareja mein sama ja, tohra bina laage na mora manwa...',
    fullLyrics: [
      'राजा राजा राजा करेजा में समा जा',
      'तोहरा बिना लागे ना मोरा मनवा...',
      'अंखियन में बसल तोहार सुरतिया',
      'राजा राजा राजा करेजा में समा जा!'
    ],
    lyricEng: '"Come home to my heart, my king; without you, my mind wanders with fond longing..."',
    scene: 'Old countryside harvest mela with colorful stalls and the smell of hot jalebis in the air.',
    notes: DEFAULT_POP_NOTES,
    bpm: 106,
    youtubeId: '5V9X_95kKkQ'
  },
  {
    id: 'lachke-kamariya',
    lang: 'bhojpuri',
    isPopular: true,
    emoji: '💃',
    title: 'लचके कमरिया तोहार (Lachke Kamariya Tohar)',
    artist: 'Bhojpuri Hit Folk',
    region: 'Bhojpuri Celebratory Song',
    instrument: 'Dholak & Claps',
    lyric: 'लचके कमरिया तोहार जैसे झूले डाली\nगाँव के लोग सब बजावे ला ताली...',
    romanLyric: 'Lachke kamariya tohar jaise jhoole daali, gaanv ke log sab bajaave la taali...',
    fullLyrics: [
      'लचके कमरिया तोहार जैसे झूले डाली',
      'गाँव के लोग सब बजावे ला ताली...',
      'झुमका झूलावे, पायलिया बाजे',
      'मनवा में खुशी के बाजा बाजे!'
    ],
    lyricEng: '"Swaying gracefully like a blooming flower bough while everyone claps along in joy..."',
    scene: 'Swaying mango groves in full spring bloom, with village girls swinging on tree swings.',
    notes: DEFAULT_POP_NOTES,
    bpm: 100,
    youtubeId: 'sK3M62i5i-I'
  },
  {
    id: 'lal-ghaghra',
    lang: 'bhojpuri',
    isPopular: true,
    emoji: '👗',
    title: 'लाल घाघरा (Lal Ghaghra)',
    artist: 'Pawan Singh & Shilpi Raj',
    region: 'Bhojpuri Chartbuster',
    instrument: 'Electronic Dhol & Horns',
    lyric: 'लाल घाघरा पहन के जब तू आवे लू\nसबके दिल में आग लगावे लू...',
    romanLyric: 'Lal ghaghra pahan ke jab tu aave lu, sabke dil mein aag lagaave lu...',
    fullLyrics: [
      'लाल घाघरा पहन के जब तू आवे लू',
      'सबके दिल में आग लगावे लू...',
      'रंग बिरंगी चुनरी ओढ़ के',
      'हँसी से सबका मन मोह ले लू!'
    ],
    lyricEng: '"Wearing the traditional red festive skirt and enchanting everyone with a bright smile..."',
    scene: 'Wedding sangeet night filled with laughter, sparkling marigold garlands, and upbeat music.',
    notes: DEFAULT_POP_NOTES,
    bpm: 115,
    youtubeId: 'qZId59qml_4'
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── KONKANI SONGS (6 Classic Hits) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'bebdo',
    lang: 'konkani',
    isPopular: true,
    emoji: '🎺',
    title: 'ब्येब्दो (Bebdo)',
    artist: 'Lorna Cordeiro & Chris Perry',
    region: 'Goan Jazz-Pop Classic (1969)',
    instrument: 'Trumpet, Saxophone & Drums',
    lyric: 'ब्येब्दो म्हूण माका सोंवसार जाणा\nपुण हांव ताका केन्ना विसरची ना!\nतो म्हजो कांतार, तो म्हजो सोंसार...',
    romanLyric: 'Bebdo mhun maka sonvsar zanna, pun hanv taka kenna visorchi na! To mhuzo kantar...',
    fullLyrics: [
      'ब्येब्दो म्हूण माका सोंवसार जाणा',
      'पुण हांव ताका केन्ना विसरची ना!',
      'तो म्हजो कांतार, तो म्हजो सोंसार',
      'पियानोचेर तो वाजयतालो मोगान',
      'आमी नाचताल्यां गोयंच्या तांग्यांत!'
    ],
    lyricEng: '"The world calls him a carefree soul, but I will never forget him — our music, our home..."',
    scene: 'A vintage Goan beach tavern in the 1960s with brass instruments and gentle sea breeze.',
    notes: DEFAULT_POP_NOTES,
    bpm: 110,
    youtubeId: 'q1w95jUCHDU'
  },
  {
    id: 'calangute',
    lang: 'konkani',
    isPopular: true,
    emoji: '🏖️',
    title: 'कलंगूट (Calangute)',
    artist: 'Lorna Cordeiro & Chris Perry',
    region: 'Goan Coastal Anthem',
    instrument: 'Acoustic Guitar, Trumpet & Shaker',
    lyric: 'कलंगूटच्या दर्यावेळेर, वाऱ्याचेर कांतार आयकता\nगोड गोड कांतार आयकून, मन म्हजें धादोशी जाता...',
    romanLyric: 'Calangute-chya doryaveller, varyacher kantar aikota, god god kantar aikun...',
    fullLyrics: [
      'कलंगूटच्या दर्यावेळेर, वाऱ्याचेर कांतार आयकता',
      'गोड गोड कांतार आयकून, मन म्हजें धादोशी जाता...',
      'सोबीत रेवेर खेळटात भुरगीं',
      'माडांचे सांवळेर विसाव घेतात गिरेस्त',
      'कलंगूट म्हज्या गोयांतलें रूप!'
    ],
    lyricEng: '"On Calangute beach, the sea breeze whispers sweet songs that bring deep peace to the soul..."',
    scene: 'Walking barefoot on Calangute shore under coconut palms with golden sunset reflections.',
    notes: DEFAULT_POP_NOTES,
    bpm: 98,
    youtubeId: 'WWE-ym6VXUw'
  },
  {
    id: 'tuzo-mog',
    lang: 'konkani',
    isPopular: true,
    emoji: '💌',
    title: 'तुजो मोग (Tuzo Mog)',
    artist: 'Lorna Cordeiro',
    region: 'Konkani Romantic Classic',
    instrument: 'Violin, Piano & Guitar',
    lyric: 'तुजो मोग म्हाका लागलो रे, काळजांत उजवाड पडलो रे\nतुज्या विणें दिस वचना, तुज्या विणें रात सोंपना...',
    romanLyric: 'Tuzo mog mhaka laglo re, kalzant uzvaad podlo re... tujya vinen dees vochna!',
    fullLyrics: [
      'तुजो मोग म्हाका लागलो रे, काळजांत उजवाड पडलो रे',
      'तुज्या विणें दिस वचना, तुज्या विणें रात सोंपना...',
      'सुर्याचो उजवाड जसो दर्याचेर',
      'तसोच तुजो मोग म्हज्या काळजार!',
      'तुजो मोग म्हाका लागलो रे!'
    ],
    lyricEng: '"Your sweet love has touched me; like sunlight upon the waves, it fills my whole heart..."',
    scene: 'Sitting on an old wooden balcão looking at the church bells ring across the quiet Goan village.',
    notes: DEFAULT_POP_NOTES,
    bpm: 82,
    youtubeId: 'jEd83IHvLbU'
  },
  {
    id: 'pisso',
    lang: 'konkani',
    isPopular: true,
    emoji: '🌀',
    title: 'पिसो (Pisso)',
    artist: 'Lorna Cordeiro',
    region: 'Konkani Golden Evergreen',
    instrument: 'Saxophone, Bass & Drums',
    lyric: 'पिसो जालो हांव तुज्या मोगांत, तुज्या रूपांत, तुज्या कांतारांत!\nकितें सांगूं हांव संवसाराक, तूं आसा म्हज्या दोळ्यांत...',
    romanLyric: 'Pisso zalo hanv tujya mogant, tujya roopant, tujya kantarant...',
    fullLyrics: [
      'पिसो जालो हांव तुज्या मोगांत',
      'तुज्या रूपांत, तुज्या कांतारांत!',
      'कितें सांगूं हांव संवसाराक',
      'तूं आसा म्हज्या दोळ्यांत...',
      'पिसो, पिसो, पिसो जालो रे!'
    ],
    lyricEng: '"I have grown pleasantly captivated by your song, your voice, and your warmth..."',
    scene: 'Dancing with friends to upbeat jazz melodies at a joyful Goan family gathering.',
    notes: DEFAULT_POP_NOTES,
    bpm: 114,
    youtubeId: 'Q6cYuTCnscA'
  },
  {
    id: 'sopon',
    lang: 'konkani',
    isPopular: true,
    emoji: '🌙',
    title: 'सोपण (Sopon)',
    artist: 'Lorna Cordeiro',
    region: 'Konkani Lullaby-Ballad',
    instrument: 'Nylon Guitar & Flute',
    lyric: 'सोपणांत आयलो तु म्हज्या, चांदण्या रातच्या विसावांत\nहातांत हात धरून आमी भोंवताले सुकण्यांच्या सांगातांत...',
    romanLyric: 'Soponant ailo tu mhujya, chandnya raatchya visavant... hatant haat dhorun!',
    fullLyrics: [
      'सोपणांत आयलो तु म्हज्या',
      'चांदण्या रातच्या विसावांत',
      'हातांत हात धरून आमी',
      'भोंवताले सुकण्यांच्या सांगातांत...',
      'सोपण म्हजें केन्ना सोंपना!'
    ],
    lyricEng: '"You came into my peaceful dreams on a calm moonlit night, walking hand in hand..."',
    scene: 'Peaceful twilight over the Mandovi river with soft stars reflected in the quiet waters.',
    notes: DEFAULT_POP_NOTES,
    bpm: 76,
    youtubeId: 'XkbkYf4EQOQ'
  },
  {
    id: 'ho-mando-goencho',
    lang: 'konkani',
    isPopular: true,
    emoji: '🎻',
    title: 'हो मांडो गोयेंचो (Ho Mando Goencho)',
    artist: 'Traditional Goan Mandó Ensemble',
    region: 'Goan Cultural Heritage Mandó',
    instrument: 'Ghumat, Violin & Harmonium',
    lyric: 'हो मांडो गोयेंचो, आमच्या पूर्वजांचो\nतांतूत भरला मोग आमच्या मातीचो...\nसगळ्यांनी गांवां-गांवांनी गावचो!',
    romanLyric: 'Ho Mando Goencho, amchya purvozancho, tantut bhorla mog amchya maaticho...',
    fullLyrics: [
      'हो मांडो गोयेंचो, आमच्या पूर्वजांचो',
      'तांतूत भरला मोग आमच्या मातीचो...',
      'सगळ्यांनी गांवां-गांवांनी गावचो!',
      'नाच आनी कांतार एकठांय करून',
      'गोयंची सोबाय वयर उबारचो!'
    ],
    lyricEng: '"This is the Mandó of Goa handed down by our elders, carrying the deep love for our home soil..."',
    scene: 'Traditional Goan wedding hall with elders in formal wear singing the stately, graceful Mandó.',
    notes: DEFAULT_POP_NOTES,
    bpm: 80,
    youtubeId: 'biLu0dF9mh0'
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── ASSAMESE SONGS (6 Beloved Hits) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'mayabini',
    lang: 'assamese',
    isPopular: true,
    emoji: '🌙',
    title: 'মায়াবিনী ৰাতিৰ বুকুত (Mayabini)',
    artist: 'Zubeen Garg',
    region: 'Assam Mega Hit (Daag)',
    instrument: 'Acoustic Guitar, Flute & Tabla',
    lyric: 'মায়াবিনী ৰাতিৰ বুকুত কোনে গান গায়\nজোনাকী পৰুৱাই কাণত কি কয়...\nঅজানিতে মনে মোৰ কি ভাবি উৰা মাৰে!',
    romanLyric: 'Mayabini raatir bukut kone gaan gaay, jonaki poruwaai kaanot ki koy...',
    fullLyrics: [
      'মায়াবিনী ৰাতিৰ বুকুত কোনে গান গায়',
      'জোনাকী পৰুৱাই কাণত কি কয়...',
      'অজানিতে মনে মোৰ কি ভাবি উৰা মাৰে!',
      'কুঁৱলীৰ চাদৰ গুচাই জোনটি ওলায়',
      'মৰমৰ নিজৰাটি বই গুচি যায়!'
    ],
    lyricEng: '"In the enchanting night, who sings so softly while fireflies whisper of sweet memories..."',
    scene: 'Brahmaputra riverbank under full moonlight with cool river air and gentle fireflies.',
    notes: DEFAULT_POP_NOTES,
    bpm: 84,
    youtubeId: 'AqUonMjxaog'
  },
  {
    id: 'anamika',
    lang: 'assamese',
    isPopular: true,
    emoji: '🌸',
    title: 'অনামিকা (Anamika)',
    artist: 'Zubeen Garg',
    region: 'Assam Youth Classic (1992)',
    instrument: 'Acoustic Guitar & Synth',
    lyric: 'অনামিকা, তোমাৰ দুচকুৰ নীলা সাগৰত\nমই যেন এটি সৰু নাও...\nবতাহে বতাহে মেলি দিছোঁ পাল!',
    romanLyric: 'Anamika, tomar duchokur neela saagorot, moi jen eti soru naao...',
    fullLyrics: [
      'অনামিকা, তোমাৰ দুচকুৰ নীলা সাগৰত',
      'মই যেন এটি সৰু নাও...',
      'বতাহে বতাহে মেলি দিছোঁ পাল!',
      'তোমাৰ হাঁহিতে ৰং সানি ললোঁ',
      'জীৱনৰ বাটত মই গান গাই গলোঁ!'
    ],
    lyricEng: '"Anamika, in the deep calm ocean of your eyes, I sail a small boat into the wind..."',
    scene: 'Lush green tea gardens of Dibrugarh in springtime with morning dewdrops shining.',
    notes: DEFAULT_POP_NOTES,
    bpm: 90,
    youtubeId: '0GZiooySQ4c'
  },
  {
    id: 'rumaal',
    lang: 'assamese',
    isPopular: true,
    emoji: '🧣',
    title: 'ৰুমাল (Rumaal)',
    artist: 'Zubeen Garg',
    region: 'Assam Pop Romance (NK Production)',
    instrument: 'Acoustic Guitar & Rhythm Section',
    lyric: 'এখনি ৰুমালতে নাম লিখি থলোঁ\nমৰমেৰে বুকুত আঁকি ললোঁ...\nসেই ৰুমালখনি হেৰাই নাযায় যেন কেতিয়াও!',
    romanLyric: 'Ekhoni rumaalote naam likhi tholo, moromere bukut aanki lolo...',
    fullLyrics: [
      'এখনি ৰুমালতে নাম লিখি থলোঁ',
      'মৰমেৰে বুকুত আঁকি ললোঁ...',
      'সেই ৰুমালখনি হেৰাই নাযায় যেন কেতিয়াও!',
      'বতাহজাকে আহি উৰুৱাই নিনিব',
      'মৰমৰ ফুলবোৰ মৰহি নাযাব!'
    ],
    lyricEng: '"Upon a small handkerchief your name was embroidered, keeping every tender memory safe..."',
    scene: 'A sunny verandah in Tezpur, opening an old wooden trunk filled with cherished mementos.',
    notes: DEFAULT_POP_NOTES,
    bpm: 94,
    youtubeId: 'aGl0HqoiqzI'
  },
  {
    id: 'jajabor',
    lang: 'assamese',
    isPopular: true,
    emoji: '🧭',
    title: 'যাযাবৰ হৈ ফুৰিছোঁ (Jajabor)',
    artist: 'Zubeen Garg',
    region: 'Assam Ballad (Mur Xuria Geet)',
    instrument: 'Harmonium & Flute',
    lyric: 'যাযাবৰ হৈ ফুৰিছোঁ আজি মই পৃথিৱীৰ চুকে-কোণে\nমোৰ বাটৰ শেষ ক\'ত কোনে জানে...\nবুকুৰ বিষবোৰ গান হৈ ওলায়!',
    romanLyric: 'Jajabor hoi furisu aaji moi prithivir suke-kone, mor bator shekh kot kone jaane...',
    fullLyrics: [
      'যাযাবৰ হৈ ফুৰিছোঁ আজি মই পৃথিৱীৰ চুকে-কোণে',
      'মোৰ বাটৰ শেষ ক\'ত কোনে জানে...',
      'বুকুৰ বিষবোৰ গান হৈ ওলায়!',
      'পাহাৰৰ ঢালত নদীৰ পাৰত',
      'বিচাৰি ফুৰোঁ মই চিনাকি মুখ!'
    ],
    lyricEng: '"Wandering through hills and riverbanks like a traveler, singing memories into the breeze..."',
    scene: 'Looking out at the vast Kaziranga grasslands from an elephant watchtower at sunset.',
    notes: DEFAULT_POP_NOTES,
    bpm: 80,
    youtubeId: '9BVeWRNBINg'
  },
  {
    id: 'bistirno-parore',
    lang: 'assamese',
    isPopular: true,
    emoji: '🌊',
    title: 'বিস্তীৰ্ণ পাৰৰে (Bistirno Parore)',
    artist: 'Dr. Bhupen Hazarika',
    region: 'Assam & National Landmark Anthem',
    instrument: 'Dhol, Pepa & Symphony',
    lyric: 'বিস্তীৰ্ণ পাৰৰে অসংখ্য জনৰে\nহাহাকাৰ শুনিও নীৰৱে কিয় ৰ\'লা?\nবুঢ়া লুইত, কিয় তেনেদৰে বৈ আছা...',
    romanLyric: 'Bistirno paarore oxongkhyo jonore hahakar shuniyo neerobe kiyo rola? Burha Luit...',
    fullLyrics: [
      'বিস্তীৰ্ণ পাৰৰে অসংখ্য জনৰে',
      'হাহাকাৰ শুনিও নীৰৱে কিয় ৰ\'লা?',
      'বুঢ়া লুইত, কিয় তেনেদৰে বৈ আছা...',
      'নৈতিকতাৰ স্খলন দেখিও',
      'মানবতাহীনতা দেখিও',
      'নিৰ্লজ্জ ভাৱে বোবা হৈ কিয় বৈ আছা?'
    ],
    lyricEng: '"O mighty Brahmaputra, hearing the cries of millions along your vast banks, why flow silent and steadfast? Awaken the strength in humanity!"',
    scene: 'The boundless red river of the Brahmaputra at sunrise, deep, mighty, and full of historical memories.',
    notes: DEFAULT_POP_NOTES,
    bpm: 72,
    youtubeId: 'R9V4o35C91I'
  },
  {
    id: 'luitor-parore',
    lang: 'assamese',
    isPopular: true,
    emoji: '🌾',
    title: 'লুইতৰ পাৰৰে আমি ডেকা ল\'ৰা (Luitor Parore)',
    artist: 'Jyoti Prasad Agarwala',
    region: 'Assam Patriotic Jyoti Sangeet',
    instrument: 'Bhor-taal & Dhol',
    lyric: 'লুইতৰ পাৰৰে আমি ডেকা ল\'ৰা, মৰিবলৈ ভয় নাই!\nদেশৰ কাৰণে জীৱন দানিম, আকাশো কপিব পাই...',
    romanLyric: 'Luitor paarore aami deka lora, moriboloi bhoy naai! Deshor kaarone...',
    fullLyrics: [
      'লুইতৰ পাৰৰে আমি ডেকা ল\'ৰা, মৰিবলৈ ভয় নাই!',
      'দেশৰ কাৰণে জীৱন দানিম, আকাশো কপিব পাই...',
      'ন-জোৱানৰ বুকুত শক্তিৰ ধল',
      'লুইতৰ দৰে উথলি উঠে',
      'লুইতৰ পাৰৰে আমি ডেকা ল\'ৰা!'
    ],
    lyricEng: '"We are the brave youth of the Brahmaputra banks, full of vigor and unwavering devotion to our homeland..."',
    scene: 'Majuli island village meeting where elders and youth sing together under the sacred banyan.',
    notes: DEFAULT_POP_NOTES,
    bpm: 104,
    youtubeId: 'aoRrapPWvKY'
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── MANIPURI / MEITEI SONGS (6 Famous Hits) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'ekai-nungshi',
    lang: 'manipuri',
    isPopular: true,
    emoji: '🌺',
    title: 'Ekai Nungshi Yanare (ইকাই নুংশি য়ানরে)',
    artist: 'Chanu IPS (AJ Maisnam & Sangeeta)',
    region: 'Manipuri Cinema Superhit',
    instrument: 'Pena, Flute & Modern Beats',
    lyric: 'Ekai nungshi yanare, nanggi maithong ubada\nThamoi ningthou konungda, nangbu lepnakhre...',
    romanLyric: 'Ekai nungshi yanare, nanggi maithong ubada, thamoi ningthou konungda...',
    fullLyrics: [
      'Ekai nungshi yanare, nanggi maithong ubada',
      'Thamoi ningthou konungda, nangbu lepnakhre...',
      'Nangtagi thawai oina leige',
      'Nangtagi mami oina chatke!',
      'Ekai nungshi yanare!'
    ],
    lyricEng: '"A gentle, loving shyness filled my heart the moment I saw your face..."',
    scene: 'Blooming lotus gardens of Imphal in the soft morning breeze with birds chirping.',
    notes: DEFAULT_POP_NOTES,
    bpm: 96,
    youtubeId: 'aDqjt6mY_pg'
  },
  {
    id: 'hairageko',
    lang: 'manipuri',
    isPopular: true,
    emoji: '💬',
    title: 'Hairageko (হাইরগেকো)',
    artist: 'Jitmar Sagolmang',
    region: 'Manipuri Pop Melodic Hit',
    instrument: 'Acoustic Guitar & Pena',
    lyric: 'Hairageko eigi thamoi paomei\nNanggi nungshibagi echel\nEigi puncshise pumnamak nangonda kathokle...',
    romanLyric: 'Hairageko eigi thamoi paomei, nanggi nungshibagi echel...',
    fullLyrics: [
      'Hairageko eigi thamoi paomei',
      'Nanggi nungshibagi echel...',
      'Eigi puncshise pumnamak nangonda kathokle',
      'Nangbu kaoba ngamde eigi thawaina!'
    ],
    lyricEng: '"Let me confess the feelings of my heart, where your affection flows like a clear mountain stream..."',
    scene: 'Evening prayers at Kangla Fort with the soft chiming of temple bells and peaceful reflection.',
    notes: DEFAULT_POP_NOTES,
    bpm: 88,
    youtubeId: 'j8btnrQbGGM'
  },
  {
    id: 'shei-huum',
    lang: 'manipuri',
    isPopular: true,
    emoji: '🎶',
    title: 'SHEI-HUUM (শৈ-হুম)',
    artist: 'Changkhonbi',
    region: 'Manipuri Traditional-Folk Fusion',
    instrument: 'Pena strings & Bamboo Percussion',
    lyric: 'Shei-huum lainingthougi sheirol, puncshi pumnamakki khonjel\nMeitei lamdamgi soiba leitaba minok...',
    romanLyric: 'Shei-huum lainingthougi sheirol, puncshi pumnamakki khonjel...',
    fullLyrics: [
      'Shei-huum lainingthougi sheirol',
      'Puncshi pumnamakki khonjel...',
      'Meitei lamdamgi soiba leitaba minok',
      'Pena khonjelna thamoibu penhalle!'
    ],
    lyricEng: '"The ancestral hymns of the Pena string instrument echoing across the hills, soothing every soul..."',
    scene: 'A village courtyard during Lai Haraoba festival with priests bowing gracefully to traditional pena music.',
    notes: DEFAULT_POP_NOTES,
    bpm: 82,
    youtubeId: 'Z7jDFC3pzKk'
  },
  {
    id: 'ningol-chakouba',
    lang: 'manipuri',
    isPopular: true,
    emoji: '🍱',
    title: 'Ningol Chakouba Song (নিংগোল চাকাওবা)',
    artist: 'Traditional Manipuri Family Anthem',
    region: 'Manipur Family Festival Song',
    instrument: 'Flute, Dholak & Pena',
    lyric: 'Ningol Chakouba lakle, eikhoi ema-epagi yumda\nIchil-inao pumnamak pulap phamminnaraga...',
    romanLyric: 'Ningol Chakouba lakle, eikhoi ema-epagi yumda, ichil-inao pumnamak...',
    fullLyrics: [
      'Ningol Chakouba lakle',
      'Eikhoi ema-epagi yumda...',
      'Ichil-inao pumnamak pulap phamminnaraga',
      'Chaklen charaga harao minnosi!'
    ],
    lyricEng: '"Ningol Chakouba has arrived! Daughters and sisters return to parental homes with blessings, sweets, and loving reunion..."',
    scene: 'Grandmother welcoming her daughters and grandchildren with warm fish curry and fresh rice.',
    notes: DEFAULT_POP_NOTES,
    bpm: 94,
    youtubeId: 'dyO9T7BoT8c'
  },
  {
    id: 'hiyang-taret',
    lang: 'manipuri',
    isPopular: true,
    emoji: '🛶',
    title: 'Hiyang Taret (হিয়াং তারেত)',
    artist: 'Traditional Boat Festival Song',
    region: 'Manipur River Boat Race Heritage',
    instrument: 'Cymbals, Drums & Shouts',
    lyric: 'Hiyang hiren taretna thouna laothokpaga\nTurelgi eerakto yomkhare eikhoigi kangleipakta...',
    romanLyric: 'Hiyang hiren taretna thouna laothokpaga, turelgi eerakto yomkhare...',
    fullLyrics: [
      'Hiyang hiren taretna thouna laothokpaga',
      'Turelgi eerakto yomkhare eikhoigi kangleipakta...',
      'Cheisang pumnamak amatta oina',
      'Heirannaga mai paklasi!'
    ],
    lyricEng: '"The seven royal canoes gliding down the river in unified harmony and celebration..."',
    scene: 'Cheering crowds lined along the Imphal river watching brightly painted wooden dragon boats.',
    notes: DEFAULT_POP_NOTES,
    bpm: 106,
    youtubeId: 'SKoa44BvLp8'
  },
  {
    id: 'puragae',
    lang: 'manipuri',
    isPopular: true,
    emoji: '🌟',
    title: 'Puragae Nangbu Panthung Tamna (পুরাগৈ নঙবু)',
    artist: 'Meitei Classic',
    region: 'Manipur Sentimental Ballad',
    instrument: 'Pena, Flute & Keyboard',
    lyric: 'Puragae nangbu panthung tamna, eigi puncshigi aroiba lambida\nNanggi khucham phajabi thadokloi...',
    romanLyric: 'Puragae nangbu panthung tamna, eigi puncshigi aroiba lambida...',
    fullLyrics: [
      'Puragae nangbu panthung tamna',
      'Eigi puncshigi aroiba lambida...',
      'Nanggi khucham phajabi thadokloi',
      'Nangbu leikolgi leirangum thambige!'
    ],
    lyricEng: '"I shall accompany you toward your cherished destination, holding your hand through every season..."',
    scene: 'Walking peacefully through pine hills of Ukhrul with wild orchids blooming beside the path.',
    notes: DEFAULT_POP_NOTES,
    bpm: 80,
    youtubeId: 'VeA8BFpZcUY'
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── KHASI SONGS (6 Popular Hits) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'kynmo',
    lang: 'khasi',
    isPopular: true,
    emoji: '🌧️',
    title: 'Kynmo (Remember)',
    artist: 'Jessie Lyngdoh',
    region: 'Khasi Hills Beloved Ballad',
    instrument: 'Acoustic Guitar & Piano',
    lyric: 'Kynmo ia ki sngi kiba la dep, haba u slap u ther shapoh\nNgi iashong lang harud dpei, iakren iakhana...',
    romanLyric: 'Kynmo ia ki sngi kiba la dep, haba u slap u ther shapoh...',
    fullLyrics: [
      'Kynmo ia ki sngi kiba la dep',
      'Haba u slap u ther shapoh...',
      'Ngi iashong lang harud dpei, iakren iakhana',
      'Kaba sngewtynnad ban pynkynmaw ia ki por kiba rim!'
    ],
    lyricEng: '"Remember the days gone by when the monsoon rain fell softly outside while we gathered warm around the hearth..."',
    scene: 'Rain tapping on the tin roof of a cozy cottage in Shillong while firewood crackles gently.',
    notes: DEFAULT_POP_NOTES,
    bpm: 78,
    youtubeId: 'OUyIyXjzQCU'
  },
  {
    id: 'uff-ka-jingieid',
    lang: 'khasi',
    isPopular: true,
    emoji: '💖',
    title: 'Uff Ka Jingieid',
    artist: 'Khasi Pop Hit',
    region: 'Meghalaya Melody',
    instrument: 'Electric Guitar & Drums',
    lyric: 'Uff ka jingieid ba shisha, ka pynim ia ka dohnud\nHaba nga iohi ia phi, ki jingeh ki jah noh...',
    romanLyric: 'Uff ka jingieid ba shisha, ka pynim ia ka dohnud, haba nga iohi ia phi...',
    fullLyrics: [
      'Uff ka jingieid ba shisha',
      'Ka pynim ia ka dohnud...',
      'Haba nga iohi ia phi, ki jingeh ki jah noh',
      'Phi long ka jingshai jong ka jingim jong nga!'
    ],
    lyricEng: '"Oh, true love revives the heart; when I see your bright smile, all worries vanish into peace..."',
    scene: 'Sunlight breaking through the clouds over Ward\'s Lake in Shillong, illuminating flowerbeds.',
    notes: DEFAULT_POP_NOTES,
    bpm: 96,
    youtubeId: '4xN2ZAMZqiE'
  },
  {
    id: 'jingieid',
    lang: 'khasi',
    isPopular: true,
    emoji: '🍃',
    title: 'Jingieid (Love)',
    artist: 'Khasi Traditional Acoustic',
    region: 'Khasi Folk Romance',
    instrument: 'Duitara & Acoustic Guitar',
    lyric: 'Jingieid jong phi ka long kum ka um ba shngiam\nKaba tuid na ki lum ba jyrngam sha ki them...',
    romanLyric: 'Jingieid jong phi ka long kum ka um ba shngiam, kaba tuid na ki lum...',
    fullLyrics: [
      'Jingieid jong phi ka long kum ka um ba shngiam',
      'Kaba tuid na ki lum ba jyrngam sha ki them...',
      'Ka pynkmen ia uwei pa uwei u briew',
      'Ban kynmaw ia ka jingbha jong ka pyrthei!'
    ],
    lyricEng: '"Your affection is like sweet water flowing down from green mountains into the quiet valleys..."',
    scene: 'Sitting near a clear crystal waterfall in Sohra with mossy rocks and ferns all around.',
    notes: DEFAULT_POP_NOTES,
    bpm: 82,
    youtubeId: 'CTRxrXX8SwU'
  },
  {
    id: 'overprotective',
    lang: 'khasi',
    isPopular: true,
    emoji: '🛡️',
    title: 'Overprotective',
    artist: 'Eddie Lyngdoh',
    region: 'Khasi Contemporary Pop',
    instrument: 'Acoustic Guitar & Vocals',
    lyric: 'Nga tip ba nga long ba overprotective, hynrei dei namar ba nga ieid\nNga kwah ban ri ia phi na ki jingeh baroh...',
    romanLyric: 'Nga tip ba nga long ba overprotective, hynrei dei namar ba nga ieid...',
    fullLyrics: [
      'Nga tip ba nga long ba overprotective',
      'Hynrei dei namar ba nga ieid...',
      'Nga kwah ban ri ia phi na ki jingeh baroh',
      'Wat sngewsih mo, phi long kaba kordor tam!'
    ],
    lyricEng: '"I care for you and protect you from harm because you are the most precious soul in my world..."',
    scene: 'Walking together down Laitlum canyons with the rolling clouds beneath your feet.',
    notes: DEFAULT_POP_NOTES,
    bpm: 90,
    youtubeId: 'yqFPC2LNtNc'
  },
  {
    id: 'myn-nyngkong',
    lang: 'khasi',
    isPopular: true,
    emoji: '🌄',
    title: 'Myn Nyngkong Ki Sngi',
    artist: 'Wanjop Sohkhlet',
    region: 'Khasi Nostalgia Ballad',
    instrument: 'Piano & Strings',
    lyric: 'Myn nyngkong ki sngi haba ngi dang rit, ngi iaieit bad ialehkai\nKi jingkynmaw ki sah ha ka mynsiem...',
    romanLyric: 'Myn nyngkong ki sngi haba ngi dang rit, ngi iaieit bad ialehkai...',
    fullLyrics: [
      'Myn nyngkong ki sngi haba ngi dang rit',
      'Ngi iaieit bad ialehkai...',
      'Ki jingkynmaw ki sah ha ka mynsiem',
      'Kumba shon shap ha ka dohnud!'
    ],
    lyricEng: '"In our earliest days when we played under the open sky, those fond memories remain engraved in our heart..."',
    scene: 'Grandparents sitting on the wooden porch looking at old family albums with smiles.',
    notes: DEFAULT_POP_NOTES,
    bpm: 76,
    youtubeId: 'FRqAzei0FD8'
  },
  {
    id: 'wai-luti',
    lang: 'khasi',
    isPopular: true,
    emoji: '🛣️',
    title: 'Wai Luti',
    artist: 'Lily Sawian',
    region: 'Khasi Folk Anthem',
    instrument: 'Duitara, Ksing & Flute',
    lyric: 'Wai luti ban leit phai sha shnong, sha ki kmie ki kpa\nKiba ap ia ngi da ka jingieid ba khraw...',
    romanLyric: 'Wai luti ban leit phai sha shnong, sha ki kmie ki kpa...',
    fullLyrics: [
      'Wai luti ban leit phai sha shnong',
      'Sha ki kmie ki kpa...',
      'Kiba ap ia ngi da ka jingieid ba khraw',
      'Ha ka shnong kaba sngewthuh ia ngi!'
    ],
    lyricEng: '"Clear the road as we return home to our village, where our elders wait with open arms and boundless love..."',
    scene: 'Returning on a winding hill road to your childhood home as the village bells welcome you.',
    notes: DEFAULT_POP_NOTES,
    bpm: 88,
    youtubeId: 'fjgqQGqgoHE'
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ─── ENGLISH SONGS (6 Global Hits + Dementia Therapy Classics) ───
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'shape-of-you',
    lang: 'english',
    isPopular: true,
    emoji: '🕺',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    region: 'Global Pop Phenomenon',
    instrument: 'Marimba, Acoustic Guitar & Percussion',
    lyric: 'The club isn\'t the best place to find a lover\nSo the bar is where I go\nMe and my friends at the table doing shots\nDrinking fast and then we talk slow...',
    romanLyric: 'The club isn\'t the best place to find a lover, so the bar is where I go...',
    fullLyrics: [
      'The club isn\'t the best place to find a lover',
      'So the bar is where I go...',
      'I\'m in love with the shape of you',
      'We push and pull like a magnet do',
      'Although my heart is falling too',
      'I\'m in love with your body!'
    ],
    lyricEng: '"Rhythmic, joyful celebration of connection, dance, and vibrant energy..."',
    scene: 'A lively get-together with friends tapping their feet and clapping along to the infectious rhythm.',
    notes: DEFAULT_POP_NOTES,
    bpm: 96,
    youtubeId: 'JGwWNGJdvx8'
  },
  {
    id: 'blinding-lights',
    lang: 'english',
    isPopular: true,
    emoji: '✨',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    region: '80s Synthwave Pop Superhit',
    instrument: '80s Synthesizer & Drum Machine',
    lyric: 'I said, ooh, I\'m blinded by the lights\nNo, I can\'t sleep until I feel your touch\nI said, ooh, I\'m drowning in the night...',
    romanLyric: 'I said, ooh, I\'m blinded by the lights, no, I can\'t sleep until I feel your touch...',
    fullLyrics: [
      'I said, ooh, I\'m blinded by the lights',
      'No, I can\'t sleep until I feel your touch...',
      'I said, ooh, I\'m drowning in the night',
      'Oh, when I\'m like this, you\'re the one I trust!'
    ],
    lyricEng: '"Uplifting, energetic synth melody that awakens memories of bright neon nights and youth..."',
    scene: 'Cruising down a brightly lit avenue in the evening with upbeat retro electronic music.',
    notes: DEFAULT_POP_NOTES,
    bpm: 171,
    youtubeId: '4NRXx6U8ABQ'
  },
  {
    id: 'perfect',
    lang: 'english',
    isPopular: true,
    emoji: '💍',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    region: 'Timeless Romantic Waltz',
    instrument: 'Acoustic Guitar, Strings & Choir',
    lyric: 'I found a love for me\nDarling, just dive right in and follow my lead\nWell, I found a girl, beautiful and sweet\nOh, I never knew you were the someone waiting for me...',
    romanLyric: 'I found a love for me, darling, just dive right in and follow my lead...',
    fullLyrics: [
      'I found a love for me',
      'Darling, just dive right in and follow my lead...',
      'Baby, I\'m dancing in the dark with you between my arms',
      'Barefoot on the grass, listening to our favourite song',
      'When you said you looked a mess, I whispered underneath my breath',
      'You heard it, darling, you look perfect tonight!'
    ],
    lyricEng: '"A tender waltz celebrating lifelong love, holding hands barefoot on the grass in the evening..."',
    scene: 'Swaying slowly in the living room with your beloved partner to a gentle, heartwarming waltz.',
    notes: DEFAULT_POP_NOTES,
    bpm: 63,
    youtubeId: '2Vv-BfVoq4g'
  },
  {
    id: 'someone-like-you',
    lang: 'english',
    isPopular: true,
    emoji: '🎹',
    title: 'Someone Like You',
    artist: 'Adele',
    region: 'Soulful Piano Ballad',
    instrument: 'Grand Piano & Vocals',
    lyric: 'Never mind, I\'ll find someone like you\nI wish nothing but the best for you too\n"Don\'t forget me," I begged\n"I\'ll remember you said..."',
    romanLyric: 'Never mind, I\'ll find someone like you, I wish nothing but the best for you too...',
    fullLyrics: [
      'Never mind, I\'ll find someone like you',
      'I wish nothing but the best for you too...',
      '"Don\'t forget me," I begged',
      '"I\'ll remember you said,',
      'Sometimes it lasts in love, but sometimes it hurts instead!"'
    ],
    lyricEng: '"Finding peace and wishing warmth and happiness to those who touched our journey in life..."',
    scene: 'Sitting near a grand piano in a quiet sunlit room, letting the emotional chords wash over you.',
    notes: DEFAULT_POP_NOTES,
    bpm: 68,
    youtubeId: 'hLQl3WQQoQ0'
  },
  {
    id: 'believer',
    lang: 'english',
    isPopular: true,
    emoji: '⚡',
    title: 'Believer',
    artist: 'Imagine Dragons',
    region: 'Empowering Stadium Rock',
    instrument: 'Heavy Drums, Electric Guitar & Synth',
    lyric: 'First things first, I\'ma say all the words inside my head\nI\'m fired up and tired of the way that things have been\nPain! You make me a, you make me a believer, believer!',
    romanLyric: 'First things first, I\'ma say all the words inside my head... Pain! You make me a believer!',
    fullLyrics: [
      'First things first, I\'ma say all the words inside my head',
      'I\'m fired up and tired of the way that things have been...',
      'Pain! You made me a, you made me a believer, believer!',
      'Pain! You break me down and build me up, believer, believer!'
    ],
    lyricEng: '"Triumph of resilience and inner strength, turning life\'s struggles into renewed courage and conviction..."',
    scene: 'Feeling a surge of inner strength and energy, clapping to the powerful drumbeat.',
    notes: DEFAULT_POP_NOTES,
    bpm: 125,
    youtubeId: '7wtfhZwyrcc'
  },
  {
    id: 'counting-stars',
    lang: 'english',
    isPopular: true,
    emoji: '🌠',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    region: 'Uplifting Folk Pop',
    instrument: 'Acoustic Guitar, Claps & Bass',
    lyric: 'Lately, I\'ve been, I\'ve been losing sleep\nDreaming about the things that we could be\nBut baby, I\'ve been, I\'ve been praying hard\nSaid no more counting dollars, we\'ll be counting stars!',
    romanLyric: 'Lately, I\'ve been losing sleep, dreaming about the things that we could be...',
    fullLyrics: [
      'Lately, I\'ve been, I\'ve been losing sleep',
      'Dreaming about the things that we could be...',
      'Baby, I\'ve been, I\'ve been praying hard',
      'Said no more counting dollars, we\'ll be counting stars!',
      'Take that money, watch it burn, sink in the river the lessons are learned!'
    ],
    lyricEng: '"Let go of worldly worries and find joy in the simple, eternal beauty of counting stars in the sky..."',
    scene: 'Lying under a vast canopy of twinkling stars with loved ones, carefree and full of hope.',
    notes: DEFAULT_POP_NOTES,
    bpm: 122,
    youtubeId: 'hT_nvWreIhg'
  },
  {
    id: 'you-are-my-sunshine',
    lang: 'english',
    isPopular: true,
    emoji: '☀️',
    title: 'You Are My Sunshine',
    artist: 'Traditional Sing-Along Classic',
    region: 'Gold-Standard Memory Therapy Sing-Along',
    instrument: 'Acoustic Guitar & Harmonica',
    lyric: 'You are my sunshine, my only sunshine\nYou make me happy when skies are grey\nYou\'ll never know, dear, how much I love you\nPlease don\'t take my sunshine away.',
    romanLyric: 'You are my sunshine, my only sunshine, you make me happy when skies are grey...',
    fullLyrics: [
      'You are my sunshine, my only sunshine',
      'You make me happy when skies are grey',
      'You\'ll never know, dear, how much I love you',
      'Please don\'t take my sunshine away.',
      'The other night, dear, as I lay sleeping',
      'I dreamed I held you in my arms',
      'When I awoke, dear, I was mistaken',
      'So I hung my head and cried.'
    ],
    lyricEng: '"You are my sunshine, bringing warmth, comfort and timeless love to every grey day..."',
    scene: 'Sitting on the porch on a bright sunny afternoon with a gentle breeze, humming along with a smile.',
    notes: [261.63, 293.66, 329.63, 349.23, 392, 0, 392, 349.23, 392, 349.23, 329.63, 0, 329.63, 349.23, 392, 440, 392, 349.23, 329.63, 293.66],
    bpm: 88,
    youtubeId: 'ckKeQNCBX38'
  },
  {
    id: 'amazing-grace',
    lang: 'english',
    emoji: '🕊️',
    title: 'Amazing Grace',
    region: 'Traditional Acoustic Hymn',
    instrument: 'Acoustic Guitar & Flute',
    lyric: 'Amazing grace, how sweet the sound\nThat saved a soul like me...\nI once was lost, but now am found,\nWas blind, but now I see.',
    lyricEng: '"Amazing grace, how sweet the sound, bringing peace and light to every wandering soul..."',
    scene: 'Warm sunlight filtering through tall stained glass windows, filled with calm and gratitude.',
    notes: [261.63, 349.23, 440, 349.23, 440, 392, 349.23, 0, 293.66, 261.63, 261.63, 349.23, 440, 349.23, 440, 523.25, 0, 440, 523.25, 440, 349.23, 261.63],
    bpm: 70,
    youtubeId: 'CDdvReNKKuk'
  },
  {
    id: 'nagamese',
    emoji: '🪘',
    title: 'Ura Ura Ke',
    region: 'Nagaland — Hornbill Festival',
    instrument: 'Log drum & bamboo flute',
    lyric: 'Ura ura ke\nmor ghorer ghora ke...',
    lyricEng: '"Fly, fly, like a bird — come back to my home..."',
    scene: 'Warriors in hornbill headdresses beat enormous log drums around the bonfire at Kisama, Kohima.',
    notes: [392, 440, 0, 392, 329.63, 293.66, 329.63, 0, 392, 440, 493.88, 0, 440, 392, 329.63, 392, 0, 440, 392],
    bpm: 110
  },
  // ─── Special Global Hit: Angry Birds Theme Songs ───
  {
    id: 'angry-birds-main',
    isPopular: true,
    emoji: '🐦',
    title: 'Angry Birds Theme Song (Official)',
    artist: 'Ari Pulkkinen',
    region: 'Global Video Game Classic (Rovio)',
    instrument: 'Marimba, Bassoon, Brass & Whistle',
    lyric: '🎵 (Wheee-whoo whee-whoo-whoo!)\nWah-ha-ha! Hee-hee-hee!\nUp into the sky the brave birds fly!\nBouncing through the towers, high and bright,\nSinging cheerful melodies all through the day!',
    lyricEng: '"The iconic, cheerful whistling theme song by Ari Pulkkinen celebrating playful adventure and smiles."',
    scene: 'Playful colourful birds taking flight across sunny green hills with bouncy marimba and joyful whistling.',
    notes: [329.63, 329.63, 329.63, 329.63, 349.23, 329.63, 293.66, 261.63, 293.66, 329.63, 0, 329.63, 329.63, 329.63, 349.23, 392, 349.23, 329.63, 293.66, 261.63],
    bpm: 125,
    youtubeId: 'r6vX3lrwq-4',
    fullLyrics: [
      '🎵 (Iconic Whistle Intro: Wheee-whoo whee-whoo-whoo!)',
      'Wah-ha-ha! Hee-hee-hee!',
      'Up into the sky the brave birds take flight,',
      'Bouncing through the timber towers and stone!',
      'Feathered heroes whistling in the sunny breeze,',
      'Bringing smiles to everyone near and far!',
      '🎵 (Triumphant brass fanfare and playful marimba finale)'
    ]
  },
  {
    id: 'angry-birds-orchestral',
    isPopular: true,
    emoji: '🦅',
    title: 'Angry Birds Theme (London Philharmonic Orchestra)',
    artist: 'Ari Pulkkinen / London Philharmonic Orchestra',
    region: 'Symphonic Live Concert',
    instrument: 'Full Symphony Orchestra & Timpani',
    lyric: '🎵 (Grand orchestral brass & soaring strings)\nA magnificent symphonic rendition of the beloved theme,\nFilled with sweeping violins, booming timpani, and soaring horns.',
    lyricEng: '"A magnificent live symphonic concert performance by the London Philharmonic Orchestra."',
    scene: 'A grand concert hall with sweeping violins, horns, and timpani performing the triumphant classic.',
    notes: [261.63, 329.63, 392, 523.25, 493.88, 440, 392, 0, 349.23, 392, 440, 392, 349.23, 329.63],
    bpm: 118,
    youtubeId: 'Qbrgo3vPBdQ',
    fullLyrics: [
      '🎵 (Live Concert: London Philharmonic Orchestra)',
      'Dramatic string tremolos rise and soar,',
      'Brass fanfare bursts into the playful theme!',
      'A grand, majestic celebration of sound,',
      'Filling the concert hall with joy and laughter.'
    ]
  },
  {
    id: 'angry-birds-remastered',
    isPopular: true,
    emoji: '🚀',
    title: 'Angry Birds Theme (2015 Remastered Edition)',
    artist: 'Ari Pulkkinen',
    region: 'Modern High-Definition Studio Remaster',
    instrument: 'Acoustic Whistle, Piano & Brass',
    lyric: '🎵 Whistling high in the morning breeze,\nTap your toes to the cheerful rhythm,\nA happy melody that brings a bright smile!',
    lyricEng: '"Crisp, high-energy remastered studio version with sparkling acoustic melodies."',
    scene: 'Soaring through clouds with the cheerful whistling melody lifting spirits.',
    notes: [392, 392, 392, 440, 392, 349.23, 329.63, 349.23, 392, 0, 440, 493.88, 523.25, 493.88, 440, 392],
    bpm: 124,
    youtubeId: '8rndFHvwwrY',
    fullLyrics: [
      '🎵 (Bright crystal-clear acoustic whistle)',
      'Tap your feet, hum along with the tune,',
      'Sunny skies and breezy afternoons,',
      'Joyful music to brighten up any day!'
    ]
  }
]
