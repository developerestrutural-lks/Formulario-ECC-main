import { reactive } from 'vue';

let nextId = 1;
const state = reactive({ items: [] });

function dismissToast(id) {
  const idx = state.items.findIndex(t => t.id === id);
  if (idx !== -1) state.items.splice(idx, 1);
}

function showToast(message, type = 'error', timeout = 6000) {
  const id = nextId++;
  state.items.push({ id, message, type });
  if (timeout > 0) {
    setTimeout(() => dismissToast(id), timeout);
  }
  return id;
}

export { state as toastState, showToast, dismissToast };