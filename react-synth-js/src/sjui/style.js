import { createMuiTheme } from '@material-ui/core';

// Styled
import Colors from '../constants/Colors';

export const MUITheme = createMuiTheme({
  palette: {
    primary: { main: Colors.sjBlue },
    secondary: { main: Colors.sjOrange },
    error: { main: Colors.sjRed },
    default: { main: Colors.sjWhite },
    text: {
      primary: 'rgba(0, 0, 0, 0.85)',
      secondary: 'rgba(0, 0, 0, 0.60)',
    },
  },
  typography: {
    fontFamily: ['Avenir Next', 'Roboto', 'Arial', 'Helvetica', 'sans-serif'],
    // Account for base font-size of 62.5%.
    htmlFontSize: 10,
  },
});

export const xStyle = {
  white: '#FFFFFF',
  black: '#000000',
  blue: '#009BDE',
  orange: '#FFA649',
  red: '#FF7659',
  aqua: '#3CCAD7',
  teal: '#12AE9A',
};