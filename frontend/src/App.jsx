import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import AppContent from "./AppContent";
import store from "./store";
import b2connectTheme from "./theme/b2connectTheme";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={b2connectTheme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
