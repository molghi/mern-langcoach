import ViewAllEntry from "./ViewAllEntry";
import ViewAllFilter from "./ViewAllFilter";
import { getUserEntries } from "../utils/dbFunctions";
import { useEffect, useContext, useState } from "react";
import { Context } from "../context/MyContext";

function ViewAll() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage.");
  const { entries, setEntries } = ctx;

  const [languagesAdded, setLanguagesAdded] = useState<string[]>([]); // arr of added langs
  const [whenAdded, setWhenAdded] = useState<string[]>([]); // arr of yyyy-mm periods
  const [categoriesAdded, setCategoriesAdded] = useState<string[]>([]); // arr of added categories

  useEffect(() => {
    getUserEntries(setEntries, setLanguagesAdded, setCategoriesAdded);
  }, []);

  return (
    <>
      <div className="px-6 text-[antiquewhite] font-mono container max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-center text-center my-10 font-bold text-3xl">Your Words</h2>

        {/* Flexbox with two nav elements */}
        <div className="flex justify-between items-center gap-4 mb-6">
          {/* How many entries */}
          <div className="text-sm">Entries: {entries.length}</div>

          {/* Select filter */}
          <ViewAllFilter
            languagesAdded={languagesAdded}
            whenAdded={whenAdded}
            categoriesAdded={categoriesAdded}
            setWhenAdded={setWhenAdded}
            setLanguagesAdded={setLanguagesAdded}
            setCategoriesAdded={setCategoriesAdded}
          />
        </div>

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
