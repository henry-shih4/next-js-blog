import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { LoginContext } from "../../context/LoginContext";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

export default function post({ post }) {
  const [time, setTime] = useState();
  const router = useRouter();
  const { id } = router.query;
  const token = cookies.get("TOKEN");
  const [isLoggedIn, changeLoggedIn] = useContext(LoginContext);

  useEffect(() => {
    if (post.status === 401) {
      router.push("/login");
    }
  }, [post]);

  useEffect(() => {
    const d = new Date(post.createdAt);
    let hours;
    let meridian;
    if (d.getHours() > 12) {
      hours = d.getHours() - 12;
    } else {
      hours = d.getHours();
    }
    if (d.getHours() > 12) {
      meridian = "PM";
    } else {
      meridian = "AM";
    }
    setTime(
      `${
        d.getMonth() + 1
      }/${d.getDate()}/${d.getFullYear()} at ${hours}:${d.getMinutes()} ${meridian}`
    );
  }, []);

  async function handlePostDelete() {
    const data = {
      id: id,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/posts";

    const options = {
      // The method is POST because we are sending data.
      method: "DELETE",
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
    if (response.status < 300) {
      router.push("/posts");
    }
  }

  return (
    <>
      <Header />
      {isLoggedIn ? (
        <div className="h-screen flex flex-col justify-center items-center">
          {post ? (
            <>
              <div className="flex flex-col justify-center items-center ">
                <div>{time}</div>
                <div>Workout: {post.title}</div>
                <div>Type: {post.category}</div>
                <div>Duration: {post.duration} min</div>
                <div>Notes: {post.content}</div>
              </div>
              <div className="flex justify-center items-center flex-wrap">
                {post.exercises
                  ? post.exercises.map((exercise, index) => {
                      return (
                        <div>
                          <div className="border border-black w-[200px] flex flex-col justify-center items-center">
                            <div>Exercise {index + 1}</div>
                            <div>{exercise.name}</div>
                            {exercise.weight ? (
                              <div>{exercise.weight} lbs</div>
                            ) : null}
                            {exercise.sets ? (
                              <div>{exercise.sets} sets</div>
                            ) : null}
                            {exercise.reps ? (
                              <div>{exercise.reps} reps</div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </>
          ) : null}
          <div className="flex justify-center space-x-4">
            <button className="p-2 buttons" onClick={handlePostDelete}>
              Delete
            </button>
            <button
              className="p-2 buttons"
              onClick={() => {
                router.push("/posts");
              }}
            >
              Home
            </button>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const serverToken = context.req.cookies;

  let res = await fetch(`http://localhost:3000/api/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${serverToken.TOKEN}`,
    },
  });
  let post = await res.json();

  return {
    props: { post },
  };
}
