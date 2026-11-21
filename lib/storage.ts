import { Complaint, ComplaintStatus, ComplaintPriority } from './types';
import { generateComplaintId } from './utils';

const STORAGE_KEY = 'civicresolve_complaints';
const DEMO_FLAG_KEY = 'civicresolve_demo_initialized';

export const DEMO_COMPLAINTS: Complaint[] = [
  {
    id: 'CIV-2024-10001',
    title: 'Large Pothole on Main Street near City Hospital',
    description: 'A very deep pothole approximately 3 feet wide has formed on Main Street near City Hospital junction. It has been causing accidents and vehicles are getting damaged. The pothole is filled with water making it invisible to drivers at night.',
    location: 'Main Street, near City Hospital Junction',
    city: 'Chennai',
    category: 'Road Damage',
    status: 'in_progress',
    priority: 'Critical',
    department: 'Roads and Infrastructure',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_001',
    isDemo: true,
    lat: 13.0827,
    lng: 80.2707,
    aiAnalysis: {
      category: 'Road Damage',
      priority: 'Critical',
      department: 'Roads and Infrastructure',
      urgency_reason: 'Deep pothole near hospital junction poses immediate risk of accidents, especially at night when filled with water making it invisible.',
      public_impact: 'High risk of vehicle damage and accidents. Located near hospital junction affecting emergency vehicle access.',
      recommended_action: 'Immediate road repair with temporary warning signs and barricades within 24 hours. Schedule permanent repair within 48 hours.',
      summary: 'Critical pothole at hospital junction causing safety hazard and vehicle damage, requires immediate intervention.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered successfully.',
        updatedBy: 'System',
      },
      {
        status: 'in_progress',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Field inspection team dispatched. Temporary barricades installed. Repair scheduled for tomorrow.',
        updatedBy: 'Admin - Roads Dept',
      },
    ],
  },
  {
    id: 'CIV-2024-10002',
    title: 'Overflowing Garbage Bins at Anna Nagar Market',
    description: 'The garbage bins at Anna Nagar market have been overflowing for the past 5 days. Garbage is spread all over the footpath creating unhygienic conditions. Stray animals are scattering the waste. Foul smell is affecting nearby shops and residents.',
    location: 'Anna Nagar Market, Block B',
    city: 'Chennai',
    category: 'Garbage & Waste',
    status: 'reported',
    priority: 'High',
    department: 'Sanitation and Waste Management',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_002',
    isDemo: true,
    lat: 13.0878,
    lng: 80.2100,
    aiAnalysis: {
      category: 'Garbage & Waste',
      priority: 'High',
      department: 'Sanitation and Waste Management',
      urgency_reason: 'Overflowing garbage for 5 days creates serious health hazards and unhygienic conditions near a public market.',
      public_impact: 'Health risk to market visitors, shopkeepers, and residents. Risk of disease spread due to stray animal activity.',
      recommended_action: 'Emergency garbage collection within 24 hours. Increase collection frequency to daily for this location. Inspect and repair/replace damaged bins.',
      summary: 'Overflowing garbage bins at busy market area causing health hazard for 5+ days, requires urgent sanitation response.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered successfully.',
        updatedBy: 'System',
      },
    ],
  },
  {
    id: 'CIV-2024-10003',
    title: 'Street Light Not Working on T. Nagar Road',
    description: 'Three consecutive street lights on T. Nagar road near bus stop No. 42 have been non-functional for 2 weeks. The area is very dark at night and women feel unsafe. Two snatching incidents have already been reported in this area.',
    location: 'T. Nagar Road, near Bus Stop 42',
    city: 'Chennai',
    category: 'Street Lighting',
    status: 'resolved',
    priority: 'High',
    department: 'Electricity and Public Lighting',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_003',
    resolutionNotes: 'All three street lights have been repaired and new LED bulbs installed. Additional solar-powered backup lights added for redundancy.',
    isDemo: true,
    lat: 13.0418,
    lng: 80.2341,
    aiAnalysis: {
      category: 'Street Lighting',
      priority: 'High',
      department: 'Electricity and Public Lighting',
      urgency_reason: 'Non-functional street lights for 2 weeks creating safety risk, especially with reported criminal incidents in the area.',
      public_impact: 'Public safety compromised, particularly for women and children. Area has already seen criminal activity due to darkness.',
      recommended_action: 'Emergency repair of non-functional lights within 48 hours. Install temporary lighting as immediate measure. File coordination with police for increased patrol.',
      summary: 'Three street lights out for 2 weeks near busy bus stop causing safety concerns and enabling crime.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered successfully.',
        updatedBy: 'System',
      },
      {
        status: 'in_progress',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Electrical team assigned. Temporary halogen lights installed as interim measure.',
        updatedBy: 'Admin - Electricity Dept',
      },
      {
        status: 'resolved',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'All three street lights repaired with new LED bulbs. Solar backup installed.',
        updatedBy: 'Admin - Electricity Dept',
      },
    ],
  },
  {
    id: 'CIV-2024-10004',
    title: 'Water Pipeline Burst in Velachery',
    description: 'A major water pipeline has burst on Velachery Main Road near the park. Water is flooding the road and entering nearby houses. The area has been waterlogged for 6 hours. Drinking water supply has been disrupted for 200+ households.',
    location: 'Velachery Main Road, near Velachery Park',
    city: 'Chennai',
    category: 'Water & Drainage',
    status: 'in_progress',
    priority: 'Critical',
    department: 'Water Supply and Drainage',
    submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_004',
    isDemo: true,
    lat: 12.9815,
    lng: 80.2180,
    aiAnalysis: {
      category: 'Water & Drainage',
      priority: 'Critical',
      department: 'Water Supply and Drainage',
      urgency_reason: 'Active pipeline burst flooding roads and entering homes, disrupting water supply to hundreds of households immediately.',
      public_impact: '200+ households without drinking water. Road flooding causing traffic disruption. Property damage from water ingress into homes.',
      recommended_action: 'Immediate dispatch of emergency plumbing team to shut off water supply valve. Deploy water tankers for affected households. Begin pipeline repair within 2 hours.',
      summary: 'Critical water pipeline burst flooding residential area and disrupting water supply to 200+ homes, requires emergency response.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        note: 'Emergency complaint registered.',
        updatedBy: 'System',
      },
      {
        status: 'in_progress',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        note: 'Emergency plumbing team on-site. Main valve shut off. Water tankers deployed to affected area. Pipeline repair in progress.',
        updatedBy: 'Admin - Water Dept',
      },
    ],
  },
  {
    id: 'CIV-2024-10005',
    title: 'Broken Footpath in Adyar causing accidents',
    description: 'The footpath on Adyar bridge road has broken tiles and exposed rods that are causing pedestrians to trip and fall. An elderly person fell and got injured yesterday. The tiles have been broken for over a month.',
    location: 'Adyar Bridge Road, near MRF Signal',
    city: 'Chennai',
    category: 'Public Infrastructure',
    status: 'reported',
    priority: 'Medium',
    department: 'Public Works Department',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_005',
    isDemo: true,
    lat: 13.0012,
    lng: 80.2565,
    aiAnalysis: {
      category: 'Public Infrastructure',
      priority: 'Medium',
      department: 'Public Works Department',
      urgency_reason: 'Broken footpath with exposed metal rods has already caused injury to an elderly person and poses ongoing trip hazard.',
      public_impact: 'Risk of injury to pedestrians, especially elderly and children. Already caused one injury. High foot traffic area increases risk.',
      recommended_action: 'Install warning signs immediately. Schedule repair of broken tiles and covering of exposed rods within 1 week.',
      summary: 'Broken footpath with exposed rods causing pedestrian injuries on busy road, needs repair and interim safety measures.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered successfully.',
        updatedBy: 'System',
      },
    ],
  },
  {
    id: 'CIV-2024-10006',
    title: 'Sewage Overflow in Mylapore Residential Area',
    description: 'The sewage line in Mylapore, 3rd street is blocked and sewage is overflowing onto the road. The smell is unbearable and the area is becoming a health hazard. Children in the area are falling sick.',
    location: 'Mylapore, 3rd Cross Street',
    city: 'Chennai',
    category: 'Sewage',
    status: 'resolved',
    priority: 'High',
    department: 'Sewage and Plumbing',
    submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_006',
    resolutionNotes: 'Sewage line desilted and blockage cleared. Anti-bacterial spray done. Preventive maintenance scheduled quarterly.',
    isDemo: true,
    lat: 13.0338,
    lng: 80.2676,
    aiAnalysis: {
      category: 'Sewage',
      priority: 'High',
      department: 'Sewage and Plumbing',
      urgency_reason: 'Active sewage overflow causing immediate health hazard to residents including children falling sick in the area.',
      public_impact: 'Serious health risk from sewage exposure. Children already falling ill. Risk of disease outbreak if not addressed immediately.',
      recommended_action: 'Emergency sewage team deployment within 12 hours. Clear blockage and sanitize area. Conduct health check for affected families.',
      summary: 'Sewage overflow in residential street causing health emergency with children falling sick, requires urgent response.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered successfully.',
        updatedBy: 'System',
      },
      {
        status: 'in_progress',
        timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Sewage team dispatched. Temporary pumping started to prevent further overflow.',
        updatedBy: 'Admin - Sewage Dept',
      },
      {
        status: 'resolved',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Sewage line desilted and cleared. Anti-bacterial spray applied. Quarterly maintenance scheduled.',
        updatedBy: 'Admin - Sewage Dept',
      },
    ],
  },
  {
    id: 'CIV-2024-10007',
    title: 'No Drainage During Rain - Flooding in Tambaram',
    description: 'Every time it rains, the entire Tambaram main road gets flooded knee-deep. The drainage system appears completely blocked. Vehicles and shops suffer damage. The problem has persisted for 3 monsoon seasons.',
    location: 'Tambaram Main Road, near Railway Station',
    city: 'Chennai',
    category: 'Water & Drainage',
    status: 'in_progress',
    priority: 'High',
    department: 'Water Supply and Drainage',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_007',
    isDemo: true,
    lat: 12.9249,
    lng: 80.1000,
    aiAnalysis: {
      category: 'Water & Drainage',
      priority: 'High',
      department: 'Water Supply and Drainage',
      urgency_reason: 'Chronic flooding issue affecting major road near railway station for 3 consecutive monsoon seasons causing severe disruption.',
      public_impact: 'Flooding affects thousands of commuters and businesses. Property damage every monsoon. Transport disruption affecting railway connectivity.',
      recommended_action: 'Conduct full drainage system audit. Desilt and clear all blocked drains. Submit proposal for drainage infrastructure upgrade. Install flood sensors.',
      summary: 'Recurrent severe flooding at major junction due to blocked drainage, affecting thousands of commuters across 3 monsoon seasons.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered successfully.',
        updatedBy: 'System',
      },
      {
        status: 'in_progress',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Drainage team conducting survey. Emergency desilting of main drain started.',
        updatedBy: 'Admin - Drainage Dept',
      },
    ],
  },
  {
    id: 'CIV-2024-10008',
    title: 'Park Benches Broken in Besant Nagar Beach Park',
    description: 'Most of the benches in Besant Nagar beach park are broken with sharp edges exposed. Visitors especially elderly people and children are at risk of getting hurt. The benches have been in this state for over 6 months.',
    location: 'Besant Nagar Beach Park, Entrance Gate 2',
    city: 'Chennai',
    category: 'Public Infrastructure',
    status: 'reported',
    priority: 'Low',
    department: 'Urban Development',
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: 'citizen_008',
    isDemo: true,
    lat: 13.0002,
    lng: 80.2729,
    aiAnalysis: {
      category: 'Public Infrastructure',
      priority: 'Low',
      department: 'Urban Development',
      urgency_reason: 'Broken benches with sharp edges pose minor but persistent risk in a public park used by elderly and children.',
      public_impact: 'Risk of minor injuries to park visitors. Degradation of public amenity. Affects quality of recreational space.',
      recommended_action: 'Schedule routine maintenance to repair or replace broken benches. Add warning tape around damaged benches temporarily.',
      summary: 'Multiple broken benches with sharp edges in popular beach park, requiring routine maintenance and replacement.',
      is_fallback: false,
    },
    statusHistory: [
      {
        status: 'reported',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered successfully.',
        updatedBy: 'System',
      },
    ],
  },
];

