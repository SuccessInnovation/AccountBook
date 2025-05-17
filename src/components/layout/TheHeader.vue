<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> cba3b96 (Refactor: TheHeader.vue에 작성했던 프로필 영역을 컴포넌트로 분리(TheProfile.vue), components 디렉토리에 header 디렉토리 추가 (Notifications.vue, TheProfile.vue를 여기로 이동))
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import Notifications from '../header/Notifications.vue'
import TheProfile from '../header/TheProfile.vue'
// import { useUsersTableStore } from '@/stores/UsersTableStore'

=======
=======
<script setup>
import { useRoute } from 'vue-router'
<<<<<<< HEAD
import { ref, computed } from 'vue'
>>>>>>> 86740bb (Fix: 알림 아이콘 클릭 시 알림내역 뜨기 구현 05-06)
=======
import { computed } from 'vue'

import Notifications from '../Notifications.vue'

>>>>>>> 1df8724 (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
const route = useRoute()
<<<<<<< HEAD
const headerTitle = computed(() => {
  return route.meta.title || '페이지'
})
<<<<<<< HEAD
<<<<<<< HEAD
</script>

=======
>>>>>>> 11a397e (feature: 작업중)
=======

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
=======
>>>>>>> 1df8724 (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
</script>
<<<<<<< HEAD
>>>>>>> 7a5c5a6 (Fix: 알림 아이콘 클릭 시 알림내역 뜨기 구현 05-06)
<<<<<<< HEAD
>>>>>>> 86740bb (Fix: 알림 아이콘 클릭 시 알림내역 뜨기 구현 05-06)
=======
=======

>>>>>>> 7279e2c (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
>>>>>>> 1df8724 (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
=======
const router = useRouter()
const headerTitle = computed(() => route.meta.title || '페이지')

// const { getUserInfoLocalStorage, logoutUser } = useUsersTableStore()
// const userInfo = getUserInfoLocalStorage()

// const modalShow = ref(false)
const alarmVisible = ref(false)

// function toggleModal() {
//   modalShow.value = !modalShow.value
//   console.log(modalShow.value)
// }

// function logout() {
//   console.log('로그아웃 버튼 클릭됨')
//   try {
//     logoutUser()
//     console.log('logoutUser 실행 완료')
//     router.push({ name: 'Login' })
//   } catch (error) {
//     console.log('로그아웃 실패: ', error)
//   }
// }
</script>
>>>>>>> cba3b96 (Refactor: TheHeader.vue에 작성했던 프로필 영역을 컴포넌트로 분리(TheProfile.vue), components 디렉토리에 header 디렉토리 추가 (Notifications.vue, TheProfile.vue를 여기로 이동))
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
<<<<<<< HEAD
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
=======
>>>>>>> 1df8724 (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
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
<<<<<<< HEAD
>>>>>>> 73e720c (Fix: 프로필 클릭 시 나타나는 모달창 수정)
=======
    <!-- 알림 기능 추가  -->
    <!-- v-if로 알림내역 없으면 -> alarm_on.png  -->
    <!-- v-else로 알림내역 있으면 -> alarm_off.png -->
    <div id="alarm_img" @click="toggleAlarm">
      <img src="../../img/icons/alarm_on.png" alt="알림 이지" />
    </div>
=======
>>>>>>> 7279e2c (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)

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
>>>>>>> 6378ae2 (Feat: 알림 기능 아이콘 생성 05-05)
    </div>
=======
    <!-- 알림 컴포넌트 -->
    <Notifications />
    <!-- 프로필 컴포넌트 -->
    <TheProfile />
>>>>>>> cba3b96 (Refactor: TheHeader.vue에 작성했던 프로필 영역을 컴포넌트로 분리(TheProfile.vue), components 디렉토리에 header 디렉토리 추가 (Notifications.vue, TheProfile.vue를 여기로 이동))
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======
=======
>>>>>>> 1df8724 (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
#alarm_img {
  position: fixed;
  top: 15px;
  right: 100px;
  width: 50px;
  height: 50px;
}
<<<<<<< HEAD
>>>>>>> 6378ae2 (Feat: 알림 기능 아이콘 생성 05-05)
=======
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
=======
.more-wrapper {
  position: relative; /* 자식인 .modal의 기준점이 됨 */
>>>>>>> cba3b96 (Refactor: TheHeader.vue에 작성했던 프로필 영역을 컴포넌트로 분리(TheProfile.vue), components 디렉토리에 header 디렉토리 추가 (Notifications.vue, TheProfile.vue를 여기로 이동))
}
>>>>>>> 86740bb (Fix: 알림 아이콘 클릭 시 알림내역 뜨기 구현 05-06)
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
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 73e720c (Fix: 프로필 클릭 시 나타나는 모달창 수정)
=======
=======

>>>>>>> 7279e2c (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
>>>>>>> 1df8724 (Feat: 알림 컴포넌트 Notifications.vue 추가 05-11)
=======
>>>>>>> cba3b96 (Refactor: TheHeader.vue에 작성했던 프로필 영역을 컴포넌트로 분리(TheProfile.vue), components 디렉토리에 header 디렉토리 추가 (Notifications.vue, TheProfile.vue를 여기로 이동))
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
  background: white;
  height: 175px;
  width: 200px;
  position: absolute;
  top: 70px;
  left: -30px;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 0; /* 내용에 맞춰 크기 조절 */
  overflow-y: visible; /* 내용이 넘칠 경우 스크롤 생기도록 */
}

.modal ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
#email {
  display: block;
  text-align: center;
  padding: 13px;
  color: rgba(0, 0, 0, 0.5);
}
.modal_item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 10px 10px 20px;
  border-bottom: 1px solid var(--color-point-5);
  font-size: 14px;
}

.modal li:not(#email):hover {
  background-color: var(--color-point-5);
}
</style>
