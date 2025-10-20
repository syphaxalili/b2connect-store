import { useDispatch } from "react-redux";
import {
  showError,
  showInfo,
  showSnackbar,
  showSuccess,
  showWarning
} from "../store/slices/snackbarSlice";

export const useSnackbar = () => {
  const dispatch = useDispatch();

  return {
    showSuccess: (message) => dispatch(showSuccess(message)),
    showError: (message) => dispatch(showError(message)),
    showWarning: (message) => dispatch(showWarning(message)),
    showInfo: (message) => dispatch(showInfo(message)),
    showSnackbar: (config) => dispatch(showSnackbar(config))
  };
};
