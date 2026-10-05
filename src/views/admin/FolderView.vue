<template>
  <div class="space-y-6">
    <!-- Header Halaman -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Direktori & File</h2>
        <p class="text-sm text-slate-500 mt-1">Jelajahi folder dan dokumen perusahaan secara terstruktur</p>
      </div>

      <!-- Tombol Aksi Admin (Buat Folder & Upload File ke Folder Aktif) -->
      <div v-if="userRole === 'admin'" class="flex items-center gap-2">
        <button 
          @click="openCreateFolderModal" 
          class="btn-primary py-2 px-4 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Buat Folder Baru</span>
        </button>

<button 
          @click="openUploadFileModal" 
          class="btn-secondary py-2 px-4 flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Upload File di Sini</span>
        </button>
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

    <!-- Komponen Penjelajah File & Folder -->
    <div v-else class="py-2">
      <FolderBrowser 
        :folders="currentFolders"
        :files="currentFiles"
        :user-role="userRole"
        @enter-folder="enterFolder"
        @edit-folder="openEditFolderModal"
        @delete-folder="deleteFolder"
        @download-file="downloadFile"
        @delete-file="deleteFile"
      />
    </div>

    <!-- Modal Form Buat / Edit Folder -->
    <FolderModal 
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :mode="modalMode"
      :folderData="selectedFolder"
      :currentParentId="currentFolderId"
      :loading="loading"
      @close="closeFolderModal"
      @save="handleFolderSave"
    />

    <!-- Modal Upload File (Langsung Mengambil currentFolderId sebagai tujuan) -->
    <UploadFileModal 
      :is-open="isUploadModalOpen"
      mode="create"
      :current-folder-id="currentFolderId"
      @close="isUploadModalOpen = false"
      @refresh="() => fetchDirectoryContents(currentFolderId)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useFolders } from '../../composables/useFolder';
import Breadcrumb from '../../components/common/Breadcrumbs.vue';
import FolderBrowser from '../../components/folders/FolderBrowser.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import FolderModal from '../../components/folders/FolderModal.vue';
import UploadFileModal from '../../components/files/UploadFileModal.vue'; // <-- Import modal upload file

const showAlert = inject('showAlert');
const userRole = ref('viewer');

// State untuk Modal Folder
const isModalOpen = ref(false);
const modalMode = ref('create');
const selectedFolder = ref(null);

// State untuk Modal Upload File di dalam folder aktif
const isUploadModalOpen = ref(false);

const {
  currentFolderId,
  breadcrumbs,
  currentFolders,
  currentFiles,
  loading,
  fetchDirectoryContents,
  enterFolder,
  goToRoot,
  navigateToCrumb,
  deleteFolder,
  deleteFile,
  saveFolder
} = useFolders(showAlert);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userRole.value = user.role || 'viewer';
  fetchDirectoryContents(null);
});

const openCreateFolderModal = () => {
  modalMode.value = 'create';
  selectedFolder.value = { parent_id: currentFolderId.value };
  isModalOpen.value = true;
};

const openEditFolderModal = (folder) => {
  modalMode.value = 'edit';
  selectedFolder.value = folder;
  isModalOpen.value = true;
};

const closeFolderModal = () => {
  isModalOpen.value = false;
  selectedFolder.value = null;
};

const handleFolderSave = async (payload) => {
  const success = await saveFolder(payload, modalMode.value, selectedFolder.value?.id);
  if (success) {
    closeFolderModal();
  }
};

const openUploadFileModal = () => {
  isUploadModalOpen.value = true;
};

const downloadFile = (file) => {
  if (file.url) {
    window.open(file.url, '_blank');
  } else {
    showAlert('Tautan unduhan file tidak tersedia.', 'error');
  }
};
</script>