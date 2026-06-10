export const APP_NAME = 'Nagham';

export type Decade = '70s' | '80s' | '90s' | 'all';
export type Region = 'egypt' | 'levant' | 'gulf' | 'iraq' | 'maghreb' | 'all';

export interface RegionData {
  key: Region;
  labelEn: string;
  labelAr: string;
  artists: string[];
}

export const REGIONS: RegionData[] = [
  {
    key: 'egypt',
    labelEn: 'Egypt',
    labelAr: 'مصر',
    artists: [
      'Amr Diab', 'Umm Kulthum', 'Abdel Halim Hafez', 'Mohamed Mounir',
      'Mohamed Fouad', 'Hani Shaker', 'Warda',
      'Sherine', 'Tamer Hosny', 'Mohamed Hamaki', 'Angham',
      'Ehab Tawfik', 'Hamid El Shaeri', 'Mostafa Amar', 'Hisham Abbas',
      'Latifa', 'Ali El Haggar', 'Medhat Saleh', 'Mohamed Mohie', 'Hakim',
    ],
  },
  {
    key: 'levant',
    labelEn: 'Levant',
    labelAr: 'بلاد الشام',
    artists: [
      'Fairuz', 'Nancy Ajram', 'Ragheb Alama', 'Wael Kfoury', 'Elissa',
      'Majida El Roumi', 'Sabah', 'Haifa Wehbe', 'Najwa Karam',
      'Carole Samaha', 'Nawal El Zoghbi', 'Melhem Barakat',
      'Wadih El Safi', 'Ziad Rahbani', 'Joseph Attieh',
      'George Wassouf', 'Assala Nasri', 'Mayada El Hennawy', 'Sabah Fakhri',
      'Diana Karazon', 'Omar Al Abdallat', 'Toni Qattan',
    ],
  },
  {
    key: 'gulf',
    labelEn: 'Gulf',
    labelAr: 'الخليج',
    artists: [
      'Abdul Majeed Abdullah', 'Rashed Al Majed', 'Mohammed Abdu',
      'Talal Maddah', 'Abadi Al Johar', 'Nabil Shuail',
      'Abdallah Al Rowaished', 'Nawal Al Kuwaitia',
    ],
  },
  {
    key: 'iraq',
    labelEn: 'Iraq',
    labelAr: 'العراق',
    artists: [
      'Kazem Al Saher', 'Ilham Al Madfai', 'Saadoun Jaber',
    ],
  },
  {
    key: 'maghreb',
    labelEn: 'Maghreb',
    labelAr: 'المغرب العربي',
    artists: [
      'Cheb Khaled', 'Samira Said', 'Cheb Mami', 'Faudel',
      'Rachid Taha', 'Cheba Zahouania',
    ],
  },
];

export const ALL_ARTISTS = REGIONS.flatMap((r) => r.artists);
