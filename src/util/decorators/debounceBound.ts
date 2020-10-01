import { debounce } from '@util/debounce';

export function debounceBound(time: number, option?: { leading?: boolean; trailing?: boolean }) {
  return function f(target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {
    let org = descriptor.value;
    return {
      configurable: false,
      get() {
        if (typeof org !== 'function' || this === target.prototype) {
          return org;
        }
        let bound = org.bind(this);
        let instanceValue = debounce(bound, time, option);
        Object.defineProperty(this, key, {
          enumerable: false,
          get() {
            return instanceValue;
          },
          set(v) {
            bound = v.bind(this);
            instanceValue = debounce(bound, time, option);
          },
        });
        return instanceValue;
      },
      set(v: Function) {
        org = v;
      },
    };
  };
}
