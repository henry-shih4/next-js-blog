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
  const [isLoggedIn, changeLoggedIn, activeUser, setActiveUser] =
    useContext(LoginContext);
  const [usersState, setUsersState] = useState();
  const [search, setSearch] = useState();
  const [userSuggestions, setUserSuggestions] = useState();
  const [currentUserPhoto, setCurrentUserPhoto] = useState();
  const [showSuggestions, setShowSuggestions] = useState();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [usersState]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  useEffect(() => {
    if (search && search.length > 2) {
      let users = usersState.filter((user) => user.username.includes(search));
      setUserSuggestions(users);
    } else {
      setUserSuggestions("");
    }
  }, [search]);

  async function getUsers() {
    try {
      let res = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      let users = await res.json();
      if (res.status < 300) {
        setUsersState(users);
      } else if (res.status > 400) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getCurrentUser() {
    if (usersState) {
      let user = usersState.filter(
        (user) => user.username == activeUser.username
      );
      setCurrentUserPhoto(user[0].photoURL);
      setActiveUser({ ...activeUser, photoURL: user[0].photoURL });
    }
  }

  return (
    <>
      <div className="font-comfortaa h-16 p-2 flex justify-between items-center bg-[#D9D9D9] w-full">
        <div className="flex w-[400px] h-full">
          <Link
            className="flex w-full justify-center"
            href={token ? "/posts" : "/login"}
          >
            <img
              className="hidden md:block object-cover w-[240px] min-w-[180px]"
              src={"/images/fitforum.png"}
            />
            <div className="flex justify-center items-center text-2xl object-cover md:hidden space-x-1">
              <span className="text-[#5fbbb4]">f</span>
              <span className="text-[#818d71]">f</span>
            </div>
          </Link>
        </div>
        <div className="flex  justify-center items-center w-[400px] ">
          <div>
            <MagnifyingGlassIcon className="h-6 m-1" />
          </div>
          <div className="flex flex-col">
            <div
              className=" relative min-w-[180px] h-full "
              // onMouseLeave={() => {
              //   setShowSuggestions(false);
              // }}
            >
              <input
                type="text"
                className="border border-gray-300 w-full"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onFocus={() => {
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setShowSuggestions(false);
                }}
              />
              <div
                className={
                  showSuggestions
                    ? "absolute top-full bg-slate-200 w-full z-10"
                    : "hidden absolute top-full bg-slate-200 w-full"
                }
              >
                {userSuggestions
                  ? userSuggestions.map((user) => (
                      <div>
                        <button
                          className="w-full hover:bg-[#a0af8c]"
                          onMouseDown={() => {
                            router.push(`/profile/${user._id}`);
                          }}
                        >
                          {user.username}
                        </button>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around items-center w-[400px]">
          <div className="flex items-center space-x-3 mr-2 ">
            <div className="hidden md:block">
              <img
                src={
                  currentUserPhoto
                    ? `https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671467288/${currentUserPhoto}`
                    : "/images/default.png"
                }
                className=" w-[48px] h-[48px] object-cover rounded-full"
              />
            </div>
            {activeUser ? (
              <Link
                href="/profile"
                className="flex justify-center items-center font-bold hover:text-white duration-300"
              >
                {activeUser.username}
              </Link>
            ) : null}
          </div>
          <button
            className="hidden md:block p-2 m-2 rounded-md font-bold  hover:underline"
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
          <button
            className="block md:hidden"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 hover:text-white duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
