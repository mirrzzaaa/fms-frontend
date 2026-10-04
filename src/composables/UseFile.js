import { ref } from 'vue';
import api from '../service/api';

export function useFiles() {
  const files = ref([]);
  const loading = ref(false);
  const message = ref('');

  // 1. Ambil daftar file (Mendukung parameter pencarian, folder, dan departemen)
  const fetchFiles = async (params = {}) => {
    loading.value = true;
    try {
      const response = await api.get('/files', { params });
      // Menyesuaikan struktur response pagination dari Laravel
      files.value = response.data.data?.data || response.data.data || response.data;
    } catch (error) {
      console.error('Gagal memuat daftar file', error);
    } finally {
      loading.value = false;
    }
  };

  // 2. Simpan atau Unggah File Baru / Edit Informasi File (Khusus Admin)
  const saveFile = async (data, onSuccess) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('department_id', data.department_id);
      formData.append('folder_id', data.folder_id);

      if (data.mode === 'create') {
        if (data.file) formData.append('file', data.file);
        await api.post('/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.value = 'File berhasil diunggah!';
      } else if (data.mode === 'edit') {
        // Jika ada file baru saat edit
        if (data.file) {
          formData.append('file', data.file);
        }
        // Gunakan _method PUT untuk FormData di Laravel
        formData.append('_method', 'PUT');
        
        await api.post(`/files/${data.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.value = 'Informasi file berhasil diperbarui!';
      }

      if (onSuccess) onSuccess();
      setTimeout(() => message.value = '', 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan file');
    }
  };

  // 3. Download File
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

  // 4. Hapus File (Khusus Admin)
  const deleteFile = async (id, onSuccess) => {
    if (!confirm('Apakah kamu yakin ingin menghapus file ini?')) return;
    try {
      await api.delete(`/files/${id}`);
      message.value = 'File berhasil dihapus!';
      if (onSuccess) onSuccess();
      setTimeout(() => message.value = '', 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus file');
    }
  };

  return {
    files,
    loading,
    message,
    fetchFiles,
    saveFile,
    downloadFile,
    deleteFile
  };
}