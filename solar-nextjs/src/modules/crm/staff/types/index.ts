import { UserRole } from '../../auth/types';

export interface StaffProfile {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended';
  last_login: string | null;
}
