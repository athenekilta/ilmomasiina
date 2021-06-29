// Refer to https://github.com/system-ui/theme-ui/blob/stable/packages/preset-base/src/index.ts
// for the base theme presets
// TODO: delete this file, theme-ui no longer used.
type Theme = any;
const base = {} as any;

export default {
  ...base as Theme,
  styles: {
    ...base.styles as Theme['styles'],
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#319236',
    primaryDark: '#26732a',
    secondary: '#0288d1',
    secondaryDark: '#026397',
    muted: '#888',
    error: 'red',
  },
  layout: {
    container: {
      loginContainer: {
        maxWidth: 540,
      },
    },
  },
  buttons: {
    primary: {
      marginTop: 3,
      fontWeight: 'bold',
      color: 'white',
      bg: 'primary',
      '&:hover': {
        bg: 'primaryDark',
      },
    },
    secondary: {
      marginTop: 3,
      fontWeight: 'bold',
      color: 'background',
      bg: 'secondary',
      '&:hover': {
        bg: 'secondaryDark',
      },
    },
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
        fontSize: 3,
      },
    },
    input: {
      marginBottom: 2,
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: (t: Theme) => `0 0 0 2px ${t.colors!.primary}`,
        outline: 'none',
      },
      error: {
        borderColor: 'error',
        '&:focus': {
          borderColor: 'error',
          boxShadow: (t: Theme) => `0 0 0 2px ${t.colors!.error}`,
          outline: 'none',
        },
      },
    },
    select: {
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: (t: Theme) => `0 0 0 2px ${t.colors!.primary}`,
        outline: 'none',
      },
    },
    textarea: {
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: (t: Theme) => `0 0 0 2px ${t.colors!.primary}`,
        outline: 'none',
      },
    },
    checkbox: {},
    slider: {
      bg: 'muted',
    },
  },
};
