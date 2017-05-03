<template>
    <a @mouseenter="mouseEnter" @mouseleave="mouseLeave" class="button__star" :href="link">
        <div v-show="shown === 'default'" class="flex-div">
            <slot  name="default"></slot>
        </div>
        <div v-show="shown === 'hover'" class="flex-div">
             <slot name="hover"></slot>
        </div>
    </a>    
</template>

<script>
  export default {
    name: 'animated-button',
    props: ['link'],
    data: () => ({
      shown: 'default'
    }),
    methods: {
      mouseEnter() {
        this.shown = 'hover';
      },
      mouseLeave() {
        this.shown = 'default';
      }
    }
  };
</script>
