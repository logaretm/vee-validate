<template>
    <code-example>
        <div slot="example">
            <form @submit="validateForm1" class="pure-form pure-form-stacked">
                <legend>Form 1</legend>
                <div class="pure-u-1">
                    <label :class="{'error': errors.has('name', 'form-1') }" for="name">Name</label>
                    <input v-validate="name" v-model="name" data-rules="required|alpha" data-scope="form-1" :class="{'pure-input-1': true, 'has-error': errors.has('name', 'form-1') }" name="name" type="text">
                    <span class="error" v-show="errors.has('name', 'form-1')">{{ errors.first('name', 'form-1') }}</span>
                </div>
                <div class="pure-u-1">
                    <label :class="{'error': errors.has('email', 'form-1') }" for="email">Email</label>
                    <input v-validate="email" v-model="email" data-rules="required|email" data-scope="form-1" :class="{'pure-input-1': true, 'has-error': errors.has('email', 'form-1') }" name="email" type="text">
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

        <div slot="code-html">
            &lt;form @submit=&quot;validateForm1&quot; class=&quot;pure-form pure-form-stacked&quot;&gt;
                &lt;legend&gt;Form 1&lt;/legend&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('name', 'form-1') }&quot; for=&quot;name&quot;&gt;Name&lt;/label&gt;
                    &lt;input v-validate=&quot;name&quot; v-model=&quot;name&quot; data-rules=&quot;required|alpha&quot; data-scope=&quot;form-1&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name', 'form-1') }&quot; name=&quot;name&quot; type=&quot;text&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('name', 'form-1')&quot;&gt;{{ errors.first('name', 'form-1') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email', 'form-1') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                    &lt;input v-validate=&quot;email&quot; v-model=&quot;email&quot; data-rules=&quot;required|email&quot; data-scope=&quot;form-1&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email', 'form-1') }&quot; name=&quot;email&quot; type=&quot;text&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email', 'form-1')&quot;&gt;{{ errors.first('email', 'form-1') }}&lt;/span&gt;
                &lt;/div&gt;

                &lt;button class=&quot;pure-button pure-button-primary&quot; type=&quot;submit&quot; name=&quot;button&quot;&gt;Sign up&lt;/button&gt;
            &lt;/form&gt;

            &lt;form @submit=&quot;validateForm2&quot; class=&quot;pure-form pure-form-stacked&quot; data-scope=&quot;form-2&quot;&gt;
                &lt;legend&gt;Form 2&lt;/legend&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email', 'form-2') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                    &lt;input v-validate data-rules=&quot;required|email&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email', 'form-2') }&quot; name=&quot;email&quot; type=&quot;text&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email', 'form-2')&quot;&gt;{{ errors.first('email', 'form-2') }}&lt;/span&gt;
                &lt;/div&gt;

                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email', 'form-2') }&quot; for=&quot;email&quot;&gt;Password&lt;/label&gt;
                    &lt;input v-validate data-rules=&quot;required&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email', 'form-2') }&quot; name=&quot;password&quot; type=&quot;password&quot;&gt;
                &lt;/div&gt;

                &lt;button class=&quot;pure-button pure-button-primary&quot; type=&quot;submit&quot; name=&quot;button&quot;&gt;Log in&lt;/button&gt;
            &lt;/form&gt;
        </div>

        <div slot="code-js">
            new Vue({
               el: '#app',
               data: {
                   name: '',
                   email: ''
               },
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
           });
        </div>
    </code-example>
</template>

<script>
 export default {
    data() {
        return {
            name: '',
            email: ''
        }
    },
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
