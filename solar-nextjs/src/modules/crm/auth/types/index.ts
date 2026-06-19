export type UserRole = 'super_admin' | 'sales' | 'logistics' | 'installer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}
