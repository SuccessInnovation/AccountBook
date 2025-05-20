<script setup>
import RegisterForm from '@/components/users/RegisterForm.vue'
</script>

<template>
  <div class="RegisterPage">
    <RegisterForm />
  </div>
</template>

<style scoped>
.RegisterPage {
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
