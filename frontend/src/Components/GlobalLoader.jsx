import React from "react";
import  {useFetchData}  from "../contexts/data/useFetchData";

const GlobalLoader = () => {
  const { dataLoading } = useFetchData();

  if (!dataLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoader;