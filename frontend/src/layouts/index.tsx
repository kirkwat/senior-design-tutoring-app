import { Button } from "src/components/ui/button";
import useAuth from "src/hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { Link, useNavigate } from "react-router-dom";
import { useNavigateRole } from "src/hooks/useNavigateRole";
import { NotebookPenIcon } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const navigateUserRole = useNavigateRole();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="bg-foreground text-primary-foreground p-4 flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <NotebookPenIcon className="w-6 h-6" />
          <div className="font-bold text-xl">Tutoring App</div>
        </div>

        {auth?.accessToken ? (
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={() => navigateUserRole()}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button asChild variant="ghost">
            <Link to="/login">Sign In</Link>
          </Button>
        )}
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-muted text-center p-4 mt-8">
        © 2024 Tutoring App
      </footer>
    </div>
  );
};

export default Layout;
