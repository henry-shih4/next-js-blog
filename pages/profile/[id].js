import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function user() {
  const router = useRouter();
  const { id } = router.query;
  const token = cookies.get("TOKEN");
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    getUser();
  }, [id]);

  async function getUser() {
    const endpoint = "/api/users";
    const options = {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    const response = await fetch(endpoint, options);
    const result = await response.json();

    const selectedUser = id ? result.filter((user) => user._id === id) : null;
    selectedUser ? setProfile(selectedUser[0]) : null;
  }

  return (
    <>
      {profile ? (
        <>
          <div>user: {profile.username}</div>
          <div>email: {profile.email}</div>
          <div>
            joined on:
            {` ${new Date(profile.createdAt).getMonth() + 1}/${new Date(
              profile.createdAt
            ).getDate()}/${new Date(profile.createdAt).getFullYear()}`}
          </div>
        </>
      ) : null}
    </>
  );
}
