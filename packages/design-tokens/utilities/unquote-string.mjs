export const unquoteString = (str) => String(str || '').replace(/^"(.*)"$/, '$1')
