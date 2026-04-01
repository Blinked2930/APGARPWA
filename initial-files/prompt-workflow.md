Use this sequence of tasks and prompts during your AI coding session to build the app logically.

Standard Operating Procedure for AI Generation:
Instruct the AI: "For this entire project, whenever we are editing an external code file, you must first ask me to copy and paste the current code for that file. Then, ALWAYS output the full, complete code file. Never output just a snippet or 'diff'. I will always replace the entire file with your new output."

Task 1: PWA Boilerplate & Wake Lock

Prompt: "Generate a boilerplate React PWA. Include a Web App Manifest for mobile installation. Implement the Screen Wake Lock API so the screen never sleeps while the app is active. Ensure the UI responds to system dark/light mode preferences."

Task 2: The Resilient Stopwatch & Audio Toggle

Prompt: "Build a large, high-contrast stopwatch component. It must use Date.now() and LocalStorage so it survives page reloads. Below it, add a massive toggle button that cycles between Mute, Web Speech API Voice Readout (every 30s), and an HTML5 Audio Chime (every 30s)."

Task 3: The "Body Out" Logic

Prompt: "Add a prominent 'Body Out' button. When clicked, it should NOT stop the main stopwatch. Instead, it pushes a timestamp to an array in LocalStorage, and initiates two invisible background countdowns: 1 minute and 5 minutes."

Task 4: The APGAR Modal

Prompt: "Create an APGAR scoring modal that triggers when the background timers hit 1 min and 5 min. It should overlay the screen but keep the stopwatch visible behind a dark tint. Include 5 rows (Appearance, Pulse, Grimace, Activity, Respiration) with large 0, 1, 2 buttons. It must record the exact time the user finishes the form."

Task 5: The Summary Screen

Prompt: "Build a summary view that the user can navigate to after the birth. It should cleanly list the total delivery time, all 'Body Out' timestamps, and the calculated APGAR scores with their precise entry times for easy medical charting."