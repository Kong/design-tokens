import { config, RouterLinkStub } from '@vue/test-utils'

config.global.stubs = {
  ...(config.global.stubs ?? {}),
  RouterLink: RouterLinkStub,
}
