# Hello stack

A local FastAPI + React check for an interview laptop. The Vite app is the frontend. FastAPI is the backend. Open the page, ask the API, and the reply should show up in the backend card.

No deploy, no database, and no extra accounts.

## Run

You need Node.js 20 or newer, and Python 3.11 or newer. Both are already installed on this machine, and the dependencies are already installed in `frontend/node_modules` and `backend/.venv`.

```bash
npm run dev
```

That starts both processes:

- API: [http://127.0.0.1:8000](http://127.0.0.1:8000) (`GET /api/hello`, interactive docs at `/docs`)
- Web: [http://127.0.0.1:5173](http://127.0.0.1:5173)

You should see two cards. The frontend card already says `Hello from the frontend.` Choose **Ask the backend**. The backend card should say `Hello from the backend.`

Type a name and ask again. The card should change to `Hello, <name>. The backend is up.`

Check the API on its own:

```bash
curl -s http://127.0.0.1:8000/api/hello
curl -s "http://127.0.0.1:8000/api/hello?name=Ada"
```

The page calls `/api/hello` on the Vite dev server. Vite proxies that path to FastAPI, so the browser stays on port 5173.

## Where the code lives

| Piece | File |
| --- | --- |
| Frontend page | `frontend/src/App.tsx` |
| Vite proxy | `frontend/vite.config.ts` |
| Backend | `backend/app/main.py` |
| Python packages | `backend/requirements.txt` |

## Install again

Only needed on a new machine, or after deleting `node_modules` or `backend/.venv`.

```bash
npm install
npm install --prefix frontend
python3 -m venv backend/.venv
backend/.venv/bin/pip install -r backend/requirements.txt
```

## Before the interview

1. Share your **full screen** in Google Meet, and turn **Google Meet filters off**.
2. From this folder, run `npm run dev`, open [http://127.0.0.1:5173](http://127.0.0.1:5173), and choose **Ask the backend**.
3. `node -v` should print v20 or higher. `git --version` should print. `gh auth status` should show you logged in.
4. Cursor is already the editor for this folder. Stay signed in.
5. Use Chrome or Safari. Nothing in this project needs to be deployed.
