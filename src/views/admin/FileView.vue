<template>
  <div>
    <!-- Header & Info -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Manajemen Seluruh File</h2>
        <p class="text-sm text-gray-500 mt-1">Daftar semua dokumen yang diunggah ke dalam sistem Lion FMS</p>
      </div>

      <button 
        v-if="userRole === 'admin'"
        @click="openUploadModal('create')" 
        class="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
      >
        + Upload File Baru
      </button>
    </div>

    <!-- Alert Notifikasi -->
    <div v-if="message" class="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
      {{ message }}
    </div>

    <!-- Filter & Search Bar Section -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
      <!-- Input Pencarian -->
      <div class="flex-1">
        <input 
          v-model="searchQuery" 
          @input="fetchFiles"
          type="text" 
          placeholder="Cari berdasarkan judul atau nama file..." 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <!-- Filter Berdasarkan Departemen -->
      <div class="w-full md:w-1/4">
        <select 
          v-model="selectedDepartment" 
          @change="fetchFiles"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Semua Departemen</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tabel Daftar File menggunakan komponen FileTable yang sudah ada -->
    <FileTable 
      :files="files"
      :user-role="userRole"
      @open-upload="openUploadModal('create')"
      @download="downloadFile"
      @detail="openDetailModal"
      @edit="openUploadModal('edit', $event)"
      @delete="deleteFile"
    />

    <!-- Modal Upload / Edit File -->
    <UploadFileModal 
      :is-open="isUploadModalOpen"
      :mode="uploadModalMode"
      :file-data="selectedFile"
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
import FileTable from '../../components/files/FileTable.vue';
import UploadFileModal from '../../components/files/UploadFileModal.vue';
import FileDetailModal from '../../components/files/FileDetailModal.vue';

const files = ref([]);
const departments = ref([]);
const userRole = ref('');
const message = ref('');

// State Filter & Search
const searchQuery = ref('');
const selectedDepartment = ref('');

// State Modal
const isUploadModalOpen = ref(false);
const uploadModalMode = ref('create');
const isDetailModalOpen = ref(false);
const selectedFile = ref(null);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userRole.value = user.role || 'viewer';
  
  fetchDepartments();
  fetchFiles();
});

// Ambil daftar departemen untuk dropdown filter
const fetchDepartments = async () => {
  try {
    const res = await api.get('/departments');
    departments.value = res.data.data || res.data;
  } catch (error) {
    console.error('Gagal memuat departemen', error);
  }
});

// Ambil daftar semua file dengan parameter pencarian dan filter departemen
const fetchFiles = async () => {
  try {
    const params = {};
    if (searchQuery.value) params.search = searchQuery.value;
    if (selectedDepartment.value) params.department_id = selectedDepartment.value;

    const response = await api.get('/files', { params });
    // Menyesuaikan struktur response pagination dari Laravel
    files.value = response.data.data?.data || response.data.data || response.data;
  } catch (error) {
    console.error('Gagal memuat daftar file', error);
  }
};

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
    formData.append('folder_id', data.folder_id || 1); // Default folder jika mandiri

    if (data.mode === 'create') {
      if (data.file) formData.append('file', data.file);
      await api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.value = 'File berhasil diunggah!';
    } else if (data.mode === 'edit') {
      await api.put(`/files/${data.id}`, {
        title: data.title,
        department_id: data.department_id,
        folder_id: data.folder_id
      });
      message.value = 'Informasi file berhasil diperbarui!';
    }

    isUploadModalOpen.value = false;
    fetchFiles();
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
    fetchFiles();
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus file');
  }
};
</script>