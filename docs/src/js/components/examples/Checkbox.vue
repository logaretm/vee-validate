<template>
    <div>
        <div class="terms">
            <p>
                {{ terms }}
            </p>
        </div>
        <div>
            <p class="control">
                <label class="checkbox">
                    <input name="terms" v-validate="'required'" type="checkbox">
                    I agree to the terms and conditions.
                </label>
                <span class="help is-danger" v-show="errors.has('terms')">{{ errors.first('terms') }}</span>
            </p>
        </div>
        <p class="control">
            <button type="button" class="button is-primary" @click="nextStep">Next</button>
        </p>
    </div>
</template>

<script>
const terms = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit ';

export default {
  name: 'checkbox-example',
  data: () => ({
    terms: terms.repeat(20)
  }),
  methods: {
    nextStep() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          alert('You just agreed to conditions without reading it.');
          return;
        }
        // eslint-disable-next-line
        alert('You actually did not agree?');
      });
    }
  }
};
</script>

<style lang="stylus">
.terms
    background-color: #e6e6e6
    overflow: auto
    height: 200px
    width: 100%
    margin-bottom: 20px
</style>
