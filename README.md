# What is this?

This is a plugin for [@jointly/cache-candidate](https://github.com/JointlyTech/cache-candidate) providing an invalidation mechanism under specific conditions.

## How To Install?

```bash
$ npm install @jointly/cache-candidate-plugin-invalidate-function
```

## How To Use It?

The library exposes a `PluginInvalidateFunction` object that can be used as a plugin for the `cacheCandidate` library.


```typescript
import { cacheCandidate } from '@jointly/cache-candidate';
import { PluginInvalidateFunction } from '@jointly/cache-candidate-plugin-invalidate-function';

async function getUsers(filters) {
  // Do something
  return users;
}

const cachedGetUsers = cacheCandidate(getUsers, {
  requestsThreshold: 1,
  plugins: [
      {
        name: PluginInvalidateFunction.name,
        hooks: PluginInvalidateFunction.hooks,
        // ...PluginInvalidateFunction would do the same
        additionalParameters: { invalidateFunction: (fnArgs) => {
          let shouldInvalidate = executeQueryToDetermineIfCacheShouldBeInvalidated();
          return shouldInvalidate;
        } } // <-- This will invalidate the cache record if the amount of filters passed to the method is greater than 1
      }
    ]
});

let users;
users = await cachedGetUsers(); // <-- This will be executed and cached.
// Here something happens so that executeQueryToDetermineIfCacheShouldBeInvalidated returns true
users = await cachedGetUsers(); // <-- This will be firstly invalidated, then executed and cached again.
```

You must pass an additional parameter `invalidateFunction` property which instructs the plugin about when to invalidate the cache record.
This property must be a synchronous function that receives the arguments passed to the method on which the `cacheCandidate` operates and returns a boolean value.  
If the function returns `true`, the cache record will be invalidated and the cacheCandidate will continue its normal execution.