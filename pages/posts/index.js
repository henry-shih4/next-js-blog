import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function home({ posts }) {
  const [postsState, setPostsState] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState();
  const [duration, setDuration] = useState();
  const [exercise, setExercise] = useState({});
  const [exerciseList, setExerciseList] = useState([]);

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  useEffect(() => {
    console.log(exercise);
  }, [exercise]);

  useEffect(() => {
    console.log(exerciseList);
  }, [exerciseList]);

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
  }

  function handleAddExercise(e) {
    e.preventDefault();
    setExerciseList([...exerciseList, exercise]);
  }
  return (
    <>
      <Header />
      {postsState
        ? postsState.map((post) => {
            return (
              <div
                onClick={() => {
                  router.push(`/posts/${post._id}`);
                }}
                className="bg-red-300 h-8 w-15 p-2 m-2"
                key={post._id}
              >
                {post.title}
              </div>
            );
          })
        : null}
      <div>
        <form className="flex flex-col" onSubmit={handleFormSubmit}>
          <div className="flex flex-col">
            <label for="title">Title</label>
            <input
              className="w-1/4"
              id="title"
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <label for="content">Content</label>
            <textarea
              className="w-1/4"
              id="content"
              type="text"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label for="category">Category</label>
            <select
              id="category"
              className="w-1/4"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="" disabled selected>
                Select a category
              </option>
              <option value="Weight Training">Weight Training</option>
              <option value="Cardio">Cardio</option>
              <option value="Cardio">Sport</option>
            </select>
            <label for="duration">Duration min</label>
            <input
              value={duration}
              className="w-1/4"
              id="duration"
              type="number"
              min="1"
              onChange={(e) => setDuration(e.target.value)}
            />
            <div>
              <label for="exercise">Exercise</label>
              <input
                type="text"
                onChange={(e) =>
                  setExercise({ ...exercise, name: e.target.value })
                }
              />
              <input
                type="number"
                onChange={(e) =>
                  setExercise({ ...exercise, sets: e.target.value })
                }
              />
              <input
                type="number"
                onChange={(e) =>
                  setExercise({ ...exercise, reps: e.target.value })
                }
              />
              <input
                type="number"
                onChange={(e) =>
                  setExercise({ ...exercise, weight: e.target.value })
                }
              />
              <button onClick={handleAddExercise}>add exercise</button>
            </div>
          </div>
          {exerciseList
            ? exerciseList.map((exercise) => {
                return <div>{exercise.name}</div>;
              })
            : null}
          <button type="submit">add post</button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let res = await fetch("http://localhost:3000/api/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let posts = await res.json();

  return {
    props: { posts },
  };
}
