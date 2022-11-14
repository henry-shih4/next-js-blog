import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";

export default function login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const token = cookies.get("TOKEN");
  const router = useRouter();

  useEffect(() => {
    console.log(token);
  }, [token]);

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
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();
      console.log(result);
      if (result.message === "Login Successful") {
        cookies.set("TOKEN", result.data.token, {
          maxAge: 600,
        });
        router.push("/posts");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
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
            <button onClick={handleFormSubmit}>Login</button>
          </form>
        </div>
      </div>
    </>
  );
}

// export async function getServerSideProps(context) {
//   let res = await fetch("http://localhost:3000/api/users", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   let posts = await res.json();

//   return {
//     props: { users },
//   };
// }
