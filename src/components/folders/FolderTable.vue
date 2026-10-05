<template>
  <div class="overflow-x-auto rounded-xl border border-slate-200">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="table-header">
          <th class="py-3.5 px-4">Nama</th>
          <th class="py-3.5 px-4">Tanggal Diubah</th>
          <th class="py-3.5 px-4">Tipe</th>
          <th class="py-3.5 px-4">Ukuran</th>
          <th class="py-3.5 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 bg-white text-sm">
        <!-- Render Folder Terlebih Dahulu -->
        <tr v-for="folder in folders" :key="'folder-' + folder.id" class="hover:bg-slate-50/80 transition group">
          <td class="py-3.5 px-4 flex items-center gap-3 cursor-pointer" @click="$emit('enter-folder', folder)">
            <svg class="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
            </svg>
            <span class="font-semibold text-slate-800 hover:text-blue-600 transition truncate">{{ folder.name }}</span>
          </td>
          <td class="py-3.5 px-4 text-slate-600 text-xs">{{ formatDate(folder.updated_at || folder.created_at) }}</td>
          <td class="py-3.5 px-4 text-slate-500 text-xs">File folder</td>
          <td class="py-3.5 px-4 text-slate-400 text-xs">-</td>
          <td class="py-3.5 px-4 text-center">
            <div v-if="userRole === 'admin'" class="inline-flex items-center gap-1 justify-center">
              <button @click="$emit('edit-folder', folder)" class="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition" title="Rename">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button @click="$emit('delete-folder', folder.id)" class="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition" title="Hapus">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </td>
        </tr>

        <!-- Render File di dalam Folder -->
        <tr v-for="file in files" :key="'file-' + file.id" class="hover:bg-slate-50/80 transition group">
          <td class="py-3.5 px-4 flex items-center gap-3">
            <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <span class="font-medium text-slate-700 truncate">{{ file.title || file.original_filename }}</span>
          </td>
          <td class="py-3.5 px-4 text-slate-600 text-xs">{{ formatDate(file.updated_at || file.created_at) }}</td>
          <td class="py-3.5 px-4 text-slate-500 text-xs uppercase">{{ getFileExtension(file.original_filename) }} File</td>
          <td class="py-3.5 px-4 text-slate-600 text-xs">{{ file.size || '12 KB' }}</td>
          <td class="py-3.5 px-4 text-center">
            <div class="inline-flex items-center gap-1 justify-center">
              <button @click="$emit('download-file', file)" class="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition" title="Unduh File">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
              <button v-if="userRole === 'admin'" @click="$emit('delete-file', file.id)" class="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition" title="Hapus File">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </td>
        </tr>

        <!-- State Kosong -->
        <tr v-if="folders.length === 0 && files.length === 0">
          <td colspan="5" class="p-0">
            <EmptyState 
              title="Direktori Kosong" 
              description="Belum ada folder ataupun dokumen yang tersedia di dalam direktori ini." 
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import EmptyState from '../common//EmptyState.vue';

defineProps({
  folders: {
    type: Array,
    required: true,
    default: () => []
  },
  files: {
    type: Array,
    default: () => []
  },
  userRole: {
    type: String,
    default: 'viewer'
  }
});

defineEmits(['enter-folder', 'edit-folder', 'delete-folder', 'download-file', 'delete-file']);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const getFileExtension = (filename) => {
  if (!filename) return 'DOC';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'FILE';
};
</script>