import { useEffect, useState } from "react";
import useMyContext from "../hooks/useMyContext";
import { getAddedLangs } from "../utils/dbFunctions";
import PracticeLangChoice from "./PracticeLangChoice";
import LoadingSpinner from "./LoadingSpinner";
import PracticeQuiz from "./PracticeQuiz";
import { languages } from "../context/MyContext";

function Practice() {
  const { isLoading, setIsLoading, currentPractice } = useMyContext();

  const [addedLangs, setAddedLangs] = useState<string[]>([]);

  useEffect(() => {
    const getLangs = async () => {
      setIsLoading(true);
      await getAddedLangs(setAddedLangs);
      setIsLoading(false);
    };
    getLangs();
  }, []);

  return (
    <div className="px-6 text-white font-mono container max-w-5xl mx-auto">
      {/* Title */}
      <h2 className="text-center text-[antiquewhite] text-center my-10 font-bold text-2xl [@media(min-width:540px)]:text-3xl">
        <span className="bg-black/50 rounded-[5px] px-4 py-1.5">
          Practice{" "}
          {currentPractice && currentPractice.length > 0 && (
            <>
              :{" "}
              <span
                title={
                  currentPractice[0].language.slice(0, 1).toUpperCase() +
                  currentPractice[0].language.slice(1).toLowerCase()
                }
              >{`${languages.find((x) => x.key === currentPractice[0].language)!.name.split(" ")[0]}`}</span>
            </>
          )}
        </span>
      </h2>

      {/* Show loading spinner on fetching data */}
      {isLoading && <LoadingSpinner />}

      {/* CONTENT */}

      {/* Show lang select screen if there is no current practice */}
      {currentPractice && currentPractice.length === 0 && <PracticeLangChoice addedLangs={addedLangs} />}

      {/* Show quiz if there is current practice */}
      {currentPractice && currentPractice.length > 0 && <PracticeQuiz />}
    </div>
  );
}

export default Practice;
