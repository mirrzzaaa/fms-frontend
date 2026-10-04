<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">File Management System</h2>
      
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@liongroup.co.id"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../service/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    const user = response.data.user;

    // Simpan token dan data user ke localStorage
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect dinamis berdasarkan role user
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/viewer/dashboard');
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Terjadi kesalahan pada server.';
    }
  } finally {
    loading.value = false;
  }
};
</script>