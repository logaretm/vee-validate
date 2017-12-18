<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <span :class="{ 'discounted': discounted }">Price: {{ price }}$</span>
            <span v-show="discounted" class="SeemsGood">{{ discountedPrice }}$</span>
        </div>
        <form @submit.prevent="applyCoupon" class="column is-12">
            <label class="label">Coupon</label>
            <p class="control has-icon has-icon-right">
                <input v-model="coupon" name="coupon" :class="{'input': true, 'is-danger': errors.has('coupon') }" type="text" placeholder="Enter Your Coupon">
                <i v-show="errors.has('coupon')" class="fa fa-warning"></i>
                <span v-show="errors.has('coupon')" class="help is-danger">{{ errors.first('coupon') }}</span>
            </p>

            <p class="control">
                <button type="submit" class="button is-primary" name="button">Apply</button>
            </p>
        </form>
    </div>
</template>

<script>
import { Validator } from 'vee-validate';

export default {
  name: 'coupon-example',
  data: () => ({
    coupon: '',
    price: 100,
    discounted: false
  }),
  computed: {
    discountedPrice() {
      return this.discounted ? this.price - (0.2 * this.price) : this.price;
    }
  },
  methods: {
    applyCoupon() {
      this.$validator.validate('coupon', this.coupon).then((result) => {
        this.discounted = result;
      });
    }
  },
  created() {
    Validator.extend('verify_coupon', {
      getMessage: field => `The ${field} is not a valid coupon.`,
      validate: value => new Promise((resolve) => {
        // API call or database access.
        const validCoupons = ['SUMMER2016', 'WINTER2016', 'FALL2016'];

        setTimeout(() => {
          resolve({
            valid: value && validCoupons.indexOf(value.toUpperCase()) !== -1
          });
        }, 500);
      })
    });
    this.$validator.attach({
      name: 'coupon',
      rules: 'required|verify_coupon'
    });
  }
};
</script>


<style lang="stylus">
.discounted
    text-decoration: line-through
.SeemsGood
    color: #41b883
</style>
