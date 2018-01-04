<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Email</label>
            <p class="control has-icon has-icon-right">
                <input v-model="email" name="email" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
                <i v-show="errors.has('email')" class="fa fa-warning"></i>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Name</label>
            <p class="control has-icon has-icon-right">
                <input v-model="name" name="name" :class="{'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Name">
                <i v-show="errors.has('name')" class="fa fa-warning"></i>
                <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <p class="control">
                <button class="button is-primary" @click="validateForm" type="button" name="button">Validate All</button>
                <button class="button is-danger" @click="clearErrors" type="button" name="button">Clear</button>
            </p>
        </div>
    </div>
</template>

<script>
import { Validator } from 'vee-validate';

export default {
  name: 'validator-example',
  validator: null,
  data() {
    return {
      email: '',
      name: '',
      errors: null
    };
  },
  watch: {
    email(value) {
      this.validator.validate('email', value);
    },
    name(value) {
      this.validator.validate('name', value);
    }
  },
  methods: {
    validateForm() {
      this.validator.validateAll({
        email: this.email,
        name: this.name
      }).then((result) => {
        if (result) {
          // eslint-disable-next-line
          console.log('All is well');
          return;
        }
        // eslint-disable-next-line
        console.log('Oops!');
      });
    },
    clearErrors() {
      this.errors.clear();
    }
  },
  created() {
    this.validator = new Validator({
      email: 'required|email',
      name: 'required|alpha|min:3'
    });
    this.$set(this, 'errors', this.validator.errors);
  }
};
</script>
