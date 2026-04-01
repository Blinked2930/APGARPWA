import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useWakeLock } from '../hooks/useWakeLock';
import { useOfflineSync } from '../hooks/useOfflineSync';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [deliveryStartTime, setDeliveryStartTime] = useState(() => {
    const saved = localStorage.getItem('deliveryStartTime');
    return saved ? parseInt(saved, 10) : null;
  });

  const [recordedTimeZone, setRecordedTimeZone] = useState(() => {
    return localStorage.getItem('recordedTimeZone') || null;
  });

  const [bodyOutTimes, setBodyOutTimes] = useState(() => {
    const saved = localStorage.getItem('bodyOutTimes');
    return saved ? JSON.parse(saved) : [];
  });

  const [apgar1MinParams, setApgar1MinParams] = useState(() => {
    const saved = localStorage.getItem('apgar1MinParams');
    return saved ? JSON.parse(saved) : null;
  });

  const [apgar5MinParams, setApgar5MinParams] = useState(() => {
    const saved = localStorage.getItem('apgar5MinParams');
    return saved ? JSON.parse(saved) : null;
  });

  const [audioMode, setAudioMode] = useState(() => {
    return localStorage.getItem('audioMode') || 'VOICE'; // Default to VOICE
  });

  const [manualModal, setManualModal] = useState(null);

  const { playChime, speakTime } = useAudio();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { queueSession } = useOfflineSync();

  useEffect(() => {
    localStorage.setItem('audioMode', audioMode);
  }, [audioMode]);

  useEffect(() => {
    if (deliveryStartTime) {
      localStorage.setItem('deliveryStartTime', deliveryStartTime.toString());
      if (recordedTimeZone) localStorage.setItem('recordedTimeZone', recordedTimeZone);
      requestWakeLock();
    } else {
      localStorage.removeItem('deliveryStartTime');
      localStorage.removeItem('recordedTimeZone');
      releaseWakeLock();
    }
  }, [deliveryStartTime, recordedTimeZone, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    localStorage.setItem('bodyOutTimes', JSON.stringify(bodyOutTimes));
  }, [bodyOutTimes]);

  useEffect(() => {
    localStorage.setItem('apgar1MinParams', JSON.stringify(apgar1MinParams));
  }, [apgar1MinParams]);

  useEffect(() => {
    localStorage.setItem('apgar5MinParams', JSON.stringify(apgar5MinParams));
  }, [apgar5MinParams]);

  const toggleAudioMode = () => {
    setAudioMode(prev => {
      if (prev === 'MUTE') return 'VOICE';
      if (prev === 'VOICE') return 'CHIME';
      return 'MUTE';
    });
  };

  const startDelivery = () => {
    if (!deliveryStartTime) {
      setDeliveryStartTime(Date.now());
      setRecordedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  };

  const stopDelivery = () => {
    setDeliveryStartTime(null);
    setRecordedTimeZone(null);
    setBodyOutTimes([]);
    setApgar1MinParams(null);
    setApgar5MinParams(null);
    localStorage.removeItem('deliveryStartTime');
    localStorage.removeItem('recordedTimeZone');
    localStorage.removeItem('bodyOutTimes');
    localStorage.removeItem('apgar1MinParams');
    localStorage.removeItem('apgar5MinParams');
  };

  const markBodyOut = () => {
    if (!deliveryStartTime) {
      setDeliveryStartTime(Date.now());
      setRecordedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
    setBodyOutTimes(prev => {
      if (prev.length === 0) return [Date.now()];
      return prev;
    });
  };

  const saveApgarScore = (interval, scoreData) => {
    if (interval === 1) {
      setApgar1MinParams(scoreData);
    } else if (interval === 5) {
      setApgar5MinParams(scoreData);
      // Auto queue the session for backup when 5min is finished!
      queueSession({
        recordedTimeZone,
        deliveryStartTime,
        bodyOutTimes,
        apgar1MinParams,
        apgar5MinParams: scoreData
      });
    }
  };

  const openApgarModal = (interval) => setManualModal(interval);
  const closeManualModal = () => setManualModal(null);

  return (
    <AppContext.Provider value={{
      recordedTimeZone,
      deliveryStartTime,
      bodyOutTimes,
      apgar1MinParams,
      apgar5MinParams,
      audioMode,
      startDelivery,
      stopDelivery,
      markBodyOut,
      saveApgarScore,
      toggleAudioMode,
      playChime,
      speakTime,
      manualModal,
      openApgarModal,
      closeManualModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
