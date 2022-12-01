import { LoginContext } from "../../context/LoginContext";
import { useContext, useEffect } from "react";
import Header from "../../components/Header";
export default function profile() {
  const [isLoggedIn, changeLoggedIn, activeUser, setCurrentUser] =
    useContext(LoginContext);

  useEffect(() => {
    console.log(activeUser);
  });
  return (
    <>
      {activeUser ? (
        <>
          <Header></Header>
          <div className="flex justify-center items-center h-screen flex-col">
            <div>Your User Profile</div>
            <div>username: {activeUser.username}</div>
            <div>email: {activeUser.email}</div>
            <div>
              created:{" "}
              {`${new Date(activeUser.createdAt).getMonth() + 1}/${new Date(
                activeUser.createdAt
              ).getDate()}/${new Date(activeUser.createdAt).getFullYear()}`}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
