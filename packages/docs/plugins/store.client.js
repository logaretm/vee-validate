import { initStore } from './appstate';

export default function StorePlugin() {
  window.onNuxtReady(() => {
    initStore();
  });
}
