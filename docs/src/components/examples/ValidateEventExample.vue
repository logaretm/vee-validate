<template>
    <code-example>
        <form slot="example" @submit="validateBeforeSubmit" class="pure-form pure-form-stacked">
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email</label>
                <input v-model="email" v-validate.initial="email" data-rules="required|email" :class="{'pure-input-1': true, 'has-error': errors.has('email') }" type="text" placeholder="Email">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('name') }" for="name">Name</label>
                <input v-model="name" v-validate.initial="name" data-rules="required|alpha|min:3" :class="{'pure-input-1': true, 'has-error': errors.has('name') }" type="text" placeholder="Name">
                <span class="error" v-show="errors.has('name')">{{ errors.first('name') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('phone') }" for="phone">Phone Number</label>
                <input v-model="phone" v-validate.initial="phone" data-rules="required|numeric" :class="{'pure-input-1': true, 'has-error': errors.has('phone') }" type="text" placeholder="Phone">
                <span class="error" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('url') }" for="url">Website</label>
                <input v-model="url" v-validate.initial="url" data-rules="required|url" :class="{'pure-input-1': true, 'has-error': errors.has('url') }" type="text" placeholder="Website">
                <span class="error" v-show="errors.has('url')">{{ errors.first('url') }}</span>
            </div>

            <input class="pure-button pure-button-primary" type="submit">
        </form>

        <div slot="code-html">
            &lt;div id=&quot;app&quot;&gt;
                &lt;form @submit=&quot;validateBeforeSubmit&quot; class=&quot;pure-form pure-form-stacked&quot;&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                        &lt;input v-model=&quot;email&quot; v-validate.initial=&quot;email&quot; data-rules=&quot;required|email&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; type=&quot;text&quot; placeholder=&quot;Email&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ "{" + "{ errors.first('email') }" + "}" }}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('name') }&quot; for=&quot;name&quot;&gt;Name&lt;/label&gt;
                        &lt;input v-model=&quot;name&quot; v-validate.initial=&quot;name&quot; data-rules=&quot;required|alpha|min:3&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name') }&quot; type=&quot;text&quot; placeholder=&quot;Full Name&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('name')&quot;&gt;{{ "{" + "{ errors.first('name') }" + "}" }}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('phone') }&quot; for=&quot;phone&quot;&gt;Phone Number&lt;/label&gt;
                        &lt;input v-model=&quot;phone&quot; v-validate.initial=&quot;phone&quot; data-rules=&quot;required|numeric&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('phone') }&quot; type=&quot;text&quot; placeholder=&quot;Phone&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('phone')&quot;&gt;{{ "{" + "{ errors.first('phone') }" + "}" }}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('url') }&quot; for=&quot;url&quot;&gt;Website&lt;/label&gt;
                        &lt;input v-model=&quot;url&quot; v-validate.initial=&quot;url&quot; data-rules=&quot;required|url&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('url') }&quot; type=&quot;text&quot; placeholder=&quot;Website&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('url')&quot;&gt;{{ "{" + "{ errors.first('url') }" + "}" }}&lt;/span&gt;
                    &lt;/div&gt;

                    &lt;input class=&quot;pure-button pure-button-primary&quot; type=&quot;submit&quot;&gt;
                &lt;/form&gt;
            &lt;/div&gt;
        </div>

        <div slot="code-js">
            import Vue from 'vue';
            import Vee from 'vee-validate';

            new Vue({
                el: '#app',
                data() {
                    return {
                        email: '',
                        name: '',
                        phone: '',
                        url: '',
                    };
                },
                methods: {
                    validateBeforeSubmit(e) {
                        // Note that validateAll here is missing the values parameter, which tells the validator
                        // to trigger validation for attached inputs.
                        this.$validator.validateAll();

                        if (this.errors.any()) {
                            e.preventDefault();
                        }
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
                email: '',
                name: '',
                phone: '',
                url: ''
            }
        },
        methods: {
            validateBeforeSubmit(e) {
                this.$validator.validateAll();

                if (this.errors.any()) {
                    e.preventDefault();
                }
            }
        }
    }
</script>
