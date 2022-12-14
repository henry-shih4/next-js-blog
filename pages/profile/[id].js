import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Loading from "../../components/Loading";
import Header from "../../components/Header";

export default function user() {
  const router = useRouter();
  const { id } = router.query;
  const token = cookies.get("TOKEN");
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, [id]);

  async function getUser() {
    try {
      const endpoint = "/api/users";
      const options = {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      setLoading(true);
      const response = await fetch(endpoint, options);
      const result = await response.json();
      const selectedUser = id ? result.filter((user) => user._id === id) : null;
      selectedUser ? setProfile(selectedUser[0]) : null;
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Header></Header>
      {loading ? (
        <Loading />
      ) : (
        <>
          {profile ? (
            <>
              <div className="flex justify-center items-center flex-col h-screen">
                <div>user: {profile.username}</div>
                <div>email: {profile.email}</div>
                <div>
                  joined on:
                  {` ${new Date(profile.createdAt).getMonth() + 1}/${new Date(
                    profile.createdAt
                  ).getDate()}/${new Date(profile.createdAt).getFullYear()}`}
                </div>
                <div>posts: {profile.numPosts ? profile.numPosts : null}</div>
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
}