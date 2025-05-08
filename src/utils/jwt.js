import { KJUR } from 'jsrsasign'

// 테스트용 JWT 토큰 생성
export function createTestJwt(userInfo) {
  const encoding = 'HS256'
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }
  const payload = userInfo
  const secret = 'test-secret' // 실서비스에서 사용 X
  const token = KJUR.jws.JWS.sign(encoding, header, payload, secret)
  return token
}

// JWT 파싱 (decoding)
export function parseJwt(token) {
  try {
    const decoded = KJUR.jws.JWS.parse(token)
    const payload = decoded.payloadObj

    // JWT 만료일자 확인
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.error('JWT 만료됨')
      return null
    }

    return payload
  } catch (error) {
    console.error('JWT 파싱 에러:', error)
    return null
  }
}

// 로컬 스토리지에서 토큰 가져오기
export function getToken() {
  try {
    const token = localStorage.getItem('userInfo').token
    return token
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error)
    return null
  }
}

// JWT의 Payload에서 특정 값 가져오기
export function getJwtPayloadValue(token, key) {
  const parsedJwt = parseJwt(token)
  return parsedJwt ? parsedJwt[key] : null
}
