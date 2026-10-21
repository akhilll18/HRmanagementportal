import React, { useMemo, useState } from "react";
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
  Download as ArrowDownToLine,
  CalendarMonth as CalendarDays,
  Download,
  AccountBalanceWallet as WalletCards,
} from "@mui/icons-material";
import { payslips } from "../data/peopleHubData.js";
import { theme } from "../theme.js";
import {
  Badge,
  Button,
  PageHeader,
  Panel,
  StatCard,
} from "../components/PortalUI.jsx";

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PayPage() {
  const [year, setYear] = useState("2026");
  const rows = useMemo(
    () => payslips.filter((slip) => slip.month.endsWith(year)),
    [year]
  );

  function download(selected = rows) {
    const content = [
      ["Month", "Gross", "Deductions", "Net", "Status"],
      ...selected.map((row) => [
        row.month,
        row.gross,
        row.deductions,
        row.net,
        row.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download =
      selected.length === 1
        ? `payslip-${selected[0].month.toLowerCase().replaceAll(" ", "-")}.csv`
        : `payslips-${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        eyebrow="COMPENSATION"
        title="Pay"
        description="A clear view of your salary and recent pay statements."
        action={
          <Button
            variant="secondary"
            icon={ArrowDownToLine}
            onClick={() => download()}
          >
            Download summary
          </Button>
        }
      />

      {/* ── Hero card ─────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 2,
          minHeight: 107,
          overflow: "hidden",
          p: "18px 21px",
          mb: 1.8,
          border: "1px solid #2b5540",
          borderRadius: 1,
          background: "linear-gradient(108deg, #274f3c, #41654a)",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            border: "1px solid rgba(255,255,255,0.19)",
            borderRadius: 1,
            background: "rgba(255,255,255,0.09)",
            color: "#dce9d5",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <WalletCards sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.8px",
              color: "#ccdbcf",
            }}
          >
            LAST NET PAY · SEPTEMBER 2026
          </Typography>
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "1.5rem",
              mt: 0.5,
            }}
          >
            {money(52133)}
          </Typography>
          <Typography sx={{ fontSize: "0.6rem", color: "#cad8cd", mt: 0.5 }}>
            Deposited to your registered bank account on Sep 30
          </Typography>
        </Box>
        <Box sx={{ ml: "auto", zIndex: 1 }}>
          <Badge tone="light-green">Paid</Badge>
        </Box>
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: 90,
            height: 90,
            top: -44,
            right: 40,
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "50%",
            boxShadow: "0 0 0 18px rgba(255,255,255,0.03)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 110,
            height: 110,
            right: 100,
            bottom: -71,
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "50%",
          }}
        />
      </Box>

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
          label="Monthly gross"
          value={money(58333)}
          note="Base salary and allowances"
          icon={WalletCards}
          tone="green"
        />
        <StatCard
          label="Deductions"
          value={money(6200)}
          note="Tax and benefits"
          icon={ArrowDownToLine}
          tone="orange"
        />
        <StatCard
          label="Next payday"
          value="Oct 30"
          note="October 2026 payroll"
          icon={CalendarDays}
          tone="blue"
        />
      </Box>

      <Panel title="Employment details" subtitle="Your current employee record" sx={{ mb: 2 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 620 }}>
            <TableHead>
              <TableRow>
                <TableCell>EMPLOYEE ID</TableCell>
                <TableCell>DATE OF JOINING</TableCell>
                <TableCell>JOB TITLE</TableCell>
                <TableCell>DEPARTMENT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{theme.currentUser.employeeId}</TableCell>
                <TableCell>Jun 12, 2025</TableCell>
                <TableCell>{theme.currentUser.role}</TableCell>
                <TableCell>{theme.currentUser.department}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Panel>

      {/* ── Pay history table ─────────────────────────── */}
      <Panel
        title="Pay history"
        subtitle="Your recent pay statements"
        action={
          <TextField
            select
            size="small"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{
              minWidth: 100,
              "& .MuiOutlinedInput-root": {
                fontSize: "0.65rem",
                borderRadius: 1,
                "& fieldset": { borderColor: "#e5eae5" },
              },
              "& .MuiInputBase-input": { py: 0.8, px: 1 },
            }}
          >
            <MenuItem value="2026" sx={{ fontSize: "0.65rem" }}>2026</MenuItem>
            <MenuItem value="2025" sx={{ fontSize: "0.65rem" }}>2025</MenuItem>
          </TextField>
        }
      >
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>PAY PERIOD</TableCell>
                <TableCell>GROSS PAY</TableCell>
                <TableCell>DEDUCTIONS</TableCell>
                <TableCell>NET PAY</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>STATEMENT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.month} sx={{ "&:hover": { background: "#fcfdfb" } }}>
                  <TableCell>
                    <Typography
                      sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#354138" }}
                    >
                      {row.month}
                    </Typography>
                  </TableCell>
                  <TableCell>{money(row.gross)}</TableCell>
                  <TableCell sx={{ color: "#8a948d" }}>
                    − {money(row.deductions)}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="strong"
                      sx={{ color: "#355b41", fontSize: "0.65rem" }}
                    >
                      {money(row.net)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Badge tone="green">{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Box
                      component="button"
                      onClick={() => download([row])}
                      aria-label={`Download ${row.month} statement`}
                      sx={{
                        width: 27,
                        height: 27,
                        border: "1px solid transparent",
                        borderRadius: 0.8,
                        background: "transparent",
                        color: "#96a097",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                        "&:hover": {
                          borderColor: "#e2e9e2",
                          background: "#f5f8f4",
                          color: "primary.main",
                        },
                      }}
                    >
                      <Download sx={{ fontSize: 15 }} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {rows.length === 0 && (
            <Box
              sx={{
                py: 3.5,
                px: 2,
                textAlign: "center",
                color: "#849087",
                fontSize: "0.65rem",
              }}
            >
              No statements found for {year}.
            </Box>
          )}
        </TableContainer>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            minHeight: 41,
            px: 2,
            borderTop: "1px solid #edf0ec",
            color: "#8d978f",
            fontSize: "0.6rem",
          }}
        >
          <span>Amounts shown in Indian rupees</span>
          <Box
            component="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-support"))
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
            Questions about your pay? <span>↗</span>
          </Box>
        </Stack>
      </Panel>
    </>
  );
}