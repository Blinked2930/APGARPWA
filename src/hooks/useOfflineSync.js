import { useEffect, useCallback } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useOfflineSync() {
  const saveSessionToCloud = useMutation(api.sessions.saveSession);

  const syncQueue = useCallback(async () => {
    if (!navigator.onLine) return;

    const queueStr = localStorage.getItem('offlineQueue');
    if (!queueStr) return;

    try {
      const queue = JSON.parse(queueStr);
      const remainingQueue = [];

      for (const session of queue) {
        try {
          await saveSessionToCloud(session);
        } catch (error) {
          console.error("Failed to sync session, keeping in queue", error);
          remainingQueue.push(session);
        }
      }

      if (remainingQueue.length > 0) {
        localStorage.setItem('offlineQueue', JSON.stringify(remainingQueue));
      } else {
        localStorage.removeItem('offlineQueue');
      }
    } catch (err) {
      console.error("Error reading offline queue", err);
    }
  }, [saveSessionToCloud]);

  useEffect(() => {
    // Initial sync
    syncQueue();

    // Listen to online events to trigger background sync
    window.addEventListener('online', syncQueue);
    return () => {
      window.removeEventListener('online', syncQueue);
    };
  }, [syncQueue]);

  const queueSession = useCallback((sessionData) => {
    const queueStr = localStorage.getItem('offlineQueue');
    const queue = queueStr ? JSON.parse(queueStr) : [];
    queue.push(sessionData);
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
    
    // Attempt sync immediately if possible
    syncQueue();
  }, [syncQueue]);

  return { queueSession, syncQueue };
}
