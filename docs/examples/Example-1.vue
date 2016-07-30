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
            <form class="pure-form pure-form-stacked">
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
        </div>


        <div slot="code-js">
            Vue.use(VueValidation);

            new Vue({
                el: '#app'
            });
        </div>
    </code-example>
</template>
