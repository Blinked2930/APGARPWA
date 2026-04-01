import { useState, useCallback, useEffect } from 'react';

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState(null);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        
        lock.addEventListener('release', () => {
          console.log('Wake Lock was released');
        });
        console.log('Wake Lock is active');
      }
    } catch (err) {
      console.error(`WakeLock error: ${err.name}, ${err.message}`);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock !== null) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [wakeLock, requestWakeLock]);

  return { requestWakeLock, releaseWakeLock };
}
