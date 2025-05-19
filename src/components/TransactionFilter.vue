<script setup>
/*
  이 컴포넌트는 상위 컴포넌트로부터
  수입과 지출 체크 상태를 props로 받고,
  체크 상태가 변경되면 update 이벤트를 emit합니다.
*/
</script>

<template>
  <!-- 수입/지출 필터 -->
  <div class="filter_container">
    <label class="income_checkbox">
      <input
        type="checkbox"
        :checked="showIncome"
        @change="e => $emit('update:showIncome', e.target.checked)"
      />
      <span>수입</span>
    </label>
    <label class="expense_checkbox">
      <input
        type="checkbox"
        :checked="showExpense"
        @change="e => $emit('update:showExpense', e.target.checked)"
      />
      <span>지출</span>
    </label>
  </div>
</template>

<style scoped>
/* 1. 수입/지출 필터 컨테이너 */
.filter_container {
  display: flex;
  gap: 10px;
}

/* 2. 수입 체크박스 */
.income_checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* 3. 지출 체크박스 */
.expense_checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
</style>
