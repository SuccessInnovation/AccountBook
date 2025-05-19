<script setup>
// 수정날짜 : 2025.04.28
import { ref } from 'vue'
// Swiper.js Vue 컴포넌트 및 모듈 임포트
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'

// Swiper.js 기본 스타일 및 모듈 스타일 임포트
import 'swiper/css'
import 'swiper/css/pagination'
// import 'swiper/css/autoplay'; // 자동 재생 사용 시 필요할 수 있음

// 사용할 Swiper 모듈 정의
const modules = ref([Pagination, Autoplay])

// Swiper 인스턴스를 저장할 ref 생성
const swiper_instance = ref(null)

// @swiper 이벤트 핸들러: Swiper 인스턴스를 받아서 ref에 저장
const onSwiper = swiper => {
  swiper_instance.value = swiper
}

// 이전 슬라이드로 이동하는 함수
const goToPrev = () => {
  // swiperInstance가 존재하면 slidePrev() 메소드 호출
  swiper_instance.value?.slidePrev()
}

// 다음 슬라이드로 이동하는 함수
const goToNext = () => {
  // swiperInstance가 존재하면 slideNext() 메소드 호출
  swiper_instance.value?.slideNext()
}

// --- 로컬 이미지 아이콘 로드를 위한 함수 추가 ---
const get_iconUrl = icon_name => {
  if (!icon_name) return null
  try {
    // 아이콘 파일이 'src/assets/icons/' 폴더에 있다고 가정
    // Vite 환경에서 로컬 자산을 동적으로 참조하는 일반적인 방법
    return new URL(`/src/img/cabbage/${icon_name}`, import.meta.url).href
    // 만약 Vue CLI (Webpack) 환경이고 require 사용한다면:
    // return require(`@/assets/icons/${icon_name}`);
  } catch (e) {
    console.error(`Error loading icon: ${icon_name}`, e)
    return null // 또는 아이콘이 없을 경우 표시할 기본 이미지 경로
  }
}

// 슬라이드에 표시할 기능 데이터 (예시)
const features = ref([
  {
    id: 'transaction_input',
    title: '수입/지출 입력',
    description: '간편하게 수입과 지출 내역을 입력하고 관리하세요.',
    icon: '배추9.png',
  },
  {
    id: 'stats_summary',
    title: '통계 요약',
    description: '월별, 연도별 수입/지출 통계를 한눈에 확인하세요.',
    icon: 'logo1.png',
  },
  {
    id: 'excel_export',
    title: '엑셀 내보내기',
    description: '가계부 데이터를 엑셀 파일로 손쉽게 내보낼 수 있습니다.',
    icon: '배추10.png',
  },

  {
    id: 'categorization',
    title: '예산 관리',
    description: '자신만의 예산을 설정하고 목표를 달성하세요.',
    icon: '배추11.png',
  },
  // 필요한 기능 추가
])
</script>

<template>
  <div class="feature_slider_wrapper">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="30"
      :loop="true"
      :pagination="{ clickable: true }"
      :autoplay="{ delay: 4500, disableOnInteraction: ture }"
      class="feature_slider"
      @swiper="onSwiper"
    >
      <swiper-slide
        v-for="feature in features"
        :key="feature.id"
        class="feature_slide"
      >
        <div class="slide_content">
          <h3 class="slide_title">
            <img
              v-if="feature.icon"
              :src="get_iconUrl(feature.icon)"
              :alt="`${feature.title} 아이콘`"
              class="title_icon"
            />
            {{ feature.title }}
          </h3>
          <p class="slide_description">{{ feature.description }}</p>
        </div>
      </swiper-slide>
    </swiper>
    <div class="custom_nav custom_nav_prev" @click="goToPrev"></div>
    <div class="custom_nav custom_nav_next" @click="goToNext"></div>
  </div>
</template>

