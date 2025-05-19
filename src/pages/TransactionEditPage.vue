<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
// 카테고리 상수
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
// 금액이 0 이하일 경우 에러 메시지를 반환(computed)
const amountError = computed(() => {
  const amount = Number(formData.value.amount)
  return amount <= 0 ? '금액은 0원보다 커야 합니다' : ''
})

// 모든 입력 항목의 유효성을 검사하여, 제출 버튼 활성화 여부를 결정(computed)
const isFormValid = computed(() => {
  const amount = Number(formData.value.amount) // 금액 입력값
  const category = formData.value.category // 카테고리 선택값
  const type = formData.value.type // 거래 유형 (income 또는 expense)
  const date = formData.value.date // 날짜 입력값
  const payment = formData.value.paymentMethod // 결제 수단 (지출일 경우만 해당)

  // 각각의 필드가 유효한지 여부 판단
  const isAmountValid = amount > 0 // 금액이 0보다 커야 함
  const isCategoryValid = category !== '' // 카테고리가 선택되어 있어야 함
  const isDateValid = date !== '' // 날짜가 선택되어 있어야 함
  const isTypeValid = type === 'income' || type === 'expense' // 거래 유형이 올바른 값이어야 함
  const isPaymentValid = type === 'expense' ? payment !== '' : true // 지출일 경우 결제 수단 필수, 수입이면 생략 가능

  // 모든 조건을 만족해야 true 반환 -> submit 버튼 활성화됨
  return (
    isAmountValid &&
    isCategoryValid &&
    isDateValid &&
    isTypeValid &&
    isPaymentValid
  )
})
//#endregion

// API 엔드포인트 설정
const API_URL = 'http://localhost:3000/transactions'

// 라우터 사용
const route = useRoute()
const router = useRouter()

// URL에서 id 받아오기
const transactionId = route.params.id
console.log('받은 transactionId:', transactionId)

// 수정할 거래 데이터를 담는 객체
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

// 수정 완료 시 API로 PUT 요청 전송
async function handleUpdate() {
  try {
    await axios.put(`${API_URL}/${transactionId}`, formData.value)
    alert('수정 완료!')
    // 쿼리에서 from=calendar 여부에 따라 되돌아갈 탭 결정
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

// 모달 닫기 또는 수정 취소 시 원래 탭으로 되돌아감
function closeModal() {
  if (route.query.from === 'calendar') {
    router.push({ name: 'Transaction', query: { tab: 'calendar' } }) // 캘린더로 복귀
  } else {
    router.push({ name: 'Transaction' }) // 거래내역으로 복귀
  }
}
</script>

<template>
  <!-- 배경 클릭 시 모달 닫힘 -->
  <div class="edit-overlay" @click.self="closeModal">
    <div class="edit-container">
      <h2>거래 수정</h2>
      <!-- 거래 수정 폼 -->
      <form @submit.prevent="handleUpdate">
        <!-- 수정할 거래 데이터 입력 (예시로 날짜, 금액, 메모) -->
        <!-- 날짜 입력 -->
        <label for="editDate">날짜</label>
        <input type="date" v-model="formData.date" id="editDate" />
        <!-- 금액 입력 -->
        <label for="editAmount">금액</label>
        <input
          type="number"
          v-model="formData.amount"
          placeholder="금액"
          id="editAmount"
        />
        <!-- 금액 에러 메시지 -->
        <p
          v-if="amountError"
          style="color: red; font-size: 0.875rem; margin: 0 0 3px"
        >
          {{ amountError }}
        </p>
        <!-- 카테고리 선택 -->
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

        <!-- 메모 입력 -->
        <label for="editMemo">메모</label>
        <input
          type="text"
          v-model="formData.memo"
          placeholder="메모"
          id="editMemo"
        />

        <!-- 버튼 그룹(수정, 취소) -->
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
/* 모달 배경(오버레이) */
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

/* 모달 컨테이너 */
.edit-container {
  width: 550px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: var(--font-family-main);
  position: relative;
}

/* 모달 제목 */
.edit-container h2 {
  margin-bottom: 16px;
  text-align: center;
}

/* 수정 폼 레이아웃 */
.edit-container form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 결제 수단 블록 */
.payment_block {
  gap: 10px;
}

/* 인풋/셀렉트 공통 스타일 */
.edit-container form > input,
.edit-container form > select,
.payment_block > select {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

/* 날짜 입력에 포인터 표시 */
#editDate {
  cursor: pointer;
}

/* 하단 버튼 그룹 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

/* 버튼 공통 스타일 */
.editSubmit,
.editCancel {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

/* 수정 버튼 */
.editSubmit {
  background-color: #a3c39c;
  color: #fff;
  margin-right: 10px;
}

/* 취소 버튼 */
.editCancel {
  background-color: #ddd;
  color: #333;
}
</style>
