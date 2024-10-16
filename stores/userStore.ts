import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const currentPage = ref<number>(1);
  const searchQuery = ref<string>('');

  async function fetchUsers(page: number): Promise<void> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`);
    users.value = await res.json();
  }

  function setPage(page: number): void {
    currentPage.value = page;
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query;
  }

  return { users, currentPage, searchQuery, fetchUsers, setPage, setSearchQuery };
});
