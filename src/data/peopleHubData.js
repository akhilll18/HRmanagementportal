export const navigation = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard", group: "Workspace" },
  { id: "people", label: "People", icon: "UsersRound", group: "Workspace" },
  { id: "attendance", label: "Attendance", icon: "Clock3", group: "Workspace" },
  { id: "timeoff", label: "Request leave", icon: "CalendarDays", group: "Workspace" },
  { id: "pay", label: "Pay", icon: "WalletCards", group: "Company" },
  { id: "documents", label: "Documents", icon: "Files", group: "Company" },
  { id: "support", label: "HR support", icon: "LifeBuoy", group: "Company" },
];

export const employees = [
  { id: "EMP001", name: "Akhil Reddy", role: "MuleSoft Developer", department: "Engineering", email: "akhil@example.com", status: "Active", joined: "Jun 12, 2025" },
  { id: "EMP002", name: "Swetha Reddy", role: "People Operations Partner", department: "People", email: "swetha@example.com", status: "Active", joined: "Jan 03, 2024" },
  { id: "EMP003", name: "Rahul Kumar", role: "Senior Accountant", department: "Finance", email: "rahul@example.com", status: "Active", joined: "Sep 17, 2023" },
  { id: "EMP004", name: "Ananya Sharma", role: "Software Engineer", department: "Engineering", email: "ananya@example.com", status: "On leave", joined: "Mar 21, 2025" },
  { id: "EMP005", name: "Vikram Singh", role: "Operations Lead", department: "Operations", email: "vikram@example.com", status: "Active", joined: "Feb 14, 2024" },
  { id: "EMP006", name: "Priya Nair", role: "Product Designer", department: "Design", email: "priya@example.com", status: "Active", joined: "Nov 06, 2024" },
];

export const leaveRequests = [
  { id: "LV-204", type: "Casual leave", start: "Oct 23, 2026", end: "Oct 23, 2026", days: 1, status: "Approved", requested: "Oct 02, 2026" },
  { id: "LV-203", type: "Sick leave", start: "Oct 15, 2026", end: "Oct 16, 2026", days: 2, status: "Pending", requested: "Oct 09, 2026" },
  { id: "LV-198", type: "Casual leave", start: "Sep 04, 2026", end: "Sep 04, 2026", days: 1, status: "Approved", requested: "Aug 27, 2026" },
];

export const attendanceDays = [
  { day: "Mon", date: "Oct 05", hours: 8.2, label: "8h 12m" },
  { day: "Tue", date: "Oct 06", hours: 8.8, label: "8h 48m" },
  { day: "Wed", date: "Oct 07", hours: 7.6, label: "7h 36m" },
  { day: "Thu", date: "Oct 08", hours: 8.5, label: "8h 30m" },
  { day: "Fri", date: "Oct 09", hours: 7.9, label: "7h 54m" },
];

export const payslips = [
  { month: "September 2026", gross: 58333, deductions: 6200, net: 52133, status: "Paid" },
  { month: "August 2026", gross: 58333, deductions: 6200, net: 52133, status: "Paid" },
  { month: "July 2026", gross: 58333, deductions: 6200, net: 52133, status: "Paid" },
  { month: "June 2026", gross: 55000, deductions: 5800, net: 49200, status: "Paid" },
];

export const documents = [
  { name: "Employee handbook", category: "Policies", updated: "Updated Sep 12, 2026", description: "Workplace guidelines, benefits and company policies." },
  { name: "Remote work policy", category: "Policies", updated: "Updated Aug 28, 2026", description: "Guidelines for working remotely and requesting equipment." },
  { name: "Tax declaration form", category: "Payroll", updated: "Updated Apr 02, 2026", description: "Annual tax declaration and investment proof details." },
  { name: "Benefits overview", category: "Benefits", updated: "Updated Jan 15, 2026", description: "Health, wellbeing and employee benefit information." },
  { name: "Expense reimbursement guide", category: "Finance", updated: "Updated Jun 20, 2026", description: "How to submit and track business expense claims." },
];

export const tickets = [
  { id: "HR-1024", subject: "Question about my payslip", category: "Payroll", created: "Oct 10, 2026", status: "In progress" },
  { id: "HR-1018", subject: "Update emergency contact", category: "Personal details", created: "Oct 06, 2026", status: "Open" },
  { id: "HR-1007", subject: "Leave balance clarification", category: "Time off", created: "Sep 28, 2026", status: "Resolved" },
];

export const notifications = [
  { title: "Your October payslip is ready", detail: "Payroll · 2 hours ago" },
  { title: "Time-off request approved", detail: "People team · Yesterday" },
  { title: "Your leave request is awaiting review", detail: "People team · Oct 09" },
];