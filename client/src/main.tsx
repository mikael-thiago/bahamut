import "./index.scss";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { LoggedGuard, UnloggedGuard } from "./guards/AuthGuards";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Login } from "./pages/Login/Login";
import React from "react";
import ReactDOM from "react-dom/client";
import { SignUp } from "./pages/SignUp/SignUp";
import { theme } from "../theme";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<UnloggedGuard />}>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
      </Route>
      <Route path="/" element={<LoggedGuard />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
