Architecture

Type: Progressive Web App (PWA)

Frontend Framework: React.js, Vue.js, or plain HTML/CSS/Vanilla JS (React/Vue recommended for easier state management).

Styling: Tailwind CSS or standard CSS. Focus on vh and vw units to ensure buttons scale massively regardless of the screen size.

Key APIs & Libraries

Web App Manifest & Service Workers: Essential for PWA installation (Add to Home Screen) and offline functionality.

Screen Wake Lock API: (e.g., navigator.wakeLock.request('screen')) To absolutely prevent the phone from going to sleep while the stopwatch is running.

Page Visibility API & LocalStorage / IndexedDB: To save the exact Date.now() when timers start. If the app is minimized, swiped away, or the browser reloads, it calculates the time difference upon reopening so no data is lost.

Web Speech API (SpeechSynthesis): For the Voice Readout feature (calling out "thirty seconds," "one minute").

HTML5 Audio: For the simple chime sound effect.