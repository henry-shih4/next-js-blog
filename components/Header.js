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
  const [search, setSearch] = useState();
  const [userSuggestions, setUserSuggestions] = useState();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (search && search.length > 2) {
      let user = usersState.filter((user) => user.username.includes(search));
      console.log(user);
      setUserSuggestions(user);
    } else {
      setUserSuggestions("");
    }
  }, [search]);

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
      <div className="h-12 p-2 flex justify-between items-center">
        <div>
          <Link href={token ? "/posts" : "/login"}>ExerBlog</Link>
        </div>
        <div className="flex">
          <MagnifyingGlassIcon className="h-6 m-1" />
          <div className="flex flex-col">
            <div className="relative w-[200px]">
              <input
                type="text"
                className="border border-gray-300 w-full"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <div
                className={
                  userSuggestions
                    ? "absolute top-7 bg-slate-200 w-full z-10"
                    : "hidden" + "absolute top-7 bg-slate-200 w-full"
                }
              >
                {userSuggestions
                  ? userSuggestions.map((user) => (
                      <div
                        className=""
                        onClick={() => {
                          router.push(`/profile/${user._id}`);
                        }}
                      >
                        {user.username}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
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
