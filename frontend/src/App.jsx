import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./AppContent";
import store from "./store";

/**
 * Composant racine de l'application
 * Configure Redux, Router et les providers globaux
 */
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
