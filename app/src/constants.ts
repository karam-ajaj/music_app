import versionData from './version.json';

export const APP_NAME = 'اسمع';

export const APP_VERSION = versionData.version;

export type DecadeKey = '70s' | '80s' | '90s';
export type RegionKey = 'egypt' | 'levant' | 'gulf' | 'iraq' | 'maghreb';

export const ALL_DECADES: DecadeKey[] = ['70s', '80s', '90s'];
export const ALL_REGIONS: RegionKey[] = ['egypt', 'levant', 'gulf', 'iraq', 'maghreb'];

export const DECADE_LABELS: { key: DecadeKey; labelEn: string; labelAr: string }[] = [
  { key: '70s', labelEn: '70s', labelAr: 'السبعينات' },
  { key: '80s', labelEn: '80s', labelAr: 'الثمانينات' },
  { key: '90s', labelEn: '90s', labelAr: 'التسعينات' },
];

export interface RegionData {
  key: RegionKey;
  labelEn: string;
  labelAr: string;
  artists: { en: string; ar: string }[];
}

export const REGIONS: RegionData[] = [
  {
    key: 'egypt',
    labelEn: 'Egypt',
    labelAr: 'مصر',
    artists: [
      { en: 'Amr Diab', ar: 'عمرو دياب' },
      { en: 'Umm Kulthum', ar: 'أم كلثوم' },
      { en: 'Abdel Halim Hafez', ar: 'عبد الحليم حافظ' },
      { en: 'Mohamed Abdel Wahab', ar: 'محمد عبد الوهاب' },
      { en: 'Farid Al Atrash', ar: 'فريد الأطرش' },
      { en: 'Shadia', ar: 'شادية' },
      { en: 'Nagat Al Saghira', ar: 'نجاة الصغيرة' },
      { en: 'Leila Mourad', ar: 'ليلى مراد' },
      { en: 'Mohamed Mounir', ar: 'محمد منير' },
      { en: 'Mohamed Fouad', ar: 'محمد فؤاد' },
      { en: 'Hani Shaker', ar: 'هاني شاكر' },
      { en: 'Warda', ar: 'وردة' },
      { en: 'Sherine', ar: 'شيرين' },
      { en: 'Tamer Hosny', ar: 'تامر حسني' },
      { en: 'Mohamed Hamaki', ar: 'محمد حماقي' },
      { en: 'Angham', ar: 'أنغام' },
      { en: 'Ehab Tawfik', ar: 'إيهاب توفيق' },
      { en: 'Hamid El Shaeri', ar: 'حميد الشاعري' },
      { en: 'Mostafa Amar', ar: 'مصطفى قمر' },
      { en: 'Hisham Abbas', ar: 'هشام عباس' },
      { en: 'Latifa', ar: 'لطيفة' },
      { en: 'Ali El Haggar', ar: 'علي الحجار' },
      { en: 'Medhat Saleh', ar: 'مدحت صالح' },
      { en: 'Hakim', ar: 'حكيم' },
      { en: 'Ahmed Adaweya', ar: 'أحمد عدوية' },
      { en: 'Bahaa Sultan', ar: 'بهاء سلطان' },
      { en: 'Hamada Helal', ar: 'حمادة هلال' },
      { en: 'Tamer Ashour', ar: 'تامر عاشور' },
      { en: 'Ramy Sabry', ar: 'رامي صبري' },
      { en: 'Samo Zein', ar: 'سامو زين' },
    ],
  },
  {
    key: 'levant',
    labelEn: 'Levant',
    labelAr: 'بلاد الشام',
    artists: [
      { en: 'Fairuz', ar: 'فيروز' },
      { en: 'Nancy Ajram', ar: 'نانسي عجرم' },
      { en: 'Ragheb Alama', ar: 'راغب علامة' },
      { en: 'Wael Kfoury', ar: 'وائل كفوري' },
      { en: 'Elissa', ar: 'إليسا' },
      { en: 'Majida El Roumi', ar: 'ماجدة الرومي' },
      { en: 'Sabah', ar: 'صباح' },
      { en: 'Haifa Wehbe', ar: 'هيفاء وهبي' },
      { en: 'Najwa Karam', ar: 'نجوى كرم' },
      { en: 'Carole Samaha', ar: 'كارول سماحة' },
      { en: 'Nawal El Zoghbi', ar: 'نوال الزغبي' },
      { en: 'Melhem Barakat', ar: 'ملحم بركات' },
      { en: 'Wadih El Safi', ar: 'وديع الصافي' },
      { en: 'Ziad Rahbani', ar: 'زياد الرحباني' },
      { en: 'Joseph Attieh', ar: 'جوزيف عطية' },
      { en: 'George Wassouf', ar: 'جورج وسوف' },
      { en: 'Assala Nasri', ar: 'أصالة نصري' },
      { en: 'Mayada El Hennawy', ar: 'ميادة الحناوي' },
      { en: 'Sabah Fakhri', ar: 'صباح فخري' },
      { en: 'Diana Karazon', ar: 'ديانا كرزون' },
      { en: 'Omar Al Abdallat', ar: 'عمر العبداللات' },
      { en: 'Toni Qattan', ar: 'طوني قطان' },
      { en: 'Ramy Ayach', ar: 'رامي عياش' },
      { en: 'Myriam Fares', ar: 'ميريام فارس' },
      { en: 'Fares Karam', ar: 'فارس كرم' },
      { en: 'Amal Hijazi', ar: 'أمل حجازي' },
      { en: 'Pascale Machaalani', ar: 'باسكال مشعلاني' },
      { en: 'Wael Jassar', ar: 'وائل جسار' },
      { en: 'Melhem Zein', ar: 'ملحم زين' },
      { en: 'Julia Boutros', ar: 'جوليا بطرس' },
      { en: 'Nassif Zeytoun', ar: 'ناصيف زيتون' },
      { en: 'Lena Chamamyan', ar: 'لينا شاماميان' },
      { en: 'Marcel Khalife', ar: 'مارسيل خليفة' },
    ],
  },
  {
    key: 'gulf',
    labelEn: 'Gulf',
    labelAr: 'الخليج',
    artists: [
      { en: 'Abdul Majeed Abdullah', ar: 'عبد المجيد عبد الله' },
      { en: 'Rashed Al Majed', ar: 'راشد الماجد' },
      { en: 'Mohammed Abdu', ar: 'محمد عبده' },
      { en: 'Talal Maddah', ar: 'طلال مداح' },
      { en: 'Abadi Al Johar', ar: 'عبادي الجوهر' },
      { en: 'Nabil Shuail', ar: 'نبيل شعيل' },
      { en: 'Abdallah Al Rowaished', ar: 'عبد الله الرويشد' },
      { en: 'Nawal Al Kuwaitia', ar: 'نوال الكويتية' },
      { en: 'Ahlam', ar: 'أحلام' },
      { en: 'Hussain Al Jasmi', ar: 'حسين الجسمي' },
    ],
  },
  {
    key: 'iraq',
    labelEn: 'Iraq',
    labelAr: 'العراق',
    artists: [
      { en: 'Kazem Al Saher', ar: 'كاظم الساهر' },
      { en: 'Ilham Al Madfai', ar: 'إلهام المدفعي' },
      { en: 'Saadoun Jaber', ar: 'سعدون جابر' },
      { en: 'Hatem Al Iraqi', ar: 'حاتم العراقي' },
      { en: 'Rida Al Abdullah', ar: 'رضا العبد الله' },
      { en: 'Majid Al Mohandis', ar: 'ماجد المهندس' },
    ],
  },
  {
    key: 'maghreb',
    labelEn: 'Maghreb',
    labelAr: 'المغرب العربي',
    artists: [
      { en: 'Cheb Khaled', ar: 'الشاب خالد' },
      { en: 'Samira Said', ar: 'سميرة سعيد' },
      { en: 'Cheb Mami', ar: 'الشاب مامي' },
      { en: 'Faudel', ar: 'فوديل' },
      { en: 'Rachid Taha', ar: 'رشيد طه' },
      { en: 'Cheba Zahouania', ar: 'الشابة الزهوانية' },
      { en: 'Cheb Hasni', ar: 'الشاب حسني' },
      { en: 'Cheb Bilal', ar: 'الشاب بلال' },
      { en: 'Saad Lamjarred', ar: 'سعد لمجرد' },
      { en: 'Douzi', ar: 'دوزي' },
      { en: 'Saber Rebai', ar: 'صابر الرباعي' },
    ],
  },
];

export const ALL_ARTISTS = REGIONS.flatMap((r) => r.artists);
