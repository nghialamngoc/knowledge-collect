import { breakpoints } from './common.config.mjs'

const config = {
  plugins: [
    // postcss-mixins phải được đặt trước tailwindcss
    [
      'postcss-mixins',
      {
        mixins: {
          media: (mixin, breakpoint1, breakpoint2) => {
            const bp1 = breakpoints[breakpoint1]
            const bp2 = breakpoints[breakpoint2]

            if (bp1 && bp2) {
              return {
                [`@media (min-width: ${bp1}) and (max-width: ${bp2})`]: {
                  '@mixin-content': {}
                }
              }
            }

            if (bp1) {
              return {
                [`@media screen and (min-width: ${bp1})`]: {
                  '@mixin-content': {}
                }
              }
            }

            return {}
          },

          'media-max': (mixin, breakpoint) => {
            const bp = breakpoints[breakpoint]

            if (bp) {
              return {
                [`@media screen and (max-width: ${bp})`]: {
                  '@mixin-content': {}
                }
              }
            }

            return {}
          }
        }
      }
    ],
    '@tailwindcss/postcss'
  ]
}

export default config
