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

      for (let session of queue) {
        try {
          // Sanitize nulls that might trip up strict database rules
          if (session.recordedTimeZone === null) delete session.recordedTimeZone;

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
    syncQueue();
    window.addEventListener('online', syncQueue);
    return () => window.removeEventListener('online', syncQueue);
  }, [syncQueue]);

  const queueSession = useCallback((sessionData) => {
    const queueStr = localStorage.getItem('offlineQueue');
    const queue = queueStr ? JSON.parse(queueStr) : [];

    // CRITICAL FIX: If this session is already in the queue, update it instead of pushing a duplicate
    const existingIndex = queue.findIndex(s => s.deliveryStartTime === sessionData.deliveryStartTime);
    if (existingIndex >= 0) {
      queue[existingIndex] = sessionData;
    } else {
      queue.push(sessionData);
    }

    localStorage.setItem('offlineQueue', JSON.stringify(queue));
    syncQueue();
  }, [syncQueue]);

  return { queueSession, syncQueue };
}