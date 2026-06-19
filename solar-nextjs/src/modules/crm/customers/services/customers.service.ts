import { Customer } from '../types';

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 'c-1',
    created_at: new Date(Date.now() - 500000).toISOString(),
    updated_at: new Date(Date.now() - 500000).toISOString(),
    lead_id: 'l-1',
    name: 'Suresh Kumar',
    phone: '9876500000',
    email: 'suresh@example.com',
    address: 'Sector 5, Gandhinagar',
    city: 'Gandhinagar',
    state: 'Gujarat',
    pin_code: '382005',
    system_category: 'residential',
    system_kw: 10,
    panel_type: 'Monocrystalline',
    inverter_type: 'String',
    consumer_number: 'UGVCL-12345678',
    discom: 'UGVCL',
    source: 'referral',
    referred_by: 'Amit Bhai',
    status: 'active',
    current_stage: 'registration',
  }
];

export const CustomersService = {
  async getCustomers(): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...mockCustomers];
  },

  async getCustomerById(id: string): Promise<Customer | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCustomers.find(c => c.id === id) || null;
  },

  // In the real app, this RPC convert_lead_to_customer does this on the backend
  async convertLeadToCustomer(leadId: string, data: Partial<Customer>): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lead_id: leadId,
      name: data.name || 'Unknown',
      phone: data.phone || '000',
      email: data.email || null,
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pin_code: data.pin_code || null,
      system_category: data.system_category || 'residential',
      system_kw: data.system_kw || 0,
      panel_type: data.panel_type || null,
      inverter_type: data.inverter_type || null,
      consumer_number: data.consumer_number || null,
      discom: data.discom || null,
      source: data.source || null,
      referred_by: data.referred_by || null,
      status: 'active',
      current_stage: 'registration',
    };
    
    mockCustomers.push(newCustomer);
    return newCustomer;
  }
};
