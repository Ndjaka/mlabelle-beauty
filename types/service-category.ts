export type ServiceCategory = {
  id: string
  name: string
  service_count: number
}

export type PaginatedServiceCategories = {
  data: ServiceCategory[]
  total: number
}

export type CreateServiceCategoryInput = {
  name: string
}
