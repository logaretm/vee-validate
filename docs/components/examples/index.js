import FirstExample from './Example-1.vue';
import SecondExample from './Example-2.vue';
import ThirdExample from './Example-3.vue';

// Register Examples.
export default (Vue) => {
    Vue.component('first-example', FirstExample);
    Vue.component('second-example', SecondExample);
    Vue.component('third-example', ThirdExample);
};
