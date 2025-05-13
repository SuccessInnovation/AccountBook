import { defineStore } from 'pinia'
import axios from 'axios'

const BudgetURL = 'http://localhost:3000/budgets'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgets: [], // 예산 목록
  }),
  actions: {
    async fetchBudgets(month = null) {
      // month가 없으면 현재 날짜로 자동 설정
      if (!month) {
        const today = new Date()
        const year = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, '0')
        month = `${year}-${m}`
      }

      // 예산 데이터의 month를 기준으로 데이터 가져오기
      try {
        const res = await axios.get(`${BudgetURL}?month=${month}`)
        this.budgets = res.data
      } catch (err) {
        console.error('예산 불러오기 실패:', err)
      }
    },

    // 예산 추가
    async addBudget(budget) {
      try {
        const res = await axios.post(BudgetURL, budget)
        this.budgets.push(res.data)
      } catch (err) {
        console.error('예산 저장 실패:', err)
      }
    },

    // 예산 업데이트
    async updateBudget(id, updatedData) {
      try {
        const res = await axios.put(`${BudgetURL}/${id}`, updatedData)
        const index = this.budgets.findIndex(b => b.id === id)
        if (index !== -1) this.budgets[index] = res.data
      } catch (err) {
        console.error('예산 수정 실패:', err)
      }
    },

    // 예산 삭제
    async deleteBudget(id) {
      try {
        await axios.delete(`${BudgetURL}/${id}`)
        this.budgets = this.budgets.filter(b => b.id !== id)
      } catch (err) {
        console.error('예산 삭제 실패:', err)
      }
    },
  },
})
