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
        <div id="user_name">{{ userInfo?.name }}</div>
        <div id="user_role">{{ userInfo?.role }}</div>
      </div>
      <img
        id="more_icon"
        src="@/img/icons/more-profile.svg"
        alt="더보기"
        @click="toggleModal"
      />
<<<<<<< HEAD
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
=======
      <!-- 모달창 -->
      <div class="modal" v-if="modalShow">
        <ul>
          <li id="email">{{ userInfo.email }}</li>
          <router-link to="/mypage"
            ><li @click="toggleModal">My Page</li></router-link
          >
          <li id="datrkmode_btn">Dark Mode</li>
          <li id="logout_btn" @click="logout">Log out</li>
        </ul>
      </div>
>>>>>>> 73e720c (Fix: 프로필 클릭 시 나타나는 모달창 수정)
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useUsersTableStore } from '@/stores/UsersTableStore'

const route = useRoute()
const router = useRouter()
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
  console.log('로그아웃 버튼 클릭됨')
  try {
    logoutUser()
    console.log('logoutUser 실행 완료')
    router.push({ name: 'Login' })
  } catch (error) {
    console.log('로그아웃 실패: ', error)
  }
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
  width: 100%;
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
<<<<<<< HEAD

=======
.profile {
  margin: 0;
  padding: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-around;
  right: 15px;
  width: 200px;
}
>>>>>>> 73e720c (Fix: 프로필 클릭 시 나타나는 모달창 수정)
#profile_img {
  width: 70px;
  height: 70px;
  object-fit: cover; /* 이미지 비율 잘 맞추기: 화면 비율 고정*/
  border-radius: 50%;
  border: 3px solid white;
}
#user_name {
  font-weight: bold;
}
#more_icon {
  cursor: pointer;
}

/* 모달창 */
.modal {
  background: grey;
  height: 170px;
  width: 200px;
  position: absolute;
  top: 50px; /* 상단 여백 조정 */
  left: 10px;
  z-index: 1000; /* 다른 요소들 위로 올리기 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 0; /* 내용에 맞춰서 크기 조절 */
  overflow-y: visible; /* 내용이 넘칠 경우 스크롤 생기도록 */
}

.modal ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.modal li {
  cursor: pointer;
  display: block;
  padding: 10px;
  background-color: white;
  border-bottom: 1px solid var(--color-point-5);
  font-size: 14px;
}

.modal li:not(#email):hover {
  background-color: var(--color-point-5);
}

#email {
  text-align: center;
  padding-bottom: 14px;
}
</style>
