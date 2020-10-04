import isEqual from 'lodash.isequal';

class Helper {
  isObject(t: any): boolean {
    return t !== null && typeof t === 'object' && !Array.isArray(t);
  }
  isNum(t: any, includeNan = false): boolean {
    return Boolean(typeof t === 'number' && (includeNan || !isNaN(t)));
  }
  isFunc(t: any): boolean {
    return typeof t === 'function';
  }
  isArray(t: any): boolean {
    return Array.isArray(t);
  }
  isIterable(t: any) {
    return Boolean(t) && typeof t[Symbol.iterator] === 'function';
  }
  isEqual(a: any, b: any): boolean {
    return isEqual(a, b);
  }
}

export const helper = new Helper();
