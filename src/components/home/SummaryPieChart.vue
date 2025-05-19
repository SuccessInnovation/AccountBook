<script setup>
import { Pie } from 'vue-chartjs'

// Chart.js에서 필요한 요소들 임포트 및 등록
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

// 부모 컴포넌트로부터 차트 데이터와 옵션을 props로 받습니다.
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    default: () => ({}), // 기본값으로 빈 객체 제공
  },
})
</script>

<template>
  <div class="piechart_container">
    <Pie :data="props.chartData" :options="props.chartOptions" />
  </div>
</template>

<style scoped>
.piechart_container {
  /* 차트 컨테이너의 스타일 */
  /* 예시: 차트의 최대 너비 설정 */
  max-width: 400px;
  width: 100%; /* 부모 너비에 맞추되 최대 너비 제한 */
  margin: 20px auto; /* 위아래 여백 및 중앙 정렬 */
}
</style>
