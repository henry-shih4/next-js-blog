import Loading from "../components/Loading";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div>Welcome to my ExerciseBlog app</div>
      <Loading />
    </div>
  );
}
