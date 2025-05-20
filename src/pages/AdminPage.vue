<template>
  <div class="container" v-if="users.length">
    <h2>사용자 목록</h2>
    <table>
      <thead>
        <tr>
          <th>상태</th>
          <th>id</th>
          <th>이름</th>
          <th>이메일</th>
          <th>비밀번호</th>
          <th>이미지</th>
          <th>가입일</th>
          <th>수정일</th>
          <th style="color: transparent">수정</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id || index">
          <td
            :class="
              user.status === 'active' ? 'status-active' : 'status-deactivated'
            "
          >
            {{ user.status }}
          </td>
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.password }}</td>
          <td>
            <img :src="user.image" alt="유저 이미지" width="40" height="40" />
          </td>
          <td>{{ user.createdAt }}</td>
          <td>{{ user.updatedAt }}</td>
          <td>
            <button>수정</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUsersTableStore } from '@/stores/UsersTableStore'

// 사용자 정보
const { fetchUsers, state } = useUsersTableStore()

const users = computed(() => state.usersList)

onMounted(async () => {
  await fetchUsers()
  console.log('users:', users)
})
</script>

<style scoped>
.container {
  background: var(--bg-color);
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 100px 0 0 30px;
}
h2 {
  font-size: 22px;
}
table {
  margin-top: 30px;
}
th {
  font-size: 14px;
}
td {
  font-size: 14px;
}
.status-active {
  color: green;
}
.status-deactivated {
  color: red;
}

/* 테블렛 화면 */
@media screen and (min-width: 768.01px) and (max-width: 992px) {
}
/* 모바일 화면 */
@media screen and (max-width: 768px) {
}
</style>
