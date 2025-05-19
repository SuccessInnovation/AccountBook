import { defineStore } from 'pinia'
import axios from 'axios'
import { reactive } from 'vue'
import { BASE_URI } from '@/constants/api' // BASE_URI (db.json)
import { isEmpty, isValidPassword, validateUserInput } from '@/utils/validators'
import { currentTimestampToString, currentDateToString } from '@/utils/date'
import { createTestJwt, parseJwt } from '@/utils/jwt'

export const useUsersTableStore = defineStore('users', () => {
  // 로컬 스토리지 관련 함수 - state에서 사용하므로 먼저 정의함
  const getUserInfoLocalStorage = () => {
    try {
      const data = localStorage.getItem('userInfo')
      console.log('로컬 스토리지에 저장된 userInfo:', data)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('❌ 로컬 스토리지에서 userInfo 가져오기 실패:', error)
      return null
    }
  }

  const setUserInfoLocalStorage = userInfo => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      console.log('✅ 로컬 스토리지에 userInfo 저장됨:', userInfo)
    } catch (error) {
      console.error('❌ 로컬 스토리지에 userInfo 저장 실패:', error)
    }
  }

  // State 정의 (usersList)
  const state = reactive({
    usersList: [],
    currentUser: getUserInfoLocalStorage(),
  })

  // API: 전체 사용자 조회
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URI}/users`)
      if (response.status === 200) {
        state.usersList = response.data
        return response.data
      } else {
        console.log('❌ 사용자 목록 조회 실패')
      }
    } catch (error) {
      console.error('❌ 사용자 목록 조회 에러:', error)
    }
  }

  // API: ID로 특정 사용자 조회
  const getUserInfoById = async (id, successCallback) => {
    try {
      const response = await axios.get(`${BASE_URI}/users/${id}`)
      console.log('response:', response)
      if (response.status === 200) {
        const userInfo = response.data
        successCallback(userInfo)
        console.log('userInfo from db by id: ', userInfo)
        return userInfo
      } else {
        console.log('❌ 사용자 정보 조회 실패')
      }
    } catch (error) {
      console.error('❌ 사용자 정보 조회 에러:', error)
    }
  }

  // API: 사용자 추가
  const addUser = async ({ email, password, name }, successCallback) => {
    if (!validateUserInput({ email, password, name })) return
    const isDuplicate = state.usersList.some(user => user.email === email)
    if (isDuplicate) return console.log('⚠️ 이미 존재하는 이메일입니다.')
    const payload = {
      id: currentTimestampToString(),
      email,
      password,
      name,
      createdAt: currentDateToString(),
      updatedAt: null,
      status: 'active',
      role: 'user',
    }

    try {
      const response = await axios.post(`${BASE_URI}/users`, payload)
      if (response.status === 200 || response.status === 201) {
        await fetchUsers()
        successCallback?.()
      } else {
        console.log('❌ 사용자 추가 실패')
      }
    } catch (error) {
      console.error('❌ 사용자 추가 에러:', error)
    }
  }

  // API: 사용자 정보 수정
  const updateUser = async (
    { id, email, password, name, profileImage },
    successCallback,
  ) => {
    // 사용자가 없는 경우
    if (state.usersList.length === 0) {
      console.log('no users in usersList', state.usersList)
      await fetchUsers()
    }
    const originalUserInfo = state.usersList.find(user => user.id === id)
    console.log('originalUserInfo: ', originalUserInfo)

    // 기존 값이 비어 있으면 현재 사용자 정보로 대체
    if (isEmpty(email)) email = originalUserInfo.email
    if (isEmpty(password)) password = originalUserInfo.password
    if (isEmpty(name)) name = originalUserInfo.name
    if (isEmpty(profileImage)) profileImage = '@/img/profile/pretty_cabbage.jpg' // 기본 이미지 경로

    // 비밀번호 유효성 검사
    if (!isValidPassword(password)) {
      alert('비밀번호는 8자 이상이며 영문자, 숫자, 특수문자를 포함해야 합니다.')
      return false
    }

    const createdAt = originalUserInfo?.createdAt || currentDateToString()

    const payload = {
      email,
      password,
      name,
      profileImage,
      role: originalUserInfo.role,
      status: originalUserInfo.status,
      createdAt,
      updatedAt: currentDateToString(),
    }

    try {
      const response = await axios.put(`${BASE_URI}/users/${id}`, payload)

      if (response.status === 200) {
        // usersList 업데이트
        state.usersList = state.usersList.map(user =>
          user.id === id ? { id, ...payload } : user,
        )
        console.log('업데이트된 userList', state.usersList)
        // localStorage 업데이트
        const existingUserInfo = getUserInfoLocalStorage()
        console.log('existingUserInfo: ', existingUserInfo)
        setUserInfoLocalStorage({
          ...existingUserInfo,
          email,
          name,
          profileImage,
        })
        console.log(
          '로컬 스토리지에 새로 !!!! 저장된 userInfo:',
          getUserInfoLocalStorage(),
        )
        // currentUser 업데이트
        state.currentUser = getUserInfoLocalStorage()
        console.log('업데이트된 currentUser: ', state.currentUser)
        successCallback?.()
      } else {
        console.log('❌ 사용자 정보 변경 실패: ', response.data.message)
      }
    } catch (error) {
      console.error('❌ 사용자 정보 수정 에러:', error)
    }
    return true
  }

  // 로그인
  const loginUser = async (
    { email, password },
    successCallback,
    failCallback,
  ) => {
    try {
      const response = await axios.get(`${BASE_URI}/users`)
      const users = response.data
      const user = users.find(u => u.email === email)
      // 사용자 정보 확인
      if (!user)
        return failCallback?.('존재하지 않는 계정입니다. 회원가입을 해주세요.')
      if (user.password !== password)
        return failCallback?.('비밀번호가 일치하지 않습니다.')
      if (user.status === 'deactivated')
        return failCallback?.('비활성화된 계정입니다.')
      const userInfo = {
        authenticated: true,
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
      }
      console.log('로그인 시 userInfo:', userInfo)
      // 현재 사용자 정보 업데이트 (state)
      state.currentUser = userInfo
      // JWT 생성 및 파싱, 만료 여부 확인
      const token = createTestJwt(userInfo) // JWT 생성 // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoZW50aWNhdGVkIjp0cnVlLCJpZCI6IjMiLCJlbWFpbCI6ImFkbWluQGtiLmNvbSIsIm5hbWUiOiLqtIDrpqzsnpAiLCJyb2xlIjoiYWRtaW4ifQ.7V1gERK7LXjCs2mq9STlDGS5AN8WJl3BfeDleBCgXfY
      const parsedToken = parseJwt(token) // {authenticated: true, id: '3', email: 'admin@kb.com', name: '관리자', role: 'admin'}

      if (parsedToken) {
        setUserInfoLocalStorage(userInfo)
        // axios 기본 헤더에 토큰 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        successCallback?.()
      } else {
        failCallback?.('토큰이 만료되었거나 유효하지 않습니다.')
      }
    } catch (error) {
      console.error('❌ 로그인 에러:', error)
      failCallback?.('서버 오류: ' + error)
    }
  }

  // 로그아웃
  const logoutUser = () => {
    try {
      localStorage.removeItem('userInfo')
      // 로그아웃 시 Authorization 헤더를 초기화
      delete axios.defaults.headers.common['Authorization']
      // state 초기화
      state.usersList = null
      state.currentUser = null
      // state.currentUser = null
      console.log('✅ 로그아웃 완료: userInfo 삭제됨')
    } catch (error) {
      console.error('❌ 로그아웃 중 에러 발생:', error)
    }
  }

  return {
    state,
    setUserInfoLocalStorage,
    getUserInfoLocalStorage,
    fetchUsers,
    getUserInfoById,
    addUser,
    updateUser,
    loginUser,
    logoutUser,
  }
})
