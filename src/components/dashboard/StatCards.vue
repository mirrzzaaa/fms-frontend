<template>
 
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
    <!-- Card Total Folder -->
    <div class="card-box border-l-4 border-l-blue-600 flex flex-col justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Folder</p>
        <p class="text-3xl font-extrabold text-slate-800 mt-2">{{ stats.total_folders }}</p>
      </div>
      <div class="mt-4 flex items-center gap-1.5 text-xs font-medium text-blue-600">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
        </svg>
        <span>Direktori Aktif</span>
      </div>
    </div>

    <!-- Card Total File -->
    <div class="card-box border-l-4 border-l-emerald-500 flex flex-col justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total File</p>
        <p class="text-3xl font-extrabold text-slate-800 mt-2">{{ stats.total_files }}</p>
      </div>
      <div class="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>Dokumen Tersimpan</span>
      </div>
    </div>

    <!-- Card Total Departemen -->
    <div class="card-box border-l-4 border-l-violet-500 flex flex-col justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Departemen</p>
        <p class="text-3xl font-extrabold text-slate-800 mt-2">{{ stats.total_departments }}</p>
      </div>
      <div class="mt-4 flex items-center gap-1.5 text-xs font-medium text-violet-600">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span>Unit Organisasi</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      total_folders: 0,
      total_files: 0,
      total_departments: 0
    })
  }
});
</script>