<style scoped>
/* 스네이크 케이스 명명 규칙 사용 */
.feature_slider_wrapper {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0; /* 패딩 조정 (네비게이션 영역 고려) */
  box-sizing: border-box;
  position: relative; /* 자식 absolute 요소의 기준점 */
  overflow: hidden; /* 내부 요소가 넘치지 않도록 */
}

.feature_slider {
  /* --swiper-pagination-color: #007aff; */
  /* 필요시 페이지네이션 스타일 조정 */
}

.feature_slide {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
}

.slide_content {
  /* 슬라이드 내부 컨텐츠 스타일 */
}

.slide_title {
  font-size: 2.5rem; /* 제목 폰트 크기 */
  margin-bottom: 0.5rem; /* 제목 아래 여백 */
  color: #333;

  /* 아이콘과 텍스트를 가로로 나란히 배치하고 세로 중앙 정렬 */
  display: flex;
  align-items: center;
  justify-content: center; /* 제목 영역 자체를 중앙 정렬 */
  /* gap: 10px; */ /* 최신 CSS: 아이콘과 텍스트 사이 간격 설정 */
}
h3 > img {
  /* 아이콘 크기를 부모 요소 (slide_title)의 폰트 크기에 맞춰 조절 */
  height: 1.5em; /* slide_title의 현재 폰트 크기와 높이 같게 */
  /* height: 1.2em; */ /* 조금 더 크게 하고 싶다면 */
  width: auto; /* 높이에 맞춰 가로 비율 자동 조절 */

  /* 아이콘과 텍스트 사이 간격 */
  margin-right: 10px; /* 간격 조정 */

  /* 이미지 기본 스타일 제거 (필요시) */
  vertical-align: middle; /* flexbox에서는 align-items가 더 효과적 */
  margin-top: 0;
  margin-bottom: 0;
}
.slide_description {
  font-size: 1rem; /* 설명 폰트 크기 */
  color: #555;
}
/* 사용자 정의 네비게이션 영역 스타일 */
.custom_nav {
  position: absolute;
  top: 0;
  bottom: 0; /* 또는 height: 100% */
  width: 15%; /* 클릭 영역 너비 (조절 가능) */
  z-index: 10; /* 슬라이드 위에 오도록 설정 */
  cursor: pointer;
  /* 배경색을 투명하게 하거나, 필요시 반투명 또는 아이콘 표시 */
  /* background-color: rgba(0, 0, 0, 0.1); */ /* 개발 중 영역 확인용 */
  display: flex; /* 내부 아이콘 정렬 등을 위해 */
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease; /* 부드러운 효과 */
}

.custom_nav:hover {
  background-color: rgba(0, 0, 0, 0.05); /* 마우스 호버 시 약간의 배경 표시 */
}

.custom_nav_prev {
  left: 0;
  /* width: 100px;
  height: 100px;
  border: 1px solid black; */
  /* background-image: url('path/to/prev-icon.svg'); */ /* 아이콘 사용 시 */
  /* background-repeat: no-repeat; */
  /* background-position: center left; */
}

.custom_nav_next {
  right: 0;
  /* width: 100px;
  height: 100px;
  border: 1px solid black; */
  /* background-image: url('path/to/next-icon.svg'); */ /* 아이콘 사용 시 */
  /* background-repeat: no-repeat; */
  /* background-position: center right; */
}

/* 페이지네이션이 있다면, 네비게이션 영역과 겹치지 않도록 조정 필요 */
:deep(.swiper-pagination) {
  /* bottom: 10px; */ /* 예시: 페이지네이션 위치 조정 */
}
.slide_icon {
  width: 50px;
  height: 50px;
  margin-top: 1rem;
}

/* Swiper 네비게이션 버튼 위치/스타일 미세 조정 */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  top: 50%;
  transform: translateY(-50%);
}
:deep(.swiper-pagination-bullet-active) {
  /* 활성 페이지네이션 스타일 */
}
</style>
