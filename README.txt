TIMESTRIKE: MATH ARENA — OFFLINE PWA
====================================

This version is a Progressive Web App (PWA). It can be installed on a supported
Android phone/tablet from a secure HTTPS website such as GitHub Pages and can
continue working offline after the app shell has been cached.

FILES
-----
index.html       - game screens, PWA metadata, install support
style.css        - retro arcade responsive design
game.js          - questions, game logic, scoring, timers, multiplayer, power-ups
manifest.json    - app name, icon, theme and install settings
service-worker.js - offline cache and app-shell support
icons/           - 192x192 and 512x512 app icons

HOW TO PUBLISH AS AN OFFLINE INSTALLABLE APP
---------------------------------------------
1. Upload ALL files and the icons folder to the ROOT of a GitHub repository.
2. Make sure index.html is directly visible in the repository root.
3. Enable GitHub Pages using:
   Settings > Pages > Deploy from a branch > main > / (root) > Save
4. Wait for GitHub Pages to publish the site.
5. Open the HTTPS GitHub Pages URL on your Android phone.
6. Play the game once while online so the service worker can cache the app.
7. Use the browser's Install App / Add to Home Screen option, or use the
   📲 install button when the browser offers it.
8. Launch TimeStrike from the phone's home screen. It can then run offline.

IMPORTANT
---------
- Opening index.html directly from your phone's file manager is NOT the same
  as installing a PWA. Service workers require a secure website (HTTPS) or a
  local development server.
- GitHub Pages provides HTTPS, so it is a good free host for this project.
- The local leaderboard still uses browser localStorage and is stored on the
  device/browser where the game is played. It is not a shared online leaderboard.
- No PHP, XAMPP, MySQL, or internet connection is required during gameplay
  after the app shell has been cached.

FEATURES
--------
- Solo Campaign
- Local 2–3 player multiplayer
- Practice Lab
- Timed questions
- Two-strike multiplayer elimination
- Score, streak, best streak and accuracy
- 50/50, Time Freeze and Double Points power-ups
- Consequence messages after mistakes/timeouts
- Easy / Normal / Hard difficulty
- 10 / 20 / 30 second timer choices
- Local leaderboard
- Sound effects toggle
- Pause/resume
- Keyboard controls A-D, P, 1-3
- Responsive desktop/mobile layout
- PWA install support
- Offline app-shell caching
- Topics: Binary, Octal, Decimal, Hexadecimal, Counting, Probability,
  Boolean Algebra, Matrices, Proof Techniques
