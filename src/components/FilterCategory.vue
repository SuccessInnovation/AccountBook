<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue'
import { CATEGORY_MAP } from '@/constants/categories'

// props - 'TransactionPage.vue'로부터 '카테고리/resetKey' 전달받음
const props = defineProps({
  // 카테고리 목록 (['food', 'dessert', ...])
  categories: {
    type: Array,
    required: true,
  },
  // resetKey : 체크박스 상태 변경 시 드롭다운 초기화
  resetKey: {
    type: Number,
    default: 0,
  },
})

// (드롭다운) 카테고리 목록에 '전체' 추가
const categoryList = computed(() => ['전체', ...props.categories])

// emit - 'TransactionPage.vue'에 선택된 카테고리 전달
const emit = defineEmits(['categorySelected'])

// 상태변수 초기값 설정

// 선택된 카테고리 - 기본: 카테고리
const categorySelected = ref('카테고리')
// 드롭다운 open/close 상태  - 기본: false(close)
const isOpen = ref(false)
// 드롭다운 외부 영역 클릭 상태 감지
const dropdownRef = ref('')

// 드롭다운 토글 함수 클릭 -> open/close (true/false) 상태 변경
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 외부 영역 클릭 시 드롭다운 닫기 함수 - 상태: close (false)
const clickOuterHandler = e => {
  // 드롭다운 요소가 존재 & 클릭 대상이 바깥 영역일 경우
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

// 컴포넌트가 mount되면 문서 전체에 클릭 이벱트 등록
onMounted(() => {
  document.addEventListener('click', clickOuterHandler)
})

// 컴포넌트가 unmount되면 클릭 이벤트 제거 (메모리 누수 방지)
onBeforeUnmount(() => {
  document.removeEventListener('click', clickOuterHandler)
})

// 카테고리 항목 클릭 시 실행 함수
const selectFilter = category => {
  // 선택된 카테고리 값 변경
  categorySelected.value = category
  // emit - 'TransactionPage.vue'에 선택된 카테고리 값 전달
  // 카테고리가 '전체'면 'all'로 변환
  emit('categorySelected', category === '전체' ? 'all' : category)
  isOpen.value = false // 드롭다운 닫기
}

// 'restKey' 변경 감지
watch(
  () => props.resetKey,
  // 선택된 카테고리 텍스트 초기화
  () => {
    categorySelected.value = '카테고리'
  },
)
</script>

<template>
  <div class="filter_category" ref="dropdownRef">
    <!-- 드롭다운 버튼 -->
    <div class="filter_btn" @click="toggleDropdown">
      <!-- 선택된 카테고리 항목명 (기본: 카테고리) -->
      <span>{{
        categorySelected === '카테고리'
          ? '카테고리'
          : CATEGORY_MAP[categorySelected]
      }}</span>
      <!-- ▼ 아이콘 -->
      <span class="icon_triangle">▼</span>
    </div>

    <!-- 드롭다운 항목 -->
    <ul v-if="isOpen" class="category_list">
      <!-- 카테고리 목록 렌더링-->
      <li
        v-for="category in categoryList"
        :key="category"
        @click="selectFilter(category)"
        :class="{ selected: category === categorySelected }"
      >
        <!-- '전체'만 그대로 표시, 나머지는 한글로 매핑 -->
        {{ category === '전체' ? '전체' : CATEGORY_MAP[category] || category }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 드롭다운 내부의 모든 요소에 공통 배경색 적용 */
.filter_category * {
  background-color: var(--white);
}

/* 전체 드롭다운 영역 */
.filter_category {
  position: relative;
  width: 160px;
  font-size: 14px;
}

/* 드롭다운 버튼 (카테고리 + ▼ 아이콘 포함) */
.filter_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 15px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 드롭다운 버튼 hover 이벤트 */
.filter_btn:hover {
  background-color: #f9f9f9;
  border-color: #aaa;
}

/* ▼ 아이콘 */
.icon_triangle {
  font-size: 12px;
  color: var(--point-1-color);
}

/* 드롭다운 목록 */
.category_list {
  position: absolute;
  top: calc(100% + 4px); /* 버튼 바로 아래에 배치 */
  left: 0;
  width: 100%;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 220px;
  overflow-y: auto;
}

/* 드롭다운 항목 */
.category_list li {
  padding: 10px 14px;
  color: #333;
  cursor: pointer;
  transition: 0.2s;
}

/* 드롭다운 항목 hover 이벤트 */
.category_list li:hover {
  background-color: #f0f0f0;
}

/* 선택된 카테고리 항목 */
.category_list li.selected {
  background-color: rgba(42, 125, 92, 0.2);
  font-weight: bold;
  color: var(--point-1-color);
}
</style>
