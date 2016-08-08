<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email</label>
                <input v-model="email" :class="{'pure-input-1': true, 'has-error': errors.has('email') }" name="email" type="text" placeholder="Email">
                <span class="error" v-show="errors.has('email')">Errors: {{ errors.collect('email') | json }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('name') }" for="name">Full Name</label>
                <input v-model="name" :class="{'pure-input-1': true, 'has-error': errors.has('name') }" name="name" type="text" placeholder="Full Name">
                <span class="error" v-show="errors.has('name')">Errors: {{ errors.collect('name') | json }}</span>
            </div>
            <button class="pure-button pure-button-primary" @click="validateForm" type="button" name="button">Validate All</button>
            <button class="pure-button button-error" @click="clearErrors" type="button" name="button">Clear</button>
        </form>

        <div slot="code-html">
            &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                    &lt;input v-model=&quot;email&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; name=&quot;email&quot; type=&quot;text&quot; placeholder=&quot;Email&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ errors.collect('email') | json }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('name') }&quot; for=&quot;name&quot;&gt;Full Name&lt;/label&gt;
                    &lt;input v-model=&quot;name&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name') }&quot; name=&quot;name&quot; type=&quot;text&quot; placeholder=&quot;Full Name&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('name')&quot;&gt;{{ errors.collect('name') | json }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;button class=&quot;pure-button pure-button-primary&quot; @click=&quot;validateForm&quot; type=&quot;button&quot; name=&quot;button&quot;&gt;Validate All&lt;/button&gt;
                &lt;button class=&quot;pure-button button-error&quot; @click=&quot;clearErrors&quot; type=&quot;button&quot; name=&quot;button&quot;&gt;Clear&lt;/button&gt;
            &lt;/form&gt;
        </div>

        <div slot="code-js">
            import Vue from 'vue';
            import { Validator } from 'vee-validate';

            new Vue({
                validator: null, // private reference
                data() {
                    return {
                        email: '',
                        name: '',
                        errors: []
                    }
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
                        });
                    },
                    clearErrors() {
                        this.errors.clear();
                    }
                },
                ready() {
                    this.validator = new Validator({
                        email: 'required|email',
                        name: 'required|alpha|min:3'
                    });
                    this.$set('errors', this.validator.errorBag); // update the data.
                }
            });
        </div>
    </code-example>
</template>

<script>
import { Validator } from './../../../dist/vee-validate';
export default {
    validator: null,
    data() {
        return {
            email: '',
            name: '',
            errors: []
        }
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
            });
        },
        clearErrors() {
            this.errors.clear();
        }
    },
    ready() {
        this.validator = new Validator({
            email: 'required|email',
            name: 'required|alpha|min:3'
        });
        this.$set('errors', this.validator.errorBag);
    }
}
</script>
