<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// 카테고리 상수
import {
  CATEGORY_MAP,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/constants/categories'
import { useTransactionStore } from '@/stores/TransactionStore'

// API 주소 및 store
const api_url = 'http://localhost:3000/transactions'
const transaction_store = useTransactionStore()
const records = ref([])

// 거래 목록 불러오기
async function getRecords() {
  try {
    const response = await axios.get(api_url)
    records.value = response.data
  } catch (error) {
    console.error('데이터 로딩 오류:', error)
  }
}

// 거래 데이터 로딩
onMounted(() => {
  getRecords()
})

// 모달을 닫기 위한 emit 함수
const emit = defineEmits(['close'])
function closeModal() {
  emit('close')
}

// 현재 선택된 거래 유형: 수입/지출
const transaction_type = ref('expenses')

// 폼 입력값 바인딩을 위한 객체
const form_data = ref({
  date: '',
  amount: '',
  category: '',
  payment: '',
  memo: '',
})

// 필수 입력값 오류 메시지 저장 객체
const errors = ref({
  date: '',
  amount: '',
  category: '',
  payment: '',
})

// 필수 항목 확인 함수
function checkRequired(field) {
  if (!form_data.value[field]) {
    errors.value[field] = '필수 항목입니다'
  } else {
    errors.value[field] = ''
  }
}

// 금액 입력값 유효성 검사
function checkAmount() {
  if (!form_data.value.amount) {
    errors.value.amount = '필수 항목입니다'
  } else {
    const num = parseFloat(form_data.value.amount)
    if (isNaN(num)) {
      errors.value.amount = '숫자만 입력해주세요'
    } else {
      errors.value.amount = ''
    }
  }
}

// 0원 이하 입력 방지(computed)
const amount_error = computed(() => {
  if (form_data.value.amount === '') return ''
  const num = Number(form_data.value.amount)
  return num <= 0 ? '금액은 0원보다 커야 합니다' : ''
})

// 폼 제출 함수
async function handleSubmit() {
  // 필수 항목 및 유효성 검사 실행
  checkRequired('date')
  checkAmount()
  checkRequired('category')

  // 지출이면 결제수단도 체크
  if (transaction_type.value === 'expenses') {
    checkRequired('payment')
  }

  // 오류가 하나라도 있으면 제출 중단
  if (
    errors.value.date ||
    errors.value.amount ||
    errors.value.category ||
    errors.value.payment
  ) {
    return
  }

  // 데이터 포맷 구성
  const data_to_send = {
    id: String(Date.now()),
    date: form_data.value.date,
    type: transaction_type.value === 'expenses' ? 'expense' : 'income',
    category: form_data.value.category,
    paymentMethod:
      transaction_type.value === 'expenses' ? form_data.value.payment : '',
    amount: parseFloat(form_data.value.amount),
    memo: form_data.value.memo,
    createdAt: new Date().toISOString(),
  }

  // POST 요청으로 거래 추가
  try {
    await axios.post(api_url, data_to_send)
    alert('새 항목이 추가되었습니다!')
    // 전역 상태 동기화
    await transaction_store.fetchTransactions()
    // 모달 닫기
    closeModal()
    // 폼 초기화
    form_data.value = {
      date: '',
      amount: '',
      category: '',
      payment: '',
      memo: '',
    }
    transaction_type.value = 'expenses'
  } catch (error) {
    console.error('거래 추가 오류:', error)
    alert('등록 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <!-- 배경 클릭 시 모달 닫힘 -->
  <div class="popup_overlay" @click.self="closeModal">
    <div class="popup_container">
      <h1 style="text-align: center; margin-bottom: 16px">내역 추가</h1>
      <button class="close_btn" @click="closeModal">✕</button>

      <!-- 지출/수입 탭 -->
      <div class="tab_area">
        <button
          class="tab_button"
          @click.prevent="transaction_type = 'expenses'"
          :style="{
            backgroundColor:
              transaction_type === 'expenses' ? '#47a447' : '#aedda9',
            color: 'white',
          }"
        >
          지출
        </button>
        <button
          class="tab_button"
          @click.prevent="transaction_type = 'income'"
          :style="{
            backgroundColor:
              transaction_type === 'income' ? '#47a447' : '#aedda9',
            color: 'white',
          }"
        >
          수입
        </button>
      </div>

      <!-- 입력 폼 -->
      <form novalidate @submit.prevent="handleSubmit" class="form_area">
        <!-- 날짜 입력 -->
        <div>
          <input
            type="date"
            v-model="form_data.date"
            @blur="checkRequired('date')"
            class="input_box"
            required
          />
          <div v-if="errors.date" class="error_text">{{ errors.date }}</div>
        </div>

        <!-- 금액 입력 -->
        <div>
          <input
            type="text"
            placeholder="금액"
            v-model="form_data.amount"
            @blur="checkAmount"
            class="input_box"
            required
          />
          <div v-if="errors.amount" class="error_text">{{ errors.amount }}</div>
          <div v-else-if="amount_error" class="error_text">
            {{ amount_error }}
          </div>
        </div>

        <!-- 거래 종류 선택 (지출 or 수입) -->
        <!-- 거래: 지출 -->
        <div v-if="transaction_type === 'expenses'">
          <select
            v-model="form_data.category"
            @blur="checkRequired('category')"
            class="input_box"
            required
          >
            <option value="">카테고리</option>
            <option
              v-for="(label, key) in EXPENSE_CATEGORIES"
              :key="key"
              :value="label"
            >
              {{ CATEGORY_MAP[label] }}
            </option>
          </select>
          <div v-if="errors.category" class="error_text">
            {{ errors.category }}
          </div>
        </div>

        <!-- 거래: 수입 -->
        <div v-else>
          <select
            v-model="form_data.category"
            @blur="checkRequired('category')"
            class="input_box"
            required
          >
            <option value="">카테고리</option>
            <option
              v-for="(label, key) in INCOME_CATEGORIES"
              :key="key"
              :value="label"
            >
              {{ CATEGORY_MAP[label] }}
            </option>
          </select>
          <div v-if="errors.category" class="error_text">
            {{ errors.category }}
          </div>
        </div>

        <!-- 결제수단 (지출일 경우만) -->
        <div v-if="transaction_type === 'expenses'">
          <select
            v-model="form_data.payment"
            @blur="checkRequired('payment')"
            class="input_box"
            required
          >
            <option value="">결제 수단</option>
            <option value="card">카드</option>
            <option value="cash">현금</option>
          </select>
          <div v-if="errors.payment" class="error_text">
            {{ errors.payment }}
          </div>
        </div>

        <!-- 메모 -->
        <div>
          <textarea
            placeholder="메모"
            v-model="form_data.memo"
            class="textarea_box"
          ></textarea>
        </div>

        <!-- 제출 버튼 -->
        <button
          type="submit"
          class="submit_button"
          :disabled="amount_error !== ''"
        >
          추가 +
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 팝업 모달 전체 배경 */
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
  z-index: 999;
}

/* 팝업 모달 컨테이너 */
.popup_container {
  width: 350px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: var(--font-family-main);
  position: relative;
}

/* 닫기 버튼 */
.close_btn {
  position: absolute;
  right: 24px;
  top: 24px;
  cursor: pointer;
  font-size: 24px;
}

/* 탭 버튼 영역 */
.tab_area {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* 탭 버튼 */
.tab_button {
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}

/* 폼 영역 (input, textarea)*/
.form_area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input_box {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
}

.textarea_box {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  height: 60px;
}

/* 오류 메시지 */
.error_text {
  color: red;
  font-size: 12px;
}

/* 제출 버튼 */
.submit_button {
  background-color: #47a447;
  color: white;
  padding: 12px 0;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 8px;
}
</style>
