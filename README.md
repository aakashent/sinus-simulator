# SinusSim

SinusSim is a GitHub Pages-compatible educational 3D anatomy explorer for the sinonasal cavity. It is designed for orientation, anatomy recognition, and safe understanding of relationships between key landmarks. It is **not** a surgical simulator and does not provide procedural guidance.

## Features

- Dark, responsive browser UI for desktop and iPad
- Endoscope-style Three.js viewport
- WASD movement, mouse look, Q/E vertical movement, adjustable FOV, and reset view
- Simplified colored placeholder geometry for:
  - Nasal septum
  - Inferior turbinate
  - Middle turbinate
  - Lateral nasal wall
  - Maxillary sinus region
- Semi-transparent caution regions for the orbit and skull base
- Toggleable labels that face the camera by staying screen-aligned
- Landmark quiz mode with scoring:
  - Correct answer: +10 points
  - Incorrect answer: −2 points

## How to run locally

No build step, npm install, or backend is required. The application uses vanilla HTML/CSS/JavaScript and loads Three.js from a CDN.

Because ES modules are used, serve the folder with any static web server instead of opening `index.html` directly from the filesystem:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Deploying with GitHub Pages

This repository is ready to run from GitHub Pages as static files.

1. Commit and push the repository to GitHub.
2. In the repository settings, open **Pages**.
3. Set the source to deploy from the main branch root, or use your preferred Pages branch.
4. Save the settings.

The application is intended to work immediately at:

```text
https://aakashent.github.io/sinus-simulator/
```

## Future directions

Future versions may add CT-derived models, more detailed anatomy, and additional educational modules. Those enhancements are intentionally not included in this initial static placeholder implementation.
