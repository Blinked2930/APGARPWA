import { useEffect, useCallback, useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useOfflineSync() {
  const saveSessionToCloud = useMutation(api.sessions.saveSession);
  const [syncError, setSyncError] = useState(null);

  const syncQueue = useCallback(async () => {
    if (!navigator.onLine) return;

    const queueStr = localStorage.getItem('offlineQueue');
    if (!queueStr) {
      setSyncError(null);
      return;
    }

    try {
      const queue = JSON.parse(queueStr);
      const remainingQueue = [];
      let lastError = null;

      for (let session of queue) {
        try {
          // Prepare a clean payload
          const payload = { ...session };
          delete payload._id;
          delete payload._creationTime;

          // Scrub explicit nulls to satisfy strict database schemas
          Object.keys(payload).forEach(key => {
            if (payload[key] === null || payload[key] === undefined) {
              delete payload[key];
            }
          });

          await saveSessionToCloud(payload);
        } catch (error) {
          console.error("Failed to sync session", error);
          lastError = error.message || String(error);
          remainingQueue.push(session);
        }
      }

      if (remainingQueue.length > 0) {
        localStorage.setItem('offlineQueue', JSON.stringify(remainingQueue));
        setSyncError(lastError); // Expose the exact DB error to the UI
      } else {
        localStorage.removeItem('offlineQueue');
        setSyncError(null);
      }
    } catch (err) {
      setSyncError("Queue parse error");
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

    const existingIndex = queue.findIndex(s => s.deliveryStartTime === sessionData.deliveryStartTime);
    if (existingIndex >= 0) {
      queue[existingIndex] = sessionData;
    } else {
      queue.push(sessionData);
    }

    localStorage.setItem('offlineQueue', JSON.stringify(queue));
    syncQueue();
  }, [syncQueue]);

  return { queueSession, syncQueue, syncError };
}