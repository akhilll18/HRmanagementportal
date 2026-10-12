import React from "react";
import { ArrowUpRight, Check, ChevronRight, CircleHelp, X } from "lucide-react";

export function Button({ children, variant = "primary", icon: Icon, className = "", ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{Icon && <Icon size={16} />}{children}</button>;
}

export function IconButton({ children, label, ...props }) {
  return <button className="icon-button" aria-label={label} title={label} {...props}>{children}</button>;
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}

export function Panel({ title, subtitle, action, className = "", children }) {
  return <section className={`panel ${className}`}>{(title || action) && <div className="panel-header"><div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div>{action}</div>}{children}</section>;
}

export function StatCard({ label, value, note, icon: Icon, tone = "green" }) {
  return <div className="stat-card"><span className={`stat-icon tone-${tone}`}><Icon size={17} /></span><span className="stat-label">{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}><i />{children}</span>;
}

export function Avatar({ name, size = "normal" }) {
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <span className={`avatar avatar-${size}`} title={name}>{initials}</span>;
}

export function ChevronAction({ children, onClick }) {
  return <button className="subtle-action" onClick={onClick}>{children}<ChevronRight size={15} /></button>;
}

export function EmptyState({ title, description, action }) {
  return <div className="empty-state"><CircleHelp size={22} /><strong>{title}</strong><p>{description}</p>{action}</div>;
}

export function ModalFrame({ title, description, onClose, children, footer }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><header className="modal-header"><div><h2 id="dialog-title">{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></header><div className="modal-content">{children}</div>{footer && <footer className="modal-footer">{footer}</footer>}</section></div>;
}

export function LinkButton({ children, onClick }) {
  return <button className="link-button" onClick={onClick}>{children}<ArrowUpRight size={14} /></button>;
}

export function SuccessMark() {
  return <span className="success-mark"><Check size={13} /></span>;
}