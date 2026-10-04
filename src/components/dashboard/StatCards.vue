<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <p class="text-sm text-gray-500 font-medium">Total Folder</p>
      <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.total_folders }}</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
      <p class="text-sm text-gray-500 font-medium">Total File</p>
      <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.total_files }}</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
      <p class="text-sm text-gray-500 font-medium">Total Departemen</p>
      <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.total_departments }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
});
</script>