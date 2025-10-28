import { createTheme } from "@mui/material/styles";

/**
 * Thème MUI personnalisé pour B2CONNECT
 * Couleurs principales de la marque et configurations des composants
 */
const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#1f2d3d", // Bleu foncé B2CONNECT
      light: "#2a3847", // Bleu clair
      dark: "#151f2b",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#f9f608", // Jaune B2CONNECT
      light: "#faf94d",
      dark: "#c5c406",
      contrastText: "#1f2d3d"
    },
    error: {
      main: "#d23313", // Rouge
      light: "#e05a3f",
      dark: "#a3270e",
      contrastText: "#ffffff"
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#000000"
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#ffffff"
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff"
    },
    text: {
      primary: "#1f2d3d",
      secondary: "#666666",
      disabled: "#999999"
    },
    background: {
      default: "#f6f6f6ff",
      paper: "#ffffff"
    },
    divider: "#e0e0e0"
  },

  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      color: "#1f2d3d",
      "@media (max-width:600px)": {
        fontSize: "2rem"
      }
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
      color: "#1f2d3d",
      "@media (max-width:600px)": {
        fontSize: "1.75rem"
      }
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: "#1f2d3d",
      "@media (max-width:600px)": {
        fontSize: "1.5rem"
      }
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: "#1f2d3d",
      "@media (max-width:600px)": {
        fontSize: "1.25rem"
      }
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#1f2d3d"
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#1f2d3d"
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#525252ff"
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#666666"
    },
    button: {
      textTransform: "none",
      fontWeight: 500
    }
  },

  shape: {
    borderRadius: 8
  },

  shadows: [
    "none",
    "0px 2px 4px rgba(31, 45, 61, 0.08)",
    "0px 4px 8px rgba(31, 45, 61, 0.12)",
    "0px 8px 16px rgba(31, 45, 61, 0.16)",
    "0px 12px 24px rgba(31, 45, 61, 0.18)",
    "0px 16px 32px rgba(31, 45, 61, 0.20)",
    ...Array(19).fill("0px 16px 32px rgba(31, 45, 61, 0.20)")
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "1rem",
          fontWeight: 500,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0px 8px 16px rgba(31, 45, 61, 0.16)"
          }
        },
        contained: {
          boxShadow: "0px 4px 8px rgba(31, 45, 61, 0.12)",
          "&:hover": {
            boxShadow: "0px 8px 16px rgba(31, 45, 61, 0.16)"
          }
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1f2d3d 0%, #2a3847 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #2a3847 0%, #1f2d3d 100%)"
          }
        },
        containedSecondary: {
          color: "#1f2d3d",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#c5c406"
          }
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2
          }
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 12px rgba(31, 45, 61, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0px 12px 24px rgba(31, 45, 61, 0.15)"
          }
        }
      }
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(31, 45, 61, 0.1)",
          backgroundColor: "#ffffff",
          color: "#1f2d3d"
        }
      }
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover fieldset": {
              borderColor: "#2a3847"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1f2d3d"
            }
          }
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        },
        elevation1: {
          boxShadow: "0px 2px 8px rgba(31, 45, 61, 0.08)"
        }
      }
    },

    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1200px)": {
            maxWidth: "1200px"
          }
        }
      }
    }
  },

  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
    }
  }
});

export default muiTheme;
