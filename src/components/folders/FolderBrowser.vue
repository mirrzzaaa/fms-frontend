<template>
  <div class="bg-white rounded-t-none rounded-b-2xl shadow-sm border border-slate-100 border-t-0 p-4 space-y-4">
    <!-- Header Kontrol: Search Bar & Toggle Tampilan (List / Grid) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
      
      <!-- Input Pencarian Folder & File -->
      <div class="w-full sm:w-72 relative flex items-center">
        <span class="absolute left-3.5 text-slate-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari folder atau file..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition placeholder:text-slate-400"
        />
      </div>

      <!-- Tombol Switcher Tampilan (List vs Grid) -->
      <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button 
          @click="viewMode = 'list'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition',
            viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>List</span>
        </button>
        <button 
          @click="viewMode = 'grid'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition',
            viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Grid</span>
        </button>
      </div>
    </div>

    <!-- 1. TAMPILAN LIST (Menggunakan FolderTable dengan data yang sudah difilter) -->
    <FolderTable 
      v-if="viewMode === 'list'"
      :folders="filteredFolders"
      :files="filteredFiles"
      :user-role="userRole"
      @enter-folder="$emit('enter-folder', $event)"
      @edit-folder="$emit('edit-folder', $event)"
      @delete-folder="$emit('delete-folder', $event)"
      @download-file="$emit('download-file', $event)"
      @delete-file="$emit('delete-file', $event)"
    />

    <!-- 2. TAMPILAN GRID / KOTAK -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- Folder Grid Cards -->
      <div 
        v-for="folder in filteredFolders" 
        :key="'grid-folder-' + folder.id"
        class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:shadow-md hover:border-blue-200 transition flex flex-col items-center text-center group relative"
      >
        <div @click="$emit('enter-folder', folder)" class="cursor-pointer w-full flex flex-col items-center">
          <svg class="w-14 h-14 text-amber-500 drop-shadow-sm mb-2 group-hover:scale-105 transition" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
          </svg>
          <span class="font-semibold text-sm text-slate-800 truncate w-full px-1">{{ folder.name }}</span>
          <span class="text-[10px] text-slate-400 mt-0.5">Folder</span>
        </div>

        <div v-if="userRole === 'admin'" class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button @click="$emit('edit-folder', folder)" class="p-1 bg-white border border-slate-200 rounded-md text-amber-600 shadow-sm hover:bg-amber-50">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button @click="$emit('delete-folder', folder.id)" class="p-1 bg-white border border-slate-200 rounded-md text-rose-600 shadow-sm hover:bg-rose-50">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>

      <!-- File Grid Cards -->
      <div 
        v-for="file in filteredFiles" 
        :key="'grid-file-' + file.id"
        class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:shadow-md hover:border-blue-200 transition flex flex-col items-center text-center group relative"
      >
        <div class="w-full flex flex-col items-center cursor-pointer" @click="$emit('download-file', file)">
          <svg class="w-12 h-12 text-blue-500 drop-shadow-sm mb-2 group-hover:scale-105 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <span class="font-medium text-sm text-slate-800 truncate w-full px-1">{{ file.title || file.original_filename }}</span>
          <span class="text-[10px] text-slate-400 mt-0.5 uppercase">{{ getFileExtension(file.original_filename) }} File</span>
        </div>

        <div v-if="userRole === 'admin'" class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button @click="$emit('delete-file', file.id)" class="p-1 bg-white border border-slate-200 rounded-md text-rose-600 shadow-sm hover:bg-rose-50">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>

      <!-- State Kosong Grid -->
      <div v-if="filteredFolders.length === 0 && filteredFiles.length === 0" class="col-span-full py-12 text-center text-slate-400 text-sm">
        Tidak ada folder atau file yang ditemukan.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FolderTable from './FolderTable.vue';

const props = defineProps({
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

const viewMode = ref('list');
const searchQuery = ref('');

// Computed untuk memfilter folder berdasarkan nama
const filteredFolders = computed(() => {
  if (!searchQuery.value) return props.folders;
  return props.folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Computed untuk memfilter file berdasarkan judul atau nama file asli
const filteredFiles = computed(() => {
  if (!searchQuery.value) return props.files;
  return props.files.filter(file => {
    const title = file.title ? file.title.toLowerCase() : '';
    const originalName = file.original_filename ? file.original_filename.toLowerCase() : '';
    const query = searchQuery.value.toLowerCase();
    return title.includes(query) || originalName.includes(query);
  });
});

const getFileExtension = (filename) => {
  if (!filename) return 'DOC';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'FILE';
};
</script>