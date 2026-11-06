import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/developer-theme.css";

function ReactSite() {
  React.useLayoutEffect(() => {
    // Keep Phoenix's readable fallback until React has committed successfully.
    document.getElementById("elixir-fallback-css")?.remove();
    document.getElementById("root").dataset.renderer = "react";
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReactSite />
  </React.StrictMode>
);
