<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
      <h3 class="text-lg font-bold text-gray-800 mb-4">
        {{ mode === 'edit' ? 'Edit Informasi File' : 'Upload File Baru' }}
      </h3>
      
      <form @submit.prevent="handleSubmit">
        <!-- Input Title -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Judul File (Title)</label>
          <input 
            v-model="form.title" 
            type="text" 
            required
            placeholder="Contoh: Laporan Keuangan Q1" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <!-- Pilih Folder Tujuan -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Pilih Folder</label>
          <select 
            v-model="form.folder_id" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="" disabled>Pilih Folder Tujuan</option>
            <option v-for="folder in folders" :key="folder.id" :value="folder.id">
              📁 {{ folder.name }}
            </option>
          </select>
        </div>

        <!-- Pilih Departemen -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Departemen</label>
          <select 
            v-model="form.department_id" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="" disabled>Pilih Departemen</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <!-- Drag & Drop File Input (Muncul saat create, atau opsional saat edit) -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            File Dokumen / Gambar {{ mode === 'edit' ? '(Opsional: Biarkan kosong jika tidak ingin mengubah file)' : '' }}
          </label>
          <div 
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition',
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            ]"
            @click="$refs.fileInput.click()"
          >
            <input 
              ref="fileInput"
              type="file" 
              class="hidden" 
              @change="handleFileSelect"
            />
            <div v-if="form.file" class="text-sm text-gray-700 font-semibold">
              📄 {{ form.file.name }}
            </div>
            <div v-else-if="mode === 'edit' && fileData?.original_filename" class="text-sm text-gray-600">
              📄 File saat ini: <span class="font-medium text-blue-600">{{ fileData.original_filename }}</span>
              <p class="text-xs text-gray-400 mt-1">Klik atau seret file baru jika ingin menggantinya</p>
            </div>
            <div v-else class="text-sm text-gray-500">
              <span class="font-medium text-blue-600">Klik untuk upload</span> atau seret file (Drag & Drop) ke sini
              <p class="text-xs text-gray-400 mt-1">PDF, DOC, XLS, JPG, PNG (Maks. 10MB)</p>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex justify-end space-x-2">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button 
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
import { ref, reactive, watch, onMounted } from 'vue';
import api from '../../service/api';

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: 'create' },
  fileData: { type: Object, default: null },
  currentFolderId: { type: [Number, null], default: null }
});

const emit = defineEmits(['close', 'save']);

const departments = ref([]);
const folders = ref([]);
const isDragging = ref(false);

const form = reactive({
  title: '',
  department_id: '',
  folder_id: '',
  file: null
});

onMounted(async () => {
  try {
    const deptRes = await api.get('/departments');
    departments.value = deptRes.data.data || deptRes.data;

    const folderRes = await api.get('/folders');
    folders.value = folderRes.data.data || folderRes.data;
  } catch (e) {
    console.error('Gagal memuat data pendukung', e);
  }
});

// Memantau perubahan fileData dan mengisi form secara otomatis saat mode edit
watch(() => props.fileData, (newData) => {
  if (newData && props.mode === 'edit') {
    form.title = newData.title || '';
    form.department_id = newData.department_id || '';
    form.folder_id = newData.folder_id || '';
    form.file = null;
  } else {
    form.title = '';
    form.department_id = '';
    form.folder_id = props.currentFolderId || '';
    form.file = null;
  }
}, { immediate: true, deep: true });

const handleFileSelect = (event) => {
  if (event.target.files[0]) {
    form.file = event.target.files[0];
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  if (event.dataTransfer.files[0]) {
    form.file = event.dataTransfer.files[0];
  }
};

const handleSubmit = () => {
  emit('save', {
    title: form.title,
    department_id: form.department_id,
    folder_id: form.folder_id,
    file: form.file,
    mode: props.mode,
    id: props.fileData?.id
  });
};
</script>