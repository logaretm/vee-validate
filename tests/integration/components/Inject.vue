<template>
  <div>
    <child-with-inject ref="inject"></child-with-inject>
    <child-new-inject ref="new"></child-new-inject>
    <indifferent-child ref="none"></indifferent-child>
  </div>
</template>


<script>
import ChildWithInject from './stubs/ChildWithParentValidatorInjection';
import ChildNewInject from './stubs/ChildWithNewValidatorInjection';
import IndifferentChild from './stubs/Input';

export default {
  name: 'inject-test',
  components: {
    ChildWithInject,
    ChildNewInject,
    IndifferentChild
  }
};
</script>
