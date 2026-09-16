---
'vee-validate': patch
---

perf: skip the devtools watchers during server rendering

`useForm` and `useField` guard their devtools integration with `__DEV__` only. The `registerFormWithDevTools` and `registerSingleFieldWithDevtools` calls inside those blocks already bail out when there is no client, but the `refreshInspector` watchers next to them do not, so a non-production SSR build creates a deep watcher per form and per field on every request, feeding an inspector that cannot exist on the server. Both blocks now check `isClient` as well.
