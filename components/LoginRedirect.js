import Link from "next/link";

export default function LoginRedirect() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-[320px] h-[200px] bg-slate-300 flex justify-center items-center flex-col">
          <div>Please log in to view this page</div>
          <Link
            className="bg-black text-white rounded-md p-2 mt-4 w-[100px] text-center"
            href="/login"
          >
            Login here
          </Link>
        </div>
      </div>
    </>
  );
}
