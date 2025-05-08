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

// 유효성 검사
export const validateUserInput = ({ email, password, name }) => {
  if (isEmpty(email)) return alert('이메일을 입력해주세요.')
  if (!isValidEmail(email)) return alert('올바른 이메일 형식을 입력해주세요.')

  if (isEmpty(password)) return alert('비밀번호를 입력해주세요.')
  if (!isValidPassword(password))
    return alert(
      '비밀번호는 8자 이상이며 영문자, 숫자, 특수문자를 포함해야 합니다.',
    )

  if (isEmpty(name)) return alert('이름을 입력해주세요.')

  return true
}
