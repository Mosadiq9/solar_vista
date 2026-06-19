import { InventoryItem, WiringItem, FleetVehicle } from '../types';

const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    created_at: new Date().toISOString(),
    name: '540W Monocrystalline Half-Cut Panel',
    brand_name: 'Waaree',
    category_name: 'Solar Panels',
    unit_price: 15000,
    tax_percentage: 12,
    stock_quantity: 450,
    min_threshold: 100,
    sku: 'PAN-WAR-540',
  },
  {
    id: 'inv-2',
    created_at: new Date().toISOString(),
    name: '5kW Single Phase Grid-Tie Inverter',
    brand_name: 'Growatt',
    category_name: 'Inverters',
    unit_price: 45000,
    tax_percentage: 18,
    stock_quantity: 12,
    min_threshold: 5,
    sku: 'INV-GRO-5KW-1P',
  }
];

const mockWiring: WiringItem[] = [
  {
    id: 'wir-1',
    created_at: new Date().toISOString(),
    brand_name: 'Polycab',
    wire_type: 'DC',
    gauge_sqmm: 4,
    color: 'Red',
    unit_price: 45,
    tax_percentage: 18,
    stock_meters: 1500,
  },
  {
    id: 'wir-2',
    created_at: new Date().toISOString(),
    brand_name: 'Polycab',
    wire_type: 'AC_3_Phase',
    gauge_sqmm: 10,
    color: 'Black',
    unit_price: 120,
    tax_percentage: 18,
    stock_meters: 500,
  }
];

const mockFleet: FleetVehicle[] = [
  {
    id: 'veh-1',
    created_at: new Date().toISOString(),
    vehicle_number: 'GJ-01-AB-1234',
    model: 'Tata Ace Gold',
    payload_capacity_kg: 750,
    status: 'available',
    insurance_expiry: new Date(Date.now() + 8640000000).toISOString(),
    fitness_expiry: new Date(Date.now() + 18640000000).toISOString(),
    assigned_driver: 'Ramesh Driver',
  },
  {
    id: 'veh-2',
    created_at: new Date().toISOString(),
    vehicle_number: 'GJ-01-XY-9876',
    model: 'Mahindra Bolero Pickup',
    payload_capacity_kg: 1500,
    status: 'in_transit',
    insurance_expiry: new Date(Date.now() + 2640000000).toISOString(),
    fitness_expiry: new Date(Date.now() + 5640000000).toISOString(),
    assigned_driver: 'Suresh Driver',
  }
];

export const LogisticsService = {
  async getInventory(): Promise<InventoryItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockInventory];
  },
  
  async getWiring(): Promise<WiringItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...mockWiring];
  },

  async getFleet(): Promise<FleetVehicle[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockFleet];
  }
};
