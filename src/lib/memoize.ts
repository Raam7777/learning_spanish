export const memoize = <T>(factory: () => T): (() => T) => {
  const cache: { value?: T; ready: boolean } = { ready: false };
  return () => {
    if (!cache.ready) {
      Object.assign(cache, { value: factory(), ready: true });
    }
    return cache.value as T;
  };
};
