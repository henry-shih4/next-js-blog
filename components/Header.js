import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { LoginContext } from "../context/LoginContext";

export default function Header() {
  const token = cookies.get("TOKEN");
  const router = useRouter();
  const [isLoggedIn, changeLoggedIn, activeUser] = useContext(LoginContext);
  const [usersState, setUsersState] = useState();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(()=>{
        console.log(usersState);
  })

  async function getUsers() {
    let res = await fetch("http://localhost:3000/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    let users = await res.json();
    setUsersState(users);
  }

  return (
    <>
      <div className="p-2 flex justify-between items-center">
        <div>
          <Link href="/posts">ExerBlog</Link>
        </div>
        <div className="flex">
          <MagnifyingGlassIcon className="h-6 m-1" />
          <input type="text" className="border border-gray-300" />
        </div>
        <div className="flex items-center">
          <div>
            {activeUser ? (
              <Link href="/profile">{activeUser.username}</Link>
            ) : null}
          </div>
          <button
            className="p-2 m-2 rounded-md "
            onClick={() => {
              if (token) {
                cookies.remove("TOKEN", { path: "/" });
                changeLoggedIn(false);
                router.push("/login");
              } else {
                router.push("/login");
              }
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
