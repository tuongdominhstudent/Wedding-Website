import { useLayoutEffect, useRef } from 'react';
import { gsap } from './gsapConfig';

export function useGsapContext(setup, deps = []) {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    if (!scopeRef.current || typeof setup !== 'function') {
      return undefined;
    }

    const ctx = gsap.context(() => {
      setup();
    }, scopeRef);

    return () => {
      ctx.revert();
    };
  }, deps);

  return scopeRef;
}
