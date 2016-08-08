<!--
    Shows Most basic example
-->
<template>
    <p>
        All you need is to add the <code class="inline">v-validate</code> directive to the input you wish to validate.
        <br><br>
        Then Add a <code class="inline">rules</code> attribute which contains a list of validation rules separated by a pipe '<code class="inline">|</code>'.
        For the following example the validation rules are straight forward, use <code class="inline">required</code> to indicate that the field is required.
        And <code class="inline">email</code> to indicate that the field must be an email.
        To combine both rules we assign the value <code class="inline">required|email</code> to the <code class="inline">rules</code> attribute.
    </p>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email</label>
                <input v-validate rules="required|email" :class="{'pure-input-1': true, 'has-error': errors.has('email') }" name="email" type="text" placeholder="Email">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
        </form>

        <div slot="code-html">
            &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                    &lt;input v-validate rules=&quot;required|email&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; name=&quot;email&quot; type=&quot;text&quot; placeholder=&quot;Email&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ "{" + "{ errors.first('email') }" + "}" }}&lt;/span&gt;
                &lt;/div&gt;
            &lt;/form&gt;
        </div>


        <div slot="code-js">
            import VeeValidate from 'vee-validate';
            Vue.use(VeeValidate);

            new Vue({
                el: '#app'
            });
        </div>
    </code-example>
</template>
