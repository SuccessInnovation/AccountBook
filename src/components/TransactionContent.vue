<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { use_calendar_store } from '@/stores/MonthSelector'
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRouter } from 'vue-router'

import FilterCategory from '@/components/FilterCategory.vue'
import SearchByMemo from '@/components/SearchByMemo.vue'
import TransactionEditModal from '@/components/TransactionEditModal.vue'

import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  CATEGORY_MAP,
} from '@/constants/categories'

const calendar = use_calendar_store()
const { current_year, current_month } = storeToRefs(calendar)

const transaction_store = useTransactionStore()
const router = useRouter()

onMounted(() => {
  transaction_store.fetchTransactions()
})

const income_checked = ref(true)
const expense_checked = ref(true)
const category_selected = ref('all')
const memo_inputted = ref('')

const show_edit_modal = ref(false)
const current_edit_id = ref(null)

const reset_key = ref(0)

const filtered_transactions = computed(() => {
  return transaction_store.transactions.filter(record => {
    const date = new Date(record.date)
    const record_year = date.getFullYear()
    const record_month = date.getMonth()

    const same_month =
      record_year === current_year.value && record_month === current_month.value

    if (
      same_month &&
      ((record.type === 'income' && income_checked.value) ||
        (record.type === 'expense' && expense_checked.value))
    ) {
      return true
    }
    return false
  })
})

function prettyAmount(value, type) {
  const amt = parseFloat(value)
  if (isNaN(amt)) return value
  const formatted = amt.toLocaleString()
  if (type === 'income') return `+${formatted}`
  if (type === 'expense') return `-${formatted}`
  return formatted
}

const available_categories = computed(() => {
  if (income_checked.value && expense_checked.value) {
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
  } else if (income_checked.value) {
    return [...INCOME_CATEGORIES]
  } else if (expense_checked.value) {
    return [...EXPENSE_CATEGORIES]
  } else {
    return []
  }
})

function categoryChangeHandler(category) {
  category_selected.value = category
}

function memoSearchHandler(text) {
  memo_inputted.value = text.toLowerCase().trim()
}

const filtered_list = computed(() => {
  return filtered_transactions.value.filter(item => {
    const category_match =
      category_selected.value === 'all' ||
      item.category === category_selected.value

    const memo_match =
      memo_inputted.value === '' ||
      (item.memo && item.memo.toLowerCase().includes(memo_inputted.value))

    return category_match && memo_match
  })
})

watch([income_checked, expense_checked], () => {
  category_selected.value = 'all'
  reset_key.value++
})

const is_all_selected = computed(() =>
  transaction_store.transactions.every(record => record.selected === true),
)

function toggleSelectAll(e) {
  const checked = e.target.checked
  transaction_store.transactions.forEach(record => {
    record.selected = checked
  })
}

