<script setup>
import { ref } from 'vue'
import PopupPage from '@/pages/PopupPage.vue'

// 팝업 노출 상태 여부
const show_popup = ref(false)

// 버튼 클릭 시 팝업 열기
function goToPopup() {
  show_popup.value = true
}
</script>

<template>
  <!-- 하단 추가 버튼 -->
  <div class="add-button-area">
    <button class="add-button" @click="goToPopup">추가 +</button>
  </div>

  <!-- 팝업이 열릴 때만 보여짐 -->
  <PopupPage v-if="show_popup" @close="show_popup = false" />
</template>

<style scoped>
/* 하단 추가 버튼 감싸는 영역 */
.add-button-area {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
}

/* 추가 버튼 스타일*/
.add-button {
  background-color: var(--color-point-3);
  color: #fff;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: var(--color-point-1);
}
</style>
