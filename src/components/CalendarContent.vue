<script setup>
import { storeToRefs } from 'pinia'
import { use_calendar_store } from '@/stores/MonthSelector'
import { useTransactionStore } from '@/stores/TransactionStore'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PopupListPage from '@/pages/PopupListPage.vue'

const calendar = use_calendar_store()
const transaction_store = useTransactionStore()
const { transactions } = storeToRefs(transaction_store)
const { current_year, current_month } = storeToRefs(calendar)
const router = useRouter()

const today = new Date()
const days = ['일', '월', '화', '수', '목', '금', '토']

const show_selected_date_list = ref(false)

onMounted(() => {
  transaction_store.fetchTransactions()
})

function openSelectedDateList(day) {
  if (!day) return
  const selected_date = `${current_year.value}-${String(current_month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  router.replace({ query: { date: selected_date } })
  show_selected_date_list.value = true
}

function closePopup() {
  show_selected_date_list.value = false
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getStartDay(year, month) {
  return new Date(year, month, 1).getDay()
}

const weeks = computed(() => {
  const total_days = getDaysInMonth(current_year.value, current_month.value)
  const start_day = getStartDay(current_year.value, current_month.value)
  const dates = []

  for (let i = 0; i < start_day; i++) dates.push(null)
  for (let i = 1; i <= total_days; i++) dates.push(i)
  while (dates.length % 7 !== 0) dates.push(null)

  const result = []
  for (let i = 0; i < dates.length; i += 7) {
    result.push(dates.slice(i, i + 7))
  }
  return result
})

function getDailySummary(day) {
  if (!day) return { income: 0, expense: 0 }
  const date_str = `${current_year.value}-${String(current_month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const daily_records =
    transactions.value?.filter(r => r.date === date_str) || []
  const income = daily_records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0)
  const expense = daily_records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0)
  return { income, expense }
}

function isToday(day) {
  return (
    today.getDate() === day &&
    today.getMonth() === current_month.value &&
    today.getFullYear() === current_year.value
  )
}
</script>

<template>
  <div class="calendar-wrapper">
    <table class="calendar-table">
      <thead>
        <tr>
          <th v-for="day in days" :key="day" class="day-header">
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, w_idx) in weeks" :key="w_idx">
          <td
            v-for="(date, d_idx) in week"
            :key="d_idx"
            @click="openSelectedDateList(date)"
            class="calendar-cell"
            :class="{ today_highlight: isToday(date) }"
          >
            <div v-if="date">
              <strong>{{ date }}</strong>
              <div v-if="getDailySummary(date).income" class="text-income">
                +{{ getDailySummary(date).income.toLocaleString() }}
              </div>
              <div v-if="getDailySummary(date).expense" class="text-expense">
                -{{ getDailySummary(date).expense.toLocaleString() }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <PopupListPage v-if="show_selected_date_list" @close="closePopup" />
  </div>
</template>

<style scoped>
/* 1. 캘린더 전체 */
.calendar-wrapper {
  max-width: 860px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

/* 2. 캘린더 테이블 */
.calendar-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

/* 3. 요일 헤더 */
.day-header {
  color: #267c49;
  font-weight: bold;
  padding: 0.75rem;
  font-size: 1rem;
}

/* 4. 캘린더 날짜 셀 */
.calendar-cell {
  height: 100px;
  padding: 0.5rem;
  vertical-align: top;
  text-align: left;
  background-color: white;
  cursor: pointer;
}

.calendar-cell > div {
  padding-left: 0.2rem;
}

/* 5. 수입 텍스트 */
.text-income {
  color: #267caa;
  font-size: 0.85rem;
}

/* 6. 지출 텍스트 */
.text-expense {
  color: #d9534f;
  font-size: 0.85rem;
}

/* 7. 오늘 날짜 하이라이트 */
.today_highlight {
  background-color: rgba(153, 188, 133, 0.5);
  border-radius: 12px;
}
</style>
