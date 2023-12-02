<template>
  <button
    @click="$emit('update:modelValue', !modelValue)"
    class="burger burger-squeeze"
    aria-label="Menu"
    :class="{ open: modelValue }"
  >
    <div class="burger-lines"></div>
  </button>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="postcss" scoped>
.burger {
  height: 3em;
  width: 3em;
  font-size: 12px;
  cursor: pointer;
  -webkit-transition: 0.2s all;
  -o-transition: 0.2s all;
  transition: 0.2s all;
  -webkit-tap-highlight-color: transparent;
  &:focus {
    outline: none;
  }
}
.burger .burger-lines:after {
  left: 0;
  top: -1em;
}
.burger .burger-lines:before {
  left: 1em;
  top: 1em;
}
.burger:after {
  content: '';
  display: block;
  position: absolute;
  height: 150%;
  width: 150%;
  top: -25%;
  left: -25%;
}
.burger .burger-lines {
  top: 50%;
  margin-top: -0.125em;
}
.burger .burger-lines,
.burger .burger-lines:after,
.burger .burger-lines:before {
  pointer-events: none;
  display: block;
  content: '';
  width: 100%;
  border-radius: 0.25em;
  background-color: #000;
  height: 0.25em;
  position: absolute;
  -webkit-transform: rotate(0);
  -ms-transform: rotate(0);
  transform: rotate(0);
}

.dark {
  .burger .burger-lines,
  .burger .burger-lines:after,
  .burger .burger-lines:before {
    background-color: #fff;
  }
}

.burger .burger-lines:after {
  left: 0;
  top: -1em;
}
.burger .burger-lines:before {
  left: 1em;
  top: 1em;
}

.burger.burger-squeeze .burger-lines:after,
.burger.burger-squeeze .burger-lines:before {
  width: 2em;
}

@screen motion {
  .burger.burger-squeeze .burger-lines,
  .burger.burger-squeeze .burger-lines:after,
  .burger.burger-squeeze .burger-lines:before {
    -webkit-transition:
      0.2s top 0.2s,
      0.1s left,
      0.2s transform,
      0.4s background-color 0.2s;
    -o-transition:
      0.2s top 0.2s,
      0.1s left,
      0.2s transform,
      0.4s background-color 0.2s;
    transition:
      0.2s top 0.2s,
      0.1s left,
      0.2s transform,
      0.4s background-color 0.2s;
  }

  .burger.burger-squeeze.open .burger-lines,
  .burger.burger-squeeze.open .burger-lines:after,
  .burger.burger-squeeze.open .burger-lines:before {
    -webkit-transition:
      0.2s background-color,
      0.2s top,
      0.2s left,
      0.2s transform 0.15s;
    -o-transition:
      0.2s background-color,
      0.2s top,
      0.2s left,
      0.2s transform 0.15s;
    transition:
      0.2s background-color,
      0.2s top,
      0.2s left,
      0.2s transform 0.15s;
  }
}
.burger.burger-squeeze.open .burger-lines {
  background-color: transparent;
}

.burger.burger-squeeze.open .burger-lines:before,
.burger.burger-squeeze.open .burger-lines:after {
  left: 0.5em;
  top: 0px;
}

.burger.burger-squeeze.open .burger-lines:before {
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.burger.burger-squeeze.open .burger-lines:after {
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
