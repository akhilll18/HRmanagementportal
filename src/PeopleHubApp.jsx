import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Stack, IconButton as MuiIconButton } from "@mui/material";
import { Check, Close as X } from "@mui/icons-material";
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
import OrganizationPage from "./pages/OrganizationPage.jsx";
import LearningPage from "./pages/LearningPage.jsx";

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

function loadAttendanceRecords() {
  const savedRecords = load("attendance-records", null);
  if (Array.isArray(savedRecords)) return savedRecords;
  const clockInAt = load("clock-in-at", null);
  const clockOutAt = load("clock-out-at", null);
  return [
    clockInAt && { id: `legacy-in-${clockInAt}`, type: "Tap in", timestamp: clockInAt },
    clockOutAt && { id: `legacy-out-${clockOutAt}`, type: "Tap out", timestamp: clockOutAt },
  ].filter(Boolean);
}

export default function PeopleHubApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState("overview");
  const [people, setPeople] = useState(() => load("employees", employeeSeed));
  const [departments, setDepartments] = useState(() =>
    load("departments", ["Engineering", "People", "Finance", "Operations", "Design", "Marketing"])
  );
  const [trainingVideos, setTrainingVideos] = useState(() => load("training-videos", []));
  const [leaves, setLeaves] = useState(() => load("leaves", leaveSeed));
  const [supportTickets, setSupportTickets] = useState(() =>
    load("tickets", ticketSeed)
  );
  const [userDocuments, setUserDocuments] = useState(() => load("user-documents", []));
  const [checkedIn, setCheckedIn] = useState(() => load("checked-in", false));
  const [clockInAt, setClockInAt] = useState(() => load("clock-in-at", null));
  const [clockOutAt, setClockOutAt] = useState(() => load("clock-out-at", null));
  const [attendanceRecords, setAttendanceRecords] = useState(loadAttendanceRecords);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Persist to localStorage
  useEffect(() => {
    const values = {
      employees: people,
      departments,
      "training-videos": trainingVideos,
      leaves,
      tickets: supportTickets,
      "user-documents": userDocuments,
      "checked-in": checkedIn,
      "clock-in-at": clockInAt,
      "clock-out-at": clockOutAt,
      "attendance-records": attendanceRecords,
    };
    for (const [key, value] of Object.entries(values)) {
      try {
        localStorage.setItem(`peoplehub-${key}`, JSON.stringify(value));
      } catch {
        /* Browser storage may be disabled. */
      }
    }
  }, [people, departments, trainingVideos, leaves, supportTickets, userDocuments, checkedIn, clockInAt, clockOutAt, attendanceRecords]);

  const availableDepartments = useMemo(
    () => [...new Set([
      ...departments,
      ...people.map((person) => person.department).filter(Boolean),
    ])],
    [departments, people]
  );

  // Auto-dismiss toast after 3.2s
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  // ── Dialog submission handler ───────────────────────
  function submitAction(type, values) {
    if (type === "employee") {
      const department = values.department === "__new_department__"
        ? values.newDepartment.trim()
        : values.department;
      if (!department) {
        setNotice("Choose an existing department or enter a new one.");
        return;
      }
      if (values.department === "__new_department__" && availableDepartments.some((item) => item.toLowerCase() === department.toLowerCase())) {
        setNotice("That department already exists. Choose it from the department list.");
        return;
      }
      const nextId = Math.max(
        0,
        ...people.map((person) => Number(person.id.replace(/\D/g, "")) || 0)
      ) + 1;
      const id = `EMP${String(nextId).padStart(3, "0")}`;
      setPeople((current) => [
        ...current,
        {
          ...values,
          department,
          id,
          status: "Active",
          joined: new Date(`${values.joined}T12:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        },
      ]);
      if (values.department === "__new_department__") {
        setDepartments((current) => [...current, department]);
      }
      setNotice(`${values.name} was added to the directory.`);
    } else if (type === "delete-employee") {
      setPeople((current) => current.filter((person) => person.id !== dialog.data.id));
      setDialog(null);
      setNotice(`${dialog.data.name} was removed from the directory.`);
      return;
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
          note: values.note,
          status: "Pending",
          requested: new Date().toLocaleDateString("en-US", dateOptions),
        },
        ...current,
      ]);
      setNotice("Your time-off request was submitted.");
    } else if (type === "cancel-leave") {
      setLeaves((items) =>
        items.map((item) =>
          item.id === dialog.data.id ? { ...item, status: "Cancelled" } : item
        )
      );
      setNotice("The request was cancelled.");
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
    } else if (type === "upload-document") {
      Promise.all(values.files.map((file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          id: `DOC-${Date.now()}-${file.name}`,
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          data: reader.result,
          uploaded: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        });
        reader.readAsDataURL(file);
      }))).then((uploaded) => {
        setUserDocuments((current) => [...uploaded, ...current]);
        setNotice(`${uploaded.length} document${uploaded.length === 1 ? "" : "s"} uploaded.`);
      });
      setDialog(null);
    }
    if (type !== "upload-document") setDialog(null);
  }

  // ── Clock toggle ────────────────────────────────────
  function toggleCheckIn() {
    const timestamp = new Date().toISOString();
    const type = checkedIn ? "Tap out" : "Tap in";
    setAttendanceRecords((current) => [
      { id: `ATT-${Date.now()}`, type, timestamp },
      ...current,
    ]);
    if (checkedIn) {
      setClockOutAt(timestamp);
    } else {
      setClockInAt(timestamp);
      setClockOutAt(null);
    }
    setCheckedIn((value) => !value);
    setNotice(checkedIn ? "You are now clocked out." : "You are now clocked in.");
  }

  // ── Learning upload (accepts image OR video) ────────
  function uploadTrainingVideo(file, details) {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setNotice("Choose an image or video file to upload.");
      return;
    }
    const storedBytes = trainingVideos.reduce(
      (total, video) => total + (video.size || 0),
      0
    );
    if (storedBytes + file.size > 2 * 1024 * 1024) {
      setNotice("Training media is limited to 2 MB in this browser demo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const video = {
        id: `TRAIN-${Date.now()}`,
        title: details.title,
        description: details.description,
        category: details.category,
        fileName: file.name,
        size: file.size,
        type: file.type,
        data: reader.result,
        uploaded: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };
      setTrainingVideos((current) => [video, ...current]);
      setNotice(`"${video.title}" was added to the learning library.`);
    };
    reader.onerror = () =>
      setNotice("The file could not be read. Please try another file.");
    reader.readAsDataURL(file);
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
          departments={availableDepartments}
          query={searchQuery}
          onAction={(type, data) => setDialog({ type, data })}
        />
      );
      break;
    case "attendance":
      content = (
        <AttendancePage
          checkedIn={checkedIn}
          clockInAt={clockInAt}
          clockOutAt={clockOutAt}
          attendanceRecords={attendanceRecords}
          onToggle={toggleCheckIn}
        />
      );
      break;
    case "timeoff":
      content = (
        <TimeOffPage
          leaves={leaves}
          onAction={(type, data) => setDialog({ type, data })}
          onCancel={(leave) => setDialog({ type: "cancel-leave", data: leave })}
        />
      );
      break;
    case "pay":
      content = <PayPage />;
      break;
    case "documents":
      content = (
        <DocumentsPage
          uploadedDocuments={userDocuments}
          onDelete={(id) => setUserDocuments((current) => current.filter((document) => document.id !== id))}
          onUpload={(files) => {
            const totalBytes = [
              ...userDocuments.map((document) => document.size),
              ...files.map((file) => file.size),
            ].reduce((total, size) => total + size, 0);
            if (totalBytes > 1.5 * 1024 * 1024) {
              setNotice("Uploads are limited to 1.5 MB total in this browser demo.");
              return;
            }
            submitAction("upload-document", { files });
          }}
        />
      );
      break;
    case "support":
      content = (
        <SupportPage
          tickets={supportTickets}
          onAction={(type) => setDialog({ type })}
        />
      );
      break;
    case "organization":
      content = (
        <OrganizationPage
          people={people}
          departments={availableDepartments}
          onAction={(type) => setDialog({ type })}
        />
      );
      break;
    case "learning":
      content = (
        <LearningPage
          videos={trainingVideos}
          onUpload={uploadTrainingVideo}
          onDelete={(id) => {
            setTrainingVideos((current) => current.filter((video) => video.id !== id));
            setNotice("Item was removed from the learning library.");
          }}
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
          departmentCount={availableDepartments.length}
          attendanceRecords={attendanceRecords}
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
        departments={availableDepartments}
        onDeleteEmployee={(person) => setDialog({ type: "delete-employee", data: person })}
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