import { createRouter, createWebHistory } from 'vue-router'

// 페이지 import
import StartPage from '@/pages/StartPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import MyPage from '@/pages/MyPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import HomePage from '@/pages/HomePage.vue'
import TransactionPage from '@/pages/TransactionPage.vue'
import PopupPage from '@/pages/PopupPage.vue'
import StatisticsPage from '@/pages/StatisticsPage.vue'
import BudgetPage from '@/pages/BudgetPage.vue'
import ExportExcelPage from '@/pages/ExportExcelPage.vue'
// import TransactionEdit from '@/pages/TransactionEditPage.vue'
// import TransactionEditPage from '@/pages/TransactionEditPage.vue'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomePage, // 홈 경로는 HomePage.vue로
    meta: { title: 'HOME', layout: 'default' },
  },
  {
    path: '/',
    name: 'Start',
    component: StartPage,
    meta: {
      title: '시작',
      layout: 'none',
      backgroundColor: '#b7ccb4',
      centerContent: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      title: '로그인',
      layout: 'none',
      backgroundColor: '#b7ccb4',
      centerContent: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { title: '회원가입', layout: 'none' },
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: MyPage,
    meta: { title: '마이 페이지', layout: 'none' },
  },
  {
    path: '/adminpage',
    name: 'AdminPage',
    component: AdminPage,
    meta: { title: '관리자 페이지', layout: 'none' },
  },
  {
    path: '/transaction',
    name: 'Transaction',
    component: TransactionPage,
    meta: { title: '수입/지출 내역', layout: 'default' },
  },
  {
    path: '/popup',
    name: 'Popup',
    component: PopupPage,
    meta: { layout: 'default' },
  },
  //   {
  //     path: '/transaction/edit/:id',
  //     name: 'TransactionEdit',
  //     component: TransactionEditPage,
  //   },
  {
    path: '/statistics/summary',
    name: 'Statistics',
    component: StatisticsPage,
    meta: { title: '통계 - 요약 통계', layout: 'default' },
  },
  {
    path: '/statistics/export',
    name: 'Exports',
    component: ExportExcelPage,
    meta: { title: '통계 - 엑셀 내보내기', layout: 'default' },
  },
  {
    path: '/budget',
    name: 'Budget',
    component: BudgetPage,
    meta: { title: '예산', layout: 'default' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
// 전역 네비게이션 가드 (로그인 체크, 타이틀 설정 등)
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token') // 예: JWT 토큰 기반 로그인 체크

  // 인증 필요한 페이지 접근 시 로그인 여부 확인
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    // 타이틀 설정
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  }
})

// 페이지 이동 후 처리 (예: 로딩 스피너 종료 등)
router.afterEach((to, from) => {
  // 예: console.log 또는 전역 로딩 상태 OFF
  console.log(`✅ Moved to ${to.fullPath}`)
})

export default router
