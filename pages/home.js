import { useEffect, useState } from "react";

export default function home({ posts }) {
  const [postsState, setPostsState] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  async function handleFormSubmit(e) {
    e.preventDefault();

    const data = {
      title: title,
      content: content,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/add-post";

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
    console.log(result);

    setPostsState([...postsState, result]);
    setTitle("");
    setContent("");
  }

  return (
    <>
      <div>hello world</div>
      {postsState
        ? postsState.map((post) => {
            return <div key={post._id}>{post.title}</div>;
          })
        : null}
      <div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label for="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label for="content">Content</label>
            <textarea
              id="content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button>add post</button>
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
