interface DebounceOption {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export function debounce(func: Function, wait: number, options: DebounceOption = {}) {
  let lastArgs: Nullable<ArrayLike<any>> = null;
  let lastThis: any;
  let lastInvokeTime = 0;
  let result: any;
  let timerId: ReturnType<typeof setTimeout>;
  let lastCallTime = 0;

  if (typeof func != 'function') {
    throw new TypeError('should be function');
  }
  const leading = options.leading || false;
  const trailing = options.trailing || false;
  const maxing = Boolean(options.maxWait);
  const maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : 0;

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time: number) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return Boolean(
      lastCallTime === 0 ||
        timeSinceLastCall >= wait ||
        timeSinceLastCall < 0 ||
        (maxing && timeSinceLastInvoke >= maxWait),
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timerId = 0;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    lastThis = null;
    return result;
  }

  function cancel() {
    if (timerId !== 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastThis = null;
    lastCallTime = 0;
    timerId = 0;
  }

  function flush() {
    return timerId === 0 ? result : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: any[]) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

export function throttle(
  func: Function,
  wait: number,
  options: Omit<DebounceOption, 'maxWait'> = {},
) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  const leading = options.leading;
  const trailing = options.trailing;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}
