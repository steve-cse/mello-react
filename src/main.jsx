import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Chat from "./pages/Chat.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute"
import UpdatePassword from "./pages/UpdatePassword.jsx";
import Incognito from "./pages/Incognito.jsx";
import About from "./pages/About.jsx"
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
    path: "/chat", 
    element: <ProtectedRoute>  <Chat /> </ProtectedRoute>
  },
  {
    path: "/login",
    element: <Login/> 
  },
  {
    path: "/signup",
    element:<Signup/>
  },
  {
    path: "/forgot-password",
    element:<ForgotPassword/>
  },
  {
    path: "/update-password",
    element:<UpdatePassword/>
  },
  {
    path: "/incognito",
    element: <Incognito/>
  },
  {
    path: "/about",
    element: <About/>
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
