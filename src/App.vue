<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Layout from './components/layout/TheLayout.vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheSidebar from './components/layout/TheSidebar.vue'
import TheFooter from './components/layout/TheFooter.vue'

const route = useRoute()

const layout = computed(() => route.meta.layout || 'default')
</script>

<template>
  <!-- 시작, 로그인/회원가입 화면 -->
  <div v-if="layout === 'none'">
    <router-view />
  </div>
  <!-- 로그인 성공 시 접속 화면 -->
  <div v-else>
    <Layout>
      <template v-slot:header>
        <TheHeader />
      </template>
      <template v-slot:sidebar>
        <TheSidebar />
      </template>
      <template v-slot:content>
        <router-view style="flex: 1" />
      </template>
      <template v-slot:footer>
        <TheFooter />
      </template>
    </Layout>
  </div>
</template>

<style scoped></style>
