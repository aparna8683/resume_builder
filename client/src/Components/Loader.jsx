import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">Loading resume...</p>
    </div>
  );
};

export default Loader;
