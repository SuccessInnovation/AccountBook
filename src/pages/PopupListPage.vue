<script setup>
import { ref, computed, onMounted, watch, defineEmits } from 'vue'
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

const transactionStore = useTransactionStore()
const route = useRoute()

console.log('날짜:', route.query.date) // console.log(route.params.id)
//달력 showCalendar, openCalendar
// const showCalendar = ref(false)

// const openCalendar = () => {
//   showCalendar.value = true
// }

// 페이지 로드 시 거래 내역 불러오기
onMounted(() => {
  transactionStore.fetchTransactions()
})

// 필터 상태: 수입/지출 (기본: 모두 체크)
// const showIncome = ref(true)
// const showExpense = ref(true)

// 필터링된 거래 내역 목록 (수입/지출 체크 상태에 따라)
// const filteredTransactions = computed(() => {
//   return transactionStore.transactions.filter(record => {
//     if (record.type === 'income' && showIncome.value) return true
//     if (record.type === 'expense' && showExpense.value) return true
//     return false
//   })
// })

const selectedDate = ref(route.query.date || '')
console.log('선택요일:', selectedDate.value)
onMounted(() => {
  transactionStore.fetchTransactions()
})

// 날짜 기준으로 필터링
const filteredByDate = computed(() => {
  return transactionStore.transactions.filter(
    t => t.date === selectedDate.value,
  )
})
watch(
  () => route.query.date,
  newVal => {
    selectedDate.value = newVal
  },
)
console.log('선택된 날짜:', selectedDate.value)
console.log('전체 거래 내역:', transactionStore.transactions)
console.log('필터된 결과:', filteredByDate.value)

// 금액 포맷 함수:
// - value를 숫자로 변환하고,
// - 거래 유형에 따라 '수입'은 '+' 기호, '지출'은 '-' 기호 추가
function formatAmount(value, type) {
  const num = parseFloat(value)
  if (isNaN(num)) return value
  const formatted = num.toLocaleString()
  return type === 'income'
    ? `+${formatted}`
    : type === 'expense'
      ? `-${formatted}`
      : formatted
}

// 혁신님이 주시면 갈아끼우기(handleEdit, handleDelete)
// 수정 아이콘 클릭 시 처리 (수정 페이지로 이동)
function handleEdit(record) {
  const fromCalendar = route.query.date !== undefined
  // 👉 현재 route.query에 date가 있으면 CalendarContentPage에서 온 거라고 판단

  if (fromCalendar) {
    router.push({
      name: 'TransactionEdit',
      params: { id: record.id },
      query: { from: 'calendar' },
    })
  } else {
    router.push({
      name: 'TransactionEdit',
      params: { id: record.id },
      // 다른 경우에는 query 안 넘김
    })
  }
}

// 삭제 아이콘 클릭 시 처리 (삭제 확인 후 삭제)
function handleDelete(id) {
  if (window.confirm('정말 삭제하시겠습니까?')) {
    transactionStore.deleteTransaction(id)
  }
}
// 날짜 -> 요일로 바꾸는 함수
function getKoreanDayName(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', { weekday: 'long' })
}

// x버튼 (팝업 취소)
const emit = defineEmits(['close'])
function closeModal() {
  emit('close')
}
</script>

