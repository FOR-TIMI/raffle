import { BrowserRouter as Router } from "react-router-dom";
import AuthWrapper from "./components/Smart/AuthWrapper";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <AuthWrapper>
        <AppRoutes />
      </AuthWrapper>
    </Router>
  );
}

export default App;
