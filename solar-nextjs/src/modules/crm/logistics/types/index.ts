export type WireType = 'DC' | 'AC_1_Phase' | 'AC_3_Phase' | 'Earthing';
export type VehicleStatus = 'available' | 'in_transit' | 'maintenance';

export interface InventoryItem {
  id: string;
  created_at: string;
  name: string;
  brand_name: string;
  category_name: string;
  unit_price: number;
  tax_percentage: number;
  stock_quantity: number;
  min_threshold: number;
  sku: string | null;
}

export interface WiringItem {
  id: string;
  created_at: string;
  brand_name: string;
  wire_type: WireType;
  gauge_sqmm: number;
  color: string;
  unit_price: number;
  tax_percentage: number;
  stock_meters: number;
}

export interface FleetVehicle {
  id: string;
  created_at: string;
  vehicle_number: string;
  model: string;
  payload_capacity_kg: number;
  status: VehicleStatus;
  insurance_expiry: string;
  fitness_expiry: string;
  assigned_driver?: string;
}
