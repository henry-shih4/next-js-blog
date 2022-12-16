import { useEffect, useState } from "react";
import Link from "next/link";

export default function register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const [pwStrength, setPwStrength] = useState();
  const [validUsername, setValidUsername] = useState(false);
  const [usernameHint, setUsernameHint] = useState(false);

  let alphaNum = new RegExp("[a-zA-Z0-9]");
  let alphaNumCombined = new RegExp("(?=.*[a-zA-Z])(?=.*[0-9])");
  let alphaNumCombinedSpecial = new RegExp(
    "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
  );

  let userRegex = new RegExp("[^A-Za-z 0-9]");

  useEffect(() => {
    if (alphaNumCombinedSpecial.test(password)) {
      setPwStrength("strong");
    } else if (alphaNumCombined.test(password)) {
      setPwStrength("medium");
    } else if (alphaNum.test(password) && password !== "") {
      setPwStrength("weak");
    } else {
      setPwStrength("");
    }
  }, [password]);

  useEffect(() => {
    if (!userRegex.test(username) && username !== "" && username.length >= 3) {
      setValidUsername(true);
    } else {
      setValidUsername(false);
    }
  }, [username]);

  useEffect(() => {
    console.log(validUsername);
  });

  // if (pwRegex2.test(password)) {
  //   setPwStrength("strong");
  // } else if (pwRegex.test(password)) {
  //   setPwStrength("medium");
  // } else

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
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="my-2">Register</div>
        <div className="relative py-4 w-[400px] h-[400px] bg-slate-300 rounded-lg flex flex-col justify-center items-center">
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col space-y-4 w-3/4 h-full items-center justify-center"
          >
            <div className="flex flex-col justify-center items-start">
              <div className="flex">
                <label for="username">Username</label>
              </div>
              <input
                required
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                onFocus={() => {
                  setUsernameHint(true);
                }}
                onBlur={() => {
                  setUsernameHint(false);
                }}
                id="username"
                maxlength="16"
                className={
                  validUsername
                    ? "border border-green-300 w-[200px]"
                    : "border border-black w-[200px]"
                }
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <div className="absolute bottom-0 text-[10px] bg-red-300">
                {usernameHint
                  ? "At least 3 characters, letters and numbers only"
                  : null}
              </div>
            </div>
            <div className="flex flex-col justify-center items-start">
              <label for="password">Password</label>
              <input
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                required
                maxlength="16"
                id="password"
                className="border border-black w-[200px]"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="w-[200px] bg-white h-[10px] rounded-lg">
              <div
                className={
                  pwStrength == "strong"
                    ? "bg-green-300 h-[10px] w-full"
                    : pwStrength == "weak"
                    ? "bg-red-400 h-[10px] w-1/3"
                    : pwStrength == "medium"
                    ? "bg-yellow-400 h-[10px] w-1/2"
                    : "bg-red-white h-[10px] w-full"
                }
              ></div>
              <div className="flex w-full justify-center items-center text-xs">
                {pwStrength == "strong"
                  ? "strong"
                  : pwStrength == "medium"
                  ? "medium"
                  : pwStrength == "weak"
                  ? "weak"
                  : null}
              </div>
            </div>
            <div className="mt-2 flex flex-col">
              <label for="email">Email</label>
              <input
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                required
                id="email"
                className="border border-black w-[200px]"
                type="email"
                value={email}
                placeholder="hendev@yahoo.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
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
