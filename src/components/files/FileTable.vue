<template>
  <div class="bg-white rounded-t-none rounded-b-2xl shadow-sm border border-slate-100 border-t-0 p-4 space-y-4">
    <div class="flex justify-between items-center py-2">
      <h3 class="text-base font-semibold text-slate-800">Daftar File di Folder Ini</h3>
    </div>

    <!-- Tabel Data dengan Border dan Spasi Vertikal yang Lega -->
    <div class="overflow-x-auto rounded-xl border border-slate-200">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="table-header">
            <th class="py-3.5 px-4">Judul (Title)</th>
            <th class="py-3.5 px-4">Nama File Asli</th>
            <th class="py-3.5 px-4">Departemen</th>
            <th class="py-3.5 px-4">Uploader</th>
            <th class="py-3.5 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="file in files" :key="file.id" class="hover:bg-slate-50/80 transition text-sm">
            <td class="py-4 px-4 font-semibold text-slate-800">{{ file.title }}</td>
            <td class="py-4 px-4 text-slate-600 truncate max-w-xs">{{ file.original_filename }}</td>
            <td class="py-4 px-4 text-slate-600">{{ file.department?.name ?? '-' }}</td>
            <td class="py-4 px-4 text-slate-600">{{ file.user?.name ?? '-' }}</td>
            <td class="py-4 px-4 text-center">
              <div class="inline-flex items-center gap-1.5 justify-center">
                <!-- Tombol Download (Ikon Download) -->
                <button 
                  @click="$emit('download', file)" 
                  class="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition"
                  title="Download"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </button>

                <!-- Tombol Detail (Ikon Mata) -->
                <button 
                  @click="$emit('detail', file)" 
                  class="p-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition"
                  title="Detail"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                <!-- Tombol Edit & Hapus (Khusus Admin) -->
                <template v-if="userRole === 'admin'">
                  <!-- Tombol Edit (Ikon Pensil) -->
                  <button 
                    @click="$emit('edit', file)" 
                    class="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg transition"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- Tombol Hapus (Ikon Tempat Sampah) -->
                  <button 
                    @click="$emit('delete', file.id)" 
                    class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </template>
              </div>
            </td>
          </tr>

          <!-- State Kosong Menggunakan EmptyState -->
          <tr v-if="!files || files.length === 0">
            <td colspan="5" class="p-0">
              <EmptyState 
                title="Belum ada file" 
                description="Belum ada dokumen atau file yang diunggah ke dalam folder ini." 
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
  },
  userRole: {
    type: String,
    default: 'viewer'
  }
});

defineEmits(['open-upload', 'download', 'detail', 'edit', 'delete']);
</script>