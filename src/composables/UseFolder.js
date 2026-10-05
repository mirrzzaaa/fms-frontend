import { ref } from 'vue';
import api from '../service/api';

export function useFolders(showAlert) {
  const currentFolderId = ref(null);
  const breadcrumbs = ref([]);
  const currentFolders = ref([]);
  const currentFiles = ref([]);
  const loading = ref(false);

  const fetchDirectoryContents = async (folderId) => {
    loading.value = true;
    try {
      const url = folderId ? `/folders/${folderId}` : '/folders';
      const response = await api.get(url);
      
      const result = response.data.data;

      if (folderId) {
        currentFolders.value = result.children || [];
        currentFiles.value = result.files || [];
      } else {
        currentFolders.value = result.folders || [];
        currentFiles.value = result.files || [];
      }
    } catch (error) {
      console.error('Gagal memuat isi direktori:', error.response?.data || error.message);
      if (showAlert) showAlert('Gagal memuat isi direktori dari server.', 'error');
    } finally {
      loading.value = false;
    }
  };

  const enterFolder = (folder) => {
    breadcrumbs.value.push({ id: folder.id, name: folder.name });
    currentFolderId.value = folder.id;
    fetchDirectoryContents(folder.id);
  };

  const goToRoot = () => {
    breadcrumbs.value = [];
    currentFolderId.value = null;
    fetchDirectoryContents(null);
  };

  const navigateToCrumb = (crumb, index) => {
    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
    currentFolderId.value = crumb.id;
    fetchDirectoryContents(crumb.id);
  };

  const saveFolder = async (payload, mode, folderId = null) => {
    loading.value = true;
    try {
      if (mode === 'edit') {
        await api.put(`/folders/${folderId}`, { name: payload.name });
        if (showAlert) showAlert('Folder berhasil diperbarui!', 'success');
      } else {
        await api.post('/folders', {
          name: payload.name,
          parent_id: currentFolderId.value 
        });
        if (showAlert) showAlert('Folder baru berhasil dibuat!', 'success');
      }
      
      fetchDirectoryContents(currentFolderId.value);
      return true;
    } catch (error) {
      console.error('Gagal menyimpan folder:', error.response?.data || error.message);
      if (showAlert) showAlert(error.response?.data?.message || 'Gagal menyimpan folder', 'error');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteFolder = async (folderId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus folder ini?')) return;
    try {
      await api.delete(`/folders/${folderId}`);
      if (showAlert) showAlert('Folder berhasil dihapus!', 'success');
      fetchDirectoryContents(currentFolderId.value);
    } catch (error) {
      if (showAlert) showAlert(error.response?.data?.message || 'Gagal menghapus folder', 'error');
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus file ini?')) return;
    try {
      await api.delete(`/files/${fileId}`);
      if (showAlert) showAlert('File berhasil dihapus!', 'success');
      fetchDirectoryContents(currentFolderId.value);
    } catch (error) {
      if (showAlert) showAlert(error.response?.data?.message || 'Gagal menghapus file', 'error');
    }
  };

  return {
    currentFolderId,
    breadcrumbs,
    currentFolders,
    currentFiles,
    loading,
    fetchDirectoryContents,
    enterFolder,
    goToRoot,
    navigateToCrumb,
    saveFolder,
    deleteFolder,
    deleteFile
  };
}