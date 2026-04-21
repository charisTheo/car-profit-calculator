import { useMemo } from "react";
import { createTheme, useMediaQuery } from "@mui/material";

export function getAppTheme(prefersDarkMode) {
  return createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: prefersDarkMode ? "#90caf9" : "#1976d2",
      },
    },
    typography: {
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
  });
}

export function useAppTheme() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return useMemo(() => getAppTheme(prefersDarkMode), [prefersDarkMode]);
}
