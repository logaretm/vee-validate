<!--
    Shows Delay Configurations.
-->
<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <legend>File Upload</legend>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('file') }" for="file">Unrejected Input</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('file') }" name="file" v-validate rules="mimes:image/*" type="file">
                <span class="error" v-show="errors.has('file')">{{ errors.first('file') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('rejected') }" for="rejected">Rejected Input</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('rejected') }" name="rejected" v-validate rules="mimes:image/*" type="file" reject>
                <span class="error" v-show="errors.has('rejected')">{{ errors.first('rejected') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('dimensions') }" for="dimensions">Dimensions Input</label>
                <input :class="{'pure-input-1': true, 'has-error': errors.has('dimensions') }" name="dimensions" v-validate rules="dimensions:150,100" type="file">
                <span class="error" v-show="errors.has('dimensions')">{{ errors.first('dimensions') }}</span>
            </div>
            <button type="submit" class="pure-button pure-button-primary">Sign up</button>
        </form>

        <div slot="code-html">
            &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                &lt;legend&gt;File Upload&lt;/legend&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('file') }&quot; for=&quot;file&quot;&gt;Unrejected Input&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('file') }&quot; name=&quot;file&quot; v-validate rules=&quot;mimes:image/*&quot; type=&quot;file&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('file')&quot;&gt;{{ "{" + "{ errors.first('file') }" + "}" }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;pure-u-1&quot;&gt;
                    &lt;label :class=&quot;{'error': errors.has('file') }&quot; for=&quot;file&quot;&gt;Rejected Input&lt;/label&gt;
                    &lt;input :class=&quot;{'pure-input-1': true, 'has-error': errors.has('file') }&quot; name=&quot;file&quot; v-validate rules=&quot;mimes:image/*&quot; type=&quot;file&quot;&gt;
                    &lt;span class=&quot;error&quot; v-show=&quot;errors.has('file')&quot;&gt;{{ "{" + "{ errors.first('file') }" + "}" }}&lt;/span&gt;
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
