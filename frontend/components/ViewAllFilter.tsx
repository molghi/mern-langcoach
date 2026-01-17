import { useEffect } from "react";
import { languages } from "../context/MyContext";
import { getUserEntries } from "../utils/entryDbFunctions";
import useMyContext from "../hooks/useMyContext";

interface Props {
  filterOption: string;
  setFilterOption: React.Dispatch<React.SetStateAction<string>>;
}

function ViewAllFilter({ filterOption, setFilterOption }: Props) {
  const {
    entries,
    setEntries,
    languagesAdded,
    whenAdded,
    categoriesAdded,
    setWhenAdded,
    setLanguagesAdded,
    setCategoriesAdded,
    setAllEntriesCount,
    setIsLoading,
    setEntriesMatchingQueryCount,
    currentPage,
    setUserEmail,
  } = useMyContext(); // pull from context

  useEffect(() => {
    // to populate filter select with dates
    if (entries.length > 1) {
      let dates = entries.map((el: any) => {
        const dateYear = new Date(el.createdAt).getFullYear();
        const dateMonth = (new Date(el.createdAt).getMonth() + 1).toString().padStart(2, "0");
        return `${dateYear}-${dateMonth}`; // compose period
      });
      dates = [...new Set(dates)]; // remove duplicates
      setWhenAdded(dates);
    }
  }, []);

  useEffect(() => {
    // react to using filter:
    // compose parameter to properly identificate request
    let parameter = "";
    if (languages.map((x) => x.key).includes(filterOption)) {
      parameter = `language_${filterOption}`;
    } else if (filterOption.startsWith("202")) {
      parameter = `period_${filterOption}`;
    } else {
      parameter = `category_${filterOption}`;
    }
    // fetch entries & update state
    const fetchAndFilter = async () => {
      try {
        setIsLoading(true);
        // setCurrentPage(1);
        const response = await getUserEntries(
          setEntries,
          setLanguagesAdded,
          setCategoriesAdded,
          setAllEntriesCount,
          setEntriesMatchingQueryCount,
          setUserEmail,
          parameter,
          currentPage
          // filterOption === "show_all" ? currentPage : 1
        );
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAndFilter();
  }, [filterOption, currentPage]);

  // ============================================================================

  return (
    <div className="flex gap-4 items-center text-sm">
      <span className="font-bold opacity-50">Filter:</span>
      <select
        name="filter-select"
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
        className="bg-black/50 w-full font-inherit px-2 py-2 cursor-pointer border border-[antiquewhite] rounded-md transition duration-500 focus:shadow-[0_0_15px_antiquewhite] text-[antiquewhite] hover:shadow-[0_0_7px_antiquewhite]"
      >
        {/* <option disabled>Filter</option> */}
        <option value="category_show_all">Show All Entries</option>

        {/* Render added languages as options */}
        {languagesAdded.length > 0 &&
          languagesAdded.map((x, i) => (
            <option key={i} value={x} title={x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()}>
              Language: {languages.length > 1 && languages.find((el) => el.key === x)!["name"]}
            </option>
          ))}

        {/* Render added categories as options */}
        {categoriesAdded.length > 0 &&
          categoriesAdded.map((x, i) => (
            <option key={i} value={x}>
              Category: {x}
            </option>
          ))}

        {/* Render periods when words were added as options */}
        {whenAdded.length > 0 &&
          whenAdded.map((x, i) => (
            <option key={i} value={x}>
              Added in: {x}
            </option>
          ))}
      </select>
    </div>
  );
}

export default ViewAllFilter;
