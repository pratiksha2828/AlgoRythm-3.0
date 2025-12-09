# AlgoRythm — Local Development

Quick notes for running the project locally.

Prereqs
- Node.js (v18+ recommended)
- npm
- MongoDB (or provide a MONGODB_URI; the server will continue in a degraded mode if not present)

Backend (server)
1. Open a terminal in `backend`:

```powershell
Set-Location 'C:\Users\prati\OneDrive\Desktop\a\Algo-test-reduced\Algo-test\backend'
npm install
node server.js
```

2. Required env variables in `backend/.env`:
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GITHUB_CALLBACK_URL
- MONGODB_URI (optional)
- SESSION_SECRET
- PORT (optional, default 5000)

Frontend
1. Build the frontend and serve via backend static files (recommended for parity with production):

```powershell
Set-Location 'C:\Users\prati\OneDrive\Desktop\a\Algo-test-reduced\Algo-test\frontend'
npm install
npm run build
```

2. The backend serves `frontend/dist` by default. After building, open http://localhost:5000/login

Troubleshooting
- If port 5000 is in use, identify the process and stop it:

```powershell
Get-NetTCPConnection -LocalPort 5000 | Format-List
Stop-Process -Id <PID>
```

- If you see client-side errors after rebuilding, clear the browser cache or open a new incognito window.

Developer notes
- A temporary token shim was added during debugging; ensure clients load the rebuilt bundle and then remove the shim by rebuilding and restarting the backend.

Contact
- Project owner: check repository metadata or project documentation.
