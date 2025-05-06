type CurryFunction<T extends unknown[], R> = T extends [infer A, ...infer Rest]
  ? (arg: A) => CurryFunction<Rest, R>
  : R;

export function curry<T extends unknown[], R>(fn: (...args: T) => R): CurryFunction<T, R> {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn(...(args as T));
    } else {
      return (...args2: unknown[]) => curried(...([...args, ...args2] as unknown[]));
    }
  } as CurryFunction<T, R>;
}
