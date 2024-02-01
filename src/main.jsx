import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Chat from "./pages/Chat.jsx";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6200EE",
    },
    secondary: {
      main: "#ffc400",
    },
  },
});
theme = responsiveFontSizes(theme);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "chat",
    element: <Chat />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
