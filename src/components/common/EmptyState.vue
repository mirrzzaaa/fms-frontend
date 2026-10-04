<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm w-full my-4">
    <!-- Ilustrasi Ikon Kotak / Folder Kosong -->
    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner">
      📁
    </div>
    
    <!-- Judul & Deskripsi -->
    <h3 class="text-base font-semibold text-slate-800 mb-1">{{ title }}</h3>
    <p class="text-sm text-slate-500 text-center max-w-sm mb-6">{{ description }}</p>

    <!-- Tombol Aksi Opsional (Slot / Event) -->
    <slot name="action">
      <button 
        v-if="actionText" 
        @click="$emit('action')" 
        class="btn-primary"
      >
        {{ actionText }}
      </button>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Belum ada data'
  },
  description: {
    type: String,
    default: 'Data belum tersedia di dalam direktori atau folder ini.'
  },
  actionText: {
    type: String,
    default: ''
  }
});

defineEmits(['action']);
</script>