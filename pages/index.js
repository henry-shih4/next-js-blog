import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
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
