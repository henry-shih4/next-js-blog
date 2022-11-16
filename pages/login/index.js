import { useState, useEffect, useContext } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";
import Link from "next/link";
import { LoginContext } from "../../context/LoginContext";
import Loading from "../../components/Loading";

export default function login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const token = cookies.get("TOKEN");
  const router = useRouter();
  const [isLoggedIn, changeLoggedIn] = useContext(LoginContext);
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const data = {
        username: username,
        password: password,
      };
      const JSONdata = JSON.stringify(data);
      const endpoint = "/api/auth/auth";
      const options = {
        // The method is POST because we are sending data.
        method: "POST",
        // Tell the server we're sending JSON.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      };
      setLoading(true);
      const response = await fetch(endpoint, options);
      const result = await response.json();
      console.log(result);
      if (result.message === "Login Successful") {
        cookies.set("TOKEN", result.data.token, {
          maxAge: 600,
        });
        changeLoggedIn(true);
        // console.log(result.data.username, result.data.userId);
        // setCurrentUser(result.data.username);
        router.push("/posts");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="my-2">Login</div>
          <div className="py-4 w-[400px] bg-slate-300 rounded-lg flex flex-col justify-center items-center">
            <form className="flex flex-col space-y-2">
              <label for="username">Username:</label>
              <input
                id="username"
                className="border border-black"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <label for="password">Password:</label>
              <input
                id="password"
                className="border border-black"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className="flex justify-center items-center flex-col space-y-2">
                <button className="buttons" onClick={handleFormSubmit}>
                  Login
                </button>
                <Link
                  className="text-center w-[80px] hover:underline"
                  href="/register"
                >
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
