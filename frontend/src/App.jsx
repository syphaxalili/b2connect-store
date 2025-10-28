import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import GlobalSnackbarProvider from "./components/providers/GlobalSnackbarProvider";
import AppRouter from "./router";
import store from "./store";
import muiTheme from "./theme/muiTheme";

/**
 * Composant racine de l'application
 * Configure Redux, Router et les providers globaux
 */
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router>
          <AppRouter />
          <GlobalSnackbarProvider />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
