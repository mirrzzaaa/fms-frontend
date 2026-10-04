<template>
  <div class="bg-white rounded-lg shadow-md p-6 mt-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800">Daftar File di Folder Ini</h3>
      <button 
        v-if="userRole === 'admin'"
        @click="$emit('open-upload')" 
        class="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
      >
        + Upload File
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-gray-600 text-sm">
            <th class="py-3 px-4">Judul (Title)</th>
            <th class="py-3 px-4">Nama File Asli</th>
            <th class="py-3 px-4">Departemen</th>
            <th class="py-3 px-4">Uploader</th>
            <th class="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.id" class="border-b hover:bg-gray-50 text-sm">
            <td class="py-3 px-4 font-medium text-gray-800">{{ file.title }}</td>
            <td class="py-3 px-4 text-gray-600">{{ file.original_filename }}</td>
            <td class="py-3 px-4 text-gray-600">{{ file.department?.name ?? '-' }}</td>
            <td class="py-3 px-4 text-gray-600">{{ file.user?.name ?? '-' }}</td>
            <td class="py-3 px-4 text-right space-x-2">
              <!-- Tombol Download (Bisa untuk Admin & Viewer) -->
              <button @click="$emit('download', file)" class="text-green-600 hover:text-green-800 font-medium text-xs bg-green-50 px-2.5 py-1 rounded">
                Download
              </button>
              <!-- Tombol Detail -->
              <button @click="$emit('detail', file)" class="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2.5 py-1 rounded">
                Detail
              </button>
              <!-- Tombol Edit & Hapus (Khusus Admin) -->
              <template v-if="userRole === 'admin'">
                <button @click="$emit('edit', file)" class="text-amber-600 hover:text-amber-800 font-medium text-xs bg-amber-50 px-2.5 py-1 rounded">
                  Edit
                </button>
                <button @click="$emit('delete', file.id)" class="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2.5 py-1 rounded">
                  Hapus
                </button>
              </template>
            </td>
          </tr>
          <tr v-if="!files || files.length === 0">
            <td colspan="5" class="py-6 text-center text-gray-500">
              Belum ada file di dalam folder ini.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
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