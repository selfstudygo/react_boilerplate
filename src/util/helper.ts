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
    if (a === b) {
      // symbol included
      return true;
    }

    if (typeof a !== 'object' || typeof b !== 'object') {
      return a === b || isNaN(a) === isNaN(b);
    }

    if (a.constructor !== b.constructor) {
      return false;
    }

    if (a.constructor === Date) {
      return a.getTime() === b.getTime();
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const keySet = new Set([...aKeys, ...bKeys]);
    const setIter = keySet.entries();
    let isSame = true;
    let key = '';
    while ((key = setIter.next().value)) {
      if (!this.isEqual(a[key], b[key])) {
        isSame = false;
        break;
      }
    }
    return isSame;
  }
}

export const helper = new Helper();
