import { useEffect } from "react";

export default function Leaderboard(props) {
  const { rankings } = props;

  return (
    <>
      <div className="h-[500px] w-[300px] bg-slate-300 flex flex-col justify-start items-center">
        <div classname="flex justify-center items-start">
          <div>Leaderboard</div>
          <div className="bg-red-300 w-[200px] flex flex-col justify-center items-center">
            <div className="w-full flex">
              <div className="w-1/2">name</div>
              <div className="w-1/2 bg-blue-300">workouts</div>
            </div>
            {rankings
              ? rankings.map((person) => {
                  return (
                    <>
                      <div className="w-full flex">
                        <div className="w-1/2">{person[0]}</div>
                        <div className="w-1/2 bg-blue-300">{person[1]}</div>
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
