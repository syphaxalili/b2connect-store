import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import GlobalSnackbarProvider from "./components/providers/GlobalSnackbarProvider";
import AppRouter from "./router";
import store from "./store";

/**
 * Composant racine de l'application
 * Configure Redux, Router et les providers globaux
 */
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppRouter />
        <GlobalSnackbarProvider />
      </Router>
    </Provider>
  );
};

export default App;
