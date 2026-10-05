<template>
  <transition name="fade">
    <div v-if="show" :class="alertClasses" class="fixed top-5 right-5 z-50 flex items-center justify-between p-4 rounded-xl shadow-lg border max-w-md w-full transition-all duration-300">
      <div class="flex items-center gap-3">
        <!-- Icon Sukses (SVG CheckCircle) -->
        <svg v-if="type === 'success'" class="w-6 h-6 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <!-- Icon Error (SVG ExclamationCircle) -->
        <svg v-else class="w-6 h-6 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        
        <div>
          <p class="text-md font-semibold  tracking-wider text-vlack">
            {{ type === 'success' ? 'Berhasil' : 'Error' }}
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
import { computed, watch } from 'vue';

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