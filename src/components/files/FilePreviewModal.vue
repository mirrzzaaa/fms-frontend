<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        <!-- Header Modal -->
        <div class="flex items-center justify-between mb-4 border-b pb-3">
          <h3 class="text-base font-semibold text-slate-800 truncate pr-4">
            Preview: {{ fileData?.title || fileData?.original_filename }}
          </h3>
          <button 
            type="button" 
            @click="$emit('close')"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition shrink-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Konten Area Preview -->
        <div class="flex-1 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-4 min-h-[400px]">
          
          <!-- Pratinjau Jika Berupa Gambar -->
          <img 
            v-if="isImage && fileUrl" 
            :src="fileUrl" 
            :alt="fileData?.original_filename"
            class="max-h-[60vh] object-contain rounded-lg shadow-sm"
          />

          <!-- Pratinjau Jika Berupa PDF -->
          <iframe 
            v-else-if="isPdf && fileUrl" 
            :src="fileUrl" 
            class="w-full h-[60vh] rounded-lg border-0 bg-white"
          ></iframe>

          <!-- Fallback Jika URL Tidak Ada atau Format Lain -->
          <div v-else class="text-center py-12 text-slate-500">
            <svg class="w-16 h-16 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-sm font-medium">Pratinjau langsung tidak tersedia atau tautan file kosong.</p>
            <p class="text-xs text-slate-400 mt-1">Silakan gunakan tombol unduh di bawah.</p>
          </div>
        </div>

        <!-- Footer / Tombol Aksi -->
        <div class="flex justify-end gap-2.5 pt-4 mt-2 border-t border-slate-100">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Tutup
          </button>
          <a 
            v-if="fileUrl"
            :href="fileUrl" 
            target="_blank"
            download
            class="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download File</span>
          </a>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  fileData: { type: Object, default: null }
});

defineEmits(['close']);

// Mengambil URL dari berbagai kemungkinan properti backend
const fileUrl = computed(() => {
  if (!props.fileData) return '';
  return props.fileData.url || props.fileData.file_url || props.fileData.path || '';
});

const fileExtension = computed(() => {
  const filename = props.fileData?.original_filename || fileUrl.value;
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
});

const isImage = computed(() => {
  const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imgExts.includes(fileExtension.value);
});

const isPdf = computed(() => {
  return fileExtension.value === 'pdf';
});
</script>