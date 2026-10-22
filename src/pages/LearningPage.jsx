import React, { useRef, useState } from "react";
import {
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Delete,
  PlayArrow,
  School,
  UploadFile,
  Close as X,
  Image as ImageIcon,
  Movie as MovieIcon,
} from "@mui/icons-material";
import { Button, PageHeader, Panel } from "../components/PortalUI.jsx";

const categories = [
  "Getting started",
  "Tools & systems",
  "Safety & compliance",
  "Role training",
];

export default function LearningPage({ videos, onUpload, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [preview, setPreview] = useState(null);

  const fileInput = useRef(null);

  function handleFileChange(event) {
    const picked = event.target.files?.[0] || null;
    setFile(picked);

    if (picked) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(picked);
    } else {
      setFilePreview("");
    }
  }

  function submitVideo(event) {
    event.preventDefault();
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return;
    }

    onUpload(file, {
      title: title.trim(),
      description: description.trim(),
      category,
    });

    setTitle("");
    setDescription("");
    setCategory(categories[0]);
    setFile(null);
    setFilePreview("");
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <>
      <PageHeader
        eyebrow="EMPLOYEE DEVELOPMENT"
        title="Learning"
        description="Training videos and resources to help you grow in your role."
      />

      <Panel
        title="Training library"
        subtitle={`${videos.length} item${videos.length === 1 ? "" : "s"} available`}
      >
        {videos.length ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.5,
              p: 1.8,
            }}
          >
            {videos.map((video) => {
              const isImage = video.type?.startsWith("image/");
              const isVideo = video.type?.startsWith("video/");
              return (
                <Box
                  key={video.id}
                  sx={{
                    overflow: "hidden",
                    border: "1px solid #e7ece7",
                    borderRadius: 1.2,
                    background: "#fff",
                  }}
                >
                  {/* Media area */}
                  <Box
                    onClick={() => setPreview(video)}
                    sx={{
                      position: "relative",
                      aspectRatio: "16 / 9",
                      background: "#18231c",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    {isImage ? (
                      <Box
                        component="img"
                        src={video.data}
                        alt={video.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : isVideo ? (
                      <video
                        src={video.data}
                        preload="metadata"
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          background:
                            "linear-gradient(135deg, #234d3d, #315f49)",
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 45, color: "#c6dfaa" }} />
                      </Box>
                    )}

                    {/* Play overlay for videos */}
                    {isVideo && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          placeItems: "center",
                          background: "rgba(0,0,0,0.25)",
                          opacity: 0,
                          transition: "opacity .18s",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <PlayArrow
                            sx={{ fontSize: 30, color: "#27614e", ml: 0.3 }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Media type badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        px: 0.9,
                        py: 0.4,
                        borderRadius: 0.6,
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.4,
                      }}
                    >
                      {isImage ? (
                        <>
                          <ImageIcon sx={{ fontSize: 12 }} /> IMAGE
                        </>
                      ) : isVideo ? (
                        <>
                          <MovieIcon sx={{ fontSize: 12 }} /> VIDEO
                        </>
                      ) : null}
                    </Box>
                  </Box>

                  <Box sx={{ p: 1.5 }}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#303b33",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {video.title}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.45,
                            color: "#65806b",
                            fontSize: "0.58rem",
                            fontWeight: 600,
                          }}
                        >
                          {video.category} · Added {video.uploaded}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        aria-label={`Delete ${video.title}`}
                        onClick={() => onDelete(video.id)}
                        sx={{
                          color: "#a54e45",
                          "&:hover": { background: "#f7eded" },
                        }}
                      >
                        <Delete sx={{ fontSize: 17 }} />
                      </IconButton>
                    </Stack>
                    {video.description && (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#78837b",
                          fontSize: "0.62rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {video.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              minHeight: 170,
              placeItems: "center",
              p: 3,
              textAlign: "center",
            }}
          >
            <Box>
              <PlayArrow sx={{ color: "#81a28a", fontSize: 35 }} />
              <Typography
                sx={{
                  mt: 0.8,
                  color: "#465249",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                Your learning library is ready
              </Typography>
              <Typography
                sx={{ mt: 0.5, color: "#89948c", fontSize: "0.62rem" }}
              >
                New training media uploaded by your admin will appear here.
              </Typography>
            </Box>
          </Box>
        )}
      </Panel>

      <Panel
        title="Admin upload"
        subtitle="Add an image or video to the employee library"
        sx={{ mt: 1.8 }}
      >
        <Box
          component="form"
          onSubmit={submitVideo}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 1.4,
            p: 1.8,
          }}
        >
          <TextField
            label="Title"
            required
            size="small"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            sx={{
              "& .MuiInputBase-root, & .MuiInputLabel-root": {
                fontSize: "0.68rem",
              },
            }}
          />
          <TextField
            select
            label="Category"
            size="small"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            sx={{
              "& .MuiInputBase-root, & .MuiInputLabel-root": {
                fontSize: "0.68rem",
              },
            }}
          >
            {categories.map((item) => (
              <MenuItem key={item} value={item} sx={{ fontSize: "0.68rem" }}>
                {item}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            multiline
            minRows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            sx={{
              gridColumn: { md: "1 / -1" },
              "& .MuiInputBase-root, & .MuiInputLabel-root": {
                fontSize: "0.68rem",
              },
            }}
          />

          {/* File picker area */}
          <Stack spacing={1} sx={{ gridColumn: { md: "1 / -1" } }}>
            <input
              ref={fileInput}
              hidden
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <Typography
              sx={{ fontSize: "0.62rem", fontWeight: 600, color: "#4d594f" }}
            >
              Upload image or video
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 140,
                  aspectRatio: "16 / 9",
                  borderRadius: 1,
                  background: "#f0f4f0",
                  border: "1px dashed #c9d5ca",
                  overflow: "hidden",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {filePreview ? (
                  file?.type.startsWith("image/") ? (
                    <Box
                      component="img"
                      src={filePreview}
                      alt="Preview"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      src={filePreview}
                      muted
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )
                ) : (
                  <Stack alignItems="center" spacing={0.5}>
                    <ImageIcon sx={{ color: "#9daf9e", fontSize: 22 }} />
                    <MovieIcon sx={{ color: "#9daf9e", fontSize: 22 }} />
                  </Stack>
                )}
              </Box>
              <Stack spacing={0.8}>
                <Button
                  variant="secondary"
                  icon={UploadFile}
                  onClick={() => fileInput.current?.click()}
                  sx={{ justifyContent: "flex-start", width: "fit-content" }}
                >
                  {file ? file.name : "Choose a file"}
                </Button>
                <Typography
                  sx={{ color: "#89948c", fontSize: "0.58rem", maxWidth: 340 }}
                >
                  JPG, PNG, WebP, MP4, WebM or another browser-supported
                  image/video · Up to 2 MB in this local demo.
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Box sx={{ gridColumn: { md: "1 / -1" } }}>
            <Button
              type="submit"
              icon={School}
              disabled={!file}
            >
              Upload to library
            </Button>
          </Box>
        </Box>
      </Panel>

      {/* Full media preview dialog */}
      <MediaPreviewDialog item={preview} onClose={() => setPreview(null)} />
    </>
  );
}

function MediaPreviewDialog({ item, onClose }) {
  if (!item) return null;
  const isImage = item.type?.startsWith("image/");
  const isVideo = item.type?.startsWith("video/");

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "grid",
        placeItems: "center",
        p: 2,
        background: "rgba(15,24,18,0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "min(900px, 100%)",
          background: "#fff",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 1.5, borderBottom: "1px solid #edf0ec" }}
        >
          <Typography
            sx={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "0.85rem" }}
          >
            {item.title}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <X sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
        <Box sx={{ background: "#000" }}>
          {isImage ? (
            <Box
              component="img"
              src={item.data}
              alt={item.title}
              sx={{
                width: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : isVideo ? (
            <Box sx={{ aspectRatio: "16 / 9" }}>
              <video
                src={item.data}
                controls
                autoPlay
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: "center", color: "#fff" }}>
              <Typography sx={{ fontSize: "0.75rem" }}>
                Preview not available.
              </Typography>
            </Box>
          )}
        </Box>
        {item.description && (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#465249" }}>
              {item.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}