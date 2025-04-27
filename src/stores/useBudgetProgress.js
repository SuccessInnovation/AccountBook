import { ref, onMounted, watch } from 'vue'
import { statisticsStore } from '@/stores/statisticsStore' // 경로 맞게 조정 필요
import { useBudgetStore } from '@/stores/UseBudgetStore'
import { use_calendar_store } from '@/stores/MonthSelector'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_MAP,
  CATEGORY_IMG,
} from '@/constants/categories'

export function useBudgetProgress() {
  const statistics = statisticsStore()
  const store = useBudgetStore()
  const calendar = use_calendar_store()

  // 입력 데이터 저장용
  const expenseData = ref([])
  const incomeData = ref([])

  // @params = 전체 예산, 전체 지출, 전체 비율
  const totalBudget = ref(0)
  const totalSpent = ref(0)
  const totalIncome = ref(0)
  const overallPercent = ref(0)
  const totalLeft = ref(0)

  // @params = 예산이 설정되지 않더라도 카테고리를 모두 더하는 함수
  const rawTotalBudget = ref(0)
  const rawTotalSpent = ref(0)
  const rawTotalIncome = ref(0)

  //#region 함수 기능
  /**
   * 한달 지출을 불러와서 카테고리별로 예산에 다른 지출 비율 계산 함수
   * @param {number} spent = 지출
   * @param {number} budget = 예산
   * @param {number} percent = 지출/예산 비율
   *return 카테고리명, 지출, 예산, 계산값
   */
  const loadExpensebyMonth = async (startDate, endDate, selectedMonth) => {
    // 한 달의 데이터를 불러와서 지출만 expenses에 저장
    const result = await statistics.fetchTransactionsByPeriod(
      startDate,
      endDate,
    )
    // 월 데이터를 잘 불러오고 있는지 확인 콘솔
    // console.log('월별 전체 거래 데이터', result)

    const expenses = result.filter(exp => exp.type === 'expense')
    const incomes = result.filter(exp => exp.type === 'income')

    // 카테코리 별 지출을 카테고리-금액으로 저장
    const spendingByCategory = {}
    expenses.forEach(r => {
      const cat = r.category
      const amount = r.amount ?? 0
      spendingByCategory[cat] = (spendingByCategory[cat] || 0) + amount
    })

    // 카테코리 별 수입 카테고리-금액으로 저장
    const incomeByCategory = {}
    incomes.forEach(r => {
      const cat = r.category
      const amount = r.amount ?? 0
      incomeByCategory[cat] = (incomeByCategory[cat] || 0) + amount
    })

    //   선택 월의 예산을 불러옴
    await store.fetchBudgets(selectedMonth, { force: true })

    //   카테고리 별 예산을 저장

    const budgetByCategory = Object.fromEntries(
      store.budgets.map(b => [b.category, b.amount]),
    )

    expenseData.value = EXPENSE_CATEGORIES.filter(
      cat => (budgetByCategory[cat] || 0) > 0,
    ).map(cat => {
      const spent = spendingByCategory[cat] || 0
      const budget = budgetByCategory[cat] || 0
      const percent = Math.min(100, ((spent / budget) * 100).toFixed(1))
      const left = budget - spent
      return {
        category: cat,
        name: CATEGORY_MAP[cat],
        icon: CATEGORY_IMG[cat],
        spent,
        budget,
        percent,
        left,
      }
    })

    incomeData.value = INCOME_CATEGORIES.map(cat => {
      const income = incomeByCategory[cat] || 0
      return {
        category: cat,
        name: CATEGORY_MAP[cat],
        income,
      }
    })

    //   총 지출, 총 예산을 계산
    totalBudget.value = expenseData.value.reduce(
      (sum, item) => sum + item.budget,
      0,
    )

    totalSpent.value = expenseData.value.reduce(
      (sum, item) => sum + item.spent,
      0,
    )
    totalIncome.value = incomeData.value.reduce(
      (sum, item) => sum + item.income,
      0,
    )

    overallPercent.value =
      totalBudget.value === 0
        ? 0
        : Math.min(
            100,
            ((totalSpent.value / totalBudget.value) * 100).toFixed(1),
          )

    totalLeft.value = totalBudget.value - totalSpent.value

    // 1. 전체 지출 합계
    rawTotalSpent.value = EXPENSE_CATEGORIES.reduce((sum, cat) => {
      return sum + (spendingByCategory[cat] || 0)
    }, 0)

    // 2. 전체 예산 합계
    rawTotalBudget.value = EXPENSE_CATEGORIES.reduce((sum, cat) => {
      return sum + (budgetByCategory[cat] || 0)
    }, 0)

    // 3. 전체 수입 합계
    rawTotalIncome.value = INCOME_CATEGORIES.reduce((sum, cat) => {
      return sum + (incomeByCategory[cat] || 0)
    }, 0)
    // 1. 전체 지출 합계
    rawTotalSpent.value = EXPENSE_CATEGORIES.reduce((sum, cat) => {
      return sum + (spendingByCategory[cat] || 0)
    }, 0)

    // 2. 전체 예산 합계
    rawTotalBudget.value = EXPENSE_CATEGORIES.reduce((sum, cat) => {
      return sum + (budgetByCategory[cat] || 0)
    }, 0)

    // 3. 전체 수입 합계
    rawTotalIncome.value = INCOME_CATEGORIES.reduce((sum, cat) => {
      return sum + (incomeByCategory[cat] || 0)
    }, 0)
  }
  // endregion

  const refresh = async () => {
    await loadExpensebyMonth(
      calendar.monthStartDate,
      calendar.monthEndDate,
      calendar.monthKey,
    )
  }
  onMounted(refresh)

  // 달 변경되면 자동으로 다시 계산
  watch(
    () => [calendar.monthStartDate, calendar.monthEndDate, calendar.monthKey],
    refresh,
  )
  return {
    expenseData,
    incomeData,
    totalBudget,
    totalSpent,
    totalIncome,
    overallPercent,
    totalLeft,
    refresh,

    // 새로 추가된 "전체 기준" 합계
    rawTotalBudget,
    rawTotalSpent,
    rawTotalIncome,
  }
}
