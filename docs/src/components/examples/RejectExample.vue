<template>
    <code-example>
        <form slot="example" class="pure-form pure-form-stacked">
            <legend>File Upload</legend>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('image') }" for="image">Unrejected Image</label>
                <input v-validate data-rules="mimes:image/*" :class="{'pure-input-1': true, 'has-error': errors.has('image') }" name="image" type="file">
                <span class="error" v-show="errors.has('image')">{{ errors.first('image') }}</span>
            </div>
            <div class="pure-u-1">
                <label :class="{'error': errors.has('file') }" for="file">Rejected Image</label>
                <input v-validate.reject data-rules="mimes:image/*" :class="{'pure-input-1': true, 'has-error': errors.has('file') }" name="file" type="file">
                <span class="error" v-show="errors.has('file')">{{ errors.first('file') }}</span>
            </div>
        </form>

        <div slot="code-html">
            &lt;div id=&quot;app&quot;&gt;
                &lt;form class=&quot;pure-form pure-form-stacked&quot;&gt;
                    &lt;legend&gt;File Upload&lt;/legend&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('image') }&quot; for=&quot;image&quot;&gt;Unrejected Image&lt;/label&gt;
                        &lt;input v-validate data-rules=&quot;mimes:image/*&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('image') }&quot; name=&quot;image&quot; type=&quot;file&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('image')&quot;&gt;{{ errors.first('image') }}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class=&quot;pure-u-1&quot;&gt;
                        &lt;label :class=&quot;{'error': errors.has('file') }&quot; for=&quot;file&quot;&gt;Rejected Image&lt;/label&gt;
                        &lt;input  v-validate.reject data-rules=&quot;mimes:image/*&quot; :class=&quot;{'pure-input-1': true, 'has-error': errors.has('file') }&quot; name=&quot;file&quot; type=&quot;file&quot;&gt;
                        &lt;span class=&quot;error&quot; v-show=&quot;errors.has('file')&quot;&gt;{{ errors.first('file') }}&lt;/span&gt;
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
