import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { AccountTree, PersonAddAlt } from "@mui/icons-material";
import { Avatar, Button, PageHeader } from "../components/PortalUI.jsx";

export default function OrganizationPage({ people, onAction }) {
  const departments = Object.entries(
    people.reduce((groups, person) => {
      const name = person.department || "Other";
      groups[name] = [...(groups[name] || []), person];
      return groups;
    }, {})
  );

  return (
    <>
      <PageHeader
        eyebrow="PEOPLE & REPORTING LINES"
        title="Organization chart"
        description="Explore teams, managers and reporting groups."
        action={<Button icon={PersonAddAlt} onClick={() => onAction("employee")}>Onboard employee</Button>}
      />

      <Box sx={{ overflowX: "auto", pb: 2 }}>
        <Box sx={{ minWidth: Math.max(760, departments.length * 190), py: 2 }}>
          <Box sx={{ display: "grid", justifyItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, px: 2, py: 1.2, border: "2px solid #4b8060", borderRadius: 1, background: "#fff", boxShadow: "0 5px 16px rgba(38,78,54,.08)" }}>
              <AccountTree sx={{ color: "#4b8060", fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "0.78rem", color: "#304036" }}>Leadership team</Typography>
                <Typography sx={{ mt: 0.25, fontSize: "0.58rem", color: "#839087" }}>{people.length} employees · {departments.length} teams</Typography>
              </Box>
            </Box>
            <Box sx={{ width: 2, height: 30, background: "linear-gradient(#4b8060 0 50%, transparent 50%)", backgroundSize: "2px 10px", animation: "lineFlow 0.8s linear infinite", "@keyframes lineFlow": { to: { backgroundPosition: "0 10px" } } }} />
          </Box>

          <Box sx={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${Math.max(departments.length, 1)}, minmax(170px, 1fr))`, gap: 1.2, pt: 2.2, "&::before": { content: '""', position: "absolute", top: 0, left: "8%", right: "8%", height: 2, background: "linear-gradient(90deg, #c8d9cb 0%, #5d9068 45%, #c8d9cb 100%)", backgroundSize: "200% 100%", animation: "railFlow 2.5s linear infinite", "@keyframes railFlow": { to: { backgroundPosition: "-200% 0" } } } }}>
            {departments.map(([department, members]) => {
              const lead = members[0];
              const leadLabel = /\b(lead|manager|director|head)\b/i.test(lead.role)
                ? "Team lead"
                : "Team representative";
              return (
                <Box key={department} sx={{ position: "relative", minWidth: 0, "&::before": { content: '""', position: "absolute", left: "50%", top: -18, height: 18, width: 2, background: "#75a17d", animation: "lineFlow 0.8s linear infinite" } }}>
                  <Box sx={{ minHeight: 84, p: 1.2, border: "1px solid #dfe8df", borderTop: `3px solid ${department === "Engineering" ? "#6688a1" : department === "People" ? "#b5777a" : "#6e9870"}`, borderRadius: 1, background: "#fff" }}>
                    <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#354138" }}>{department}</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 1 }}>
                      <Avatar name={lead.name} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ overflow: "hidden", fontSize: "0.58rem", fontWeight: 700, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</Typography>
                        <Typography sx={{ mt: 0.25, color: "#89948c", fontSize: "0.54rem" }}>{leadLabel} · {lead.role}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box sx={{ width: 2, height: 22, mx: "auto", background: "linear-gradient(#75a17d 0 50%, transparent 50%)", backgroundSize: "2px 8px", animation: "lineFlow 0.8s linear infinite" }} />
                  <Box sx={{ p: 1, border: "1px solid #e7ece7", borderRadius: 1, background: "#fbfcfa" }}>
                    <Typography sx={{ mb: 0.7, color: "#7b867e", fontSize: "0.52rem", fontWeight: 700, textTransform: "uppercase" }}>{department} team · {members.length}</Typography>
                    {members.map((person) => (
                      <Box key={person.id} sx={{ display: "flex", alignItems: "center", gap: 0.7, py: 0.65, borderTop: "1px solid #edf0ec" }}>
                        <Box sx={{ width: 5, height: 5, flexShrink: 0, borderRadius: "50%", background: "#6f9b76" }} />
                        <Typography sx={{ overflow: "hidden", flex: 1, color: "#465249", fontSize: "0.57rem", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{person.name}</Typography>
                        <Typography sx={{ overflow: "hidden", color: "#929c94", fontSize: "0.52rem", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{person.role}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}