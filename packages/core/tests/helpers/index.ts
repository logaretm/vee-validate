import { createApp, ComponentPublicInstance } from 'vue';
import { Field, Form, ErrorMessage } from '@vee-validate/core';

export function mount(component: Record<string, any>) {
  const app = createApp(component);
  // app.config.devtools = false;

  document.body.innerHTML = `<div id="app"></div>`;

  return app.mount('#app');
}

export function mountWithHoc(component: Record<string, any>) {
  component.components = {
    ...(component.components || {}),
    Field,
    VForm: Form,
    ErrorMessage,
  };

  return mount(component);
}

const HTML_TAGS = ['INPUT', 'SELECT'];

export function setValue(node: ComponentPublicInstance | HTMLInputElement, value: any) {
  if (HTML_TAGS.includes((node as any).tagName)) {
    const input = node as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new window.Event('input'));
    input.dispatchEvent(new window.Event('change'));
    return;
  }

  (node as any).$emit('input', value);
}

export function setChecked(node: HTMLInputElement, status?: boolean) {
  node.checked = status !== undefined ? status : !node.checked;
  node.dispatchEvent(new window.Event('change'));
  node.dispatchEvent(new window.Event('input'));
}

export function dispatchEvent(node: ComponentPublicInstance | HTMLInputElement, eventName: string) {
  if (HTML_TAGS.includes((node as any).tagName)) {
    const input = node as HTMLInputElement;
    input.dispatchEvent(new window.Event(eventName));
    return;
  }

  (node as any).$emit(eventName);
}
