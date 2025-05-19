import { defineStore } from 'pinia'
import axios from 'axios'

// BASE_URI (db.json)
import { BASE_URI } from '@/constants/api'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    // db.json의 "records" 데이터를 담는 배열
    transactions: [],
  }),
  actions: {
    // 거래 내역 불러오기: 날짜(date) 기준 내림차순 정렬
    async fetchTransactions() {
      try {
        const res = await axios.get(`${BASE_URI}/transactions`)
        // 거래 데이터를 date를 기준으로 최신순(내림차순) 정렬
        this.transactions = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        )
      } catch (error) {
        console.error('거래 내역 불러오기 오류:', error)
      }
    },
    // 특정 id 거래 삭제 액션
    async deleteTransaction(id) {
      try {
        await axios.delete(`${BASE_URI}/transactions/${id}`)
        this.transactions = this.transactions.filter(item => item.id !== id)
      } catch (error) {
        console.error('거래 삭제 오류:', error)
      }
    },
    // 거래 업데이트(수정) 액션
    async updateTransaction(id, updatedData) {
      try {
        const response = await axios.put(
          `${BASE_URI}/transactions/${id}`,
          updatedData,
        )
        // 수정된 데이터로 로컬 배열 업데이트
        this.transactions = this.transactions.map(item =>
          item.id === id ? response.data : item,
        )
      } catch (error) {
        console.error('거래 수정 오류:', error)
      }
    },
  },
})
