import { useContext } from "react";
import { Context, entriesPerPage } from "../context/MyContext";
import Button from "./Button";

function Pagination() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useContext used outside ContextProvider");
  const { currentPage, setCurrentPage, allEntriesCount } = ctx;

  const totalPages: number = Math.ceil(allEntriesCount / entriesPerPage);

  const handlePagination = (flag: string): void => {
    if (flag === "back") {
      setCurrentPage((prev) => prev - 1);
    }
    if (flag === "next") {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container font-mono max-w-4xl mx-auto flex items-center justify-between gap-4 mt-14 px-6 text-[antiquewhite]">
      <Button
        onClick={() => handlePagination("back")}
        className={`active:opacity-50 hover:bg-[antiquewhite] hover:text-[black] ${
          currentPage === 1 && "opacity-50 pointer-events-none"
        }`}
      >
        Back
      </Button>

      <span className="px-2 py-1 opacity-50 transition duration-300 hover:opacity-100 text-sm">Page {currentPage}</span>

      <Button
        onClick={() => handlePagination("next")}
        className={`active:opacity-50 hover:bg-[antiquewhite] hover:text-[black] ${
          currentPage === totalPages && "opacity-50 pointer-events-none"
        }`}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
