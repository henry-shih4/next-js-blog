import { useState, useContext } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";
import Link from "next/link";
import { LoginContext } from "../../context/LoginContext";
import Loading from "../../components/Loading";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const token = cookies.get("TOKEN");
  const router = useRouter();
  const [, changeLoggedIn, ,] = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();

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
      if (response.status === 200) {
        cookies.set(
          "TOKEN",
          result.data.token,
          {
            maxAge: 800,
          },
          { path: "/" }
        );
        changeLoggedIn(true);
        router.push("/posts");
        return;
      } else if (response.status >= 400) {
        setMessage(result.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage(error);
    }
  }

  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <div>
            <div className="font-comfortaa text-3xl p-4 bg-white rounded-xl">
              <span className="text-[#235789] font-bold">fit</span>
              <span className="text-[#a0af8c]">forum</span>
            </div>
          </div>
          <div className="my-2">Login</div>
          <div className="py-4 w-[400px] bg-slate-300 rounded-lg flex flex-col justify-center items-center">
            <form
              className="flex flex-col space-y-4 w-full justify-center items-center"
              onSubmit={handleFormSubmit}
            >
              <div className="relative space-y-2">
                <div className="flex flex-col justify-center items-start">
                  <label for="username">Username</label>
                  <input
                    required
                    id="username"
                    className="w-[200px]"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <label for="password">Password</label>
                  <input
                    required
                    id="password"
                    className="w-[200px]"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="absolute -bottom-5 text-xs text-center w-full text-red-500">
                  {message ? message : null}
                </div>
              </div>
              <div className="flex justify-center items-center flex-col space-y-2">
                <button className="buttons" type="submit">
                  Login
                </button>
                <div className="flex space-x-4 w-full">
                  <div>Not a user?</div>
                  <Link
                    className="text-center w-[100px] hover:underline"
                    href="/register"
                  >
                    Register Here
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
