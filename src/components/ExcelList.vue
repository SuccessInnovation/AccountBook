<script setup>
import { ref, computed } from 'vue'
import { statisticsStore } from '@/stores/statisticsStore'

const store = statisticsStore()

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = 10

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(store.filteredTransaction.length / itemsPerPage)
})

// 현재 페이지 항목들 반환
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return store.filteredTransaction.slice(start, end)
})

const goToPage = page => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
// 최대 페이지 번호 목록 (최대 5개 표시)
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const range = []

  let start = Math.max(current - 2, 1)
  let end = Math.min(start + 4, total)

  // start가 밀렸을 경우 보정 (ex. totalPages가 3인데 current가 3인 경우)
  start = Math.max(end - 4, 1)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})
</script>
<template>
  <div class="wrapper">
    <div class="box">
      <table
        id="transaction-table"
        class="table table-hover text-left align-middle"
      >
        <thead class="table-light">
          <tr>
            <th>날짜</th>
            <th>카테고리</th>
            <th>내용</th>
            <th id="col_amount">금액</th>
          </tr>
        </thead>
        <tbody>
          <!-- 미조회 시 안내문구 출력 -->
          <tr v-if="store.filteredTransaction.length === 0">
            <td colspan="4" class="empty-message">조회 버튼을 눌러주세요</td>
          </tr>

          <!-- 조회 시 데이터 출력 -->
          <tr v-else v-for="item in paginatedItems" :key="item.id">
            <td>{{ item.date }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.memo || '-' }}</td>
            <!-- 내용 없으면 '-' 표시 -->
            <td id="data_amount">{{ item.amount.toLocaleString() }}원</td>
          </tr>
        </tbody>
      </table>
      <!-- 페이지네이션 -->
      <ul class="pagination justify-content-center" style="margin: 20px 0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link pt-2"
            href="#"
            @click.prevent="goToPage(currentPage - 1)"
            ><img src="../img/icons/forward-step-solid-1.svg" alt="이전"
          /></a>
        </li>
        <li
          class="page-item"
          v-for="page in pageNumbers"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item">
          <a
            class="page-link pt-2"
            href="#"
            @click.prevent="goToPage(currentPage + 1)"
          >
            <img src="../img/icons/forward-step-solid-2.svg" alt="다음" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box {
  background-color: #fff;
  border-radius: 15px;
  height: 500px;
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 60px; /* 페이지네이션 영역 확보 */
}
#transaction-table {
  width: 95%;
  table-layout: fixed; /* 컬럼 너비 고정 */
  border-collapse: collapse;
}
thead th {
  font-size: 17px;
  color: var(--color-point-1);
  margin: 10px auto;
  border-bottom: 1px solid var(--color-point-1);
}
tbody td {
  font-size: 15px;
  font-weight: 400;
  border-bottom: 0.3px solid #328e6e59;
  color: var(--color-font-main);
}
#col_amount,
#data_amount {
  text-align: right;
}
.pagination {
  position: absolute;
  bottom: 10px;
}
.page-link {
  font-size: 12px;
  font-family: var(--font-family-main);
  color: var(--color-point-1);
  background-color: transparent;
  border: none;
  outline: none;
  box-shadow: none;
}
.page-item.active .page-link {
  font-weight: 900;
  background-color: transparent;
  border: none;
}
</style>
