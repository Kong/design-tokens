const unquoteString = (str) => String(str || '').replace(/^"(.*)"$/, '$1')

module.exports = unquoteString
