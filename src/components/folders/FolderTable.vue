<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="folder in folders" 
        :key="folder.id" 
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
      >
        <!-- Klik icon/nama folder untuk masuk ke sub-folder -->
        <div @click="$emit('enter', folder)" class="cursor-pointer">
          <div class="flex items-center space-x-3 mb-2">
            <svg class="w-8 h-8 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
            </svg>
            <h3 class="font-bold text-gray-800 truncate">{{ folder.name }}</h3>
          </div>
        </div>

        <!-- Tombol Aksi (Admin Only) -->
        <div v-if="userRole === 'admin'" class="flex justify-end space-x-2 pt-3 border-t border-gray-200 mt-2 text-xs">
          <button @click="$emit('edit', folder)" class="text-amber-600 hover:text-amber-800 font-medium px-2 py-1 bg-amber-50 rounded">
            Rename
          </button>
          <button @click="$emit('delete', folder.id)" class="text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded">
            Hapus
          </button>
        </div>
      </div>

      <!-- Jika folder kosong -->
      <div v-if="folders.length === 0" class="col-span-full py-8 text-center text-gray-500">
        Folder ini kosong. Belum ada sub-folder di dalamnya.
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  folders: {
    type: Array,
    required: true,
    default: () => []
  },
  userRole: {
    type: String,
    default: 'viewer'
  }
});

defineEmits(['enter', 'edit', 'delete']);
</script>