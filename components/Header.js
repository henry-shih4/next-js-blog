import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { LoginContext } from "../context/LoginContext";

export default function Header() {
  const token = cookies.get("TOKEN");
  const router = useRouter();
  const [isLoggedIn, changeLoggedIn, activeUser] = useContext(LoginContext);

  return (
    <>
      <div className="p-2 flex justify-between items-center">
        <div>ExerciseBlog</div>
        <div className="flex">
          <MagnifyingGlassIcon className="h-6 m-1" />
          <input type="text" className="border border-gray-300" />
        </div>
        <div className="flex items-center">
          <div>{activeUser ? activeUser.username : null}</div>
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
