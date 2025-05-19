<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
// 카테고리 상수
import {
  CATEGORY_MAP,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/constants/categories'

// props로 transaction ID 받기
const props = defineProps({
  transactionId: {
    type: String,
    required: true,
  },
})

// 모달 닫기 및 수정 완료 이벤트 emit 정의
const emit = defineEmits(['close', 'updated'])

//#region 폼 제출 유효성 검사
/**
 * 금액이 0 이하면 제출 버튼이 disabled 됨
 * 모든 항목에 대해 하나라도 선택되지 않으면 제출 버튼 disabled
 */
const amountError = computed(() => {
  // 아직 데이터 로딩 중이면 에러 표시하지 않음
  if (isLoading.value) {
    return ''
  }

  const amount = Number(formData.value.amount)
  return amount <= 0 ? '금액은 0원보다 커야 합니다' : ''
})

/*모든 필드가 올바르게 입력되었는지 확인, 유효하면 수정 완료 버튼 활성화됨 */
const isFormValid = computed(() => {
  const amount = Number(formData.value.amount) // 금액 입력값
  const category = formData.value.category // 카테고리 선택값
  const type = formData.value.type // 거래 유형 (income 또는 expense)
  const date = formData.value.date // 날짜 입력값
  const payment = formData.value.paymentMethod // 결제 수단 (지출일 경우만 해당)

  const isAmountValid = amount > 0 // 금액이 0보다 커야 함
  const isCategoryValid = category !== '' // 카테고리가 선택되어 있어야 함
  const isDateValid = date !== '' // 날짜가 선택되어 있어야 함
  const isTypeValid = type === 'income' || type === 'expense' // 거래 유형이 올바른 값이어야 함
  const isPaymentValid = type === 'expense' ? payment !== '' : true // 지출일 경우 결제 수단 필수, 수입이면 생략 가능

  // 모든 조건을 만족해야 true 반환 → submit 버튼 활성화됨
  return (
    isAmountValid &&
    isCategoryValid &&
    isDateValid &&
    isTypeValid &&
    isPaymentValid
  )
})
//#endregion

// 거래 API 엔드포인트
const API_URL = 'http://localhost:3000/transactions'

// 데이터 로딩 상태 표시용
const isLoading = ref(true)

// 거래 수정 폼 데이터
const formData = ref({
  date: '',
  type: '', // 거래 타입(income/expense) 추가
  amount: '',
  category: '',
  paymentMethod: '',
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

// 컴포넌트 마운트 시 거래 데이터를 불러와 formData에 채움
onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/${props.transactionId}`)
    formData.value = res.data
    console.log('거래 데이터 불러옴:', res.data)
  } catch (err) {
    console.error('거래 데이터 불러오기 실패:', err)
  } finally {
    isLoading.value = false
  }
})

// 수정 요청 보내기
async function handleUpdate() {
  try {
    await axios.put(`${API_URL}/${props.transactionId}`, formData.value)
    alert('수정 완료!')
    emit('updated') // 거래 내역이 업데이트됨을 알림
    emit('close') // 모달 닫기
  } catch (err) {
    alert('수정 요청 실패')
    console.error('수정 오류:', err)
  }
}

// 모달 닫기
function closeModal() {
  emit('close')
}
</script>

<template>
  <div class="edit-overlay" @click.self="closeModal">
    <div class="edit-container">
      <h2>거래 수정</h2>
      <form @submit.prevent="handleUpdate">
        <!-- 수정할 거래 데이터 입력 (예시로 날짜, 금액, 메모) -->
        <!-- 날짜 -->
        <label for="editDate">날짜</label>
        <input type="date" v-model="formData.date" id="editDate" />

        <!-- 금액 -->
        <label for="editAmount">금액</label>
        <input
          type="number"
          v-model="formData.amount"
          placeholder="금액"
          id="editAmount"
        />
        <!-- 금액 유효성 검사 메시지 -->
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

        <!-- 버튼 영역 -->
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
/* 모달 전체 배경(오버레이) */
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
  z-index: 9999;
}

/* 모달 박스 */
.edit-container {
  width: 550px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: var(--font-family-main);
  position: relative;
}

/* 제목 */
.edit-container h2 {
  margin-bottom: 16px;
  text-align: center;
}

/* 폼 요소 간 간격 설정 */
.edit-container form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 지출 결제수단 블록 간격 설정 */
.payment_block {
  gap: 10px;
}

/* 입력 및 셀렉트 공통 스타일 */
.edit-container form > input,
.edit-container form > select,
.payment_block > select {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

/* 날짜 필드에 포인터 표시 */
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

/* 수정 완료 버튼 */
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
