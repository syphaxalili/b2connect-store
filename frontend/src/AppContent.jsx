import { useEffect } from "react";
import { useDispatch } from "react-redux";
import GlobalSnackbarProvider from "./components/providers/GlobalSnackbarProvider";
import AppRouter from "./router";
import { setUser } from "./store/slices/authSlice";
import { getUserData } from "./utils/storage";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restaurer les données utilisateur depuis le storage au chargement
    const userData = getUserData();
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [dispatch]);

  return (
    <>
      <AppRouter />
      <GlobalSnackbarProvider />
    </>
  );
};

export default AppContent;
