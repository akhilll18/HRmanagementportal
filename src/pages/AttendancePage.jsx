import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  CalendarMonth as CalendarDays,
  Check,
  AccessTime as Clock3,
} from "@mui/icons-material";
import { attendanceDays } from "../data/peopleHubData.js";
import {
  Button,
  PageHeader,
  Panel,
  StatCard,
} from "../components/PortalUI.jsx";

export default function AttendancePage({ checkedIn, onToggle }) {
  const [range, setRange] = useState("This week");

  const days =
    range === "This week"
      ? attendanceDays
      : attendanceDays.map((day, index) => ({
          ...day,
          date: ["Sep 28", "Sep 29", "Sep 30", "Oct 01", "Oct 02"][index],
          hours: [7.8, 8.4, 8.1, 7.5, 8.7][index],
          label: ["7h 48m", "8h 24m", "8h 06m", "7h 30m", "8h 42m"][index],
        }));

  return (
    <>
      <PageHeader
        eyebrow="TIME & ATTENDANCE"
        title="Attendance"
        description="Your hours, your rhythm. Keep track of your work week."
        action={
          <Button
            icon={checkedIn ? Check : Clock3}
            onClick={onToggle}
          >
            {checkedIn ? "Clock out" : "Clock in"}
          </Button>
        }
      />

      {/* ── Stats ─────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(3, 1fr)" },
          gap: 1.5,
          mb: 2,
        }}
      >
        <StatCard
          label="Today's status"
          value={checkedIn ? "Working" : "Not started"}
          note={checkedIn ? "Clocked in at 9:12 AM" : "Your workday has not started"}
          icon={Clock3}
          tone="green"
        />
        <StatCard
          label="Hours this week"
          value="41h 06m"
          note="Target is 40 hours"
          icon={CalendarDays}
          tone="blue"
        />
        <StatCard
          label="On-time days"
          value="18 / 20"
          note="This month"
          icon={Check}
          tone="orange"
        />
      </Box>

      {/* ── Hours worked chart ────────────────────────── */}
      <Panel
        title="Hours worked"
        subtitle={`${range} · ${range === "This week" ? "Oct 05–09" : "Sep 28–Oct 02"}`}
        action={
          <TextField
            select
            size="small"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                fontSize: "0.65rem",
                borderRadius: 1,
                "& fieldset": { borderColor: "#e5eae5" },
              },
              "& .MuiInputBase-input": { py: 0.8, px: 1 },
            }}
          >
            <MenuItem value="This week" sx={{ fontSize: "0.65rem" }}>This week</MenuItem>
            <MenuItem value="Last week" sx={{ fontSize: "0.65rem" }}>Last week</MenuItem>
          </TextField>
        }
        sx={{ mb: 1.6 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: { xs: 1.2, md: 2.5 },
            height: 221,
            px: { xs: 1.5, md: 6.5 },
            pt: 2.5,
          }}
        >
          {days.map((day, index) => {
            const isHighlighted = index === 4;
            const isFaded = index === 2;
            return (
              <Box
                key={day.day}
                sx={{
                  display: "grid",
                  gridTemplateRows: "1fr 18px 15px",
                  justifyItems: "center",
                  minWidth: 0,
                }}
              >
                {/* Bar track */}
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    width: { xs: "100%", sm: "min(100%, 66px)" },
                    maxWidth: 66,
                    height: "100%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    borderBottom: "1px solid #e5ebe5",
                    background:
                      "repeating-linear-gradient(to top, transparent 0, transparent 41px, #f2f4f1 42px)",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 30,
                      minHeight: 20,
                      borderRadius: "5px 5px 0 0",
                      background: isHighlighted
                        ? "#4b805c"
                        : isFaded
                        ? "#d2dfd1"
                        : "#a6c3aa",
                      height: `${Math.round((day.hours / 9) * 100)}%`,
                      animation: "growUp 0.5s ease both",
                      animationDelay: `${index * 55}ms`,
                      "@keyframes growUp": {
                        from: { transform: "scaleY(0.15)", transformOrigin: "bottom" },
                        to: { transform: "scaleY(1)", transformOrigin: "bottom" },
                      },
                    }}
                  />
                  {isHighlighted && (
                    <Typography
                      sx={{
                        position: "absolute",
                        top: 3,
                        color: "#8c968e",
                        fontSize: "0.55rem",
                      }}
                    >
                      {day.label}
                    </Typography>
                  )}
                </Box>
                <Typography
                  sx={{
                    pt: 0.5,
                    color: "#69756c",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                  }}
                >
                  {day.day}
                </Typography>
                <Typography sx={{ color: "#9ba49d", fontSize: "0.55rem" }}>
                  {day.date}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Legend footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            mt: 0.3,
            px: 2,
            py: 1.2,
            borderTop: "1px solid #edf0ec",
            color: "#818c84",
            fontSize: "0.6rem",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <Box sx={{ width: 7, height: 7, borderRadius: 0.5, background: "#4b805c" }} />
            <span>Hours worked</span>
          </Stack>
          <span>
            Standard day{" "}
            <Box component="strong" sx={{ ml: 0.5, color: "#465249" }}>
              8h
            </Box>
          </span>
        </Stack>
      </Panel>

      {/* ── Bottom: today + policy ────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
          gap: 1.6,
        }}
      >
        <Panel title="Today" subtitle="Monday, October 12">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{ px: 2, py: 1.8 }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#eaf3eb",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{ width: 7, height: 7, borderRadius: "50%", background: "#5f9668" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
                {checkedIn ? "Clocked in" : "Ready to start"}
              </Typography>
              <Typography sx={{ fontSize: "0.6rem", color: "#89948c", mt: 0.4 }}>
                {checkedIn ? "09:12 AM · Office" : "No check-in recorded yet"}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#54665a" }}>
              {checkedIn ? "09:12" : "--:--"}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{ px: 2, py: 1.8, borderTop: "1px solid #f0f2ef" }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#f0f2ef",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{ width: 7, height: 7, borderRadius: "50%", background: "#aeb7af" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#8c968e" }}>
                Clock out
              </Typography>
              <Typography sx={{ fontSize: "0.6rem", color: "#89948c", mt: 0.4 }}>
                End of your work day
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#8c968e" }}>
              --:--
            </Typography>
          </Stack>
        </Panel>

        <Panel title="Attendance policy" subtitle="A quick reminder">
          <Typography
            sx={{
              p: "15px 15px 8px",
              color: "#768179",
              fontSize: "0.65rem",
              lineHeight: 1.7,
            }}
          >
            Our standard working day is 8 hours, with flexible start times between
            8:00 and 10:00 AM. Need to correct a time entry? Reach out to HR
            support.
          </Typography>
          <Box
            component="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-support"))
            }
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 2,
              pb: 1.8,
              pt: 0.8,
              border: 0,
              background: "transparent",
              color: "#50745a",
              fontSize: "0.6rem",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { color: "#1e493a" },
            }}
          >
            Ask HR support <span>↗</span>
          </Box>
        </Panel>
      </Box>
    </>
  );
}