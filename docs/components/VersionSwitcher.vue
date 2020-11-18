<template>
  <label for="version" class="hidden lg:flex items-center">
    <select name="version" id="version" v-model="selectedVersion" class="appearance-none text-gray-400 bg-transparent">
      <option v-for="version in versions" :key="version.text" :value="version">{{ version.text }}</option>
    </select>
    <svg class="ml-2 fill-current h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
    </svg>
  </label>
</template>

<script>
export default {
  name: 'VersionSwitcher',
  data() {
    // TODO: Linkify all docs
    const versions = [
      {
        text: 'v4.0',
        link: 'http://logaretm.com/',
      },
      {
        text: 'v3.x',
        link: 'https://vee-validate.logaretm.com/v3',
      },
      {
        text: 'v2.x',
        link: 'https://vee-validate.logaretm.com/v2',
      },
    ];

    return {
      selectedVersion: versions[0],
      versions,
    };
  },
  watch: {
    selectedVersion(value) {
      if (!value) {
        return;
      }

      window.location.href = value.link;
    },
  },
};
</script>
