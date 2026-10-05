<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10">
      
      <h1 class="text-2xl font-bold text-slate-800 text-center mb-8">Masuk</h1>

      <NotificationAlert :message="errorMessage" type="error" v-model:show="showErrorAlert"/>

      <form @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Field Email -->
        <div>
          <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #334155;">Email</label>
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition"
              placeholder="nama.anda@example.com"
            />
          </div>
        </div>

        <!-- Field Kata Sandi -->
        <div>
          <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #334155;">Kata Sandi</label>
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              class="w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition"
              placeholder="Masukkan kata sandi"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute right-3.5 text-slate-400 hover:text-slate-600 transition"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tombol Masuk -->
        <div style="margin-top: 10px;">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full btn-primary py-3.5 disabled:opacity-50"
          >
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../service/api';
import NotificationAlert from '../components/common/NotificationAlert.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const showErrorAlert = ref(false);
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  showErrorAlert.value = false;

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    const user = response.data.user;

    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(user));

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
    showErrorAlert.value = true;
  } finally {
    loading.value = false;
  }
};
</script>