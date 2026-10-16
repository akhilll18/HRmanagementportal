import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  NorthEast as ArrowUpRight,
  Description as FileText,
  Add as Plus,
  Search,
  TrackChanges as Target,
  Groups as UsersRound,
} from "@mui/icons-material";
import {
  Badge,
  Button,
  PageHeader,
  Panel,
  StatCard,
} from "../components/PortalUI.jsx";

export default function SupportPage({ tickets, onAction }) {
  const [query, setQuery] = useState("");
  const filtered = tickets.filter((ticket) =>
    `${ticket.id} ${ticket.subject} ${ticket.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="HERE TO HELP"
        title="HR support"
        description="Get help with pay, benefits, time off or personal details."
        action={
          <Button icon={Plus} onClick={() => onAction("ticket")}>
            New request
          </Button>
        }
      />

      {/* ── Banner ────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.8}
        sx={{
          minHeight: 116,
          mb: 1.8,
          p: "16px 19px",
          border: "1px solid #e5e9df",
          borderRadius: 1,
          background:
            "linear-gradient(106deg, #eef3eb, #f5f4e9 60%, #fbf1e8)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 51,
            height: 51,
            border: "1px solid #dbe6d8",
            borderRadius: "50%",
            background: "#fbfcf7",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 14,
              height: 14,
              border: "2px solid #5c8662",
              borderRadius: "5px 5px 5px 1px",
              transform: "rotate(-12deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 14,
              height: 14,
              mt: "12px",
              ml: "12px",
              border: "2px solid #d1855c",
              borderRadius: "5px 5px 5px 1px",
              transform: "rotate(12deg) scale(0.72)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 5,
              height: 5,
              mt: "-10px",
              ml: "17px",
              borderRadius: "50%",
              background: "#7d9b71",
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.8px",
              color: "#83907f",
              mb: 0.5,
            }}
          >
            PEOPLE TEAM · MON–FRI, 9:00–5:00
          </Typography>
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#3e5141",
            }}
          >
            We're here to make work work.
          </Typography>
          <Typography sx={{ fontSize: "0.6rem", color: "#778477", mt: 0.4 }}>
            Send a request and our team will follow up in one working day.
          </Typography>
        </Box>
        <Box
          component="button"
          onClick={() => onAction("ticket")}
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            alignItems: "center",
            gap: 0.6,
            px: 1.4,
            py: 1,
            border: "1px solid #d7e2d6",
            borderRadius: 0.8,
            background: "#fff",
            color: "#476c4e",
            fontSize: "0.6rem",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { background: "#f8fbf7" },
          }}
        >
          Contact HR <ArrowUpRight sx={{ fontSize: 15 }} />
        </Box>
      </Stack>

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
          label="Your open requests"
          value={tickets.filter((t) => t.status !== "Resolved").length}
          note="Waiting for a response"
          icon={FileText}
          tone="orange"
        />
        <StatCard
          label="Resolved this month"
          value={tickets.filter((t) => t.status === "Resolved").length}
          note="Closed requests"
          icon={Target}
          tone="green"
        />
        <StatCard
          label="Typical response"
          value="1 day"
          note="People team working hours"
          icon={UsersRound}
          tone="blue"
        />
      </Box>

      {/* ── Requests table ────────────────────────────── */}
      <Panel
        title="Your requests"
        subtitle="Track the latest updates from the People team"
        action={
          <TextField
            placeholder="Search requests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: 140, sm: 180 },
              "& .MuiOutlinedInput-root": {
                fontSize: "0.65rem",
                borderRadius: 1,
                "& fieldset": { borderColor: "#e5eae5" },
              },
              "& .MuiInputBase-input": { py: 0.7, px: 1 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 15, color: "#8d9890" }} />
                </InputAdornment>
              ),
            }}
          />
        }
      >
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>REQUEST</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>SUBMITTED</TableCell>
                <TableCell>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((ticket) => (
                <TableRow key={ticket.id} sx={{ "&:hover": { background: "#fcfdfb" } }}>
                  <TableCell>
                    <Typography
                      sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#354138" }}
                    >
                      {ticket.subject}
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem", color: "#8d978f", mt: 0.4 }}>
                      {ticket.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell sx={{ color: "#78837b" }}>{ticket.created}</TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        ticket.status === "Resolved"
                          ? "green"
                          : ticket.status === "In progress"
                          ? "blue"
                          : "orange"
                      }
                    >
                      {ticket.status}
                    </Badge>
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
              No matching requests.
            </Box>
          )}
        </TableContainer>
      </Panel>

      {/* ── Bottom hint ───────────────────────────────── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mt: 1.6,
          p: "11px 13px",
          border: "1px solid #e7ebe6",
          borderRadius: 1,
          background: "#fff",
          color: "#7d887f",
          fontSize: "0.6rem",
        }}
      >
        <span>Looking for a policy or form?</span>
        <Box
          component="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("navigate-documents"))
          }
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            border: 0,
            background: "transparent",
            color: "#50745a",
            fontSize: "0.6rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Browse documents <ArrowUpRight sx={{ fontSize: 14 }} />
        </Box>
      </Stack>
    </>
  );
}