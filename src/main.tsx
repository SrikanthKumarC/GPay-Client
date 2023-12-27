import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import Transfer from "./Transfer.tsx";
import TransactionHistory from "./TransactionHistory.tsx";
import { Theme } from "@radix-ui/themes";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/transfer/:fromPhoneNumber",
    element: <Transfer />,
  },
  {
    path: "/",
    element:  <App />
  },
  {
    path: "/transaction-history/:phoneNumber",
    element: <TransactionHistory />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
    <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>
);
