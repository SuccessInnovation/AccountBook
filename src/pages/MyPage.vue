<template>
  <div class="container">
    <img
      :src="
        editMode
          ? editedUser.profileImage
          : user.profileImage || defaultProfileImage
      "
      id="profile_img"
      alt="사용자 프로필"
    />
    <table v-if="user && !editMode">
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
          <td>가입일</td>
          <td>{{ formatDate(user.createdAt) }}</td>
        </tr>
        <tr>
          <td>수정일</td>
          <td>
            {{ formatDate(user.updatedAt) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="btn_area mt-4">
      <button id="edit" @click="toggleEditMode" v-if="user && !editMode">
        정보 수정
      </button>
    </div>

    <table v-if="user && editMode">
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
            <div class="profile_img_opt_wrap">
              <div
                v-for="(img, index) in profileImages"
                :key="index"
                class="profile_img_opt"
                :class="{ selected: editedUser.profileImage === img.dir }"
                @click="selectProfileImage(img.dir)"
              >
                <img :src="img.dir" :alt="img.name" />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="btn_area" v-if="user && editMode">
      <button id="cancel" @click="toggleEditMode">취소</button>
      <button id="apply" @click="saveChanges">적용</button>
    </div>
    <div v-if="!user">사용자 정보를 불러오는 중입니다...</div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useUsersTableStore } from '@/stores/UsersTableStore'
import { formatDate } from '@/utils/date'

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
const defaultProfileImage = 'src/img/profile/pretty_cabbage.jpg' // 기본 이미지
const profileImages = [
  { name: 'real cabbage', dir: 'src/img/cabbage/pretty_cabbage.jpg' },
  { name: 'green cabbage', dir: 'src/img/cabbage/logo1.svg' },
  { name: 'yellow cabbage', dir: 'src/img/cabbage/logo4.png' },
  { name: 'red cabbage', dir: 'src/img/cabbage/logo2.png' },
]

// 사용자 정보 수정
const editMode = ref(false)
const confirmPassword = ref('')

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

function toggleEditMode() {
  editMode.value = !editMode.value
  if (editMode.value) {
    // 수정 모드 진입 시 비밀번호_확인 값 초기화
    confirmPassword.value = ''
    // 프로필 이미지 선택 사용자의 현재 프로필 이미지로 초기화
    Object.assign(editedUser, user)
  }
  console.log('수정하기 모드:', editMode.value)
}

function selectProfileImage(imageDir) {
  editedUser.profileImage = imageDir
}

function saveChanges() {
  if (editedUser.password && editedUser.password !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  try {
    const success = updateUser(editedUser)
    if (success) {
      Object.assign(user, { ...editedUser }) // user 변경 내용 반영
      toggleEditMode()
      console.log('정보가 업데이트되었습니다. user:', user)
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
  width: 480px;
  border-spacing: 20px 20px; /* 수평 20px, 수직 20px 간격 */
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
.profile_img_opt_wrap {
  display: flex;
  gap: 10px;
}
.profile_img_opt {
  border: 2px solid transparent;
  border-radius: 30px;
  cursor: pointer;
  width: 60px;
  height: 60px;
  overflow: hidden;
}

.profile_img_opt img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile_img_opt.selected {
  border-color: var(--main-color);
  box-shadow: var(--box-shadow-below);
}
.btn_area {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
  width: 350px;
}
button {
  width: 100%;
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
