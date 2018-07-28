import { createMuiTheme } from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';


export const fontStyle = {
  fontFamily: 'Georgia',
  fontSize: '20px',
  lineHeight: 1.3,
  fontWeight: 'normal',
  fontStyle: 'normal',
  userSelect: 'none',
  pointerEvents: 'none',
};

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: indigo,
    secondary: { main: '#2e7d32' },
  },
});
