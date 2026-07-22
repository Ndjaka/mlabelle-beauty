import { describe, expect, it } from 'vitest'
import { buildServiceCategoryInput } from '@/features/service-categories/utils'

describe('buildServiceCategoryInput', () => {
  it('normalise les espaces du nom', () => {
    const result = buildServiceCategoryInput('  Soins   profonds  ')

    expect(result).toEqual({ success: true, data: { name: 'Soins profonds' } })
  })

  it('refuse un nom vide', () => {
    const result = buildServiceCategoryInput('   ')

    expect(result).toEqual({
      success: false,
      error: 'Le nom de la catégorie est requis.',
    })
  })

  it('refuse un nom de plus de 80 caractères', () => {
    const result = buildServiceCategoryInput('a'.repeat(81))

    expect(result).toEqual({
      success: false,
      error: 'Le nom ne doit pas dépasser 80 caractères.',
    })
  })
})
