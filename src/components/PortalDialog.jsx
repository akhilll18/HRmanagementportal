import React, { useEffect } from "react";
import { Button, ModalFrame } from "./PortalUI.jsx";
import { theme } from "../theme.js";

const configs = {
  employee: { title: "Add a teammate", description: "Create a people directory entry.", submit: "Add teammate", fields: [{ name: "name", label: "Full name", required: true }, { name: "email", label: "Work email", type: "email", required: true }, { name: "department", label: "Department", type: "select", options: ["Engineering", "People", "Finance", "Operations", "Design", "Marketing"] }, { name: "role", label: "Job title", required: true }] },
  leave: { title: "Request time off", description: "Your manager will be notified when you submit.", submit: "Send request", fields: [{ name: "type", label: "Leave type", type: "select", options: ["Casual leave", "Sick leave", "Annual leave", "Unpaid leave"] }, { name: "start", label: "Start date", type: "date", required: true }, { name: "end", label: "End date", type: "date", required: true }, { name: "note", label: "Note for your manager", type: "textarea" }] },
  ticket: { title: "Contact HR support", description: "Tell the People team what you need help with.", submit: "Create ticket", fields: [{ name: "subject", label: "What do you need help with?", required: true }, { name: "category", label: "Category", type: "select", options: ["Payroll", "Time off", "Personal details", "Benefits", "Other"] }, { name: "description", label: "Details", type: "textarea", required: true }] },
  role: { title: "Open a new role", description: "Add a role to the hiring pipeline.", submit: "Create role", fields: [{ name: "title", label: "Role title", required: true }, { name: "department", label: "Department", type: "select", options: ["Engineering", "People", "Finance", "Operations", "Design", "Marketing"] }, { name: "location", label: "Location", required: true }] },
  goal: { title: "Add a goal", description: "Keep a clear outcome and a realistic target date.", submit: "Add goal", fields: [{ name: "title", label: "Goal", required: true }, { name: "area", label: "Focus area", type: "select", options: ["Delivery", "Quality", "Collaboration", "Learning"] }, { name: "due", label: "Target date", type: "date", required: true }] },
};

export default function PortalDialog({ dialog, onClose, onSubmit }) {
  useEffect(() => {
    function onKey(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!dialog) return null;
  if (dialog.type === "profile" || dialog.type === "person") {
    const person = dialog.data || { ...theme.currentUser, id: theme.currentUser.employeeId, status: "Active" };
    const initials = person.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    return <ModalFrame title={dialog.type === "profile" ? "Your profile" : person.name} description="People directory details." onClose={onClose} footer={<Button variant="secondary" onClick={onClose}>Close</Button>}><div className="profile-card"><span className="profile-avatar">{initials}</span><div><strong>{person.name}</strong><small>{person.role}</small></div></div><div className="profile-details"><span>Work email</span><strong>{person.email}</strong><span>Employee ID</span><strong>{person.id}</strong><span>Department</span><strong>{person.department}</strong><span>Status</span><strong>{person.status || "Active"}</strong></div><p className="demo-note">Profile information is sample data for this local demo.</p></ModalFrame>;
  }

  const config = configs[dialog.type];
  if (!config) return null;
  function submit(event) { event.preventDefault(); onSubmit(dialog.type, Object.fromEntries(new FormData(event.currentTarget).entries())); }
  return <ModalFrame title={config.title} description={config.description} onClose={onClose}><form className="action-form" onSubmit={submit}>{config.fields.map((field) => <label className="field" key={field.name}><span>{field.label}{field.required && <i> *</i>}</span>{field.type === "select" ? <select name={field.name} defaultValue={field.options[0]}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea name={field.name} required={field.required} rows="3" /> : <input name={field.name} type={field.type || "text"} required={field.required} />}</label>)}<div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">{config.submit}</Button></div></form></ModalFrame>;
}