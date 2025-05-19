<script setup>
import { ref, computed } from 'vue' // ref, computed 임포트

// 홈페이지 내부 구성 : 월 선택 / 수입지출예산 요약 / 파이차트 그래프
import CalendarNav from '@/components/common/CalendarNav.vue'
import SummaryCard from '@/components/home/SummaryCard.vue'
import SummaryPieChart from '@/components/home/SummaryPieChart.vue'
import { useBudgetProgress } from '@/stores/useBudgetProgress'

// 수입 지출 예산 변수 store 함수 호출
const {
  // 요약 박스에 표시될 총계 데이터 (기존)
  rawTotalBudget,
  rawTotalIncome,
  rawTotalSpent,

  // --- 카테고리별 상세 데이터 (useBudgetProgress에서 가져옴) ---
  expenseData, // 카테고리별 지출+예산 데이터 (배열 형태)
  incomeData, // 카테고리별 수입 데이터 (배열 형태)
  budgetCategoryData, // 카테고리별 예산 데이터 (배열 형태) (새로 추가)
  // --------------------------------------------------------
} = useBudgetProgress()

// --- 차트 표시 및 어떤 차트를 보여줄지 상태 관리 변수 ---
const selectedSummaryType = ref(null)

// --- SummaryCard 클릭 이벤트 핸들러 ---
// 어떤 요약 항목을 클릭하든 이 함수가 호출되며, 단순히 차트 표시 상태를 true로 만듭니다.
const handleSummarySelect = type => {
  console.log(`${type} summary clicked`) // 확인용 로그
  if (selectedSummaryType.value === type) {
    selectedSummaryType.value = null
  } else {
    selectedSummaryType.value = type // 클릭된 항목 타입으로 상태 변경
  }
}

// --- 현재 선택된 타입에 따라 사용할 카테고리 데이터를 선택하고 Chart.js 형식에 맞게 변환 ---
const chartCategoryData = computed(() => {
  switch (selectedSummaryType.value) {
    case 'income':
      // incomeData (배열 [{ name, income }]) -> { name: income } 객체로 변환
      return incomeData.value.reduce((obj, item) => {
        if (item.income > 0) {
          // 수입이 0보다 큰 항목만 포함 (선택 사항)
          obj[item.name] = item.income
        }
        return obj
      }, {})

    case 'expense':
      // expenseData (배열 [{ name, spent, ... }]) -> { name: spent } 객체로 변환 (지출 금액 사용)
      return expenseData.value.reduce((obj, item) => {
        if (item.spent > 0) {
          // 지출이 0보다 큰 항목만 포함 (선택 사항)
          obj[item.name] = item.spent
        }
        return obj
      }, {})

    case 'budget':
      // budgetCategoryData (배열 [{ name, amount }]) -> { name: amount } 객체로 변환 (예산 금액 사용)
      return budgetCategoryData.value.reduce((obj, item) => {
        if (item.amount > 0) {
          // 예산이 0보다 큰 항목만 포함 (선택 사항)
          obj[item.name] = item.amount
        }
        return obj
      }, {})

    default:
      return null // 아무것도 선택되지 않으면 데이터 없음
  }
})

// --- 파이 차트 데이터 계산 (변환된 카테고리 데이터 기반) ---
const chartData = computed(() => {
  const data = chartCategoryData.value // 변환된 객체 형태 데이터 사용
  if (!data) {
    return { labels: [], datasets: [{ data: [], backgroundColor: [] }] }
  }

  const labels = Object.keys(data) // 카테고리 이름들
  const values = Object.values(data) // 카테고리 금액들

  // 차트 색상 (카테고리 개수에 맞게 적절히 추가하거나 동적으로 생성 필요)
  // 이전 답변에서 사용한 색상 팔레트 재사용
  const backgroundColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966CC',
    '#FF9F40',
    '#E7E9ED',
    '#7AC943',
    '#FEFE33',
    '#33FFEE',
    '#A349A4',
    '#FEDCBA',
  ]

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors.slice(0, labels.length), // 카테고리 수만큼 색상 사용
        data: values,
      },
    ],
  }
})

// --- 파이 차트 옵션 설정 (선택된 타입에 따라 제목 변경) ---
// 이전 답변의 로직과 동일
const chartOptions = computed(() => {
  let chartTitle = ''
  switch (selectedSummaryType.value) {
    case 'income':
      chartTitle = '월별 수입 카테고리'
      break
    case 'expense':
      chartTitle = '월별 지출 카테고리'
      break
    case 'budget':
      chartTitle = '월별 예산 카테고리'
      break
    default:
      chartTitle = '카테고리별 현황'
      break
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: chartTitle, // 동적으로 설정된 제목
        font: { size: 16 },
      },
      tooltip: {
        // 툴팁에 금액과 백분율 표시 로직 (이전 답변과 동일)
        callbacks: {
          label: function (context) {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            if (context.raw !== null) {
              const total = context.dataset.data.reduce(
                (sum, val) => sum + val,
                0,
              )
              const percentage =
                total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0
              label +=
                context.raw.toLocaleString() + ' 원 (' + percentage + '%)'
            }
            return label
          },
        },
      },
      legend: { position: 'bottom' },
    },
  }
})
</script>

<template>
  <div class="home">
    <CalendarNav />
    <!-- 값이 정의되었을 때만 렌더링 -->
    <div class="summary_card_wrap">
      <SummaryCard
        class="summary_card"
        :totalIncome="rawTotalIncome"
        :totalExpense="rawTotalSpent"
        :budget="rawTotalBudget"
        @select-summary="handleSummarySelect"
      />
    </div>

    <!-- 오른쪽 파이차트 자리 (현재 비워져 있음) -->
    <template v-if="selectedSummaryType">
      <div class="piechart_wrap">
        <SummaryPieChart
          v-if="chartCategoryData && Object.keys(chartCategoryData).length > 0"
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
        <div v-else class="no_data_message">
          <p>선택하신 항목에 대한 저장된 데이터가 없습니다.😥</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* 홈페이지 중앙 정렬을 위한 스타일 */
.home {
  position: absolute;
  top: 0px;
  background: #f5f7fa;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 20px; /* 상단 여백 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */
}

/* SummaryCard와 PieChart 사이의 간격 조절 */
.summary_card,
.piechart_wrap {
  margin-top: 20px;
}

.piechart_wrap {
  width: 50vh;
  height: 700px;
  border: 30px solid var(--color-point-3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .no_data_message { */
/* width: 100%; .pie-chart-container에서 상속 */
/* max-width: 400px; .pie-chart-container에서 상속 */
/* margin: 20px auto; .pie-chart-container에서 상속 */
/* padding: 30px; 내부 여백 */
/* text-align: center; */
/* color: #777; */
/* background-color: #f9f9f9; 약간의 배경색 */
/* border-radius: 8px; SummaryCard나 Chart와 유사하게 둥근 모서리 */
/* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); 은은한 그림자 */
/* min-height: 200px; 차트와 유사한 최소 높이로 레이아웃 흔들림 방지 */
/* display: flex; */
/* align-items: center; */
/* justify-content: center; */
/* } */

.no_data_message p {
  margin: 0; /* 기본 단락 마진 제거 */
  font-size: 1.1rem;
}
</style>
