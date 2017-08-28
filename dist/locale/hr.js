!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e.__vee_validate_locale__hr=e.__vee_validate_locale__hr||{},e.__vee_validate_locale__hr.js=n())}(this,function(){"use strict";var e=function(e){var n=["Byte","KB","MB","GB","TB","PB","EB","ZB","YB"],i=0===(e=1024*Number(e))?0:Math.floor(Math.log(e)/Math.log(1024));return 1*(e/Math.pow(1024,i)).toFixed(2)+" "+n[i]},n=function(e,n){var i=n;return e.split(".").every(function(e){return!!Object.prototype.hasOwnProperty.call(i,e)&&(i=i[e],!0)})},i={name:"hr",messages:{_default:function(e){return"Vrijednost "+e+" ne valja."},after:function(e,n){return e+" mora biti poslje "+n[0]+"."},alpha_dash:function(e){return e+" može sadržavati alfanumeričke znakove kao i crtice i podvlake."},alpha_num:function(e){return e+" može sadržavati samo alfanumeričke znakove."},alpha_spaces:function(e){return e+" može sadržavati samo abecedne znakove kao i razmake."},alpha:function(e){return e+" može sadržavati samo abecedne znakove."},before:function(e,n){return e+" mora biti prije "+n[0]+"."},between:function(e,n){return e+" mora biti između "+n[0]+" i "+n[1]+"."},confirmed:function(e){return"Potvrda "+e+" ne odgovara."},credit_card:function(e){return e+" nije valjan."},date_between:function(e,n){return e+" mora biti između "+n[0]+" i "+n[1]+"."},date_format:function(e,n){return"The "+e+" mora biti u formatu "+n[0]+"."},decimal:function(e,n){void 0===n&&(n=["*"]);var i=n[0];return e+" mora biti numerički i može sadržavati "+("*"===i?"":i)+" decimalne bodove."},digits:function(e,n){return e+" mora biti numerički i točno sadrživati "+n[0]+" znamenke."},dimensions:function(e,n){return e+" mora biti "+n[0]+" piksela za "+n[1]+" piksela."},email:function(e){return e+" mora biti važeća e-pošta."},ext:function(e){return e+" mora biti važeća datoteka."},image:function(e){return e+" mora biti slika."},in:function(e){return"Vrijednost "+e+" mora biti važeća vrijednost."},ip:function(e){return e+" mora biti važeća IP adresa."},max:function(e,n){return e+" ne smije biti veći od "+n[0]+" znakova."},max_value:function(e,n){return"Vrijednost "+e+" mora biti "+n[0]+" ili manje."},mimes:function(e){return e+" mora imati valjanu vrstu datoteke."},min:function(e,n){return e+" mora biti barem "+n[0]+" znakova."},min_value:function(e,n){return"Vrijednost "+e+" mora biti "+n[0]+" ili više."},not_in:function(e){return"Vrijednost "+e+" mora biti važeća vrijednost."},numeric:function(e){return e+" može sadrživati samo numeričke znakove"},regex:function(e){return"Oblik "+e+" nije važeći."},required:function(e){return"Polje "+e+" je obavezno."},size:function(n,i){var a=i[0];return n+" mora biti manje od "+e(a)+"."},url:function(e){return e+" nije važeći URL."}},attributes:{}};return function(e){var i=null;return"undefined"!=typeof window&&(i=window),"undefined"!=typeof global&&(i=global),!(!i||!n(e,i))}("VeeValidate.Validator")&&VeeValidate.Validator.addLocale(i),i});