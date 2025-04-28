<script setup>
import { ref, defineEmits, onMounted, onBeforeUnmount } from 'vue'

// emit - 'TransactionPage.vue'에 메모 검색어 전달
const emit = defineEmits(['memoInputted'])

// 상태 변수 초기값 설정
const input_text = ref('') // 사용자가 입력하는 텍스트
const is_focused = ref(false) // 입력창 포커스 여부
const input_ref = ref(null) // 입력창 참조

// 외부 클릭 시 포커스 해제 처리 함수
function clickOuterHandler(e) {
  if (input_ref.value && !input_ref.value.contains(e.target)) {
    is_focused.value = false
  }
}

// 클릭 이벤트 발생 - 'enterKey / 돋보기' 클릭
function submitSearch() {
  emit('memoInputted', input_text.value)
}

// 컴포넌트가 mount되면 클릭 이벤트 등록
onMounted(() => {
  document.addEventListener('click', clickOuterHandler)
})

// 컴포넌트가 unmount되면 클릭 이벤트 제거 (메모리 누수 방지)
onBeforeUnmount(() => {
  document.removeEventListener('click', clickOuterHandler)
})
</script>

<template>
  <div class="memo_input_wrap" ref="input_ref">
    <!-- 검색어 입력창 -->
    <input
      v-model="input_text"
      @keydown.enter="submitSearch"
      @focus="is_focused = true"
      type="text"
      class="memo_input"
      placeholder="메모 검색"
    />
    <!-- 돋보기 (검색 버튼) -->
    <span class="search_icon" @click="submitSearch">
      <img
        id="magnifier"
        src="../img/icons/magnifying-glass-solid.png"
        alt="magnifier"
      />
    </span>
  </div>
</template>

<style scoped>
/* 1. 전체 검색창 wrap */
.memo_input_wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background-color: #fff;
  border-radius: 18px;
  max-width: 400px;
  width: 300px;
  transition: border-color 0.2s ease;
}

/* 2. wrap 내부 모든 요소 공통 배경색 */
.memo_input_wrap * {
  background-color: var(--white);
}

/* 3. 입력창 포커스 시 테두리 색상 강조 */
.memo_input_wrap:focus-within {
  border-color: var(--point-1-color);
}

/* 4. 검색 입력창 */
.memo_input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  background-color: transparent;
}

/* 5. 검색 버튼(돋보기) 영역 */
.search_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 6. 돋보기 아이콘 */
#magnifier {
  height: 25px;
  width: 25px;
  object-fit: contain;
  display: block;
}

/* 7. 돋보기 아이콘 hover 시 */
#magnifier:hover {
  cursor: pointer;
}
</style>
