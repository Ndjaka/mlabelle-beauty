// Shared TypeScript types for service domain

export interface Service {
  id: string
  category_id: string
  category: {
    id: string
    name: string
  }
  name: string
  duration_minutes: number
  price_cents: number
  price_max_cents?: number | null
  is_active: boolean
  description?: string | null
  image_url?: string | null
}

export interface CreateServiceInput {
  name: string
  category_id?: string | null
  duration_minutes: number
  price_cents: number
  price_max_cents?: number | null
  description?: string | null
  image_url?: string | null
}

export interface PaginatedServices {
  data: Service[]
  total: number
}
