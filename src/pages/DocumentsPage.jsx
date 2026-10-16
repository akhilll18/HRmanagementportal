import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Download as ArrowDownToLine,
  Description as FileText,
  Search,
} from "@mui/icons-material";
import { documents as seedDocuments } from "../data/peopleHubData.js";
import { Badge, EmptyState, PageHeader } from "../components/PortalUI.jsx";

function downloadFile(name, content) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DocumentsPage() {
  const [category, setCategory] = useState("All documents");
  const [query, setQuery] = useState("");

  const categories = [
    "All documents",
    ...new Set(seedDocuments.map((d) => d.category)),
  ];

  const filtered = useMemo(
    () =>
      seedDocuments.filter(
        (document) =>
          (category === "All documents" || document.category === category) &&
          `${document.name} ${document.category}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [category, query]
  );

  const colorPalette = [
    { bg: "#eaf2ec", color: "#517c5d" },
    { bg: "#fcf0e8", color: "#bd7952" },
    { bg: "#eaf1f7", color: "#5b829f" },
    { bg: "#f5edef", color: "#a76e73" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="YOUR REFERENCE LIBRARY"
        title="Documents"
        description="Company policies, benefits and useful forms in one place."
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={1.5}
        sx={{ mb: 1.8, mt: 0.7 }}
      >
        <TextField
          placeholder="Find a document..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{
            width: { xs: "100%", md: 250 },
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
          spacing={0.4}
          sx={{
            p: 0.4,
            border: "1px solid #e5eae5",
            borderRadius: 1,
            background: "#fff",
            overflowX: "auto",
            justifyContent: { xs: "flex-start", md: "center" },
          }}
        >
          {categories.map((item) => {
            const active = category === item;
            return (
              <Box
                key={item}
                onClick={() => setCategory(item)}
                sx={{
                  flexShrink: 0,
                  px: 1.2,
                  py: 0.7,
                  borderRadius: 0.6,
                  background: active ? "#eaf2ec" : "transparent",
                  color: active ? "#39644a" : "#7e8981",
                  fontSize: "0.6rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                  transition: "background 0.15s",
                }}
              >
                {item}
              </Box>
            );
          })}
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        {filtered.map((document, index) => {
          const tone = colorPalette[index % 4];
          return (
            <Box
              key={document.name}
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 194,
                p: 2,
                border: "1px solid #e6ebe5",
                borderRadius: 1,
                background: "#fff",
                boxShadow: "0 1px 2px rgba(30,46,34,0.02)",
                transition: "border-color 0.16s, transform 0.16s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: "#cfdbd0",
                },
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  mb: 1.6,
                  borderRadius: 1,
                  background: tone.bg,
                  color: tone.color,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <FileText sx={{ fontSize: 19 }} />
              </Box>
              <Box>
                <Badge>{document.category}</Badge>
              </Box>
              <Typography
                sx={{
                  mt: 1.1,
                  mb: 0.6,
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: "#354139",
                }}
              >
                {document.name}
              </Typography>
              <Typography
                sx={{
                  flex: 1,
                  color: "#818c84",
                  fontSize: "0.6rem",
                  lineHeight: 1.6,
                }}
              >
                {document.description}
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{
                  mt: 1.7,
                  pt: 1.2,
                  borderTop: "1px solid #eff1ee",
                  color: "#9aa39b",
                  fontSize: "0.55rem",
                }}
              >
                <span>{document.updated}</span>
                <Box
                  component="button"
                  onClick={() =>
                    downloadFile(
                      `${document.name.toLowerCase().replaceAll(" ", "-")}.txt`,
                      `${document.name}\n\n${document.description}\n\nSample PeopleHub document.`
                    )
                  }
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    p: 0,
                    border: 0,
                    background: "transparent",
                    color: "#52755a",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <ArrowDownToLine sx={{ fontSize: 15 }} /> Download
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Box>

      {filtered.length === 0 && (
        <EmptyState
          title="No documents found"
          description="Try another search or category."
        />
      )}
    </>
  );
}