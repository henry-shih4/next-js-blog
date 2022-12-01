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
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log(usersState);
  }, [usersState]);

  useEffect(() => {
    console.log(search);
    if (search && search.length > 2) {
      let user = usersState.filter((user) => user.username.includes(search));
      console.log(user);
      setSelectedUser(user);
    } else {
      setSelectedUser("");
    }
  }, [search]);

  useEffect(() => {
    console.log(selectedUser);
  });
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
          <div className="flex flex-col relative">
            <input
              type="text"
              className="border border-gray-300"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div className="absolute -bottom-5 bg-slate-200 w-full">
              {selectedUser
                ? selectedUser.map((user) => <div>{user.username}</div>)
                : null}
                {/* onClick={()=>{router.push(`/profile/${selectedUser}`);}} */}
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
