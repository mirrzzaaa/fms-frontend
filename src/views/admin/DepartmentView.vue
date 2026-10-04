<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Manajemen Departemen</h2>
      <p class="text-sm text-gray-500 mt-1">Kelola seluruh data departemen operasional Lion Group khusus Administrator</p>
    </div>

    <!-- Alert Notifikasi -->
    <div v-if="message" class="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
      {{ message }}
    </div>

    <!-- Memanggil Komponen Tabel -->
    <DepartmentTable 
      :departments="departments"
      @open-create="openModal('create')"
      @open-edit="openModal('edit', $event)"
      @open-detail="openModal('detail', $event)"
      @delete="deleteDepartment"
    />

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
import { ref, onMounted } from 'vue';
import api from '../../service/api';
import DepartmentTable from '../../components/departments/DepartmentTable.vue';
import DepartmentModal from '../../components/departments/DepartmentModal.vue';

const departments = ref([]);
const message = ref('');
const isModalOpen = ref(false);
const modalMode = ref('create'); // 'create', 'edit', 'detail'
const selectedDept = ref(null);

onMounted(() => {
  fetchDepartments();
});

const fetchDepartments = async () => {
  try {
    const response = await api.get('/departments');
    departments.value = response.data.data || response.data;
  } catch (error) {
    console.error('Gagal memuat departemen', error);
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
      message.value = 'Departemen berhasil ditambahkan!';
    } else if (data.mode === 'edit') {
      await api.put(`/departments/${data.id}`, { name: data.name });
      message.value = 'Departemen berhasil diperbarui!';
    }
    isModalOpen.value = false;
    fetchDepartments();
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    alert(error.response?.data?.message || 'Terjadi kesalahan');
  }
};

const deleteDepartment = async (id) => {
  if (!confirm('Apakah kamu yakin ingin menghapus departemen ini?')) return;
  
  try {
    await api.delete(`/departments/${id}`);
    message.value = 'Departemen berhasil dihapus!';
    fetchDepartments();
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus departemen');
  }
};
</script>