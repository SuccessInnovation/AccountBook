<template>
  <div class="container">
    <div class="budget_container">
      <!-- 제목 -->
      <div class="budget_title">
        <h2>{{ calendar.current_month + 1 }}월 총예산</h2>
        <div class="btn_wrap">
          <button class="setting_btn" @click.prevent="budgetSetting">
            <img src="../img/cabbage/배추9.png" alt="예산설정버튼" />
            <span class="btn_txt"><strong>예산설정</strong></span>
          </button>
        </div>
      </div>
      <!-- 예산이 없는 경우 -->
      <div v-if="expenseData.length === 0" class="budget_box">
        <div class="no_budget">
          <p>이번 달 예산이 설정되지 않았어요</p>
          <img src="../img/cabbage/logo1.png" alt="배추이미지" />
        </div>
      </div>
      <!-- 예산이 있을 경우 -->
      <div v-else class="overall_progress">
        <div class="bar_wrapper">
          <div class="category_title">
            <div class="percentage">
              {{ totalBudget === 0 ? '-' : overallPercent + '%' }}
            </div>
            <span class="left_budget" :class="{ deficit: totalLeft < 0 }">
              {{
                (totalLeft < 0 ? totalLeft * -1 : totalLeft).toLocaleString()
              }}원
              {{ totalLeft < 0 ? '초과' : '남음' }}
            </span>
          </div>
          <div class="bar_background">
            <div
              class="bar_fill"
              :style="{
                width: (totalBudget === 0 ? '100' : overallPercent) + '%',
                backgroundColor: 'var(--color-point-1)',
              }"
            ></div>
          </div>
          <div class="bar_text">
            <span>{{ totalSpent.toLocaleString() }}원 지출</span>
            <span>예산 {{ totalBudget.toLocaleString() }}원</span>
          </div>
        </div>
      </div>
      <div
        :class="[
          'progress_list',
          expenseData.length <= 3 ? 'one-column' : 'two-column',
        ]"
      >
        <!-- 카테고리 별 지출, 예산 진행률 리스트 -->
        <div
          v-for="item in expenseData.filter(e => e.budget > 0)"
          :key="item.category"
          class="progress_item"
        >
          <div class="category_title">
            <img class="category_icon" :src="item.icon" alt="{{item.name}}" />
            <span>{{ item.name }}</span>
            <div class="percentage">
              {{ item.budget === 0 ? '-' : item.percent + '%' }}
            </div>
            <span class="left_budget" :class="{ deficit: item.left < 0 }">
              {{
                (item.left < 0 ? item.left * -1 : item.left).toLocaleString()
              }}원
              {{ item.left < 0 ? '초과' : '남음' }}
            </span>
          </div>
          <div class="bar_wrapper">
            <div class="bar_background">
              <div
                class="bar_fill"
                :style="{
                  width: (item.budget === 0 ? '100' : item.percent) + '%',
                }"
              ></div>
            </div>
            <div class="bar_text">
              <span>{{ item.spent.toLocaleString() }}원 지출</span>
              <span>예산 {{ item.budget.toLocaleString() }}원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { useBudgetProgress } from '@/stores/useBudgetProgress'
import { use_calendar_store } from '@/stores/MonthSelector'

const calendar = use_calendar_store()

const emit = defineEmits(['setting'])

const {
  expenseData,
  totalBudget,
  totalSpent,
  overallPercent,
  totalLeft,
  refresh,
} = useBudgetProgress()

defineExpose({
  refresh, // 👈 이걸 해줘야 ref.value.refresh가 가능해짐
})
const budgetSetting = () => {
  console.log('클릭됨')
  emit('setting') // 예산 설정 UI 열기
}
</script>

<style scoped>
/* *** 제목, 예산설정 버튼 영역 시작 *** */
/* 제목 위치, 크기 */
.budget_title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.375rem auto;
  padding: 1rem 2rem;
  font-size: 1.2rem;
}
.budget_title h2 {
  font-weight: bold;
  font-size: 30px;
}
/* 버튼 위치, 크기, 색상 */
.btn_wrap {
  position: absolute;
  right: 0;
}
.setting_btn {
  align-items: center;
  width: 3rem;
  cursor: pointer;
}
.setting_btn > span {
  color: var(--color-point-1);
  text-decoration: underline;
}
.setting_btn:hover {
  background-color: var(--color-point-5);
}
.btn_txt {
  font-size: 0.75rem;
}

/* *** 컨텐츠 박스 영역 *** */
/* 컨텐츠 박스 설정 */
/* .budget_container {
    border: 1rem solid var(--color-point-3);
    border-radius: 1rem;
    padding: 20px;
    max-width: 900px;
    height: 600px;
    margin: 1.5rem auto;
  } */
.container {
  background-color: var(--color-point-3);
  border-radius: 30px;
  max-width: 900px;
  min-width: 768px;
  height: 600px;
}
.budget_container {
  background-color: #fff;
  border-radius: 15px;
  width: 95%;
  height: 98%;
  padding: 20px;
  margin: 1.5rem auto;
}

/* 예산이 없을 때 시작 */
.budget_box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.no_budget {
  width: 30%;
  text-align: center;
}

/* 예산이 설정되었을 때 시작 */
.overall_progress {
  justify-self: center;
  width: 50%;
  margin-bottom: 2rem;
}

/* 예산, 지출 비율 리스트 */
.progress_list {
  display: grid;
  gap: 1rem;
  max-height: 20rem;
  overflow-y: scroll;
  padding-right: 6px;
}

.progress_list.one-column {
  grid-template-columns: 1fr;
}

.progress_list.two-column {
  grid-template-columns: repeat(2, 1fr);
}

.progress_item {
  padding: 1rem;
}
.progress_list::-webkit-scrollbar {
  width: 0.625rem;
  background-color: var(--color-input-box);
  border-radius: 10px;
}
.progress_list::-webkit-scrollbar-thumb {
  background-color: var(--color-point-1);
  border-radius: 10px;
}
/* 카테고리명 */
.category_icon {
  width: 1rem;
}
.category_title {
  position: relative;
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 8px;
  display: flex;
  gap: 0.5rem;
}

.left_budget {
  position: absolute;
  right: 0;
}

.left_budget.deficit {
  color: var(--color-red-100);
}

/* 진행률 바 영역 */
.bar_wrapper {
  width: 100%;
}
/* 퍼센트 글씨 */
.percentage {
  display: inline;
  margin-left: 0.625rem;
  font-size: 14px;
  color: var(--color-font-main);
  opacity: 50%;
  font-weight: 600;
}
/* 회색 바 */
.bar_background {
  width: 100%;
  height: 1rem;
  background-color: var(--color-input-box);
  border-radius: 999px;
  overflow: hidden;
}
/* 진행률 표시 */
.bar_fill {
  height: 100%;
  background-color: var(--color-point-2);
  border-radius: 999px;
  transition: width 0.3s ease;
}
/* 지출, 예산 표시 */
.bar_text {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 14px;
  color: var(--color-font-main);
}
/* *** 제목, 예산설정 버튼 스타일 끝 *** */
</style>
