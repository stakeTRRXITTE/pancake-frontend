import { Token } from '@pancakeswap/swap-sdk-core'
import { describe, expect, it } from 'vitest'
import tryParseAmount from './tryParseAmount'

describe('utils/tryParseAmount', () => {
  it('should be undefined when no valid input', () => {
    expect(tryParseAmount()).toBeUndefined()
  })
  it('should be undefined when input is 0', () => {
    expect(tryParseAmount('0.00')).toBeUndefined()
  })

  it('should pared value', () => {
    expect(
      tryParseAmount(
        '100',
        new Token(
          56,
          '0x8CE592512B8BC92F0BEEac62F7cB692bb21aB225',
          18,
          'STAKE',
          'stakeTRRXITTE Token',
          'https://pancakeswap.finance/',
        ),
      ),
    ).toBeTruthy()
  })
})
