<template>
  <div class="space-y-6">
    <!-- Header Halaman -->
    <div class="flex justify-between items-center py-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Direktori & File</h2>
        <p class="text-sm text-slate-500 mt-1">Jelajahi folder dan dokumen perusahaan secara terstruktur</p>
      </div>
    </div>

    <!-- Komponen Navigasi Breadcrumb -->
    <Breadcrumb 
      :breadcrumbs="breadcrumbs" 
      @root="goToRoot" 
      @navigate="navigateToCrumb" 
    />

    <!-- Loading State -->
    <div v-if="loading" class="py-12">
      <LoadingSpinner message="Memuat isi direktori..." />
    </div>

    <!-- Komponen Penjelajah File & Folder (List / Grid View) - Tanpa Aksi Admin -->
    <div v-else class="py-2">
      <FolderBrowser 
        :folders="currentFolders"
        :files="currentFiles"
        :user-role="userRole"
        @enter-folder="enterFolder"
        @download-file="downloadFile"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useFolders } from '../../composables/useFolder';
import Breadcrumb from '../../components/common/Breadcrumbs.vue';
import FolderBrowser from '../../components/folders/FolderBrowser.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

// Mengambil fungsi global alert dari MainLayout
const showAlert = inject('showAlert');
const userRole = ref('viewer');

// Menggunakan composable useFolders untuk manajemen state dan navigasi direktori
const {
  currentFolderId,
  breadcrumbs,
  currentFolders,
  currentFiles,
  loading,
  fetchDirectoryContents,
  enterFolder,
  goToRoot,
  navigateToCrumb
} = useFolders(showAlert);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userRole.value = user.role || 'viewer';
  
  // Memuat data direktori awal (Root)
  fetchDirectoryContents(null);
});

const downloadFile = (file) => {
  if (file.url) {
    window.open(file.url, '_blank');
  } else {
    showAlert('Tautan unduhan file tidak tersedia.', 'error');
  }
};
</script>