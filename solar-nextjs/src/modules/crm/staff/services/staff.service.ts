import { StaffProfile } from '../types';

const mockStaff: StaffProfile[] = [
  {
    id: 'u-1',
    created_at: new Date(Date.now() - 10000000).toISOString(),
    full_name: 'Super Admin',
    email: 'admin@solar.com',
    phone: '9876543210',
    role: 'super_admin',
    status: 'active',
    last_login: new Date().toISOString(),
  },
  {
    id: 'u-2',
    created_at: new Date(Date.now() - 5000000).toISOString(),
    full_name: 'Sales Rep',
    email: 'sales@solar.com',
    phone: '9876543211',
    role: 'sales',
    status: 'active',
    last_login: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'u-3',
    created_at: new Date(Date.now() - 2000000).toISOString(),
    full_name: 'Logistics Manager',
    email: 'logistics@solar.com',
    phone: '9876543212',
    role: 'logistics',
    status: 'active',
    last_login: new Date(Date.now() - 400000).toISOString(),
  },
  {
    id: 'u-4',
    created_at: new Date(Date.now() - 1000000).toISOString(),
    full_name: 'Site Installer',
    email: 'installer@solar.com',
    phone: '9876543213',
    role: 'installer',
    status: 'active',
    last_login: new Date(Date.now() - 100000).toISOString(),
  }
];

export const StaffService = {
  async getStaff(): Promise<StaffProfile[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockStaff];
  }
};
