import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppProvider';
import { ApgarModal } from './ApgarModal';

export const ApgarOrchestrator = () => {
    const { bodyOutTimes, apgar1MinParams, apgar5MinParams, playChime, manualModal, closeManualModal } = useAppContext();
    const [currentModal, setCurrentModal] = useState(null); // 1 or 5

    useEffect(() => {
        if (bodyOutTimes.length === 0) {
            setCurrentModal(null);
            return;
        }
        const firstBodyOut = bodyOutTimes[0];

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - firstBodyOut;

            // Trigger 1 minute modal at 60s
            if (elapsed >= 60000 && !apgar1MinParams && currentModal !== 1) {
                if (!currentModal) {
                    playChime();
                    setCurrentModal(1);
                }
            }

            // Trigger 5 minute modal at 300s
            // "Leave the 1-minute APGAR modal open for 6 minutes. Does the 5-minute APGAR data queue up correctly behind it?"
            if (elapsed >= 300000 && !apgar5MinParams && currentModal !== 5) {
                if (!currentModal) {
                    playChime();
                    setCurrentModal(5);
                } else if (currentModal === 1 && apgar1MinParams) {
                    playChime();
                    setCurrentModal(5);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [bodyOutTimes, apgar1MinParams, apgar5MinParams, currentModal]);

    // Handle immediate update when a modal closes and the next is queued
    useEffect(() => {
        if (!currentModal && bodyOutTimes.length > 0) {
            const elapsed = Date.now() - bodyOutTimes[0];
            if (elapsed >= 60000 && elapsed < 300000 && !apgar1MinParams) {
                setCurrentModal(1);
            } else if (elapsed >= 300000 && !apgar5MinParams) {
                if (apgar1MinParams) setCurrentModal(5);
                // In case 1-min not done and we passed 5 min, we still show 1 min first.
                // Let the setInterval catch 5 min after 1 min completes.
                if (!apgar1MinParams) setCurrentModal(1);
            }
        }
    }, [currentModal, bodyOutTimes, apgar1MinParams, apgar5MinParams]);

    if (manualModal) {
        return <ApgarModal interval={manualModal} onClose={closeManualModal} />;
    }

    if (!currentModal) return null;

    return <ApgarModal interval={currentModal} onClose={() => setCurrentModal(null)} />;
};
