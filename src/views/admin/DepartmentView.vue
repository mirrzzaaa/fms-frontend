<template>
  <div class="space-y-6">
    <!-- Header Halaman -->
    <div class="py-6">
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Departemen</h2>
      <p class="text-sm text-slate-500 mt-1">Kelola seluruh data departemen operasional Lion Group khusus Administrator</p>
    </div>

    <!-- Loading State menggunakan LoadingSpinner -->
    <div v-if="loading" class="py-16">
      <LoadingSpinner message="Memuat data departemen..." />
    </div>

    <!-- Memanggil Komponen Tabel Departemen (Hanya tampil jika tidak loading) -->
    <div v-else>
      <DepartmentTable 
        :departments="departments"
        @open-create="openModal('create')"
        @open-edit="openModal('edit', $event)"
        @open-detail="openModal('detail', $event)"
        @delete="deleteDepartment"
      />
    </div>

    <!-- Memanggil Komponen Modal -->
    <DepartmentModal 
      :is-open="isModalOpen"
      :mode="modalMode"
      :department-data="selectedDept"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import api from '../../service/api';
import DepartmentTable from '../../components/departments/DepartmentTable.vue';
import DepartmentModal from '../../components/departments/DepartmentModal.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

// Mengambil fungsi global alert dari MainLayout
const showAlert = inject('showAlert');

const departments = ref([]);
const loading = ref(false);
const isModalOpen = ref(false);
const modalMode = ref('create'); // 'create', 'edit', 'detail'
const selectedDept = ref(null);

onMounted(() => {
  fetchDepartments();
});

const fetchDepartments = async () => {
  loading.value = true;
  try {
    const response = await api.get('/departments');
    departments.value = response.data.data || response.data;
  } catch (error) {
    console.error('Gagal memuat departemen', error);
    showAlert('Gagal memuat data departemen.', 'error');
  } finally {
    loading.value = false;
  }
};

const openModal = (mode, dept = null) => {
  modalMode.value = mode;
  selectedDept.value = dept;
  isModalOpen.value = true;
};

const handleSave = async (data) => {
  try {
    if (data.mode === 'create') {
      await api.post('/departments', { name: data.name });
      showAlert('Departemen berhasil ditambahkan!', 'success');
    } else if (data.mode === 'edit') {
      await api.put(`/departments/${data.id}`, { name: data.name });
      showAlert('Departemen berhasil diperbarui!', 'success');
    }
    isModalOpen.value = false;
    fetchDepartments();
  } catch (error) {
    showAlert(error.response?.data?.message || 'Terjadi kesalahan', 'error');
  }
};

const deleteDepartment = async (id) => {
  if (!confirm('Apakah kamu yakin ingin menghapus departemen ini?')) return;
  
  try {
    await api.delete(`/departments/${id}`);
    showAlert('Departemen berhasil dihapus!', 'success');
    fetchDepartments();
  } catch (error) {
    showAlert(error.response?.data?.message || 'Gagal menghapus departemen', 'error');
  }
};
</script>