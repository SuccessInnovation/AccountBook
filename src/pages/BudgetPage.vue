<script setup>
import { ref } from 'vue'
import BudgetSetting from '@/components/budgets/BudgetSetting.vue'
import BudgetProgress from '@/components/budgets/BudgetProgress.vue'
import CalendarContent from '@/components/common/CalendarNav.vue'

const isSetting = ref(false)
const progressRef = ref(null) // 예산 추가 시 바로 반영되기 위함

const budgetSetting = () => {
  isSetting.value = true
}

const handleSubmit = () => {
  isSetting.value = false // 팝업 닫기
  progressRef.value?.refresh() // 저장 후 진척도 갱신
}
</script>

<template>
  <div class="BudgetPage">
    <div class="container">
      <CalendarContent />
      <BudgetProgress ref="progressRef" @setting="budgetSetting" />
      <BudgetSetting
        v-if="isSetting"
        @submit="handleSubmit"
        @close="isSetting = false"
      />
    </div>
  </div>
</template>

<style scoped>
.BudgetPage {
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
