import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts";
import Login from "./pages/login";
import { AuthProvider } from "./context/AuthProvider";
import RequireAuth from "./routes/RequireAuth";
import Register from "./pages/register";
import LinkPage from "./pages/links";
import Unauthorized from "./pages/unauthorized";
import PersistLogin from "./routes/PersistLogin";
import Home from "./pages/home";
import Tutor from "./pages/tutor";
import Admin from "./pages/admin";
import Missing from "./pages/missing";

const ROLES = {
  User: "user",
  Tutor: "tutor",
  Admin: "admin",
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="linkpage" element={<LinkPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            <Route element={<PersistLogin />}>
              <Route
                element={
                  <RequireAuth allowedRoles={[ROLES.User, ROLES.Tutor]} />
                }
              >
                <Route path="/" element={<Home />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[ROLES.Tutor]} />}>
                <Route path="tutor" element={<Tutor />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="admin" element={<Admin />} />
              </Route>
            </Route>

            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
