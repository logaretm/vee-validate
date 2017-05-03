<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Type the selector</label>
            <p class="control">
                <input v-model="selector" class="input" type="text" placeholder="Rule Name">
            </p>
        </div>
        <div class="column is-12">
            <label><b>Selected Error</b></label>
            <p>
                {{ selectedError }}
            </p>
        </div>
        <div class="column is-12">
            <label><b>Available Errors:</b></label>
            <pre>{{ errors }}</pre>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'selectors-example',
    data: () => ({
      selector: ''
    }),
    computed: {
      selectedError() {
        if (! this.selector) {
          return 'You did not select any error';
        }

        return this.errors.first(this.selector) || 'None Found';
      }
    },
    created() {
      this.errors.add('email', 'Newsletter Email is not valid', 'email', 'newsletter');
      this.errors.add('email', 'Newsletter Email is required', 'required', 'newsletter');

      this.errors.add('email', 'Email is not a valid email', 'email');
      this.errors.add('name', 'name is required', 'required');
    }
  };
</script>
