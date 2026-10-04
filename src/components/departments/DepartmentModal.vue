<template>
  <!-- Menghapus bg-black bg-opacity-50 dan menggantinya agar latar belakang transparan/tidak gelap -->
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/20 backdrop-blur-sm">
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-100">
      <h3 class="text-lg font-bold text-gray-800 mb-4">
        {{ mode === 'detail' ? 'Detail Departemen' : mode === 'edit' ? 'Edit Departemen' : 'Tambah Departemen Baru' }}
      </h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Nama Departemen</label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            :disabled="mode === 'detail'"
            placeholder="Contoh: Flight Operations, HRD, Teknik" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
          />
        </div>

        <div v-if="mode === 'detail'" class="mb-4 text-sm text-gray-600 space-y-1">
          <p><b>Dibuat pada:</b> {{ formatDate(form.created_at) }}</p>
          <p><b>Terakhir diupdate:</b> {{ formatDate(form.updated_at) }}</p>
        </div>

        <div class="flex justify-end space-x-2">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            {{ mode === 'detail' ? 'Tutup' : 'Batal' }}
          </button>
          <button 
            v-if="mode !== 'detail'"
            type="submit" 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: 'create' }, // 'create', 'edit', 'detail'
  departmentData: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

const form = reactive({
  id: null,
  name: '',
  created_at: '',
  updated_at: ''
});

watch(() => props.departmentData, (newData) => {
  if (newData && (props.mode === 'edit' || props.mode === 'detail')) {
    form.id = newData.id;
    form.name = newData.name;
    form.created_at = newData.created_at;
    form.updated_at = newData.updated_at;
  } else {
    form.id = null;
    form.name = '';
    form.created_at = '';
    form.updated_at = '';
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { id: form.id, name: form.name, mode: props.mode });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>