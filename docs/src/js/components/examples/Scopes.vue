<template>
    <div class="columns is-multiline">
        <form @submit.prevent="validateForm('form-1')" class="columns column is-multiline is-12" data-vv-scope="form-1">
            <legend>Form 1</legend>
            <div class="column is-12">
                <label class="label">Email</label>
                <p class="control has-icon has-icon-right">
                    <input name="email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('form-1.email') }" type="text" placeholder="Email">
                    <i v-show="errors.has('form-1.email')" class="fa fa-warning"></i>
                    <span v-show="errors.has('form-1.email')" class="help is-danger">{{ errors.first('form-1.email') }}</span>
                </p>
            </div>
            <div class="column is-12">
                <label class="label">Password</label>
                <p class="control has-icon has-icon-right">
                    <input name="password" v-validate="'required|min:6'" :class="{'input': true, 'is-danger': errors.has('form-1.password') }" type="password" placeholder="Password">
                    <i v-show="errors.has('form-1.password')" class="fa fa-warning"></i>
                    <span v-show="errors.has('form-1.password')" class="help is-danger">{{ errors.first('form-1.password') }}</span>
                </p>
            </div>
            <div class="column is-12">
                <p class="control">
                    <button class="button is-primary" type="submit" name="button">Sign up</button>
                    <button class="button is-danger" type="button" name="button" @click="errors.clear('form-1')">Clear</button>
                </p>
            </div>
        </form>
        <form @submit.prevent="validateForm('form-2')" class="columns column is-multiline is-12" data-vv-scope="form-2">
            <legend>Form 2</legend>
            <div class="column is-12">
                <label class="label">Email</label>
                <p class="control has-icon has-icon-right">
                    <input name="email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('form-2.email') }" type="text" placeholder="Email">
                    <i v-show="errors.has('form-2.email')" class="fa fa-warning"></i>
                    <span v-show="errors.has('form-2.email')" class="help is-danger">{{ errors.first('form-2.email') }}</span>
                </p>
            </div>
            <div class="column is-12">
                <label class="label">Password</label>
                <p class="control has-icon has-icon-right">
                    <input name="password" v-validate="'required|min:6'" :class="{'input': true, 'is-danger': errors.has('form-2.password') }" type="password" placeholder="Password">
                    <i v-show="errors.has('form-2.password')" class="fa fa-warning"></i>
                    <span v-show="errors.has('form-2.password')" class="help is-danger">{{ errors.first('form-2.password') }}</span>
                </p>
            </div>
            <div class="column is-12">
                <p class="control">
                    <button class="button is-primary" type="submit" name="button">Sign up</button>
                    <button class="button is-danger" type="button" name="button" @click="errors.clear('form-2')">Clear</button>
                </p>
            </div>
        </form>
    </div>
</template>

<script>
export default {
  name: 'scopes-example',
  methods: {
    validateForm(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          // eslint-disable-next-line
          alert('Form Submitted!');
        }
      });
    }
  }
};
</script>
