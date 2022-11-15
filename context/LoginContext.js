import { createContext, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const LoginContext = createContext();

function LoginProvider(props) {
  const token = cookies.get("TOKEN");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const [activeUser, setActiveUser] = useState("guest");

  // function setCurrentUser(user) {
  //   if (user) {
  //     setActiveUser(user);
  //   } else return;
  // }

  function changeLoggedIn(value) {
    setIsLoggedIn(value);
    if (value === false) {
      cookies.remove("TOKEN", { path: "/login" });
    } else {
      return;
    }
  }

  return (
    <LoginContext.Provider value={[isLoggedIn, changeLoggedIn]}>
      {props.children}
    </LoginContext.Provider>
  );
}

export { LoginContext, LoginProvider };
