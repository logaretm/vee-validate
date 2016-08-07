<!--
    Shows Delay Configurations.
-->
<template>
    <p>
        You can specify a delay to debounce the input event, a case scenario that you may want to wait for the user to stop typing then validate the field.
        This can be achieved by passing a <code class="inline">delay</code> attribute on the field being validated, and assign it the number of milliseconds you want to wait for.
    </p>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <legend>Debounced Form</legend>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email - Delay: 500ms</label>
                <input v-validate rules="required|email" delay="500" :class="{'pure-input-1': true, 'has-error': errors.has('email') }" name="email" type="email" placeholder="Email">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('name') }" for="name">Name - Delay: 1s</label>
                <input v-validate rules="required|alpha|min:3" delay="1000" :class="{'pure-input-1': true, 'has-error': errors.has('name') }" name="name" type="text" placeholder="Full Name">
                <span class="error" v-show="errors.has('name')">{{ errors.first('name') }}</span>
            </div>
        </form>

        <div slot="code-html">
            &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                &lt;legend&gt;Basic Form&lt;/legend&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email - Delay: 500ms&lt;/label&gt;
                    &lt;input v-validate rules=&quot;required|email&quot; delay=&quot;500&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; name=&quot;email&quot; type=&quot;email&quot; placeholder=&quot;Email&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ "{" + "{ errors.first('email') }" + "}" }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('name') }&quot; for=&quot;name&quot;&gt;Name - Delay: 1s&lt;/label&gt;
                    &lt;input v-validate rules=&quot;required|alpha|min:3&quot; delay=&quot;1000&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name') }&quot; name=&quot;name&quot; type=&quot;text&quot; placeholder=&quot;Full Name&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('name')&quot;&gt;{{ "{" + "{ errors.first('name') }" + "}" }}&lt;/span&gt;
                &lt;/div&gt;
            &lt;/form&gt;
        </div>


        <div slot="code-js">
            Vue.use(VueValidation);

            new Vue({
                el: '#app'
            });
        </div>
    </code-example>
</template>
