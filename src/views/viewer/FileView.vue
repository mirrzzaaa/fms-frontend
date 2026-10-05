<template>
  <div class="space-y-6">
    <!-- Header & Info -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Seluruh File</h2>
        <p class="text-sm text-slate-500 mt-1">Daftar semua dokumen yang diunggah ke dalam sistem Lion FMS</p>
      </div>
    </div>

    <!-- Filter & Search Bar Section (Atas rata, tanpa bayangan bawah agar menyatu dengan tabel) -->
    <div class="bg-white rounded-t-2xl rounded-b-none shadow-none border border-slate-100 border-b-0 p-4 flex flex-col md:flex-row gap-4">
      <!-- Input Pencarian -->
      <div class="flex-1">
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="text" 
          placeholder="Cari berdasarkan judul atau nama file..." 
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition placeholder:text-slate-400"
        />
      </div>

      <!-- Filter Berdasarkan Departemen -->
      <div class="w-full md:w-1/4">
        <select 
          v-model="selectedDepartment" 
          @change="fetchFilesList"
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition"
        >
          <option value="">Semua Departemen</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12">
      <LoadingSpinner message="Memuat daftar file..." />
    </div>

    <!-- Tabel Daftar File -->
    <div v-else>
      <FileTable 
        :files="files"
        :user-role="userRole"
        @download="downloadFile"
        @detail="openDetailModal"
      />
    </div>

    <!-- Modal Detail File -->
    <FileDetailModal 
      :is-open="isDetailModalOpen"
      :file-data="selectedFile"
      :user-role="userRole"
      @close="isDetailModalOpen = false"
      @refresh="fetchFilesList"
      @preview="openPreviewModal"
    />

    <!-- Modal Preview File (Ditambahkan di sini) -->
    <FilePreviewModal 
      :is-open="isPreviewModalOpen"
      :file-data="selectedFile"
      @close="isPreviewModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import api from '../../service/api';

import { useFiles } from '../../composables/useFile';
import FileTable from '../../components/files/FileTable.vue';
import FileDetailModal from '../../components/files/FileDetailModal.vue';
import FilePreviewModal from '../../components/files/FilePreviewModal.vue'; // <-- Tambahkan import ini
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

// Mengambil fungsi global alert dari MainLayout
const showAlert = inject('showAlert');

const departments = ref([]);
const userRole = ref('viewer');

// State Filter & Search
const searchQuery = ref('');
const selectedDepartment = ref('');

// State Modal Detail & Preview
const isDetailModalOpen = ref(false);
const isPreviewModalOpen = ref(false); // <-- Tambahkan state ini
const selectedFile = ref(null);

// Memanggil fungsi & state dari composable useFiles
const { files, loading, fetchFiles, downloadFile } = useFiles(showAlert);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userRole.value = user.role || 'viewer';
  
  fetchDepartments();
  fetchFilesList();
});

// Ambil daftar departemen untuk dropdown filter
const fetchDepartments = async () => {
  try {
    const res = await api.get('/departments');
    departments.value = res.data.data || res.data;
  } catch (error) {
    console.error('Gagal memuat departemen', error);
  }
};

// Mengambil list file berdasarkan filter pencarian & departemen
const fetchFilesList = () => {
  const params = {};
  if (searchQuery.value) params.search = searchQuery.value;
  if (selectedDepartment.value) params.department_id = selectedDepartment.value;
  
  fetchFiles(params);
};

// Debounce sederhana untuk input pencarian
let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchFilesList();
  }, 300);
};

const openDetailModal = (file) => {
  selectedFile.value = file;
  isDetailModalOpen.value = true;
};

// Fungsi handler untuk membuka modal preview
const openPreviewModal = (file) => {
  selectedFile.value = file;
  isPreviewModalOpen.value = true;
};
</script>