<template>
  <!-- Tambahkan mt-8 di sini agar ada jarak paksa dari kartu statistik di atasnya -->
  <div class="card-box mt-8">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-bold text-slate-800 tracking-tight py-3">10 File Terbaru</h3>
      <span class="text-xs font-medium text-slate-400">Pembaruan Terakhir</span>
    </div>

    <!-- Tabel Data Responsif -->
    <div class="overflow-x-auto rounded-xl border border-slate-200">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="table-header">
            <th class="py-3 px-4">Judul File</th>
            <th class="py-3 px-4">Nama Asli</th>
            <th class="py-3 px-4">Departemen</th>
            <th class="py-3 px-4">Folder</th>
            <th class="py-3 px-4">Uploader</th>
            <th class="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="file in files" :key="file.id" class="hover:bg-slate-50/80 transition text-sm">
            <td class="py-3.5 px-4 font-semibold text-slate-800">{{ file.title }}</td>
            <td class="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">{{ file.original_filename }}</td>
            <td class="py-3.5 px-4 text-slate-600">
              <span class="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">
                {{ file.department?.name ?? '-' }}
              </span>
            </td>
            <td class="py-3.5 px-4 text-slate-600">{{ file.folder?.name ?? '-' }}</td>
            <td class="py-3.5 px-4 text-slate-600">{{ file.user?.name ?? '-' }}</td>
            <td class="py-3.5 px-4 text-center">
              <button @click="$emit('detail', file)" class="btn-detail inline-flex">
                Detail
              </button>
            </td>
          </tr>
          
          <!-- Jika Data Kosong -->
          <tr v-if="!files || files.length === 0">
            <td colspan="6" class="p-0">
              <EmptyState 
                title="Belum ada file" 
                description="Belum ada file terbaru yang diunggah ke dalam sistem." 
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import EmptyState from '../common/EmptyState.vue';

defineProps({
  files: {
    type: Array,
    required: true,
    default: () => []
  }
});

defineEmits(['detail']);
</script>