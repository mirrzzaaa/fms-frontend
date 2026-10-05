<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 transform transition-all animate-pop">
        <div class="flex items-center justify-between mb-4 border-b pb-3">
          <h3 class="text-base font-semibold text-slate-800">Detail Informasi File</h3>
          <button 
            type="button" 
            @click="$emit('close')"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="fileData" class="space-y-3 text-sm text-slate-700">
          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase">Judul (Title)</span>
            <p class="font-bold text-slate-900 text-base">{{ fileData.title }}</p>
          </div>
          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase">Nama File Asli</span>
            <p class="text-slate-800 truncate">{{ fileData.original_filename }}</p>
          </div>
          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase">Folder</span>
            <p class="text-slate-800">{{ fileData.folder?.name ?? 'Root Folder' }}</p>
          </div>
          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase">Departemen</span>
            <p class="text-slate-800">{{ fileData.department?.name ?? '-' }}</p>
          </div>
          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase">Diupload Oleh</span>
            <p class="text-slate-800">{{ fileData.user?.name ?? '-' }}</p>
          </div>
          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase">Tanggal Upload</span>
            <p class="text-slate-800">{{ formatDate(fileData.created_at) }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-between items-center pt-3 border-t border-slate-100">
          <div class="flex gap-2 flex-wrap">
            <!-- Tombol Preview (Baru) -->
            <button 
              v-if="fileData"
              @click="$emit('preview', fileData)"
              class="px-3.5 py-2 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Preview
            </button>

            <button 
              v-if="fileData"
              @click="handleDownload(fileData)"
              class="px-3.5 py-2 rounded-xl text-xs font-medium bg-sky-50 text-sky-600 hover:bg-sky-100 transition flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Unduh
            </button>

            <button 
              v-if="userRole === 'admin' && fileData"
              @click="handleDelete(fileData.id)"
              class="px-3.5 py-2 rounded-xl text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Hapus
            </button>
          </div>

          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useFiles } from '../../composables/useFile';

const props = defineProps({
  isOpen: Boolean,
  fileData: { type: Object, default: null },
  userRole: { type: String, default: 'viewer' }
});

const emit = defineEmits(['close', 'refresh', 'preview']);

const { downloadFile, deleteFile } = useFiles();

const handleDownload = (file) => {
  downloadFile(file);
};

const handleDelete = async (id) => {
  await deleteFile(id, () => {
    emit('refresh'); 
    emit('close');   
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-pop {
  animation: pop 0.15s ease-out forwards;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>