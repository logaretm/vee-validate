<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Email</label>
            <p class="control has-icon has-icon-right">
                <input name="email" v-model="email" v-validate.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
                <i v-show="errors.has('email')" class="fa fa-warning"></i>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">First Name</label>
            <p class="control has-icon has-icon-right">
                <input name="first_name" v-model="first_name" v-validate.initial="'required|alpha'" :class="{'input': true, 'is-danger': errors.has('first_name') }" type="text" placeholder="First Name">
                <i v-show="errors.has('first_name')" class="fa fa-warning"></i>
                <span v-show="errors.has('first_name')" class="help is-danger">{{ errors.first('first_name') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Last Name</label>
            <p class="control has-icon has-icon-right">
                <input name="last_name" v-model="last_name" v-validate.initial="'required|alpha'" :class="{'input': true, 'is-danger': errors.has('last_name') }" type="text" placeholder="Last Name">
                <i v-show="errors.has('last_name')" class="fa fa-warning"></i>
                <span v-show="errors.has('last_name')" class="help is-danger">{{ errors.first('last_name') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Full Name</label>
            <p class="control has-icon has-icon-right">
                <input :value="name" name="name" v-validate:name.initial="'required|alpha_spaces'" :class="{'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Full Name">
                <i v-show="errors.has('name')" class="fa fa-warning"></i>
                <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'data-example',
    data: () => ({
      email: '',
      first_name: '',
      last_name: ''
    }),
    computed: {
      name() {
        return `${this.first_name} ${this.last_name}`;
      }
    }
  };
</script>
