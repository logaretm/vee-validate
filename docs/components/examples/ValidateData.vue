<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email</label>
                <input v-model="email" v-validate="email" data-rules="required|email" :class="{'pure-input-1': true, 'has-error': errors.has('email') }" type="text" placeholder="Email">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('name') }" for="name">Full Name</label>
                <input v-model="name" v-validate.initial="name" data-rules="required|alpha" :class="{'pure-input-1': true, 'has-error': errors.has('name') }" type="text" placeholder="Full Name">
                <span class="error" v-show="errors.has('name')">{{ errors.first('name') }}</span>
            </div>
        </form>

        <div slot="code-html">
            &lt;div id=&quot;app&quot;&gt;
                &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                        &lt;input v-model=&quot;email&quot; v-validate=&quot;email&quot; data-rules=&quot;required|email&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; type=&quot;text&quot; placeholder=&quot;Email&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ "{" + "{ errors.first('email') }" + "}" }}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('name') }&quot; for=&quot;name&quot;&gt;Full Name&lt;/label&gt;
                        &lt;input v-model=&quot;name&quot; v-validate.initial=&quot;name&quot; data-rules=&quot;required|alpha&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name') }&quot; type=&quot;text&quot; placeholder=&quot;Full Name&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('name')&quot;&gt;{{ "{" + "{ errors.first('name') }" + "}" }}&lt;/span&gt;
                    &lt;/div&gt;
                &lt;/form&gt;
            &lt;/div&gt;
        </div>
        <div slot="code-js">
            import Vue from 'vue';
            import VeeValidate from 'vee-validate';

            Vue.use(VeeValidate);

            new Vue({
                el: '#app',
                data: {
                    email: '',
                    name: ''
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
            name: ''
        }
    }
}
</script>
