<!--
    Shows Delay Configurations.
-->
<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <legend>Basic Form</legend>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('email') }" name="email" v-validate rules="required|email" delay="500" type="email" placeholder="Email">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('name') }" for="name">Name</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('name') }" name="name" v-validate rules="required|min:3|alpha" delay="1000" type="text" placeholder="Full Name">
                <span class="error" v-show="errors.has('name')">{{ errors.first('name') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('phone') }" for="phone">Phone</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('phone') }" name="phone" v-validate rules="required|max:11|numeric" type="text" placeholder="Phone Number">
                <span class="error" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
            </div>
            <button type="submit" class="pure-button pure-button-primary">Sign up</button>
        </form>

        <div slot="code-html">
            &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                &lt;legend&gt;Basic Form&lt;/legend&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; name=&quot;email&quot; v-validate rules=&quot;required|email&quot; delay=&quot;500&quot; type=&quot;email&quot; placeholder=&quot;Email&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ errors.first('email') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('name') }&quot; for=&quot;name&quot;&gt;Name&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name') }&quot; name=&quot;name&quot; v-validate rules=&quot;required|min:3|alpha&quot; delay=&quot;1000&quot; type=&quot;text&quot; placeholder=&quot;Full Name&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('name')&quot;&gt;{{ errors.first('name') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('phone') }&quot; for=&quot;phone&quot;&gt;Phone&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('phone') }&quot; name=&quot;phone&quot; v-validate rules=&quot;required|max:11|numeric&quot; type=&quot;text&quot; placeholder=&quot;Phone Number&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('phone')&quot;&gt;{{ errors.first('phone') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;button type=&quot;submit&quot; class=&quot;pure-button pure-button-primary&quot;&gt;Sign up&lt;/button&gt;
            &lt;/form&gt;
        </div>


        <div slot="code-js">
            // Set a global delay of 700.
            Vue.use(VueValidation, { delay: 700 });

            new Vue({
                el: '#app'
            });
        </div>
    </code-example>
</template>
