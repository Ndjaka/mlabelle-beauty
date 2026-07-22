import { describe, expect, it } from 'vitest'
import {
  buildServiceInputFromFormValues,
  formatServiceDurationHint,
  getDefaultPublicCatalogCategoryId,
  getNextServicesPage,
  getServiceImageExtension,
  hasMoreServices,
  isPublicCatalogService,
  parseServiceDurationMinutes,
  parseServicePriceCents,
  validateServiceImageFile,
} from '@/features/services/utils'
import type { Service } from '@/types/service'

const VALID_DURATION = '90'
const VALID_PRICE = '45,50'
const MINIMUM_DURATION = '5'
const INVALID_DURATION = '4'
const NEGATIVE_PRICE = '-1'
const VALID_IMAGE_FILE = {
  name: 'brushing.webp',
  size: 1_000_000,
  type: 'image/webp',
}

const PUBLIC_SERVICE: Service = {
  id: 'service-id',
  category_id: 'braids-category-id',
  category: {
    id: 'braids-category-id',
    name: 'Braids',
  },
  name: 'Braids Small',
  duration_minutes: 360,
  price_cents: 12_500,
  is_active: true,
  description: null,
  image_url: null,
}

const UNCATEGORIZED_SERVICE: Service = {
  ...PUBLIC_SERVICE,
  id: 'uncategorized-service-id',
  category_id: 'uncategorized-category-id',
  category: {
    id: 'uncategorized-category-id',
    name: 'Non classée',
  },
}

describe('service utils', () => {
  it('parses service durations in minutes', () => {
    expect(parseServiceDurationMinutes(VALID_DURATION)).toBe(90)
    expect(parseServiceDurationMinutes(MINIMUM_DURATION)).toBe(5)
    expect(parseServiceDurationMinutes(INVALID_DURATION)).toBeNull()
  })

  it('parses euro prices into cents', () => {
    expect(parseServicePriceCents(VALID_PRICE)).toBe(4550)
    expect(parseServicePriceCents('45.50')).toBe(4550)
    expect(parseServicePriceCents('')).toBeNull()
    expect(parseServicePriceCents(NEGATIVE_PRICE)).toBeNull()
  })

  it('formats a compact duration hint', () => {
    expect(formatServiceDurationHint('45')).toBe('(45 min)')
    expect(formatServiceDurationHint('60')).toBe('(1h00)')
    expect(formatServiceDurationHint(VALID_DURATION)).toBe('(1h30)')
  })

  it('builds a clean service input from form values', () => {
    expect(
      buildServiceInputFromFormValues({
        categoryId: 'category-id',
        name: ' Brushing ',
        description: ' Mise en forme ',
        duration: VALID_DURATION,
        price: VALID_PRICE,
        priceMax: '',
      })
    ).toEqual({
      success: true,
      data: {
        category_id: 'category-id',
        name: 'Brushing',
        description: 'Mise en forme',
        duration_minutes: 90,
        price_cents: 4550,
        price_max_cents: null,
      },
    })
  })

  it('builds a service input with a price range', () => {
    expect(
      buildServiceInputFromFormValues({
        categoryId: 'category-id',
        name: ' Braids Medium ',
        description: '',
        duration: '240',
        price: '60',
        priceMax: '80',
      })
    ).toEqual({
      success: true,
      data: {
        category_id: 'category-id',
        name: 'Braids Medium',
        description: null,
        duration_minutes: 240,
        price_cents: 6000,
        price_max_cents: 8000,
      },
    })
  })

  it('allows creating a service without an explicit category', () => {
    expect(
      buildServiceInputFromFormValues({
        categoryId: '',
        name: 'Vanilles',
        description: '',
        duration: VALID_DURATION,
        price: VALID_PRICE,
        priceMax: '',
      })
    ).toEqual({
      success: true,
      data: {
        category_id: null,
        name: 'Vanilles',
        description: null,
        duration_minutes: 90,
        price_cents: 4550,
        price_max_cents: null,
      },
    })
  })

  it('rejects invalid service form values', () => {
    expect(
      buildServiceInputFromFormValues({
        categoryId: 'category-id',
        name: '',
        description: '',
        duration: VALID_DURATION,
        price: VALID_PRICE,
        priceMax: '',
      })
    ).toEqual({ success: false, error: 'Le nom est requis' })

    expect(
      buildServiceInputFromFormValues({
        categoryId: 'category-id',
        name: 'Brushing',
        description: '',
        duration: INVALID_DURATION,
        price: VALID_PRICE,
        priceMax: '',
      })
    ).toEqual({ success: false, error: 'La durée minimum est de 5 minutes' })

    expect(
      buildServiceInputFromFormValues({
        categoryId: 'category-id',
        name: 'Brushing',
        description: '',
        duration: VALID_DURATION,
        price: '80',
        priceMax: '60',
      })
    ).toEqual({
      success: false,
      error: 'Le prix maximum ne peut pas être inférieur au prix minimum',
    })

  })

  it('validates service image files', () => {
    expect(validateServiceImageFile(VALID_IMAGE_FILE)).toBeNull()
    expect(validateServiceImageFile({ ...VALID_IMAGE_FILE, type: 'image/gif' })).toBe(
      'Formats acceptés : JPG, PNG ou WebP.'
    )
    expect(validateServiceImageFile({ ...VALID_IMAGE_FILE, size: 6_000_000 })).toBe(
      'L’image ne doit pas dépasser 5 Mo.'
    )
  })

  it('derives service image extensions from mime types', () => {
    expect(getServiceImageExtension({ ...VALID_IMAGE_FILE, type: 'image/jpeg' })).toBe('jpg')
    expect(getServiceImageExtension({ ...VALID_IMAGE_FILE, type: 'image/png' })).toBe('png')
    expect(getServiceImageExtension(VALID_IMAGE_FILE)).toBe('webp')
  })

  it('computes mobile infinite scroll state for services', () => {
    expect(hasMoreServices(10, 25)).toBe(true)
    expect(hasMoreServices(25, 25)).toBe(false)
    expect(getNextServicesPage(2)).toBe(3)
  })

  it('keeps uncategorized services out of the public catalog filters', () => {
    expect(isPublicCatalogService(PUBLIC_SERVICE)).toBe(true)
    expect(isPublicCatalogService(UNCATEGORIZED_SERVICE)).toBe(false)
    expect(getDefaultPublicCatalogCategoryId([UNCATEGORIZED_SERVICE, PUBLIC_SERVICE])).toBe(
      'braids-category-id'
    )
  })
})
