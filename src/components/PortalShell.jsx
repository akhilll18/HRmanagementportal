import React, { useState } from "react";
import { Bell, CalendarCheck2, ChartNoAxesColumnIncreasing, Clock3, Files, LayoutDashboard, LifeBuoy, Menu, Search, UserRoundPlus, UsersRound, WalletCards, X } from "lucide-react";
import { navigation, notifications } from "../data/peopleHubData.js";
import { theme } from "../theme.js";
import { Avatar, IconButton } from "./PortalUI.jsx";

const iconMap = { LayoutDashboard, UsersRound, Clock3, CalendarCheck2, WalletCards, ChartNoAxesColumnIncreasing, UserRoundPlus, Files, LifeBuoy };
const iconNames = { timeoff: "CalendarCheck2" };

export default function PortalShell({ page, onNavigate, onSearch, onProfile, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const groups = ["Workspace", "Company"];

  function submitSearch(event) {
    event.preventDefault();
    onSearch(search.trim());
    setMobileOpen(false);
  }

  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand-row"><span className="brand-mark">p</span><div className="brand-name">{theme.productName}<small>{theme.workspaceName}</small></div><IconButton label="Close navigation" className="sidebar-close" onClick={() => setMobileOpen(false)}><X size={17} /></IconButton></div>
      {groups.map((group) => <React.Fragment key={group}><div className={`sidebar-caption ${group === "Company" ? "company-caption" : ""}`}>{group === "Workspace" ? "YOUR WORKSPACE" : "PEOPLE & CULTURE"}</div><nav className="side-nav" aria-label={`${group} navigation`}>{navigation.filter((item) => item.group === group).map((item) => { const Icon = iconMap[iconNames[item.id] || item.icon]; return <button key={item.id} className={`nav-item ${page === item.id ? "is-active" : ""}`} onClick={() => { onNavigate(item.id); setMobileOpen(false); }}><Icon size={17} /><span>{item.label}</span>{page === item.id && <i className="nav-marker" />}</button>; })}</nav></React.Fragment>)}
      <div className="sidebar-bottom"><div className="workspace-status"><i className="status-dot" /><div><strong>All systems normal</strong><small>Workspace sync is up to date</small></div></div><button className="sidebar-profile" onClick={onProfile}><Avatar name={theme.currentUser.name} /><span><strong>{theme.currentUser.shortName}</strong><small>{theme.currentUser.role}</small></span><span className="profile-more">•••</span></button></div>
    </aside>
    <main className="main-area"><header className="topbar"><IconButton label="Open navigation" className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></IconButton><div className="breadcrumb"><span>{theme.workspaceName}</span><i>/</i><strong>{navigation.find((item) => item.id === page)?.label || "Overview"}</strong></div><div className="topbar-actions"><form className="global-search" onSubmit={submitSearch}><Search size={16} /><input aria-label="Search people" placeholder="Search people..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>Enter</kbd></form><div className="notification-wrap"><IconButton label="Notifications" className={notificationsOpen ? "icon-selected" : ""} onClick={() => setNotificationsOpen((value) => !value)}><Bell size={18} /><i className="notification-dot" /></IconButton>{notificationsOpen && <div className="notification-popover"><div className="popover-heading"><div><strong>Notifications</strong><small>Latest updates for you</small></div><span className="new-count">3 new</span></div>{notifications.map((item) => <div className="notification-item" key={item.title}><span className="notification-icon"><Bell size={15} /></span><div><strong>{item.title}</strong><small>{item.detail}</small></div></div>)}<button className="popover-footer" onClick={() => { setNotificationsOpen(false); onNavigate("timeoff"); }}>Open my updates</button></div>}</div><span className="topbar-divider" /><button className="topbar-user" onClick={onProfile}><Avatar name={theme.currentUser.name} /><span className="topbar-user-name">{theme.currentUser.shortName}</span></button></div></header><div className="page-content">{children}<footer className="page-footer"><span>PeopleHub workspace</span><span>Demo data · Changes are saved in this browser</span></footer></div></main>
  </div>;
}