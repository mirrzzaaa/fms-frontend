<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 transform transition-all animate-pop">
        <div class="flex items-center justify-between mb-4 border-b pb-3">
          <h3 class="text-base font-semibold text-slate-800">
            {{ mode === 'edit' ? 'Edit Informasi File' : 'Upload File Baru' }}
          </h3>
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
        
        <form @submit.prevent="handleSubmit">
          <!-- Input Title -->
          <div class="mb-4">
            <label class="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">Judul File (Title)</label>
            <input 
              v-model="form.title" 
              type="text" 
              required
              placeholder="Contoh: Laporan Keuangan Q1" 
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition placeholder:text-slate-400"
            />
          </div>

          <!-- Pilih Folder Tujuan (Searchable Dropdown) -->
          <div class="mb-4 relative" ref="dropdownRef">
            <label class="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">Pilih Folder Tujuan</label>
            
            <!-- Kotak Input Pencarian Folder -->
            <div 
              @click="isFolderDropdownOpen = true"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition"
            >
              <input 
                v-model="folderSearchQuery"
                @focus="isFolderDropdownOpen = true"
                type="text"
                placeholder="Ketik untuk mencari folder (termasuk sub-folder)..."
                class="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />
              <svg class="w-4 h-4 text-slate-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- List Hasil Pencarian Folder (Dropdown Popover) -->
            <div 
              v-if="isFolderDropdownOpen" 
              class="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50 divide-y divide-slate-50"
            >
              <div 
                v-for="folder in filteredFolders" 
                :key="folder.id"
                @click="selectFolder(folder)"
                class="px-3.5 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition flex items-center justify-between"
              >
                <span>{{ folder.name }}</span>
                <span v-if="form.folder_id === folder.id" class="text-blue-600 text-xs font-semibold">Dipilih</span>
              </div>
              <div v-if="filteredFolders.length === 0" class="px-3.5 py-3 text-sm text-slate-400 text-center">
                Folder tidak ditemukan.
              </div>
            </div>
          </div>

          <!-- Pilih Departemen -->
          <div class="mb-4">
            <label class="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">Departemen</label>
            <select 
              v-model="form.department_id" 
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition"
            >
              <option value="" disabled>Pilih Departemen</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <!-- Drag & Drop File Input -->
          <div class="mb-6">
            <label class="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">
              File Dokumen / Gambar {{ mode === 'edit' ? '(Opsional)' : '' }}
            </label>
            <div 
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              :class="[
                'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition',
                isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              ]"
              @click="$refs.fileInput.click()"
            >
              <input 
                ref="fileInput"
                type="file" 
                class="hidden" 
                @change="handleFileSelect"
              />
              <div v-if="form.file" class="text-sm text-slate-700 font-semibold flex items-center justify-center gap-1.5">
                {{ form.file.name }}
              </div>
              <div v-else-if="mode === 'edit' && fileData?.original_filename" class="text-sm text-slate-600">
                File saat ini: <span class="font-medium text-blue-600">{{ fileData.original_filename }}</span>
                <p class="text-[11px] text-slate-400 mt-0.5">Klik atau seret file baru jika ingin menggantinya</p>
              </div>
              <div v-else class="text-sm text-slate-500">
                <span class="font-medium text-blue-600">Klik untuk upload</span> atau seret file ke sini
                <p class="text-[11px] text-slate-400 mt-0.5">PDF, DOC, XLS, JPG, PNG (Maks. 10MB)</p>
              </div>
            </div>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition active:scale-[0.98] disabled:opacity-50"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, computed } from 'vue';
import api from '../../service/api';
import { useFiles } from '../../composables/useFile';

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: 'create' },
  fileData: { type: Object, default: null },
  currentFolderId: { type: [Number, String, null], default: null }
});

const emit = defineEmits(['close', 'refresh']);

const departments = ref([]);
const folders = ref([]);
const isDragging = ref(false);

const isFolderDropdownOpen = ref(false);
const folderSearchQuery = ref('');
const dropdownRef = ref(null);

const { saveFile, loading } = useFiles();

const form = reactive({
  title: '',
  department_id: '',
  folder_id: '',
  file: null
});

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isFolderDropdownOpen.value = false;
  }
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  try {
    const deptRes = await api.get('/departments');
    departments.value = deptRes.data.data || deptRes.data;

    const folderRes = await api.get('/folders/all');
    folders.value = folderRes.data.data || folderRes.data;
  } catch (e) {
    console.error('Gagal memuat data pendukung', e);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const filteredFolders = computed(() => {
  if (!folderSearchQuery.value) return folders.value;
  return folders.value.filter(folder => 
    folder.name.toLowerCase().includes(folderSearchQuery.value.toLowerCase())
  );
});

const selectFolder = (folder) => {
  form.folder_id = folder.id;
  folderSearchQuery.value = folder.name;
  isFolderDropdownOpen.value = false;
};

// Watcher untuk fileData dan mode
watch(() => props.fileData, (newData) => {
  if (newData && props.mode === 'edit') {
    form.title = newData.title || '';
    form.department_id = newData.department_id || '';
    form.folder_id = newData.folder_id || '';
    
    const matchedFolder = folders.value.find(f => f.id === newData.folder_id);
    folderSearchQuery.value = matchedFolder ? matchedFolder.name : '';
    form.file = null;
  } else {
    form.title = '';
    form.department_id = '';
    form.folder_id = props.currentFolderId || '';
    
    const matchedFolder = folders.value.find(f => f.id === props.currentFolderId);
    folderSearchQuery.value = matchedFolder ? matchedFolder.name : '';
    form.file = null;
  }
}, { immediate: true, deep: true });

// Watcher tambahan agar saat modal dibuka lewat tombol "Upload File di Sini", folder langsung terkunci
watch(() => props.currentFolderId, (newFolderId) => {
  if (props.mode === 'create' && !props.fileData) {
    form.folder_id = newFolderId || '';
    const matchedFolder = folders.value.find(f => f.id === newFolderId);
    folderSearchQuery.value = matchedFolder ? matchedFolder.name : '';
  }
});

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

const handleSubmit = async () => {
  const payload = {
    id: props.fileData?.id,
    title: form.title,
    department_id: form.department_id,
    folder_id: form.folder_id,
    file: form.file,
    mode: props.mode
  };

  await saveFile(payload, () => {
    emit('refresh');
    emit('close');
  });
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