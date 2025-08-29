import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IntlContextProvider } from "./context/IntlContext";
import { allRoutes } from "./routes";
import { ToastProvider } from "./components/ui/use-toast"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <IntlContextProvider>
      <Router>
        <ToastProvider>
          <Toaster />
          <Routes>
            {allRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </ToastProvider>
      </Router>
    </IntlContextProvider>
  );
}

export default App;
