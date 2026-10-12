import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import PortalShell from "./components/PortalShell.jsx";
import PortalDialog from "./components/PortalDialog.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import PeoplePage from "./pages/PeoplePage.jsx";
import { AttendancePage, TimeOffPage, PayPage } from "./pages/WorkPages.jsx";
import { GrowthPage, HiringPage, DocumentsPage, SupportPage } from "./pages/CompanyPages.jsx";
import { employees as employeeSeed, goals as goalSeed, leaveRequests as leaveSeed, roles as roleSeed, tickets as ticketSeed } from "./data/peopleHubData.js";
import { theme } from "./theme.js";

function load(key, fallback) {
  try { const value = localStorage.getItem(`peoplehub-${key}`); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export default function PeopleHubApp() {
  const [page, setPage] = useState("overview");
  const [people, setPeople] = useState(() => load("employees", employeeSeed));
  const [leaves, setLeaves] = useState(() => load("leaves", leaveSeed));
  const [supportTickets, setSupportTickets] = useState(() => load("tickets", ticketSeed));
  const [goals, setGoals] = useState(() => load("goals", goalSeed));
  const [roles, setRoles] = useState(() => load("roles", roleSeed));
  const [checkedIn, setCheckedIn] = useState(() => load("checked-in", false));
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const values = { employees: people, leaves, tickets: supportTickets, goals, roles, "checked-in": checkedIn };
    for (const [key, value] of Object.entries(values)) {
      try { localStorage.setItem(`peoplehub-${key}`, JSON.stringify(value)); } catch { /* Browser storage may be disabled. */ }
    }
  }, [people, leaves, supportTickets, goals, roles, checkedIn]);
  useEffect(() => { if (!notice) return undefined; const timer = setTimeout(() => setNotice(""), 3200); return () => clearTimeout(timer); }, [notice]);

  function submitAction(type, values) {
    if (type === "employee") {
      const id = `EMP${String(people.length + 1).padStart(3, "0")}`;
      setPeople((current) => [...current, { ...values, id, status: "Active", joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) }]);
      setNotice(`${values.name} was added to the directory.`);
    } else if (type === "leave") {
      const start = new Date(`${values.start}T12:00:00`); const end = new Date(`${values.end}T12:00:00`);
      if (end < start) { setNotice("The end date must be on or after the start date."); return; }
      const dateOptions = { month: "short", day: "2-digit", year: "numeric" };
      const days = Math.round((end - start) / 86400000) + 1;
      setLeaves((current) => [{ id: `LV-${205 + current.length}`, type: values.type, start: start.toLocaleDateString("en-US", dateOptions), end: end.toLocaleDateString("en-US", dateOptions), days, status: "Pending", requested: "Oct 12, 2026" }, ...current]);
      setNotice("Your time-off request was submitted.");
    } else if (type === "ticket") {
      setSupportTickets((current) => [{ id: `HR-${1025 + current.length}`, subject: values.subject, category: values.category, created: "Oct 12, 2026", status: "Open" }, ...current]);
      setNotice("Your HR support request was created.");
    } else if (type === "role") {
      setRoles((current) => [...current, { ...values, candidates: 0, stage: "Sourcing" }]); setNotice("The new role was added to the hiring pipeline.");
    } else if (type === "goal") {
      setGoals((current) => [...current, { ...values, due: values.due || "Dec 31, 2026", progress: 0 }]); setNotice("Your goal was added.");
    }
    setDialog(null);
  }

  function toggleCheckIn() { setCheckedIn((value) => !value); setNotice(checkedIn ? "You are now clocked out." : "You are now clocked in."); }
  function searchPeople(query) { setSearchQuery(query); setPage("people"); }

  let content;
  switch (page) {
    case "people": content = <PeoplePage people={people} query={searchQuery} onAction={(type, data) => setDialog({ type, data })} />; break;
    case "attendance": content = <AttendancePage checkedIn={checkedIn} onToggle={toggleCheckIn} />; break;
    case "timeoff": content = <TimeOffPage leaves={leaves} onAction={(type) => setDialog({ type })} onCancel={(id) => { setLeaves((items) => items.map((item) => item.id === id ? { ...item, status: "Cancelled" } : item)); setNotice("The request was cancelled."); }} />; break;
    case "pay": content = <PayPage />; break;
    case "growth": content = <GrowthPage goals={goals} onAction={(type) => setDialog({ type })} />; break;
    case "hiring": content = <HiringPage roles={roles} onAction={(type) => setDialog({ type })} />; break;
    case "documents": content = <DocumentsPage />; break;
    case "support": content = <SupportPage tickets={supportTickets} onAction={(type) => setDialog({ type })} />; break;
    default: content = <OverviewPage onNavigate={setPage} onAction={(type) => setDialog({ type })} checkedIn={checkedIn} onToggle={toggleCheckIn} employeeCount={people.length} pendingLeaves={leaves.filter((item) => item.status === "Pending").length} />;
  }

  return <><PortalShell page={page} onNavigate={setPage} onSearch={searchPeople} onProfile={() => setDialog({ type: "profile" })}>{content}</PortalShell><PortalDialog dialog={dialog} onClose={() => setDialog(null)} onSubmit={submitAction} />{notice && <div className="toast" role="status"><span><Check size={15} /></span>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15} /></button></div>}</>;
}