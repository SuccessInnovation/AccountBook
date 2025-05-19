<template>
  <div class="statistics_page">
    <!-- 월 선택 영역 -->
    <CalendarNav id="calendar" />
    <!-- 통계 콘텐츠 영역 -->
    <div class="content_area">
      <!-- 상단 통계 영역 (파이 차트 + 순이익) -->
      <div class="top_section">
        <MonthlyPieChart :monthly-data="store.monthlyCategoryData" />
        <div class="net_profit_box">
          <NetProfit
            :net-profit="store.netProfitData?.netProfit ?? 0"
            :income="store.netProfitData?.income ?? 0"
            :expense="store.netProfitData?.expense ?? 0"
          />
        </div>
      </div>
      <!-- 하단 통계 영역 (라인 차트) -->
      <div class="bottom_section">
        <MonthlyLineChart :monthly-expenses="store.monthlyExpenseData" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 컴포넌트 및 스토어 import
import CalendarNav from '@/components/common/CalendarNav.vue'
import { statisticsStore } from '@/stores/statisticsStore'
import { use_calendar_store } from '@/stores/MonthSelector'
import { onMounted, watch } from 'vue'
import MonthlyPieChart from '@/components/statistics/MonthlyPieChart.vue'
import MonthlyLineChart from '@/components/statistics/MonthlyLineChart.vue'
import NetProfit from '@/components/statistics/NetProfit.vue'

// 통계 데이터 및 캘린더 데이터 스토어 사용
const store = statisticsStore()
// 현재 선택된 월/연도를 관리하는 store 인스턴스 (기간 범위 등)
const calendar = use_calendar_store()

// 페이지 로딩 시 데이터 fetch 및 통계 계산 실행
onMounted(async () => {
  await store.fetchTransactionsByPeriod(
    calendar.monthStartDate,
    calendar.monthEndDate,
  )
  store.calculateStatistics()
})

// 선택된 월이 변경될 때마다 데이터 fetch 및 통계 재계산
watch(
  () => [calendar.current_year, calendar.current_month],
  async () => {
    await store.fetchTransactionsByPeriod(
      calendar.monthStartDate,
      calendar.monthEndDate,
    )
    store.calculateStatistics()
  },
)
</script>

<style scoped>
/* 전체 페이지 스타일 */
.statistics_page {
  /* padding: 0 20px 20px 20px; */
  background: #f5f7fa;
}
.statistics_page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/* 통계 콘텐츠 영역 박스 */
.content_area {
  border: 1rem solid var(--color-point-3);
  border-radius: 20px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 20px;
  overflow: scroll;
  background-color: var(--color-point-3);
}

/* 각 모서리 둥글게 */
.bottom_section,
.chart_group,
.net_profit_box {
  border-radius: 20px;
  background-color: white;
}

/* 상단 통계 영역 */
.top_section {
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: 400px;
}

/* pie chart group이 전체 너비를 차지하는 부분을 줄이기 위함 */
.top_section > *:first-child {
  flex: 2;
}

/* net profit 영역 */
.net_profit_box {
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

/* 하단 영역 */
.bottom_section {
  gap: 20px;
  min-height: 400px;
  height: auto;
}
</style>
