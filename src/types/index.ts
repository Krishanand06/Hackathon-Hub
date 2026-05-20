// ============ AUTH TYPES ============
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'MENTOR' | 'JUDGE' | 'ADMIN';
  skills: string[];
  bio?: string;
  githubUrl?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ============ HACKATHON TYPES ============
export type HackathonStatus = 'UPCOMING' | 'OPEN' | 'IN_PROGRESS' | 'JUDGING' | 'COMPLETED';

export interface Hackathon {
  id: number;
  title: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: string;
  status: HackathonStatus;
  tags: string[];
  venue?: string;
  isOnline: boolean;
  organizerId: number;
  organizerName: string;
  bannerUrl?: string;
}

// ============ TEAM TYPES ============
export interface TeamMember {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  role: string;
  skills: string[];
  isLeader: boolean;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  hackathonId: number;
  hackathonTitle: string;
  members: TeamMember[];
  maxSize: number;
  requiredSkills: string[];
  isOpen: boolean;
  leaderId: number;
  leaderName: string;
  pendingRequests?: TeamMember[];
}

// ============ SUBMISSION TYPES ============
export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'EVALUATED';

export interface Submission {
  id: number;
  hackathonId: number;
  teamId: number;
  teamName: string;
  projectTitle: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  presentationUrl?: string;
  techStack: string[];
  status: SubmissionStatus;
  submittedAt: string;
  score?: number;
}

// ============ EVALUATION TYPES ============
export interface EvaluationCriteria {
  innovation: number;
  implementation: number;
  presentation: number;
  impact: number;
  feasibility: number;
}

export interface Evaluation {
  id: number;
  submissionId: number;
  judgeId: number;
  judgeName: string;
  criteria: EvaluationCriteria;
  totalScore: number;
  feedback: string;
  evaluatedAt: string;
}

// ============ LEADERBOARD TYPES ============
export interface LeaderboardEntry {
  rank: number;
  teamId: number;
  teamName: string;
  hackathonId: number;
  totalScore: number;
  projectTitle: string;
  members: string[];
  submissionId: number;
}

// ============ MENTOR TYPES ============
export interface Mentor {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  expertise: string[];
  bio: string;
  company: string;
  designation: string;
  availableSlots: MentorSlot[];
  rating: number;
  totalSessions: number;
  avatarUrl?: string;
}

export interface MentorSlot {
  id: number;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
  booked: boolean;
  bookedByTeamId?: number;
  mentorId?: number;
  bookedBy?: {
    id: number;
    username: string;
    email: string;
    fullName: string;
  };
}

export interface MentorBooking {
  id: number;
  mentorId: number;
  mentorName: string;
  teamId: number;
  teamName: string;
  slotId: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

// ============ RESOURCE TYPES ============
export interface Resource {
  id: number;
  title: string;
  url: string;
  displayOrder?: number;
}

// ============ REGISTRATION TYPES ============
export interface Registration {
  id: number;
  hackathonId: number;
  hackathonTitle: string;
  userId: number;
  teamId?: number;
  teamName?: string;
  registeredAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ============ FILTER TYPES ============
export interface HackathonFilters {
  status?: HackathonStatus;
  isOnline?: boolean;
  search?: string;
  tags?: string[];
  page?: number;
  size?: number;
}

export interface TeamFilters {
  hackathonId?: number;
  skills?: string[];
  isOpen?: boolean;
  search?: string;
}
