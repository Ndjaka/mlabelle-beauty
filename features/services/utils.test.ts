import { describe, expect, it } from 'vitest'
import {
  buildServiceInputFromFormValues,
  formatServiceDurationHint,
  getServiceImageExtension,
  parseServiceDurationMinutes,
  parseServicePriceCents,
  validateServiceImageFile,
} from '@/features/services/utils'

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

describe('service utils', () => {
  it('parses service durations in minutes', () => {
    expect(parseServiceDurationMinutes(VALID_DURATION)).toBe(90)
    expect(parseServiceDurationMinutes(MINIMUM_DURATION)).toBe(5)
    expect(parseServiceDurationMinutes(INVALID_DURATION)).toBeNull()
  })

  it('parses euro prices into cents', () => {
    expect(parseServicePriceCents(VALID_PRICE)).toBe(4550)
    expect(parseServicePriceCents('45.50')).toBe(4550)
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
      })
    ).toEqual({
      success: true,
      data: {
        category_id: 'category-id',
        name: 'Brushing',
        description: 'Mise en forme',
        duration_minutes: 90,
        price_cents: 4550,
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
      })
    ).toEqual({ success: false, error: 'Le nom est requis' })

    expect(
      buildServiceInputFromFormValues({
        categoryId: 'category-id',
        name: 'Brushing',
        description: '',
        duration: INVALID_DURATION,
        price: VALID_PRICE,
      })
    ).toEqual({ success: false, error: 'La durée minimum est de 5 minutes' })

    expect(
      buildServiceInputFromFormValues({
        categoryId: '',
        name: 'Brushing',
        description: '',
        duration: VALID_DURATION,
        price: VALID_PRICE,
      })
    ).toEqual({ success: false, error: 'La catégorie est requise' })
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
})
