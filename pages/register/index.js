import { useState } from "react";
import Link from "next/link";

export default function register() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  async function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
      email: email,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/users";

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
    if (response.status < 300) {
      console.log("new user added");
      setEmail("");
      setPassword("");
      setUsername("");
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="my-2">Register</div>
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
            <label for="email">Email:</label>
            <input
              id="email"
              className="border border-black"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="flex justify-center flex-col items-center space-y-2">
              <button className="buttons" onClick={handleFormSubmit}>
                Register
              </button>

              <Link
                className="text-center w-[80px] hover:underline"
                href="/login"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
