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
import { useUsersTableStore } from '@/stores/UsersTableStore'

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
    meta: { title: '마이페이지', layout: 'default' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { title: '관리자페이지', layout: 'default' },
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

router.beforeEach((to, from, next) => {
  const userStore = useUsersTableStore()
  const userInfo = userStore.getUserInfoLocalStorage?.()
  const isAuthenticated = !!userInfo
  // 로그인이 필요한 라우터
  const authRequiredRoutes = [
    'MyPage',
    'Admin',
    'Home',
    'Transaction',
    'Statistics',
    'Exports',
    'Budget',
  ]

  if (authRequiredRoutes.includes(to.name) && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

// 화면 전환 전 후
router.afterEach((to, from) => {
  console.log(`✅ 이동 완료: ${from.fullPath} ➡ ${to.fullPath}`)
})
export default router
