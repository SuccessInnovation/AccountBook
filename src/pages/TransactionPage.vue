<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { use_calendar_store } from '@/stores/MonthSelector'
// 거래 내역을 상태로 관리하는 Pinia store
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRouter, useRoute } from 'vue-router'
// import

// 월 이동 컴포넌트 import
import CalendarNav from '@/components/CalendarNav.vue'
// 달력,AddListBtn import
import CalendarContent from '@/components/CalendarContent.vue'
import AddListBtn from '@/components/AddListBtn.vue'
import TransactionContent from '@/components/TransactionContent.vue'
const transactionStore = useTransactionStore()
const router = useRouter()
const route = useRoute()
// 상단 import 부분에 추가
// setup 내에서 calendar 상태 불러오기
const calendar = use_calendar_store()
const { current_year, current_month } = storeToRefs(calendar)

// const calendar = use_calendar_store()
const { transactions } = storeToRefs(transactionStore)

// 필터링 컴포넌트 (카테고리 선택 / 메모 검색창)
import FilterCategory from '@/components/FilterCategory.vue'
import SearchByMemo from '@/components/SearchByMemo.vue'

// 미리 정의된 카테고리 목록 (수입 / 지출), 카테고리 항목 '영어 - 한글' 매핑
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  CATEGORY_MAP,
} from '@/constants/categories'

// Pinia store 불러오기
// const transactionStore = useTransactionStore()

// 마운트될 때 거래 내역 불러오기
onMounted(() => {
  transactionStore.fetchTransactions()
})

const { visible_months } = storeToRefs(calendar)
const month_names = calendar.month_names

//달력 showCalendar, openCalendar
// const showCalendar = ref(false)

// const openCalendar = () => {
//   showCalendar.value = true
// }
const activeTab = ref('list') // 기본 탭: list

// const tabs = ['목록', '달력']

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
//     if (record.type === '수입' && showIncome.value) return true
//     if (record.type === '지출' && showExpense.value) return true
//     return false
//   })
// })
// 상태변수 초기값 설정

// '수입' 체크박스 - 기본: 체크됨
const incomeChecked = ref(true)
// '지출' 체크박스 - 기본: 체크됨
const expenseChecked = ref(true)
// 카테고리 필터 - 기본: all(전체)
const categorySelected = ref('all')
// 메모 검색창 - 기본: ''
const memoInputted = ref('')

// '수입/지출' 체크박스 상태를 기준으로 거래 내역 필터링
// const filteredTransactions = computed(() => {
//   return transactionStore.transactions.filter(record => {
//     // type이 '수입' & '수입' 체크박스 체크 O
//     if (record.type === 'income' && incomeChecked.value) return true
//     // type이 '수출' & '수출' 체크박스 체크 O
//     if (record.type === 'expense' && expenseChecked.value) return true
//     // '수입/수출' 체크박스 모두 체크 X
//     return false
//   })
// })

const filteredByMonthTransactions = computed(() => {
  return transactionStore.transactions.filter(record => {
    const date = new Date(record.date)
    const recordYear = date.getFullYear()
    const recordMonth = date.getMonth()

    return (
      recordYear === current_year.value &&
      recordMonth === current_month.value &&
      ((record.type === 'income' && incomeChecked.value) ||
        (record.type === 'expense' && expenseChecked.value))
    )
  })
})

// 페이지 관련 변수
const currentPage = ref(1)
const pageSize = ref(10)

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / pageSize.value) || 1
})

//#region 💰 금액 포맷 함수

/**
 * 금액에 부호(+, -)를 붙이고 천 단위 쉼표로 포맷된 문자열을 반환합니다.
 *
 * @param {string|number} value - 원본 금액 값 (문자열 / 숫자)
 * @param {string} type - 거래 유형 (income / expense)
 * @returns {string} 포맷된 금액 문자열 (예: +1,000 / -25,000)
 */
function prettyAmount(value, type) {
  // 문자열 -> 숫자로 변환
  const amt = parseFloat(value)
  // 예외처리 : 숫자 X -> 그대로 반환
  if (isNaN(amt)) return value

  // 천 단위로 쉼표(,) 붙이기
  const formatted = amt.toLocaleString()

  // 거래 유형에 따라 '+/-'부호 추가
  if (type === 'income') return `+${formatted}`
  if (type === 'expense') return `-${formatted}`

  // 예외처리 : 그 외의 type -> 부호 없이 반환
  return formatted
}
//#endregion

