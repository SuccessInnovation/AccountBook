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
  background-color: var(--color-point-4);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
