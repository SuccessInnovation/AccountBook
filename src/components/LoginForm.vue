<template>
  <!-- 로그인 페이지 시작 -->
  <div class="app_wrapper">
    <!-- 로그인 박스 타이틀 -->
    <div class="header">
      <h1>배추</h1>
      <img
        class="logo_png"
        src="../img/cabbage/logo1.png"
        alt="배추캐릭터로고"
      />
    </div>
    <!-- 로그인 폼작성 -->
    <form
      action=""
      method="post"
      @submit.prevent="login"
      class="login_form_box"
    >
      <input
        class="input_login"
        type="email"
        name="email"
        id="email"
        placeholder="이메일"
        v-model="userInput.email"
      />
      <input
        class="input_login"
        type="password"
        name="password"
        id="password"
        placeholder="비밀번호"
        v-model="userInput.password"
      />
      <div class="options_row">
        <label class="checkbox_wrapper">
          <input type="checkbox" name="save_id" />
          <span>아이디 저장</span>
        </label>

        <a href="#" class="reset_link">비밀번호 초기화</a>
      </div>
      <button
        class="login_btn btn disabled_box clickable_text"
        :disabled="!userInput.email || !userInput.password"
      >
        로그인
      </button>
      <button class="signfor_btn btn disabled_box">
        <!-- 임시로 회원가입 클릭시 서비스 준비중 페이지로 이동 -->
        <router-link to="/register" class="clickable_text"
          >회원가입</router-link
        >
      </button>
      <!-- 로그인 실패 메시지 -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersTableStore } from '@/stores/UsersTableStore.js'

// 라우터 객체 가져오기
const router = useRouter()
const route = useRoute()

// 사용자 입력 상태
const userInput = reactive({
  email: '',
  password: '',
})

// 에러 메시지 상태
const errorMessage = ref('')

// 로그인 성공 시
const successCallback = () => {
  errorMessage.value = '' // 성공 시 메시지 초기화
  router.push({ name: 'Home' })
  console.log('로그인 성공')
}

// 로그인 실패 시
const failCallback = message => {
  errorMessage.value = message || '로그인 실패'
}

// 로그인 처리
const login = () => {
  const store = useUsersTableStore()
  store.loginUser(
    { email: userInput.email, password: userInput.password },
    successCallback,
    failCallback,
  )
}
</script>

<style scoped>
/* 전체 하얀 박스 */
.app_wrapper {
  width: 450px;
  height: 700px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-items: center;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 2rem;
}

/* h1 & 로고 */
.header {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: var(--color-font-main);
  /* border: 1px solid blueviolet; */
}
/* 배추 제목 이미지 */
.logo_png {
  width: 55px;
}

/* 로그인 폼 박스 */
.login_form_box {
  display: flex;
  flex-direction: column;
  height: 400px;
  gap: 1rem;
  /* border: 1px solid blue; */
}
/* input 스타일 초기화에 따른 설정 */
.input_login {
  width: 350px;
  height: 3rem;
  padding-left: 1rem;
  border: 1px solid var(--color-input-box);
  border-radius: 5px;
  background-color: var(--color-input-box);
}
/* 로그인 옵션 가로 정렬 */
.options_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 체크박스와 레이블이 따로 떨어져서 하나로 묶어주는 클래스 */
.checkbox_wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}
/* 체크박스 스타일 초기화에 따른 재설정 */
.checkbox_wrapper input[type='checkbox'] {
  transform: scale(1.2); /* 숫자 조절하면 크기 변경 가능 */
  border: 2px solid var(--color-input-box);
}

/* 비밀번호 초기화 */
.reset_link {
  font-size: 0.9rem;
  color: var(--font-color);
  text-decoration: none;
  cursor: pointer;
}

/* 로그인 버튼 스타일 */
.login_btn {
  margin-top: 3rem;
  background-color: var(--color-point-1);
  color: var(--color-brown-very-light);
}

/* 회원가입 버튼 스타일 */
.signfor_btn {
  color: var(--color-point-1);
}

/* 로그인 / 회원가입 버튼 공통 스타일 */
.btn {
  border: 1px solid var(--color-point-1);
  height: 4rem;
  border-radius: 10px;
}
/* 버튼 클릭 이벤트 오류에 따른 이벤트 발생 방지 */
.disabled_box {
  pointer-events: none;
}

/* 로그인 실패 메세지 */
.error {
  color: red;
  margin-top: 10px;
}
</style>
