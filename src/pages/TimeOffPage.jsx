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
} from "@mui/material";
import {
  CalendarMonth as CalendarDays,
  Add as Plus,
} from "@mui/icons-material";
import {
  Badge,
  Button,
  PageHeader,
  Panel,
} from "../components/PortalUI.jsx";

export default function TimeOffPage({ leaves, onAction, onCancel }) {
  const [filter, setFilter] = useState("All requests");
  const filtered = leaves.filter(
    (leave) => filter === "All requests" || leave.status === filter
  );

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
              8{" "}
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
          {[
            { label: "Casual leave", value: "5 days", color: "#63936b" },
            { label: "Sick leave", value: "3 days", color: "#8aa78c" },
          ].map((b) => (
            <Box
              key={b.label}
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
                  background: b.color,
                }}
              />
              <span>{b.label}</span>
              <Box
                component="strong"
                sx={{
                  gridColumn: 2,
                  color: "#34483a",
                  fontSize: "0.7rem",
                }}
              >
                {b.value}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

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
                      sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#354138" }}
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
                        onClick={() => onCancel(leave.id)}
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