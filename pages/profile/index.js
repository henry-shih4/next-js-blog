import { LoginContext } from "../../context/LoginContext";
import { useContext, useEffect, useState, useRef } from "react";
import FormData from "form-data";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function profile() {
  const [isLoggedIn, changeLoggedIn, activeUser, setCurrentUser] =
    useContext(LoginContext);
  const token = cookies.get("TOKEN");

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxiv9hzi7/upload";
  const CLOUDINARY_UPLOAD_PRESET = "rszs7nw5";
  const [selectedFile, setSelectedFile] = useState();
  const [photoURL, setPhotoURL] = useState();
  const [profile, setProfile] = useState();
  const [upload, setUpload] = useState(false);
  const myRef = useRef(0);

  useEffect(() => {
    addPhotoLink();
  }, [photoURL]);

  // useEffect(() => {
  //   myRef.current.addEventListener("transitionend", (e) => {
  //     if (e.propertyName === "opacity") {
  //       if (!myRef.current.classList.contains("hidden")) {
  //         myRef.current.classList.add("hidden");
  //       }
  //       myRef.current.classList.remove("hidden");
  //       console.log("opacity end");
  //     }
  //   });
  // }, []);

  useEffect(() => {
    getUser();
  }, [activeUser]);

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

  async function addPhotoLink() {
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
  }

  async function getUser() {
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
  }

  return (
    <>
      {activeUser ? (
        <>
          <Header></Header>
          <div className="flex justify-center items-center h-screen flex-col">
            <div>Your User Profile</div>
            <div>
              {profile ? (
                <img
                  src={`https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671467288/${profile.photoURL}`}
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
                    ? "flex justify-center m-2 h-[40px] opacity-100 duration-700 space-x-3"
                    : "flex justify-center m-2 h-0 opacity-0 duration-700 space-x-3"
                }
              >
                <form ref={myRef} onSubmit={handleFormSubmit}>
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
                    <div className="flex justify-center items-center cursor-pointer">
                      <div
                        className="small-button text-xs text-center"
                        onClick={() => {
                          setUpload(false);
                        }}
                      >
                        cancel
                      </div>
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