<template>
  <div class="popupOverlay p-4 border rounded shadow" @click.self="closeModal">
    <!-- 목록/달력 토글 & 검색/필터 영역 -->
    <!-- 테이블 영역 -->
    <div class="popupContainer">
      <div class="topDate">
        {{ selectedDate }}
        {{ getKoreanDayName(selectedDate) }}
      </div>
      <button class="closeBtn" @click="closeModal">✕</button>

      <!-- 거래내역이 없을 경우 메시지 출력 -->
      <div v-if="filteredByDate.length === 0" id="emptyTransaction">
        표시할 내역이 없습니다.
      </div>

      <!-- 거래내역이 있을 경우 거래내역 출력 -->
      <div v-else class="scrollable-table">
        <table class="ledger-table table">
          <thead>
            <tr>
              <!-- 선택삭제용 체크박스 열 -->
              <!-- 아직 구현 X -->
              <th style="width: 40px"><input type="checkbox" /></th>
              <th style="width: 120px">날짜</th>
              <th style="width: 120px">카테고리</th>
              <th>내용</th>
              <th style="width: 120px">금액</th>
              <th style="width: 60px">수정</th>
              <th style="width: 60px">삭제</th>
            </tr>
          </thead>
          <tbody>
            <!-- 필터 상태에 따라 페이징된 거래 목록 렌더링 -->
            <tr v-for="record in filteredByDate" :key="record.id">
              <!-- 선택삭제 체크박스 -->
              <td>
                <input
                  type="checkbox"
                  v-model="record.selected"
                  style="width: 16px; height: 16px"
                />
              </td>
              <td>{{ record.date }}</td>
              <td>{{ record.category }}</td>
              <td>{{ record.memo }}</td>
              <!--  description에서 memo로 변경 -->
              <td>{{ formatAmount(record.amount, record.type) }}</td>
              <!-- 수정 아이콘 -->
              <td>
                <i
                  class="icon-edit"
                  @click="handleEdit(record)"
                  style="cursor: pointer"
                  >✏️</i
                >
              </td>
              <!-- 삭제 아이콘 -->
              <td>
                <i
                  class="icon-delete"
                  @click="handleDelete(record.id)"
                  style="cursor: pointer"
                  >🗑️</i
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="closepopuplist" @click="closepopuplist" />
    </div>
  </div>
</template>

/* 혁신님 팝업 페이지 스타일 */
<style scoped>
.popupOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* 배경 딤 처리 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 다른 컴포넌트 위에 표시 */
}

.popupContainer {
  width: 60rem;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: sans-serif;
  position: relative;
}
.topDate {
  text-align: center;
}
.closeBtn {
  position: absolute;
  right: 40px;
  top: 24px;
  cursor: pointer;
  font-size: 24px;
  /* margin-left: 200px; */
}

/* 전체 컨테이너 */
.ledger-container {
  width: 100%;
  max-width: 1200px;
  max-height: 20rem;
  overflow-y: auto;
  margin: 0 auto;
  font-family: sans-serif;
  background-color: #fff;
}

/* 상단 연/월 네비게이션 */
.ledger-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 40px;
  background-color: #fff;
}
.month-nav {
  font-size: 1.1rem;
  color: #888;
  cursor: pointer;
}
.current-month {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.current-month .year {
  font-size: 1rem;
  color: #999;
}
.current-month .month {
  font-size: 1.4rem;
  font-weight: bold;
  margin-top: 2px;
}

/* 중간의 '목록/달력/카테고리/검색/수입/지출' 섹션 */
.ledger-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #a3c39c;
  padding: 10px 20px;
  color: #fff;
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav-btn {
  background: none;
  border: none;
  color: #fff;
  font-weight: bold;
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.nav-btn.active,
.nav-btn:hover {
  background-color: #8eb58d;
}
.category-select {
  background-color: #fff;
  color: #333;
  border: none;
  padding: 8px;
  border-radius: 4px;
}
.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.search-input {
  width: 300px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  outline: none;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.income-checkbox,
.expense-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* 테이블 영역 */
.scrollable-table {
  max-height: 300px;
  overflow-y: auto;
}

.ledger-table-section {
  padding: 20px;
  background-color: #f8f8f8;
}
.ledger-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 3rem;
}
.ledger-table thead {
  background-color: #e2e2e2;
}
.ledger-table th,
.ledger-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
.ledger-table th {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}
.ledger-table td {
  font-size: 0.88rem;
  color: #555;
}
.ledger-table td i {
  cursor: pointer;
}

/* 페이징 컨트롤 */
.pagination-controls button {
  padding: 6px 12px;
  margin: 0 6px;
  border: none;
  background-color: #a3c39c;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 하단 '추가' 버튼 영역 */
.add-button-area {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
}
.add-button {
  background-color: #a3c39c;
  color: #fff;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.add-button:hover {
  background-color: #8eb58d;
}
.closepopuplist {
  background-color: var(--point-1-color);
  color: white;
}
</style>
