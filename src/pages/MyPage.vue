<template>
  <div class="container" v-if="user && editMode === false">
    <img
      :src="
        editMode
          ? editedUser.profileImage || defaultProfileImage
          : user.profileImage || defaultProfileImage
      "
      alt="사용자 프로필"
    />
    <table>
      <tbody>
        <tr>
          <td>이름</td>
          <td>{{ user.name }}</td>
        </tr>
        <tr>
          <td>이메일</td>
          <td>{{ user.email }}</td>
        </tr>
        <tr>
          <td>권한</td>
          <td>{{ user.role }}</td>
        </tr>
        <tr>
          <td>계정 상태</td>
          <td>{{ user.status }}</td>
        </tr>
        <tr>
          <td>가입일</td>
          <td>{{ formatDate(user.createdAt) }}</td>
        </tr>
        <tr>
          <td>수정일</td>
          <td>{{ formatDate(user.updatedAt) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="btn_area mt-4">
      <button id="edit" @click="toggleEditMode">정보 수정</button>
      <button id="delete">탈퇴 요청</button>
    </div>
  </div>
  <div class="container" v-if="user && editMode === true">
    <img :src="user.profileImage || defaultProfileImage" alt="사용자 프로필" />
    <table>
      <tbody>
        <tr>
          <td>이름 변경</td>
          <td>
            <input
              class="input_box"
              type="text"
              v-model="editedUser.name"
              :placeholder="user.name"
            />
          </td>
        </tr>
        <tr>
          <td>이메일 변경</td>
          <td>
            <input
              class="input_box"
              type="email"
              v-model="editedUser.email"
              :placeholder="user.email"
            />
          </td>
        </tr>
        <tr>
          <td>비밀번호 변경</td>
          <td>
            <input
              class="input_box"
              id="newPassword"
              type="password"
              v-model="editedUser.password"
              placeholder="········"
            />
          </td>
        </tr>
        <tr>
          <td>비밀번호 확인</td>
          <td>
            <input
              class="input_box"
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="········"
            />
          </td>
        </tr>
        <tr>
          <td>프로필 사진</td>
          <td>
            <span
              id="fileName"
              :style="{
                color: fileSelected
                  ? 'var(--color-font-main)'
                  : 'var(--color-point-4)',
              }"
              >{{ fileName || extractFileName(user.profileImage) }}</span
            >
            <label for="fileInput" id="fileLabel">파일 선택</label>
            <input
              class="input_box"
              type="file"
              id="fileInput"
              @change="updateFileName"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="btn_area mt-4">
      <button id="edit" @click="saveChanges">적용</button>
      <button id="delete" @click="toggleEditMode">취소</button>
    </div>
  </div>
  <div v-if="!user">사용자 정보를 불러오는 중입니다...</div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useUsersTableStore } from '@/stores/UsersTableStore'
import { useRoute } from 'vue-router'

// 사용자 정보
const user = reactive({})
const editedUser = reactive({
  name: '',
  email: '',
  password: '',
  profileImage: '',
})
const { getUserInfoLocalStorage, getUserInfoById, updateUser } =
  useUsersTableStore()
const route = useRoute()
const defaultProfileImage = '@/img/profile/pretty_cabbage.jpg' // 기본 이미지

// 사용자 정보 수정
const editMode = ref(false)
const confirmPassword = ref('')
const fileName = ref('')
const fileSelected = ref(false)

onMounted(() => {
  const userInfo = getUserInfoLocalStorage()
  console.log('userInfo: ', userInfo)
  if (userInfo) {
    try {
      const userId = userInfo.id
      console.log('userId:', userId)
      console.log('user:', user)
      if (userId) {
        getUserInfoById(userId, fetchedUser => {
          Object.assign(user, fetchedUser) // user 업데이트
          Object.assign(editedUser, fetchedUser) // editedUser 업데이트
        })
      }
    } catch (error) {
      console.error('userInfo 파싱 오류:', error)
    }
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const [date] = dateStr.split(' ') // ["2025-05-08"]
  const [year, month, day, weekday] = date.split('-') // ['2025', '05', '08', '목']
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${weekday}요일`
}

function toggleEditMode() {
  editMode.value = !editMode.value
  console.log('수정하기 모드:', editMode.value)
}

function extractFileName(path) {
  return path.split('/').pop()
}

function updateFileName(event) {
  const file = event.target.files[0] // 파일 선택
  console.log(file)
  if (file) {
    fileName.value = file.name // 파일명 업데이트
    fileSelected.value = true // 파일 선택 상태로 업데이트
    // editedUser.profileImage에 파일 설정
    const reader = new FileReader()
    reader.onload = e => {
      editedUser.profileImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function saveChanges() {
  if (editedUser.password && editedUser.password !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  try {
    const success = updateUser(editedUser)
    if (success) {
      toggleEditMode()
      console.log('정보가 업데이트되었습니다.')
    } else {
      return
    }
  } catch (error) {
    console.error('업데이트 오류:', error)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 50px 0;
}
img {
  width: 150px;
  height: 150px;
  border-radius: 150px;
  margin-bottom: 12px;
}
table {
  margin: 30px 0 0 0;
  padding: 10px 30px;
  width: 400px;
  border-spacing: 0 20px; /* tr 수직 간격 */
  border-collapse: separate;
  border: 1px solid var(--color-point-1);
  border-radius: 30px;
}
td {
  white-space: nowrap; /* 줄바꿈 X */
}
td:nth-of-type(1) {
  font-weight: bold;
  color: var(--color-point-1);
}
td:nth-of-type(2) {
  text-align: right;
}
.btn_area {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
  width: 350px;
}
button {
  width: 80%;
  height: 35px;
  border-radius: 10px;
  font-size: 14px;
  white-space: nowrap;
}
#edit {
  background: var(--color-point-1);
  color: white;
}
#delete {
  background: var(--color-point-5);
}

/* editMode = true */
.input_box {
  text-align: right;
  width: 90%;
  border: 0.5px solid var(--color-point-4);
}
.input_box::placeholder {
  color: var(--color-point-4);
}

/* 프로필사진 선택 버튼 */
#fileInput {
  display: none;
}
#fileName {
  margin-right: 10px;
  display: inline-block;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-point-4);
  vertical-align: middle;
}
#fileLabel {
  background: var(--color-point-4);
  width: 70px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  vertical-align: middle;
}
/* 테블렛 화면 */
@media screen and (min-width: 768.01px) and (max-width: 992px) {
  table {
    width: 60%;
  }
  .btn_area {
    display: flex;
    flex-direction: column; /* 수직 정렬 */
    gap: 10px;
  }
  button {
    width: 100%;
  }
}
/* 모바일 화면 */
@media screen and (max-width: 768px) {
  table {
    width: 80%;
  }
  .btn_area {
    display: flex;
    flex-direction: column; /* 수직 정렬 */
    gap: 10px;
  }
  button {
    width: 100%;
  }
}
</style>
