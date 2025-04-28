<script setup>
import { ref } from 'vue'

// 메뉴 목록
const menuLists = [
  { label: 'HOME', to: '/home' },
  { label: '수입/지출 내역', to: '/transaction' },
  {
    label: '통계 및 내보내기',
    submenu: [
      { label: '요약 통계', to: '/statistics/summary' },
      { label: '엑셀 내보내기', to: '/statistics/export' },
    ],
  },
  { label: '예산', to: '/budget' },
]

// 메뉴 버튼 클릭 시 메뉴 목록 표시
const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// '통계' 메뉴 버튼 클릭 시 하위 메뉴 목록 표시
const showStatsSubMenu = ref(false)
const toggleStatsSubMenu = () => {
  showStatsSubMenu.value = !showStatsSubMenu.value
}
</script>

<template>
  <div class="snb_grid">
    <!-- 데스크탑 화면 (≥992px): 사이드바 -->
    <!-- 태블릿 화면 (992px): 사이드바 (메뉴 버튼 클릭 시) -->
    <!-- 모바일 화면 (<=768px): 사이드바 (메뉴 버튼 클릭 시) -->
    <div class="snb snb_tablet_mobile" :class="{ open: showMenu }">
      <div class="snb_container">
        <ul class="list-group list-group-flush">
          <template
            v-for="(menu, index) in menuLists"
            :key="'desktop-' + index"
          >
            <li class="list-group-item" v-if="!menu.submenu">
              <router-link :to="menu.to">{{ menu.label }}</router-link>
            </li>
            <li class="list-group-item submenu_wrapper" v-else>
              <div @click="toggleStatsSubMenu" style="cursor: pointer">
                {{ menu.label }}
              </div>
              <ul class="submenu" :class="{ submenu_open: showStatsSubMenu }">
                <li
                  v-for="(sub, subIndex) in menu.submenu"
                  :key="'desktop-sub-' + subIndex"
                  class="sub_item"
                  :class="{ 'pt-3': subIndex === 0, 'pt-2': subIndex !== 0 }"
                >
                  <router-link :to="sub.to">{{ sub.label }}</router-link>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <!-- // 큰 화면: 사이드바 -->

    <!-- 태블릿/모바일 (992px 미만): 메뉴 버튼 -->
    <nav class="snb navbar d-lg-none" id="snb_btn_area">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" @click="toggleMenu">
          <img
            src="../../img/icons/bars-solid.svg"
            alt="메뉴버튼"
            id="toggler_icon"
          />
        </button>
      </div>
    </nav>
    <!-- // 태블릿/모바일 (992px 미만): 메뉴 버튼 -->
  </div>
</template>

<style scoped>
/* 모든 사이드바 적용 */
.snb_grid {
  position: relative;
  background-color: var(--color-point-5);
  align-items: center;
  height: 100%;
}
.snb {
  height: calc(100vh - 100px); /* 100px = header height*/
  font-size: 16px;
  font-weight: 700;
}
.list-group-item {
  background-color: transparent;
  border: none;
  padding: 20px 10px 20px 50px;
  color: var(--color-font-main);
}
.list-group-item:hover > a,
.list-group-item:hover > div,
.sub_item:hover {
  color: var(--color-point-1);
  transition: 0.3s;
}
.submenu {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition:
    max-height 1s ease,
    opacity 0.3s ease;
}
.submenu.submenu_open {
  max-height: 250px;
  opacity: 1;
}
.router-link-active {
  color: var(--color-point-1);
}
/* 테블렛/모바일 화면에 표시되는 메뉴버튼 */
#snb_btn_area {
  background-color: var(--color-point-5);
  padding-top: 0;
  padding-bottom: 0;
  align-items: start;
  width: 100%;
  height: calc(100vh - 100px);
  z-index: 1000;
}
.container-fluid {
  padding: 0;
}
.navbar-toggler {
  padding: 12.5px;
  border: none;
}
.navbar-toggler:focus {
  outline: none;
  box-shadow: none;
}
#toggler_icon {
  width: 25px;
  height: 25px;
}

/* 태블릿 화면: 사이드바 */
@media screen and (min-width: 768.01px) and (max-width: 991.98px) {
  .snb_tablet_mobile {
    position: absolute;
    top: 0px;
    left: -200px; /* 화면 바깥 위치 */
    width: 200px;
    height: 100%;
    background-color: var(--color-point-5);
    transition: left 1s ease;
    z-index: 500;
  }
  .snb_tablet_mobile.open {
    left: 50px; /* 오른쪽으로 슬라이드 인 */
    top: 0px;
    transition: 1s ease;
  }
}
/* 모바일 화면: 사이드바  */
@media screen and (max-width: 768px) {
  #snb_btn_area {
    height: 100%;
  }
  .snb_tablet_mobile {
    background-color: var(--color-point-5);
    position: absolute;
    top: -150px; /* 화면 바깥 위치 */
    width: 100%;
    height: auto;
    transition: top 1s ease;
    z-index: 500;
  }
  .snb_tablet_mobile.open {
    top: 50px; /* 아래로 슬라이드 인 */
    transition: 1s ease;
  }
  .snb_tablet_mobile .list-group-item {
    padding: 10px 10px 10px 50px;
  }
}
</style>
