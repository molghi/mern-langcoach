import ViewAllEntry from "./ViewAllEntry";
import { getUserEntries } from "../utils/dbFunctions";
import { useEffect, useContext } from "react";
import { Context } from "../context/MyContext";

function ViewAll() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage.");
  const { entries, setEntries } = ctx;

  useEffect(() => {
    getUserEntries(setEntries);
  }, []);

  return (
    <>
      <div className="px-6 text-[antiquewhite] font-mono container max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-center text-center my-10 font-bold text-3xl">Your Words</h2>

        {/* Flexbox with two nav elements */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="text-sm">Entries: {entries.length}</div>
          <div className="text-sm">Filter Element</div>
        </div>

        {/* Container with word elements */}
        <div className="flex flex-col gap-8">
          {entries && entries.length > 0 ? (
            entries.map((el) => <ViewAllEntry key={el._id} data={el} />)
          ) : (
            <div>Your entries will be here.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewAll;
