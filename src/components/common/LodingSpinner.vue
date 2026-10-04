<template>
  <!-- Ditambahkan h-full / min-h-[200px] atau min-h-screen agar bisa benar-benar berada di tengah layar/kontainer -->
  <div class="flex flex-col items-center justify-center py-12 px-4 w-full h-full min-h-[250px]">
    <!-- Spinner Animasi Putar -->
    <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
    <!-- Teks Keterangan Opsional -->
    <p class="text-sm font-medium text-slate-500 mt-3">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Memuat data...'
  }
});
</script>