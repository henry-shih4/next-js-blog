import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <>
      <header className="p-2 flex justify-between items-center">
        <div>ExerciseBlog</div>
        <div className="flex">
          <MagnifyingGlassIcon className="h-6 m-1" />
          <input type="text" className="border border-gray-300" />
        </div>
        <div>icons</div>
      </header>
    </>
  );
}
