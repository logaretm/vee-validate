<template>
    <div class="columns is-rtl is-multiline">
        <button @click="changeLocale" type="button" class="button is-primary">Change Locale To {{ nextLocale }}</button>
        <div class="column is-12">
            <label class="label">البريد الاليكتروني (Email)</label>
            <p class="control has-icon has-icon-left">
                <input name="email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
                <i v-show="errors.has('email')" class="fa fa-warning"></i>
                <span v-show="errors.has('email')" class="help is-danger has-text-right">{{ errors.first('email') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">رقم الهاتف (Phone)</label>
            <p class="control has-icon has-icon-left">
                <input name="phone" v-validate="'required|numeric'" :class="{'input': true, 'is-danger': errors.has('phone') }" type="text" placeholder="Phone">
                <i v-show="errors.has('phone')" class="fa fa-warning"></i>
                <span v-show="errors.has('phone')" class="help is-danger has-text-right">{{ errors.first('phone') }}</span>
            </p>
        </div>
    </div>
</template>

<script>
import arabic from 'vee-validate/dist/locale/ar';

export default {
  name: 'locale-example',
  data: () => ({
    email: '',
    phone: '',
    locale: 'en',
  }),
  computed: {
    nextLocale() {
      return this.locale === 'en' ? 'Arabic' : 'English';
    }
  },
  methods: {
    changeLocale() {
      this.locale = this.$validator.locale === 'ar' ? 'en' : 'ar';
      this.$validator.localize(this.locale);
    }
  },
  created() {
    this.$validator.localize('ar', {
      messages: arabic.messages,
      attributes: {
        email: 'البريد الاليكتروني',
        phone: 'رقم الهاتف'
      }
    });

    // start with english locale.
    this.$validator.localize('en');
  }
};
</script>
