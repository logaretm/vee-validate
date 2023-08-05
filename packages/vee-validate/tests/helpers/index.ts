import { createApp, ComponentPublicInstance } from 'vue';
import flushP from 'flush-promises';
import { Field, Form, ErrorMessage, FieldArray } from '@/vee-validate';

export function mount(component: Record<string, any>) {
  const app = createApp(component);
  // app.config.devtools = false;

  document.body.innerHTML = `<div id="app"></div>`;

  const vm = app.mount('#app');

  return vm;
}

export function mountWithHoc(component: Record<string, any>) {
  component.components = {
    ...(component.components || {}),
    Field,
    VForm: Form,
    ErrorMessage,
    FieldArray,
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

export function getValue(selectorOrNode: HTMLElement | string) {
  if (typeof selectorOrNode === 'string') {
    const el = document.querySelector(selectorOrNode) as HTMLInputElement | null;
    return el?.value;
  }

  return (selectorOrNode as HTMLInputElement)?.value;
}

export function setChecked(node: HTMLInputElement, status?: boolean) {
  node.checked = status !== undefined ? status : !node.checked;
  node.dispatchEvent(new window.Event('change'));
  node.dispatchEvent(new window.Event('input'));
}

export function dispatchEvent(node: ComponentPublicInstance | HTMLElement | string, eventName: string) {
  if (typeof node === 'string') {
    const el = document.querySelector(node) as HTMLElement | null;
    el?.dispatchEvent(new window.Event(eventName));
    return;
  }

  if ('tagName' in node) {
    const input = node as HTMLElement;
    input.dispatchEvent(new window.Event(eventName));
    return;
  }

  (node as any).$emit(eventName);
}

/**
 * Ensures promises and timers are flushed properly including debounce time
 */
export async function flushPromises() {
  await flushP();
  vi.advanceTimersByTime(5);
  await flushP();
}

export async function dispatchFileEvent(input: HTMLInputElement, name: string | string[]) {
  const createFile = (filename: string) =>
    new File([new ArrayBuffer(2e5)], filename, { lastModified: 0, type: 'image/jpeg' });

  const files = Array.isArray(name) ? name.map(createFile) : [createFile(name)];
  const event = new Event('change');

  Object.defineProperty(event, 'target', {
    get() {
      return {
        type: 'file',
        multiple: input.multiple,
        files,
      };
    },
  });

  input.dispatchEvent(event);
  await flushPromises();
}

export async function runInSetup(cb: () => any) {
  mountWithHoc({
    setup() {
      cb();
    },
    template: `
        <div></div>
    `,
  });
}
