<template>
  <div>
    <keep-alive>
      <child />
    </keep-alive>
    <transition>
      <child />
    </transition>
  </div>
</template>

<script>
import Child from './stubs/ChildWithParentValidatorInjection';

export default {
  name: 'builtins-test',
  components: {
    Child
  }
};
</script>
