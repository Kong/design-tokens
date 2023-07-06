/** The static token prefix */
const KONG_TOKEN_PREFIX = 'kui'
/** The build directory */
const BUILD_DIRECTORY = 'dist'
/** The tokens directory, inside the build directory to  */
const TOKEN_DIRECTORY = `${BUILD_DIRECTORY}/tokens`

module.exports = {
  KONG_TOKEN_PREFIX,
  TOKEN_DIRECTORY,
}
