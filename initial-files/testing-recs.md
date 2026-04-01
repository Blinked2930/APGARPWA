o ensure this app is safe for a clinical environment, testing must go beyond just clicking buttons on a desktop.

Phase 1: State & Stability Testing (The "Chaos" Test)

Start the stopwatch, minimize the app, open three other memory-heavy apps, and return. Does the timer jump to the correct current time?

Start the APGAR sequence, lock the phone screen, wait 2 minutes, and unlock. Does the 1-minute modal immediately appear?

Refresh the browser window mid-timer. Does the state persist via LocalStorage?

Phase 2: Environment Simulation (UAT)

The "Messy Hands" Test: Can the user successfully hit the "Body Out" button using a knuckle or the side of their hand without accidentally hitting the audio toggle?

The Lighting Test: View the app in a pitch-black room (Dark Mode) and direct sunlight (Light Mode). Is the contrast high enough? Are the colors color-blind friendly?

Phase 3: Logic & Edge Case Testing

Tap the "Body Out" button three times in a row. Does the system record three distinct timestamps without crashing the APGAR sequence?

Leave the 1-minute APGAR modal open for 6 minutes. Does the 5-minute APGAR data queue up correctly behind it?