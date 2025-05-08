// YYYY-MM-DD HH:MM:SS 형식으로 포맷
export function currentTimestampToString() {
  return new Date().toString()
}

export function currentDateToString() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
  const day = String(now.getDate()).padStart(2, '0')
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[now.getDay()]
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}-${weekday} ${hours}:${minutes}:${seconds}`
}
