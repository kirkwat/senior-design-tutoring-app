import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { AxiosError } from "axios";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { Checkbox } from "src/components/ui/checkbox";
import { Alert, AlertTitle } from "src/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigateRole } from "src/hooks/useNavigateRole";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth, persist, setPersist, auth } = useAuth();
  const navigateUserRole = useNavigateRole();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (auth.accessToken) {
      navigateUserRole();
    }
  }, [auth.accessToken, navigateUserRole]);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role as
        | "admin"
        | "tutor"
        | "user"
        | undefined;

      const id = response?.data?.id as number | undefined;

      setAuth({ user, role, accessToken, id });
      setUser("");
      setPwd("");
      navigateUserRole(role);
    } catch (err) {
      const error = err as AxiosError;

      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (error.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return (
    <section className="mx-auto max-w-[350px] space-y-6">
      <Alert
        ref={errRef}
        variant="destructive"
        className={errMsg ? "block mt-6" : "hidden"}
        aria-live="assertive"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{errMsg}</AlertTitle>
      </Alert>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Access your account by filling the form below
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Email:</Label>
          <Input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
        </div>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="persist"
            onCheckedChange={togglePersist}
            checked={persist}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Trust This Device
          </label>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Don't have an account? &nbsp;
        <Link className="underline" to="/register">
          Sign Up
        </Link>
      </div>
    </section>
  );
};

export default Login;
