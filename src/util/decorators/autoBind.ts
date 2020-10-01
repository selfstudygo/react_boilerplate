export function autobind(target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {
  let org = descriptor.value;
  return {
    configurable: false,
    get() {
      if (typeof org !== 'function' || this === target.prototype) {
        return org;
      }
      let bound = org.bind(this);
      Object.defineProperty(this, key, {
        enumerable: false,
        get() {
          return bound;
        },
        set(v) {
          bound = v.bind(this);
        },
      });
      return bound;
    },
    set(v: Function) {
      org = v;
    },
  };
}
