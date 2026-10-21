import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth as CalendarDays,
  Add as Plus,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  Badge,
  Button,
  PageHeader,
  Panel,
} from "../components/PortalUI.jsx";

export default function TimeOffPage({ leaves, onAction, onCancel }) {
  const [filter, setFilter] = useState("All requests");
  const [month, setMonth] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  });
  const filtered = leaves.filter(
    (leave) => filter === "All requests" || leave.status === filter
  );
  const leaveTypes = [
    { name: "Casual leave", total: 12, tone: "#4f8060" },
    { name: "Sick leave", total: 10, tone: "#5481a0" },
    { name: "Annual leave", total: 18, tone: "#be7952" },
    { name: "Unpaid leave", total: 0, tone: "#9b6b76" },
  ];
  const usedDaysFor = (type) => leaves
    .filter((leave) => leave.type === type && leave.status === "Approved")
    .reduce((total, leave) => total + leave.days, 0);
  const totalRemaining = leaveTypes.reduce(
    (total, type) => total + Math.max(type.total - usedDaysFor(type.name), 0),
    0
  );
  const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from(
    { length: Math.ceil((offset + dayCount) / 7) * 7 },
    (_, index) => {
      const day = index - offset + 1;
      return day < 1 || day > dayCount
        ? null
        : `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  );
  const leavesByDate = leaves.filter((leave) => leave.status !== "Cancelled").reduce((days, leave) => {
    const start = new Date(`${leave.start} 12:00:00`);
    const end = new Date(`${leave.end} 12:00:00`);
    for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      days[key] = [...(days[key] || []), leave];
    }
    return days;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="TIME AWAY"
        title="Request leave"
        description="Submit a leave request and keep track of its status."
        action={
          <Button icon={Plus} onClick={() => onAction("leave")}>
            Request leave
          </Button>
        }
      />

      {/* ── Balance banner ────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.8, md: 2.5 },
          minHeight: 118,
          p: { xs: 2, md: "17px 20px" },
          mb: 2,
          border: "1px solid #dce8de",
          borderRadius: 1,
          background:
            "linear-gradient(110deg, #edf4ed, #f4f8f4 68%, #f8faf7)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.6}>
          <Box
            sx={{
              width: 40,
              height: 40,
              border: "1px solid #d8e6d9",
              borderRadius: 1,
              background: "#f9fcf8",
              color: "#4d795a",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <CalendarDays sx={{ fontSize: 19 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.8px",
                color: "#819087",
              }}
            >
              YOUR BALANCE
            </Typography>
            <Typography
              sx={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#35563e",
                mt: 0.4,
              }}
            >
              {totalRemaining}{" "}
              <Box
                component="span"
                sx={{ fontSize: "0.65rem", fontWeight: 500, color: "#66806d" }}
              >
                days available
              </Box>
            </Typography>
            <Typography sx={{ fontSize: "0.6rem", color: "#839087", mt: 0.4 }}>
              Resets on January 1, 2027
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={2.5}
          sx={{ pl: { xs: 0, md: 0 }, width: { xs: "100%", md: "auto" } }}
        >
          {leaveTypes.slice(0, 2).map((type) => (
            <Box
              key={type.name}
              sx={{
                display: "grid",
                gridTemplateColumns: "8px auto",
                gap: "3px 6px",
                alignItems: "center",
                color: "#67756a",
                fontSize: "0.6rem",
              }}
            >
              <Box
                sx={{
                  gridRow: 1,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: type.tone,
                }}
              />
              <span>{type.name}</span>
              <Box
                component="strong"
                sx={{
                  gridColumn: 2,
                  color: "#34483a",
                  fontSize: "0.7rem",
                }}
              >
                {Math.max(type.total - usedDaysFor(type.name), 0)} days
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: 1.2, mb: 2 }}>
        {leaveTypes.map((type) => {
          const used = usedDaysFor(type.name);
          return (
            <Box key={type.name} component="button" onClick={() => onAction("leave", { type: type.name })} sx={{ p: 1.6, textAlign: "left", border: "1px solid #e5eae5", borderRadius: 1, background: "#fff", cursor: "pointer", "&:hover": { borderColor: type.tone } }}>
              <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#455249" }}>{type.name}</Typography>
              <Typography sx={{ mt: 0.8, fontFamily: "Manrope", fontWeight: 700, fontSize: "1.05rem", color: type.tone }}>{Math.max(type.total - used, 0)} <Box component="span" sx={{ fontSize: "0.6rem", fontWeight: 500 }}>remaining</Box></Typography>
              <Typography sx={{ mt: 0.4, fontSize: "0.56rem", color: "#89948c" }}>{used} used of {type.total} days</Typography>
            </Box>
          );
        })}
      </Box>

      <Panel title="Leave calendar" subtitle="Select a day to see scheduled time away" sx={{ mb: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(280px, 0.85fr) 1fr" }, gap: 2, p: { xs: 1.4, sm: 2 } }}>
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
              <Typography sx={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "0.8rem", color: "#344037" }}>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</Typography>
              <Stack direction="row">
                <IconButton aria-label="Previous month" size="small" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft fontSize="small" /></IconButton>
                <IconButton aria-label="Next month" size="small" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight fontSize="small" /></IconButton>
              </Stack>
            </Stack>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 0.4 }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <Typography key={`${day}-${index}`} sx={{ py: 0.5, textAlign: "center", color: "#929c94", fontSize: "0.58rem", fontWeight: 700 }}>{day}</Typography>)}
              {calendarDays.map((date, index) => date ? (
                <Box key={date} component="button" aria-label={new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { dateStyle: "full" })} onClick={() => setSelectedDate(date)} sx={{ position: "relative", display: "grid", placeItems: "center", aspectRatio: "1", border: 0, borderRadius: 0.8, background: selectedDate === date ? "#eaf2ec" : "transparent", color: selectedDate === date ? "#27614e" : "#4f5b52", fontSize: "0.62rem", fontWeight: selectedDate === date ? 700 : 500, cursor: "pointer", "&:hover": { background: "#f1f5f1" } }}>
                  {Number(date.slice(-2))}
                  {leavesByDate[date]?.length > 0 && <Box sx={{ position: "absolute", bottom: 3, width: 4, height: 4, borderRadius: "50%", background: leavesByDate[date][0].status === "Approved" ? "#54845f" : "#c98554" }} />}
                </Box>
              ) : <Box key={`empty-${index}`} />)}
            </Box>
          </Box>
          <Box sx={{ minHeight: 170, p: 1.6, border: "1px solid #edf0ec", borderRadius: 1, background: "#fbfcfa" }}>
            <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#455249" }}>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</Typography>
            {(leavesByDate[selectedDate] || []).length ? leavesByDate[selectedDate].map((leave) => (
              <Box key={leave.id} onClick={() => onAction("leave-detail", leave)} sx={{ mt: 1, p: 1, borderLeft: `3px solid ${leave.status === "Approved" ? "#54845f" : "#c98554"}`, background: "#fff", cursor: "pointer" }}>
                <Typography sx={{ fontSize: "0.62rem", fontWeight: 700 }}>{leave.type}</Typography>
                <Typography sx={{ mt: 0.3, fontSize: "0.57rem", color: "#78837b" }}>{leave.status} · {leave.days} {leave.days === 1 ? "day" : "days"}</Typography>
              </Box>
            )) : <Typography sx={{ mt: 1, fontSize: "0.6rem", color: "#89948c" }}>No leave scheduled for this day.</Typography>}
          </Box>
        </Box>
      </Panel>

      {/* ── Requests table ────────────────────────────── */}
      <Panel
        title="Leave requests"
        subtitle="Review the status of your time-off plans"
        action={
          <TextField
            select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              minWidth: 130,
              "& .MuiOutlinedInput-root": {
                fontSize: "0.65rem",
                borderRadius: 1,
                "& fieldset": { borderColor: "#e5eae5" },
              },
              "& .MuiInputBase-input": { py: 0.8, px: 1 },
            }}
          >
            {["All requests", "Pending", "Approved", "Cancelled"].map((o) => (
              <MenuItem key={o} value={o} sx={{ fontSize: "0.65rem" }}>
                {o}
              </MenuItem>
            ))}
          </TextField>
        }
      >
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>TYPE</TableCell>
                <TableCell>DATES</TableCell>
                <TableCell>DAYS</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>REQUESTED</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((leave) => (
                <TableRow
                  key={leave.id}
                  sx={{ "&:hover": { background: "#fcfdfb" } }}
                >
                  <TableCell>
                    <Typography
                      component="button"
                      onClick={() => onAction("leave-detail", leave)}
                      sx={{ p: 0, border: 0, background: "transparent", textAlign: "left", cursor: "pointer", fontSize: "0.65rem", fontWeight: 600, color: "#354138", "&:hover": { color: "primary.main", textDecoration: "underline" } }}
                    >
                      {leave.type}
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem", color: "#8d978f", mt: 0.4 }}>
                      {leave.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {leave.start}
                    {leave.start !== leave.end && ` – ${leave.end}`}
                  </TableCell>
                  <TableCell>
                    {leave.days} {leave.days === 1 ? "day" : "days"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        leave.status === "Approved"
                          ? "green"
                          : leave.status === "Pending"
                          ? "orange"
                          : "neutral"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell sx={{ color: "#78837b" }}>{leave.requested}</TableCell>
                  <TableCell>
                    {leave.status === "Pending" && (
                      <Box
                        component="button"
                        onClick={() => onCancel(leave)}
                        sx={{
                          px: 0.9,
                          py: 0.4,
                          border: "1px solid #e6eae6",
                          borderRadius: 0.6,
                          background: "#fff",
                          color: "#6f7b72",
                          fontSize: "0.6rem",
                          cursor: "pointer",
                          "&:hover": { borderColor: "#e7c8b9", color: "#aa694a" },
                        }}
                      >
                        Cancel
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <Box
              sx={{
                py: 3.5,
                px: 2,
                textAlign: "center",
                color: "#849087",
                fontSize: "0.65rem",
              }}
            >
              No requests in this view.
            </Box>
          )}
        </TableContainer>
      </Panel>

      {/* ── Notice ────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.1}
        sx={{
          mt: 1.6,
          px: 1.6,
          py: 1.4,
          border: "1px solid #e8ece7",
          borderRadius: 1,
          background: "#fbfcfa",
          color: "#7b867e",
          fontSize: "0.6rem",
        }}
      >
        <Box
          sx={{
            width: 17,
            height: 17,
            border: "1px solid #ccd8cc",
            borderRadius: "50%",
            color: "#6a856e",
            fontFamily: "Georgia, serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          i
        </Box>
        <Typography sx={{ fontSize: "0.6rem", color: "#7b867e" }}>
          <Box component="strong" sx={{ color: "#4b574e" }}>
            Need to change an approved request?
          </Box>{" "}
          Contact the People team at least two working days before your leave.
        </Typography>
      </Stack>
    </>
  );
}