// Shared TypeScript types for service domain

export interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
  is_active: boolean;
  description?: string | null;
}

export interface CreateServiceInput {
  name: string;
  duration_minutes: number;
  price_cents: number;
  description?: string | null;
}

export interface PaginatedServices {
  data: Service[];
  total: number;
}
