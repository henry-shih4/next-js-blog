import { createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";
const LoginContext = createContext();

function LoginProvider(props) {
  const token = cookies.get("TOKEN");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState({ user: "guest", id: "none" });
  const router = useRouter();

  useEffect(() => {
    if (token) {
      changeLoggedIn(true);
    } else if (!token) {
      changeLoggedIn(false);
    }
  }, [token, changeLoggedIn]);

  useEffect(() => {
    setActiveUser(parseJwt(token));
  }, [token]);

  function changeLoggedIn(value) {
    if (value === false) {
      cookies.remove("TOKEN", { path: "/login" });
    } else {
      setIsLoggedIn(value);
    }
  }

  function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }

  return (
    <LoginContext.Provider
      value={[isLoggedIn, changeLoggedIn, activeUser, setActiveUser]}
    >
      {props.children}
    </LoginContext.Provider>
  );
}

export { LoginContext, LoginProvider };
