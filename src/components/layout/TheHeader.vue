<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
const route = useRoute()
const headerTitle = computed(() => {
  return route.meta.title || '페이지'
})

// 추가 - 알림창 표시
// 알림창이 열러 있는지 여부
const isAlarmOpen = ref(false) //기본값: 닫혀있음
//#region 알림창 열기/닫기
/**
 * 알림 아이콘 클릭 시 알림창을 열거나 닫음
 * 현재 상태가 true면 false로, false면 true로 반전시켜 토글 동작 수행
 */
const toggleAlarm = () => {
  isAlarmOpen.value = !isAlarmOpen.value
}
//#endregion
</script>
<template>
  <div class="header_grid">
    <h1 class="logo">
      <router-link to="/home" id="logo_link">
        <span id="logo_txt">배추</span>
        <img id="logo_img" src="../../img/cabbage/logo1.png" alt="로고" />
      </router-link>
    </h1>
    <div id="title">{{ headerTitle }}</div>
    <!-- 알림 기능 추가  -->
    <!-- v-if로 알림내역 없으면 -> alarm_on.png  -->
    <!-- v-else로 알림내역 있으면 -> alarm_off.png -->
    <div id="alarm_img" @click="toggleAlarm">
      <img src="../../img/icons/alarm_on.png" alt="알림 이지" />
    </div>

    <div v-if="isAlarmOpen" class="alarm_box">
      <p>알림 내역</p>
      <ul>
        <li>예산 초과 알림</li>
        <li>매월 20일 - 예산 현황</li>
      </ul>
    </div>

    <div id="profile_img">
      <router-link to="register">
        <img
          class="rounded-circle"
          src="../../img/cabbage/pretty_cabbage.jpg"
          alt="프로필 이미지"
        />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.header_grid {
  position: relative;
  background-color: var(--color-point-5);
  display: grid;
  grid-template-columns: 200px 1fr 100px;
  align-items: center;
  height: 100%;
}
.logo {
  grid-column: 1;
  height: 100%;
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
}
#logo_link {
  height: 100%;
  display: inline-flex;
  align-items: center;
}
#logo_txt {
  font-size: 45px;
  font-weight: bold;
}
#logo_img {
  width: 55px;
  height: 82px;
}
#title {
  grid-column: 2 / 4; /* 2번 칸 - 4번 칸 전까지 차지 */
  font-size: 27px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  justify-self: center;
}

#alarm_img {
  position: fixed;
  top: 15px;
  right: 100px;
  width: 50px;
  height: 50px;
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
}

.alarm_box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.alarm_box li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

#profile_img {
  position: fixed;
  right: 10px;
  width: 70px;
  height: 70px;
  object-fit: cover; /* 이미지 비율 잘 맞추기: 화면 비율 고정*/
  border-radius: 50%;
  border: 3px solid white;
  cursor: pointer;
}
</style>
