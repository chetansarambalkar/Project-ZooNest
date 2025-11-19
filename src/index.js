import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     {/* Wrap the entire app with AuthProvider */}
      <App />
 
  </React.StrictMode>
);

reportWebVitals();
