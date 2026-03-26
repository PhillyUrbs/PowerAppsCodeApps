export type UserRole = 'Operator' | 'Reviewer' | 'QA Approver' | 'Admin';

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}
