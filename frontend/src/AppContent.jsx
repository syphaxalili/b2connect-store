import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getCurrentUser } from "./api";
import GlobalSnackbarProvider from "./components/common/GlobalSnackbarProvider";
import AppRouter from "./router";
import { setCredentials, setLoadingComplete } from "./store/slices/authSlice";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setCredentials(response.data));
      } catch {
        console.log("Utilisateur non authentifié");
        dispatch(setLoadingComplete());
      }
    };

    hydrateAuth();
  }, [dispatch]);

  return (
    <>
      <Router>{AppRouter()}</Router>
      <GlobalSnackbarProvider />
    </>
  );
};

export default AppContent;
