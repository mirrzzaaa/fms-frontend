<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      <button 
        @click="fetchDashboardData" 
        class="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Refresh Data
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-gray-500 py-4">Memuat data statistik...</div>

    <div v-else>
      <!-- Memanggil komponen kartu statistik -->
      <StatCards :stats="stats" />

      <!-- Memanggil komponen tabel file terbaru -->
      <LatestFilesTable :files="stats.latest_files" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboard } from '../../composables/useDashboard';
import StatCards from '../../components/dashboard/StatCards.vue';
import LatestFilesTable from '../../components/dashboard/LatestFilesTable.vue';

// Menggunakan composable useDashboard
const { stats, loading, fetchDashboardData } = useDashboard();

onMounted(() => {
  fetchDashboardData();
});
</script>