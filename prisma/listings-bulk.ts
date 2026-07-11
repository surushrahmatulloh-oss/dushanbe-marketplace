/** Намунаҳои эълон барои seed — монанди somon.tj */

export const LOCATIONS = [
  "Душанбе",
  "Хуҷанд",
  "Кулоб",
  "Бохтар",
  "Истаравшан",
  "Вахдат",
  "Тursunzoda",
  "Дангара",
  "Панҷакент",
  "Норак",
];

export const CAR_LISTINGS = [
  { brand: "Toyota", model: "Camry", years: [2015, 2016, 2017, 2018, 2019, 2020], priceRange: [85000, 180000] },
  { brand: "Toyota", model: "Corolla", years: [2014, 2016, 2018, 2019, 2021], priceRange: [65000, 120000] },
  { brand: "Toyota", model: "Land Cruiser 200", years: [2012, 2015, 2018, 2020], priceRange: [280000, 450000] },
  { brand: "Toyota", model: "RAV4", years: [2017, 2019, 2021, 2022], priceRange: [120000, 210000] },
  { brand: "Honda", model: "Accord", years: [2016, 2018, 2019], priceRange: [90000, 150000] },
  { brand: "Honda", model: "CR-V", years: [2017, 2019, 2020, 2021], priceRange: [130000, 220000] },
  { brand: "Honda", model: "Fit", years: [2015, 2017, 2019], priceRange: [45000, 75000] },
  { brand: "Mercedes-Benz", model: "E200", years: [2015, 2017, 2018, 2019], priceRange: [180000, 320000] },
  { brand: "Mercedes-Benz", model: "C200", years: [2016, 2018, 2020], priceRange: [150000, 280000] },
  { brand: "Mercedes-Benz", model: "GLC 300", years: [2018, 2019, 2021], priceRange: [250000, 380000] },
  { brand: "BMW", model: "520d", years: [2015, 2017, 2019], priceRange: [160000, 290000] },
  { brand: "BMW", model: "X5", years: [2016, 2018, 2020], priceRange: [220000, 400000] },
  { brand: "BMW", model: "318i", years: [2014, 2016, 2018], priceRange: [90000, 160000] },
  { brand: "Hyundai", model: "Sonata", years: [2016, 2018, 2019, 2020], priceRange: [70000, 130000] },
  { brand: "Hyundai", model: "Tucson", years: [2017, 2019, 2021], priceRange: [95000, 170000] },
  { brand: "Hyundai", model: "Elantra", years: [2015, 2017, 2019], priceRange: [55000, 95000] },
  { brand: "Kia", model: "K5", years: [2018, 2020, 2021], priceRange: [75000, 140000] },
  { brand: "Kia", model: "Sportage", years: [2016, 2018, 2020], priceRange: [85000, 155000] },
  { brand: "Chevrolet", model: "Cobalt", years: [2018, 2019, 2020, 2021], priceRange: [55000, 95000] },
  { brand: "Chevrolet", model: "Malibu", years: [2016, 2018, 2019], priceRange: [70000, 120000] },
  { brand: "Chevrolet", model: "Tracker", years: [2020, 2021, 2022], priceRange: [90000, 140000] },
  { brand: "Lada", model: "Vesta", years: [2018, 2019, 2020, 2021], priceRange: [55000, 90000] },
  { brand: "Lada", model: "Granta", years: [2017, 2019, 2020], priceRange: [35000, 65000] },
  { brand: "Lada", model: "Niva", years: [2016, 2018, 2020], priceRange: [45000, 80000] },
  { brand: "Nissan", model: "Teana", years: [2014, 2016, 2018], priceRange: [70000, 120000] },
  { brand: "Nissan", model: "X-Trail", years: [2016, 2018, 2020], priceRange: [100000, 180000] },
  { brand: "Mazda", model: "6", years: [2015, 2017, 2019], priceRange: [80000, 140000] },
  { brand: "Mazda", model: "CX-5", years: [2017, 2019, 2021], priceRange: [110000, 190000] },
  { brand: "Volkswagen", model: "Polo", years: [2016, 2018, 2019], priceRange: [60000, 100000] },
  { brand: "Volkswagen", model: "Tiguan", years: [2017, 2019, 2020], priceRange: [120000, 200000] },
];

