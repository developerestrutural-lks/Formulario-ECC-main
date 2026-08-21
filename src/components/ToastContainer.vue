<template>
  <div class="toast-container" aria-live="assertive" aria-atomic="true">
    <transition-group name="toast-fade" tag="div">
      <div v-for="toast in toastState.items" :key="toast.id" class="toast-item"
           :class="`toast-item--${toast.type}`" role="alert">
        <span class="toast-item__icon" aria-hidden="true">{{ iconFor(toast.type) }}</span>
        <span class="toast-item__message">{{ toast.message }}</span>
        <button type="button" class="toast-item__close" @click="dismissToast(toast.id)"
                aria-label="Fechar aviso">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { toastState, dismissToast } from '@/composables/toast';

export default {
  name: 'ToastContainer',
  data() {
    return { toastState };
  },
  methods: {
    dismissToast,
    iconFor(type) {
      if (type === 'success') return '✓';
      if (type === 'warning') return '⚠️';
      return '⚠️';
    },
  },
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: min(90vw, 420px);
}

.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
  border-left: 4px solid #6c757d;
  white-space: pre-line;
}

.toast-item--error {
  border-left-color: #dc3545;
  background: #fdecea;
  color: #7a1f26;
}

.toast-item--warning {
  border-left-color: #ffc107;
  background: #fff8e1;
  color: #6b5300;
}

.toast-item--success {
  border-left-color: #198754;
  background: #eaf6ee;
  color: #155a30;
}

.toast-item__icon {
  flex-shrink: 0;
}

.toast-item__message {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toast-item__close {
  background: none;
  border: none;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0 2px;
}

.toast-item__close:hover {
  opacity: 1;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

@media (prefers-reduced-motion: reduce) {
  .toast-fade-enter-active,
  .toast-fade-leave-active {
    transition: none;
  }
}
</style>