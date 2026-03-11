import { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';

export function useLenis(onScroll) {
  const lenisInstance = useAppStore((state) => state.lenisInstance);

  useEffect(() => {
    if (!lenisInstance || typeof onScroll !== 'function') {
      return undefined;
    }

    lenisInstance.on('scroll', onScroll);

    return () => {
      lenisInstance.off('scroll', onScroll);
    };
  }, [lenisInstance, onScroll]);

  return lenisInstance;
}
