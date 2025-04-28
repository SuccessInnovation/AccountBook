<script setup>
import { ref, computed, onMounted, watch, defineEmits } from 'vue'
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {
  CATEGORY_MAP,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/constants/categories'

const router = useRouter()
const transactionStore = useTransactionStore()
const route = useRoute()
const API_URL = 'http://localhost:3000/transactions'

console.log('날짜:', route.query.date) // console.log(route.params.id)

// 페이지 로드 시 거래 내역 불러오기
onMounted(() => {
  transactionStore.fetchTransactions()
})

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

// 날짜 -> 요일로 바꾸는 함수
function getKoreanDayName(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', { weekday: 'long' })
}

// 삭제 아이콘 클릭 시 처리 (삭제 확인 후 삭제)
function handleDelete(id) {
  if (window.confirm('정말 삭제하시겠습니까?')) {
    transactionStore.deleteTransaction(id)
  }
}

// x버튼 (팝업 취소)
const emit = defineEmits(['close'])
function closeModal() {
  emit('close')
}

// 수정 모달 관련 상태
const showEditModal = ref(false)
const selectedTransactionId = ref(null)

// 수정 폼 데이터
const formData = ref({
  date: '',
  type: '',
  amount: '',
  category: '',
  paymentMethod: '',
  memo: '',
})

// 수정 아이콘 클릭 시 처리
async function handleEdit(transaction) {
  selectedTransactionId.value = transaction.id
  try {
    const res = await axios.get(`${API_URL}/${transaction.id}`)
    formData.value = res.data
    showEditModal.value = true
  } catch (err) {
    console.error('거래 데이터 불러오기 실패:', err)
  }
}

// 현재 거래 타입에 따라 표시할 카테고리 목록 계산
const categoriesList = computed(() => {
  if (formData.value.type === 'income') {
    return INCOME_CATEGORIES
  } else if (formData.value.type === 'expense') {
    return EXPENSE_CATEGORIES
  } else {
    return [] // 타입이 없는 경우 빈 배열 반환
  }
})

// 폼 제출 유효성 검사
const amountError = computed(() => {
  const amount = Number(formData.value.amount)
  return amount <= 0 ? '금액은 0원보다 커야 합니다' : ''
})

const isFormValid = computed(() => {
  const amount = Number(formData.value.amount)
  const category = formData.value.category
  const type = formData.value.type
  const date = formData.value.date
  const payment = formData.value.paymentMethod

  const isAmountValid = amount > 0
  const isCategoryValid = category !== ''
  const isDateValid = date !== ''
  const isTypeValid = type === 'income' || type === 'expense'
  const isPaymentValid = type === 'expense' ? payment !== '' : true

  return (
    isAmountValid &&
    isCategoryValid &&
    isDateValid &&
    isTypeValid &&
    isPaymentValid
  )
})

// 수정 요청 보내기
async function handleUpdate() {
  try {
    await axios.put(`${API_URL}/${selectedTransactionId.value}`, formData.value)
    alert('수정 완료!')
    // 수정 후 거래 내역 다시 불러오기
    transactionStore.fetchTransactions()
    // 모달 닫기
    closeEditModal()
  } catch (err) {
    alert('수정 요청 실패')
    console.error('수정 오류:', err)
  }
}

// 수정 모달 닫기
function closeEditModal() {
  showEditModal.value = false
  selectedTransactionId.value = null
}
</script>

<template>
  <div v-if="!showEditModal" class="popupOverlay p-4 border rounded shadow" @click.self="closeModal">
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

  <!-- 수정 모달 -->
  <div v-if="showEditModal" class="popupOverlay" @click.self="closeEditModal">
    <div class="edit-container">
      <h2>거래 수정</h2>
      <form @submit.prevent="handleUpdate">
        <!-- 수정할 거래 데이터 입력 (예시로 날짜, 금액, 메모) -->
        <label for="editDate">날짜</label>
        <input type="date" v-model="formData.date" id="editDate" />
        <label for="editAmount">금액</label>
        <input
          type="number"
          v-model="formData.amount"
          placeholder="금액"
          id="editAmount"
        />
        <p
          v-if="amountError"
          style="color: red; font-size: 0.875rem; margin: 0 0 3px"
        >
          {{ amountError }}
        </p>
        <label for="editCategory">카테고리</label>
        <select v-model="formData.category" id="editCategory" required>
          <option value="" disabled>카테고리 선택</option>
          <option
            v-for="(label, key) in categoriesList"
            :key="key"
            :value="label"
          >
            {{ CATEGORY_MAP[label] }}
          </option>
        </select>
        <!-- 지출인 경우에만 결제 수단 표시 -->
        <div
          class="payment_block"
          v-if="formData.type === 'expense'"
          style="display: flex; flex-direction: column"
        >
          <label for="editPayment">결제 수단</label>
          <select v-model="formData.paymentMethod" id="editPayment" required>
            <option value="" disabled>결제 수단 선택</option>
            <option value="card">카드</option>
            <option value="cash">현금</option>
          </select>
        </div>
        <label for="editMemo">메모</label>
        <input
          type="text"
          v-model="formData.memo"
          placeholder="메모"
          id="editMemo"
        />

        <div class="button-group">
          <button type="submit" class="editSubmit" :disabled="!isFormValid">
            수정 완료
          </button>
          <button type="button" class="editCancel" @click="closeEditModal">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

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

/* 수정 모달 스타일 */
.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.edit-container {
  width: 550px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: sans-serif;
  position: relative;
}

.edit-container h2 {
  margin-bottom: 16px;
  text-align: center;
}
.edit-container form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.payment_block {
  gap: 10px;
}

.edit-container form > input,
.edit-container form > select,
.payment_block > select {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

#editDate {
  cursor: pointer;
}

/* 하단 버튼 그룹 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.editSubmit,
.editCancel {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.editSubmit {
  background-color: #a3c39c;
  color: #fff;
  margin-right: 10px;
}

.editCancel {
  background-color: #ddd;
  color: #333;
}
</style>
