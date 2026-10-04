<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-bold text-gray-800 mb-4">10 File Terbaru</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-gray-600 text-sm">
            <th class="py-3 px-4">Judul File</th>
            <th class="py-3 px-4">Nama Asli</th>
            <th class="py-3 px-4">Departemen</th>
            <th class="py-3 px-4">Folder</th>
            <th class="py-3 px-4">Uploader</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.id" class="border-b hover:bg-gray-50 text-sm">
            <td class="py-3 px-4 font-medium text-gray-800">{{ file.title }}</td>
            <td class="py-3 px-4 text-gray-600">{{ file.original_filename }}</td>
            <td class="py-3 px-4 text-gray-600">{{ file.department?.name ?? '-' }}</td>
            <td class="py-3 px-4 text-gray-600">{{ file.folder?.name ?? '-' }}</td>
            <td class="py-3 px-4 text-gray-600">{{ file.user?.name ?? '-' }}</td>
          </tr>
          <tr v-if="!files || files.length === 0">
            <td colspan="5" class="py-4 text-center text-gray-500">Belum ada file yang diunggah.</td>
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
  }
});
</script>