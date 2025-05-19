<template>
  <div class="container" v-if="user && editMode === false">
    <img
      :src="user.profileImage || defaultProfileImage"
      id="profile_img"
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
    <div
      class="btn_area mt-4"
      :class="{ admin_btn_center: user.role === 'Admin' }"
    >
      <button id="delete" v-if="user.role == 'User'">탈퇴 요청</button>
      <button id="edit" @click="toggleEditMode">정보 수정</button>
    </div>
  </div>
  <div class="container" v-if="user && editMode === true">
    <img
      :src="user.profileImage || defaultProfileImage"
      id="profile_img"
      alt="사용자 프로필"
    />
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
          <td>프로필 사진 변경</td>
          <td>
            <label for="fileInput" id="fileLabel"
              ><img src="/src/img/icons/upload_file.svg" id="upload_icon" />파일
              선택 -
              <span
                id="fileName"
                :style="{
                  color: fileSelected
                    ? 'var(--color-font-main)'
                    : 'var(--color-point-4)',
                }"
                >{{ fileName || extractFileName(user.profileImage) }}</span
              ></label
            >
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
      <button id="cancel" @click="toggleEditMode">취소</button>
      <button id="apply" @click="saveChanges">적용</button>
    </div>
  </div>
  <div v-if="!user">사용자 정보를 불러오는 중입니다...</div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useUsersTableStore } from '@/stores/UsersTableStore'

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
  console.log('file: ', file)
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
  const formData = new FormData()
  formData.append('name', editedUser.name)
  formData.append('email', editedUser.email)
  formData.append('password', editedUser.password || '')
  if (editedUser.profileFile) {
    formData.append('profileImage', editedUser.profileFile) // 실제 파일 첨부
    console.log('editedUser.profileFile: ', editedUser.profileFile)
  }
  try {
    const success = updateUser(editedUser)
    if (success) {
      Object.assign(user, editedUser) // user 변경 내용 반영
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
  background: #f5f7fa;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 100px 0;
}
#profile_img {
  width: 200px;
  height: 200px;
  border-radius: 150px;
  border: 3px solid #fff;
  margin-bottom: 50px;
}
table {
  margin: 30px 0 0 0;
  padding: 10px 30px;
  width: 530px;
  border-spacing: 0 20px; /* tr 수직 간격 */
  border-collapse: separate;
  font-size: 14px;
}
td {
  white-space: nowrap; /* 줄바꿈 X */
  height: 40px;
}
td:nth-of-type(1) {
  font-weight: normal;
  color: #000;
}
td:nth-of-type(2) {
  text-align: right;
  width: 350px;
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
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
}
.admin_btn_center {
  justify-content: center !important;
  gap: 0 !important;
}
#apply,
#edit {
  background: #000;
  color: white;
}
#cancel,
#delete {
  background: #f2f2f2;
}

/* editMode = true */
.input_box {
  background-color: #fff;
  padding-right: 10px;
  text-align: right;
  width: 100%;
  height: 40px;
  border: 1px solid #afafaf;
  border-radius: 4px;
}
.input_box::placeholder {
  color: var(--color-point-4);
}

/* 프로필사진 선택 버튼 */
#fileInput {
  display: none;
}
#fileLabel {
  background: #f2f2f2;
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
}
#fileName {
  padding-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#upload_icon {
  width: 16px;
  height: 16px;
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
