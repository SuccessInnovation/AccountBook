<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { use_calendar_store } from '@/stores/MonthSelector'
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRouter } from 'vue-router'

import FilterCategory from '@/components/transactions/FilterCategory.vue'
import SearchByMemo from '@/components/transactions/SearchByMemo.vue'
import TransactionEditModal from '@/components/transactions/TransactionEditModal.vue'

// 미리 정의된 카테고리 목록 (수입 / 지출), 카테고리 항목 '영어 - 한글' 매핑
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  CATEGORY_MAP,
} from '@/constants/categories'

const calendar = use_calendar_store()
const { current_year, current_month } = storeToRefs(calendar)

const transaction_store = useTransactionStore()

// 마운트될 때 거래 내역 불러오기
onMounted(() => {
  transaction_store.fetchTransactions()
})

// '수입' 체크박스 - 기본: 체크됨
const income_checked = ref(true)
// '지출' 체크박스 - 기본: 체크됨
const expense_checked = ref(true)
// 카테고리 필터 - 기본: all(전체)
const category_selected = ref('all')
// 메모 검색창 - 기본: ''
const memo_inputted = ref('')
// 수정 모달 표시 여부 - 기본: 표시 안 함
const show_edit_modal = ref(false)
// 현재 수정할 거래 ID - 기본: null
const current_edit_id = ref(null)
// 자식 컴포넌트 재랜더링용 키
const reset_key = ref(0)

// '수입/지출' 체크박스 상태를 기준으로 거래 내역 필터링
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

// 거래 금액 포맷팅, 수입/지출에 따라 부호를 붙여 반환
function prettyAmount(value, type) {
  const amt = parseFloat(value)
  if (isNaN(amt)) return value
  const formatted = amt.toLocaleString()
  if (type === 'income') return `+${formatted}`
  if (type === 'expense') return `-${formatted}`
  return formatted
}

// 현재 선택된 수입/지출 체크박스에 따라 보여줄 카테고리 목록 계산
const available_categories = computed(() => {
  if (income_checked.value && expense_checked.value) {
    // 둘 다 선택되었으면 모든 카테고리 반환
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
  } else if (income_checked.value) {
    // 수입만 선택된 경우 수입 카테고리만
    return [...INCOME_CATEGORIES]
  } else if (expense_checked.value) {
    // 지출만 선택된 경우 지출 카테고리만
    return [...EXPENSE_CATEGORIES]
  } else {
    // 아무 것도 선택되지 않으면 빈 배열 반환
    return []
  }
})

// 카테고리 선택 이벤트
function categoryChangeHandler(category) {
  // FilteredCategory.vue(자식 컴포넌트)에서 emit된 값
  category_selected.value = category
}

// 메모 검색창 입력 이벤트
function memoSearchHandler(text) {
  // 검색어 - 소문자로 변경, 공백 제거
  memo_inputted.value = text.toLowerCase().trim()
}

// 필터링된 거래내역 (카테고리 + 메모)
const filtered_list = computed(() => {
  return filtered_transactions.value.filter(item => {
    // 선택된 카테고리가 'all'이거나 선택된 카테고리와 카테고리가 같은 항목
    const category_match =
      category_selected.value === 'all' ||
      item.category === category_selected.value

    // 메모 검색어가 비어있거나 메모 검색어가 메모에 들어있는 경우 - 검색어 모두 소문자로 변경
    const memo_match =
      memo_inputted.value === '' ||
      (item.memo && item.memo.toLowerCase().includes(memo_inputted.value))

    // 두 조건을 모두 만족하는 항목 반환
    return category_match && memo_match
  })
})

// 수입/지출 체크박스가 변경될 때마다
watch([income_checked, expense_checked], () => {
  category_selected.value = 'all'
  reset_key.value++
})

// 선택된 모든 항목이 체크되었는지 여부 (전체 선택 체크박스 표시용)
const is_all_selected = computed(() =>
  transaction_store.transactions.every(record => record.selected === true),
)

// 전체 선택 토글 (헤더 체크박스 클릭 시 모든 항목 선택/해제)
function toggleSelectAll(e) {
  const checked = e.target.checked
  transaction_store.transactions.forEach(record => {
    record.selected = checked
  })
}

// 단일 거래 항목 삭제 처리
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

// 거래 수정 아이콘 클릭 시 모달 열기
function handleEdit(record) {
  current_edit_id.value = record.id
  show_edit_modal.value = true
}

// 수정 모달 닫기
function closeEditModal() {
  show_edit_modal.value = false
  current_edit_id.value = null
}

// 거래 수정 완료
function handleTransactionUpdated() {
  transaction_store.fetchTransactions()
}

// 선택된 항목만 삭제
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

// 각 행 클릭 시 개별 선택 상태 토글
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

        <!-- 카테고리 필터 컴포넌트 (드롭다운) -->
        <!-- props - 'FilterCategory.vue'로 '카테고리/resetKey' 전달 -->
        <FilterCategory
          :categories="available_categories"
          :resetKey="reset_key"
          @categorySelected="categoryChangeHandler"
        />

        <!-- 메모 검색창 컴포넌트 -->
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

      <!-- 거래내역이 없을 경우 메시지 출력 -->
      <div v-if="filtered_list.length === 0" id="emptyTransaction">
        표시할 내역이 없습니다.
      </div>

      <!-- '수입/지출' 필터링된 거래내역 -->
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
          <!-- 카테고리 필터링된 거래내역 -->
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
              <!-- text-truncate: 길어지면 말줄임표(...) 처리 (너비제한 필요) -->
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

    <!-- 거래 수정 모달 컴포넌트 -->
    <!-- 조건부 렌더링: show_edit_modal이 true일 때만 표시 -->
    <TransactionEditModal
      v-if="show_edit_modal"
      :transactionId="current_edit_id"
      @close="closeEditModal"
      @updated="handleTransactionUpdated"
    />
  </div>
</template>

<style scoped>
/* 전체 페이지 컨테이너 */
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

/* 현재 연도 및 월 표시 영역 */
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

/* 카테고리 선택 드롭다운 */
.category-select {
  background-color: #fff;
  color: #333;
  border: none;
  padding: 8px;
  border-radius: 4px;
}

/* 메모 검색 입력창 */
.search-input {
  width: 300px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  outline: none;
}

/* 수입/지출 체크박스 wrapper */
.income-checkbox,
.expense-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
/* 부트스트랩 nav-tabs 안의 링크에 커서 포인터 */
.nav-tabs .nav-link {
  cursor: pointer;
}

/* '수입/지출' 체크박스  */
.align-items-center {
  border-radius: 15px;
}

/* '수입' 체크박스 */
#incomeCheck {
  background-color: var(--color-green-light);
  border-color: var(--color-point-1);
}

/* '수입' 체크박스 선택 */
#incomeCheck:checked {
  background-color: var(--color-point-1);
  border-color: var(--color-point-1);
}

/* '지출' 체크박스 */
#expenseCheck {
  background-color: var(--color-red-light);
  border-color: var(--color-red-100);
}

/* '지출' 체크박스 선택 */
#expenseCheck:checked {
  background-color: var(--color-red-100);
  border-color: var(--color-red-100);
}

/* 거래내역 없을 때 텍스트 */
#emptyTransaction {
  text-align: center;
  margin: 20px;
}

/* 수정/삭제 아이콘 hover 시 1.2 배확대 효과 */
.icon-hover:hover {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>
