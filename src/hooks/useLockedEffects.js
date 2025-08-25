import { useState, useCallback } from 'react';

export const useLockedEffects = () => {
  const [lockedEffects, setLockedEffects] = useState({});

  const toggleLock = useCallback((effectKey) => {
    setLockedEffects(prev => ({
      ...prev,
      [effectKey]: !prev[effectKey]
    }));
  }, []);

  const lockEffect = useCallback((effectKey) => {
    setLockedEffects(prev => ({
      ...prev,
      [effectKey]: true
    }));
  }, []);

  const unlockEffect = useCallback((effectKey) => {
    setLockedEffects(prev => ({
      ...prev,
      [effectKey]: false
    }));
  }, []);

  const unlockAll = useCallback(() => {
    setLockedEffects({});
  }, []);

  const lockAll = useCallback((effectKeys) => {
    const lockedState = {};
    effectKeys.forEach(key => {
      lockedState[key] = true;
    });
    setLockedEffects(lockedState);
  }, []);

  return {
    lockedEffects,
    toggleLock,
    lockEffect,
    unlockEffect,
    unlockAll,
    lockAll
  };
};