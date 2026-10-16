import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { X } from "@mui/icons-material";
import { Button } from "./PortalUI.jsx";
import { theme } from "../theme.js";

const configs = {
  employee: {
    title: "Add a teammate",
    description: "Create a people directory entry.",
    submit: "Add teammate",
    fields: [
      { name: "name", label: "Full name", required: true },
      { name: "email", label: "Work email", type: "email", required: true },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: ["Engineering", "People", "Finance", "Operations", "Design", "Marketing"],
      },
      { name: "role", label: "Job title", required: true },
    ],
  },
  leave: {
    title: "Request leave",
    description: "Your manager will be notified when you submit.",
    submit: "Send request",
    fields: [
      {
        name: "type",
        label: "Leave type",
        type: "select",
        options: ["Casual leave", "Sick leave", "Annual leave", "Unpaid leave"],
      },
      { name: "start", label: "Start date", type: "date", required: true },
      { name: "end", label: "End date", type: "date", required: true },
      { name: "note", label: "Note for your manager", type: "textarea" },
    ],
  },
  ticket: {
    title: "Contact HR support",
    description: "Tell the People team what you need help with.",
    submit: "Create ticket",
    fields: [
      { name: "subject", label: "What do you need help with?", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["Payroll", "Time off", "Personal details", "Benefits", "Other"],
      },
      { name: "description", label: "Details", type: "textarea", required: true },
    ],
  },
};

export default function PortalDialog({ dialog, onClose, onSubmit }) {
  const [values, setValues] = useState({});

  // Reset values whenever a new dialog opens
  useEffect(() => {
    if (dialog && configs[dialog.type]) {
      const init = {};
      configs[dialog.type].fields.forEach((f) => {
        init[f.name] = f.type === "select" ? f.options[0] : "";
      });
      setValues(init);
    }
  }, [dialog]);

  if (!dialog) return null;

  // ── Profile / person view ────────────────────────────────
  if (dialog.type === "profile" || dialog.type === "person") {
    const person =
      dialog.data || {
        ...theme.currentUser,
        id: theme.currentUser.employeeId,
        status: "Active",
      };
    const initials = person.name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();

    return (
      <Dialog
        open
        onClose={onClose}
        PaperProps={{ sx: { width: 460, maxWidth: "100%", borderRadius: 1.5 } }}
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
              {dialog.type === "profile" ? "Your profile" : person.name}
            </Typography>
            <Typography sx={{ mt: 0.5, color: "#879188", fontSize: "0.65rem" }}>
              People directory details.
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ pb: 2, borderBottom: "1px solid #edf0ec" }}
          >
            <Box
              sx={{
                width: 43,
                height: 43,
                borderRadius: "50%",
                background: "#eaf2ec",
                color: "#3c7155",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              {initials}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#344037" }}>
                {person.name}
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "#838e86", mt: 0.4 }}>
                {person.role}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "105px 1fr",
              gap: "12px 10px",
              pt: 2,
              pb: 1.5,
            }}
          >
            <Typography sx={{ fontSize: "0.65rem", color: "#89948c" }}>
              Work email
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#465249", fontWeight: 600 }}>
              {person.email}
            </Typography>

            <Typography sx={{ fontSize: "0.65rem", color: "#89948c" }}>
              Employee ID
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#465249", fontWeight: 600 }}>
              {person.id}
            </Typography>

            <Typography sx={{ fontSize: "0.65rem", color: "#89948c" }}>
              Department
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#465249", fontWeight: 600 }}>
              {person.department}
            </Typography>

            <Typography sx={{ fontSize: "0.65rem", color: "#89948c" }}>Status</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#465249", fontWeight: 600 }}>
              {person.status || "Active"}
            </Typography>
          </Box>

          <Typography sx={{ mt: 0.5, color: "#959e97", fontSize: "0.6rem" }}>
            Profile information is sample data for this local demo.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: "0 20px 16px" }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // ── Form dialog (employee / leave / ticket) ─
  const config = configs[dialog.type];
  if (!config) return null;

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(dialog.type, values);
  };

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
            {config.title}
          </Typography>
          <Typography sx={{ mt: 0.5, color: "#879188", fontSize: "0.65rem" }}>
            {config.description}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={1.6}>
            {config.fields.map((field) => (
              <Box key={field.name}>
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: "#4d594f",
                    mb: 0.6,
                  }}
                >
                  {field.label}
                  {field.required && (
                    <Box component="span" sx={{ color: "#c66f54" }}>
                      {" "}
                      *
                    </Box>
                  )}
                </Typography>

                {field.type === "select" ? (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={values[field.name] || ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.7rem",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "#e0e6e0" },
                        "&:hover fieldset": { borderColor: "#9eb9a7" },
                        "&.Mui-focused fieldset": { borderColor: "#9eb9a7" },
                      },
                      "& .MuiInputBase-input": { py: 1, px: 1.2 },
                    }}
                  >
                    {field.options.map((opt) => (
                      <MenuItem key={opt} value={opt} sx={{ fontSize: "0.7rem" }}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : field.type === "textarea" ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    required={field.required}
                    value={values[field.name] || ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.7rem",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "#e0e6e0" },
                        "&:hover fieldset": { borderColor: "#9eb9a7" },
                        "&.Mui-focused fieldset": { borderColor: "#9eb9a7" },
                      },
                      "& .MuiInputBase-input": { py: 1, px: 1.2 },
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    type={field.type || "text"}
                    required={field.required}
                    value={values[field.name] || ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.7rem",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "#e0e6e0" },
                        "&:hover fieldset": { borderColor: "#9eb9a7" },
                        "&.Mui-focused fieldset": { borderColor: "#9eb9a7" },
                      },
                      "& .MuiInputBase-input": { py: 1, px: 1.2 },
                    }}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "flex-end",
            gap: 1,
            p: "13px 20px 17px",
            borderTop: "1px solid #edf0ec",
          }}
        >
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{config.submit}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}