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
  </div>
</template>

<script>
import { Validator } from 'vee-validate';

export default {
  name: 'backend-example',
  created() {
    // simulated DB.
    const emailsDB = [];
    const isUnique = value => new Promise((resolve) => {
      setTimeout(() => {
        if (emailsDB.indexOf(value) === -1) {
          emailsDB.push(value);
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
  }
};
</script>
