import { mount, createLocalVue, renderToString } from '@vue/test-utils';
import VeeValidate from '@/index';
import flushPromises from 'flush-promises';

const Vue = createLocalVue();
Vue.use(VeeValidate, { inject: false });
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

const DEFAULT_REQUIRED_MESSAGE = 'The {field} field is required.';

describe('Validation Observer Component', () => {
  test('renders the slot', () => {
    const wrapper = mount({
      template: `
        <ValidationObserver tag="form" v-slot="ctx">
        </ValidationObserver>
      `
    }, { localVue: Vue });

    expect(wrapper.html()).toBe(`<form></form>`);
  });

  test('renders the scoped slot in SSR', () => {
    const output = renderToString({
      template: `
        <ValidationObserver tag="form" v-slot="ctx">
        </ValidationObserver>
      `
    }, { localVue: Vue });

    expect(output).toBe(`<form data-server-rendered="true"></form>`);
  });

  test('renders the default slot if no scoped slots in SSR', () => {
    const output = renderToString({
      template: `
        <ValidationObserver tag="form">
        </ValidationObserver>
      `
    }, { localVue: Vue });

    expect(output).toBe(`<form data-server-rendered="true"></form>`);
  });

  test('observes the current state of providers', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver>
          <div slot-scope="{ valid }">
            <ValidationProvider rules="required">
              <div slot-scope="ctx">
                <input v-model="value" type="text">
              </div>
            </ValidationProvider>

            <span id="state">{{ valid }}</span>
          </div>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const stateSpan = wrapper.find('#state');
    const input = wrapper.find('input');

    await flushPromises();
    // initially the field valid flag is null as in its unknown.
    expect(stateSpan.text()).toBe('');

    input.element.value = 'value';
    input.trigger('input');
    await flushPromises();

    expect(stateSpan.text()).toBe('true');
  });

  test('triggers validation manually on its children providers using refs', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <div slot-scope="ctx">

            <ValidationProvider rules="required">

              <div slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </div>

            </ValidationProvider>

          </div>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#error');
    await flushPromises();
    expect(error.text()).toBe('');

    await wrapper.vm.$refs.obs.validate();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  });

  test('triggers validation manually on its children providers using validate on slot-scope', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      methods: {
        submit: () => {}
      },
      template: `
        <ValidationObserver>
          <div slot-scope="ctx">

            <ValidationProvider rules="required">

              <div slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </div>

            </ValidationProvider>
            <button @click="ctx.validate().then(submit)">Validate</button>
          </div>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    wrapper.vm.submit = jest.fn();

    const error = wrapper.find('#error');
    await flushPromises();
    expect(error.text()).toBe('');

    wrapper.find('button').trigger('click');
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
    wrapper.setData({ value: '12' });
    wrapper.find('button').trigger('click');
    await flushPromises();

    expect(error.text()).toBe('');
    expect(wrapper.vm.submit).toHaveBeenCalledTimes(1);
  });

  test('removes child ref when the child is destroyed', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <div slot-scope="ctx">

            <ValidationProvider rules="required" vid="id">

              <div slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </div>

            </ValidationProvider>

          </div>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const obs = wrapper.vm.$refs.obs;
    expect(obs.refs).toHaveProperty('id');

    wrapper.destroy();

    expect(obs.refs).not.toHaveProperty('id');
  });

  test('resets child refs', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <div slot-scope="ctx">

            <ValidationProvider rules="required">

              <div slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </div>

            </ValidationProvider>

          </div>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#error');
    await flushPromises();
    expect(error.text()).toBe('');

    await wrapper.vm.$refs.obs.validate();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    wrapper.vm.$refs.obs.reset();
    await flushPromises();

    expect(error.text()).toBe('');
  });

  test('resets child refs using reset on the slot-scope data', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <div slot-scope="ctx">

            <ValidationProvider rules="required">

              <div slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </div>

            </ValidationProvider>

            <button @click="ctx.reset()">Reset</button>
          </div>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#error');
    await flushPromises();
    expect(error.text()).toBe('');

    wrapper.vm.$refs.obs.validate();
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    await wrapper.find('button').trigger('click');
    await flushPromises();

    expect(error.text()).toBe('');
  });

  test('collects errors from child providers', async () => {
    const wrapper = mount({
      data: () => ({
        email: '',
        name: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <div slot-scope="{ errors }">
            <ValidationProvider vid="name" rules="required">
              <div slot-scope="ctx">
                <input v-model="name" type="text">
              </div>
            </ValidationProvider>
            <ValidationProvider vid="email" rules="required">
              <div slot-scope="ctx">
                <input v-model="email" type="text">
              </div>
            </ValidationProvider>

            <p v-for="fieldErrors in errors">{{ fieldErrors[0] }}</p>
          </div>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    await flushPromises();

    await wrapper.vm.$refs.obs.validate();

    const errors = wrapper.findAll('p');
    expect(errors).toHaveLength(2); // 2 fields.
    expect(errors.at(0).text()).toBe(DEFAULT_REQUIRED_MESSAGE);
    expect(errors.at(1).text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  });
});
