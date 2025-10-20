import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import GlobalSnackbarProvider from "./components/providers/GlobalSnackbarProvider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import store from "./store";
import { isAuthenticated } from "./utils/storage";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated() ? <Navigate to="/" /> : <Register />}
          />
        </Routes>
        <GlobalSnackbarProvider />
      </Router>
    </Provider>
  );
};

export default App;
