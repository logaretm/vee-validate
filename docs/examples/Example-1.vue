<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <legend>Basic Form</legend>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('email') }" for="email">Email</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('email') }" name="email" v-validate rules="required|email" type="email" placeholder="Email">
                <span class="error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('name') }" for="name">Name</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('name') }" name="name" v-validate rules="required|min:3|alpha" type="text" placeholder="Full Name">
                <span class="error" v-show="errors.has('name')">{{ errors.first('name') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('phone') }" for="phone">Phone</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('phone') }" name="phone" v-validate rules="required|max:11|numeric" type="text" placeholder="Phone Number">
                <span class="error" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('password') }" for="password">Password</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('password') }" name="password" v-validate rules="required|min:8" type="password" placeholder="Password">
                <span class="error" v-show="errors.has('password')">{{ errors.first('password') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('state') }" for="state">State</label>
                <select :class="{'pure-input-1': true, 'has-error': errors.has('state') }" name="state" v-validate rules="required|in:1,2,3">
                    <option value="1">Port Said</option>
                    <option value="2">Cairo</option>
                    <option value="3">Alexandrea</option>
                    <option value="4">New York</option>
                </select>
                <span class="error" v-show="errors.has('state')">{{ errors.first('state') }}</span>
            </div>
            <button type="submit" class="pure-button pure-button-primary">Sign up</button>
        </form>

        <div slot="code-html">
            &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                &lt;legend&gt;Basic Form&lt;/legend&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('email') }&quot; for=&quot;email&quot;&gt;Email&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('email') }&quot; name=&quot;email&quot; v-validate rules=&quot;required|email&quot; type=&quot;email&quot; placeholder=&quot;Email&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('email')&quot;&gt;{{ errors.first('email') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('name') }&quot; for=&quot;name&quot;&gt;Name&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('name') }&quot; name=&quot;name&quot; v-validate rules=&quot;required|min:3|alpha&quot; type=&quot;text&quot; placeholder=&quot;Full Name&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('name')&quot;&gt;{{ errors.first('name') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('phone') }&quot; for=&quot;phone&quot;&gt;Phone&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('phone') }&quot; name=&quot;phone&quot; v-validate rules=&quot;required|max:11|numeric&quot; type=&quot;text&quot; placeholder=&quot;Phone Number&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('phone')&quot;&gt;{{ errors.first('phone') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('password') }&quot; for=&quot;password&quot;&gt;Password&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('password') }&quot; name=&quot;password&quot; v-validate rules=&quot;required|min:8&quot; type=&quot;password&quot; placeholder=&quot;Password&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('password')&quot;&gt;{{ errors.first('password') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('state') }&quot; for=&quot;state&quot;&gt;State&lt;/label&gt;
                    &lt;select :class=&quot;{'pure-input-1': true, 'has-error': errors.has('state') }&quot; name=&quot;state&quot; v-validate rules=&quot;required|in:1,2,3&quot;&gt;
                        &lt;option value=&quot;1&quot;&gt;Port Said&lt;/option&gt;
                        &lt;option value=&quot;2&quot;&gt;Cairo&lt;/option&gt;
                        &lt;option value=&quot;3&quot;&gt;Alexandrea&lt;/option&gt;
                        &lt;option value=&quot;4&quot;&gt;New York&lt;/option&gt;
                    &lt;/select&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('state')&quot;&gt;{{ errors.first('state') }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;button type=&quot;submit&quot; class=&quot;pure-button pure-button-primary&quot;&gt;Sign up&lt;/button&gt;
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
