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
import CreateAppointment from "./pages/create";
import TutorProfile from "./pages/tutorProfile";
import EditTutorProfile from "./pages/editTutorProfile";
import { Toaster } from "./components/ui/sonner";

const ROLES = {
  User: "user",
  Tutor: "tutor",
  Admin: "admin",
} as const;

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route element={<PersistLogin />}>
                <Route path="/" element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route
                  path="tutorProfile/:tutorID"
                  element={<TutorProfile />}
                />

                <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                  <Route path="user" element={<User />} />
                  <Route
                    path="tutorAvailabilities"
                    element={<TutorAvailabilities />}
                  />
                  <Route
                    path="makeAppointment/:tutorID"
                    element={<MakeAppointment />}
                  />
                </Route>
                <Route element={<RequireAuth allowedRoles={[ROLES.Tutor]} />}>
                  <Route path="tutor" element={<Tutor />} />
                  <Route path="tutor/create" element={<CreateAppointment />} />
                  <Route path="tutor/edit" element={<EditTutorProfile />} />
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
      <Toaster />
    </>
  );
};

export default App;
