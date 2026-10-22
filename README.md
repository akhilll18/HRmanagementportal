# PeopleHub Employee Workspace

A responsive HR self-service portal prototype built with React, Vite and Lucide icons. The interface uses a compact shadcn-inspired visual language with a custom PeopleHub theme.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Workspace areas

- Overview with separate tap-in/tap-out controls, quick links and an upcoming-holiday card
- People directory with search, filters, employee details, onboarding and CSV export
- Organization chart with employee profiles and deletion; new departments can be created while onboarding an employee
- Learning library with browser-playable employee training videos and an admin upload form
- Attendance with a persisted timestamped history of every tap-in/tap-out and week selection
- Time-off requests, balance, status filters and cancellation
- Pay history with downloadable CSV summaries
- Growth goals and hiring pipeline
- Searchable policy and benefits documents
- HR support requests and status tracking

## Project layout

- `src/PeopleHubApp.jsx` owns navigation, demo state and workflows
- `src/theme.js` contains workspace and current-user configuration
- `src/data/peopleHubData.js` contains sample navigation and portal records
- `src/components/` contains the app shell, shared UI and action dialogs
- `src/pages/` contains overview, people, work and company pages
- `src/workspace.css` contains theme tokens, responsive layouts and component styles

This is a local frontend demo. Changes are stored in this browser using `localStorage`; training video uploads are limited to 2 MB total in this demo. There is no role-based access control, backend, payroll provider or real employee data connection, so the admin upload form is not permission-restricted. Downloaded documents are representative demo files.
