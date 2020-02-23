// Refer to https://github.com/system-ui/theme-ui/blob/master/packages/preset-base/src/index.js
// for the base theme presets
import theme from '@theme-ui/preset-base';

export default {
  ...theme,
  styles: {
    ...theme
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#319236',
    primaryDark: '#26732a',
    secondary: '#0288d1',
    secondaryDark: '#026397',
    muted: '#888',
    error: 'red'
  },
  layout: {
    container: {
      loginContainer: {
        maxWidth: 540
      }
    }
  },
  buttons: {
    primary: {
      marginTop: 3,
      fontWeight: 'bold',
      color: 'white',
      bg: 'primary',
      '&:hover': {
        bg: 'primaryDark'
      }
    },
    secondary: {
      marginTop: 3,
      fontWeight: 'bold',
      color: 'background',
      bg: 'secondary',
      '&:hover': {
        bg: 'secondaryDark'
      }
    }
  },
  forms: {
    label: {
      marginBottom: 2,
      marginTop: 2,
      color: 'black',
      fontSize: 1,
      login: {
        fontWeight: 'heading',
        color: 'black',
        fontSize: 3
      }
    },
    input: {
      marginBottom: 2,
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: t => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none'
      },
      error: {
        borderColor: 'error',
        '&:focus': {
          borderColor: 'error',
          boxShadow: t => `0 0 0 2px ${t.colors.error}`,
          outline: 'none'
        }
      }
    },
    select: {
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: t => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none'
      }
    },
    textarea: {
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: t => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none'
      }
    },
    checkbox: {},
    slider: {
      bg: 'muted'
    }
  }
};
