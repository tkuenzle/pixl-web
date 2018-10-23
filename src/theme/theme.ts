import { createMuiTheme, Theme } from '@material-ui/core/styles';

const themeProps = {
  box: {
    borderRadius: 3,
  },
  breakpoints: {
    values: {
      lg: 1440,
      md: 840,
      sm: 600,
      xl: 1920,
      xs: 0,
    },
  },
  spacing: {
    unit: 8,
  },
};

export interface MyTheme extends Theme {
  sizes: {
    increment: number,
    mainContainerWidth: number,
    row: number,
    textInput: number,
  };
}

const baseTheme = createMuiTheme(themeProps);
const theme: MyTheme =  {
  ...baseTheme,
  sizes: {
    increment: 64,
    mainContainerWidth: 900,
    row: 48,
    textInput: 200,
  },
};

export default theme;

export const classNames = (classes: string[]) => classes.join(' ');
