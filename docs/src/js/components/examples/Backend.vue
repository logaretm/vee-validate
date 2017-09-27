<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <label class="label">Email</label>
      <p class="control has-icon has-icon-right">
          <input name="email" v-model="email" v-validate="'required|email|unique'" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
          <i v-show="errors.has('email')" class="fa fa-warning"></i>
          <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
      </p>
    </div>
    <div class="column is-12">
      <p class="control">
        <button class="button is-primary" type="button" @click="submit">Submit</button>
      </p>
    </div>
  </div>
</template>

<script>
import { Validator } from 'vee-validate';

export default {
  name: 'backend-example',
  data: () => ({
    // simulate emails database
    emailsDB: [],
    email: null
  }),
  created() {
    // simulated DB.
    const isUnique = value => new Promise((resolve) => {
      setTimeout(() => {
        if (this.emailsDB.indexOf(value) === -1) {
          return resolve({
            valid: true
          });
        }

        return resolve({
          valid: false,
          data: {
            message: `${value} is already taken.`
          }
        });
      }, 200);
    });

    Validator.extend('unique', {
      validate: isUnique,
      getMessage: (field, params, data) => data.message
    });
  },
  methods: {
    submit() {
      this.emailsDB.push(this.email);
      this.email = '';
      this.$nextTick().then(() => {
        this.$validator.reset();
      });
    }
  }
};
</script>
