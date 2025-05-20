<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {
  CATEGORY_MAP,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/constants/categories'

//#region 폼 제출 유효성 검사
/**
 * 금액이 0 이하면 제출 버튼이 disabled 됨
 * 모든 항목에 대해 하나라도 선택되지 않으면 제출 버튼 disabled
 *
 */
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
//#endregion

const API_URL = 'http://localhost:3000/transactions'
const route = useRoute()
const router = useRouter()
const transactionId = route.params.id // URL에서 id 받아오기
console.log('받은 transactionId:', transactionId)

const formData = ref({
  date: '',
  type: '', // 거래 타입(income/expense) 추가
  amount: '',
  category: '',
  payment: '',
  memo: '',
})

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

// 거래 데이터 불러오기
onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/${transactionId}`)
    formData.value = res.data
    console.log('거래 데이터 불러옴:', res.data)
  } catch (err) {
    console.error('거래 데이터 불러오기 실패:', err)
  }
})

// 수정 요청 보내기
async function handleUpdate() {
  try {
    await axios.put(`${API_URL}/${transactionId}`, formData.value)
    alert('수정 완료!')
    if (route.query.from === 'calendar') {
      router.push({ name: 'Transaction', query: { tab: 'calendar' } }) // 수정 후 캘린더로 복귀
    } else {
      router.push({ name: 'Transaction' }) // 수정 후 거래내역으로 복귀
    }
  } catch (err) {
    alert('수정 요청 실패')
    console.error('수정 오류:', err)
  }
}

// 모달 닫기 (또는 수정 취소)

function closeModal() {
  if (route.query.from === 'calendar') {
    router.push({ name: 'Transaction', query: { tab: 'calendar' } }) // 캘린더로 복귀
  } else {
    router.push({ name: 'Transaction' }) // 거래내역으로 복귀
  }
}
</script>

<template>
  <div class="edit-overlay" @click.self="closeModal">
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
          <button type="button" class="editCancel" @click="closeModal">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
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
  font-family: var(--font-family-main);
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
