import { ref } from 'vue';
import api from '../service/api';

export function useFolders() {
  const folders = ref([]);
  const breadcrumbs = ref([]);
  const currentParentId = ref(null);
  const loading = ref(false);
  const message = ref('');

  // 1. Ambil data folder
  const fetchFolders = async (parentId = null) => {
    loading.value = true;
    try {
      const response = await api.get('/folders', { params: { parent_id: parentId } });
      folders.value = response.data.data || response.data;
    } catch (error) {
      console.error('Gagal memuat folder', error);
    } finally {
      loading.value = false;
    }
  };

  // 2. Simpan Folder (Create atau Update)
  const saveFolder = async (data, onSuccess) => {
    try {
      if (data.mode === 'create') {
        await api.post('/folders', { 
          name: data.name, 
          parent_id: data.parent_id 
        });
        message.value = 'Folder berhasil dibuat!';
      } else if (data.mode === 'edit') {
        await api.put(`/folders/${data.id}`, { 
          name: data.name 
        });
        message.value = 'Folder berhasil diubah namanya!';
      }
      
      if (onSuccess) onSuccess();
      setTimeout(() => message.value = '', 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan folder');
    }
  };

  // 3. Hapus Folder
  const deleteFolder = async (id, onSuccess) => {
    if (!confirm('Apakah kamu yakin ingin menghapus folder ini? (Sub-folder & file di dalamnya akan ikut terhapus)')) return;
    try {
      await api.delete(`/folders/${id}`);
      message.value = 'Folder berhasil dihapus!';
      if (onSuccess) onSuccess();
      setTimeout(() => message.value = '', 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus folder');
    }
  };

  // Navigasi
  const enterFolder = (folder, callback) => {
    breadcrumbs.value.push(folder);
    currentParentId.value = folder.id;
    if (callback) callback(folder.id);
  };

  const navigateToRoot = (callback) => {
    breadcrumbs.value = [];
    currentParentId.value = null;
    if (callback) callback(null);
  };

  const navigateToFolder = (crumb, index, callback) => {
    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
    currentParentId.value = crumb.id;
    if (callback) callback(crumb.id);
  };

  return {
    folders,
    breadcrumbs,
    currentParentId,
    loading,
    message,
    fetchFolders,
    saveFolder,
    deleteFolder,
    enterFolder,
    navigateToRoot,
    navigateToFolder
  };
}