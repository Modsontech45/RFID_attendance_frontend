import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IntlContextProvider } from "./context/IntlContext";
import { allRoutes } from "./routes";


function App() {
  return (
    <IntlContextProvider>
      <Router>
        <Routes>
          {allRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Router>
    </IntlContextProvider>
  );
}

export default App;
