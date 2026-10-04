<template>
  <Transition name="modal-fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div 
        class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 transform transition-all animate-pop"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-800">
            {{ mode === 'edit' ? 'Rename Folder' : 'Buat Folder Baru' }}
          </h3>
          <button 
            type="button" 
            @click="$emit('close')"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="mb-5">
            <label class="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">
              Nama Folder
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              placeholder="Contoh: Dokumen Keuangan, SOP Penerbangan" 
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition placeholder:text-slate-400"
            />
          </div>

          <div class="flex justify-end gap-2.5">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition active:scale-[0.98]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: 'create' },
  folderData: { type: Object, default: null },
  currentParentId: { type: [Number, null], default: null }
});

const emit = defineEmits(['close', 'save']);

const form = reactive({
  id: null,
  name: '',
  parent_id: null
});

watch(() => props.folderData, (newData) => {
  if (newData && props.mode === 'edit') {
    form.id = newData.id;
    form.name = newData.name;
    form.parent_id = newData.parent_id;
  } else {
    form.id = null;
    form.name = '';
    form.parent_id = props.currentParentId;
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { 
    id: form.id, 
    name: form.name, 
    parent_id: props.mode === 'create' ? props.currentParentId : form.parent_id,
    mode: props.mode 
  });
};
</script>

<style scoped>
@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-pop {
  animation: pop 0.15s ease-out forwards;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>