import { describe, it, expect } from 'vitest'
import getInappropriateTokens from './getInappropriateTokens'

describe('getInappropriateTokens', () => {
  it('returns empty array when no token used in value', () => {
    const decl = {
      prop: 'color',
      value: 'red',
    }

    expect(getInappropriateTokens(decl)).toEqual([])
  })

  it('returns empty array when no `kui-` token used in value (CSS variable)', () => {
    const decl = {
      prop: 'color',
      value: 'var(--color-red)',
    }

    expect(getInappropriateTokens(decl)).toEqual([])
  })

  it('returns empty array when no `kui-` token used in value (SCSS variable)', () => {
    const decl = {
      prop: 'color',
      value: '$color-red',
    }

    expect(getInappropriateTokens(decl)).toEqual([])
  })

  it('returns empty array when property is not enforced', () => {
    const decl = {
      prop: 'border-collapse',
      value: 'var(--kui-color-text)',
    }

    expect(getInappropriateTokens(decl)).toEqual([])
  })

  it('returns an array with token when inappropriate token used (CSS variable)', () => {
    const decl = {
      prop: 'color',
      value: 'var(--kui-color-background)',
    }

    expect(getInappropriateTokens(decl)).toEqual(['kui-color-background'])
  })

  it('returns an array with token when inappropriate token used (SCSS variable)', () => {
    const decl = {
      prop: 'color',
      value: '$kui-color-background',
    }

    expect(getInappropriateTokens(decl)).toEqual(['kui-color-background'])
  })

  it('returns an array with token when inappropriate token used (CSS variable with SCSS fallback)', () => {
    const decl = {
      prop: 'color',
      value: 'var(--kui-color-background, $kui-color-background)',
    }

    expect(getInappropriateTokens(decl)).toEqual(['kui-color-background'])
  })

  it('returns an array of unique tokens when multiple inappropriate tokens used (CSS variables with SCSS fallbacks)', () => {
    const decl = {
      prop: 'border',
      value: 'var(--kui-space-10, $kui-space-10) solid var(--kui-color-text, $kui-color-text)',
    }

    expect(getInappropriateTokens(decl)).toEqual(['kui-space-10', 'kui-color-text'])
  })

  it('returns empty array when appropriate component token used', () => {
    const decl = {
      prop: 'color',
      value: 'var(--kui-method-get-color-text)',
    }

    expect(getInappropriateTokens(decl)).toEqual([])
  })

  it('returns an array with token when inappropriate component token used (CSS variable)', () => {
    const decl = {
      prop: 'color',
      value: 'var(--kui-method-get-color-background)',
    }

    expect(getInappropriateTokens(decl)).toEqual(['kui-method-get-color-background'])
  })

  it('returns an array of unique tokens when inappropriate component token used (CSS variable with SCSS fallback)', () => {
    const decl = {
      prop: 'color',
      value: 'var(--kui-method-get-color-background, $kui-method-get-color-background)',
    }

    expect(getInappropriateTokens(decl)).toEqual(['kui-method-get-color-background'])
  })
})
