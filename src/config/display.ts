/**
 * Figures that are supplied rather than read from the chain.
 *
 * @dev Everything else on the marketing surfaces comes out of a contract call. These do not,
 *      so they live here, apart, and are easy to find and change.
 *
 *      LIQUIDITY is the depth quoted for the strip and the asset field. It replaced a live sum
 *      of the stablecoin side of every registered Uniswap pool, which read around 9.5M and was
 *      judged to oversell the protocol: that depth belongs to Uniswap, not to Roxy. This value
 *      was supplied by the client. Do not treat it as a chain reading and do not wire it to
 *      one without agreeing the label first.
 */
export const LIQUIDITY = '129k'
