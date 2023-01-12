import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { LoginContext } from "../../context/LoginContext";
import Link from "next/link";
import Loading from "../../components/Loading";
import Leaderboard from "../../components/Leaderboard";
import Image from "next/image";

export default function Home({ posts }) {
  const [postsState, setPostsState] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState();
  const [duration, setDuration] = useState();
  const [exercise, setExercise] = useState({});
  const [exerciseList, setExerciseList] = useState([]);
  const [sets, setSets] = useState();
  const [reps, setReps] = useState();
  const [weight, setWeight] = useState();
  const [hoveredPost, setHoveredPost] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const token = cookies.get("TOKEN");
  const [isLoggedIn, changeLoggedIn, activeUser, ,] = useContext(LoginContext);
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    if (posts.status === 401 || !postsState) {
      router.push("/login");
    }
  });

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  const rankings = useMemo(() => {
    let map = {};
    for (let i = 0; i < posts.length; i++) {
      if (map[posts[i].author] == undefined) {
        map[posts[i].author] = 1;
      } else {
        map[posts[i].author] += 1;
      }
    }
    let sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted;
  }, [posts]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const data = {
        title: title,
        content: content,
        category: category,
        duration: duration,
        exercises: exerciseList,
        author: activeUser.username,
        authorImage: activeUser.photoURL,
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
        setShowAdd(false);
        setPostsState([...postsState, result]);
      }
    } catch (error) {
      console.log(error);
    }
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

  function handleExerciseDelete(exercise) {
    let filter = exerciseList.filter((item) => {
      return item.name !== exercise;
    });
    console.log(exercise);
    console.log(filter);
    setExerciseList([...filter]);
  }

  function handleFormReset() {
    setSets("");
    setReps("");
    setWeight("");
    setExercise({ name: "" });
    setTitle("");
    setContent("");
    setCategory("");
    setDuration("");
    setExercise({ name: "" });
    setExerciseList([]);
  }

  const updatePostCount = useCallback(async () => {
    try {
      if (posts && activeUser) {
        let authorPosts = posts.filter(
          (post) => post.author === activeUser.username
        );
        const data2 = {
          username: activeUser.username,
          numPosts: authorPosts.length,
        };
        const JSONdata2 = JSON.stringify(data2);
        const endpoint2 = "/api/users";

        const options2 = {
          // The method is PUT because we are updating data.
          method: "PUT",
          // Tell the server we're sending JSON.
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata2,
        };

        const response2 = await fetch(endpoint2, options2);

        if (response2.status < 300) {
          // console.log(response2);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [posts, activeUser, token]);

  useEffect(() => {
    updatePostCount();
  }, [updatePostCount]);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Header />
          <div className="flex flex-wrap justify-center items-center w-full relative bg-slate-500  min-h-[calc(100vh-64px)]">
            <div>
              <Leaderboard rankings={rankings ? rankings : null} />
            </div>
            {/*workout feed start */}
            <div className="bg-white w-[500px] m-3 rounded-xl lg:w-[800px]">
              <div className="flex justify-between items-center p-3">
                <div className="invisible w-[140px]"></div>
                <div className="text-xl flex justify-center items-center space-x-2">
                  <div>Workout Feed</div>
                  <Image
                    alt="list-icon"
                    height={48}
                    width={48}
                    src="/images/list.svg"
                  />
                </div>
                <div className="flex justify-center w-[140px]">
                  Add Workout
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="ml-1 w-6 h-6 hover:scale-110"
                      onClick={() => {
                        setShowAdd(true);
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-slate-200 h-[600px] overflow-auto">
                <div className="flex flex-col-reverse justify-center items-center">
                  {Array.isArray(postsState)
                    ? postsState.map((post) => {
                        return (
                          <div
                            className=" flex min-h-[100px] w-3/4 my-2 justify-center items-center relative rounded-lg"
                            key={post._id}
                            onMouseEnter={() => {
                              setHoveredPost(post._id);
                            }}
                            onMouseLeave={() => {
                              setHoveredPost("");
                            }}
                          >
                            <div className="flex flex-col justify-center items-center bg-white p-3 w-[400px] rounded-xl">
                              <div className="flex justify-around items-center h-[1/2] w-full space-x-3">
                                <div className="flex flex-col justify-center items-center  w-1/3 h-full">
                                  <div>
                                    <Image
                                      alt="profile-picture"
                                      height={60}
                                      width={60}
                                      src={
                                        post.authorImage
                                          ? `https://res.cloudinary.com/dxiv9hzi7/image/upload/v1671467288/${post.authorImage}`
                                          : "/images/default.png"
                                      }
                                      className="w-[60px] h-[60px] object-cover rounded-full"
                                    />
                                  </div>
                                  <div>
                                    {post.author ? `by ${post.author}` : null}
                                  </div>
                                </div>
                                <div className=" w-2/3 ">
                                  <div className="flex justify-center items-center">
                                    <div className="text-lg flex flex-col items-center space-y-2 ">
                                      <div className="text-xl">
                                        {post.title}
                                      </div>
                                      <div>
                                        <div className="flex space-x-3 items-center justify-center ">
                                          <div>{post.category}</div>
                                          <Image
                                            height={24}
                                            width={24}
                                            alt="exercise-category-icon"
                                            className="h-[24px] "
                                            src={
                                              post.category ===
                                              "Weight Training"
                                                ? "/images/weight.svg"
                                                : post.category === "Cardio"
                                                ? "/images/treadmill.svg"
                                                : post.category === "Sport"
                                                ? "/images/ball.svg"
                                                : "/images/default.png"
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="text-center text-sm">
                                        {post.duration} min
                                      </div>
                                      <div className="text-xs">
                                        {`${
                                          new Date(post.createdAt).getMonth() +
                                          1
                                        }/${new Date(
                                          post.createdAt
                                        ).getDate()}/${(
                                          new Date(
                                            post.createdAt
                                          ).getFullYear() + ""
                                        ).slice(-2)} @ ${
                                          new Date(post.createdAt).getHours() >
                                          12
                                            ? new Date(
                                                post.createdAt
                                              ).getHours() - 12
                                            : new Date(
                                                post.createdAt
                                              ).getHours()
                                        }:${
                                          (new Date(
                                            post.createdAt
                                          ).getMinutes() > 10
                                            ? ""
                                            : "0") +
                                          new Date(post.createdAt).getMinutes()
                                        } ${
                                          new Date(post.createdAt).getHours() >
                                          12
                                            ? "PM"
                                            : "AM"
                                        }`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                post._id === hoveredPost
                                  ? "flex items-center justify-center cursor-pointer absolute right-3 flex-end visible opacity-100 duration-300"
                                  : "flex items-center justify-center cursor-pointer absolute right-3 flex-end invisible opacity-0 duration-300"
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class={"w-6 h-6 hover:scale-110"}
                                onClick={() => {
                                  router.push(`/posts/${post._id}`);
                                }}
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>

            {/* modal start*/}

            <div
              className={
                showAdd
                  ? "text-white absolute bg-[#235789] z-10  min-w-[460px] py-2 h-max flex flex-col justify-center items-center visible opacity-100 duration-300"
                  : "absolute bg-slate-200 min-w-[460px] py-2  h-max flex flex-col justify-center items-center invisible opacity-0 duration-300"
              }
            >
              <div className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="flex w-6 h-6 m-1 float-right hover:cursor-pointer hover:scale-110"
                  onClick={(e) => {
                    setShowAdd(false);
                    handleFormReset();
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <form
                className="flex justify-center items-center flex-col h-full"
                onSubmit={handleFormSubmit}
                onReset={handleFormReset}
              >
                <div className="flex flex-col  justify-center items-center">
                  <div className="m-2 space-y-4 w-[400px]">
                    <div className="flex">
                      <label className="w-[100px] text-center" for="title">
                        Workout Title
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
                        required
                        value={category}
                        id="category"
                        className="w-1/2"
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
                      <label className="w-[120px] text-center" for="duration">
                        Duration (min)
                      </label>
                      <input
                        required
                        value={duration}
                        className="w-1/6"
                        id="duration"
                        type="number"
                        min="1"
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex justify-center items-center w-full space-x-5">
                        <div>Exercise List</div>
                        <div className="text-xs">
                          add specific exerices here
                        </div>
                      </div>
                      <div>
                        {exerciseList !== []
                          ? exerciseList.map((exercise) => {
                              return (
                                <div key={exercise.name} className="mx-2">
                                  {exercise.name}{" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="flex w-4 h-4 m-1 float-right hover:cursor-pointer hover:scale-110"
                                    onClick={() => {
                                      handleExerciseDelete(exercise.name);
                                    }}
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                              );
                            })
                          : null}
                      </div>
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
                      <div className="p-2 flex w-full justify-center items-center">
                        <div className="flex justify-center items-center">
                          <label for="sets">Sets</label>
                          <input
                            required
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
                        <div className="flex justify-center items-center">
                          <label for="reps">Reps</label>
                          <input
                            required
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
                        <div className="flex justify-center items-center">
                          <label for="weight">Weight - lbs</label>
                          <input
                            required
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
                    className="small-button border border-black w-[100px]"
                    type="submit"
                  >
                    Complete Workout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div>
          <>
            <div className="h-screen flex flex-col justify-center items-center">
              <Link href="/login">Please Log in</Link>
              <Loading />
            </div>
          </>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const serverToken = context.req.cookies;
  const websiteURL = process.env.VERCEL_URL || "localhost:3000";

  let res = await fetch(`http://${websiteURL}/api/posts`, {
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