// '수입/지출' 체크박스 상태를 기준으로 거래내역 목록
const availableCategories = computed(() => {
  // '수입/지출' 체크박스 모두 체크 O
  if (incomeChecked.value && expenseChecked.value) {
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES] // 모든 카테고리 반환
    // '수입'체크박스만 체크 O
  } else if (incomeChecked.value) {
    return [...INCOME_CATEGORIES]
    // '지출'체크박스만 체크 O
  } else if (expenseChecked.value) {
    return [...EXPENSE_CATEGORIES]
    // '수입/수출' 체크박스 모두 체크 X
  } else {
    return [] // 빈 배열 반환 (드롭다운 항목 X)
  }
})

// 카테고리 선택 이벤트
const CategoryChangeHandler = category => {
  // FilteredCategory.vue(자식 컴포넌트)에서 emit된 값
  categorySelected.value = category
}

// 메모 검색창 입력 이벤트
const MemoSearchHandler = text => {
  // 검색어 - 소문자로 변경, 공백 제거
  memoInputted.value = text.toLowerCase().trim()
}

// 필터링된 거래내역 (카테고리 + 메모)
const filteredList = computed(() => {
  return filteredByMonthTransactions.value.filter(item => {
    // 선택된 카테고리가 'all'이거나 선택된 카테고리와 카테고리가 같은 항목
    const categoryMatch =
      categorySelected.value === 'all' ||
      item.category === categorySelected.value

    // 메모 검색어가 비어있거나 메모 검색어가 메모에 들어있는 경우 - 검색어 모두 소문자로 변경
    const memoMatch =
      memoInputted.value === '' ||
      (item.memo && item.memo.toLowerCase().includes(memoInputted.value))

    // 두 조건을 모두 만족하는 항목 반환
    return categoryMatch && memoMatch
  })
})

// 드롭다운 리렌더링(초기화)하기 위한 key
const resetKey = ref(0)

// '수입/지출' 체크박스 변경 감지
watch([incomeChecked, expenseChecked], () => {
  // 선택된 카테고리 초기화
  categorySelected.value = 'all'
  // 드롭다운 초기화 - key값 변경 시 컴포넌트 리렌더링
  resetKey.value++
})

//탭 감시
watch(
  () => route.query.tab,
  newTab => {
    if (newTab === 'calendar') {
      activeTab.value = 'calendar' // tab 쿼리값 보고 calendar로 세팅
    } else if (newTab === 'list') {
      activeTab.value = 'list'
    }
  },
  { immediate: true }, // 바로 적용
)
</script>
<!-- 탭메뉴 -->
<template>
  <!-- 월 이동 컴포넌트 -->

  <CalendarNav />
  <!-- <div class="calendar_carousel">
    <button type="button" class="arrow" @click="calendar.go_to_prev_month">
      &lt;
    </button>

    <div class="month_slider">
      <div
        v-for="(month, index) in visible_months"
        :key="index"
        class="month_item"
      >
        <p :class="{ active: index === 1, faded: index !== 1 }">
          {{ month.year }} {{ month_names[month.month] }}
        </p>
      </div>
    </div>

    <button type="button" class="arrow" @click="calendar.go_to_next_month">
      &gt;
    </button>
  </div> -->
  <div class="container">
    <div>
      <!-- Bootstrap 탭 메뉴 -->
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'list' }"
            @click="activeTab = 'list'"
          >
            목록
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'calendar' }"
            @click="activeTab = 'calendar'"
          >
            달력
          </button>
        </li>
      </ul>

      <!-- 탭 콘텐츠 -->
      <div class="tab-content mt-3">
        <div v-if="activeTab === 'list'">
          <!-- 목록 보기 -->
          <!-- <TransactionContent :transactions="store.transactions" />/ -->
          <!-- <TransactionContent :transactions="transactionStore.transactions" /> -->
          <TransactionContent />
        </div>
        <div v-else-if="activeTab === 'calendar'">
          <!-- 달력 보기 -->
          <CalendarContent />
        </div>
      </div>
    </div>
    <!-- 추가 버튼 -->
    <AddListBtn class="add_btn" />
  </div>
</template>

<style scoped>
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

/* 탭메뉴 */
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
</style>
