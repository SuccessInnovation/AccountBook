<template>
  <!-- 알림 아이콘-->
  <!-- v-if로 알림내역 있으면 -> alarm_on.png  -->
  <!-- v-else로 알림내역 없으면 -> alarm_off.png -->
  <div id="alarm_img" @click="toggleAlarm">
    <img
      v-if="hasNotifications"
      src="../img/icons/alarm_on.png"
      alt="알림내역 있음"
    />
    <img v-else src="../img/icons/alarm_off.png" alt="알림내역 없음" />
  </div>

  <!-- 알림 목록 -->
  <div v-if="isAlarmOpen" class="alarm_box">
    <div v-if="notifications.length > 0" class="m-1">
      <p class="mb-2">알림 내역</p>
      <ul>
        <li
          v-for="(notification, index) in notifications"
          :key="index"
          class="d-flex align-item-center"
        >
          <span>{{ notification }}</span>
          <button @click="removeNotification(index)" class="btn_delete ms-auto">
            삭제
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>알림 내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// 알림 내역 상태
const notifications = ref([])

// 알림 추가
notifications.value.push('알림내역1')
notifications.value.push('알림내역2')
notifications.value.push('알림내역3')
notifications.value.push('알림내역4')

// 알림 내역 유무
// 1개 이상이면 true
const hasNotifications = computed(() => notifications.value.length > 0)

// 알림창 표시
// 알림창이 열러 있는지 여부
const isAlarmOpen = ref(false) // 기본값: 닫혀있음

// 알림창 열기/닫기
const toggleAlarm = () => {
  isAlarmOpen.value = !isAlarmOpen.value
}

// 알림 삭제
const removeNotification = index => {
  notifications.value.splice(index, 1)
}
</script>

<style scoped>
#alarm_img {
  position: fixed;
  top: 15px;
  right: 100px;
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.alarm_box {
  position: fixed;
  top: 70px;
  right: 100px;
  width: 200px;
  background-color: white;
  border: 2px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 999;
}

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
  padding: 5px 10px;
  margin: 6px 0;
  border-radius: 13px;
  background-color: var(--color-green-light);
  font-size: small;
  color: darkgreen;
  font-weight: 400;
}

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
