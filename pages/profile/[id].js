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
    console.log(profile);
  });

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
    // console.log(result);
    // console.log(response);

    const selectedUser = id ? result.filter((user) => user._id === id) : null;
    selectedUser ? setProfile(selectedUser[0]) : null;
  }

  return (
    <>
      {profile ? (
        <>
          <div>{profile.username}</div>
          <div>{profile.email}</div>
          <div>{profile._id}</div>
          <div>
            {`${new Date(activeUser.createdAt).getMonth() + 1}/${new Date(
              activeUser.createdAt
            ).getDate()}/${new Date(activeUser.createdAt).getFullYear()}`}
          </div>
        </>
      ) : null}
    </>
  );
}