export function getStoredComplaints(): Complaint[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Complaint[];
    }
    return initializeDemoData();
  } catch {
    return initializeDemoData();
  }
}

export function initializeDemoData(): Complaint[] {
  if (typeof window === 'undefined') return DEMO_COMPLAINTS;
  const initialized = localStorage.getItem(DEMO_FLAG_KEY);
  if (!initialized) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_COMPLAINTS));
    localStorage.setItem(DEMO_FLAG_KEY, 'true');
  }
  return DEMO_COMPLAINTS;
}

export function saveComplaint(complaint: Complaint): void {
  if (typeof window === 'undefined') return;
  const complaints = getStoredComplaints();
  const existing = complaints.findIndex(c => c.id === complaint.id);
  if (existing >= 0) {
    complaints[existing] = complaint;
  } else {
    complaints.unshift(complaint);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function getComplaintById(id: string): Complaint | null {
  const complaints = getStoredComplaints();
  return complaints.find(c => c.id === id) || null;
}

export function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  note: string,
  updatedBy: string
): Complaint | null {
  const complaints = getStoredComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return null;

  const complaint = complaints[idx];
  const statusUpdate = {
    status,
    timestamp: new Date().toISOString(),
    note,
    updatedBy,
  };

  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  complaint.statusHistory.push(statusUpdate);
  if (status === 'resolved') {
    complaint.resolutionNotes = note;
  }

  complaints[idx] = complaint;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return complaint;
}

export function updateComplaintDepartment(id: string, department: string): void {
  const complaints = getStoredComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return;
  complaints[idx].department = department;
  complaints[idx].updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_COMPLAINTS));
  localStorage.setItem(DEMO_FLAG_KEY, 'true');
}

export function getDashboardStats() {
  const complaints = getStoredComplaints();
  return {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'reported').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    critical: complaints.filter(c => c.priority === 'Critical').length,
  };
}

export function findSimilarComplaints(title: string, description: string, currentId?: string): Complaint[] {
  const complaints = getStoredComplaints();
  const keywords = [...title.toLowerCase().split(' '), ...description.toLowerCase().split(' ')]
    .filter(w => w.length > 4);

  return complaints
    .filter(c => c.id !== currentId && c.status !== 'resolved')
    .filter(c => {
      const text = `${c.title} ${c.description}`.toLowerCase();
      const matches = keywords.filter(kw => text.includes(kw));
      return matches.length >= 2;
    })
    .slice(0, 3);
}
