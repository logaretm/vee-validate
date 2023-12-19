<template>
  <a
    href="https://github.com/logaretm/vee-validate/stargazers"
    target="_blank"
    rel="noopener"
    class="flex items-center text-xs font-bold font-body border-2 text-zinc-400 border-zinc-400 rounded-full px-3 py-1.5 hover:border-emerald-500 hover:text-emerald-500 select-none transition-colors duration-300"
  >
    <Icon name="star" class="w-4 h-4 mr-1" />
    {{ format(count) }}
  </a>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Icon from '@/components/Icon.vue';
import { fetchStarCount } from '@/utils/github';

const props = defineProps<{
  initialCount?: number;
}>();

function format(number: number) {
  return number.toLocaleString();
}

const count = ref(props.initialCount || 10000);

onMounted(async () => {
  count.value = (await fetchStarCount()) || count.value;
});
</script>
