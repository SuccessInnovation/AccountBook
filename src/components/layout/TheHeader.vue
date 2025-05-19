<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Notifications from '../header/Notifications.vue'
import TheProfile from '../header/TheProfile.vue'

const route = useRoute()
const headerTitle = computed(() => {
  return route.meta.title || '페이지'
})
</script>

<template>
  <div class="header_grid">
    <h1 class="logo">
      <router-link to="/home" id="logo_link">
        <span id="logo_txt">배추</span>
        <img id="logo_img" src="../../img/cabbage/logo1.png" alt="로고" />
      </router-link>
    </h1>
    <div class="info">
      <div id="title">{{ headerTitle }}</div>
      <div class="right_section">
        <!-- 알림 컴포넌트 -->
        <Notifications />
        <!-- 프로필 컴포넌트 -->
        <TheProfile />
      </div>
    </div>
  </div>
</template>
<style scoped>
.header_grid {
  position: relative;
  background-color: #fff;
  display: grid;
  grid-template-columns: 200px 1fr;
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
  font-size: 28px;
  font-weight: bold;
}
#logo_img {
  width: 25px;
  height: auto;
}
.info {
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌우로 정렬 */
}
#title {
  font-size: 28px;
  font-weight: bold;
  justify-self: left;
  padding-left: 30px;
  white-space: nowrap;
  overflow: hidden;
}
.right_section {
  /* position: absolute;
  top: 20px;
  right: 10px; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-right: 10px;
}
</style>
