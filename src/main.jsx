import React from "react";
import { createRoot } from "react-dom/client";
import PeopleHubApp from "./PeopleHubApp.jsx";
import "./workspace.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PeopleHubApp />
  </React.StrictMode>,
);
