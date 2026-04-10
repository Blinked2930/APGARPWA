import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useWakeLock } from '../hooks/useWakeLock';
import { useOfflineSync } from '../hooks/useOfflineSync';

const AppContext = createContext();

const APGAR_CONFIG = {
  INTERVAL_1: 60000,
  INTERVAL_2: 300000,
};

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

  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('birthMilestones');
    return saved ? JSON.parse(saved) : { rom: null, crown: null, firstCry: null, placenta: null };
  });

  const [audioMode, setAudioMode] = useState(() => {
    return localStorage.getItem('audioMode') || 'VOICE';
  });

  const [manualModal, setManualModal] = useState(null);

  const { initAudio, playChime, speakTime } = useAudio();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { queueSession, syncError } = useOfflineSync();

  useEffect(() => { localStorage.setItem('audioMode', audioMode); }, [audioMode]);

  useEffect(() => {
    localStorage.setItem('birthMilestones', JSON.stringify(milestones));
  }, [milestones]);

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
    if (bodyOutTimes.length > 0) localStorage.setItem('bodyOutTimes', JSON.stringify(bodyOutTimes));
    else localStorage.removeItem('bodyOutTimes');
  }, [bodyOutTimes]);

  useEffect(() => {
    if (apgar1MinParams) localStorage.setItem('apgar1MinParams', JSON.stringify(apgar1MinParams));
    else localStorage.removeItem('apgar1MinParams');
  }, [apgar1MinParams]);

  useEffect(() => {
    if (apgar5MinParams) localStorage.setItem('apgar5MinParams', JSON.stringify(apgar5MinParams));
    else localStorage.removeItem('apgar5MinParams');
  }, [apgar5MinParams]);

  const toggleAudioMode = () => {
    initAudio();
    setAudioMode(prev => prev === 'MUTE' ? 'VOICE' : prev === 'VOICE' ? 'CHIME' : 'MUTE');
  };

  const toggleMilestone = (key) => {
    setMilestones(prev => ({
      ...prev,
      [key]: prev[key] ? null : Date.now()
    }));
  };

  const startDelivery = () => {
    initAudio();
    if (!deliveryStartTime) {
      setDeliveryStartTime(Date.now());
      setRecordedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  };

  // FIX: stopDelivery now takes a boolean. If true, it pushes everything to Convex!
  const stopDelivery = (saveToHistory = false) => {
    if (saveToHistory && deliveryStartTime) {
        queueSession({
            recordedTimeZone,
            deliveryStartTime,
            bodyOutTimes,
            apgar1MinParams,
            apgar5MinParams,
            milestones // Everything is captured!
        });
    }

    setDeliveryStartTime(null);
    setRecordedTimeZone(null);
    setBodyOutTimes([]);
    setApgar1MinParams(null);
    setApgar5MinParams(null);
    setMilestones({ rom: null, crown: null, firstCry: null, placenta: null }); 

    localStorage.removeItem('deliveryStartTime');
    localStorage.removeItem('recordedTimeZone');
    localStorage.removeItem('bodyOutTimes');
    localStorage.removeItem('apgar1MinParams');
    localStorage.removeItem('apgar5MinParams');
    localStorage.removeItem('birthMilestones');
  };

  const markBodyOut = () => {
    if (!deliveryStartTime) {
      setDeliveryStartTime(Date.now());
      setRecordedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
    setBodyOutTimes(prev => prev.length === 0 ? [Date.now()] : prev);
  };

  const saveApgarScore = (interval, scoreData) => {
    if (interval === 1) {
      setApgar1MinParams(scoreData);
    } else if (interval === 5) {
      setApgar5MinParams(scoreData);
      // FIX: Removed queueSession from here so it doesn't fire prematurely!
    }
  };

  const openApgarModal = (interval) => setManualModal(interval);
  const closeManualModal = () => setManualModal(null);

  return (
    <AppContext.Provider value={{
      APGAR_CONFIG, recordedTimeZone, deliveryStartTime, bodyOutTimes, apgar1MinParams,
      apgar5MinParams, audioMode, milestones, startDelivery, stopDelivery, markBodyOut,
      saveApgarScore, toggleAudioMode, toggleMilestone, playChime, speakTime, manualModal,
      openApgarModal, closeManualModal, syncError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);