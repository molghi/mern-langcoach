import { useState, useEffect, useContext } from "react";
import { Context } from "../context/MyContext";
import { availableBGs } from "../context/MyContext";
import { localStorageBgKey } from "../context/MyContext";

function Footer() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage");
  const { setBgImg } = ctx; // pull from context

  const [selectChoice, setSelectChoice] = useState<string>(
    localStorage.getItem(localStorageBgKey) ?? Object.entries(availableBGs)[0][1]
  );

  useEffect(() => {
    setBgImg(selectChoice); // set src on img
    localStorage.setItem(localStorageBgKey, selectChoice); // remember/persist

    const fromLS = localStorage.getItem(localStorageBgKey);
    if (fromLS) {
      setBgImg(fromLS); // set src on img
    }
  }, [selectChoice]);

  return (
    <footer className="font-mono bg-black/50">
      <div className="container max-w-4xl mx-auto w-full text-[antiquewhite] text-sm text-center py-4 flex items-center justify-between">
        {/* Change BG element */}
        <select
          title="Select Background GIF"
          value={selectChoice}
          onChange={(e) => setSelectChoice(e.target.value)}
          className="bg-black/50 font-inherit bg-inherit px-2 py-1 cursor-pointer border border-[antiquewhite] rounded-md transition duration-200 focus:shadow-[0_0_15px_antiquewhite] text-[antiquewhite] opacity-50 hover:opacity-100 text-[12px]"
        >
          <option disabled>Select Background GIF</option>
          {/* Populate with options */}
          {Object.entries(availableBGs).map((entryArr, i) => (
            <option key={i} value={entryArr[1]}>
              {entryArr[0]}
            </option>
          ))}
        </select>

        {/* Copy */}
        <span className="transition duration-200 opacity-30 hover:opacity-100">© Jan 2026 LangCoach</span>
      </div>
    </footer>
  );
}

export default Footer;
