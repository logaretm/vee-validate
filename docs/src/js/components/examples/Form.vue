<template>
    <form @submit.prevent="validateBeforeSubmit">
        <div class="column is-12">
            <label class="label">Email</label>
            <p class="control has-icon has-icon-right">
                <input name="email" v-model="email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
                <i v-show="errors.has('email')" class="fa fa-warning"></i>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Name</label>
            <p class="control has-icon has-icon-right">
                <input name="name" v-model="name" v-validate="'required|alpha'" :class="{'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Name">
                <i v-show="errors.has('name')" class="fa fa-warning"></i>
                <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Phone</label>
            <p class="control has-icon has-icon-right">
                <input name="phone" v-model="phone" v-validate="'required|numeric'" :class="{'input': true, 'is-danger': errors.has('phone') }" type="text" placeholder="Phone">
                <i v-show="errors.has('phone')" class="fa fa-warning"></i>
                <span v-show="errors.has('phone')" class="help is-danger">{{ errors.first('phone') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Website</label>
            <p class="control has-icon has-icon-right">
                <input name="url" v-model="url" v-validate="'required|url'" :class="{'input': true, 'is-danger': errors.has('url') }" type="text" placeholder="Website">
                <i v-show="errors.has('url')" class="fa fa-warning"></i>
                <span v-show="errors.has('url')" class="help is-danger">{{ errors.first('url') }}</span>
            </p>
        </div>

        <div class="column is-12">
            <p class="control">
                <button class="button is-primary" type="submit">Submit</button>
            </p>
        </div>
    </form>
</template>

<script>
export default {
  name: 'form-example',
  data: () => ({
    email: '',
    name: '',
    phone: '',
    url: ''
  }),
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          // eslint-disable-next-line
          alert('From Submitted!');
          return;
        }

        alert('Correct them errors!');
      });
    }
  }
};
</script>
