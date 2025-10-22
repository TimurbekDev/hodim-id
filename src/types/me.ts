export interface IUserResponse {
  id: number;
  username: string;
  full_name: string;
  pinfl: string | null;
  created_by: string | null;
  birth_date: string | null;
  image_url: string | null;
  hamroh_id: number | null;
  keycloack_id: string | null;
  tax_id: string | null;
  tg_bot_link: string | null;
  account_number: string | null;
  balance: number | null;
  organizationClientViews?: {
    organizaationId: number | null;
    organizationView: string | null;
    userId: number;
    clientView: string | null;
    role: number;
    position: string | null;
    id: number;
  }[];
}
