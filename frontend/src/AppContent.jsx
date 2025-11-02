import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getCurrentUser } from "./api";
import GlobalSnackbarProvider from "./components/common/GlobalSnackbarProvider";
import AppRouter from "./router";
import { setCredentials, setLoadingComplete } from "./store/slices/authSlice";
import {
  loadGuestCartFromStorage,
  mergeCartAsync
} from "./store/slices/cartSlice";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setCredentials(response.data));
        // Utilisateur connecté - fusionner le panier invité avec le panier utilisateur
        await dispatch(mergeCartAsync());
        dispatch(setLoadingComplete());
      } catch {
        dispatch(setLoadingComplete());
        // Utilisateur invité - charger le panier depuis localStorage
        dispatch(loadGuestCartFromStorage());
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
