<template>
    <div class="columns is-multiline">
        <child-component></child-component>
        <div class="column is-12">
            <button class="button is-info" type="button" @click="validateChild">Validate Child</button>
            <button class="button is-danger" type="button" @click="clearChild">Clear Child Errors</button>
        </div>
    </div>
</template>

<script>
  import bus from './bus';
  import ChildComponent from './EventBusChild.vue';

  export default {
    name: 'event-bus-example',
    components: {
      ChildComponent
    },
    methods: {
      validateChild() {
        bus.$emit('validate');
      },
      clearChild() {
        bus.$emit('clear');
      }
    },
    created() {
      bus.$on('errors-changed', (errors) => {
        this.errors.clear();
        errors.forEach((e) => {
          this.errors.add(e.field, e.msg, e.rule, e.scope);
        });
      });
    }
  };
</script>
