import { createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const LoginContext = createContext();

function LoginProvider(props) {
  const token = cookies.get("TOKEN");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [activeUser, setActiveUser] = useState("guest");

  // useEffect(() => {
  //   if (token) {
  //     changeLoggedIn(true);
  //   } else if (!token) {
  //     changeLoggedIn(false);
  //   }
  // }, [token, changeLoggedIn]);

  useEffect(() => {
    console.log(token);
  });

  // function setCurrentUser(user) {
  //   if (user) {
  //     setActiveUser(user);
  //   } else return;
  // }

  function changeLoggedIn(value) {
    if (value === false) {
      cookies.remove("TOKEN", { path: "/login" });
    } else {
      setIsLoggedIn(value);
    }
  }

  return (
    <LoginContext.Provider value={[isLoggedIn, changeLoggedIn]}>
      {props.children}
    </LoginContext.Provider>
  );
}

export { LoginContext, LoginProvider };
