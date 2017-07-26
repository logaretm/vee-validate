<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Name</label>
            <p class="control has-icon has-icon-right">
                <input name="name" v-validate="'required|alpha'" :class="{'input': true }" type="text" placeholder="Name">
            </p>
            <pre>{{ nameFlags }}</pre>            
        </div>
    </div>
</template>

<script>
import { mapFields } from 'vee-validate';

export default {
  name: 'flags-example',
  data: () => ({
    email: ''
  }),
  computed: {
    ...mapFields({
      nameFlags: 'name'
    })
  }
};
</script>
