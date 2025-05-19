<script setup>
import { ref, defineEmits, onMounted, onBeforeUnmount } from 'vue'

// emit - 'TransactionPage.vue'에 메모 검색어 전달
const emit = defineEmits(['memoInputted'])

// 상태변수 초기값 설정

// 사용자가 입력 "하는" 텍스트를 저장 - 기본: ''
const inputText = ref('')
// 입력창 포커스 여부 - 기본값: false
const isFocused = ref(false)
// 사용자가 입력 "중인" 텍스트 저장  - 기본:null
const inputRef = ref(null)

// 외부 클릭 시 포커스 해제 처리 함수
const clickOuterHandler = e => {
  // 클릭한 요소가 입력창 (inputRef) 을 포함하지 않는 경우
  if (inputRef.value && !inputRef.value.contains(e.target)) {
    isFocused.value = false
  }
}

// 컴포넌트가 mount되면 클릭 이벤트 등록
onMounted(() => {
  document.addEventListener('click', clickOuterHandler)
})

// 컴포넌트가 unmount되면 클릭 이벤트 제거 (메모리 누수 방지)
onBeforeUnmount(() => {
  document.removeEventListener('click', clickOuterHandler)
})

// 클릭 이벤트 발생 - 'enterKey / 돋보기' 클릭
const submitSearch = () => {
  emit('memoInputted', inputText.value)
}
</script>

<template>
  <div class="memo_input_wrap" ref="inputRef">
    <!-- 검색어 입력창 -->
    <!-- 포커스 되면 상태 저장 -->
    <input
      v-model="inputText"
      @keydown.enter="submitSearch"
      @focus="isFocused = true"
      type="text"
      class="memo_input"
      placeholder="메모 검색"
    />

    <!-- 입력 즉시 결과 보고 싶으면 @input="onInput" -->

    <!-- 돋보기 (검색 버튼) -->
    <span class="search_icon" @click="submitSearch"
      ><img
        id="magnifier"
        src="../img/icons/magnifying-glass-solid.png"
        alt="magnifier"
    /></span>
  </div>
</template>

<style scoped>
/* 입력창 관련 모든 요소에 공통 배경색 적용 */
.memo_input_wrap * {
  background-color: var(--white);
}

/* 전체 검색창 영역  */
.memo_input_wrap {
  display: flex; /* 내부 요소 가로 정렬 */
  align-items: center; /* 수직 정렬 */
  gap: 12px; /* 입력창 - 아이콘 사이 여백 */
  padding: 10px 16px;
  background-color: #fff;
  border-radius: 18px;
  max-width: 400px;
  width: 300px;
  transition: border-color 0.2s ease;
}

/* 수정 필요 */
/* 입력창 포커스 시 테두리 색상 강조 */
.memo_input_wrap:focus-within {
  border-color: var(--point-1-color);
}

/* 검색 입력창 */
.memo_input {
  flex: 1; /* 남은 공간 채우기 */
  border: none;
  outline: none; /* 포커스 시 외곽선 제거 */
  font-size: 18px;
  background-color: transparent;
}

/* 검색 버튼 (돋보기 아이콘 감싸는 영역) */
.search_icon {
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  cursor: pointer;
}

/* 돋보기 아이콘 */
#magnifier {
  height: 25px;
  width: 25px;
  object-fit: contain;
  display: block;
}

/* 돋보기 (검색버튼) hover이벤트 */
#magnifier:hover {
  cursor: pointer;
}
</style>
