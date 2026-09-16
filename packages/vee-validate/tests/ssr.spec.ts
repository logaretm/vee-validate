/**
 * @vitest-environment node
 *
 * These run without a `window`, the same as Nuxt/Vite SSR. The devtools
 * integration only feeds the Vue devtools inspector, which never exists on the
 * server, so nothing of it should run during server rendering.
 */
import { useField, useForm } from '@/vee-validate';
import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

describe('server rendering', () => {
  test('does not attach devtools state to fields', async () => {
    let field: ReturnType<typeof useField> | undefined;

    const Component = defineComponent({
      setup() {
        field = useField<string>('name', undefined, { initialValue: '' });

        return () => h('input', { value: field?.value.value });
      },
    });

    const html = await renderToString(createSSRApp(Component));

    expect(html).toContain('<input');
    // `_vm` is only set by the devtools branch, which needs a client
    expect((field as unknown as { _vm?: unknown })._vm).toBeUndefined();
  });

  test('renders a form and its fields', async () => {
    const Component = defineComponent({
      setup() {
        useForm({ initialValues: { name: 'tony-hawk' } });
        const { value } = useField<string>('name');

        return () => h('input', { value: value.value });
      },
    });

    const html = await renderToString(createSSRApp(Component));

    expect(html).toContain('tony-hawk');
  });
});
