import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MUITheme } from './sjui/style';

import Synth from './app/Synth';
import Keyboard from './sjui/Keyboard';

const App = () => (
  <MuiThemeProvider theme={MUITheme}>
    <div>YES LAWD!</div>
    <Synth></Synth>
    <Keyboard />
  </MuiThemeProvider>
);

export default App;
