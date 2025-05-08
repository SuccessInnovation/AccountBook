<<<<<<< HEAD
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import Notifications from '../Notifications.vue'

const route = useRoute()
const headerTitle = computed(() => {
  return route.meta.title || '페이지'
})
</script>

=======
>>>>>>> 11a397e (feature: 작업중)
<template>
  <div class="header_grid">
    <h1 class="logo">
      <router-link to="/home" id="logo_link">
        <span id="logo_txt">배추</span>
        <img id="logo_img" src="../../img/cabbage/logo1.png" alt="로고" />
      </router-link>
    </h1>
    <div id="title">{{ headerTitle }}</div>
<<<<<<< HEAD

    <!-- 알림 컴포넌트 -->
    <Notifications />

    <div id="profile_img">
      <router-link to="register">
        <img
          class="rounded-circle"
          src="../../img/cabbage/pretty_cabbage.jpg"
          alt="프로필 이미지"
        />
      </router-link>
=======
    <div class="profile">
      <img
        class="rounded-circle"
        id="profile_img"
        src="@/img/cabbage/pretty_cabbage.jpg"
        alt="프로필 이미지"
      />
      <div class="info_text">
        <div id="user_name">{{ userInfo.name }}</div>
        <div id="user_role">{{ userInfo.role }}</div>
      </div>
      <img
        id="more_icon"
        src="@/img/icons/more-profile.svg"
        alt="더보기"
        @click="toggleModal"
      />
    </div>
    <!-- 모달창 -->
    <div class="modal" v-if="modalShow">
      <ul>
        <router-link to="/mypage"
          ><li @click="toggleModal">My Page</li></router-link
        >
        <li id="datrkmode_btn">Dark Mode</li>
        <li id="logout_btn" @click="logout">Log out</li>
      </ul>
>>>>>>> 11a397e (feature: 작업중)
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useUsersTableStore } from '@/stores/UsersTableStore'

const route = useRoute()
const headerTitle = computed(() => {
  return route.meta.title || '페이지'
})

const { getUserInfoLocalStorage, logoutUser } = useUsersTableStore()
const userInfo = getUserInfoLocalStorage()
const modalShow = ref(false)

function toggleModal() {
  modalShow.value = !modalShow.value
  console.log(modalShow.value)
}

function logout() {
  logoutUser()
}
</script>
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
