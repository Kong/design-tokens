import { describe, it, expect } from 'vitest'
import getInappropriateTokens from './get-inappropriate-tokens'

describe('getInappropriateTokens', () => {
  describe('general', () => {
    it('returns empty array when no token used in value', () => {
      const decl = {
        prop: 'color',
        value: 'red',
      }

      expect(getInappropriateTokens(decl)).toEqual([])
    })

    it('returns empty array when token is used for a property that is not guarded', () => {
      const decl = {
        prop: 'border-collapse',
        value: 'var(--kui-color-text)',
      }

      expect(getInappropriateTokens(decl)).toEqual([])
    })

    it('returns an array with token when inappropriate token used', () => {
      const decl = {
        prop: 'color',
        value: 'var(--kui-color-background, $kui-color-background)',
      }

      expect(getInappropriateTokens(decl)).toEqual(['kui-color-background'])
    })

    it('returns an array of unique tokens when multiple inappropriate tokens used', () => {
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

    it('returns an array of unique tokens when inappropriate component token used', () => {
      const decl = {
        prop: 'color',
        value: 'var(--kui-method-get-color-background, $kui-method-get-color-background)',
      }

      expect(getInappropriateTokens(decl)).toEqual(['kui-method-get-color-background'])
    })
  })

  describe('CSS variables', () => {
    it('returns empty array when no `kui-` token used in value', () => {
      const decl = {
        prop: 'color',
        value: 'var(--color-red)',
      }

      expect(getInappropriateTokens(decl)).toEqual([])
    })

    it('returns an array with token when inappropriate token used', () => {
      const decl = {
        prop: 'color',
        value: 'var(--kui-color-background)',
      }

      expect(getInappropriateTokens(decl)).toEqual(['kui-color-background'])
    })

    it('returns an array with token when inappropriate component token used', () => {
      const decl = {
        prop: 'color',
        value: 'var(--kui-method-color-background-get)',
      }

      expect(getInappropriateTokens(decl)).toEqual(['kui-method-color-background-get'])
    })
  })

  describe('SCSS variables', () => {
    it('returns empty array when no `kui-` token used in value', () => {
      const decl = {
        prop: 'color',
        value: '$color-red',
      }

      expect(getInappropriateTokens(decl)).toEqual([])
    })

    it('returns an array with token when inappropriate token used', () => {
      const decl = {
        prop: 'color',
        value: '$kui-color-background',
      }

      expect(getInappropriateTokens(decl)).toEqual(['kui-color-background'])
    })

    it('returns an array with token when inappropriate component token used', () => {
      const decl = {
        prop: 'color',
        value: '$kui-method-background-text-post',
      }

      expect(getInappropriateTokens(decl)).toEqual(['kui-method-background-text-post'])
    })
  })
})
