export interface ITransfer {
  id?: string;
  from_contact_id: string;
  to_contact_id: string;
  amount: number;
  created_at?: string;
}
