import ViewAllEntry from "./ViewAllEntry";
import ViewAllFilter from "./ViewAllFilter";
import { getUserEntries } from "../utils/dbFunctions";
import { useEffect, useState } from "react";
import { entriesPerPage } from "../context/MyContext";
import LoadingSpinner from "./LoadingSpinner";
import useMyContext from "../hooks/useMyContext";

function ViewAll() {
  const {
    entries,
    setEntries,
    isLoading,
    setIsLoading,
    setLanguagesAdded,
    setCategoriesAdded,
    allEntriesCount,
    setAllEntriesCount,
    currentPage,
    setEntriesMatchingQueryCount,
    entriesMatchingQueryCount,
  } = useMyContext(); // pull from context

  const [filterOption, setFilterOption] = useState<string>("show_all"); // selected option in filter select

  useEffect(() => {
    // fetch entries upon init mount and curPage change
    const fetch = async () => {
      setIsLoading(true);
      await getUserEntries(
        setEntries,
        setLanguagesAdded,
        setCategoriesAdded,
        setAllEntriesCount,
        setEntriesMatchingQueryCount,
        filterOption,
        currentPage
      );
      setIsLoading(false);
    };
    fetch();
  }, [currentPage]);

  const isShowingFilteredResults: boolean = Boolean(entriesMatchingQueryCount); // either showing filtered or unfiltered results

  const countAll: number = isShowingFilteredResults ? entriesMatchingQueryCount : allEntriesCount;
  const countShownOnes: number = entriesPerPage * (currentPage - 1) + entries.length;

  return (
    <>
      <div className="px-3 sm:px-6 text-[antiquewhite] font-mono container max-w-4xl mx-auto relative">
        {/* Title */}
        <h2 className="text-center text-center my-10 font-bold text-2xl [@media(min-width:540px)]:text-3xl">
          <span className="bg-black/50 rounded-[5px] px-4 py-1.5">Your Words</span>
        </h2>

        {/* Flexbox with two nav elements */}
        <div className="flex justify-between sm:items-center gap-4 mb-10 flex-col [@media(min-width:650px)]:flex-row">
          {/* How many entries */}
          <div className="text-sm">
            <span className="font-bold opacity-50">Entries:</span> {`${countShownOnes} / ${countAll}`}
          </div>

          {/* Select filter */}
          <ViewAllFilter filterOption={filterOption} setFilterOption={setFilterOption} />
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
