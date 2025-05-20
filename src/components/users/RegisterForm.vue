<template>
  <div class="app_wrapper">
    <h1>회원가입</h1>
    <form
      action=""
      method="post"
      @submit.prevent="register"
      class="form_box"
      novalidate
    >
      <label for="name">Name</label>
      <input
        class="input_register"
        type="text"
        name="name"
        id="name"
        placeholder="이름"
        v-model="userInput.name"
      />
      <label for="email">Email</label>
      <input
        class="input_register"
        type="email"
        name="email"
        id="email"
        placeholder="이메일"
        v-model="userInput.email"
      />
      <label for="password">Password</label>
      <input
        class="input_register"
        type="password"
        name="password"
        id="password"
        placeholder="비밀번호"
        v-model="userInput.password1"
      />
      <label for="password_chk">Confirm Password</label>
      <input
        class="input_register"
        type="password"
        name="password_chk"
        id="password_chk"
        placeholder="비밀번호 확인"
        v-model="userInput.password2"
      />
      <button class="register_btn">회원가입</button>
    </form>
    <!-- 회원가입 실패 메시지 -->
    <p
      class="error"
      :style="{ visibility: errorMessage ? 'visible' : 'hidden' }"
    >
      {{ errorMessage || '에러 메세지 영역' }}
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersTableStore } from '@/stores/UsersTableStore.js'

// 라우터 객체 가져오기
const router = useRouter()

// 사용자 입력 상태
const userInput = reactive({
  name: '',
  email: '',
  password1: '',
  password2: '',
})

// 에러 메시지 상태
const errorMessage = ref('')

// 회원가입 성공 시
const successCallback = email => {
  errorMessage.value = '' // 성공 시 메시지 초기화
  router.push({ name: 'Login', query: { email: email } })
  console.log('회원가입 성공')
}

// 회원가입 실패 시
const failCallback = message => {
  errorMessage.value = message || '회원가입 실패'
  console.log('회원가입 실패')
}

// 회원가입 처리
const register = () => {
  const store = useUsersTableStore()

  // 회원가입
  store.registerUser(
    {
      name: userInput.name,
      email: userInput.email,
      password1: userInput.password1,
      password2: userInput.password2,
    },
    () => successCallback(userInput.email), // 유효성 통과 후에만 호출
    failCallback, // 검증 실패 시 호출
  )
}
</script>

<style scoped>
/* 전체 하얀 박스 */
.app_wrapper {
  width: 520px;
  height: 700px;
  margin: 0 auto;
  padding: 50px 0 0 0;
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
  margin-bottom: 80px;
}

/* 폼 박스 */
.form_box {
  display: flex;
  flex-direction: column;
  width: 370px;
  font-size: 14px;
  margin-bottom: 10px;
}
.input_register {
  height: 48px;
  padding-left: 1rem;
  border: 1px solid var(--btn-border-color);
  border-radius: 8px;
  margin: 5px 0 16px 0;
  font-weight: 400;
}
.input_register::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

/* 회원가입 버튼 스타일 */
.register_btn {
  margin-top: 1rem;
  background-color: #2fa26c;
  color: #ffffff;
  height: 48px;
  border-radius: 8px;
  width: 370px;
}

/* 회원가입 실패 메세지 */
.error {
  color: red;
}
</style>
