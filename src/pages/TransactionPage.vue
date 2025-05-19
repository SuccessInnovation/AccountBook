<script setup>
import { ref, onMounted, watch } from 'vue'
// pinia store & API
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRoute } from 'vue-router'

import CalendarNav from '@/components/common/CalendarNav.vue'
import CalendarContent from '@/components/transactions/CalendarContent.vue'
import AddListBtn from '@/components/transactions/AddListBtn.vue'
import TransactionContent from '@/components/transactions/TransactionContent.vue'

// 거래 내역 store 사용
const transaction_store = useTransactionStore()
// 현재 라우트 정보
const route = useRoute()

// 현재 선택된 탭 상태 (e.g. list 또는 calendar)
const active_tab = ref('list')

// 필터 체크박스 상태 (true면 해당 항목 표시)
const income_checked = ref(true)
const expense_checked = ref(true)

// 카테고리 필터 (기본: all)
const category_selected = ref('all')

// 필터 초기화를 위한 키
const reset_key = ref(0)

// 거래 목록 불러오기
onMounted(() => {
  transaction_store.fetchTransactions()
})

// 수입/지출 필터 변경 감지 -> 카테고리 필터 초기화
watch([income_checked, expense_checked], () => {
  category_selected.value = 'all'
  reset_key.value++
})

// URL 쿼리(tab)에 따라 탭 상태 설정
watch(
  () => route.query.tab,
  new_tab => {
    if (new_tab === 'calendar') {
      active_tab.value = 'calendar'
    } else {
      active_tab.value = 'list'
    }
  },
  // 처음 로드 시에도 실행됨
  { immediate: true },
)
</script>

<template>
  <!-- 전체 페이지 wrapper -->
  <div class="transaction_page">
    <!-- 상단 달력 내비게이션 -->
    <CalendarNav />

    <!-- 연두색 배경 컨테이너 -->
    <div class="container">
      <div class="card_wrapper">
        <!-- 탭 버튼 영역 -->
        <div class="tab_wrapper">
          <ul class="nav_tabs">
            <li class="nav_item">
              <button
                class="nav_link"
                :class="{ active: active_tab === 'list' }"
                @click="active_tab = 'list'"
              >
                목록
              </button>
            </li>
            <li class="nav_item">
              <button
                class="nav_link"
                :class="{ active: active_tab === 'calendar' }"
                @click="active_tab = 'calendar'"
              >
                달력
              </button>
            </li>
          </ul>
        </div>

        <!-- 탭 버튼에 따른 렌더링(list or calendar) -->
        <div class="content_wrapper">
          <div v-if="active_tab === 'list'">
            <TransactionContent />
          </div>
          <div v-else-if="active_tab === 'calendar'">
            <CalendarContent />
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 추가 버튼 -->
    <AddListBtn class="add_btn" />
  </div>
</template>

<style scoped>
/* 전체 페이지 */
.transaction_page {
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px 0;
}

/* 연두색 배경 컨테이너 */
.container {
  background-color: #99bc85;
  border-radius: 30px;
  padding: 30px 20px;
  width: 95%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* 흰색 카드 전체 */
.card_wrapper {
  background-color: white;
  border-radius: 20px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 탭 영역 */
.tab_wrapper {
  background-color: white;
  width: 100%;
}

/* 탭 목록 */
.nav_tabs {
  display: flex;
  justify-content: flex-start;
  align-items: end;
  background: transparent;
  border-bottom: 2px solid #99bc85;
  margin-top: 20px;
  padding-left: 20px;
  gap: 5px;
}

/* 탭 버튼 */
.nav_link {
  background-color: #e5f3e5;
  border: 1px solid #99bc85;
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: #333;
  font-weight: bold;
  font-size: 1rem;
  padding: 10px 24px;
  height: 48px;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* 탭 버튼 활성화 */
.nav_link.active {
  background-color: white;
  color: #333;
  border-color: #99bc85;
}

/* 콘텐츠 렌더링 영역 */
.content_wrapper {
  background-color: white;
  padding: 20px;
  width: 100%;
}

/* 추가 버튼 */
.add_btn {
  margin-top: 20px;
}
</style>
