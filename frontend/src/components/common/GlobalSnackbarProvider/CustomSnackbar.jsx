import { CheckCircle } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";

const CustomSnackbar = ({
  open,
  onClose,
  severity = "success",
  message,
  autoHideDuration = 3000
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        variant="filled"
        severity={severity}
        icon={severity === "success" ? <CheckCircle /> : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          minWidth: "400px",
          "& .MuiAlert-icon": {
            fontSize: "2rem"
          },
          "& .MuiAlert-message": {
            fontSize: "1.3rem"
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
