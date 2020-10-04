import { debounceBound } from '../debounceBound';

// Tell jest to mock this import
jest.mock('lodash.debounce', () => (fn: (...arg: any) => any) => fn);

describe('debounceBound', () => {
  class A {
    @debounceBound(200)
    returnThis() {
      return this;
    }
    @debounceBound(200)
    callFn(fn: (...arg: any) => any) {
      fn();
    }
  }
  const a = new A();
  const b = new A();

  it('get memoization works', () => {
    expect(a.returnThis).toEqual(a.returnThis);
  });

  it('set works separate for each instances', () => {
    const c = new A();
    const bFn = b.returnThis;
    const cFn = c.returnThis;
    const that = new A();
    c.returnThis = function() {
      return that;
    };
    expect(c.returnThis).not.toBe(cFn);
    expect(cFn()).toBe(c);
    expect(c.returnThis()).toBe(that);
    expect(b.returnThis).toBe(bFn);
    expect(b.returnThis()).toBe(b);
  });

  it('binding works', () => {
    expect(a.returnThis !== b.returnThis).toEqual(true);
    expect(a.returnThis()).toBe(a);
    expect(b.returnThis()).toBe(b);
  });

  it('mutated call original function', () => {
    const spy = jest.fn();
    a.callFn(spy);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // debounce test is not this scope, we believe lodash
});
