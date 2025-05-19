<script setup>
// 거래 내역 관련 스토어 & 라우터
import { ref, computed, onMounted, watch, defineEmits } from 'vue'
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRoute } from 'vue-router'
import axios from 'axios'
import {
  CATEGORY_MAP,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/constants/categories'

const transaction_store = useTransactionStore()
const route = useRoute()
const api_url = 'http://localhost:3000/transactions'

// 선택된 날짜와 모달 관련 상태 관리
const selected_date = ref(route.query.date || '')
const show_edit_modal = ref(false)
const selected_transaction_id = ref(null)

// 수정 폼 데이터
const form_data = ref({
  date: '',
  type: '',
  amount: '',
  category: '',
  payment_method: '',
  memo: '',
})

// 모달 닫기
const emit = defineEmits(['close'])

// 거래 데이터 초기 로딩
onMounted(() => {
  transaction_store.fetchTransactions()
})

// 날짜 쿼리 변경 감지하여 selected_date에 반영
watch(
  () => route.query.date,
  new_val => {
    selected_date.value = new_val
  },
)

// 선택된 날짜에 해당하는 거래 필터링
const filtered_by_date = computed(() => {
  return transaction_store.transactions.filter(
    t => t.date === selected_date.value,
  )
})

// 수입/지출 유형에 따라 카테고리 목록 필터링
const categories_list = computed(() => {
  if (form_data.value.type === 'income') {
    return INCOME_CATEGORIES
  } else if (form_data.value.type === 'expense') {
    return EXPENSE_CATEGORIES
  } else {
    return []
  }
})

const amount_error = computed(() => {
  const amount = Number(form_data.value.amount)
  return amount <= 0 ? '금액은 0원보다 커야 합니다' : ''
})

// 전체 폼 유효성 검사(금액, 카테고리, 수입/지출, 날짜, 결제수단)
const is_form_valid = computed(() => {
  const amount = Number(form_data.value.amount)
  const category = form_data.value.category
  const type = form_data.value.type
  const date = form_data.value.date
  const payment = form_data.value.payment_method

  const is_amount_valid = amount > 0
  const is_category_valid = category !== ''
  const is_date_valid = date !== ''
  const is_type_valid = type === 'income' || type === 'expense'
  const is_payment_valid = type === 'expense' ? payment !== '' : true

  return (
    is_amount_valid &&
    is_category_valid &&
    is_date_valid &&
    is_type_valid &&
    is_payment_valid
  )
})

// 금액 포맷 함수(소득은 +, 지출은 -)
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

// 요일 출력함수(e.g. 월요일)
function getKoreanDayName(date_str) {
  const date = new Date(date_str)
  return date.toLocaleDateString('ko-KR', { weekday: 'long' })
}

// 거래 삭제
function handleDelete(id) {
  if (window.confirm('정말 삭제하시겠습니까?')) {
    transaction_store.deleteTransaction(id)
  }
}

// 모달 닫기
function closeModal() {
  emit('close')
}

// 거래 수정 요청 - 폼에 데이터 채우기
async function handleEdit(transaction) {
  selected_transaction_id.value = transaction.id
  try {
    const res = await axios.get(`${api_url}/${transaction.id}`)
    form_data.value = res.data
    show_edit_modal.value = true
  } catch (err) {
    console.error('거래 데이터 불러오기 실패:', err)
  }
}

// 수정 완료 요청
async function handleUpdate() {
  try {
    await axios.put(
      `${api_url}/${selected_transaction_id.value}`,
      form_data.value,
    )
    alert('수정 완료!')
    transaction_store.fetchTransactions()
    closeEditModal()
  } catch (err) {
    alert('수정 요청 실패')
    console.error('수정 오류:', err)
  }
}

// 수정 모달 닫기
function closeEditModal() {
  show_edit_modal.value = false
  selected_transaction_id.value = null
}
</script>

<template>
  <!-- 수정 모드가 아닐 때 표시되는 거래 목록 팝업 -->
  <div
    v-if="!show_edit_modal"
    class="popup_overlay p-4 border rounded shadow"
    @click.self="closeModal"
  >
    <div class="popup_container">
      <div class="top_date mt-3">
        <b>
          {{ selected_date }}
          {{ getKoreanDayName(selected_date) }}
        </b>
      </div>
      <button class="close_btn mt-0" @click="closeModal">✕</button>

      <!-- 거래 내역 없을 경우 -->
      <div
        v-if="filtered_by_date.length === 0"
        id="empty_transaction"
        style="text-align: center"
        class="mt-5"
      >
        표시할 내역이 없습니다.
      </div>

      <!-- 거래 내역이 있을 경우 테이블 렌더링 -->
      <div
        v-else
        class="table-responsive rounded shadow-sm bg-white px-3 w-100"
        style="max-height: 400px; overflow-y: auto"
      >
        <table class="table table-hover mt-5 mb-0 text-center align-middle">
          <!-- 테이블 헤더 -->
          <thead class="table-light">
            <tr>
              <th scope="col" style="width: 160px">날짜</th>
              <th scope="col" style="width: 150px">카테고리</th>
              <th scope="col" style="width: auto">메모</th>
              <th scope="col" style="width: 150px">금액</th>
              <th scope="col" style="width: 60px">수정</th>
              <th scope="col" style="width: 60px">삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filtered_by_date" :key="record.id">
              <td>{{ record.date }}</td>
              <td>{{ CATEGORY_MAP[record.category] || record.category }}</td>
              <td>{{ record.memo }}</td>
              <td>{{ formatAmount(record.amount, record.type) }}</td>
              <td>
                <i
                  class="text-success d-block mx-auto icon-hover"
                  @click="handleEdit(record)"
                  style="cursor: pointer"
                  >✏️</i
                >
              </td>
              <td>
                <i
                  class="text-danger d-block mx-auto icon-hover"
                  @click="handleDelete(record.id)"
                  style="cursor: pointer"
                  >🗑️</i
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button class="close_popup_list" />
    </div>
  </div>

  <!-- 수정 모드일 때 표시되는 거래 수정 폼 -->
  <div
    v-if="show_edit_modal"
    class="popup_overlay"
    @click.self="closeEditModal"
  >
    <div class="edit_container">
      <h2>거래 수정</h2>
      <form @submit.prevent="handleUpdate">
        <label for="edit_date">날짜</label>
        <input type="date" v-model="form_data.date" id="edit_date" />

        <label for="edit_amount">금액</label>
        <input type="number" v-model="form_data.amount" id="edit_amount" />

        <p
          v-if="amount_error"
          style="color: red; font-size: 0.875rem; margin: 0 0 3px"
        >
          {{ amount_error }}
        </p>

        <label for="edit_category">카테고리</label>
        <select v-model="form_data.category" id="edit_category" required>
          <option value="" disabled>카테고리 선택</option>
          <option
            v-for="(label, key) in categories_list"
            :key="key"
            :value="label"
          >
            {{ CATEGORY_MAP[label] }}
          </option>
        </select>

        <div
          class="payment_block"
          v-if="form_data.type === 'expense'"
          style="display: flex; flex-direction: column"
        >
          <label for="edit_payment">결제 수단</label>
          <select v-model="form_data.payment_method" id="edit_payment" required>
            <option value="" disabled>결제 수단 선택</option>
            <option value="card">카드</option>
            <option value="cash">현금</option>
          </select>
        </div>

        <label for="edit_memo">메모</label>
        <input type="text" v-model="form_data.memo" id="edit_memo" />

        <div class="button_group">
          <button type="submit" class="edit_submit" :disabled="!is_form_valid">
            수정 완료
          </button>
          <button type="button" class="edit_cancel" @click="closeEditModal">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 팝업 전체(오버레이) */
.popup_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 거래 목록 팝업 컨테이너(테이블+내역) */
.popup_container {
  width: 60rem;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: var(--font-family-main);
  position: relative;
}

/* 날짜 텍스트 */
.top_date {
  text-align: center;
}

/* 팝업 닫기 버튼 */
.close_btn {
  position: absolute;
  right: 40px;
  top: 24px;
  cursor: pointer;
  font-size: 24px;
}

/* 거래 내역 테이블 스타일 */
.scrollable_table {
  max-height: 300px;
  overflow-y: auto;
}

.ledger_table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 3rem;
}

