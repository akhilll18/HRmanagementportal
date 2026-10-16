import React from "react";
import {
  Box,
  Card,
  Typography,
  Button as MuiButton,
  Chip,
  Avatar as MuiAvatar,
  IconButton as MuiIconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import {
  NorthEast as ArrowUpRight,
  Check,
  ChevronRight,

  Close as X,
} from "@mui/icons-material";

// ── Button ─────────────────────────────────────────────────
export function Button({ children, variant = "primary", icon: Icon, sx, ...props }) {
  const variantMap = {
    primary: "contained",
    secondary: "outlined",
    light: "contained",
  };
  const customSx =
    variant === "light"
      ? {
          background: "#fff",
          color: "#1e493a",
          "&:hover": { background: "#edf5ef" },
        }
      : {};
  return (
    <MuiButton
      variant={variantMap[variant] || "contained"}
      color={variant === "primary" ? "primary" : "inherit"}
      startIcon={Icon ? <Icon size={16} /> : undefined}
      sx={{ ...customSx, ...sx }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}

// ── IconButton ─────────────────────────────────────────────
export function IconButton({ children, label, sx, ...props }) {
  return (
    <MuiIconButton
      aria-label={label}
      title={label}
      size="small"
      sx={{
        color: "#66716a",
        width: 34,
        height: 34,
        borderRadius: 1.5,
        "&:hover": { background: "#f1f4f0", color: "primary.main" },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiIconButton>
  );
}

// ── PageHeader ─────────────────────────────────────────────
export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ minHeight: 69, mb: 2.5 }}
    >
      <Box>
        {eyebrow && (
          <Typography
            sx={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "1.15px",
              color: "#89948c",
              mb: 0.5,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h1">{title}</Typography>
        {description && (
          <Typography sx={{ mt: 0.5, color: "#7b867e", fontSize: "0.7rem" }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>{action}</Box>}
    </Stack>
  );
}

// ── Panel ──────────────────────────────────────────────────
export function Panel({ title, subtitle, action, className, children, sx }) {
  return (
    <Card sx={{ overflow: "hidden", ...sx }}>
      {(title || action) && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            minHeight: 57,
            px: 2,
            py: 1.4,
            borderBottom: "1px solid #edf0ec",
          }}
        >
          <Box>
            {title && (
              <Typography variant="h2" sx={{ color: "#303b33" }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography sx={{ mt: 0.4, color: "#8a948d", fontSize: "0.6rem" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      {children}
    </Card>
  );
}

// ── StatCard ───────────────────────────────────────────────
export function StatCard({ label, value, note, icon: Icon, tone = "green" }) {
  const toneMap = {
    green: { bg: "#e9f2eb", color: "#47765a" },
    orange: { bg: "#fff0e9", color: "#c87850" },
    blue: { bg: "#e9f1f8", color: "#5684a8" },
    rose: { bg: "#f7ebeb", color: "#b66868" },
  };
  const t = toneMap[tone] || toneMap.green;
  return (
    <Card
      sx={{
        p: "14px 15px",
        display: "grid",
        gridTemplateColumns: "34px 1fr",
        gridTemplateRows: "25px 32px 18px",
        columnGap: "10px",
        alignContent: "center",
        minHeight: 115,
      }}
    >
      <Box
        sx={{
          gridRow: "1 / span 2",
          width: 32,
          height: 32,
          borderRadius: 1,
          background: t.bg,
          color: t.color,
          display: "grid",
          placeItems: "center",
        }}
      >
        {Icon && <Icon size={17} />}
      </Box>
      <Typography
        sx={{
          gridColumn: 2,
          fontSize: "0.65rem",
          color: "#77827a",
          alignSelf: "center",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          gridColumn: 2,
          alignSelf: "end",
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "1.15rem",
          color: "#26322a",
          lineHeight: 1.05,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          gridColumn: 2,
          alignSelf: "end",
          fontSize: "0.6rem",
          color: "#8a948d",
        }}
      >
        {note}
      </Typography>
    </Card>
  );
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ children, tone = "neutral" }) {
  const toneMap = {
    neutral: { bg: "#f7f8f6", color: "#66716a", border: "#e8ece8" },
    green: { bg: "#eef6ef", color: "#42734f", border: "#d8eadc" },
    orange: { bg: "#fcf4ed", color: "#a96d43", border: "#f0e1d4" },
    blue: { bg: "#f0f5f8", color: "#527995", border: "#dce8f0" },
    "light-green": {
      bg: "rgba(239,249,239,0.13)",
      color: "#e3f4e1",
      border: "rgba(222,241,223,0.25)",
    },
  };
  const t = toneMap[tone] || toneMap.neutral;
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

// ── Avatar ─────────────────────────────────────────────────
export function Avatar({ name, size = "normal" }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  const dim = size === "large" ? 63 : 31;
  const font = size === "large" ? "1rem" : "0.65rem";
  return (
    <MuiAvatar
      sx={{
        width: dim,
        height: dim,
        background: size === "large" ? "#d6e7da" : "#eaf2ec",
        color: size === "large" ? "#315f49" : "#3c7155",
        border:
          size === "large"
            ? "2px solid rgba(255,255,255,0.74)"
            : "1px solid #dce9df",
        fontSize: font,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </MuiAvatar>
  );
}

// ── ChevronAction ──────────────────────────────────────────
export function ChevronAction({ children, onClick }) {
  return (
    <MuiButton
      size="small"
      onClick={onClick}
      endIcon={<ChevronRight sx={{ fontSize: 15 }} />}
      sx={{
        color: "#56745f",
        fontSize: "0.6rem",
        p: 0,
        minWidth: 0,
        "&:hover": { background: "transparent", color: "#1e493a" },
      }}
    >
      {children}
    </MuiButton>
  );
}

// ── EmptyState ─────────────────────────────────────────────
export function EmptyState({ title, description, action }) {
  return (
    <Stack
      alignItems="center"
      spacing={0.7}
      sx={{ py: 4, px: 2, textAlign: "center", color: "#819087" }}
    >
      <CircleHelp sx={{ color: "#8ea393", fontSize: 22 }} />
      <Typography sx={{ color: "#46534a", fontSize: "0.7rem", fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "0.6rem", maxWidth: 280 }}>
        {description}
      </Typography>
      {action}
    </Stack>
  );
}

// ── ModalFrame ─────────────────────────────────────────────
export function ModalFrame({ title, description, onClose, children, footer }) {
  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 460,
          maxWidth: "100%",
          borderRadius: 1.5,
          border: "1px solid #e3e8e2",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          p: 2.5,
          pb: 1.8,
          borderBottom: "1px solid #edf0ec",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#2c382f",
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography sx={{ mt: 0.5, color: "#879188", fontSize: "0.65rem" }}>
              {description}
            </Typography>
          )}
        </Box>
        <MuiIconButton onClick={onClose} size="small">
          <X sx={{ fontSize: 18 }} />
        </MuiIconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>{children}</DialogContent>
      {footer && <DialogActions sx={{ p: "0 20px 16px" }}>{footer}</DialogActions>}
    </Dialog>
  );
}

// ── LinkButton ─────────────────────────────────────────────
export function LinkButton({ children, onClick }) {
  return (
    <MuiButton
      onClick={onClick}
      endIcon={<ArrowUpRight sx={{ fontSize: 14 }} />}
      sx={{ color: "#56745f", fontSize: "0.6rem", p: 0, minWidth: 0 }}
    >
      {children}
    </MuiButton>
  );
}

// ── SuccessMark ────────────────────────────────────────────
export function SuccessMark() {
  return (
    <Box
      sx={{
        display: "inline-grid",
        width: 20,
        height: 20,
        placeItems: "center",
        borderRadius: "50%",
        background: "#e8f3e9",
        color: "#4a8256",
      }}
    >
      <Check sx={{ fontSize: 13 }} />
    </Box>
  );
}