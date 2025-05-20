// 공백 여부 확인
export const isEmpty = input => {
  return !input || input.trim() === ''
}

// 이메일 형식 유효성 검사
export const isValidEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return regex.test(email)
}

// 비밀번호 유효성 검사 (8자 이상, 영문/숫자/특수문자 포함)
export const isValidPassword = password => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
  return regex.test(password)
}

// 비밀번호1, 비밀번호2 유효성 검사 (8자 이상, 영문/숫자/특수문자 포함)
export const isValidPasswordChk = (password1, password2) => {
  return password1 === password2
}
