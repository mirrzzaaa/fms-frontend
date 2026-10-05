<template>
  <div class="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-800">
    
    <!-- Komponen Global NotificationAlert -->
    <NotificationAlert 
      v-model:show="globalAlert.show" 
      :message="globalAlert.message" 
      :type="globalAlert.type" 
    />

    <!-- Backdrop Gelap untuk Mobile saat Sidebar Terbuka -->
    <div 
      v-if="isOpen && isMobile" 
      @click="isOpen = false" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden"
    ></div>

    <!-- Sidebar Modern Minimalis & Responsif -->
    <aside 
      :class="[
        'bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 shadow-sm fixed md:static inset-y-0 left-0',
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
      ]"
    >
      <div>
        <!-- Logo & Brand Header (Digabung dengan Nama & Role) -->
        <div class="h-auto py-4 px-5 flex items-center gap-3 border-b border-slate-100 overflow-hidden">
          <img :src="logoSrc" alt="Logo" class="w-9 h-9 object-contain rounded-xl shrink-0" />
          
          <div v-if="isOpen" class="flex flex-col truncate">
            <span class="text-base font-bold text-slate-800 tracking-tight leading-tight truncate">Lion FMS</span>
            <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
              {{ userRole }}
            </span>
          </div>
        </div>
        
        <!-- Navigasi Menu Minimalis -->
        <nav class="p-3 space-y-1.5">
          <!-- Menu Admin -->
          <template v-if="userRole === 'admin'">
            <router-link 
              to="/admin/dashboard" 
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600 font-semibold shadow-sm"
              :title="!isOpen ? 'Dashboard' : ''"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              <span v-if="isOpen">Dashboard</span>
            </router-link>

            <router-link 
              to="/admin/departments" 
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600 font-semibold shadow-sm"
              :title="!isOpen ? 'Departemen' : ''"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              <span v-if="isOpen">Departemen</span>
            </router-link>

            <router-link 
             to="/admin/folders" 
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600 font-semibold shadow-sm"
             :title="!isOpen ? 'Folder' : ''"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <span v-if="isOpen">Folder</span>
            </router-link>

            <router-link 
             to="/admin/files"
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600 font-semibold shadow-sm"
             :title="!isOpen ? 'Folder' : ''"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span v-if="isOpen">File</span>
            </router-link>
          </template>

          <!-- Menu Viewer -->
          <template v-else-if="userRole === 'viewer'">
            <router-link 
              to="/viewer/dashboard" 
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600 font-semibold shadow-sm"
              :title="!isOpen ? 'Dashboard' : ''"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              <span v-if="isOpen">Dashboard</span>
            </router-link>
            <router-link 
             to="/viewer/folder"
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600 font-semibold shadow-sm"
             :title="!isOpen ? 'Folder' : ''"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <span v-if="isOpen">Folder</span>
            </router-link>

            <router-link 
             to="/viewer/file"
             class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600 font-semibold shadow-sm"
             :title="!isOpen ? 'Folder' : ''"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span v-if="isOpen">File</span>
            </router-link>
          </template>
        </nav>
      </div>

      <!-- Tombol Logout Minimalis -->
      <div class="p-3 border-t border-slate-100">
        <button 
          @click="handleLogout" 
          class="w-full flex items-center justify-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-600 bg-rose-50/50 hover:bg-rose-100/70 transition"
          :title="!isOpen ? 'Logout' : ''"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span v-if="isOpen">Keluar Sistem</span>
        </button>
      </div>
    </aside>

    <!-- Konten Utama -->
    <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <!-- Top Navbar Minimalis -->
      <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-4">
          <!-- Tombol Toggle Sidebar -->
          <button 
            @click="isOpen = !isOpen" 
            class="text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition focus:outline-none"
            title="Sembunyikan/Tampilkan Menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h2 class="text-base font-semibold text-slate-800 tracking-tight hidden sm:block">File Management System</h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-inner">
            {{ userName.charAt(0).toUpperCase() }}
          </div>
          <span class="text-sm font-medium text-slate-700">{{ userName }}</span>
        </div>
      </header>

      <!-- View Anak / Halaman Konten -->
      <div class="p-6 sm:p-8 flex-1">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, provide, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../service/api';
import logoImage from '../assets/logo.svg';
import NotificationAlert from './common/NotificationAlert.vue';

const router = useRouter();
const userName = ref('');
const userRole = ref('');
const isOpen = ref(true);
const isMobile = ref(false);
const logoSrc = ref(logoImage);

// Global State untuk Alert agar bisa dipanggil dari child component manapun via provide/inject jika diperlukan
const globalAlert = reactive({
  show: false,
  message: '',
  type: 'success'
});

provide('showAlert', (msg, type = 'success') => {
  globalAlert.message = msg;
  globalAlert.type = type;
  globalAlert.show = true;
});

const checkScreenSize = () => {
  if (window.innerWidth < 768) {
    isMobile.value = true;
    isOpen.value = false;
  } else {
    isMobile.value = false;
    isOpen.value = true;
  }
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userName.value = user.name || 'User';
  userRole.value = user.role || 'viewer';

  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
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