import {
  CacheCandidatePlugin,
  Hooks
} from '@jointly/cache-candidate-plugin-base';

export const PluginInvalidateFunction: CacheCandidatePlugin = {
  name: 'invalidate-function',
  hooks: [
    {
      hook: Hooks.INIT,
      action: async (payload, { invalidateFunction }) => {
        if (!invalidateFunction || typeof invalidateFunction !== 'function') {
          throw new Error(
            'invalidate-function plugin expects the following additional parameter: invalidateFunction'
          );
        }

        const toInvalidate = invalidateFunction(payload.fnArgs);

        if (typeof toInvalidate !== 'boolean') {
          throw new Error(
            `invalidateFunction should return a boolean value, received: ${typeof toInvalidate}`
          );
        }

        if (toInvalidate) {
          await payload.internals?.deleteDataCacheRecord({
            options: payload.options,
            key: payload.key,
            HookPayload: payload
          });
        }
      }
    }
  ]
};
