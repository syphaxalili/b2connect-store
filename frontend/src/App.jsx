import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import GlobalSnackbarProvider from "./components/providers/GlobalSnackbarProvider";
import AppRouter from "./router";
import store from "./store";
import b2connectTheme from "./theme/b2connectTheme";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={b2connectTheme}>
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
