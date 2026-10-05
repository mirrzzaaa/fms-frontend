<template>
  <div class="space-y-8">
    <!-- Header Dashboard -->
    <div class="flex justify-between items-center py-3">
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
      <button 
        @click="fetchDashboardData" 
        :disabled="loading"
        class="btn-primary py-2 px-4 flex items-center gap-2 disabled:opacity-50"
      >
        <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
        <span>Refresh Data</span>
      </button>
    </div>

    <!-- Loading State Menggunakan Komponen LoadingSpinner -->
    <div v-if="loading && !stats.total_folders" class="py-16">
      <LoadingSpinner message="Memuat data dashboard..." />
    </div>

    <!-- Konten Dashboard -->
    <div v-else class="space-y-8">
      <!-- Kartu Statistik -->
      <StatCards :stats="stats"/>

      <!-- Tabel File Terbaru dengan Jarak Aman -->
      <div>
        <LatestFilesTable :files="stats.latest_files"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboard } from '../../composables/useDashboard';
import StatCards from '../../components/dashboard/StatCards.vue';
import LatestFilesTable from '../../components/dashboard/LatestFilesTable.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

// Menggunakan composable useDashboard
const { stats, loading, fetchDashboardData } = useDashboard();

onMounted(() => {
  fetchDashboardData();
});
</script>