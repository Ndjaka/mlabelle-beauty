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
  is_active: boolean
  description?: string | null
  image_url?: string | null
}

export interface CreateServiceInput {
  name: string
  category_id: string
  duration_minutes: number
  price_cents: number
  description?: string | null
  image_url?: string | null
}

export interface PaginatedServices {
  data: Service[]
  total: number
}
