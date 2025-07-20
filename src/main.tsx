import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Footer from "./components/footer.tsx"; // Import the Footer component

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
      {/* <Footer /> */}
  </StrictMode>
);
