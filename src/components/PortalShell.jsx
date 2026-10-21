import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton as MuiIconButton,
  InputBase,
  Badge as MuiBadge,
  Popover,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Notifications as Bell,
  EventAvailable as CalendarCheck2,
  AccessTime as Clock3,
  Folder as Files,
  Dashboard as LayoutDashboard,
  Support as LifeBuoy,
  Logout as LogOut,
  Menu,
  Search,
  Groups as UsersRound,
  AccountBalanceWallet as WalletCards,
  AccountTree,
  Close as X,
} from "@mui/icons-material";
import { navigation, notifications } from "../data/peopleHubData.js";
import { theme } from "../theme.js";
import { Avatar } from "./PortalUI.jsx";

const iconMap = {
  LayoutDashboard,
  UsersRound,
  Clock3,
  CalendarCheck2,
  WalletCards,
  Files,
  LifeBuoy,
  AccountTree,
};
const iconNames = { timeoff: "CalendarCheck2" };
const DRAWER_WIDTH = 250;

export default function PortalShell({
  page,
  onNavigate,
  onSearch,
  onProfile,
  onLogout,
  children,
}) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [notifAnchor, setNotifAnchor] = useState(null);

  const groups = ["Workspace", "Company"];

  function submitSearch(e) {
    e.preventDefault();
    onSearch(search.trim());
    setMobileOpen(false);
  }

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: collapsed ? "21px 9px 13px" : "21px 14px 13px",
        background: "#fbfcfa",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ px: 1, pb: 3.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px 10px 10px 3px",
            background: "#27614e",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontFamily: "Manrope",
            fontWeight: 800,
            fontSize: "1.4rem",
            pb: 0.5,
          }}
        >
          p
        </Box>
        {!collapsed && <Box>
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 800,
              fontSize: "0.9rem",
              color: "#202922",
              lineHeight: 1.15,
            }}
          >
            {theme.productName}
          </Typography>
          <Typography sx={{ fontSize: "0.6rem", color: "#78827b", mt: 0.5 }}>
            {theme.workspaceName}
          </Typography>
        </Box>}
        {isMobile && (
          <MuiIconButton
            size="small"
            onClick={() => setMobileOpen(false)}
            sx={{ ml: "auto" }}
          >
            <X sx={{ fontSize: 17 }} />
          </MuiIconButton>
        )}
      </Stack>

      {groups.map((group) => (
        <Box key={group} sx={{ mb: 2 }}>
          {!collapsed && <Typography
            sx={{
              px: 1.2,
              pb: 1,
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "1.1px",
              color: "#a1aaa3",
            }}
          >
            {group === "Workspace" ? "YOUR WORKSPACE" : "PEOPLE & CULTURE"}
          </Typography>}
          <List disablePadding>
            {navigation
              .filter((item) => item.group === group)
              .map((item) => {
                const Icon = iconMap[iconNames[item.id] || item.icon];
                const active = page === item.id;
                return (
                  <ListItemButton
                    key={item.id}
                    title={collapsed ? item.label : undefined}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileOpen(false);
                    }}
                    sx={{
                      position: "relative",
                      minHeight: 37,
                      px: 1.2,
                      borderRadius: 1,
                      color: active ? "primary.main" : "#66716a",
                      background: active ? "#eaf2ed" : "transparent",
                      "&:hover": {
                        background: active ? "#eaf2ed" : "#f0f4f0",
                        color: active ? "primary.main" : "#202922",
                      },
                      mb: 0.4,
                    }}
                  >
                    {active && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 10,
                          bottom: 10,
                          width: 2,
                          borderRadius: 1,
                          background: "primary.main",
                        }}
                      />
                    )}
                    <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
                      <Icon sx={{ fontSize: 17 }} />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ display: collapsed ? "none" : "block" }}
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "0.75rem",
                        fontWeight: active ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                );
              })}
          </List>
        </Box>
      ))}

      <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.4 }}>
      

        <Divider />

        <ListItemButton onClick={onProfile} sx={{ px: 1, borderRadius: 1, gap: 1 }}>
          <Avatar name={theme.currentUser.name} />
          {!collapsed && <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {theme.currentUser.shortName}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.55rem",
                color: "#78827b",
                mt: 0.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {theme.currentUser.role}
            </Typography>
          </Box>}
        </ListItemButton>

        {onLogout && (
          <ListItemButton
            onClick={onLogout}
            sx={{
              px: 1.2,
              minHeight: 37,
              borderRadius: 1,
              color: "#66716a",
              "&:hover": { background: "#f0f4f0", color: "#202922" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
              <LogOut sx={{ fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText
              sx={{ display: collapsed ? "none" : "block" }}
              primary="Sign out"
              primaryTypographyProps={{ fontSize: "0.75rem" }}
            />
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box component="nav" sx={{ width: { md: collapsed ? 72 : DRAWER_WIDTH }, flexShrink: { md: 0 }, transition: "width .18s ease" }}>
        {isMobile ? (
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: "min(280px, 84vw)", boxSizing: "border-box" },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              "& .MuiDrawer-paper": {
                width: collapsed ? 72 : DRAWER_WIDTH,
                boxSizing: "border-box",
                borderRight: "1px solid #e7ebe6",
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "rgba(255,255,255,0.93)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e9ede8",
            color: "#202922",
          }}
        >
          <Toolbar
            sx={{
              minHeight: { xs: 57, md: 62 },
              px: { xs: 1.5, md: 3.5 },
              gap: 1.5,
            }}
          >
            {!isMobile && (
              <MuiIconButton size="small" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed((value) => !value)}>
                <Menu sx={{ fontSize: 20 }} />
              </MuiIconButton>
            )}
            {isMobile && (
              <MuiIconButton size="small" onClick={() => setMobileOpen(true)}>
                <Menu sx={{ fontSize: 20 }} />
              </MuiIconButton>
            )}

            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.65rem", color: "#8a948d" }}>
                {theme.workspaceName}
              </Typography>
              <Typography sx={{ color: "#c8cec9" }}>/</Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#3d4941" }}>
                {navigation.find((i) => i.id === page)?.label || "Overview"}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                component="form"
                onSubmit={submitSearch}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  width: 230,
                  height: 34,
                  alignItems: "center",
                  gap: 1,
                  px: 1.2,
                  border: "1px solid #e8ece8",
                  borderRadius: 1,
                  background: "#fafbf9",
                  color: "#8a948d",
                  "&:focus-within": {
                    borderColor: "#9eb9a7",
                    boxShadow: "0 0 0 3px rgba(78,129,96,0.09)",
                  },
                }}
              >
                <Search sx={{ fontSize: 16 }} />
                <InputBase
                  placeholder="Search people..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ fontSize: "0.65rem", flex: 1 }}
                />
                <Typography
                  sx={{
                    fontSize: "0.55rem",
                    border: "1px solid #e4e8e4",
                    borderRadius: 0.5,
                    px: 0.6,
                    py: 0.2,
                    color: "#9aa39c",
                  }}
                >
                  Enter
                </Typography>
              </Box>

              <MuiIconButton
                size="small"
                onClick={(e) => setNotifAnchor(e.currentTarget)}
                sx={{ color: "#66716a", "&:hover": { background: "#f1f4f0" } }}
              >
                <MuiBadge color="secondary" variant="dot" overlap="circular">
                  <Bell sx={{ fontSize: 18 }} />
                </MuiBadge>
              </MuiIconButton>

              <Popover
                open={Boolean(notifAnchor)}
                anchorEl={notifAnchor}
                onClose={() => setNotifAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { width: 330, mt: 1, borderRadius: 1.5 } }}
              >
                <Box
                  sx={{
                    p: 2,
                    pb: 1.5,
                    borderBottom: "1px solid #edf0ec",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
                      Notifications
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem", color: "#78827b", mt: 0.3 }}>
                      Latest updates for you
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 0.5,
                      background: "#edf4ee",
                      color: "primary.main",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                    }}
                  >
                    3 new
                  </Box>
                </Box>

                {notifications.map((item) => (
                  <Box
                    key={item.title}
                    sx={{
                      display: "flex",
                      gap: 1.2,
                      p: "12px 15px",
                      borderBottom: "1px solid #f0f2ef",
                    }}
                  >
                    <Box
                      sx={{
                        width: 27,
                        height: 27,
                        borderRadius: 1,
                        background: "#edf3ee",
                        color: "primary.main",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Bell sx={{ fontSize: 15 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.6rem", color: "#78827b", mt: 0.4 }}>
                        {item.detail}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Box
                  onClick={() => {
                    setNotifAnchor(null);
                    onNavigate("timeoff");
                  }}
                  sx={{
                    p: 1.4,
                    textAlign: "center",
                    background: "#fbfcfa",
                    color: "primary.main",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Open my updates
                </Box>
              </Popover>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={onProfile}
                sx={{ cursor: "pointer" }}
              >
                <Avatar name={theme.currentUser.name} />
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {theme.currentUser.shortName}
                </Typography>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 1370,
            mx: "auto",
            p: { xs: "21px 14px 10px", md: "29px 34px 12px" },
            backgroundImage: "radial-gradient(#dfe5df 0.55px, transparent 0.55px)",
            backgroundSize: "19px 19px",
          }}
        >
          {children}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              mt: 3.5,
              pt: 2,
              borderTop: "1px solid #e5eae4",
              color: "#9ba49d",
              fontSize: "0.55rem",
            }}
          >
            <span>PeopleHub workspace</span>
            <span>Demo data · Changes are saved in this browser</span>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}