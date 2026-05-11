import { Hackathon, Team, Mentor, LeaderboardEntry, Resource, Submission } from '../types';

// ─── HACKATHONS ───────────────────────────────────────────────────────────────
export const mockHackathons: Hackathon[] = [
  {
    id: 1, title: 'BITS Innovation Challenge 2025', theme: 'AI & Sustainability',
    description: 'Build AI-powered solutions for environmental sustainability. Open to all BITS students across campuses. 48-hour hackathon with mentorship from top industry leaders.',
    startDate: '2025-06-15', endDate: '2025-06-17', registrationDeadline: '2025-06-10',
    maxTeamSize: 4, minTeamSize: 2, maxParticipants: 200, currentParticipants: 143,
    prizePool: 'AED 50,000', status: 'OPEN', tags: ['AI', 'ML', 'Sustainability', 'Python'],
    venue: 'BITS Pilani, Rajasthan', isOnline: false, organizerId: 1, organizerName: 'BITS CS Dept',
  },
  {
    id: 2, title: 'FinTech Hackathon 2025', theme: 'Future of Finance',
    description: 'Reimagine financial services using blockchain, ML, and open banking APIs. Partner with leading fintech firms for real-world problem statements.',
    startDate: '2025-07-01', endDate: '2025-07-02', registrationDeadline: '2025-06-25',
    maxTeamSize: 3, minTeamSize: 1, maxParticipants: 150, currentParticipants: 89,
    prizePool: 'AED 25,000', status: 'OPEN', tags: ['Blockchain', 'FinTech', 'ML', 'APIs'],
    isOnline: true, organizerId: 2, organizerName: 'FinHub BITS',
  },
  {
    id: 3, title: 'HealthTech Sprint', theme: 'Digital Healthcare',
    description: 'Develop solutions for healthcare accessibility, telemedicine, and medical data analysis. Work with real hospital datasets and doctors as mentors.',
    startDate: '2025-05-20', endDate: '2025-05-21', registrationDeadline: '2025-05-15',
    maxTeamSize: 4, minTeamSize: 2, maxParticipants: 100, currentParticipants: 100,
    prizePool: 'AED 15,000', status: 'IN_PROGRESS', tags: ['Healthcare', 'AI', 'Mobile', 'IoT'],
    venue: 'BITS Hyderabad', isOnline: false, organizerId: 3, organizerName: 'MedTech Club',
  },
  {
    id: 4, title: 'Cyber Security Hackathon', theme: 'Hack the Hackers',
    description: 'CTF-style hackathon focusing on network security, cryptography, and ethical hacking. Compete in real-world attack-defense scenarios.',
    startDate: '2025-08-10', endDate: '2025-08-12', registrationDeadline: '2025-08-01',
    maxTeamSize: 3, minTeamSize: 2, maxParticipants: 80, currentParticipants: 12,
    prizePool: 'AED 30,000', status: 'UPCOMING', tags: ['Security', 'CTF', 'Networking', 'Python'],
    isOnline: true, organizerId: 4, organizerName: 'SecBITS',
  },
  {
    id: 5, title: 'Smart Campus Hackathon', theme: 'IoT & Automation',
    description: 'Build smart solutions for campus management — from parking to energy efficiency. Hardware kits provided.',
    startDate: '2025-04-01', endDate: '2025-04-03', registrationDeadline: '2025-03-25',
    maxTeamSize: 4, minTeamSize: 2, maxParticipants: 120, currentParticipants: 120,
    prizePool: 'AED 10,000', status: 'COMPLETED', tags: ['IoT', 'Hardware', 'Automation', 'BITS'],
    venue: 'BITS Goa', isOnline: false, organizerId: 5, organizerName: 'IEEE BITS',
  },
  {
    id: 6, title: 'Open Source Sprint', theme: 'Build for the Community',
    description: 'Contribute to open-source projects and build tools that developers love. GitHub-driven event with real PRs merged.',
    startDate: '2025-09-05', endDate: '2025-09-07', registrationDeadline: '2025-08-30',
    maxTeamSize: 5, minTeamSize: 1, maxParticipants: 300, currentParticipants: 45,
    prizePool: 'AED 7,500', status: 'UPCOMING', tags: ['Open Source', 'GitHub', 'Community', 'Web'],
    isOnline: true, organizerId: 6, organizerName: 'BITS OSS Club',
  },
];

