# PeopleHub Employee Workspace

A responsive HR self-service portal prototype built with React, Vite and Lucide icons. The interface uses a compact shadcn-inspired visual language with a custom PeopleHub theme.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Workspace areas

- Overview with attendance snapshot, quick links and announcements
- People directory with search, filters, profile details and CSV export
- Attendance with clock in/out and week selection
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

This is a local frontend demo. Changes are stored in this browser using `localStorage`; there is no authentication, backend, payroll provider or real employee data connection. Downloaded documents are representative demo files.
