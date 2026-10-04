import { ref } from 'vue';
import api from '../service/api';

export function useDepartments() {
  const departments = ref([]);
  const loading = ref(false);
  const message = ref('');

  // 1. Ambil daftar seluruh departemen
  const fetchDepartments = async () => {
    loading.value = true;
    try {
      const response = await api.get('/departments');
      departments.value = response.data.data || response.data;
    } catch (error) {
      console.error('Gagal memuat daftar departemen', error);
    } finally {
      loading.value = false;
    }
  };

  // 2. Simpan Departemen (Create atau Update - Khusus Admin)
  const saveDepartment = async (data, onSuccess) => {
    try {
      if (data.mode === 'create') {
        await api.post('/departments', { name: data.name });
        message.value = 'Departemen berhasil ditambahkan!';
      } else if (data.mode === 'edit') {
        await api.put(`/departments/${data.id}`, { name: data.name });
        message.value = 'Departemen berhasil diperbarui!';
      }

      if (onSuccess) onSuccess();
      fetchDepartments();
      setTimeout(() => message.value = '', 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan departemen');
    }
  };

  // 3. Hapus Departemen (Khusus Admin)
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

  return {
    departments,
    loading,
    message,
    fetchDepartments,
    saveDepartment,
    deleteDepartment
  };
}