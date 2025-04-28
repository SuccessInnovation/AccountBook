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

// props
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  reset_key: {
    type: Number,
    default: 0,
  },
})

// computed
const category_list = computed(() => ['전체', ...props.categories])

// emit
const emit = defineEmits(['categorySelected'])

// 상태 변수
const category_selected = ref('카테고리')
const is_open = ref(false)
const dropdown_ref = ref('')

// 함수
function toggleDropdown() {
  is_open.value = !is_open.value
}

function clickOuterHandler(e) {
  if (dropdown_ref.value && !dropdown_ref.value.contains(e.target)) {
    is_open.value = false
  }
}

function selectFilter(category) {
  category_selected.value = category
  emit('categorySelected', category === '전체' ? 'all' : category)
  is_open.value = false
}

// 컴포넌트 생명주기
onMounted(() => {
  document.addEventListener('click', clickOuterHandler)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clickOuterHandler)
})

// 드롭다운 표시용 텍스트
const display_category = computed(() => {
  if (category_selected.value === '카테고리') return '카테고리'
  if (category_selected.value === '전체') return '전체'
  return CATEGORY_MAP[category_selected.value] || category_selected.value
})

// reset_key 변경 감지
watch(
  () => props.reset_key,
  () => {
    category_selected.value = '카테고리'
  },
)
</script>

<template>
  <div class="filter_category" ref="dropdown_ref">
    <!-- 드롭다운 버튼 -->
    <div class="filter_btn" @click="toggleDropdown">
      <span>{{ display_category }}</span>
      <span class="icon_triangle">▼</span>
    </div>

    <!-- 드롭다운 항목 -->
    <ul v-if="is_open" class="category_list">
      <li
        v-for="category in category_list"
        :key="category"
        @click="selectFilter(category)"
        :class="{ selected: category === category_selected }"
      >
        {{ category === '전체' ? '전체' : CATEGORY_MAP[category] || category }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 1. 전체 드롭다운 영역 */
.filter_category {
  position: relative;
  width: 160px;
  font-size: 14px;
}

/* 2. 드롭다운 내부 공통 배경색 */
.filter_category * {
  background-color: var(--white);
}

/* 3. 드롭다운 버튼 */
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

/* 4. 드롭다운 버튼 hover */
.filter_btn:hover {
  background-color: #f9f9f9;
  border-color: #aaa;
}

/* 5. ▼ 아이콘 */
.icon_triangle {
  font-size: 12px;
  color: var(--point-1-color);
}

/* 6. 드롭다운 목록 */
.category_list {
  position: absolute;
  top: calc(100% + 4px);
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

/* 7. 드롭다운 항목 */
.category_list li {
  padding: 10px 14px;
  color: #333;
  cursor: pointer;
  transition: 0.2s;
}

/* 8. 드롭다운 항목 hover */
.category_list li:hover {
  background-color: #f0f0f0;
}

/* 9. 선택된 항목 */
.category_list li.selected {
  background-color: rgba(42, 125, 92, 0.2);
  font-weight: bold;
  color: var(--point-1-color);
}
</style>
