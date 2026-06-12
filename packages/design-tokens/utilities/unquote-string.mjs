/** Strips surrounding double-quotes from a stringified JSON value. */
export const unquoteString = (str) => String(str || '').replace(/^"(.*)"$/, '$1')
