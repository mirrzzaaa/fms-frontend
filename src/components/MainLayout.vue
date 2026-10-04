<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar dengan transisi responsif -->
    <aside 
      :class="[
        'bg-white shadow-md flex flex-col justify-between transition-all duration-300 z-30',
        isOpen ? 'w-64' : 'w-20'
      ]"
    >
      <div>
        <!-- Bagian Header Sidebar (Judul & Role disatukan) -->
        <div class="px-6 pt-6 pb-6 border-b">
          <div class="flex items-center justify-between">
            <h1 v-if="isOpen" class="text-xl font-bold text-gray-800 truncate">Lion FMS</h1>
            <h1 v-else class="text-xl font-bold text-gray-800 text-center w-full">FMS</h1>
          </div>
          
          <!-- Role Info  -->
          <div v-if="isOpen" class="mt-2">
            <p class="text-xs text-blue-600 font-reguler">Role: {{ userRole }}</p>
          </div>
        </div>
        
        <!-- Navigasi Menu Dinamis -->
        <nav class="p-4 space-y-2">
          <!-- Menu untuk Admin -->
          <template v-if="userRole === 'admin'">
            <router-link 
              to="/admin/dashboard" 
              class="flex items-center space-x-3 px-4 py-2 rounded font-medium transition"
              active-class="bg-blue-50 text-blue-600 font-semibold"
              :title="!isOpen ? 'Dashboard' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              <span v-if="isOpen">Dashboard</span>
            </router-link>
            <router-link 
              to="/admin/departments" 
              class="flex items-center space-x-3 px-4 py-2 rounded font-medium transition"
              active-class="bg-blue-50 text-blue-600 font-semibold"
              :title="!isOpen ? 'Departemen' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              <span v-if="isOpen">Departemen</span>
            </router-link>
            <router-link 
             to="/admin/folders" 
             class="flex items-center space-x-3 px-4 py-2 rounded font-medium transition"
              active-class="bg-blue-50 text-blue-600 font-semibold"
             :title="!isOpen ? 'Folder' : ''"
            >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
            <span v-if="isOpen">Folder</span>
            </router-link>
          </template>

          <!-- Menu untuk Viewer -->
          <template v-else-if="userRole === 'viewer'">
            <router-link 
              to="/viewer/dashboard" 
              class="flex items-center space-x-3 px-4 py-2 rounded font-medium transition"
              active-class="bg-blue-50 text-blue-600 font-semibold"
              :title="!isOpen ? 'Dashboard' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              <span v-if="isOpen">Dashboard</span>
            </router-link>
          </template>
        </nav>
      </div>

      <!-- Tombol Logout -->
      <div class="p-4 border-t">
        <button 
          @click="handleLogout" 
          class="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 font-semibold py-2 px-4 rounded hover:bg-red-100 transition"
          :title="!isOpen ? 'Logout' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span v-if="isOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Konten Utama -->
    <main class="flex-1 p-8 overflow-y-auto">
      <div class="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center space-x-4">
          <!-- Tombol Hamburger untuk Toggle Sidebar -->
          <button 
            @click="isOpen = !isOpen" 
            class="text-gray-600 hover:text-gray-900 focus:outline-none p-1 rounded hover:bg-gray-100 transition"
            title="Sembunyikan/Tampilkan Menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h2 class="text-xl font-bold text-gray-800">File Management System</h2>
        </div>
        <span class="text-sm text-gray-600">Halo, <b>{{ userName }}</b></span>
      </div>

      <!-- Tempat halaman anak (Child Views) dimuat secara dinamis -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../service/api';

const router = useRouter();
const userName = ref('');
const userRole = ref('');
const isOpen = ref(true); // State untuk mengontrol sidebar buka/tutup

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userName.value = user.name || 'User';
  userRole.value = user.role || 'viewer';
});

const handleLogout = async () => {
  try {
    await api.post('/logout');
  } catch (e) {
    // Abaikan error saat logout
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }
};
</script>