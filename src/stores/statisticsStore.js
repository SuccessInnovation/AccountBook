import { defineStore } from 'pinia'
import axios from 'axios'
import {
  calculateCategoryTotals,
  calculateMonthlyTotals,
  calculateNetProfit,
} from '@/utils/statistics'
import { use_calendar_store } from '@/stores/MonthSelector'

// BASE_URI (db.json)
import { BASE_URI } from '@/constants/api'

export const statisticsStore = defineStore('statistics', {
  state: () => ({
    transactions: [],
    filteredTransaction: [],
    // 알림 상태 추가
    notifications: [],
    // 통계용 데이터
    monthlyCategoryData: {},
    monthlyExpenseData: {},
    monthlyIncomeData: {},
    netProfitData: {},
  }),

  // 컴포넌트에서 바로 사용 가능한 계산된 값들
  getters: {
    getNetProfit: state => state.netProfitData.netProfit ?? 0,
    getIncome: state => state.netProfitData.income ?? 0,
    getExpense: state => state.netProfitData.expense ?? 0,
  },

  actions: {
    //#region 기간으로 조회 기능
    /**
     * 1개월, 3개월, 설정기간 별로 데이터 불러오기
     * @params StartDate, endDate = 시작 날짜, 끝 날짜 받아오는 값
     *
     *return : 기간별로 필터링된 결과 -> 컴포넌트로 전송
     */
    async fetchTransactionsByPeriod(startDate, endDate) {
      try {
        const res = await axios.get(`${BASE_URI}/transactions`)
        // data 내림차순 정렬
        this.transactions = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        )

        const today = new Date() // 오늘 날짜
        const defaultStart = new Date()
        defaultStart.setMonth(today.getMonth() - 1) // 기본 설정값 : 1개월

        // 실제 시작/끝 날짜 설정 (입력이 없으면 default값)
        const start = startDate ? new Date(startDate) : defaultStart
        const end = endDate ? new Date(endDate) : today

        // db에서 date(날짜)로 불러와서 특정 기간에만 필터링
        const filtered = this.transactions.filter(tr => {
          const transactionDate = new Date(tr.date)
          return transactionDate >= start && transactionDate <= end
        })

        this.filteredTransaction = filtered

        // 꼭 필터링 끝난 후 통계 계산 (순서 중요)
        this.calculateStatistics()

        return filtered
      } catch (err) {
        this.error = err.message
        return []
      } finally {
        this.loading = false
      }
    },
    // endregion

    //#region 통계 계산 기능 - 박채연
    /**
     * 현재 필터링된 거래 내역 기준으로 통계 데이터를 계산
     */
    calculateStatistics() {
      const calendar = use_calendar_store()

      // 카테고리별 월간 지출
      this.monthlyCategoryData = calculateCategoryTotals(
        this.filteredTransaction,
      )

      // 월별 지출
      this.monthlyExpenseData = calculateMonthlyTotals(
        this.transactions,
        'expense',
        calendar.current_year,
        calendar.current_month,
      )

      // 월별 수입
      this.monthlyIncomeData = calculateMonthlyTotals(
        this.transactions,
        'income',
        calendar.current_year,
        calendar.current_month,
      )

      // 순이익
      this.netProfitData = calculateNetProfit(this.filteredTransaction)
    },
    // endregion
  },
})
