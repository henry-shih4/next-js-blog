import { createContext, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const LoginContext = createContext();

function LoginProvider(props) {
  const token = cookies.get("TOKEN");
  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);
  // const [activeUser, setActiveUser] = useState("no active user");

  // function setCurrentUser(user) {
  //   if (user) {
  //     setActiveUser(user);
  //   }
  // }

  function changeLoggedIn(value) {
    setIsLoggedIn(value);
    if (value === false) {
      cookies.remove("TOKEN", { path: "/login" });
    }
  }

  return (
    <LoginContext.Provider value={[isLoggedIn, changeLoggedIn]}>
      {props.children}
    </LoginContext.Provider>
  );
}

export { LoginContext, LoginProvider };
