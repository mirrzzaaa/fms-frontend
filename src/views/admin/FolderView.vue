<template>
  <div>
    <!-- Header & Navigasi Breadcrumb -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Manajemen Folder & File</h2>
        <!-- Breadcrumb untuk navigasi hierarki -->
        <div class="flex items-center space-x-2 text-sm text-gray-500 mt-1">
          <button @click="navigateToRoot" class="hover:text-blue-600 font-medium">Root Folder</button>
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
            <span>/</span>
            <button @click="navigateToFolder(crumb, index)" class="hover:text-blue-600 font-medium">
              {{ crumb.name }}
            </button>
          </template>
        </div>
      </div>

      <button 
        v-if="userRole === 'admin'"
        @click="openFolderModal('create')" 
        class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        + Buat Folder Baru
      </button>
    </div>

    <!-- Alert Notifikasi -->
    <div v-if="message" class="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
      {{ message }}
    </div>

    <!-- Daftar Sub-Folder -->
    <FolderTable 
      :folders="folders"
      :user-role="userRole"
      @enter="enterFolder"
      @edit="openFolderModal('edit', $event)"
      @delete="deleteFolder"
    />

    <!-- Daftar File di Folder Ini -->
    <FileTable 
      :files="files"
      :user-role="userRole"
      @open-upload="openUploadModal('create')"
      @download="downloadFile"
      @detail="openDetailModal"
      @edit="openUploadModal('edit', $event)"
      @delete="deleteFile"
    />

    <!-- Modal Form Folder -->
    <FolderModal 
      :is-open="isFolderModalOpen"
      :mode="folderModalMode"
      :folder-data="selectedFolder"
      :current-parent-id="currentParentId"
      @close="isFolderModalOpen = false"
      @save="handleSaveFolder"
    />

    <!-- Modal Upload / Edit File -->
    <UploadFileModal 
      :is-open="isUploadModalOpen"
      :mode="uploadModalMode"
      :file-data="selectedFile"
      :current-folder-id="currentParentId"
      @close="isUploadModalOpen = false"
      @save="handleSaveFile"
    />

    <!-- Modal Detail File -->
    <FileDetailModal 
      :is-open="isDetailModalOpen"
      :file-data="selectedFile"
      @close="isDetailModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../service/api';
import FolderTable from '../../components/folders/FolderTable.vue';
import FolderModal from '../../components/folders/FolderModal.vue';
import FileTable from '../../components/files/FileTable.vue';
import UploadFileModal from '../../components/files/UploadFileModal.vue';
import FileDetailModal from '../../components/files/FileDetailModal.vue';

const folders = ref([]);
const files = ref([]);
const breadcrumbs = ref([]);
const currentParentId = ref(null);
const userRole = ref('');
const message = ref('');

// State Modal Folder
const isFolderModalOpen = ref(false);
const folderModalMode = ref('create');
const selectedFolder = ref(null);

// State Modal File
const isUploadModalOpen = ref(false);
const uploadModalMode = ref('create');
const isDetailModalOpen = ref(false);
const selectedFile = ref(null);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userRole.value = user.role || 'viewer';
  loadFolderContent(null);
});

// Load Folder dan File sekaligus berdasarkan folder aktif
const loadFolderContent = async (parentId = null) => {
  try {
    // 1. Ambil data sub-folder
    const folderRes = await api.get('/folders', { params: { parent_id: parentId } });
    folders.value = folderRes.data.data || folderRes.data;

    // 2. Ambil data file di folder ini
    const fileRes = await api.get('/files', { params: { folder_id: parentId } });
    files.value = fileRes.data.data?.data || fileRes.data.data || fileRes.data;
  } catch (error) {
    console.error('Gagal memuat isi folder', error);
  }
};

// Navigasi masuk sub-folder
const enterFolder = (folder) => {
  breadcrumbs.value.push(folder);
  currentParentId.value = folder.id;
  loadFolderContent(folder.id);
};

// Kembali ke Root
const navigateToRoot = () => {
  breadcrumbs.value = [];
  currentParentId.value = null;
  loadFolderContent(null);
};

// Navigasi lewat Breadcrumb
const navigateToFolder = (crumb, index) => {
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
  currentParentId.value = crumb.id;
  loadFolderContent(crumb.id);
};

// --- Aksi Folder ---
const openFolderModal = (mode, folder = null) => {
  folderModalMode.value = mode;
  selectedFolder.value = folder;
  isFolderModalOpen.value = true;
};

const handleSaveFolder = async (data) => {
  try {
    if (data.mode === 'create') {
      await api.post('/folders', { name: data.name, parent_id: data.parent_id });
      message.value = 'Folder berhasil dibuat!';
    } else if (data.mode === 'edit') {
      await api.put(`/folders/${data.id}`, { name: data.name });
      message.value = 'Folder berhasil diubah namanya!';
    }
    isFolderModalOpen.value = false;
    loadFolderContent(currentParentId.value);
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    alert(error.response?.data?.message || 'Terjadi kesalahan');
  }
};

const deleteFolder = async (id) => {
  if (!confirm('Apakah kamu yakin ingin menghapus folder ini?')) return;
  try {
    await api.delete(`/folders/${id}`);
    message.value = 'Folder berhasil dihapus!';
    loadFolderContent(currentParentId.value);
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus folder');
  }
};

// --- Aksi File ---
const openUploadModal = (mode, file = null) => {
  uploadModalMode.value = mode;
  selectedFile.value = file;
  isUploadModalOpen.value = true;
};

const openDetailModal = (file) => {
  selectedFile.value = file;
  isDetailModalOpen.value = true;
};

const handleSaveFile = async (data) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('department_id', data.department_id);
    formData.append('folder_id', data.folder_id ?? '');

    if (data.mode === 'create') {
      if (data.file) formData.append('file', data.file);
      await api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.value = 'File berhasil diunggah!';
    } else if (data.mode === 'edit') {
      // Untuk update, gunakan method PUT/POST sesuai backend
      await api.put(`/files/${data.id}`, {
        title: data.title,
        department_id: data.department_id,
        folder_id: data.folder_id
      });
      message.value = 'Informasi file berhasil diperbarui!';
    }

    isUploadModalOpen.value = false;
    loadFolderContent(currentParentId.value);
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan file');
  }
};

const downloadFile = async (file) => {
  try {
const response = await api.get(`/files/${file.id}/download`, {
  responseType: 'blob'
});
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', file.original_filename);
    
    document.body.appendChild(link);
    link.click();
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Gagal mendownload file:', error);
    alert('Gagal mendownload file dari server.');
  }
};

const deleteFile = async (id) => {
  if (!confirm('Apakah kamu yakin ingin menghapus file ini?')) return;
  try {
    await api.delete(`/files/${id}`);
    message.value = 'File berhasil dihapus!';
    loadFolderContent(currentParentId.value);
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus file');
  }
};
</script>