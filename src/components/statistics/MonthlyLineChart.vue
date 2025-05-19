<template>
  <!-- 차트 있을 때만 랜더링 -->
  <div v-if="chartData" class="chart_wrapper">
    <div class="chart_wrap">
      <!-- 라인차트 영역 -->
      <div class="line_chart">
        <Line :data="chartData" :options="chartOptions" />
      </div>
      <!-- 라인차트 설명 영역 -->
      <div class="line-description">
        <!-- 현재 월 지출, 전월 대비 증감 설명 -->
        <p class="line-description-box">
          이번 달 지출은
          <span class="line-description-text"
            >{{ currentMonthExpense.toLocaleString() }}원</span
          >으로 <br />전월 대비

          <span
            v-if="Number(monthOverMonthChange) !== 0"
            class="line-description-text"
          >
            {{ monthOverMonthChange }}%
          </span>
          {{ monthOverMonthMessage }}
        </p>
        <!-- 8개월 평균 지출 -->
        <p class="line-description-box">
          최근 8개월 간 평균 지출액은 <br />
          <span class="line-description-text"
            >{{ averageExpense.toLocaleString() }}원</span
          >입니다 💸
        </p>
      </div>
    </div>
  </div>
  <!-- 데이터 없을 때 메시지 -->
  <div v-else>데이터를 불러오는 중...</div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import { toRefs } from 'vue'
import { use_calendar_store } from '@/stores/MonthSelector'

// Chart.js 플러그인 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
)
// props로 부모 컴포넌트에서 지출 데이터 받아오기
const props = defineProps({
  monthlyExpenses: {
    type: Object,
    required: true,
  },
})
// 반응형으로 구조 분해
const { monthlyExpenses } = toRefs(props)

// 캘린더 store에서 현재 연/월 정보 가져오기
const calendar = use_calendar_store()

// 현재 월 key 구하기
const currentMonthKey = computed(() => {
  const year = calendar.current_year
  const month = String(calendar.current_month + 1).padStart(2, '0')
  return `${year}-${month}` // ex) '2025-04'
})

// 현재 월 지출액
const currentMonthExpense = computed(() => {
  return monthlyExpenses.value?.[currentMonthKey.value] ?? 0
})

// 전 월 key 구하기
const previousMonthKey = computed(() => {
  const date = new Date(calendar.current_year, calendar.current_month - 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
})

// 전월 지출액
const previousMonthExpense = computed(() => {
  return monthlyExpenses.value?.[previousMonthKey.value] ?? 0
})

// 전월 대비 증감률 (%)
const monthOverMonthChange = computed(() => {
  if (previousMonthExpense.value === 0) return null // 전월 데이터 없을 때
  const diff = currentMonthExpense.value - previousMonthExpense.value
  const rate = (diff / previousMonthExpense.value) * 100
  return rate.toFixed(1)
})

// 증감률에 따른 메시지
const monthOverMonthMessage = computed(() => {
  const change = monthOverMonthChange.value
  if (change === null) return '비교할 지난 달 지출이 없네요! 😅'
  if (change > 0) return '증가했어요 📈'
  if (change < 0) return '감소했어요 📉'
  return '변동이 없어요.'
})

// 8개월 평균 지출액 계산
const averageExpense = computed(() => {
  const amounts = Object.values(monthlyExpenses.value)
  if (amounts.length === 0) return 0
  const sum = amounts.reduce((acc, cur) => acc + cur, 0)
  return Math.round(sum / amounts.length)
})

// 라인차트에 들어갈 데이터 구성
const chartData = computed(() => {
  if (
    !monthlyExpenses.value ||
    Object.keys(monthlyExpenses.value).length === 0
  ) {
    return null
  }

  const labels = Object.keys(monthlyExpenses.value)
  const data = Object.values(monthlyExpenses.value)

  return {
    labels,
    datasets: [
      {
        label: '월별 지출',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4CAF50',
        data,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#4CAF50',
        pointRadius: 5,
        pointBorderColor: '#388E3C',
        pointHoverBackgroundColor: '#2E7D32', // hover 시 포인트 배경
      },
    ],
  }
})

// 차트 옵션 (디자인/제목/축 등 설정)
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '월별 지출 추이',
      font: {
        size: 16,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}))
</script>
<style scoped>
/* 전체 wrapper */
.chart_wrapper {
  width: 100%;
  height: 300px;
  aspect-ratio: 4 / 3; /* 가로세로 비율 유지 */
  position: relative;
}

/* 차트, 설명 감싸는 컨테이너 */
.chart_wrap {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 30px;
  overflow: visible; /* 추가 */
}

/* 라인차트 영역 */
.line_chart {
  flex: 1;
  margin-left: 2rem;
}

/* 설명 텍스트 영역 */
.line-description {
  width: 30%;
  margin-right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  justify-content: center;
  text-align: center;
}

/* 강조 텍스트 스타일 */
.line-description-text {
  background: #c9b194;
}
</style>
