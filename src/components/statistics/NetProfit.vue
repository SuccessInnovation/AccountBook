<template>
  <div class="profit_wrapper">
    <h3>이 달의 순이익</h3>
    <div class="profit_wrap">
      <p>
        <!-- 순이익 출력: '+'면 초록, '-'면 빨강 -->
        <span :style="{ color: netProfit >= 0 ? 'green' : 'red' }">
          {{ netProfit?.toLocaleString?.() ?? '데이터 없음' }}원
        </span>
      </p>

      <!-- 수입 대비 지출 상태를 배추 이미지로 표현 -->
      <img :src="profitImage" alt="수입 대비 지출 상태" class="cabbage" />
      <p class="profit-message">{{ profitMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  netProfit: {
    type: Number,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
})

// 순이익 (props 바로 사용하기 위한 computed)
const netProfit = computed(() => props.netProfit)

// 수입 대비 지출 비율 계산
const spendingRate = computed(() => {
  if (!props.income) return 0 // 수입이 없으면 0
  return (props.expense / props.income) * 100
})

// 수입 대비 지출 비율에 따른 배추 이미지
const profitImage = computed(() => {
  const rate = spendingRate.value

  if (rate < 40) {
    return new URL('@/img/cabbage/logo1.png', import.meta.url).href // 초록 배추
  } else if (rate < 80) {
    return new URL('@/img/cabbage/logo4.png', import.meta.url).href // 노란 배추
  } else if (rate < 100) {
    return new URL('@/img/cabbage/logo3.png', import.meta.url).href // 좀 빨개진 배추
  } else {
    return new URL('@/img/cabbage/logo2.png', import.meta.url).href // 빨간 배추
  }
})

// 수입 대비 지출 비율에 따른 메세지
const profitMessage = computed(() => {
  const rate = spendingRate.value

  if (rate < 40) {
    return '최고예요 🎉'
  } else if (rate < 80) {
    return '좋은 흐름 유지 중 🌿'
  } else if (rate < 100) {
    return '주의가 필요해요 ⚠️'
  } else {
    return '지출이 너무 많아요 🚨'
  }
})
</script>

<style scoped>
.profit_wrapper {
  height: 100%;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  justify-content: center;
  text-align: center;
}

h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.profit_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profit_wrap p {
  margin: 0;
  line-height: 1.4;
}

.cabbage {
  /* width: 80%; */
  height: 150px;
  margin-bottom: 0.5rem;
}

.profit-message {
  margin-top: 0.5rem;
}
</style>
