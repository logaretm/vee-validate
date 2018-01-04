## [Event Bus](#event-bus-example)

There are situations where you need to 'transfer' or communicate errors from child components to their parent and vice versa. Although this is not related to the plugin, the need is common enough to require an example.  

This example uses Vue.js event bus to communicate errors with the parent component, the parent component can also clear, or force validate the child component. [Original example](https://gist.github.com/sproogen/147d75db261505e8a558a7fd11a20551) was created by [@sproogen](https://gist.github.com/sproogen).

There is a better approach introduced by using the [Provide/Inject API](advanced.html#injection).
