<!-- src/components/CalendarContent.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { use_calendar_store } from '@/stores/MonthSelector'
// calendar store 인스턴스 불러오기
const calendar = use_calendar_store()
// 이전 달 - 현재 달 - 다음 달
const { visible_months } = storeToRefs(calendar)

// 월 이름 배열 (e.g. 1월, 2월 ..)
const month_names = calendar.month_names
</script>

<template>
  <!-- 전체 달력 캐러셀 -->
  <div class="calendar_carousel">
    <!-- 이전 월로 이동 버튼 -->
    <button type="button" class="arrow" @click="calendar.go_to_prev_month">
      &lt;
    </button>

    <!-- 월 표시 영역 -->
    <div class="month_slider">
      <!-- 이전, 현재, 다음 월을 나란히 표시 -->
      <div
        v-for="(month, index) in visible_months"
        :key="index"
        class="month_item"
      >
        <!-- 연도 -->
        <p id="year" :class="{ active: index === 1, faded: index !== 1 }">
          {{ month.year }}
        </p>
        <!-- 월 이름: 현재 월은 강조, 나머지는 축소 및 흐림 효과 -->
        <p id="month" :class="{ active: index === 1, faded: index !== 1 }">
          {{ month_names[month.month] }}
        </p>
      </div>
    </div>
    <!-- 다음 월로 이동 버튼 -->
    <button type="button" class="arrow" @click="calendar.go_to_next_month">
      &gt;
    </button>
  </div>
</template>

<style scoped>
/* 전체 캐러셀 구조 */
.calendar_carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

/* 월 슬라이더: 3개월 보여주는 박스 */
.month_slider {
  display: flex;
  width: 350px;
  overflow: hidden;
  justify-content: space-around;
}

/* 각 월 아이템 (년/월 포함) */
.month_item {
  width: 100px;
  text-align: center;
  opacity: 0.6;
  transform: scale(0.9);
  transition: all 0.5s ease;
}

/* 연도 */
#year {
  font-size: 30px;
  margin: 0px;
  padding: 0px;
}

/* 월 */
#month {
  font-size: 45px;
}

/* 흐릿한 효과 */
.faded {
  opacity: 0.7;
}

/* 흐릿한 연도 + 위치 조정 */
#year.faded {
  font-size: 20px;
  margin-top: 30px;
}

/* 흐릿한 월 + 폰트 크기 조정 */
#month.faded {
  font-size: 35px;
}

/* 가운데 현재 월 강조 */
.active {
  font-weight: bold;
  opacity: 1;
  transform: scale(1.1);
}

/* 좌우 화살표 버튼 */
.arrow {
  font-size: 3rem;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--color-point-1);
  transition: transform 0.2s ease;
}
.arrow:hover {
  transform: scale(1.2);
}
</style>
