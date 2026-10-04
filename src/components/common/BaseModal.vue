<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <!-- Kotak Modal Utama -->
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
        
        <!-- Header Modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
          <button @click="close" class="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 transition">
            ✕
          </button>
        </div>

        <!-- Body / Konten Isi Modal (Menggunakan Slot) -->
        <div class="p-6 max-h-[75vh] overflow-y-auto">
          <slot></slot>
        </div>

        <!-- Footer Modal (Opsional, untuk tombol aksi) -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <slot name="footer"></slot>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal Title'
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active div,
.modal-fade-leave-active div {
  transition: transform 0.25s ease;
}
.modal-fade-enter-from div,
.modal-fade-leave-to div {
  transform: scale(0.95);
}
</style>