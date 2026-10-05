<template>
  <nav class="flex items-center text-sm font-medium text-slate-600 bg-white px-4 py-3 border border-slate-200 shadow-sm mb-6 rounded-t-2xl rounded-b-none">
    <!-- Tombol Root / Beranda -->
    <button 
      @click="$emit('root')" 
      class="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
      :class="{ 'text-blue-600 font-semibold': breadcrumbs.length === 0 }"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>Root</span>
    </button>

    <!-- Daftar Jalur Folder -->
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
      <span class="mx-2 text-slate-400">/</span>
      <button 
        @click="$emit('navigate', crumb, index)" 
        class="hover:text-blue-600 transition-colors truncate max-w-[150px]"
        :class="{ 'text-blue-600 font-semibold': index === breadcrumbs.length - 1 }"
      >
        {{ crumb.name }}
      </button>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  }
});

defineEmits(['root', 'navigate']);
</script>