// ─── TEAMS ───────────────────────────────────────────────────────────────────
export const mockTeams: Team[] = [
  {
    id: 1, name: 'Neural Nexus', description: 'Building an AI-powered carbon footprint tracker with real-time analytics.',
    hackathonId: 1, hackathonTitle: 'BITS Innovation Challenge 2025',
    members: [
      { id: 1, userId: 101, username: 'arjun_k', fullName: 'Arjun Kumar', role: 'Full Stack Dev', skills: ['React', 'Node.js', 'Python'], isLeader: true },
      { id: 2, userId: 102, username: 'priya_s', fullName: 'Priya Sharma', role: 'ML Engineer', skills: ['Machine Learning', 'Python', 'TensorFlow'], isLeader: false },
      { id: 3, userId: 103, username: 'rahul_m', fullName: 'Rahul Mehta', role: 'Backend Dev', skills: ['Java', 'Spring Boot', 'SQL'], isLeader: false },
    ],
    maxSize: 4, requiredSkills: ['UI/UX', 'Figma'], isOpen: true, leaderId: 101, leaderName: 'Arjun Kumar',
  },
  {
    id: 2, name: 'BlockBusters', description: 'DeFi lending platform with AI risk assessment for underbanked populations.',
    hackathonId: 2, hackathonTitle: 'FinTech Hackathon 2025',
    members: [
      { id: 4, userId: 104, username: 'anita_p', fullName: 'Anita Patel', role: 'Blockchain Dev', skills: ['Blockchain', 'Solidity', 'JavaScript'], isLeader: true },
      { id: 5, userId: 105, username: 'vikram_r', fullName: 'Vikram Rao', role: 'ML Dev', skills: ['Machine Learning', 'Python'], isLeader: false },
    ],
    maxSize: 3, requiredSkills: ['React', 'Node.js'], isOpen: true, leaderId: 104, leaderName: 'Anita Patel',
  },
  {
    id: 3, name: 'MedAI', description: 'AI diagnostic assistant that helps rural doctors with image-based disease detection.',
    hackathonId: 3, hackathonTitle: 'HealthTech Sprint',
    members: [
      { id: 6, userId: 106, username: 'sanya_g', fullName: 'Sanya Gupta', role: 'Lead Dev', skills: ['Python', 'AI', 'Flutter'], isLeader: true },
      { id: 7, userId: 107, username: 'ravi_k', fullName: 'Ravi Krishnan', role: 'Backend', skills: ['Node.js', 'MongoDB', 'Docker'], isLeader: false },
      { id: 8, userId: 108, username: 'meera_s', fullName: 'Meera Singh', role: 'UI/UX', skills: ['Figma', 'UI/UX', 'React'], isLeader: false },
      { id: 9, userId: 109, username: 'karan_v', fullName: 'Karan Verma', role: 'ML Specialist', skills: ['Computer Vision', 'Python', 'AI'], isLeader: false },
    ],
    maxSize: 4, requiredSkills: [], isOpen: false, leaderId: 106, leaderName: 'Sanya Gupta',
  },
  {
    id: 4, name: 'SecureX', description: 'Advanced threat detection system using ML and behavioral analytics.',
    hackathonId: 4, hackathonTitle: 'Cyber Security Hackathon',
    members: [
      { id: 10, userId: 110, username: 'dev_b', fullName: 'Dev Bhat', role: 'Security Expert', skills: ['Python', 'Networking', 'C++'], isLeader: true },
    ],
    maxSize: 3, requiredSkills: ['Python', 'Machine Learning', 'Docker'], isOpen: true, leaderId: 110, leaderName: 'Dev Bhat',
  },
];

