import { useRouter } from "next/router";

export default function post({ post }) {
  const router = useRouter();
  const { id } = router.query;

  async function handlePostDelete() {
    console.log(id);
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
      {post ? (
        <>
          <div>{post.title}</div>
          <div>{post.content}</div>
          <div>{post.category}</div>
          <div>{post.duration} min</div>
          <div>
            {post.exercises
              ? post.exercises.map((exercise, index) => {
                  return (
                    <div>
                      <div className="border border-black w-[200px]">
                        <div>Exercise {index + 1}</div>
                        <div>{exercise.name}</div>
                        {exercise.weight ? (
                          <div>{exercise.weight} lbs</div>
                        ) : null}
                        {exercise.sets ? <div>{exercise.sets} sets</div> : null}
                        {exercise.reps ? <div>{exercise.reps} reps</div> : null}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </>
      ) : null}
      <button className="p-4" onClick={handlePostDelete}>
        delete
      </button>
      <button
        className="p-4"
        onClick={() => {
          router.push("/posts");
        }}
      >
        back to home
      </button>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  let res = await fetch(`http://localhost:3000/api/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let post = await res.json();

  return {
    props: { post },
  };
}
