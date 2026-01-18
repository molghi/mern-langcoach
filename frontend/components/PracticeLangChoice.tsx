import Button from "./Button";
import { languages } from "../context/MyContext";
import useMyContext from "../hooks/useMyContext";
import { fetchPracticeRounds } from "../utils/entryDbFunctions";
import { useEffect, useState } from "react";

interface Props {
  addedLangs: string[];
}

function PracticeLangChoice({ addedLangs }: Props) {
  const { chosenPracticeLanguage, setChosenPracticeLanguage, currentPractice, setCurrentPractice, setIsLoading } =
    useMyContext();

  const [error, setError] = useState<string>(""); // error or info message to show in UI

  useEffect(() => {
    setChosenPracticeLanguage(""); // reset value of chosen lang
  }, []);

  const fetchPractice = async () => {
    setError("");
    setIsLoading(true);
    await fetchPracticeRounds(chosenPracticeLanguage, setCurrentPractice);
    setIsLoading(false);
    // if nothing was fetched, all words were practiced
    if (currentPractice.length === 0)
      setError("All words in this language have been practiced. Wait for the next revision or add new words.");
  };

  // ============================================================================

  return (
    <>
      <div className="max-w-4xl mx-auto p-2 sm:p-6 text-[antiquewhite]">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-14 text-center">
          <span className="bg-black/50 rounded-[5px] px-4 py-1.5 text-green-500">
            {addedLangs && addedLangs.length > 0 ? "Choose Language" : "You haven't added any words yet."}
          </span>
        </h2>

        {/* Conditionally render choices and action btn */}
        {addedLangs && addedLangs.length > 0 && (
          <>
            {/* Grid of added langs */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16`}>
              {addedLangs.map((x, i) => (
                <Button
                  key={i}
                  title={x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()}
                  onClick={() => setChosenPracticeLanguage(x)}
                  className={`bg-black/50 hover:text-black hover:bg-[antiquewhite] active:opacity-50 ${
                    chosenPracticeLanguage === x ? "text-black bg-[antiquewhite]" : ""
                  }`}
                  style={{ fontSize: "20px", padding: "15px 20px", lineHeight: "1.75rem" }}
                >
                  {languages.find((j) => j.key === x)!["name"]}
                </Button>
              ))}
            </div>

            <div className="text-right flex gap-6 items-center justify-end flex-wrap sm:flex-nowrap">
              {/* Short conditional info msg */}
              {chosenPracticeLanguage === "" && (
                <span className="bg-black/50 rounded-[5px] px-4 py-1.5 text-sm sm:text-md">
                  Please select a language to proceed
                </span>
              )}

              {/* Btn */}
              <Button
                onClick={fetchPractice}
                className={`hover:text-black hover:bg-[antiquewhite] active:opacity-50 ${
                  chosenPracticeLanguage === "" ? "pointer-events-none opacity-50 bg-[#555] italic" : "bg-black/50"
                }`}
                style={{ fontSize: "20px", padding: "15px 20px" }}
              >
                Begin
              </Button>
            </div>

            {/* Output possible errors/info msgs */}
            {error && (
              <div className="mt-10 text-[coral] bg-black/60 rounded-[5px] px-4 py-1.5 text-green-500">
                <span className="font-bold opacity-60">Message:</span> {error}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default PracticeLangChoice;
