import { ref } from 'vue';
import api from '../service/api';

export function useFiles(showAlert) {
  const files = ref([]);
  const loading = ref(false);

  const fetchFiles = async (params = {}) => {
    loading.value = true;
    try {
      const response = await api.get('/files', { params });
      files.value = response.data.data?.data || response.data.data || response.data;
    } catch (error) {
      console.error('Gagal memuat daftar file', error);
      if (showAlert) showAlert('Gagal memuat daftar file', 'error');
    } finally {
      loading.value = false;
    }
  };

  const saveFile = async (data, onSuccess) => {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('department_id', data.department_id);
      formData.append('folder_id', data.folder_id || '');

      if (data.mode === 'create') {
        if (data.file) formData.append('file', data.file);
        await api.post('/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (showAlert) showAlert('File berhasil diunggah!', 'success');
      } else if (data.mode === 'edit') {
        if (data.file) {
          formData.append('file', data.file);
        }
        formData.append('_method', 'PUT');
        
        await api.post(`/files/${data.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (showAlert) showAlert('Informasi file berhasil diperbarui!', 'success');
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      const errMessage = error.response?.data?.message || 'Gagal menyimpan file';
      console.error('Gagal menyimpan file:', error);
      if (showAlert) showAlert(errMessage, 'error');
    } finally {
      loading.value = false;
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
      if (showAlert) showAlert('File berhasil didownload!', 'success');
    } catch (error) {
      console.error('Gagal mendownload file:', error);
      if (showAlert) showAlert('Gagal mendownload file dari server.', 'error');
    }
  };

  const deleteFile = async (id, onSuccess) => {
    if (!confirm('Apakah kamu yakin ingin menghapus file ini?')) return;
    try {
      await api.delete(`/files/${id}`);
      if (showAlert) showAlert('File berhasil dihapus!', 'success');
      if (onSuccess) onSuccess();
    } catch (error) {
      const errMessage = error.response?.data?.message || 'Gagal menghapus file';
      console.error('Gagal menghapus file:', error);
      if (showAlert) showAlert(errMessage, 'error');
    }
  };

  return {
    files,
    loading,
    fetchFiles,
    saveFile,
    downloadFile,
    deleteFile
  };
}