export const PHONE_LISTINGS = [
  { title: "iPhone 11 64GB", price: 3200, condition: "USED" as const },
  { title: "iPhone 12 128GB", price: 4500, condition: "USED" as const },
  { title: "iPhone 13 128GB", price: 5800, condition: "USED" as const },
  { title: "iPhone 13 Pro 256GB", price: 7800, condition: "USED" as const },
  { title: "iPhone 14 128GB", price: 7200, condition: "USED" as const },
  { title: "iPhone 14 Pro Max 256GB", price: 11500, condition: "NEW" as const },
  { title: "iPhone 15 128GB — Нав", price: 9800, condition: "NEW" as const },
  { title: "iPhone 15 Pro 256GB", price: 12500, condition: "NEW" as const },
  { title: "Samsung Galaxy A54 5G", price: 2800, condition: "NEW" as const },
  { title: "Samsung Galaxy A34", price: 1900, condition: "NEW" as const },
  { title: "Samsung Galaxy S23 256GB", price: 6500, condition: "USED" as const },
  { title: "Samsung Galaxy S24 Ultra 512GB", price: 10200, condition: "NEW" as const },
  { title: "Samsung Galaxy S24+ 256GB", price: 8500, condition: "NEW" as const },
  { title: "Xiaomi Redmi Note 13 Pro", price: 1800, condition: "NEW" as const },
  { title: "Xiaomi 14 Ultra", price: 9200, condition: "NEW" as const },
  { title: "Xiaomi Poco X6 Pro", price: 2400, condition: "NEW" as const },
  { title: "Huawei P60 Pro", price: 6800, condition: "NEW" as const },
  { title: "Huawei Nova 12", price: 3200, condition: "NEW" as const },
  { title: "Realme 12 Pro+", price: 2600, condition: "NEW" as const },
  { title: "OnePlus 12 256GB", price: 7500, condition: "NEW" as const },
  { title: "Google Pixel 8 Pro", price: 6800, condition: "USED" as const },
  { title: "MacBook Air M1 256GB", price: 6500, condition: "USED" as const },
  { title: "MacBook Pro M2 512GB", price: 11500, condition: "USED" as const },
  { title: "MacBook Air M2 2024", price: 9800, condition: "USED" as const },
  { title: "iPad Air 5 64GB Wi-Fi", price: 4200, condition: "USED" as const },
  { title: "iPad Pro 12.9 M2", price: 8500, condition: "NEW" as const },
  { title: "AirPods Pro 2 — нав", price: 1200, condition: "NEW" as const },
  { title: "Apple Watch Series 9", price: 2800, condition: "NEW" as const },
  { title: "Sony PlayStation 5", price: 4500, condition: "NEW" as const },
  { title: "Sony PlayStation 5 Slim", price: 4800, condition: "NEW" as const },
];

