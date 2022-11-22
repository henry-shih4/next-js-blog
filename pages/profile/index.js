import { LoginContext } from "../../context/LoginContext";
import { useContext } from "react";
import Header from "../../components/Header";
export default function profile() {
  const [isLoggedIn, changeLoggedIn, activeUser, setCurrentUser] =
    useContext(LoginContext);

  return (
    <>
      {activeUser ? (
        <>
          <Header></Header>
          <div className="flex justify-center items-center h-screen flex-col">
            <div>Your User Profile</div>
            <div>username: {activeUser.username}</div>
            <div>id: {activeUser.userId}</div>
            <div>email: {activeUser.email}</div>
          </div>
        </>
      ) : null}
    </>
  );
}
