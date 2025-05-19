<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersTableStore } from '@/stores/UsersTableStore'

const { logoutUser, state } = useUsersTableStore()
const userInfo = computed(() => state.currentUser) // 반응형 적용
const router = useRouter()
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
  <div class="profile_wrapper">
    <img
      class="rounded-circle"
      id="profile_img"
      :src="userInfo?.profileImage"
      alt="프로필 이미지"
    />
    <div class="profile_text" v-if="userInfo">
      <div id="user_name">{{ userInfo?.name }}</div>
      <div id="user_role">{{ userInfo?.role }}</div>
    </div>
    <div class="more_icon_wrapper">
      <img
        id="more_icon"
        src="@/img/icons/more-profile.svg"
        alt="더보기"
        @click="toggleModal"
      />
      <!-- 모달창 -->
      <div
        class="modal"
        v-if="modalShow"
        :style="{ height: userInfo?.role === 'Admin' ? '217px' : '175px' }"
      >
        <ul>
          <li id="email" v-if="userInfo">{{ userInfo.email }}</li>
          <li v-else>데이터 로딩중...</li>
          <router-link to="/mypage"
            ><li class="modal_item" @click="toggleModal">
              <img src="@/img/icons/mypage.svg" />My Page
            </li></router-link
          >
          <router-link to="/adminpage" v-if="userInfo.role == 'Admin'"
            ><li class="modal_item" @click="toggleModal">
              <img src="@/img/icons/mypage.svg" />Admin Page
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
.profile_wrapper {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  height: 50px;
  gap: 20px;
}
#profile_img {
  width: 45px;
  height: 45px;
  object-fit: cover; /* 이미지 비율 잘 맞추기: 화면 비율 고정*/
  border-radius: 50%;
}
#user_name {
  font-weight: bold;
  font-size: 14px;
}
#user_role {
  font-size: 12px;
  color: #565656;
}
#more_icon {
  cursor: pointer;
}

/* 모달창 */
.more_icon_wrapper {
  position: relative; /* 모달의 기준 부모가 됨 */
}
.modal {
  background: white;
  height: 175px;
  width: 200px;
  position: absolute;
  top: 50px;
  left: -180px;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
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
  /* 넘치면 ... 표시 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  margin: 0 auto;
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
