export const mockUser = {
  id: 1,
  name: "John",
  role: "Family",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
};

export const familyMembers = [
  { id: 1, name: "John", relation: "Son", role: "Family", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Sarah", relation: "Daughter", role: "Family", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 3, name: "Martha", relation: "Nurse", role: "Professional", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
  { id: 4, name: "Chloe", relation: "Granddaughter", role: "Family", avatar: "https://randomuser.me/api/portraits/women/22.jpg" }
];

export const patientInfo = {
  name: "Mrs. Mary Smith",
  age: 82,
  status: "Everything looks good today",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
};

export const urgencyConfig = {
  NORMAL: { id: 'NORMAL', label: 'All Good', color: '#10b981', bg: '#dcfce7' },
  ATTENTION: { id: 'ATTENTION', label: 'Needs Attention', color: '#f59e0b', bg: '#fef3c7' },
  EMERGENCY: { id: 'EMERGENCY', label: 'Emergency', color: '#dc2626', bg: '#fee2e2' }
};

export const initialMedications = [
  {
    id: 101,
    name: "Losartan 50mg",
    time: "08:00",
    period: "Morning",
    status: "taken", // taken, pending, late, refused, skipped
    takenBy: familyMembers[0],
    takenAt: "08:05",
  },
  {
    id: 102,
    name: "Aspirin 100mg",
    time: "12:00",
    period: "Afternoon",
    status: "pending",
    takenBy: null,
    takenAt: null,
  },
  {
    id: 103,
    name: "Simvastatin 20mg",
    time: "20:00",
    period: "Night",
    status: "pending",
    takenBy: null,
    takenAt: null,
  }
];

export const initialTasks = [
  {
    id: 201,
    title: "Buy Adult Diapers (Size L)",
    priority: "high", // high, medium, low
    assignedTo: null,
    status: "open",
  },
  {
    id: 202,
    title: "Cardiologist Appointment",
    priority: "medium",
    assignedTo: familyMembers[1],
    status: "in_progress",
  },
];

export const timelineEvents = [
  { id: 1, type: 'medication', title: 'Losartan 50mg', time: '08:05', status: 'taken', caregiver: familyMembers[0].name, note: 'Taken with breakfast.' },
  { id: 2, type: 'vital', title: 'Blood Pressure', time: '08:15', status: 'info', value: '120/80', caregiver: familyMembers[0].name },
  { id: 3, type: 'medication', title: 'Vitamin D', time: '12:00', status: 'refused', caregiver: familyMembers[1].name, note: 'Felt nauseous, refused.' },
  { id: 4, type: 'task', title: 'Lunch', time: '12:30', status: 'taken', caregiver: familyMembers[1].name },
];

export const feedUpdates = [
  { id: 301, author: familyMembers[0], action: "logged blood pressure 12/8", time: "Today, 08:10 AM" },
  { id: 302, author: familyMembers[2], action: "visited mom", time: "Yesterday, 04:30 PM" },
];
