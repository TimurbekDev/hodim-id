
export interface ClientItem {
  full_name: string;
  image_url: string;
  hamroh_id: number;
  id: number;
  position: string | null;
  status: number | null;
}

export interface ClientResponse {
  items: ClientItem[];
  atWork: number;
  absent: number;
  totalItems: number;
}