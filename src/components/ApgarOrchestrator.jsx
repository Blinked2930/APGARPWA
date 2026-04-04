import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppProvider';
import { ApgarModal } from './ApgarModal';

export const ApgarOrchestrator = () => {
    const { bodyOutTimes, apgar1MinParams, apgar5MinParams, manualModal, closeManualModal, APGAR_CONFIG } = useAppContext();
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

            // Trigger 1st modal based on CONFIG
            if (elapsed >= APGAR_CONFIG.INTERVAL_1 && !apgar1MinParams && currentModal !== 1) {
                if (!currentModal) {
                    setCurrentModal(1);
                }
            }

            // Trigger 2nd modal based on CONFIG
            if (elapsed >= APGAR_CONFIG.INTERVAL_2 && !apgar5MinParams && currentModal !== 5) {
                if (!currentModal) {
                    setCurrentModal(5);
                } else if (currentModal === 1 && apgar1MinParams) {
                    setCurrentModal(5);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [bodyOutTimes, apgar1MinParams, apgar5MinParams, currentModal, APGAR_CONFIG]);

    // Handle immediate update when a modal closes and the next is queued
    useEffect(() => {
        if (!currentModal && bodyOutTimes.length > 0) {
            const elapsed = Date.now() - bodyOutTimes[0];
            if (elapsed >= APGAR_CONFIG.INTERVAL_1 && elapsed < APGAR_CONFIG.INTERVAL_2 && !apgar1MinParams) {
                setCurrentModal(1);
            } else if (elapsed >= APGAR_CONFIG.INTERVAL_2 && !apgar5MinParams) {
                if (apgar1MinParams) setCurrentModal(5);
                if (!apgar1MinParams) setCurrentModal(1);
            }
        }
    }, [currentModal, bodyOutTimes, apgar1MinParams, apgar5MinParams, APGAR_CONFIG]);

    if (manualModal) {
        return <ApgarModal interval={manualModal} onClose={closeManualModal} />;
    }

    if (!currentModal) return null;

    return <ApgarModal interval={currentModal} onClose={() => setCurrentModal(null)} />;
};