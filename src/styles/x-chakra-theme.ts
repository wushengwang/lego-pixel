import { extendTheme } from '@chakra-ui/react'

export const breakpoints = {
  sm: '640px', // >=640px
  md: '768px', // >=768px
  lg: '1024px', // >=1024px
  xl: '1280px', // >=1280px
  '2xl': '1536px' // >=1536px
}

export const xChakraTheme = extendTheme({
  breakpoints,
  fonts: {
    poppins: 'Poppins',
    termina: 'Termina'
  },
  colors: {
    darkblue: '#21213B',
    brand: {
      // Brand Colors
      xcyan: '#7dd5f9',
      xpink: '#e6b1f9',
      xdarkblue: '#0a1161',
      xwhite: '#fefefe'
    }
  },
  // 在chakra-ui 内置样式的基础上，定义全局样式
  styles: {
    global: {
      'html, body': {
        bg: '#141430'
      }
    }
  },
  components: {
    Accordion: {
      baseStyle: {
        container: {
          borderTopWidth: '0px',
          _last: {
            borderBottomWidth: '0px'
          }
        },
        button: {
          _hover: {
            bg: 'transparent'
          }
        }
      },
      sizes: {},
      variants: {},
      defaultProps: {}
    },
    Slider: {
      baseStyle: {
        thumb: {
          bg: '#7dd5f9'
        },
        filledTrack: {
          bg: '#7dd5f9'
        },
        track: {
          bg: 'rgba(254, 254, 254, 0.1)',
          borderRadius: '9px'
        }
      }
    }
  }
})
