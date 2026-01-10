import ViewAllEntry from "./ViewAllEntry";
import ViewAllFilter from "./ViewAllFilter";
import { getUserEntries } from "../utils/dbFunctions";
import { useEffect, useContext } from "react";
import { Context } from "../context/MyContext";
import LoadingSpinner from "./LoadingSpinner";

function ViewAll() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage.");
  const {
    entries,
    setEntries,
    isLoading,
    setIsLoading,
    setLanguagesAdded,
    setCategoriesAdded,
    allEntriesCount,
    setAllEntriesCount,
  } = ctx;

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await getUserEntries(setEntries, setLanguagesAdded, setCategoriesAdded, setAllEntriesCount);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <>
      <div className="px-6 text-[antiquewhite] font-mono container max-w-4xl mx-auto relative">
        {/* Title */}
        <h2 className="text-center text-center my-10 font-bold text-3xl">
          <span className="bg-black/50 rounded-[5px] px-4 py-1.5">Your Words</span>
        </h2>

        {/* Flexbox with two nav elements */}
        <div className="flex justify-between items-center gap-4 mb-10">
          {/* How many entries */}
          <div className="text-sm">
            <span className="font-bold opacity-50">Entries:</span> {entries.length} / {allEntriesCount}
          </div>

          {/* Select filter */}
          <ViewAllFilter />
        </div>

        {/* Show loading spinner if fetching */}
        {isLoading && <LoadingSpinner />}

        {/* Container with word elements */}
        <div className="flex flex-col gap-8">
          {entries && entries.length > 0 ? (
            entries.map((el) => <ViewAllEntry key={el._id} data={el} />)
          ) : (
            <div className="text-center italic">Your entries will be here.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewAll;
