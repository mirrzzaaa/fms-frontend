import { ref } from 'vue';
import api from '../service/api';

export function useDashboard() {
  const stats = ref({
    total_files: 0,
    total_folders: 0,
    total_departments: 0,
    recent_files: []
  });
  const loading = ref(false);

  // Ambil data statistik dashboard dari backend
  const fetchDashboardData = async () => {
    loading.value = true;
    try {
      const response = await api.get('/dashboard');
      // Menyesuaikan struktur data yang dikembalikan oleh DashboardController
      stats.value = response.data.data || response.data;
    } catch (error) {
      console.error('Gagal memuat data dashboard', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    stats,
    loading,
    fetchDashboardData
  };
}