<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Name</label>
            <p class="control has-icon has-icon-right">
                <input name="name" v-validate="'required|alpha'" :class="{'input': true, 'is-danger': nameFlags.invalid, 'is-success': nameFlags.valid }" type="text" placeholder="Name">
                <i v-show="nameFlags.dirty" :class="{ 'fa': true, 'fa-warning': nameFlags.invalid, 'fa-check': nameFlags.valid }"></i>
                <span v-show="nameFlags.invalid" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
            <label class="label">Email</label>
            <p class="control has-icon has-icon-right">
                <input v-model="email" name="email" v-validate:email="'required|email'" :class="{'input': true, 'is-danger': emailFlags.invalid, 'is-success': emailFlags.valid }" type="text" placeholder="Email">
                <i v-show="emailFlags.dirty" :class="{ 'fa': true, 'fa-warning': emailFlags.invalid, 'fa-check': emailFlags.valid }"></i>
                <span v-show="emailFlags.invalid" class="help is-danger">{{ errors.first('email') }}</span>
            </p>
            <p class="control">
                <button type="button" class="button is-primary" :disabled="!formDirty">Save</button>
            </p>
        </div>
    </div>
</template>

<script>
import { mapFields } from 'vee-validate';

export default {
  name: 'flags-example',
  data: () => ({
    email: ''
  }),
  computed: {
    ...mapFields({
      nameFlags: 'name',
      emailFlags: 'email'
    }),
    formDirty() {
      // are some fields dirty?
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
    }
  }
};
</script>