export const REAL_ESTATE_LISTINGS = [
  { title: "Квартира 1-хонагӣ — марказ", rooms: 1, area: 42, price: 380000 },
  { title: "Квартира 2-хонагӣ — Сомонӣ", rooms: 2, area: 58, price: 520000 },
  { title: "Квартира 2-хонагӣ — 92-микрорайон", rooms: 2, area: 55, price: 480000 },
  { title: "Квартира 3-хонагӣ — марказ", rooms: 3, area: 85, price: 850000 },
  { title: "Квартира 3-хонагӣ — Шохмансур", rooms: 3, area: 78, price: 720000 },
  { title: "Квартира 4-хонагӣ — панорама", rooms: 4, area: 120, price: 1200000 },
  { title: "Квартира 1-хонагӣ — 82-микрорайон", rooms: 1, area: 38, price: 320000 },
  { title: "Квартира 2-хонагӣ — Фирдавсӣ", rooms: 2, area: 62, price: 550000 },
  { title: "Хонаи хусусӣ 5 хона — Сино", rooms: 5, area: 180, price: 950000 },
  { title: "Хонаи хусусӣ 4 хона — Зарафшон", rooms: 4, area: 150, price: 780000 },
  { title: "Хонаи хусусӣ 3 хона — Вахдат", rooms: 3, area: 110, price: 420000 },
  { title: "Квартира 2-хонагӣ — Хуҷанд", rooms: 2, area: 52, price: 280000 },
  { title: "Квартира 3-хонагӣ — Хуҷанд, марказ", rooms: 3, area: 75, price: 380000 },
  { title: "Хонаи хусусӣ — Кулоб", rooms: 4, area: 130, price: 350000 },
  { title: "Квартира 1-хонагӣ — Бохтар", rooms: 1, area: 40, price: 180000 },
  { title: "Квартира 2-хонагӣ — Истаравшан", rooms: 2, area: 50, price: 220000 },
  { title: "Иҷора — квартира 2-хонагӣ, марказ", rooms: 2, area: 55, price: 3500 },
  { title: "Иҷора — квартира 1-хонагӣ, 82-микро", rooms: 1, area: 38, price: 2200 },
  { title: "Иҷора — хонаи хусусӣ, Сино", rooms: 3, area: 100, price: 5000 },
  { title: "Квартира 3-хонагӣ — таъмири евро", rooms: 3, area: 90, price: 980000 },
  { title: "Квартира 2-хонагӣ — нави сохта", rooms: 2, area: 60, price: 620000 },
  { title: "Участка 6 соток — Зарафшон", rooms: 0, area: 600, price: 180000 },
  { title: "Участка 10 соток — Варзоб", rooms: 0, area: 1000, price: 350000 },
  { title: "Квартира 2-хонагӣ — ипотека", rooms: 2, area: 56, price: 490000 },
  { title: "Квартира 1-хонагӣ — арзон", rooms: 1, area: 35, price: 260000 },
];

export const FURNITURE_LISTINGS = [
  { title: "Миз ва курсӣ — 6 курсӣ", price: 2800 },
  { title: "Дивани кунҷӣ — нав", price: 4500 },
  { title: "Мизи кофе — MDF", price: 650 },
  { title: "Шкафи либос — 3 дар", price: 1800 },
  { title: "Кат — двухъярусный", price: 1200 },
  { title: "Мизи корӣ — компютерӣ", price: 850 },
  { title: "Кресло офис — эргономик", price: 950 },
  { title: "Мебели ошхона — комплект", price: 5500 },
  { title: "Хелва — 2 спальное", price: 3200 },
  { title: "Комод — 4 кашода", price: 750 },
  { title: "Тумбачаи телевизор", price: 450 },
  { title: "Стеллаж — китоб", price: 380 },
  { title: "Мизи хоб — queen size", price: 2200 },
  { title: "Матрас ортопедик — 160x200", price: 1500 },
  { title: "Кресло-качалка", price: 680 },
  { title: "Мизи ошхона — 4 курсӣ", price: 1900 },
  { title: "Диван — б/у, ҳолати хуб", price: 2200 },
  { title: "Шкафи кухня — нав", price: 3800 },
];

export const CLOTHING_LISTINGS = [
  { title: "Куртаи зимистона — мардона, L", price: 450 },
  { title: "Палто — занона, M", price: 680 },
  { title: "Кроссовка Nike Air Max — 42", price: 850 },
  { title: "Кроссовка Adidas — 43", price: 720 },
  { title: "Джинси Levi's — 32", price: 380 },
  { title: "Костюм мардона — офис", price: 950 },
  { title: "Плош — занона, зимона", price: 520 },
  { title: "Шумои спортӣ — комплект", price: 280 },
  { title: "Куртаи пухта — XL", price: 750 },
  { title: "Шапка ва дастпош — комплект", price: 120 },
  { title: "Платье — занона, ид", price: 450 },
  { title: "Кроссовка Puma — 41", price: 580 },
  { title: "Куртаи осен — мардона, M", price: 350 },
  { title: "Шим бачагона — 8 сол", price: 85 },
  { title: "Костюм спортӣ — Nike", price: 420 },
  { title: "Ботинки зимистона — 44", price: 650 },
  { title: "Сумка занона — бренд", price: 380 },
  { title: "Куртаи кожа — мардона", price: 1200 },
];

