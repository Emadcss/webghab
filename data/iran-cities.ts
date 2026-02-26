
export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  province_id: number;
  name: string;
}

export const PROVINCES: Province[] = [
  { id: 1, name: "تهران" },
  { id: 2, name: "اصفهان" },
  { id: 3, name: "فارس" },
  { id: 4, name: "خراسان رضوی" },
  { id: 5, name: "آذربایجان شرقی" },
  { id: 6, name: "البرز" },
  { id: 7, name: "مازندران" },
  { id: 8, name: "گیلان" },
  { id: 9, name: "خوزستان" },
  { id: 10, name: "کرمان" }
];

export const CITIES: City[] = [
  // Tehran
  { id: 1, province_id: 1, name: "تهران" },
  { id: 2, province_id: 1, name: "اسلامشهر" },
  { id: 3, province_id: 1, name: "شهریار" },
  { id: 4, province_id: 1, name: "قدس" },
  // Isfahan
  { id: 5, province_id: 2, name: "اصفهان" },
  { id: 6, province_id: 2, name: "کاشان" },
  { id: 7, province_id: 2, name: "خمینی‌شهر" },
  { id: 8, province_id: 2, name: "نجف‌آباد" },
  // Fars
  { id: 9, province_id: 3, name: "شیراز" },
  { id: 10, province_id: 3, name: "مرودشت" },
  { id: 11, province_id: 3, name: "جهرم" },
  { id: 12, province_id: 3, name: "فسا" },
  // Khorasan
  { id: 13, province_id: 4, name: "مشهد" },
  { id: 14, province_id: 4, name: "نیشابور" },
  { id: 15, province_id: 4, name: "سبزوار" },
  // Tabriz
  { id: 16, province_id: 5, name: "تبریز" },
  { id: 17, province_id: 5, name: "مراغه" },
  { id: 18, province_id: 5, name: "مرند" },
  // Alborz
  { id: 19, province_id: 6, name: "کرج" },
  { id: 20, province_id: 6, name: "فردیس" },
  { id: 21, province_id: 6, name: "هشتگرد" },
  // Mazandaran
  { id: 22, province_id: 7, name: "ساری" },
  { id: 23, province_id: 7, name: "بابل" },
  { id: 24, province_id: 7, name: "آمل" },
  // Gilan
  { id: 25, province_id: 8, name: "رشت" },
  { id: 26, province_id: 8, name: "بندرانزلی" },
  { id: 27, province_id: 8, name: "لاهیجان" },
  // Khuzestan
  { id: 28, province_id: 9, name: "اهواز" },
  { id: 29, province_id: 9, name: "دزفول" },
  { id: 30, province_id: 9, name: "آبادان" },
  // Kerman
  { id: 31, province_id: 10, name: "کرمان" },
  { id: 32, province_id: 10, name: "سیرجان" },
  { id: 33, province_id: 10, name: "رفسنجان" }
];
