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
          minWidth: { xs: "auto", sm: "400px" },
          maxWidth: { xs: "calc(100vw - 32px)", sm: "100%" },
          "& .MuiAlert-icon": {
            fontSize: { xs: "1.5rem", sm: "2rem" }
          },
          "& .MuiAlert-message": {
            fontSize: { xs: "0.95rem", sm: "1.3rem" }
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
