<script setup>
import { ref } from 'vue'
import { useUsersTableStore } from '@/stores/UsersTableStore'

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

<template>
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
    <!-- 모달창 -->
    <div class="more_wrapper">
      <div class="modal" v-if="modalShow">
        <ul>
          <li id="email">{{ userInfo.email }}</li>
          <router-link to="/mypage"
            ><li class="modal_item" @click="toggleModal">
              <img src="@/img/icons/mypage.svg" />My Page
            </li></router-link
          >
          <li id="datrkmode_btn" class="modal_item">
            <img src="@/img/icons/darkmode.svg" />Dark Mode
          </li>
          <li id="logout_btn" class="modal_item" @click="logout">
            <img src="@/img/icons/logout.svg" />Log out
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.more-wrapper {
  position: relative; /* 자식인 .modal의 기준점이 됨 */
}
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
