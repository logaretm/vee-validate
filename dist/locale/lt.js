!function(i,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(i.__vee_validate_locale__lt=i.__vee_validate_locale__lt||{},i.__vee_validate_locale__lt.js=t())}(this,function(){"use strict";var i=function(i){var t=["Byte","KB","MB","GB","TB","PB","EB","ZB","YB"],e=0===(i=1024*Number(i))?0:Math.floor(Math.log(i)/Math.log(1024));return 1*(i/Math.pow(1024,e)).toFixed(2)+" "+t[e]},t=function(i,t){var e=t;return i.split(".").every(function(i){return!!Object.prototype.hasOwnProperty.call(e,i)&&(e=e[i],!0)})},e={name:"en",messages:{_default:function(i){return i+" reikšmė netinkama."},after:function(i,t){return"Laukelyje "+i+" turi būti po "+t[0]+"."},alpha_dash:function(i){return"Laukelyje "+i+" leidžiamos tik raidės, skaičiai bei brūkšneliai."},alpha_num:function(i){return"Laukelyje "+i+" leidžiamos tik raidės ir skaičiai."},alpha_spaces:function(i){return"Laukelyje "+i+" leidžiamos tik raidės ir tarpai."},alpha:function(i){return"Laukelyje "+i+" leidžiamos tik raidės."},before:function(i,t){return i+" turi būti prieš "+t[0]+"."},between:function(i,t){return"Laukelio "+i+" reikšmė turi būti tarp "+t[0]+" ir "+t[1]+"."},confirmed:function(i){return"Laukelio "+i+" patvirtinimas nesutampa."},credit_card:function(i){return"Laukelis "+i+" neteisingas."},date_between:function(i,t){return"Laukelio "+i+" reikšmė turi būti tarp "+t[0]+" ir "+t[1]+"."},date_format:function(i,t){return"Laukelio "+i+" formatas privalo būti toks - "+t[0]+"."},decimal:function(i,t){void 0===t&&(t=["*"]);var e=t[0];return"Laukelis "+i+" turi būti skaitmuo su "+("*"===e?"":e)+" skaičium(-ias) po kablelio."},digits:function(i,t){return"Lauklio "+i+" reikšmė turi buti "+t[0]+" ženklų(-o) skaitmuo."},dimensions:function(i,t){return i+" turi būti "+t[0]+" px x "+t[1]+" px."},email:function(i){return"Laukelis "+i+" turi būti teisinga el. pašto adresas."},ext:function(i){return i+" turi būti tinkamas failas."},image:function(i){return i+" turi būti paveikslėlis."},in:function(i){return i+" reikšmė nėra leidžiama."},ip:function(i){return i+" turi būti ip adresas."},max:function(i,t){return i+" negali būti ilgesnis nei "+t[0]+"."},max_value:function(i,t){return i+" turi būti "+t[0]+" arba mažiau."},mimes:function(i){return i+" privalo turėti tinkmą failo tipą."},min:function(i,t){return i+" ilgis privalo būti bent "+t[0]+"."},min_value:function(i,t){return i+" turi būti "+t[0]+" arba daugiau."},not_in:function(i){return i+" reikšmė nėra leidžiama."},numeric:function(i){return i+" turi būti tik skaitmenys."},regex:function(i){return"Laukelio "+i+" formatas netinkamas."},required:function(i){return"Laukelis "+i+" privalomas."},size:function(t,e){var n=e[0];return t+" turi būti mažesnis nei "+i(n)+"."},url:function(i){return i+" turi būti internetinis adresas."}},attributes:{}};return function(i){var e=null;return"undefined"!=typeof window&&(e=window),"undefined"!=typeof global&&(e=global),!(!e||!t(i,e))}("VeeValidate.Validator")&&VeeValidate.Validator.addLocale(e),e});