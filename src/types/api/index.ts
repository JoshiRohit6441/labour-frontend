export type Role = 'USER' | 'CONTRACTOR';

export interface Pagination<T> {
  items: T[];
  total: number;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}


