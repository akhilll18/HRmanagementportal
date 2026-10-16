import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, IconButton as MuiIconButton } from "@mui/material";
import { Check, X } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PortalShell from "./components/PortalShell.jsx";
import PortalDialog from "./components/PortalDialog.jsx";

import OverviewPage from "./pages/OverviewPage.jsx";
import PeoplePage from "./pages/PeoplePage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import TimeOffPage from "./pages/TimeOffPage.jsx";
import PayPage from "./pages/PayPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";

import {
  employees as employeeSeed,
  leaveRequests as leaveSeed,
  tickets as ticketSeed,
} from "./data/peopleHubData.js";

function load(key, fallback) {
  try {
    const value = localStorage.getItem(`peoplehub-${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function PeopleHubApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState("overview");
  const [people, setPeople] = useState(() => load("employees", employeeSeed));
  const [leaves, setLeaves] = useState(() => load("leaves", leaveSeed));
  const [supportTickets, setSupportTickets] = useState(() =>
    load("tickets", ticketSeed)
  );
  const [checkedIn, setCheckedIn] = useState(() => load("checked-in", false));
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Persist to localStorage
  useEffect(() => {
    const values = {
      employees: people,
      leaves,
      tickets: supportTickets,
      "checked-in": checkedIn,
    };
    for (const [key, value] of Object.entries(values)) {
      try {
        localStorage.setItem(`peoplehub-${key}`, JSON.stringify(value));
      } catch {
        /* Browser storage may be disabled. */
      }
    }
  }, [people, leaves, supportTickets, checkedIn]);

  // Auto-dismiss toast after 3.2s
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  // ── Dialog submission handler ───────────────────────
  function submitAction(type, values) {
    if (type === "employee") {
      const id = `EMP${String(people.length + 1).padStart(3, "0")}`;
      setPeople((current) => [
        ...current,
        {
          ...values,
          id,
          status: "Active",
          joined: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        },
      ]);
      setNotice(`${values.name} was added to the directory.`);
    } else if (type === "leave") {
      const start = new Date(`${values.start}T12:00:00`);
      const end = new Date(`${values.end}T12:00:00`);
      if (end < start) {
        setNotice("The end date must be on or after the start date.");
        return;
      }
      const dateOptions = { month: "short", day: "2-digit", year: "numeric" };
      const days = Math.round((end - start) / 86400000) + 1;
      setLeaves((current) => [
        {
          id: `LV-${205 + current.length}`,
          type: values.type,
          start: start.toLocaleDateString("en-US", dateOptions),
          end: end.toLocaleDateString("en-US", dateOptions),
          days,
          status: "Pending",
          requested: "Oct 12, 2026",
        },
        ...current,
      ]);
      setNotice("Your time-off request was submitted.");
    } else if (type === "ticket") {
      setSupportTickets((current) => [
        {
          id: `HR-${1025 + current.length}`,
          subject: values.subject,
          category: values.category,
          created: "Oct 12, 2026",
          status: "Open",
        },
        ...current,
      ]);
      setNotice("Your HR support request was created.");
    }
    setDialog(null);
  }

  // ── Clock toggle ────────────────────────────────────
  function toggleCheckIn() {
    setCheckedIn((value) => !value);
    setNotice(checkedIn ? "You are now clocked out." : "You are now clocked in.");
  }

  // ── Search jump ─────────────────────────────────────
  function searchPeople(query) {
    setSearchQuery(query);
    setPage("people");
  }

  // ── Logout ──────────────────────────────────────────
  function handleLogout() {
    try {
      localStorage.removeItem("peoplehub-auth");
    } catch {
      /* ignore */
    }
    navigate("/login", { replace: true });
  }

  // ── Page routing switch ─────────────────────────────
  let content;
  switch (page) {
    case "people":
      content = (
        <PeoplePage
          people={people}
          query={searchQuery}
          onAction={(type, data) => setDialog({ type, data })}
        />
      );
      break;
    case "attendance":
      content = <AttendancePage checkedIn={checkedIn} onToggle={toggleCheckIn} />;
      break;
    case "timeoff":
      content = (
        <TimeOffPage
          leaves={leaves}
          onAction={(type) => setDialog({ type })}
          onCancel={(id) => {
            setLeaves((items) =>
              items.map((item) =>
                item.id === id ? { ...item, status: "Cancelled" } : item
              )
            );
            setNotice("The request was cancelled.");
          }}
        />
      );
      break;
    case "pay":
      content = <PayPage />;
      break;
    case "documents":
      content = <DocumentsPage />;
      break;
    case "support":
      content = (
        <SupportPage
          tickets={supportTickets}
          onAction={(type) => setDialog({ type })}
        />
      );
      break;
    default:
      content = (
        <OverviewPage
          onNavigate={setPage}
          onAction={(type) => setDialog({ type })}
          checkedIn={checkedIn}
          onToggle={toggleCheckIn}
          employeeCount={people.length}
          pendingLeaves={leaves.filter((item) => item.status === "Pending").length}
        />
      );
  }

  return (
    <>
      <PortalShell
        page={page}
        onNavigate={setPage}
        onSearch={searchPeople}
        onProfile={() => setDialog({ type: "profile" })}
        onLogout={handleLogout}
      >
        {content}
      </PortalShell>

      <PortalDialog
        dialog={dialog}
        onClose={() => setDialog(null)}
        onSubmit={submitAction}
      />

      {notice && (
        <Box
          role="status"
          sx={{
            position: "fixed",
            right: 23,
            bottom: 22,
            zIndex: 1300,
            display: "flex",
            maxWidth: "min(420px, calc(100vw - 32px))",
            alignItems: "center",
            gap: 1.2,
            p: "11px 12px",
            border: "1px solid #dce8de",
            borderRadius: 1,
            background: "#fff",
            color: "#46534a",
            boxShadow: "0 9px 30px rgba(27,42,30,0.12)",
            fontSize: "0.65rem",
            animation: "toastIn 0.2s ease-out",
            "@keyframes toastIn": {
              from: { opacity: 0, transform: "translateY(7px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#e8f3e9",
              color: "#4a8256",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Check sx={{ fontSize: 15 }} />
          </Box>
          <span style={{ flex: 1 }}>{notice}</span>
          <MuiIconButton
            size="small"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
            sx={{ color: "#89948c", p: 0.3 }}
          >
            <X sx={{ fontSize: 15 }} />
          </MuiIconButton>
        </Box>
      )}
    </>
  );
}