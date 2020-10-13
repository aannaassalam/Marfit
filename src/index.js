import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { CookiesProvider } from "react-cookie";
import * as serviceWorker from "./serviceWorker";

import firebase from "./config/firebaseConfig";

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CookiesProvider>,
  document.getElementById("root")
);
serviceWorker.register();
