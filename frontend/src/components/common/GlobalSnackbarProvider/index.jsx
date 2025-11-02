import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../../../store/slices/snackbarSlice";
import CustomSnackbar from "./CustomSnackbar";

const GlobalSnackbarProvider = () => {
  const dispatch = useDispatch();
  const { open, message, severity, autoHideDuration } = useSelector(
    (state) => state.snackbar
  );

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <CustomSnackbar
      open={open}
      onClose={handleClose}
      severity={severity}
      message={message}
      autoHideDuration={autoHideDuration}
    />
  );
};

export default GlobalSnackbarProvider;
