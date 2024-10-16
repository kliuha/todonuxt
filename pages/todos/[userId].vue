<template>
  <div class="todo-page">
    <button @click="goBack" class="todo-page__back-btn">Back to Users</button>

    <h2 class="todo-page__title">{{ userName }}'s Todos</h2>

    <ul class="todo-page__list">
      <li v-for="todo in todos" :key="todo.id" class="todo-page__item">
        <span class="todo-page__task-title">{{ todo.title }}</span> -
        <span
          :class="{
            'todo-page__completed': todo.completed,
            'todo-page__not-completed': !todo.completed,
          }"
        >
          {{ todo.completed ? 'Completed' : 'Not Completed' }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Todo } from '@/types'

const route = useRoute()
const router = useRouter()
const todos = ref<Todo[]>([])
const userName = ref<string>('')

onMounted(async () => {
  const userId = Number(route.params.userId)
  const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  const userData = await userRes.json()
  userName.value = userData.name

  const todosRes = await fetch(
    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
  )
  todos.value = await todosRes.json()
})

const goBack = (): void => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.todo-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  &__back-btn {
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }

  &__title {
    font-size: 2rem;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }

  &__list {
    list-style: none;
    padding: 0;
  }

  &__item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__task-title {
    font-size: 1.2rem;
    flex: 1;
  }

  &__completed {
    color: green;
    font-weight: bold;
  }

  &__not-completed {
    color: red;
    font-weight: bold;
  }
}
</style>
