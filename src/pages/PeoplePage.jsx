import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  Download,
  Search,
  PersonAddAlt as UserRoundPlus,
  Groups as UsersRound,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Button,
  PageHeader,
  Panel,
  StatCard,
} from "../components/PortalUI.jsx";

export default function PeoplePage({ people, departments: departmentOptions = [], query, onAction }) {
  const [search, setSearch] = useState(query || "");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");

  useEffect(() => setSearch(query || ""), [query]);

  const departments = [
    "All departments",
    ...new Set([...departmentOptions, ...people.map((person) => person.department).filter(Boolean)]),
  ];

  const filtered = useMemo(
    () =>
      people.filter(
        (person) =>
          `${person.name} ${person.role} ${person.department} ${person.email}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (department === "All departments" || person.department === department) &&
          (status === "All statuses" || person.status === status)
      ),
    [people, search, department, status]
  );

  function exportDirectory() {
    const content = [
      ["ID", "Name", "Role", "Department", "Email", "Employment type", "Start date", "Status"],
      ...filtered.map(({ id, name, role, department: team, email, employmentType, joined, status: state }) => [
        id,
        name,
        role,
        team,
        email,
        employmentType || "Full-time",
        joined || "",
        state,
      ]),
    ]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "people-directory.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        eyebrow="YOUR PEOPLE DIRECTORY"
        title="People"
        description="Get to know the people you work with."
        action={
          <Button icon={UserRoundPlus} onClick={() => onAction("employee")}>
            Add teammate
          </Button>
        }
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2.5}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 2 }}
      >
        <Box sx={{ width: { xs: "100%", md: 205 } }}>
          <StatCard
            label="Team members"
            value={people.length}
            note="Across the organization"
            icon={UsersRound}
            tone="green"
          />
        </Box>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack direction="row" sx={{ pl: 0.6 }}>
            {people.slice(0, 4).map((person) => (
              <Box
                key={person.id}
                sx={{
                  ml: -0.6,
                  "& .MuiAvatar-root": {
                    border: "2px solid #f5f7f4",
                    width: 28,
                    height: 28,
                    fontSize: "0.55rem",
                  },
                }}
              >
                <Avatar name={person.name} />
              </Box>
            ))}
          </Stack>
          <Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#465249" }}>
              Good teams start with people.
            </Typography>
            <Typography sx={{ fontSize: "0.6rem", color: "#89948c", mt: 0.4 }}>
              Browse the directory to find your next collaborator.
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Panel
        title={`Directory${
          filtered.length !== people.length ? ` · ${filtered.length} results` : ""
        }`}
        subtitle="Search by name, role, department or email."
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{
            px: 1.8,
            py: 1.5,
            borderBottom: "1px solid #edf0ec",
          }}
        >
          <TextField
            placeholder="Search the directory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", md: "min(290px, 45%)" },
              "& .MuiOutlinedInput-root": {
                fontSize: "0.65rem",
                borderRadius: 1,
                background: "#fff",
                "& fieldset": { borderColor: "#e5eae5" },
                "&:hover fieldset": { borderColor: "#9eb9a7" },
                "&.Mui-focused fieldset": { borderColor: "#9eb9a7" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 16, color: "#8d9890" }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: { xs: "space-between", md: "flex-end" } }}
          >
            <TextField
              select
              size="small"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{
                minWidth: 140,
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.65rem",
                  borderRadius: 1,
                  "& fieldset": { borderColor: "#e5eae5" },
                },
                "& .MuiInputBase-input": { py: 0.8, px: 1 },
              }}
            >
              {departments.map((d) => (
                <MenuItem key={d} value={d} sx={{ fontSize: "0.65rem" }}>
                  {d}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              <MenuItem value="All statuses" sx={{ fontSize: "0.65rem" }}>
                All statuses
              </MenuItem>
              <MenuItem value="Active" sx={{ fontSize: "0.65rem" }}>
                Active
              </MenuItem>
              <MenuItem value="On leave" sx={{ fontSize: "0.65rem" }}>
                On leave
              </MenuItem>
            </TextField>

            <Button
              variant="secondary"
              icon={Download}
              onClick={exportDirectory}
            >
              Export
            </Button>
          </Stack>
        </Stack>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 820 }}>
            <TableHead>
              <TableRow>
                <TableCell>TEAMMATE</TableCell>
                <TableCell>DEPARTMENT</TableCell>
                <TableCell>WORK EMAIL</TableCell>
                <TableCell>WORK TYPE</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>START DATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((person) => (
                <TableRow key={person.id} sx={{ "&:hover": { background: "#fcfdfb" } }}>
                  <TableCell>
                    <Stack
                      component="button"
                      type="button"
                      aria-label={`View ${person.name}'s employee details`}
                      direction="row"
                      alignItems="center"
                      spacing={1.1}
                      onClick={() => onAction("person", person)}
                      sx={{ cursor: "pointer", minWidth: 190, p: 0, border: 0, background: "transparent", textAlign: "left" }}
                    >
                      <Avatar name={person.name} />
                      <Box>
                        <Typography
                          sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#354138" }}
                        >
                          {person.name}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.6rem", color: "#8d978f", mt: 0.4 }}
                        >
                          {person.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 0.9,
                        py: 0.4,
                        border: "1px solid #e9ede9",
                        borderRadius: 0.6,
                        color: "#67736a",
                        fontSize: "0.6rem",
                      }}
                    >
                      {person.department}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box component="a" href={`mailto:${person.email}`} sx={{ color: "#52755a", fontSize: "0.65rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                      {person.email}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#78837b" }}>{person.employmentType || "Full-time"}</TableCell>
                  <TableCell>
                    <Badge tone={person.status === "Active" ? "green" : "orange"}>
                      {person.status}
                    </Badge>
                  </TableCell>
                  <TableCell sx={{ color: "#78837b" }}>{person.joined}</TableCell>
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
              No teammates match these filters. Try a different search.
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
          <span>
            Showing {filtered.length} of {people.length} teammates
          </span>
          <span>Directory updated today</span>
        </Stack>
      </Panel>
    </>
  );
}