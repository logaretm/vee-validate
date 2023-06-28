<template>
  <div class="relative mt-20 lg:mt-4 font-ui">
    <div
      class="bg-gradient-to-b from-white dark:from-dark to-transparent h-4 absolute -top-px lg:top-0 inset-x-0"
    ></div>
    <nav class="space-y-8 md:text-sm overflow-y-auto overscroll-y-contain px-8 lg:px-2 py-4">
      <div v-for="category in menu" :key="category.title">
        <p v-if="category.pages.length > 1" class="md:text-xs font-bold text-gray-400 uppercase">
          {{ category.title }}
        </p>
        <div class="mt-3 space-y-2 w-full">
          <a
            v-if="category.pages.length === 1"
            :href="category.pages[0].path"
            :aria-current="currentUrl === category.pages[0].path ? 'page' : undefined"
            class="flex items-center"
          >
            <span v-if="category.pages[0].icon" class="mr-2 bg-gray-200 dark:bg-gray-500 rounded p-1">
              <Icon :name="category.pages[0].icon" class="w-5 h-5 fill-current" />
            </span>
            {{ category.pages[0].menuTitle || category.pages[0].title }}
          </a>

          <template v-else>
            <div v-for="page in category.pages" :key="page.title" class="group">
              <a
                v-if="!page.children"
                :href="page.path"
                :aria-current="currentUrl === page.path ? 'page' : undefined"
                class="flex items-center ml-2"
              >
                {{ page.menuTitle || page.title }}

                <span v-if="page.new" class="ml-2 w-2 h-2 rounded-full flex-shrink-0 bg-blue-600"></span>
              </a>

              <div v-else class="flex flex-col bg-gray-200 dark:bg-gray-600 w-full rounded-lg py-3 px-2">
                <button
                  type="button"
                  class="w-full flex items-center focus:outline-none transition-colors duration-300"
                  @click="expanded[page.title] = !expanded[page.title]"
                >
                  <Icon :name="page.icon" class="w-5 h-5 fill-current" />
                  <span class="ml-2 group-hover:text-accent-800">{{ page.menuTitle || page.title }}</span>

                  <svg
                    class="ml-auto w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      v-if="!expanded[page.title]"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>

                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>

                <ExpandTransition>
                  <ul v-show="expanded[page.title]" class="mt-3 space-y-2">
                    <li v-for="childPage in page.children" :key="childPage.title" class="pl-7 flex items-center">
                      <a :href="childPage.path" :aria-current="currentUrl === childPage.path ? 'page' : undefined">
                        {{ childPage.menuTitle || childPage.title }}
                      </a>

                      <span v-if="childPage.new" class="ml-2 w-2 h-2 rounded-full flex-shrink-0 bg-blue-600"></span>
                    </li>
                  </ul>
                </ExpandTransition>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>
    <div
      class="bg-gradient-to-b from-transparent to-white dark:to-dark h-4 absolute -bottom-px lg:bottom-0 inset-x-0"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import ExpandTransition from '@/components/ExpandTransition.vue';
import Icon from '@/components/Icon.vue';

export interface CategoryMenuItem {
  title: string;
  pages: {
    title: string;
    menuTitle?: string;
    path: string;
    new?: boolean;
    icon?: string;
    children?: {
      title: string;
      new?: boolean;
      menuTitle?: string;
      path: string;
    }[];
  }[];
}

const props = defineProps<{
  menu: CategoryMenuItem[];
  currentUrl: string;
}>();

const expanded = reactive<Record<string, boolean>>({});
if (props.currentUrl) {
  if (props.currentUrl.includes('/composition-api')) {
    expanded['Composition API'] = true;
  }

  if (props.currentUrl.includes('/components')) {
    expanded['Components'] = true;
  }
}
</script>

<style lang="postcss" scoped>
nav {
  max-height: calc(80vh - 96px);
  a {
    @screen motion {
      transition: color 0.2s ease-in-out;
    }

    &:hover {
      @apply text-accent-800;
    }

    &[aria-current='page'] {
      @apply text-accent-800;
    }
  }

  /* Global Scrollbar styling */
  &::-webkit-scrollbar {
    width: 7px;
    cursor: pointer;
    /*background-color: rgba(229, 231, 235, var(--bg-opacity));*/
  }
  &::-webkit-scrollbar-track {
    background-color: none;
    cursor: pointer;
    /*background: red;*/
  }
  &::-webkit-scrollbar-thumb {
    cursor: pointer;
    background-color: #e8e8e8; /* #E7E5E4; */
    border-radius: 50px;
    /*outline: 1px solid grey;*/
  }
}

.dark {
  nav {
    /* Global Scrollbar styling */
    &::-webkit-scrollbar {
      width: 7px;
      cursor: pointer;
      /*background-color: rgba(229, 231, 235, var(--bg-opacity));*/
    }
    &::-webkit-scrollbar-track {
      background-color: none;
      cursor: pointer;
      /*background: red;*/
    }
    &::-webkit-scrollbar-thumb {
      cursor: pointer;
      background-color: #333; /* #E7E5E4; */
      border-radius: 50px;
      /*outline: 1px solid grey;*/
    }
  }
}
</style>
