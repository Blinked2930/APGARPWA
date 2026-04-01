Objective
To build a highly intuitive, Progressive Web App (PWA) for a home birth midwife to track delivery times and APGAR scores. The app must function flawlessly in high-pressure, unpredictable environments with zero clutter, large touch targets, and robust background stability.

Target User & Environment

User: Home birth midwife (and potentially assisting staff).

Environment: High stakes, potentially messy, varying lighting conditions (often dim), hands frequently occupied.

Device: Primarily iPhone, but must be device-agnostic (iOS/Android/Tablet) via PWA.

Core Features & User Flow

The Delivery Stopwatch:

A massive, highly visible stopwatch taking up the top half of the screen.

Audio Toggle: A single, prominent button to cycle through three states: Voice Readout (calls out time every 30s), Chime (dings every 30s), and Mute.

The "Body Out" Lap Marker:

A large, single-tap primary action button.

When tapped, it acts as a "lap" marker. It does not stop the delivery stopwatch (in case of accidental taps), but it records a timestamp of the exact moment it was pressed.

Tapping this button triggers the background APGAR timers (1-minute and 5-minute intervals).

APGAR Scoring Modal:

At the 1-minute and 5-minute marks, a modal overlay dims the main screen (keeping the stopwatch faintly visible).

The modal stays on screen indefinitely until completed.

Displays all 5 APGAR categories (Appearance, Pulse, Grimace, Activity, Respiration) on a single screen with large 0, 1, and 2 buttons.

Logs the exact time of entry alongside the target interval time.

Summary Screen:

A clean, post-birth dashboard displaying all recorded timestamps (Delivery time, Body Out time, 1-min APGAR time & score, 5-min APGAR time & score).

Used for manual transfer to official medical charts.

System Adapts:

UI automatically adapts to the device's native Light/Dark mode settings.