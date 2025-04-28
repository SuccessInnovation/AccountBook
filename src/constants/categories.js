// 카테고리 목록 배열로 저장
// 카테고리 -> 상수 -> 배열 대문자로 명명

// 지출
export const EXPENSE_CATEGORIES = [
  'food',
  'dessert',
  'entertainment',
  'shopping',
  'transportation',
  'utilities',
  'health',
  'leisure',
  'travel',
  'contributions',
  'savings',
  'etc',
]

// 수입
export const INCOME_CATEGORIES = [
  'salary',
  'allowance',
  'financial',
  'scholarship',
  'etc',
]

// 카테고리 이름 한글-영어 매칭
export const CATEGORY_MAP = {
  // 지출
  food: '식비',
  dessert: '카페/간식',
  entertainment: '술/유흥',
  shopping: '쇼핑',
  transportation: '교통',
  utilities: '주거/통신',
  health: '의료/건강',
  leisure: '문화/여가',
  travel: '여행/숙박',
  contributions: '경조사/회비',
  savings: '저축',
  etc: '기타', // 지출/수입 '기타'항목은 공통이므로 한 번만 등록

  // 수입
  salary: '급여',
  allowance: '용돈',
  financial: '금융수입',
  scholarship: '장학금',
}

export const CATEGORY_IMG = {
  food: '/src/img/icons/bowl-food-solid.svg',
  dessert: '/src/img/icons/mug-saucer-solid.svg',
  entertainment: '/src/img/icons/wine-glass-solid.svg',
  shopping: '/src/img/icons/bag-shopping-solid.svg',
  transportation: '/src/img/icons/bus-simple-solid.svg',
  utilities: '/src/img/icons/gear-solid.svg',
  health: '/src/img/icons/house-medical-solid.svg',
  leisure: '/src/img/icons/beach-chair.png',
  travel: '/src/img/icons/travel-agency.png',
  contributions: '/src/img/icons/mail.png',
  savings: '/src/img/icons/piggy-bank.png',
  etc: '/src/img/icons/more.png',
  salary: '/src/img/icons/wages.png',
  allowance: '/src/img/icons/pay.png',
  financial: '/src/img/icons/financial-profit.png',
  scholarship: '/src/img/icons/mortarboard.png',
}
