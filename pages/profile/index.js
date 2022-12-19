import { LoginContext } from "../../context/LoginContext";
import { useContext, useEffect, useState } from "react";
import FormData from "form-data";
import Header from "../../components/Header";
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

  useEffect(() => {
    addPhotoLink();
  }, [photoURL]);

  useEffect(() => {
    getUser();
  }, []);

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
      console.log(result);
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
              <img
                src={`https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671467288/${profile.photoURL}`}
                className="w-[200px] h-[200px] object-cover rounded-full"
              />
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671426394/rszs7nw5/pm0fhfovwotwpttklsmu.jpg"
                className=""
              />
              <form onSubmit={handleFormSubmit}>
                <input type="file" name="file" onChange={handleFileChange} />

                <button type="submit">upload picture</button>
              </form>
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
