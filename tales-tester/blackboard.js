const plainBlackboard = {};

/**
 * Read props and promises (with resolvers) will be returned and created if needed.
 * 
 * @type {{[K: string]: Promise<any> & {resolve(any) => void}}}
 */
export const blackboard = new Proxy(plainBlackboard, {
    get(target, property, receiver) {
        if (!Object.hasOwn(target, property)) {
            target[property] = deferred();
        }
        return target[property];
    },

    set(target, property, value, receiver) {
      // noop
      console.warn('[Blackboard] set');
    },

    deleteProperty(target, prop) {
      // noop
      console.warn('[Blackboard] deleteProperty');
    },

});

// Taken from https://deno.land/std@0.178.0/async/deferred.ts?source
function deferred() {
    let methods;
    let state = "pending";
    const promise = new Promise<T>((resolve, reject) => {
      methods = {
        async resolve(value) {
          await value;
          state = "fulfilled";
          resolve(value);
        },
        // deno-lint-ignore no-explicit-any
        reject(reason) {
          state = "rejected";
          reject(reason);
        },
      };
    });
    Object.defineProperty(promise, "state", { get: () => state });
    return Object.assign(promise, methods);
}
