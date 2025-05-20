<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import {
  CATEGORY_MAP,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/constants/categories'
import { useTransactionStore } from '@/stores/TransactionStore'

const api_url = 'http://localhost:3000/transactions'
const transaction_store = useTransactionStore()
const records = ref([])

async function getRecords() {
  try {
    const response = await axios.get(api_url)
    records.value = response.data
  } catch (error) {
    console.error('데이터 로딩 오류:', error)
  }
}

onMounted(() => {
  getRecords()
})

const emit = defineEmits(['close'])
function closeModal() {
  emit('close')
}

const transaction_type = ref('expenses')

const form_data = ref({
  date: '',
  amount: '',
  category: '',
  payment: '',
  memo: '',
})

const errors = ref({
  date: '',
  amount: '',
  category: '',
  payment: '',
})

function checkRequired(field) {
  if (!form_data.value[field]) {
    errors.value[field] = '필수 항목입니다'
  } else {
    errors.value[field] = ''
  }
}

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

const amount_error = computed(() => {
  if (form_data.value.amount === '') return ''
  const num = Number(form_data.value.amount)
  return num <= 0 ? '금액은 0원보다 커야 합니다' : ''
})

async function handleSubmit() {
  checkRequired('date')
  checkAmount()
  checkRequired('category')
  if (transaction_type.value === 'expenses') {
    checkRequired('payment')
  }

  if (
    errors.value.date ||
    errors.value.amount ||
    errors.value.category ||
    errors.value.payment
  ) {
    return
  }

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

  try {
    await axios.post(api_url, data_to_send)
    alert('새 항목이 추가되었습니다!')
    await transaction_store.fetchTransactions()
    closeModal()
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
  <div class="popup_overlay" @click.self="closeModal">
    <div class="popup_container">
      <h1 style="text-align: center; margin-bottom: 16px">내역 추가</h1>
      <button class="close_btn" @click="closeModal">✕</button>

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

      <form novalidate @submit.prevent="handleSubmit" class="form_area">
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

        <div>
          <textarea
            placeholder="메모"
            v-model="form_data.memo"
            class="textarea_box"
          ></textarea>
        </div>

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

.popup_container {
  width: 350px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: var(--font-family-main);
  position: relative;
}

.close_btn {
  position: absolute;
  right: 24px;
  top: 24px;
  cursor: pointer;
  font-size: 24px;
}

.tab_area {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tab_button {
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}

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

.error_text {
  color: red;
  font-size: 12px;
}

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
