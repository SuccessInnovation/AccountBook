<script setup>
// props로 부모 컴포넌트로부터 세 가지 숫자 데이터를 받음
const props = defineProps({
  totalExpense: Number, // 총 지출
  totalIncome: Number, // 총 수입
  budget: { Number, default: 0 }, // 예산
})

console.log('받은 props:', props)

// 부모 컴포넌트로 이벤트를 발생시키기 위해 defineEmits 사용
const emit = defineEmits(['select-summary'])

// 각 요약 항목 클릭 핸들러
const selectSummary = type => {
  emit('select-summary', type) // 클릭된 항목의 타입 ('income', 'expense', 'budget') 전달
}
</script>

<template>
  <!-- summary_card	전체 카드 섹션을 감싸는 최상위 div
card_wrap	        왼쪽 카드 묶음 (지출/수입/예산 카드 포함)
card_box	        각 개별 카드 박스 스타일 클래스
amount_box	        금액을 표시하는 곳
piechart_wrap	    향후 파이차트를 넣을 오른쪽 공간 -->
  <div class="summary_card">
    <!-- 왼쪽 카드 영역 -->
    <div class="card_wrap">
      <!-- 지출 카드 -->
      <div class="expense_card card_box" @click="selectSummary('expense')">
        <div class="box_title"><span>지출</span></div>
        <div id="usevalue_expense" class="amount_box">
          {{ (totalExpense ?? 0).toLocaleString() }} 원
          <!-- 숫자를 한국식 쉼표 포맷으로 변환: 1500000 -> 1,500,000 -->
        </div>
      </div>

      <!-- 수입 카드 -->
      <div class="income_card card_box" @click="selectSummary('income')">
        <div class="box_title"><span>수입</span></div>
        <div id="usevalue_income_box" class="amount_box">
          <p>{{ isNaN(totalIncome) ? 0 : totalIncome.toLocaleString() }}원</p>
        </div>
      </div>

      <!-- 예산 카드 -->
      <div class="budget_card card_box" @click="selectSummary('budget')">
        <div class="box_title"><span>예산</span></div>
        <div id="usevalue_budget_box" class="amount_box">
          {{ (budget ?? 0).toLocaleString() }} 원
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 요약 카드 스타일 */
.summary_card {
  margin: 0;
  padding: 0;
  width: 60vh;
  font-size: 2rem;
  color: #3f3e3c;
  display: flex;
  justify-content: center;
  justify-items: center;
}
/* 왼쪽 카드 */
.card_wrap {
  /* width: 40%; */
  width: 90%;
  height: 700px;
  border: 30px solid var(--color-point-3);
  border-radius: 20px;
  background-color: var(--color-point-3);
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  justify-content: space-between;
  text-align: center;
  gap: 1.5rem;
}

.card_box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 500px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  font-weight: 900;
}
.box_title {
  width: 30%;
}

.amount_box {
  width: 60%;
  /* border: 1px solid black; */
  height: 100px;
  align-content: center;
}
</style>
