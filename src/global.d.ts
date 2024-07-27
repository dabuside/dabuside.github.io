import type { AstroIntegration } from '@swup/astro'

declare global {
  interface Window {
    swup: AstroIntegration
  }
}
