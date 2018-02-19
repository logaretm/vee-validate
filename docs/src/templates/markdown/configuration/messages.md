
## [Custom Messages](#custom-messages)

You might need to overwrite the error messages, or add new ones. The Validator class and its instances provide a `localize` method, which will merge the messages with the internal dictionary, overwriting any duplicates.

> Any merges will have an effect on all validator instances as the messages dictionary is shared.

```js
import { Validator } from 'vee-validate';
const dictionary = {
  en: {
    messages:{
      alpha: () => 'Some English Message'
    }
  },
  ar: {
    messages: {
      alpha: () => 'Some Arabic Message'
    }
  }
};

// Override and merge the dictionaries
Validator.localize(dictionary);

const validator = new Validator({ first_name: 'alpha' });

validator.localize('ar'); // now this validator will generate messages in Arabic.
```

> You must provide the messages in an object path like: `dictionary.locale.messages`.

Usually, you would structure your language files for your app rather than adding hardcoded strings like the example above, check the [localization guide](localization.html) for more info.