async function deleteHandler(id) {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await transaction_store.deleteTransaction(id)
      await transaction_store.fetchTransactions()
    } catch (error) {
      console.error('거래 삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }
}

function handleEdit(record) {
  current_edit_id.value = record.id
  show_edit_modal.value = true
}

function closeEditModal() {
  show_edit_modal.value = false
  current_edit_id.value = null
}

function handleTransactionUpdated() {
  transaction_store.fetchTransactions()
}

function selectedDeleteHandler() {
  const selected_ids = transaction_store.transactions
    .filter(record => record.selected)
    .map(record => record.id)

  if (selected_ids.length === 0) {
    alert('삭제할 항목이 없습니다!')
    return
  }

  if (confirm('선택한 항목을 정말 삭제하시겠습니까?')) {
    selected_ids.forEach(id => {
      transaction_store.deleteTransaction(id)
    })
  }
}

function toggleRow(record, event) {
  record.selected = !record.selected
}
</script>

<template>
  <div class="TransactionPage">
    <div class="container-fluid px-4 py-4">
      <div
        class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2"
      >
        <div
          class="bg-white d-flex align-items-center px-3 py-2 rounded-4 gap-2"
        >
          <button
            class="btn btn-outline-danger btn-sm"
            @click="selectedDeleteHandler"
          >
            체크된 항목 삭제
          </button>
        </div>

        <FilterCategory
          :categories="available_categories"
          :resetKey="reset_key"
          @categorySelected="categoryChangeHandler"
        />

        <SearchByMemo @memoInputted="memoSearchHandler" />

        <div class="d-flex align-items-center bg-white px-3 py-2 gap-3">
          <div class="form-check form-check-inline m-0">
            <input
              class="form-check-input me-1"
              type="checkbox"
              id="incomeCheck"
              v-model="income_checked"
              style="cursor: pointer"
            />
            <label class="form-check-label fw-semibold" for="incomeCheck">
              수입
            </label>
          </div>
          <div class="form-check form-check-inline m-0">
            <input
              class="form-check-input me-1"
              type="checkbox"
              id="expenseCheck"
              v-model="expense_checked"
              style="cursor: pointer"
            />
            <label class="form-check-label fw-semibold" for="expenseCheck">
              지출
            </label>
          </div>
        </div>
      </div>

      <div v-if="filtered_list.length === 0" id="emptyTransaction">
        표시할 내역이 없습니다.
      </div>

      <div
        v-else
        class="table-responsive rounded shadow-sm bg-white px-3 w-100"
        style="max-height: 400px; overflow-y: auto"
      >
        <table class="table table-hover mb-0 text-center align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col" style="width: 40px">
                <input
                  type="checkbox"
                  :checked="is_all_selected"
                  @change="toggleSelectAll($event)"
                  style="cursor: pointer"
                />
              </th>
              <th scope="col" style="width: 160px">날짜</th>
              <th scope="col" style="width: 150px">카테고리</th>
              <th scope="col" style="width: auto">메모</th>
              <th scope="col" style="width: 150px">금액</th>
              <th scope="col" style="width: 60px">수정</th>
              <th scope="col" style="width: 60px">삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="filtered in filtered_list"
              :key="filtered.id"
              @click="toggleRow(filtered, $event)"
              style="cursor: pointer"
            >
              <td>
                <input
                  type="checkbox"
                  v-model="filtered.selected"
                  @click.stop
                  style="cursor: pointer"
                />
              </td>
              <td>{{ filtered.date }}</td>
              <td>
                {{ CATEGORY_MAP[filtered.category] || filtered.category }}
              </td>
              <td class="text-start text-truncate" style="max-width: 300px">
                {{ filtered.memo }}
              </td>
              <td class="text-end">
                {{ prettyAmount(filtered.amount, filtered.type) }} 원
              </td>
              <td>
                <i
                  class="text-success d-block mx-auto icon-hover"
                  style="cursor: pointer"
                  @click.stop="handleEdit(filtered)"
                >
                  ✏️
                </i>
              </td>
              <td>
                <i
                  class="text-danger d-block mx-auto icon-hover"
                  style="cursor: pointer"
                  @click.stop="deleteHandler(filtered.id)"
                >
                  🗑️
                </i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <TransactionEditModal
      v-if="show_edit_modal"
      :transactionId="current_edit_id"
      @close="closeEditModal"
      @updated="handleTransactionUpdated"
    />
  </div>
</template>

<style scoped>
/* ✨ style은 그대로 template 순서에 맞춰 정리 ✨ */
.container {
  background-color: var(--color-point-3);
  border-radius: 30px;
  width: 98%;
  min-width: 768px;
  height: 630px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.category-select {
  background-color: #fff;
  color: #333;
  border: none;
  padding: 8px;
  border-radius: 4px;
}

.search-input {
  width: 300px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  outline: none;
}

.income-checkbox,
.expense-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.nav-tabs .nav-link {
  cursor: pointer;
}

.align-items-center {
  border-radius: 15px;
}

#incomeCheck {
  background-color: var(--color-green-light);
  border-color: var(--color-point-1);
}

#incomeCheck:checked {
  background-color: var(--color-point-1);
  border-color: var(--color-point-1);
}

#expenseCheck {
  background-color: var(--color-red-light);
  border-color: var(--color-red-100);
}

#expenseCheck:checked {
  background-color: var(--color-red-100);
  border-color: var(--color-red-100);
}

#emptyTransaction {
  text-align: center;
  margin: 20px;
}

.icon-hover:hover {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>
