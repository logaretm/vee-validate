## [Async Validation](#coupon-example)

Let's say you want to validate something specific to your app domain that isn't provided by the default validators, for example lets validate a user coupon on checkout. If it is a valid coupon then you discount it for him, if not he pays the full price :(


Here is a list of our valid coupons: `SUMMER2016`, `WINTER2016` and `FALL2016`.

Each of which gives 20% off. The process of validation is as follows: we take the input and send it to backend, the response should determine if the coupon is valid which is up to you. here I'm simulating async behavior using `setTimeout`.

`Vee-Validate` allows the usage of async validators, but it requires them to return a promise that resolves with an object containing the property `valid` which should equal a boolean state of the validation status.