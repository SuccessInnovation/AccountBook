<template>
  <div class="chart_group">
    <!-- 데이터가 있을 경우 파이차트 및 설명 표시 -->
    <div v-if="hasData" class="chart_box">
      <div class="pie_chart">
        <!-- vue-chartjs 컴포넌트로 파이차트 렌더링 -->
        <Pie :data="chartData" :options="chartOptions" />
      </div>

      <!-- 카테고리별 지출 순위 설명 -->
      <div class="pie_description">
        <p class="pie_title">{{ currentMonth }}월의 소비 순위</p>
        <p class="rank rank1">
          🥇 1위: {{ topCategories[0]?.label ?? '데이터 없음' }} ({{
            topCategories[0]?.percent ?? ''
          }}%)
        </p>
        <p class="rank rank2">
          🥈 2위: {{ topCategories[1]?.label ?? '데이터 없음' }} ({{
            topCategories[1]?.percent ?? ''
          }}%)
        </p>
        <p class="rank rank3">
          🥉 3위: {{ topCategories[2]?.label ?? '데이터 없음' }} ({{
            topCategories[2]?.percent ?? ''
          }}%)
        </p>
      </div>
    </div>
    <!-- 데이터가 없을 경우 메시지 출력 -->
    <div v-else class="no_data">
      <p class="no_data_text">이번 달 지출 내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
// Chart.js, vue-chartjs 불러오기
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'vue-chartjs'

// Vue 유틸 불러오기
import { computed } from 'vue'
import { toRefs } from 'vue'
import { CATEGORY_MAP } from '@/constants/categories'

// props 정의
const props = defineProps({
  monthlyData: {
    type: Object,
    required: true,
  },
})
// Chart.js에 필요한 플러그인 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement)

// reactive props 분리 (optional, 권장)
const { monthlyData } = toRefs(props)

// 유효현 지출 데이터가 있는지 확인
const hasData = computed(() => {
  return Object.values(monthlyData.value).reduce((acc, val) => acc + val, 0) > 0
})

// 파이차트에 사용할 데이터 생성
const chartData = computed(() => {
  const labels = Object.keys(monthlyData.value).map(
    key => CATEGORY_MAP[key] ?? key,
  )
  const values = Object.values(monthlyData.value)
  return {
    labels,
    datasets: [
      {
        label: '지출 금액',
        data: values,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 1,
      },
    ],
  }
})

// 파이차트 옵션 설정
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 10, // 색상 박스 작게
        font: {
          size: 10, // 글씨 작게
        },
        padding: 8, // 간격 조금만
      },
    },
    title: {
      display: true,
      text: '카테고리별 지출 비율',
      font: {
        size: 16,
      },
    },
    options: {
      layout: {
        padding: {
          top: 0,
          bottom: 0,
        },
      },
    },
  },
}))

// top3 지출 카테고리 및 비율 계산
const topCategories = computed(() => {
  const entries = Object.entries(monthlyData.value)
  const total = Object.values(monthlyData.value).reduce(
    (acc, val) => acc + val,
    0,
  )

  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, value]) => ({
      key: category,
      label: CATEGORY_MAP[category] ?? category,
      value,
      percent: ((value / total) * 100).toFixed(1),
    }))
})

// 현재 선택된 월 정보 (스토어에서 불러오기)
import { use_calendar_store } from '@/stores/MonthSelector'
const calendar = use_calendar_store()
const currentMonth = computed(() => calendar.current_month + 1) // 0부터 시작하므로 +1
</script>

<style scoped>
.chart_group {
  display: flex;
  flex-direction: row;
  width: 820px;
  height: 400px;
  position: relative;
  justify-content: center;
  align-items: center;
}

/* 파이 차트 영역 */
.pie_chart {
  flex: 2;
  width: 400px;
  height: 400px;
  max-width: 400px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

/* 설명글 영역 */
.pie_description {
  flex: 1;
  width: 400px;
  height: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-width: 0;
  margin-right: 20px;
  font-weight: bold;
  line-height: 1.8;
  font-size: 18px;
}

.pie_title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--color-brown-dark);
  border-left: 5px solid var(--color-point-3);
  padding-left: 12px;
}

.rank {
  margin: 6px 0;
  font-size: 17px;
  font-weight: 600;
}

.rank1 {
  color: #f39c12;
}

.rank2 {
  color: #95a5a6;
}

.rank3 {
  color: #cd7f32;
}

.chart_box {
  display: flex;
}
</style>
