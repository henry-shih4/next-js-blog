import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Loading from "../../components/Loading";
import Header from "../../components/Header";

export default function User() {
  const router = useRouter();
  const { id } = router.query;
  const token = cookies.get("TOKEN");
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  useEffect(() => {
    getUser();
  }, [id, getUser]);

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
              <div className="flex justify-center items-center flex-col min-h-[calc(100vh-64px)]">
                <div>
                  <Image
                  alt='profile-picture'
                    src={
                      profile.photoURL
                        ? `https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671467288/${profile.photoURL}`
                        : "/images/default.png"
                    }
                    className="w-[200px] h-[200px] object-cover rounded-full"
                  />
                </div>
                <div>user: {profile.username}</div>
                <div>email: {profile.email}</div>
                <div>
                  joined on:
                  {` ${new Date(profile.createdAt).getMonth() + 1}/${new Date(
                    profile.createdAt
                  ).getDate()}/${new Date(profile.createdAt).getFullYear()}`}
                </div>
                <div>posts: {profile.numPosts ? profile.numPosts : 0}</div>
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
}
