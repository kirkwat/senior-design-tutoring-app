import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { AlertCircle, Check, Info, X } from "lucide-react";
import { AxiosError } from "axios";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { useNavigateRole } from "src/hooks/useNavigateRole";
import useAuth from "src/hooks/useAuth";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";
const LOGIN_URL = "/auth";

const Register = () => {
  const { setAuth } = useAuth();
  const navigateUserRole = useNavigateRole();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd, name: "test", role: "tutor" }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

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

      setAuth({ user, role, accessToken });
      setUser("");
      setPwd("");
      setMatchPwd("");
      navigateUserRole(role);
    } catch (err) {
      const error = err as AxiosError;

      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

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
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Create your account by filling the form below
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="username" className="flex items-center">
          Username:
          <Check size={18} className={validName ? "block ml-1" : "hidden"} />
          <X
            size={18}
            className={validName || !user ? "hidden" : "block ml-1"}
          />
        </Label>
        <Input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
        />
        <Alert
          id="uidnote"
          className={userFocus && user && !validName ? "block" : "hidden"}
        >
          <Info className="h-4 w-4" />
          <AlertDescription>
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </AlertDescription>
        </Alert>
        <Label htmlFor="password" className="flex items-center space-x-1">
          Password:
          <Check size={18} className={validPwd ? "block ml-1" : "hidden"} />
          <X size={18} className={validPwd || !pwd ? "hidden" : "block ml-1"} />
        </Label>
        <Input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <Alert
          id="pwdnote"
          className={pwdFocus && !validPwd ? "block" : "hidden"}
        >
          <Info className="h-4 w-4" />
          <AlertDescription>
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </AlertDescription>
        </Alert>
        <Label htmlFor="confirm_pwd" className="flex items-center space-x-1">
          Confirm Password:
          <Check
            size={18}
            className={validMatch && matchPwd ? "block ml-1" : "hidden"}
          />
          <X
            size={18}
            className={validMatch || !matchPwd ? "hidden" : "block ml-1"}
          />
        </Label>
        <Input
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          required
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <Alert
          id="confirmnote"
          className={matchFocus && !validMatch ? "block" : "hidden"}
        >
          <Info className="h-4 w-4" />
          <AlertDescription>
            Must match the first password input field.
          </AlertDescription>
        </Alert>
        <Button
          className="w-full"
          type="submit"
          disabled={!validName || !validPwd || !validMatch ? true : false}
        >
          Sign Up
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already registered? &nbsp;
        <Link className="underline" to="/login">
          Sign In
        </Link>
      </div>
    </section>
  );
};

export default Register;
