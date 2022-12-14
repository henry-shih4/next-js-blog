import { LoginContext } from "../../context/LoginContext";
import { useContext, useEffect, useState, useCallback } from "react";
import FormData from "form-data";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
import Image from "next/image";
const cookies = new Cookies();

export default function Profile() {
  const [isLoggedIn, changeLoggedIn, activeUser, setCurrentUser] =
    useContext(LoginContext);
  const token = cookies.get("TOKEN");

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxiv9hzi7/upload";
  const CLOUDINARY_UPLOAD_PRESET = "rszs7nw5";
  const [selectedFile, setSelectedFile] = useState();
  const [photoURL, setPhotoURL] = useState();
  const [profile, setProfile] = useState();
  const [upload, setUpload] = useState(false);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const endpoint = CLOUDINARY_URL;

    const options = {
      // The method is POST because we are sending data.
      method: "POST",

      // Body of the request is the JSON data we created above.
      body: formData,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();
    if (response.status < 300) {
      console.log(response);
      setPhotoURL(result.public_id);
    } else if (response.status > 400) {
      console.log(result.message);
    }
    console.log(result);
  }

  const addPhotoLink = useCallback(async () => {
    // update post count on user when new post is added
    try {
      if (photoURL && activeUser) {
        const data = {
          username: activeUser.username,
          photoURL: photoURL,
        };
        const JSONdata = JSON.stringify(data);
        const endpoint = `/api/users/${activeUser.userId}`;

        const options = {
          // The method is PUT because we are updating data.
          method: "PUT",
          // Tell the server we're sending JSON.
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        };

        const response = await fetch(endpoint, options);
        const result = await response.json();
        console.log(response);
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [photoURL, token, activeUser]);

  useEffect(() => {
    addPhotoLink();
  }, [addPhotoLink]);

  const getUser = useCallback(async () => {
    try {
      if (activeUser.userId) {
        const endpoint = `/api/users/${activeUser.userId}`;
        const options = {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const response = await fetch(endpoint, options);
        const result = await response.json();
        if (response.status < 300) {
          setProfile(result);
        }
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }, [activeUser, profile, token]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <>
      {activeUser ? (
        <>
          <Header></Header>
          <div className="flex justify-center items-center  flex-col min-h-[calc(100vh-64px)]">
            <div>Your User Profile</div>
            <div>
              {profile ? (
                <Image
                  alt="profile-picture"
                  height={200}
                  width={200}
                  src={
                    profile.photoURL
                      ? `https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671467288/${profile.photoURL}`
                      : "/images/default.png"
                  }
                  className="w-[200px] h-[200px] object-cover rounded-full"
                />
              ) : (
                <Loading />
              )}
            </div>
            <div className="w-full">
              <div className="flex justify-center items-center">
                <button
                  className="small-button mt-4 text-xs"
                  onClick={() => setUpload(true)}
                >
                  Change Picture
                </button>
              </div>
              <div
                className={
                  upload
                    ? "flex justify-center box m-2"
                    : "flex justify-center box box-hidden m-2"
                }
                // className={
                //   upload
                //     ? "flex justify-center m-2 h-[40px] opacity-100 duration-700 space-x-3"
                //     : "flex justify-center m-2 h-0 opacity-0 duration-700 space-x-3"
                // }
              >
                <form onSubmit={handleFormSubmit}>
                  <div className="flex space-x-3">
                    <input
                      type="file"
                      name="file"
                      className=" border-black border-2 p-1"
                      onChange={handleFileChange}
                    />

                    <button className="small-button text-xs" type="submit">
                      upload
                    </button>
                    <div className="flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="text-black flex w-6 h-6 m-1 hover:cursor-pointer hover:scale-110"
                        onClick={() => {
                          setUpload(false);
                        }}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div>username: {activeUser.username}</div>
            <div>email: {activeUser.email}</div>
            <div>
              created:{" "}
              {`${new Date(activeUser.createdAt).getMonth() + 1}/${new Date(
                activeUser.createdAt
              ).getDate()}/${new Date(activeUser.createdAt).getFullYear()}`}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
