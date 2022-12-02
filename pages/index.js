import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div>Welcome to my ExerciseBlog app</div>
      <div>
        <Link href="/posts">Go to application</Link>
      </div>
    </div>
  );
}
