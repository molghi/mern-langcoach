import { useContext } from "react";
import { Context } from "../context/MyContext";

function Pagination() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useContext used outside ContextProvider");
  const { currentPage } = ctx;

  const handlePagination = (flag: string) => {
    if (flag === "back") {
      console.log("go back, current page is", currentPage);
    }
    if (flag === "next") {
      console.log("go next, current page is", currentPage);
    }
  };

  return (
    <div className="container font-mono max-w-4xl mx-auto flex items-center justify-between gap-4 mt-14 px-6 text-[antiquewhite]">
      <button
        onClick={() => handlePagination("back")}
        className="px-4 py-2 text-sm font-semibold rounded-md transition duration-300 hover:text-black hover:bg-[antiquewhite] border border-gray-600 tracking-wide active:opacity-50"
      >
        Back
      </button>

      <span className="px-2 py-1">Page 1</span>

      <button
        onClick={() => handlePagination("next")}
        className="px-4 py-2 text-sm font-semibold rounded-md transition duration-300 hover:text-black hover:bg-[antiquewhite] border border-gray-600 tracking-wide active:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
