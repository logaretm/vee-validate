<template>
    <code-example>
        <div slot="example">
            <form @submit="validateForm1" class="pure-form pure-form-stacked">
                <legend>Form 1</legend>
                <div class="pure-u-1">
                    <label :class="{'error': errors.has('name', 'form-1') }" for="name">Name</label>
                    <input v-validate data-rules="required|alpha" data-scope="form-1" :class="{'pure-input-1': true, 'has-error': errors.has('name', 'form-1') }" name="name" type="text">
                    <span class="error" v-show="errors.has('name', 'form-1')">{{ errors.first('name', 'form-1') }}</span>
                </div>
                <div class="pure-u-1">
                    <label :class="{'error': errors.has('email', 'form-1') }" for="email">Email</label>
                    <input v-validate data-rules="required|email" data-scope="form-1" :class="{'pure-input-1': true, 'has-error': errors.has('email', 'form-1') }" name="email" type="text">
                    <span class="error" v-show="errors.has('email', 'form-1')">{{ errors.first('email', 'form-1') }}</span>
                </div>

                <button class="pure-button pure-button-primary" type="submit" name="button">Sign up</button>
            </form>

            <form @submit="validateForm2" class="pure-form pure-form-stacked" data-scope="form-2">
                <legend>Form 2</legend>
                <div class="pure-u-1">
                    <label :class="{'error': errors.has('email', 'form-2') }" for="email">Email</label>
                    <input v-validate data-rules="required|email" :class="{'pure-input-1': true, 'has-error': errors.has('email', 'form-2') }" name="email" type="text">
                    <span class="error" v-show="errors.has('email', 'form-2')">{{ errors.first('email', 'form-2') }}</span>
                </div>

                <div class="pure-u-1">
                    <label :class="{'error': errors.has('email', 'form-2') }" for="email">Password</label>
                    <input v-validate data-rules="required" :class="{'pure-input-1': true, 'has-error': errors.has('email', 'form-2') }" name="password" type="password">
                </div>

                <button class="pure-button pure-button-primary" type="submit" name="button">Log in</button>
            </form>
        </div>
    </code-example>
</template>

<script>
 export default {
    methods: {
        validateForm1(e) {
            this.$validator.validateAll('form-1');
            if (this.errors.any('form-1')) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            alert('Form Submitted!');
        },
        validateForm2(e) {
            this.$validator.validateAll('form-2');
            if (this.errors.any('form-2')) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            alert('Form Submitted!');
        }
    }
 }
</script>
