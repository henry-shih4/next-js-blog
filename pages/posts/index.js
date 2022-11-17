import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { LoginContext } from "../../context/LoginContext";
import Loading from "../../components/Loading";

export default function home({ posts }) {
  const [postsState, setPostsState] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState();
  const [duration, setDuration] = useState();
  const [exercise, setExercise] = useState({});
  const [exerciseList, setExerciseList] = useState([]);
  const [time, setTime] = useState();
  const [sets, setSets] = useState();
  const [reps, setReps] = useState();
  const [weight, setWeight] = useState();
  const token = cookies.get("TOKEN");
  const [isLoggedIn, changeLoggedIn] = useContext(LoginContext);
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };


  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  useEffect(() => {
    if (posts.message === "not authenticated") {
      router.push("/login");
    }
  });

  async function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
      title: title,
      content: content,
      category: category,
      duration: duration,
      exercises: exerciseList,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/posts";

    const options = {
      // The method is POST because we are sending data.
      method: "POST",
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
      refreshData();
    }
    console.log(result);

    setPostsState([...postsState, result]);
    setTitle("");
    setContent("");
    setCategory("");
    setDuration("");
    setExercise({ name: "" });
    setExerciseList([]);
  }

  function handleAddExercise(e) {
    e.preventDefault();
    setExerciseList([...exerciseList, exercise]);
    setSets("");
    setReps("");
    setWeight("");
    setExercise({ name: "" });
  }
  return (
    <>
      {isLoggedIn ? (
        <>
          <Header />
          <div className="flex flex-wrap justify-around items-center ">
            <div className="flex flex-col-reverse h-[600px] w-1/2 bg-slate-100 overflow-scroll">
              {postsState
                ? postsState.map((post) => {
                    return (
                      <div
                        onClick={() => {
                          router.push(`/posts/${post._id}`);
                        }}
                        className="bg-red-300 h-[100px] w-full p-2 m-2"
                        key={post._id}
                      >
                        <div>{post.title}</div>
                        <div>
                          {`${
                            new Date(post.createdAt).getMonth() + 1
                          }/${new Date(post.createdAt).getDate()}/${new Date(
                            post.createdAt
                          ).getFullYear()}, ${
                            new Date(post.createdAt).getHours() > 12
                              ? new Date(post.createdAt).getHours() - 12
                              : new Date(post.createdAt).getHours()
                          }:${
                            (new Date(post.createdAt).getMinutes() > 10
                              ? ""
                              : "0") + new Date(post.createdAt).getMinutes()
                          } ${
                            new Date(post.createdAt).getHours() > 12
                              ? "PM"
                              : "AM"
                          }`}
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
            <div>
              <form className="flex flex-col " onSubmit={handleFormSubmit}>
                <div className="flex flex-col bg-blue-300 justify-center items-center">
                  <div className="m-2 space-y-4 w-[400px]">
                    <div className="flex">
                      <label className="w-[100px] text-center" for="title">
                        Title
                      </label>
                      <input
                        className="w-2/3"
                        id="title"
                        type="text"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex">
                      <label className="w-[100px] text-center" for="category">
                        Category
                      </label>
                      <select
                        value={category}
                        id="category"
                        className="w-2/3"
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                      >
                        <option value="" disabled selected>
                          Select a category
                        </option>
                        <option value="Weight Training">Weight Training</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Sport">Sport</option>
                      </select>
                    </div>
                    <div className="flex">
                      <label className="w-[100px] text-center" for="duration">
                        Duration
                      </label>
                      <input
                        value={duration}
                        className="w-2/3"
                        id="duration"
                        type="number"
                        min="1"
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                    <div className="flex">
                      <label className="w-[100px] text-center" for="exercise">
                        Exercise
                      </label>
                      <input
                        className="w-2/3"
                        value={exercise.name}
                        type="text"
                        onChange={(e) =>
                          setExercise({ ...exercise, name: e.target.value })
                        }
                      />
                    </div>
                    {category == "Weight Training" ? (
                      <div className="p-2 flex w-full justify-center">
                        <div className="">
                          <label for="sets">Sets</label>
                          <input
                            value={sets}
                            className="ml-2 w-1/3"
                            id="sets"
                            type="number"
                            onChange={(e) => {
                              setExercise({
                                ...exercise,
                                sets: e.target.value,
                              });
                              setSets(e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <label for="reps">Reps</label>
                          <input
                            value={reps}
                            className="ml-2 w-1/3"
                            id="reps"
                            type="number"
                            onChange={(e) => {
                              setExercise({
                                ...exercise,
                                reps: e.target.value,
                              });
                              setReps(e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <label for="weight">Weight - lbs</label>
                          <input
                            value={weight}
                            className="ml-2 w-1/3"
                            id="weight"
                            type="number"
                            onChange={(e) => {
                              setExercise({
                                ...exercise,
                                weight: e.target.value,
                              });
                              setWeight(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="w-full flex justify-center items-center">
                      <button
                        className="border border-black w-[100px]"
                        onClick={handleAddExercise}
                      >
                        add exercise
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div>Exercises to add</div>
                      {exerciseList
                        ? exerciseList.map((exercise) => {
                            return <div className="mx-2">{exercise.name}</div>;
                          })
                        : null}
                    </div>
                    <div className="flex">
                      <label className="w-[100px] text-center" for="notes">
                        Notes
                      </label>
                      <textarea
                        rows="1"
                        className="w-2/3"
                        id="notes"
                        type="text"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 w-full flex justify-center">
                  <button
                    className="border border-black w-[100px]"
                    type="submit"
                  >
                    Add Workout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const serverToken = context.req.cookies;
  let res = await fetch("http://localhost:3000/api/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${serverToken.TOKEN}`,
    },
  });
  let posts = await res.json();

  return {
    props: { posts },
  };
}
