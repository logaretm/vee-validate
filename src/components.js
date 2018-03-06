export const ErrorComponent = {
  name: 'vv-error',
  inject: ['$validator'],
  functional: true,
  props: {
    for: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: 'span'
    }
  },
  render (createElement, { props, injections }) {
    return createElement(props.tag, injections.$validator.errors.first(props.for));
  }
};