// ─── MENTORS ─────────────────────────────────────────────────────────────────
export const mockMentors: Mentor[] = [
  {
    id: 1, userId: 201, fullName: 'Dr. Ravi Shankar', email: 'ravi@bits.com',
    expertise: ['Machine Learning', 'AI', 'Python', 'Computer Vision'],
    bio: 'Senior Research Scientist at Google DeepMind. 10+ years in ML research. Former BITS Pilani professor.',
    company: 'Google DeepMind', designation: 'Senior Research Scientist',
    availableSlots: [
      { id: 1, startTime: '2025-06-15T10:00:00', endTime: '2025-06-15T10:30:00', isBooked: false },
      { id: 2, startTime: '2025-06-15T11:00:00', endTime: '2025-06-15T11:30:00', isBooked: true, bookedByTeamId: 1 },
      { id: 3, startTime: '2025-06-16T14:00:00', endTime: '2025-06-16T14:30:00', isBooked: false },
    ],
    rating: 4.9, totalSessions: 156,
  },
  {
    id: 2, userId: 202, fullName: 'Priyanka Mehta', email: 'priyanka@stripe.com',
    expertise: ['FinTech', 'Blockchain', 'APIs', 'Product Management'],
    bio: 'Engineering Manager at Stripe. Built payment infrastructure used by millions. Passionate about fintech innovation.',
    company: 'Stripe', designation: 'Engineering Manager',
    availableSlots: [
      { id: 4, startTime: '2025-06-15T09:00:00', endTime: '2025-06-15T09:30:00', isBooked: false },
      { id: 5, startTime: '2025-06-15T15:00:00', endTime: '2025-06-15T15:30:00', isBooked: false },
    ],
    rating: 4.7, totalSessions: 89,
  },
  {
    id: 3, userId: 203, fullName: 'Arun Iyer', email: 'arun@microsoft.com',
    expertise: ['Cloud', 'DevOps', 'Docker', 'Kubernetes', 'AWS'],
    bio: 'Principal Cloud Architect at Microsoft Azure. Helped scale services to 100M+ users. Open source contributor.',
    company: 'Microsoft', designation: 'Principal Cloud Architect',
    availableSlots: [
      { id: 6, startTime: '2025-06-16T10:00:00', endTime: '2025-06-16T10:30:00', isBooked: false },
      { id: 7, startTime: '2025-06-16T11:00:00', endTime: '2025-06-16T11:30:00', isBooked: false },
      { id: 8, startTime: '2025-06-17T09:00:00', endTime: '2025-06-17T09:30:00', isBooked: true, bookedByTeamId: 2 },
    ],
    rating: 4.8, totalSessions: 212,
  },
  {
    id: 4, userId: 204, fullName: 'Neha Joshi', email: 'neha@zomato.com',
    expertise: ['React', 'Node.js', 'UI/UX', 'System Design'],
    bio: 'Staff Engineer at Zomato. Led frontend rewrite that improved performance by 60%. React core contributor.',
    company: 'Zomato', designation: 'Staff Software Engineer',
    availableSlots: [
      { id: 9, startTime: '2025-06-15T16:00:00', endTime: '2025-06-15T16:30:00', isBooked: false },
    ],
    rating: 4.6, totalSessions: 73,
  },
];

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, teamId: 3, teamName: 'MedAI', hackathonId: 3, totalScore: 94.5, projectTitle: 'AI Diagnostic Assistant', members: ['Sanya G', 'Ravi K', 'Meera S', 'Karan V'], submissionId: 1 },
  { rank: 2, teamId: 1, teamName: 'Neural Nexus', hackathonId: 1, totalScore: 91.2, projectTitle: 'CarbonSense AI', members: ['Arjun K', 'Priya S', 'Rahul M'], submissionId: 2 },
  { rank: 3, teamId: 2, teamName: 'BlockBusters', hackathonId: 2, totalScore: 88.7, projectTitle: 'DeFi Lending Protocol', members: ['Anita P', 'Vikram R'], submissionId: 3 },
  { rank: 4, teamId: 4, teamName: 'SecureX', hackathonId: 4, totalScore: 85.3, projectTitle: 'ThreatDetect ML', members: ['Dev B'], submissionId: 4 },
  { rank: 5, teamId: 5, teamName: 'CloudNine', hackathonId: 1, totalScore: 82.1, projectTitle: 'Green Data Centers', members: ['Rohan T', 'Kavya M'], submissionId: 5 },
  { rank: 6, teamId: 6, teamName: 'ByteCraft', hackathonId: 2, totalScore: 79.4, projectTitle: 'SmartBudget App', members: ['Ashish N', 'Divya P', 'Sunny K'], submissionId: 6 },
];

// ─── RESOURCES ───────────────────────────────────────────────────────────────
export const mockResources: Resource[] = [
  { id: 1, title: 'React + Vite Guide', url: 'https://vitejs.dev/guide/', displayOrder: 1 },
  { id: 2, title: 'Spring Boot Guides', url: 'https://spring.io/guides', displayOrder: 2 },
  { id: 3, title: 'GitHub Docs', url: 'https://docs.github.com/', displayOrder: 3 },
  { id: 4, title: 'MySQL Documentation', url: 'https://dev.mysql.com/doc/', displayOrder: 4 },
  { id: 5, title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', displayOrder: 5 },
];

// ─── SUBMISSIONS ─────────────────────────────────────────────────────────────
export const mockSubmissions: Submission[] = [
  { id: 1, hackathonId: 1, teamId: 1, teamName: 'Neural Nexus', projectTitle: 'CarbonSense AI', description: 'Real-time carbon footprint tracker using satellite data and ML models.', repoUrl: 'https://github.com/example/carbonsense', demoUrl: 'https://carbonsense.demo.com', techStack: ['React', 'Python', 'TensorFlow', 'Spring Boot'], status: 'EVALUATED', submittedAt: '2025-04-03T18:30:00', score: 91.2 },
  { id: 2, hackathonId: 2, teamId: 2, teamName: 'BlockBusters', projectTitle: 'DeFi Lending Protocol', description: 'Decentralized lending with AI-based credit scoring for underbanked users.', repoUrl: 'https://github.com/example/defijl', techStack: ['Solidity', 'React', 'Python', 'Node.js'], status: 'EVALUATED', submittedAt: '2025-07-02T17:45:00', score: 88.7 },
];
