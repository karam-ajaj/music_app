export type Language = 'en' | 'ar';

const translations: Record<Language, Record<string, string>> = {
  en: {
    pickDecade: 'Era:',
    pickRegion: 'Region:',
    allRegions: 'All',
    startGame: 'Start Game',
    poweredBy: 'Powered by iTunes',
    loadingSongs: 'Loading songs...',
    noSongs: 'No songs available.',
    retry: 'Retry',
    whatSong: 'What song is this?',
    revealAnswer: 'Reveal Answer',
    nextSong: 'Next Song',
    playingPreview: 'Playing preview...',
    paused: 'Paused',
    loadingPreview: 'Loading preview...',
    restart: 'Start Game',
    langLabel: 'العربية',
  },
  ar: {
    pickDecade: 'الحقبة:',
    pickRegion: 'المنطقة:',
    allRegions: 'الكل',
    startGame: 'ابدأ اللعبة',
    poweredBy: 'مشغل بواسطة iTunes',
    loadingSongs: 'جار تحميل الأغاني...',
    noSongs: 'لا توجد أغاني متاحة.',
    retry: 'إعادة المحاولة',
    whatSong: 'ما هي هذه الأغنية؟',
    revealAnswer: 'اكشف الإجابة',
    nextSong: 'الأغنية التالية',
    playingPreview: 'جار التشغيل...',
    paused: 'متوقف',
    loadingPreview: 'جار تحميل المقطع...',
    restart: 'ابدأ اللعبة',
    langLabel: 'English',
  },
};

export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}
