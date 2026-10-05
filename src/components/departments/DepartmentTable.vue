<template>
  <div class="card-box space-y-6">
    <!-- Baris Pencarian & Tombol Tambah -->
    <div class="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
      <div class="w-full md:w-1/3 relative flex items-center">
        <span class="absolute left-3.5 text-slate-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nama departemen..." 
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition"
        />
      </div>
      <button 
        @click="$emit('open-create')" 
        class="btn-primary w-full md:w-auto py-2.5 px-4"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Tambah Departemen</span>
      </button>
    </div>

    <!-- Tabel Data dengan Spasi Vertikal (py-4) yang Lega -->
    <div class="overflow-x-auto rounded-xl border border-slate-200">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="table-header">
            <th class="py-3.5 px-4">#ID</th>
            <th class="py-3.5 px-4">Nama Departemen</th>
            <th class="py-3.5 px-4">Tanggal Dibuat</th>
            <th class="py-3.5 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="(dept, index) in filteredDepartments" :key="dept.id" class="hover:bg-slate-50/80 transition text-sm">
            <!-- Jarak padding vertikal ditingkatkan menjadi py-4 agar longgar -->
            <td class="py-4 px-4 text-slate-500 font-medium">{{ index + 1 }}</td>
            <td class="py-4 px-4 font-semibold text-slate-800">{{ dept.name }}</td>
            <td class="py-4 px-4 text-slate-600">{{ formatDate(dept.created_at) }}</td>
            <td class="py-4 px-4 text-center">
              <div class="inline-flex items-center gap-1.5 justify-center">
                <!-- Tombol Detail (Ikon Mata) -->
                <button 
                  @click="$emit('open-detail', dept)" 
                  class="p-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition"
                  title="Detail"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                <!-- Tombol Edit (Ikon Pensil) -->
                <button 
                  @click="$emit('open-edit', dept)" 
                  class="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg transition"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <!-- Tombol Hapus (Ikon Tempat Sampah) -->
                <button 
                  @click="$emit('delete', dept.id)" 
                  class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition"
                  title="Hapus"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          
          <!-- State Kosong menggunakan EmptyState -->
          <tr v-if="filteredDepartments.length === 0">
            <td colspan="4" class="p-0">
              <EmptyState 
                title="Departemen tidak ditemukan" 
                description="Belum ada data departemen yang terdaftar atau sesuai dengan kata kunci pencarian Anda." 
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import EmptyState from '../common/EmptyState.vue';

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