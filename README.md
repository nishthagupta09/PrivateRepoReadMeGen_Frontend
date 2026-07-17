# PrivateRepoReadMeGen — Frontend

The React frontend for **AI README**, a tool that connects to a user's GitHub account and generates a `README.md` for any of their repositories (including private ones) using AI.

Live app: `https://repo-read-me-gen.vercel.app`
Backend API: [PrivateRepoReadMeGen](https://github.com/nishthagupta09/PrivateRepoReadMeGen) — deployed at `https://privatereporeadmegen.onrender.com`

## How It Works

1. The user clicks **Connect GitHub**, which redirects to the backend's GitHub OAuth2 flow.
2. After authorizing, GitHub redirects back to the app with a signed JWT in the URL (`?token=...`). The token and decoded GitHub username are stored in `localStorage`.
3. Once logged in, the app calls `GET /private-repo` on the backend (with the JWT as a Bearer token) to fetch the user's list of repositories and populate a dropdown.
4. The user selects a repository and clicks **Generate README**, which calls `POST /private-repo/{owner}/{repo}/generate-readme`.
5. The AI-generated README is displayed in a read-only text area, with a **Copy** button to copy it to the clipboard.

## Tech Stack

- **React 19** with **React Router v7**
- **Vite** (dev server / build tool), with `@vitejs/plugin-react`
- **Tailwind CSS 4** (via `@tailwindcss/vite`) for styling
- **Axios** for HTTP requests to the backend
- **ESLint** for linting

## Project Structure

```
src/
├── main.jsx        # App entry point, mounts <App /> into the DOM
├── App.jsx          # Router setup (single "/" route -> Home)
├── App.css / index.css
├── Pages/
│   └── Home.jsx     # Main page: GitHub login, repo selector, README generation & output
└── assets/
```

## Getting Started

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/nishthagupta09/PrivateRepoReadMeGen_Frontend.git
cd PrivateRepoReadMeGen_Frontend
npm install
npm run dev
```

The app runs locally via Vite's dev server (default `http://localhost:5173`).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Configuration

The backend API URL is currently hard-coded in `src/Pages/Home.jsx`:

```js
const API = "https://privatereporeadmegen.onrender.com";
```

Point this at your own backend deployment (or `http://localhost:8080` for local development) if you're running the [backend](https://github.com/nishthagupta09/PrivateRepoReadMeGen) yourself. The backend's CORS configuration must also allow whatever origin this app is served from.

## Notes

- Auth state (JWT + GitHub login) is stored in `localStorage`, not cookies or React context.
- There is currently no logout button — clearing `localStorage` (or the token expiring) is the only way to sign out.

## Future Improvements

- Move the API base URL into an environment variable (`import.meta.env`)
- Add a logout / re-authenticate action
- Loading and error states for repo fetching (currently just logged to the console)
- Markdown preview of the generated README, not just raw text
