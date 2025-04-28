<script setup>
import { ref, onMounted, watch } from 'vue'
// 거래 내역을 상태로 관리하는 Pinia store
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRoute } from 'vue-router'

// 월 이동 컴포넌트 import
import CalendarNav from '@/components/CalendarNav.vue'
// 달력,AddListBtn import
import CalendarContent from '@/components/CalendarContent.vue'
import AddListBtn from '@/components/AddListBtn.vue'
import TransactionContent from '@/components/TransactionContent.vue'
const transactionStore = useTransactionStore()
const route = useRoute()

// 마운트될 때 거래 내역 불러오기
onMounted(() => {
  transactionStore.fetchTransactions()
})
const activeTab = ref('list') // 기본 탭: list

// 상태변수 초기값 설정
// '수입' 체크박스 - 기본: 체크됨
const incomeChecked = ref(true)
// '지출' 체크박스 - 기본: 체크됨
const expenseChecked = ref(true)
// 카테고리 필터 - 기본: all(전체)
const categorySelected = ref('all')

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
.category-select {
  background-color: #fff;
  color: #333;
  border: none;
  padding: 8px;
  border-radius: 4px;
}

.income-checkbox,
.expense-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
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
