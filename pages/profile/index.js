import { LoginContext } from "../../context/LoginContext";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
export default function profile() {
  const [isLoggedIn, changeLoggedIn, activeUser, setCurrentUser] =
    useContext(LoginContext);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxiv9hzi7/upload";
  const CLOUDINARY_UPLOAD_PRESET = "rszs7nw5";
  const [selectedFile, setSelectedFile] = useState();

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const data = {};
    // const JSONdata = JSON.stringify(data);
    const endpoint = CLOUDINARY_URL;

    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();
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
                src="https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671402635/cld-sample-5.jpg"
                className="h-[100px]"
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
