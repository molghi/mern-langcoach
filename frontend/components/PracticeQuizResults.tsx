import useMyContext from "../hooks/useMyContext";
import ViewAllEntry from "./ViewAllEntry";
import Button from "./Button";
import { useState } from "react";
import { saveQuizResults } from "../utils/entryDbFunctions";

function PracticeQuizResults() {
  const {
    quizAnswers,
    currentPractice,
    setCurrentPractice,
    setIsLoading,
    setFlashMsgContent,
    setCurrentPracticeCounter,
  } = useMyContext();

  const [ratings, setRatings] = useState<any[]>([]); // arr of arrs: every inner arr is [currentWord, itsCurrentRating]

  // ============================================================================

  // upon clicking Submit Results:
  const rememberResults = async () => {
    setIsLoading(true);
    const updateSuccessful = await saveQuizResults(currentPractice, ratings); // do the db update; returns boolean
    setIsLoading(false);
    if (updateSuccessful) {
      setFlashMsgContent(["success", "Quiz results saved!"]);
    } else {
      setFlashMsgContent(["error", "Error saving results."]);
    }
    setCurrentPractice([]); // reset practice material -> changing it redirects to Practice Lang Choice screen
    setCurrentPracticeCounter(0); // reset quiz counter
  };

  // ============================================================================

  return (
    <div className="flex flex-col gap-10 w-full text-[antiquewhite] text-center">
      {/* Title */}
      <h1 className="flex flex-col gap-2 max-w-2xl mx-auto">
        <span className="text-2xl font-bold">Assess your knowledge</span>{" "}
        <span className="text-sm italic transition duration-200 opacity-60 hover:opacity-100">
          This is required for the spaced repetition system, which shows you the most relevant entries to practice and
          helps you progress efficiently.
        </span>
      </h1>

      {/* Quiz rounds & user's answers */}
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-8 mb-8">
        {currentPractice.map((el, i) => (
          <div key={i} className="relative">
            <div
              className="absolute top-0 sm:top-auto sm:bottom-[0] lg:top-1/2 lg:bottom-auto right-[15px] lg:right-auto lg:left-[-70px] lg:-translate-y-1/2 text-[60px] font-bold text-[gray] opacity-50"
              title={`Round ${i + 1}`}
            >
              {i + 1}
            </div>
            <ViewAllEntry
              data={el}
              mode="quiz_round"
              answer={quizAnswers[i]}
              setRatings={setRatings}
              ratings={ratings}
            />
          </div>
        ))}
      </div>

      {/* Action button */}
      <div className="text-right flex gap-6 md:mr-10 items-center justify-end flex-wrap sm:flex-nowrap">
        {/* Info msg */}
        {ratings.length < currentPractice.length && (
          <span className="bg-black/50 rounded-[5px] px-4 py-1.5 text-sm sm:text-md">
            Please rate each round to continue
          </span>
        )}

        <Button
          onClick={rememberResults}
          style={{ padding: "15px 20px", fontSize: "20px" }}
          className={`bg-black/50 hover:bg-[antiquewhite] hover:text-black ${
            ratings.length < currentPractice.length ? "pointer-events-none opacity-50 bg-[#555] italic" : ""
          }`}
        >
          Submit Results
        </Button>
      </div>
    </div>
  );
}

export default PracticeQuizResults;
