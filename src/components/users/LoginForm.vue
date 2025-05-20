<template>
  <!-- 로그인 페이지 시작 -->
  <div class="app_wrapper">
    <!-- 로그인 박스 타이틀 -->
    <h1>로그인</h1>
    <!-- 로그인 폼 -->
    <form
      action=""
      method="post"
      @submit.prevent="login"
      class="form_box"
      novalidate
    >
      <label for="email">Email</label>
      <input
        class="input_login"
        type="email"
        name="email"
        id="email"
        placeholder="이메일"
        v-model="userInput.email"
      />
      <label for="password">Password</label>
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
          <input type="checkbox" name="remember_id" v-model="rememberEmail" />
          <span id="saveId_txt">아이디 저장</span>
        </label>
      </div>
      <button class="login_btn btn" @click="login">로그인</button>
    </form>
    <router-link to="/register">
      <button class="register_btn btn">회원가입</button></router-link
    >
    <!-- 로그인 실패 메시지 -->
    <p
      class="error"
      :style="{ visibility: errorMessage ? 'visible' : 'hidden' }"
    >
      {{ errorMessage || '에러 메세지 영역' }}
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsersTableStore } from '@/stores/UsersTableStore.js'

// 라우터 및 라우트 객체 가져오기
const router = useRouter()
const route = useRoute()

// 사용자 입력 상태
const userInput = reactive({
  email: '',
  password: '',
})

// 아이디 저장 체크박스 상태
const rememberEmail = ref(false)

// 에러 메시지 상태
const errorMessage = ref('')

// 회원가입한 / 저장된 이메일 불러오기
onMounted(() => {
  // 회원가입 했을 경우
  if (route.query.email) {
    userInput.email = route.query.email
  } else {
    const remember = localStorage.getItem('rememberEmail')
    if (remember) {
      userInput.email = remember
      rememberEmail.value = true
    }
  }
})

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

  // 로그인
  store.loginUser(
    { email: userInput.email, password: userInput.password },
    successCallback,
    failCallback,
  )
  // 아이디 저장
  if (rememberEmail.value) {
    localStorage.setItem('rememberEmail', userInput.email)
  } else {
    localStorage.removeItem('rememberEmail')
  }
}
</script>

<style scoped>
/* 전체 하얀 박스 */
.app_wrapper {
  width: 520px;
  height: 700px;
  margin: 0 auto;
  padding: 50px 0 50px 0;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  box-shadow: var(--box-shadow-center);
}

/* h1 */
h1 {
  font-size: 26px;
  color: var(--main-font-color);
  margin-bottom: 100px;
}

/* 로그인 폼 박스 */
.form_box {
  display: flex;
  flex-direction: column;
  width: 370px;
  font-size: 14px;
  margin-bottom: 20px;
}
.input_login {
  height: 48px;
  padding-left: 1rem;
  border: 1px solid var(--btn-border-color);
  border-radius: 8px;
  margin: 5px 0 16px 0;
  font-weight: 400;
}
.input_login::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
/* 로그인 옵션 가로 정렬 */
.options_row {
  display: flex;
  align-items: center;
}
/* 체크박스와 레이블이 따로 떨어져서 하나로 묶어주는 클래스 */
.checkbox_wrapper {
  margin-left: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}
/* 체크박스 스타일 초기화에 따른 재설정 */
.checkbox_wrapper input[type='checkbox'] {
  transform: scale(1.2);
}

/* 로그인 버튼 스타일 */
.login_btn {
  margin-top: 3rem;
  background-color: #2fa26c;
  color: #ffffff;
}

/* 회원가입 버튼 스타일 */
.register_btn {
  color: var(--btn-main-color);
}

/* 로그인 / 회원가입 버튼 공통 스타일 */
.btn {
  border: 1px solid var(--btn-main-color);
  height: 48px;
  border-radius: 8px;
  width: 370px;
}

/* 로그인 실패 메세지 */
.error {
  color: red;
  margin-top: 5px;
}
</style>
