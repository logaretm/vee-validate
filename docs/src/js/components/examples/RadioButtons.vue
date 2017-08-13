<template>
    <form @submit.prevent="validateForm">
        <div class="columns is-multiline">
            <div class="column is-6">
                <legend :class="{ 'error': errors.has('radio_group_1') }">Radio Group 1</legend>
                <p class="control">
                    <label class="radio">
                        <input name="radio_group_1" v-validate="'required|in:1,2'" value="1" type="radio">
                        Option 1
                    </label>
                    <label class="radio">
                        <input name="radio_group_1" value="2" type="radio">
                        Option 2
                    </label>
                    <label class="radio">
                        <input name="radio_group_1" value="3" type="radio">
                        Option 3
                    </label>
                </p>
                <span class="help is-danger" v-show="errors.has('radio_group_1')">{{ errors.first('radio_group_1') }}</span>
            </div>

            <div class="column is-6">
                <legend :class="{ 'error': errors.has('radio_group_2') }">Radio Group 2 (Bound)</legend>
                <p class="control">
                    <label class="radio">
                        <input v-model="radio_group_2" v-validate="{ rules: 'required|in:1,2', arg: 'radio_group_2' }" name="radio_group_2" value="1" type="radio">
                        Option 1
                    </label>
                    <label class="radio">
                        <input v-model="radio_group_2" name="radio_group_2" value="2" type="radio">
                        Option 2
                    </label>
                    <label class="radio">
                        <input v-model="radio_group_2" name="radio_group_2" value="3" type="radio">
                        Option 3
                    </label>
                </p>
                <span class="help is-danger" v-show="errors.has('radio_group_2')">{{ errors.first('radio_group_2') }}</span>
            </div>
        </div>

        <p class="control">
            <button type="submit" class="button is-primary" name="button">Apply</button>
        </p>
    </form>
</template>

<script>
export default {
  name: 'radio-buttons-example',
  data: () => ({
    radio_group_2: '',
  }),
  methods: {
    validateForm() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          // eslint-disable-next-line
          alert('All Passes!');
          return;
        }
        alert('Oh NO!');
      });
    }
  }
};
</script>
