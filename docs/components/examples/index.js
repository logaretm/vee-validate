import BasicExample from './BasicExample.vue';
import DelayExample from './DelayExample.vue';
import RejectExample from './RejectExample.vue';
import ValidatorExample from './ValidatorExample.vue';
import ValidateData from './ValidateData.vue';
import ValidateEvent from './ValidateEventExample.vue';
import LocaleExample from './LocaleExample.vue';

// Register Examples.
export default (Vue) => {
    Vue.component('basic-example', BasicExample);
    Vue.component('delay-example', DelayExample);
    Vue.component('reject-example', RejectExample);
    Vue.component('validator-example', ValidatorExample);
    Vue.component('data-example', ValidateData);
    Vue.component('event-example', ValidateEvent);
    Vue.component('locale-example', LocaleExample);
};
