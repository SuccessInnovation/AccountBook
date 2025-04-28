<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTransactionStore } from '@/stores/TransactionStore'
import { useRoute } from 'vue-router'

import CalendarNav from '@/components/CalendarNav.vue'
import CalendarContent from '@/components/CalendarContent.vue'
import AddListBtn from '@/components/AddListBtn.vue'
import TransactionContent from '@/components/TransactionContent.vue'

const transaction_store = useTransactionStore()
const route = useRoute()

const active_tab = ref('list') // 기본 탭
const income_checked = ref(true)
const expense_checked = ref(true)
const category_selected = ref('all')
const reset_key = ref(0)

onMounted(() => {
  transaction_store.fetchTransactions()
})

watch([income_checked, expense_checked], () => {
  category_selected.value = 'all'
  reset_key.value++
})

watch(
  () => route.query.tab,
  new_tab => {
    if (new_tab === 'calendar') {
      active_tab.value = 'calendar'
    } else {
      active_tab.value = 'list'
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="transaction_page">
    <CalendarNav />

    <div class="container">
      <div class="card_wrapper">
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

    <AddListBtn class="add_btn" />
  </div>
</template>

<style scoped>
/* 전체 페이지 */
.transaction_page {
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

/* 카드 전체 */
.card_wrapper {
  background-color: white;
  border-radius: 20px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 탭 버튼 영역 */
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

/* 콘텐츠 영역 */
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
