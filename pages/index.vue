<template>
  <div class="users-page">
    <h1 class="users-page__title">Users List</h1>

    <div class="users-page__search-container">
      <input
        v-model="searchQuery"
        class="users-page__search"
        placeholder="Search users by name..."
        @input="onSearch"
      />
    </div>

    <table class="users-page__table">
      <thead>
        <tr class="users-page__header-row">
          <th class="users-page__header">Name</th>
          <th class="users-page__header">Email</th>
          <th class="users-page__header">Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in userStore.users"
          :key="user.id"
          @click="goToTodoPage(user.id)"
          class="users-page__row"
        >
          <td class="users-page__cell">{{ user.name }}</td>
          <td class="users-page__cell">{{ user.email }}</td>
          <td class="users-page__cell">{{ user.phone }}</td>
        </tr>
      </tbody>
    </table>

    <div class="users-page__pagination">
      <button
        @click="prevPage"
        :disabled="userStore.currentPage === 1"
        class="users-page__button"
      >
        Previous
      </button>
      <span class="users-page__page-number">Page {{ userStore.currentPage }}</span>
      <button @click="nextPage" class="users-page__button">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')

const fetchUsers = async () => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_page=${userStore.currentPage}&_limit=5&name_like=${searchQuery.value}`
    )
    const data = await response.json()
    userStore.users = data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

watch([() => userStore.currentPage, () => searchQuery.value], async () => {
  if (!searchQuery.value || searchQuery.value.length % 3 == 0) {
    userStore.setSearchQuery(searchQuery.value)
    await fetchUsers()
  }
})

onMounted(async () => {
  await fetchUsers()
})

const onSearch = async (): Promise<void> => {
  if (!searchQuery.value || searchQuery.value.length % 3 == 0) {
    userStore.setSearchQuery(searchQuery.value)
    await fetchUsers()
  }
}

const nextPage = (): void => {
  userStore.setPage(userStore.currentPage + 1)
}

const prevPage = (): void => {
  userStore.setPage(userStore.currentPage - 1)
}

const goToTodoPage = (userId: number): void => {
  router.push(`/todos/${userId}`)
}
</script>

<style lang="scss" scoped>
.users-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  &__title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }

  &__search-container {
    text-align: center;
    margin-bottom: 20px;
  }

  &__search {
    width: 100%;
    max-width: 500px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1.2rem;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &__header-row {
    background-color: #007bff;
    color: white;
  }

  &__header {
    padding: 12px;
    text-align: left;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }

  &__row {
    cursor: pointer;
    &:nth-child(even) {
      background-color: #f9f9f9;
    }

    &:hover {
      background-color: #f1f1f1;
    }
  }

  &__cell {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  &__button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  &__page-number {
    font-size: 1.2rem;
  }
}
</style>
