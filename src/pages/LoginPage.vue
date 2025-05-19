<script setup>
import LoginForm from '@/components/users/LoginForm.vue'
</script>

<template>
  <div class="LoginPage">
    <LoginForm />
  </div>
</template>

<style scoped>
.LoginPage {
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
