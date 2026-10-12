import React, { useEffect, useMemo, useState } from "react";
import { Download, Search, UserRoundPlus, UsersRound } from "lucide-react";
import { Avatar, Badge, Button, PageHeader, Panel, StatCard } from "../components/PortalUI.jsx";

export default function PeoplePage({ people, query, onAction }) {
  const [search, setSearch] = useState(query || "");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");
  useEffect(() => setSearch(query || ""), [query]);
  const departments = ["All departments", ...new Set(people.map((person) => person.department))];
  const filtered = useMemo(() => people.filter((person) => `${person.name} ${person.role} ${person.department} ${person.email}`.toLowerCase().includes(search.toLowerCase()) && (department === "All departments" || person.department === department) && (status === "All statuses" || person.status === status)), [people, search, department, status]);

  function exportDirectory() {
    const content = [["ID", "Name", "Role", "Department", "Email", "Status"], ...filtered.map(({ id, name, role, department: team, email, status: state }) => [id, name, role, team, email, state])].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "people-directory.csv"; link.click(); URL.revokeObjectURL(url);
  }

  return <><PageHeader eyebrow="YOUR PEOPLE DIRECTORY" title="People" description="Get to know the people you work with." action={<Button icon={UserRoundPlus} onClick={() => onAction("employee")}>Add teammate</Button>} />
    <div className="people-summary"><StatCard label="Team members" value={people.length} note="Across the organization" icon={UsersRound} tone="green" /><div className="summary-copy"><span className="summary-avatars">{people.slice(0, 4).map((person) => <Avatar name={person.name} key={person.id} />)}</span><span><strong>Good teams start with people.</strong><small>Browse the directory to find your next collaborator.</small></span></div></div>
    <Panel title={`Directory${filtered.length !== people.length ? ` · ${filtered.length} results` : ""}`} subtitle="Search by name, role, department or email."><div className="directory-toolbar"><label className="field-search"><Search size={16} /><input aria-label="Search directory" placeholder="Search the directory..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>/</kbd></label><div className="toolbar-filters"><select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)}>{departments.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>On leave</option></select><Button variant="secondary" icon={Download} onClick={exportDirectory}>Export</Button></div></div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>TEAMMATE</th><th>DEPARTMENT</th><th>WORK EMAIL</th><th>STATUS</th><th>START DATE</th></tr></thead><tbody>{filtered.map((person) => <tr key={person.id}><td><button className="person-open" onClick={() => onAction("person", person)}><Avatar name={person.name} /><span><strong>{person.name}</strong><small>{person.role}</small></span></button></td><td><span className="department-label">{person.department}</span></td><td className="email-cell">{person.email}</td><td><Badge tone={person.status === "Active" ? "green" : "orange"}>{person.status}</Badge></td><td className="date-cell">{person.joined}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="table-empty">No teammates match these filters. Try a different search.</div>}</div><div className="table-foot"><span>Showing {filtered.length} of {people.length} teammates</span><span>Directory updated today</span></div></Panel>
  </>;
}