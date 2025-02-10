export interface IContact {
  id?: string; // UUID (auto-generated)
  first_name: string;
  last_name: string;
  email: string; // Unique per company
  company: string;
  balance?: number; // Default: 0.00
  history?: any[];
  is_deleted?: boolean; // Default: false
  created_at?: Date; // Auto-generated timestamp
  updated_at?: Date; // Auto-updated timestamp
}
