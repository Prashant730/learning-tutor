# AI Tutoring Tool

A responsive, interactive learning platform that combines AI-powered chat, video sessions, and a progress-tracking dashboard. This lightweight front-end demo is built with HTML, CSS, and vanilla JavaScript and is designed to be easy to run locally or host on GitHub Pages.

---

**Repository:** https://github.com/Prashant730/learning-tutor

## Features

- AI-powered chat interface (simulated responses)
- Real-time video session UI with audio/video setup
- Dashboard with tasks, streak tracking, and progress visualization
- Responsive layout (mobile → desktop)
- Dark / light theme toggle with persistence (localStorage)

## Demo

Open `index.html` in your browser to view the landing page. Use the navigation to explore `login.html`, `dashboard.html`, `chat.html`, and `video.html`.

## File Structure

```
/ (project root)
│
├── index.html       # Landing page with hero section and features overview
├── login.html       # Authentication page with login and register forms
├── dashboard.html   # User dashboard for progress tracking and tasks
├── chat.html        # Chat interface with AI tutoring functionality
├── video.html       # Video call interface with setup and session screens
│
├── script.js        # JavaScript: theme toggle, nav highlighting, and UI interactions
├── styles.css       # Core stylesheet for layout, components, and responsive design
└── assets/          # (Optional) Directory for images, icons, or additional assets
```

## Installation & Local Setup

1. Clone the repository:

```bash
git clone https://github.com/Prashant730/learning-tutor.git
```

2. Change into the project directory:

```bash
cd learning-tutor
```

3. Open the app in your browser. You can open `index.html` directly, or serve it with a simple HTTP server (recommended for video/permission features):

```powershell
# Windows: using Python 3
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Usage

- `index.html` — Landing page and feature overview
- `login.html` — Demo login/register UI (simulated authentication)
- `dashboard.html` — Progress and task management UI
- `chat.html` — Simulated AI chat interface
- `video.html` — Video-call setup and session UI (for demo purposes)

Theme toggle: use the sun/moon button in the header to switch between light and dark modes; preference is saved to `localStorage`.

## Development

- Code is plain HTML/CSS/JS — no build step required.
- Edit files in your editor and reload the browser to see changes.
- If you add third-party packages, include a `package.json` and install dependencies.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request describing your changes

Please follow the existing code style and keep changes focused.

## License

This project is provided under the MIT License. See the `LICENSE` file for details (or add one if not present).

## Acknowledgments

- Design inspired by modern UI patterns
- Built as a front-end demo to showcase an AI tutoring UI

---

If you'd like, I can:

- Commit this README for you and push it to the provided GitHub repository (`https://github.com/Prashant730/learning-tutor.git`), or
- Just update the file locally and show you the git commands to push.

Which would you prefer?
