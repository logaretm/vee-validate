import { createApp, ComponentPublicInstance } from 'vue';
import { ValidationProvider, ValidationObserver } from '@vee-validate/core';

export function mount(component: Record<string, any>) {
  const app = createApp(component);
  app.config.devtools = false;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  app.config.warnHandler = () => {};
  app.config.errorHandler = err => {
    if ((err as Error).message === 'data is not defined') {
      return;
    }

    // eslint-disable-next-line no-console
    console.error(err);
  };

  document.body.innerHTML = `<div id="app"></div>`;

  return app.mount('#app');
}

export function mountWithHoc(component: Record<string, any>) {
  component.components = {
    ...(component.components || {}),
    ValidationProvider,
    ValidationObserver,
  };

  return mount(component);
}

export function setValue(node: ComponentPublicInstance | HTMLInputElement, value: any) {
  if ((node as any).tagName === 'INPUT') {
    const input = node as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new window.Event('input'));
    return;
  }

  (node as any).$emit('input', value);
}
