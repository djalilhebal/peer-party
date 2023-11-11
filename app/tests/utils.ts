export const withResolvers = <T>() => {
    let res: (value: T | PromiseLike<T>) => void, rej: (reason?: any) => void;
    const p = new Promise<T>((resolve, reject) => {
        res = resolve;
        rej = reject;
    }) as any;
    //@ts-ignore
    p.resolve = res;
    //@ts-ignore
    p.reject = rej;

    return p as Promise<T> & { resolve: typeof res, reject: typeof rej };
}

export const withTimeout = (millis: number, promise: Promise<any>) => {
    const timeout = new Promise((_resolve, reject) => {
        setTimeout(() => reject('timeout'), millis);
    });

    return Promise.race([
        promise,
        timeout
    ]);
};
