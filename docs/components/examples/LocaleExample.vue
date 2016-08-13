<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked rtl">
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email</label>
                <input v-validate rules="required|email" :class="{'pure-input-1': true, 'has-error': errors.has('email') }" name="email" type="text">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('phone') }" for="phone">Phone</label>
                <input v-validate rules="required|numeric" reject :class="{'pure-input-1': true, 'has-error': errors.has('phone') }" name="phone" type="text">
                <span class="error" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
            </div>
        </form>

        <div slot="code-html">
            &lt;form class=&quot;pure-form pure-form-stacked rtl&quot;&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                    &lt;input v-validate rules=&quot;required|email&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; name=&quot;email&quot; type=&quot;text&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ "{" + "{ errors.first('email') }" + "}" }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('phone') }&quot; for=&quot;phone&quot;&gt;Phone&lt;/label&gt;
                    &lt;input v-validate rules=&quot;required|numeric&quot; reject :class=&quot;{'pure-input-1': true, 'has-error': errors.has('phone') }&quot; name=&quot;phone&quot; type=&quot;text&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('phone')&quot;&gt;{{ "{" + "{ errors.first('phone') }" + "}" }}&lt;/span&gt;
                &lt;/div&gt;
            &lt;/form&gt;
        </div>
        <div slot="code-js">
            import ar from './locale/ar';
            import Vue from 'vue';
            import VeeValidate, { Validator } from 'vee-validate';

            // Merge dictionary messages.
            Validator.updateDictionary({ ar });

            new Vue({
                el: 'body',
                data: {
                    phone: '',
                    email: ''
                },
                created() {
                    this.$validator.setLocale('ar'); // Switch locale for this instance.
                }
            });
        </div>

    </code-example>
</template>

<script>
import messages from './../../../dist/locale/ar';
export default {
    data() {
        return {
            email: '',
            phone: '',
        }
    },
    created() {
        this.$validator.updateDictionary({
            ar: messages.default
        });
        this.$validator.setLocale('ar');
    }
};
</script>
