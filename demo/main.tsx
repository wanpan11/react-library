import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./src/App";

const dom = document.getElementById("root") as Element;
const root = createRoot(dom);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
