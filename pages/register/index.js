import { useState } from "react";
import Link from "next/link";

export default function register() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [error, setError] = useState();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const data = {
        username: username,
        password: password,
        email: email,
        numPosts: 0,
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
      } else if (response.status == 409) {
        console.log(result.conflict);
        setError(result.conflict);
      }
    } catch (error) {
      console.log(error.message);
      // setError(error.message);
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="my-2">Register</div>
        <div className="py-4 w-[400px] bg-slate-300 rounded-lg flex flex-col justify-center items-center">
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-2">
            <label for="username">Username</label>
            <input
              required
              id="username"
              className="border border-black"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <label for="password">Password</label>
            <input
              required
              id="password"
              className="border border-black"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label for="email">Email</label>
            <input
              required
              id="email"
              className="border border-black"
              type="email"
              value={email}
              placeholder="hendev@yahoo.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="flex justify-center flex-col items-center space-y-2">
              <div>{error ? error : null}</div>
              <button className="buttons" type="submit">
                Register
              </button>
              <div className="flex space-x-4">
                <div>Already a user?</div>
                <Link
                  className="text-center w-[80px] hover:underline"
                  href="/login"
                >
                  Login Here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
