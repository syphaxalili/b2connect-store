import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  onKeyDown,

  error,
  helperText,
  disabled,
  autoComplete = "current-password"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      name={name}
      type={showPassword ? "text" : "password"}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      error={error}
      helperText={helperText}
      disabled={disabled}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={disabled}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  );
};

export default PasswordField;
