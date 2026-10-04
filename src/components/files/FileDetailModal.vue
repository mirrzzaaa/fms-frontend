<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
      <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Detail Informasi File</h3>
      
      <div v-if="fileData" class="space-y-3 text-sm text-gray-700">
        <div>
          <span class="block text-xs font-semibold text-gray-400 uppercase">Judul (Title)</span>
          <p class="font-bold text-gray-900 text-base">{{ fileData.title }}</p>
        </div>
        <div>
          <span class="block text-xs font-semibold text-gray-400 uppercase">Nama File Asli</span>
          <p class="text-gray-800">{{ fileData.original_filename }}</p>
        </div>
        <div>
          <span class="block text-xs font-semibold text-gray-400 uppercase">Folder</span>
          <p class="text-gray-800">{{ fileData.folder?.name ?? 'Root Folder' }}</p>
        </div>
        <div>
          <span class="block text-xs font-semibold text-gray-400 uppercase">Departemen</span>
          <p class="text-gray-800">{{ fileData.department?.name ?? '-' }}</p>
        </div>
        <div>
          <span class="block text-xs font-semibold text-gray-400 uppercase">Diupload Oleh (Uploaded By)</span>
          <p class="text-gray-800">{{ fileData.user?.name ?? '-' }}</p>
        </div>
        <div>
          <span class="block text-xs font-semibold text-gray-400 uppercase">Tanggal Upload (Upload Date)</span>
          <p class="text-gray-800">{{ formatDate(fileData.created_at) }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button 
          @click="$emit('close')" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  fileData: { type: Object, default: null }
});

defineEmits(['close']);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>