export const KIDS_LISTINGS = [
  { title: "Арала — Chicco", price: 850 },
  { title: "Коляска — 3 в 1", price: 2200 },
  { title: "Кат — детский, деревянный", price: 650 },
  { title: "Куртаи зимистона — кӯдак 5 сол", price: 180 },
  { title: "Пойафзол бачагона — 28 размер", price: 95 },
  { title: "Игрушки — комплект", price: 150 },
  { title: "Велосипед детский — 16 дюйм", price: 450 },
  { title: "Кроватка детская — белая", price: 1200 },
  { title: "Стульчик для кормления", price: 580 },
  { title: "Конструктор LEGO — большой", price: 380 },
  { title: "Куртаи зимистона — кӯдак 8 сол", price: 220 },
  { title: "Рюкзак школьный", price: 120 },
  { title: "Самокат детский", price: 280 },
  { title: "Кроватка — б/у", price: 750 },
  { title: "Плош кӯдакона — зимона", price: 160 },
];

export const JOB_LISTINGS = [
  { title: "Менеджери фурӯш — мағоза", price: 0 },
  { title: "Бухгалтер — офис", price: 0 },
  { title: "Водитель — такси", price: 0 },
  { title: "Ошпаз — ресторан", price: 0 },
  { title: "Программист — IT компания", price: 0 },
  { title: "Маъмур — бинои маъмурӣ", price: 0 },
  { title: "Кассир — супермаркет", price: 0 },
  { title: "Мушовир — бонк", price: 0 },
  { title: "Муаллим — мактаб", price: 0 },
  { title: "Механик — автосервис", price: 0 },
  { title: "Дизайнер — рекламное агентство", price: 0 },
  { title: "Оператор call-центр", price: 0 },
];

export const SERVICE_LISTINGS = [
  { title: "Таъмири телефон — ҳамаи моделҳо", price: 50 },
  { title: "Таъмири ноутбук — диагностика ройгон", price: 100 },
  { title: "Хizmatrasонии мошин — то дараи хона", price: 200 },
  { title: "Тозакунии хона — профессионал", price: 150 },
  { title: "Таъмири мебел — барқарорсозӣ", price: 80 },
  { title: "Насбкунии кондиционер", price: 300 },
  { title: "Ремонт квартира — под ключ", price: 500 },
  { title: "Фотограф — таджлис, ид", price: 500 },
  { title: "Грузоперевозки — Душанбе", price: 100 },
  { title: "Репетитор — математика", price: 80 },
  { title: "Сантехник — 24/7", price: 60 },
  { title: "Электрик — монтаж", price: 70 },
];

export const IMAGES = {
  car: [
    "https://images.unsplash.com/photo-1621007947382-bcb3eaa62c0f?w=800",
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
    "https://images.unsplash.com/photo-1494976388531-d1058498cdd8?w=800",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
  ],
  phone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
  ],
  home: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  ],
  furniture: [
    "https://images.unsplash.com/photo-1555041469-a586c12e64bc?w=800",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae5e?w=800",
  ],
  clothing: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
  ],
  kids: [
    "https://images.unsplash.com/photo-1515488042361-ee00e8170dc4?w=800",
  ],
  job: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
  ],
  service: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
  ],
};

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomPrice(min: number, max: number): number {
  const step = max > 10000 ? 1000 : max > 1000 ? 100 : 10;
  const raw = randomInt(min / step, max / step) * step;
  return raw;
}