/* 테이블 헤더 배경 */
.ledger_table thead {
  background-color: #e2e2e2;
}

/* 테이블 셀 공통 스타일 */
.ledger_table th,
.ledger_table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

/* 헤더 텍스트 스타일 */
.ledger_table th {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}

.ledger_table td {
  font-size: 0.88rem;
  color: #555;
}

.ledger_table td i {
  cursor: pointer;
}

/* 리스트 닫기 버튼 */
.close_popup_list {
  background-color: var(--point-1-color);
  color: white;
}

/* 거래 수정 모달 컨테이너 */
.edit_container {
  width: 550px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: var(--font-family-main);
  position: relative;
}

/* 모달 제목 */
.edit_container h2 {
  margin-bottom: 16px;
  text-align: center;
}

/* 폼 전체 레이아웃 */
.edit_container form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 결제 수단 */
.payment_block {
  gap: 10px;
}

/* 폼 입력 필드 & 선택 박스 */
.edit_container form > input,
.edit_container form > select,
.payment_block > select {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}
/* 날짜 수정 칸 커서 포인터 */
#edit_date {
  cursor: pointer;
}

/* 수정/취소 버튼 영역*/
.button_group {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.edit_submit,
.edit_cancel {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.edit_submit {
  background-color: #a3c39c;
  color: #fff;
  margin-right: 10px;
}

.edit_cancel {
  background-color: #ddd;
  color: #333;
}

/* 수정/삭제 아이콘 hover 시 1.2 배확대 효과 */
.icon-hover:hover {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>
