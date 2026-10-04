<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Baris Pencarian & Tombol Tambah -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div class="w-full md:w-1/3">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nama departemen..." 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <button 
        @click="$emit('open-create')" 
        class="w-full md:w-auto bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        + Tambah Departemen
      </button>
    </div>

    <!-- Tabel Data -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-gray-600 text-sm">
            <th class="py-3 px-4">#ID</th>
            <th class="py-3 px-4">Nama Departemen</th>
            <th class="py-3 px-4">Tanggal Dibuat</th>
            <th class="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dept, index) in filteredDepartments" :key="dept.id" class="border-b hover:bg-gray-50 text-sm">
            <td class="py-3 px-4 text-gray-500">{{ index + 1 }}</td>
            <td class="py-3 px-4 font-medium text-gray-800">{{ dept.name }}</td>
            <td class="py-3 px-4 text-gray-600">{{ formatDate(dept.created_at) }}</td>
            <td class="py-3 px-4 text-right space-x-2">
              <button @click="$emit('open-detail', dept)" class="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2.5 py-1 rounded">
                Detail
              </button>
              <button @click="$emit('open-edit', dept)" class="text-amber-600 hover:text-amber-800 font-medium text-xs bg-amber-50 px-2.5 py-1 rounded">
                Edit
              </button>
              <button @click="$emit('delete', dept.id)" class="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2.5 py-1 rounded">
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="filteredDepartments.length === 0">
            <td colspan="4" class="py-6 text-center text-gray-500">
              Tidak ada data departemen yang ditemukan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  departments: {
    type: Array,
    required: true,
    default: () => []
  }
});

defineEmits(['open-create', 'open-edit', 'open-detail', 'delete']);

const searchQuery = ref('');

// Fitur Pencarian Real-time
const filteredDepartments = computed(() => {
  if (!searchQuery.value) return props.departments;
  return props.departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
</script>