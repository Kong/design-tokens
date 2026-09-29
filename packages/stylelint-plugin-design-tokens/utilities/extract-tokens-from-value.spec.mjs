import { describe, expect, it } from 'vitest'
import extractTokensFromValue from './extract-tokens-from-value.mjs'
import { TOKEN_VALUES } from '../test-fixtures.mjs'

describe('extractTokensFromValue', () => {
  it('returns the bare token name, without the -- or $ sigil', () => {
    expect(extractTokensFromValue(TOKEN_VALUES.bothSigilsSameToken)).toEqual(['kui-color-text-primary'])
  })

  it('preserves the order of distinct tokens', () => {
    expect(extractTokensFromValue(TOKEN_VALUES.twoDistinctTokens)).toEqual(['kui-space-40', 'kui-space-60'])
  })

  it('ignores surrounding literal values', () => {
    expect(extractTokensFromValue(TOKEN_VALUES.surroundedByLiterals)).toEqual(['kui-color-border'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(extractTokensFromValue(TOKEN_VALUES.noToken)).toEqual([])
  })

  // KNOWN LIMITATION (S3): the regex carries the `i` flag and echoes the matched casing back.
  // Callers build their allow-list regexes WITHOUT `i`, so an uppercase token is extracted and
  // then can never match anything — which is what turns into the use-proper-token false
  // positive. Dropping the `i` flag here is the cleanest resolution; nothing relies on it.
  it('matches case-insensitively and preserves the matched casing', () => {
    expect(extractTokensFromValue(TOKEN_VALUES.uppercaseToken)).toEqual(['kui-COLOR-TEXT-PRIMARY'])
    expect(extractTokensFromValue(TOKEN_VALUES.uppercasePrefix)).toEqual(['KUI-SPACE-40'])
  })
})
