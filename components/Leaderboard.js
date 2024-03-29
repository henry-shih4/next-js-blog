import Image from "next/image";
import { useEffect } from "react";

export default function Leaderboard(props) {
  const { rankings } = props;

  return (
    <>
      <div className="h-[200px] w-[300px] bg-slate-300 flex flex-col justify-center items-center rounded-xl m-3">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex justify-center items-center w-full underline mb-2 space-x-2">
            <div>Leaderboard</div>
            <div>
              <Image
                height={24}
                width={24}
                alt="mountain-icon"
                className="h-[24px]"
                src="/images/mountain.svg"
              />
            </div>
          </div>
          <div className=" w-[200px] flex flex-col justify-center items-center">
            <div className="w-full flex">
              <div className="w-1/2 text-center">Username</div>
              <div className="w-1/2 text-center">Workouts</div>
            </div>
            {rankings
              ? rankings.slice(0, 5).map((person, index) => {
                  return (
                    <>
                      <div key={index} className="w-full flex">
                        <div className="w-1/2 text-center">{person[0]}</div>
                        <div className="w-1/2 text-center">{person[1]}</div>
                      </div>
                    </>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
