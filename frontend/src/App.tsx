import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts";
import Login from "./pages/login";
import { AuthProvider } from "./context/AuthProvider";
import RequireAuth from "./routes/RequireAuth";
import Register from "./pages/register";
import Unauthorized from "./pages/unauthorized";
import PersistLogin from "./routes/PersistLogin";
import User from "./pages/user";
import Tutor from "./pages/tutor";
import Admin from "./pages/admin";
import Missing from "./pages/missing";
import TutorAvailabilities from "./pages/tutorAvailabilities";
import MakeAppointment from "./pages/makeAppointment";

const ROLES = {
  User: "user",
  Tutor: "tutor",
  Admin: "admin",
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="tutorAvailabilities"  element={<TutorAvailabilities />} />
            <Route path="makeAppointment/:tutorID"  element={<MakeAppointment />} />

            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                <Route path="user" element={<User />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[ROLES.Tutor]} />}>
                <Route path="tutor" element={<Tutor />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="admin" element={<Admin />} />
              </Route>
            </Route>

            <Route path="*" element={<Missing />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
