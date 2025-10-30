import { DependencyList, useEffect, useState } from 'react';
import { useDeepCompareEffect } from './useDeepCompareEffect';

export function useAsyncMemo<T>(factory: () => Promise<T> | undefined | null, deps: DependencyList, initial?: T): T | undefined {
  const [val, setVal] = useState<T | undefined>(initial);

  useEffect(() => {
    let cancel = false;
    const promise = factory();
    if (promise === undefined || promise === null)
      return () => {
        /* nop*/
      };

    promise.then((newVal) => {
      if (!cancel && newVal !== val) {
        setVal(newVal);
      }
    });

    return () => {
      cancel = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return val;
}

export function useAsyncDeepCompareMemo<T>(factory: () => Promise<T> | undefined | null, deps: DependencyList, initial?: T): T | undefined {
  const [val, setVal] = useState<T | undefined>(initial);

  useDeepCompareEffect(() => {
    let cancel = false;
    const promise = factory();
    if (promise === undefined || promise === null)
      return () => {
        /* nop*/
      };

    promise.then((newVal) => {
      if (!cancel && newVal !== val) {
        setVal(newVal);
      }
    });

    return () => {
      cancel = true;
    };
  }, deps);

  return val;
}
