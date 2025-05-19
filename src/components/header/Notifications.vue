<template>
  <!-- 알림 아이콘-->
  <!-- v-if로 알림내역 있으면 -> alarm_on.png  -->
  <!-- v-else로 알림내역 없으면 -> alarm_off.png -->
  <div id="alarm_img" @click="toggleAlarm">
    <img
      v-if="hasNotifications"
      src="../../img/icons/alarm_on.svg"
      alt="알림내역 있음"
    />
    <img v-else src="../../img/icons/alarm_off.svg" alt="알림내역 없음" />
  </div>

  <!-- 알림 목록 -->
  <div class="alarm_wrapper">
    <div v-if="isAlarmOpen" class="alarm_box">
      <div v-if="notifications.length > 0" class="m-1">
        <p class="mb-2">알림 내역</p>
        <ul>
          <!-- 알림 하나씩 출력 -->
          <li
            v-for="(notification, index) in notifications"
            :key="index"
            class="d-flex align-item-center"
          >
            <span>{{ notification }}</span>
            <button
              @click="removeNotification(index)"
              class="btn_delete ms-auto"
            >
              삭제
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>알림 내역이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useBudgetStore } from '@/stores/UseBudgetStore'
import { use_calendar_store } from '@/stores/MonthSelector'
import { statisticsStore } from '@/stores/statisticsStore'
import { useBudgetProgress } from '@/stores/useBudgetProgress'

// 총 예산, 총 지출 데이터 가져오기
const { totalBudget, totalSpent } = useBudgetProgress()

// pinia store
const calendar = use_calendar_store()
const budgetStore = useBudgetStore()
const statsStore = statisticsStore()

// 알림창 열림 상태
const isAlarmOpen = ref(false)
const toggleAlarm = () => (isAlarmOpen.value = !isAlarmOpen.value)

// 알림 리스트 상태
const notifications = ref([])

// 알림 존재 여부
const hasNotifications = computed(() => notifications.value.length > 0)

// 알림 삭제
const removeNotification = index => notifications.value.splice(index, 1)

onMounted(async () => {
  // 예산 및 통계 데이터 로딩
  await budgetStore.fetchBudgets(calendar.monthKey)
  await statsStore.fetchTransactionsByPeriod()

  const alerts = []

  // 총 예산 초과 여부 확인
  if (totalSpent.value > totalBudget.value) {
    const exceeded = totalSpent.value - totalBudget.value
    alerts.push(
      `📌 총 예산을 초과했습니다!
      초과 금액: ${exceeded.toLocaleString()}원`,
    )
  }

  // 매달 1일 고정지출 알림 - 3일 전 날짜 체크
  // 오늘 날짜 받아오기
  const today = new Date()

  // 다음 달 1일
  const next_month_first_date = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
  )

  // 고정지출일 3일 전 계산
  const three_days_before_due_date = new Date(next_month_first_date)
  three_days_before_due_date.setDate(three_days_before_due_date.getDate() - 3)

  // 오늘 날짜가 3일 전과 일치하는지 확인
  const is_today_three_days_before_due =
    today.getFullYear() === three_days_before_due_date.getFullYear() &&
    today.getMonth() === three_days_before_due_date.getMonth() &&
    today.getDate() === three_days_before_due_date.getDate()

  // 3일 전이면 알림 추가
  if (is_today_three_days_before_due) {
    alerts.push('📌 D-3 매달 1일은 고정지출 결제일입니다.')
  }

  // 알림 리스트 저장
  notifications.value = alerts
})
</script>

<style scoped>
/* 알림 아이콘 */
#alarm_img img {
  width: 25px;
  height: 25px;
  object-fit: cover;
  cursor: pointer;
}

/* 알림 박스 위치 */
.alarm_wrapper {
  position: relative;
}

/* 알림 목록 팝업 스타일 */
.alarm_box {
  position: absolute;
  top: 40px;
  right: 15px;
  width: 320px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 12px;
  z-index: 999;
}

/* 알림 텍스트 및 리스트 스타일 */
.alarm_box p {
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--color-font-main);
  text-align: center;
}

.alarm_box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.alarm_box li {
  padding: 6px 10px;
  margin: 6px 0;
  border-radius: 13px;
  background-color: var(--color-green-light);
  font-size: small;
  color: darkgreen;
  font-weight: 400;
}

/* 삭제 버튼 스타일 */
.btn_delete {
  border: var(--color-red-100) 1px solid;
  color: var(--color-red-100);
  padding: 1px 6px;
  font-size: 0.6rem;
  line-height: 1;
  border-radius: 3px;
  flex-shrink: 0;
  white-space: nowrap;
  border-width: 1px;
}

.btn_delete:hover {
  background-color: var(--color-red-100);
  color: white;
}
</style>
