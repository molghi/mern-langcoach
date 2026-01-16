import ViewAllEntry from "./ViewAllEntry";
import ViewAllFilter from "./ViewAllFilter";
import { getUserEntries } from "../utils/entryDbFunctions";
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
    setUserEmail,
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
        setUserEmail,
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
            <div className="max-w-2xl mx-auto bg-black/60 rounded-[5px] py-5 px-6">
              <div className="font-bold mb-3">No words as of now. You can:</div>
              <ul className="list-disc list-inside space-y-1 text-left italic">
                <li className="transition duration-200 opacity-70 hover:opacity-100">Add new words or phrases</li>
                <li className="transition duration-200 opacity-70 hover:opacity-100">
                  View and manage all entries in one place
                </li>
                <li className="transition duration-200 opacity-70 hover:opacity-100">
                  Practice by language using quiz mode with spaced repetition
                </li>
                <li className="transition duration-200 opacity-70 hover:opacity-100">Import and export your data</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewAll;
