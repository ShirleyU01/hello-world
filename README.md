# Hello stack

A local full-stack check for an interview laptop. The page is the frontend. `GET /api/hello` is the backend. Open the app, and the page asks the API, then prints the reply.

No deploy, no database, and no extra accounts.

## Run

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

You should see two cards. The frontend card already says `Hello from the frontend.` The backend card waits until you ask.

Choose **Ask the backend**. The backend card should say `Hello from the backend.` and show the Node version, the round trip, and the time of the reply.

Type a name and ask again. The card should change to `Hello, <name>. The backend is up.` **Show the error state** hits a route that does not exist, so you can see the failure UI, then recover with **Try the backend again**.

Check the API on its own:

```bash
curl -s http://127.0.0.1:43123/api/hello
curl -s "http://127.0.0.1:43123/api/hello?name=Ada"
```

## Where the code lives

| Piece | File |
| --- | --- |
| Frontend page | `src/app/page.tsx` |
| Backend | `src/app/api/hello/route.ts` |
| Greeting | `src/lib/hello.ts` |

The stack is Next.js, React, TypeScript, and Tailwind.

## Before the interview

This repo is the hello-world the brief asks you to confirm. On the computer you will actually share:

1. Share your **full screen** in Google Meet, and turn **Google Meet filters off**, or they will not be able to proceed.
2. From this folder, run `npm run dev`, load the page, and choose **Ask the backend**. Both cards should say hello before you join.
3. Node.js 20+, Git, and a GitHub account signed in on that terminal. `node -v` should print v20 or higher. `git --version` should print. If you use the GitHub CLI, `gh auth status` should succeed.
4. Cursor, Claude Code, Codex, or Copilot installed and signed in. You will be expected to use it.
5. A current Chrome, Safari, or Firefox, and a stable connection.

Nothing in this project needs to be deployed.
