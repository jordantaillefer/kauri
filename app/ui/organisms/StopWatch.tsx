import { FunctionComponent } from "react";

export const StopWatch: FunctionComponent = () => {
  return (
    <div
      className="bg-gray-200 border-8 border-gray-600 m-4 p-2 rounded-full h-72 w-72 flex items-center justify-center shadow-lg">
      <h1 className="text-5xl text-gray-800">01: 14: 23</h1>
    </div>
  );
};
