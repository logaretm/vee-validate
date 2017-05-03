<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Email (1s delay)</label>
            <p class="control has-icon has-icon-right">
                <input name="email" v-validate="'required|email'" data-vv-delay="1000" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
                <i v-show="errors.has('email')" class="fa fa-warning"></i>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
            </p>
        </div>
        <div class="column is-12">
            <label class="label">Name (0.5s delay)</label>
            <p class="control has-icon has-icon-right">
                <input name="name" v-validate="'required|alpha'" data-vv-delay="500" :class="{'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Name">
                <i v-show="errors.has('name')" class="fa fa-warning"></i>
                <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
        </div>
    </div>
</template>


<script>
  export default {
    name: 'delay-example'
  };
</script>
