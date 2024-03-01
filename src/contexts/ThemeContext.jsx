import React, { createContext, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Create a Theme Context
const ThemeContext = createContext();

// Custom Hook to use Theme Context
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProviderWrapper = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Memoize the theme creation based on the prefersDarkMode value
  const theme = useMemo(
    () =>
      responsiveFontSizes(createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: "#6200EE",
          },
          secondary: {
            main: "#ffc400",
          },
        },
      })),
    [prefersDarkMode],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeProvider theme={theme}>

        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
