// API Response Types
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message?: string;
  meta?: unknown;
}

// Domain Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  activeCompanyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MembershipRole = "OWNER" | "ADMIN" | "MEMBER";

export interface Membership {
  id: string;
  userId: string;
  companyId: string;
  role: MembershipRole;
  user?: User;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
  memberships?: Membership[];
  _count?: {
    memberships: number;
    invites: number;
    activeUsers: number;
  };
}

export type InviteStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

export interface Invite {
  id: string;
  email: string;
  companyId: string;
  token: string;
  status: InviteStatus;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

// UI Types
export type RoleBadgeVariant = "default" | "secondary" | "destructive";

export type SidebarMode = "dashboard" | "company-details";

// Component Props Types
export interface SidebarProps {
  mode?: SidebarMode;
  company?: Company | null;
  onInviteMember?: () => void;
  onEditCompany?: () => void;
  onDeleteCompany?: () => void;
}

