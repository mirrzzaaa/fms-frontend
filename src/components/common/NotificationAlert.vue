<template>
  <transition name="fade">
    <div v-if="show" :class="alertClasses" class="fixed top-5 right-5 z-50 flex items-center justify-between p-4 rounded-xl shadow-lg border max-w-md w-full transition-all duration-300">
      <div class="flex items-center gap-3">
        <!-- Icon Sukses / Error -->
        <span v-if="type === 'success'" class="text-emerald-600 font-bold text-lg">✅</span>
        <span v-else class="text-rose-600 font-bold text-lg">⚠️</span>
        
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {{ type === 'success' ? 'Berhasil' : 'Peringatan / Error' }}
          </p>
          <p class="text-sm font-medium text-slate-800">{{ message }}</p>
        </div>
      </div>

      <!-- Tombol Tutup Manual -->
      <button @click="closeAlert" class="text-slate-400 hover:text-slate-600 text-sm font-bold px-2">
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed, watch, onMounted } from 'prop-types'; // atau setup standar vue

const props = defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' },
  type: { type: String, default: 'success' }, // 'success' atau 'error'
  duration: { type: Number, default: 10000 } // Default 10 detik (10000 ms)
});

const emit = defineEmits(['update:show']);

const closeAlert = () => {
  emit('update:show', false);
};

// Timer otomatis untuk menutup alert setelah durasi (10 detik)
watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      closeAlert();
    }, props.duration);
  }
});

const alertClasses = computed(() => {
  return props.type === 'success' 
    ? 'bg-emerald-50 border-emerald-200 border-l-4 border-l-emerald-500 text-emerald-900' 
    : 'bg-rose-50 border-rose-200 border-l-4 border-l-rose-500 text-rose-900';
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>