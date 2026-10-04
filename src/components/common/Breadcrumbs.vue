<template>
  <nav class="flex items-center text-sm font-medium text-slate-600 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm mb-6">
    <!-- Tombol Root / Beranda -->
    <button 
      @click="$emit('root')" 
      class="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
      :class="{ 'text-blue-600 font-semibold': breadcrumbs.length === 0 }"
    >
      🏠 Root
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