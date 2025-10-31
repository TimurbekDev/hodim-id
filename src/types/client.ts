
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

export interface EgovClientResponse{
  full_name: string;
  birth_date: string;
}

export interface ClientView {
  full_name: string
  pinfl: string
  birth_date: string
  username: string
  password: string
}

export interface ClientViewResponse{
  id: number
}


export interface OrgClientView {
  user_id: number
  organization_id: number
  org_user_role: number
  position: string
}