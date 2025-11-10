import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getCurrentUser } from "./api";
import GlobalSnackbarProvider from "./components/common/GlobalSnackbarProvider";
import GlobalLoadingModal from "./components/common/GlobalLoadingModal";
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
      if (localStorage.getItem('isLoggedIn') === 'true') {
        try {
          const response = await getCurrentUser();
          dispatch(setCredentials(response.data));
          await dispatch(mergeCartAsync());
        } catch {
          dispatch(loadGuestCartFromStorage());
          localStorage.removeItem('isLoggedIn');
        }
      } else {
        dispatch(loadGuestCartFromStorage());
      }
      dispatch(setLoadingComplete());
    };

    hydrateAuth();
  }, []);

  return (
    <>
      <Router>{AppRouter()}</Router>
      <GlobalSnackbarProvider />
      <GlobalLoadingModal />
    </>
  );
};

export default AppContent;
