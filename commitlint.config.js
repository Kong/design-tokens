module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 108],
  },
  ignores: [(message) => /^chore\(release\): .+$/m.test(message)],
}
