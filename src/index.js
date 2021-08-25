import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import { ParallaxProvider } from 'react-scroll-parallax';

// default CSS
import './assets/css/default.css';

// importing the root file
import App from './App';

// MaterialUI Snackbar
import { SnackbarProvider } from 'notistack';
// MaterialUI
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider 
      theme={createMuiTheme({
        typography: {
          fontFamily: "marcellus,Sans-serif"
        }
      })
    }>
      <SnackbarProvider maxSnack={3}>
        <ParallaxProvider>
          <App />
        </ParallaxProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);