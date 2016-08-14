<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <legend>Debounced Form</legend>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email - Delay: 500ms</label>
                <input v-validate data-rules="required|email" data-delay="500" :class="{'pure-input-1': true, 'has-error': errors.has('email') }" name="email" type="text" placeholder="Email">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('name') }" for="name">Name - Delay: 1s</label>
                <input v-validate data-rules="required|alpha|min:3" data-delay="1000" :class="{'pure-input-1': true, 'has-error': errors.has('name') }" name="name" type="text" placeholder="Full Name">
                <span class="error" v-show="errors.has('name')">{{ errors.first('name') }}</span>
            </div>
        </form>

        <div slot="code-html">
            &lt;div id=&quot;app&quot;&gt;
                &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                    &lt;legend&gt;Basic Form&lt;/legend&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email - Delay: 500ms&lt;/label&gt;
                        &lt;input v-validate data-rules=&quot;required|email&quot; data-delay=&quot;500&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; name=&quot;email&quot; type=&quot;email&quot; placeholder=&quot;Email&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ "{" + "{ errors.first('email') }" + "}" }}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('name') }&quot; for=&quot;name&quot;&gt;Name - Delay: 1s&lt;/label&gt;
                        &lt;input v-validate data-rules=&quot;required|alpha|min:3&quot; data-delay=&quot;1000&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name') }&quot; name=&quot;name&quot; type=&quot;text&quot; placeholder=&quot;Full Name&quot;&gt;
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
                el: '#app'
            });
        </div>
    </code-example>
</template>
